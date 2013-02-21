define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/OperatorTracking.html', 'models/operatorTracking', 'jqp','jqpall'], 
function($, Backbone, E, Handlebars, template, Collection){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'ReportApp ofh',
        attributes: {style:'border:none;'},
        model: Backbone.Model.extend({
            sql: "Execute spGetLists 'operatorQualifications'",
            store: new WebSQLStore(E.sqldb,'dbo.spGetDataForPeopleSoftEntry',false), }),
        modelStageTotals: Backbone.Model.extend({
            sql: "SELECT m.Code, m.Cell_ID, m.WorkCenter_ID, m.Stage5Target, m.Inactive, qa.Stage1Minutes, qa.Stage2Minutes, qa.Stage3Minutes, qa.Stage4Minutes, qa.Stage5Minutes, atq.CurrentStage,(SELECT CONVERT(varchar,MAX(ReviewDate),126) AS MaxOfReviewDate FROM dbo.MachineOperatorReviews mor WHERE (mor.QualID=atq.ID)) AS LastReviewDate FROM AssociatesToQualifications atq INNER JOIN Qualifications AS q ON atq.Qualifications_ID = q.ID INNER JOIN QualificationsToMachines ON q.ID = QualificationsToMachines.Qualifications_ID INNER JOIN Machines AS m ON QualificationsToMachines.Machines_ID = m.ID INNER JOIN QualificationsAttributes qa ON q.ID = qa.Qualifications_ID WHERE atq.ID = %s",
            sqlArgs: [430],
            store: new WebSQLStore(E.sqlProd2,'dbo.spGetDataForPeopleSoftEntry',false), }),
        collection: new Collection(),
        associateToQualification_ID: 0,
        filteredModels: [],
        filters: false,
        plot: null,
        template: template,
        events: {
            'blur .pid':'change',
            'click #btnTest': 'loadData',
            'click #btnRun': 'runEntry'        
        },
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','change','loadData');
            this.model = new this.model()
            this.modelStageTotals = new this.modelStageTotals();
            this.model.fetch();
            this.collection.fetch();
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
                title: "Machine Performance and Target",
                //animate: true,
                seriesDefaults:{                    
                    pointLabels: { 
                        show: false 
                    },
                    trendline: {
                        show: false,
                        type: 'linear'
                    },
                    isDragable:false,
                    showMarker:false             
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
                        label: 'Performance Timeline',
                        renderer:$.jqplot.DateAxisRenderer,          
                        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                        tickOptions: {
                            showGridline: false,
                            formatString:'%b %#d, %Y',
                            angle: -30 
                        }
                    },
                    yaxis: {
                        label: 'Actual & Target Percentage',
                        tickOptions: {
                            suffix: '%'
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
                    yvalues: 3,
                    formatString:'<table class="jqplot-highlighter"><tr><td>date:</td><td>%s</td></tr><tr><td>Percentage:</td><td>%s %</td></tr><tr><td>AssignedMinutes:</td><td>%s</td></tr><tr><td>Changeovers:</td><td>%s</td></tr></table>',
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
            this.$('#plot').on('jqplotDataClick',             
                function (ev, seriesIndex, pointIndex, data) {              
                    that.$('#info1c').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data+ ', pageX: '+ev.pageX+', pageY: '+ev.pageY);            
                }        
            );
            this.modelStageTotals.sqlArgs = new Array(this.associateToQualification_ID);
            this.modelStageTotals.fetch()
            var cs = this.collection.getCurrentStage()
            var cd = this.modelStageTotals.get('LastReviewDate') || "n/a"
            var cm = (this.collection.getStageMinutes(cd)/440).toFixed(2);
            var ns = this.nextStage(cs);
            if(ns==5)
                ns = 90 - cm;
            else {
                ns = this.modelStageTotals.get('Stage' + ns +  'Minutes');
                ns = ((ns / 440) - cm).toFixed(2);
            }
            this.$('#cS').html(cs)
            this.$('#cD').html(cd.slice(0,10))
            this.$('#cM').html(cm)
            this.$('#nS').html(ns)
            

        },
        render: function() {
            var that = this;
            
            var temp = this.template({debug:true});
            
            this.$el.html( temp );
            
            function removeIfInvalid(value, list) {               
                var valid = false;                    
                _.each(list, function(mod) {                      
                    if ( mod.label == value ) {                            
                        valid = true;                            
                        return false;                        
                    }                    
                });                    
                if ( !valid ) {                        
                    // remove invalid value, as it didn't match anything                        
                    $el                            
                    .val( "" )                            
                    .attr( "title", value + " didn't match any item" )                            
                    .tooltip( "open" )
                    .focus();                         
                    setTimeout(function() {                            
                        $el.tooltip( "close" ).attr( "title", "" );                        
                    }, 2500 );                                               
                    return false;                    
                }  
                return valid              
            }  
            var qualificationList = this.model.get('operatorQualifications');
            var success = function(atq_id){
                that.collection.sql = "EXECUTE dbo.spOperatorTracking @AssociateToQualification_ID = " + atq_id;
                that.collection.fetch();
                //no data check
                if (that.collection.length==0){
                    alert('No data found for this Qualification\nPlease contact James Gibson if this seems like an error')
                    return false;
                }  
                that.loadData()
                E.hideLoading();
            }
            this.$( "#iqualification" ).autocomplete({
                source: qualificationList,
                autoFocus: true,
                minLength: 0,
                delay: 0,
                select: function( event, ui ) {
                    that.$( "#iqualification" ).val( ui.item.label );
                    that.associateToQualification_ID = ui.item.id;                    
                    that.$('#atq_id').html( ui.item.id );
                    that.$('#qualName').html( ui.item.qualification );
                    that.$('#scell').html( ui.item.cell );
                    that.$('#sAssociate').html( ui.item.label.split('-')[0] );
                    if(removeIfInvalid( ui.item.label,qualificationList)) {
                        E.loading(that.$el, function() {success(ui.item.id );},that)
                    }
                    $(this).val('').blur();
                    return false;
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
            this.$("#iqualification").on('click',function(e){
                //$(this).val('')
                that.$( "#iqualification" ).autocomplete( "search", "" );
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
        change: function(){
            
            var newvalue = this.$el.find('.pid').val();
            this.model.set({pid: newvalue})
        },
        runEntry: function(){
            this.model.set('data',[1,2,3,4,5,6,7,8,9,10])          
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