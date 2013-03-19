define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/CorpPiecesPerHour.html', 'models/CorpPIDShiftCollection', 'views/ProcessRecord', 'jqp','jqpall'], 
function($, Backbone, E, Handlebars, template, Collection,ProcessRecord){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'CorpPiecesPerHour ofh',
        attributes: {style:'border:none;'},
        model: Backbone.Model.extend({
            sql: "SELECT Machines = '[' + STUFF((select ', {\"code\": \"' + MachineCode + '\",\"label\": \"' + MachineCode + '\"}' from PeopleSoftData WHERE MachineCode <> '' GROUP BY MachineCode ORDER BY MachineCode for xml PATH('')),1,2,'') + ']'",
            store: new WebSQLStore(E.sqlTest2,'dbo.spGetDataForPeopleSoftEntry',false), }),
        modelStageTotals: Backbone.Model.extend({
            sql: "SELECT m.Code, m.Cell_ID, m.WorkCenter_ID, m.Stage5Target, m.Inactive, qa.Stage1Minutes, qa.Stage2Minutes, qa.Stage3Minutes, qa.Stage4Minutes, qa.Stage5Minutes, atq.CurrentStage,(SELECT MAX(ReviewDate) AS MaxOfReviewDate FROM dbo.MachineOperatorReviews mor WHERE (mor.QualID=atq.ID)) AS LastReviewDate FROM AssociatesToQualifications atq INNER JOIN Qualifications AS q ON atq.Qualifications_ID = q.ID INNER JOIN QualificationsToMachines ON q.ID = QualificationsToMachines.Qualifications_ID INNER JOIN Machines AS m ON QualificationsToMachines.Machines_ID = m.ID INNER JOIN QualificationsAttributes qa ON q.ID = qa.Qualifications_ID WHERE atq.ID = %s",
            sqlArgs: [430],
            store: new WebSQLStore(E.sqlProd2,'dbo.spGetDataForPeopleSoftEntry',false), }),
        collection: new Collection(),
        associateToQualification_ID: 0,
        startDate: '01/01/2013',
        endDate:'3/19/2013',
        plot: null,
        template: template,
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','loadData','renderProcessRecord');
            this.model = new this.model()
            this.modelStageTotals = new this.modelStageTotals();
            this.model.fetch();
            this.ProcessRecordView = new ProcessRecord()
            //this.collection.fetch();
        },
        loadData: function(){
           
            //E.loading(this.$el,that.collection.fetch,this.collection);
            $.jqplot.config.enablePlugins = true;
            var attrs = this.model.toJSON()
            if (this.plot)
                this.plot.destroy();
            
              
            var coll = this.collection.dataRenderer();
            var data = coll.data; //infos[0];
            var labels = coll.labels; //infos[1]; ['3700_Target','2_two','3_three','4_four'] //
            //var ticks = infos[2];
            
            this.plot = $.jqplot("plot", data, {
                title: "Machine Comparison",
                //animate: true,
                seriesDefaults:{                    
                    pointLabels: { 
                        show: false 
                    },
                    trendline: {
                        show: true,
                        type: 'linear'
                    },
                    isDragable:false,
                    showMarker:true             
                },
                axesDefaults: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                },
                legend: {
                    show: true,
                    renderer: $.jqplot.EnhancedLegendRenderer,
                    placement: "outsideGrid",
                    labels: labels,
                    location: "ne",
                    rowSpacing: "0px",
                    rendererOptions: {
                        // set to true to replot when toggling series on/off
                        // set to an options object to pass in replot options.
                        seriesToggle: 'normal',
                        seriesToggleReplot: {resetAxes: true}
                    }
                },
                axes: {
                    xaxis: {
                        label: 'Timeline',
                        renderer:$.jqplot.DateAxisRenderer,          
                        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                        tickOptions: {
                            showGridline: false,
                            formatString:'%b %#d, %Y',
                            angle: -30 
                        }
                    },
                    yaxis: {
                        label: 'Folders Per Hour',
                        tickOptions: {
                            suffix: ''
                        },
                        padMin: 0
                    }
                },
                grid: {
                    drawBorder: false,
                    shadow: false,
                    // background: 'rgba(0,0,0,0)'  works to make transparent.
                    background: "white"
                },
                highlighter: {
                    show: true,
                    sizeAdjust: 10,
                    tooltipLocation: 'se',
                    tooltipAxes: 'xy',
                    yvalues: 2,
                    formatString:'<ul><li>date: %s</li><li>PiecesPerHour: %s</li><tr><td>PiecesPerAssignedHour: %s</li></ul>',
                    useAxesFormatters: true
               },
               cursor: {
                 show: true,
                 zoom: true
               }
            });
            var that = this;
            this.$('#resizable').off('resize')
            this.$('#resizable').on('resize', function(event, ui) {
                if (that.plot)
                    that.plot.replot( { resetAxes: true } );
            });
            this.$('#plot').off('jqplotDataUnhighlight');
            this.$('#plot').on('jqplotDataUnhighlight',         
                function (ev) {   
                    //alert('unhighlighted')          
                    that.$('#info1b').html('Nothing');        
            }); 
            this.$('#plot').off('jqplotDataHighlight');
            this.$('#plot').on('jqplotDataHighlight',         
                function (ev, seriesIndex, pointIndex, data) {             
                    alert('highlighted')
                    that.$('#info1b').html('series: ' + seriesIndex + ', point: ' + pointIndex + ', data: ' + data);        
            }); 
            this.$('#plot').off('jqplotDataClick');
            this.$('#plot').on('jqplotDataClick',this.renderProcessRecord);             
                
            this.modelStageTotals.sqlArgs = new Array(this.associateToQualification_ID);
            this.modelStageTotals.fetch()
            var cs = this.collection.getCurrentStage()
            var cd = new Date(this.modelStageTotals.get('LastReviewDate'))
            if (!cd) cd = "n/a"
            var cm = (this.collection.getStageMinutes(cd)/440).toFixed(2);
            var ns = this.nextStage(cs);
            if(ns==5)
                ns = 90 - cm;
            else {
                ns = this.modelStageTotals.get('Stage' + ns +  'Minutes');
                ns = ((ns / 440) - cm).toFixed(2);
            }
            this.$('#cS').html(cs)
            this.$('#cD').html(cd)
            this.$('#cM').html(cm)
            this.$('#nS').html(ns)
            

        },
        render: function() {
            var that = this;
            
            var temp = this.template({debug:true,startDate:this.startDate,endDate:this.endDate});
            
            this.$el.html( temp );
            this.$('.dPicker').datepicker({numberOfMonths: 3});
            this.$('#startDate').on('change', function(e){
                that.startDate = this.value;
                that.$('#graphbtn').toggleClass('ui-state-highlight ',500)
            })
            this.$('#endDate').on('change', function(e){
                that.endDate = this.value;
                that.$('#graphbtn').toggleClass('ui-state-highlight ',500)
            })
            this.$('#graphbtn').button().click(function(e){
                $(this).toggleClass('ui-state-highlight ',500)
                if(that.$('imachine').html() != 'n/a')
                    E.loading(that.$el, function() {success(that.associateToQualification_ID );},that)
            });
            var machines = this.model.get('Machines');
            var success = function(atq_id){
                that.collection.sqlArgs = [atq_id,that.startDate,that.endDate];
                that.collection.fetch();
                
                //no data check
                if (that.collection.length==0){
                    alert('No data found for this Qualification\nPlease contact James Gibson if this seems like an error')
                    E.hideLoading();
                    return false;
                }  
                that.loadData()
                E.hideLoading();
            }
            this.$( "#imachine" ).autocomplete({
                source: machines,
                autoFocus: true,
                minLength: 0,
                delay: 0,
                select: function( event, ui ) {
                    that.associateToQualification_ID = ui.item.code;                    
                    that.$('#atq_id').html( ui.item.code );                    
                    E.loading(that.$el, function() {success(ui.item.code );},that)
                    $(this).val('')                   
                    
                    return false;
                },
                change: function(e){
                    $(this).val('')
                    if(!E.clearInputForAutocomplete( that.$( "#imachine" ),machines))
                        that.$( "#imachine" ).autocomplete( "search", "" );
                }

                //add on select: set machine_ID, set cell
            })
            .tooltip({                            
                position: { 
                    my: 'bottom',                               
                    at: "right+25 top-5"                           
                },                            
                tooltipClass: "ui-state-highlight absolute z2k"                        
            });
            this.$("#imachine").on('click',function(e){
                $(this).val('')
                that.$( "#imachine" ).autocomplete( "search", "" );
            })
            
            this.$('#resizable').resizable({delay:20,minHeight: 326,minWidth: 400});
            //this.$('input, textarea').placeholder();
            return this;
        },
        renderPlot: function(){
            //Instead of destroying plot just reload data, lables and then re-plot  
        },
        renderTable: function(){
            //Instead of destroying plot just reload data, lables and then re-plot  
        },
        renderReviews: function(){
            //Show reviews for current selected operator  
        },
        renderProcessRecord: function(ev, seriesIndex, pointIndex, data){            
            var that = this;
            var html; 
            if(this.collection.labels[seriesIndex].indexOf('Actual')>-1) {
                var view = this.ProcessRecordView;
                this.$('#info1c').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+new Date(data[0]) + ', ' + data[1]+ ', pageX: '+ev.pageX+', pageY: '+ev.pageY);
                html = view.render(data[4]).el
            }
            else{
                html = '<div>This is the target line.</div>'
            }
            this.$('#processRecord').html(html)
        },
        nextStage: function(cs){
            if(cs == 1)
                cs = 2;
            if(cs == 2)
                cs = 3;
            if(cs == 3)
                cs = 4;
            if(cs == 4)
                cs = 5;
            if(cs == 5)
                cs = 5;
            return cs   
        }
         
    });
	
    // Returns the View class
    return View;
});