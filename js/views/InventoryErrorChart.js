define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/InventoryErrorChart.html', 'models/InventoryErrorCollection', 'models/InventoryErrorChart', 'views/SlickGrid', 'jqp','jqpall'], 
function($, Backbone, E, Handlebars, template, Collection,Model,SlickGrid){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'InventoryErrorChart',
        model: Model,
       collection: Collection,
        plot: null,
        template: template,
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','renderCollection');
            this.collection = new this.collection()
            this.listenTo(this.collection,'reset',this.renderCollection)
            
        
            
            //this.collection.fetch();
        },
        events: {
           "click #button1": "loadReport",
           "change #grouping":"loadReport"
        },
        
        plotChart: function(){
           
            //E.loading(this.$el,that.collection.fetch,this.collection);
            $.jqplot.config.enablePlugins = true;
            if (this.plot)
                this.plot.destroy();
            
                
            var data = this.collection.dataRenderer()  
        
            this.plot = $.jqplot("chart", data.data, {
                title: "Item Verification Results",
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
                axesDefaults: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                },
                legend: {
                    show: true,
                    renderer: $.jqplot.EnhancedLegendRenderer,
                    placement: "outsideGrid",
                    labels: data.labels,
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
                        renderer:$.jqplot.DateAxisRenderer,          
                        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                        tickOptions: {
                            showGridline: false,
                            formatString:'%b %#d, %Y',
                            angle: -30 
                        }
                    },
                    yaxis: {
                        label: 'Daily Error Count',
                        
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
                    yvalues: 1,
                    formatString:'<table class="jqplot-highlighter"><tr><td>date:</td><td>%s</td></tr><tr><td>Count:</td><td>%s </td></tr></table>',
                    useAxesFormatters: true
               },
               cursor: {
                 show: true,
                 zoom: true
               }
            });
            
            this.$('#plot').off('jqplotDataClick');
            this.$('#plot').on('jqplotDataClick',this.renderProcessRecord);             
                
            
        },
       
       render: function() {
            var that = this;
            var obj = {};
            
            var temp = this.template(obj);
            
            
            this.$el.html( temp );
            this.$('.dPicker').datepicker({
                numberOfMonths:3
            });
            this.$('button').button();
            
            return this
        },
        renderCollection: function() {
            var that = this;
            that.$("#reportwindow").html("")
            this.collection.each(function(model) {
                that.$("#reportwindow").append('<div>'+ model.get('DateEntered') +' : '  + model.get('ErrorType') + ': ' + model.get('DailyErrorCount')+' </div>')
                
            })
            this.plotChart()
        },
        loadReport: function(e){
            var startDate = this.$("#startDate").val();
            var endDate = this.$("#endDate").val();
            var grouping = this.$("#grouping").val()
            this.collection.updateSql(grouping)
            this.collection.sqlArgs= [startDate,endDate]
           this.collection.fetch({reset: true}); 
        }
        
       
         
    });
	
    // Returns the View class
    return View;
});