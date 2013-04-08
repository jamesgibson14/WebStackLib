define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/CorpPiecesPerHour.html', 'models/CorpPIDShiftCollection', 'models/CorpPiecesPerHour', 'views/SlickGrid', 'jqp','jqpall'], 
function($, Backbone, E, Handlebars, template, Collection,Model,SlickGrid){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'CorpPiecesPerHour ofh',
        model: Model,
        collection: new Collection(),
        plot: null,
        template: template,
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','loadData','renderProcessRecord', 'renderRawData');
            this.model = new this.model()
            this.model.fetch();
            this.model.on('change:plotData', this.loadData);
            this.SlickGrid = new SlickGrid()
            
            //this.collection.fetch();
        },
        loadData: function(){
           var that = this;
            //E.loading(this.$el,that.collection.fetch,this.collection);
            $.jqplot.config.enablePlugins = true;
            
            if (this.plot)
                this.plot.destroy();
            this.SlickGrid.$el.html('<h2><span>No Data Selected</span><h2>')
            this.$('#atq_id').html( this.model.get('machineCodes').join(', ') );  

            var data = this.model.get('plotData'); 
            var labels = this.model.get('labels'); 
            var series = this.model.get('series');
            
            this.plot = $.jqplot("plot", data, {
                title: "Machine Comparison",
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
                    showMarker:true             
                },
                series: series,
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
                    background: "#dddddd"
                },
                highlighter: {
                    show: true,
                    showMarker:true,
                    showTooltip:true,
                    sizeAdjust: 10,
                    tooltipLocation: 'se',
                    tooltipAxes: 'xy',
                    yvalues: 1,
                    formatString:'<p>date: %s</p><p>PiecesPerHour: %s</p>',
                    useAxesFormatters: true
               },
               cursor: {
                 show: true,
                 showTooltip:false,
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
            this.$('#plot').on('jqplotDataClick',this.renderRawData);   
            
        },
        render: function() {
            var that = this;
            var obj = this.model.toJSON();
            
            var temp = this.template(obj);
            
            this.$el.html( temp );
            this.$('.dPicker').datepicker({numberOfMonths: 3});
            this.$('#startDate').on('change', function(e){
                that.model.set('startDate', this.value);
            })
            this.$('#endDate').on('change', function(e){
                that.model.set('endDate' ,this.value);
            })
            this.$('#machineGroups').on('change',function(e){
                if (!this.value)
                    return false;
                if(that.$('#imachine').val()!=''){
                    that.$('#imachine').val('')
                    that.model.attributes.level = 'Branch';
                }
                that.$('#rbranch').prop('disabled', false);
                that.$('#rmachine').prop('disabled', false);
                that.model.set('machineCodes',that.model.get('machineTypes')[this.value].machines);
            });
            function split( val ) {      return val.split( /,\s*/ );    }    
            function extractLast( term ) {      return split( term ).pop();    }
            
            var machines = this.model.get('Machines');

            this.$( "#imachine" )
            // don't navigate away from the field on tab when selecting an item      
            .bind( "keydown", function( event ) {        
                if ( event.keyCode === $.ui.keyCode.TAB && $( this ).data( "ui-autocomplete" ).menu.active ) {          
                    event.preventDefault();        
                }      
            })
            .autocomplete({
                source: function( request, response ) {          
                    // delegate back to autocomplete, but extract the last term          
                    response( $.ui.autocomplete.filter(machines, extractLast( request.term ) ) );        
                },
                autoFocus: true,
                minLength: 0,
                delay: 0,
                focus: function() {          
                    // prevent value inserted on focus          
                    return false;        
                },        
                select: function( event, ui ) {          
                    var terms = split( this.value );          
                    // remove the current input          
                    terms.pop();          
                    // add the selected item          
                    terms.push( ui.item.code ); 
                            
                    // add placeholder to get the comma-and-space at the end          
                    terms.push( "" );
                    that.model.attributes.level = 'Machine';
                    that.$('#rmachine, #rbranch').prop('disabled', true);
                    that.model.set('machineCodes', terms.slice(0,-1));          
                    this.value = terms.join( ", " );
                    
                          
                    return false;        
                }
            })
            .tooltip({                            
                position: { 
                    my: 'bottom',                               
                    at: "right+25 top-5"                           
                },                            
                tooltipClass: "ui-state-highlight absolute z2k"                        
            });
            this.$("#imachine").on('click',function(e){
                //that.$( "#imachine" ).autocomplete( "search", "" );
            })
            this.$('input[type=radio]').click(function(e){   
                that.model.set($(this).attr("name"), $(this).val())
            })
            this.$('#resizable').resizable({delay:20,minHeight: 326,minWidth: 400});
            //this.$('input, textarea').placeholder();
            return this;
        },
        postRender: function(){
            //this.collection.sqlArgs = [this.model.get('startDate'),this.model.get('endDate')];
            //this.collection.fetch({noJSON:true})
            E.hideLoading();
        },
        renderPlot: function(){
            //Instead of destroying plot just reload data, lables and then re-plot 
            //no data check
            this.collection.sql = this.model.get('sqlPerLevel')[this.model.get('groupBy') + this.model.get('level')]  
            this.collection.sqlArgs = [this.model.get('machineCodes'), this.model.get('startDate'),this.model.get('endDate')];
            this.collection.fetch({noJSON:true})
            
            //var data = this.collection.data({MachineCode: 3191, MachineCode: 5147})
            E.loading(this.$el, this.loadData,this)
            this.$('#atq_id').html( this.model.get('machineCodes').join(', ') );
            
            E.hideLoading();
        },
        renderRawData: function(ev, seriesIndex, pointIndex, data){
            //Instead of destroying plot just reload data, lables and then re-plot
            var that = this;
            var html;
            var dt = new Date(data[0]).format("mm/dd/yyyy")
            var wDate ='';
            if (this.model.get('groupBy')=='month')
                wDate = "StartDate >'" + dt + "' AND StartDate <= DATEADD(month,1,'" + dt + "')";
            else
                wDate = "StartDate = '" + dt + "'";
                
            
            var labels = this.model.get('labels')
            var wLevel = '';
            if (this.model.get('level')=='Branch')
                wLevel = "Unit = '" + labels[seriesIndex] + "'"
            else
                wLevel = "MachineCode = '" + labels[seriesIndex].slice(labels[seriesIndex].indexOf('_')+1) + "' ";
                
  
            
            var options = {
                sql: "SELECT PiecesPerHr = ROUND(CompletedQty / NULLIF(RunHrs + DowntimeHrs,0),0), Unit, PID, Item, OpSeq, PIDRun, MachineCode = cast(MachineCode as int), StartDate, Shift, AssociateCode, SetupHrs = ROUND(SetupHrs,2), RunHrs = ROUND(RunHrs,2), DowntimeHrs, CompletedQty, ScrapQty FROM PeopleSoftData WHERE " + wDate + " AND " + wLevel + " ORDER By Item"
            };
            html = this.SlickGrid.render(options).el
            this.$('#processRecord').html(html)
            setTimeout(function(){
                
                that.SlickGrid.postRender();
            },1)
            
        },
        test: function(){
            alert('testing')
        }
         
    });
	
    // Returns the View class
    return View;
});