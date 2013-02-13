define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/OperatorTracking.html', 'models/operatorTracking', 'jqp','jqpall'], 
function($, Backbone, E, Handlebars, template, Collection){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'ReportApp ofh',
        attributes: {style:'border:3px solid black;'},
        model: Backbone.Model.extend({
            sql: "Execute spGetLists 'operatorQualifications'",
            store: new WebSQLStore(E.sqldb,'dbo.spGetDataForPeopleSoftEntry',false), }),
        collection: new Collection(),
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
            this.model.fetch();
            this.collection.fetch();
        },
        loadData: function(){
           
            //E.loading(this.$el,that.collection.fetch,this.collection);
            $.jqplot.config.enablePlugins = true;
            var attrs = this.model.toJSON()
            if (this.plot)
                this.plot.destroy();
            //no data check
            if (this.collection.length==0){
                alert('No data found for this Qualification\nPlease contact James Gibson if this seems like an error')
                return false;
            }  
              
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

        },
        render: function() {
            var that = this;
            
            var temp = this.template({});
            
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
                that.loadData()
            }
            this.$( "#iqualification" ).autocomplete({
                source: qualificationList,
                autoFocus: true,
                minLength: 0,
                delay: 0,
                select: function( event, ui ) {
                    that.$( "#iqualification" ).val( ui.item.label );                    
                    that.$('#atq_id').html( ui.item.id );
                    that.$('#scell').html( ui.item.cell );
                    that.$('#sAssociate').html( ui.item.label.split('-')[0] );
                    if(removeIfInvalid( ui.item.label,qualificationList)) {
                        success(ui.item.id )
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
        change: function(){
            
            var newvalue = this.$el.find('.pid').val();
            this.model.set({pid: newvalue})
        },
        runEntry: function(){
            this.model.set('data',[1,2,3,4,5,6,7,8,9,10])          
        }
         
    });
	
    // Returns the View class
    return View;
});