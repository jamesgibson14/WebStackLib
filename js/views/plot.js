define(['jquery', 'backbone', 'engine', 'handlebars', 'models/plot', 'text!templates/plot.html', 'jqp','jqpall'], 
function($, Backbone, E, Handlebars, Model, template){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'ReportApp ofh',
        attributes: {style:'border:3px solid black;'},
        model: new Model(),
        filteredModels: [],
        filters: false,
        template: template,
        events: {
            'blur .pid':'change',
            'click #btnTest': 'loadData',
            'click #btnRun': 'runEntry',
            'click .filter': 'filter'        
        },
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','change','enterPeopleSoftScript','tester','filter');
        },
        loadData: function(){
            var that = this;
            //E.loading(this.$el,that.collection.fetch,this.collection);
            
            var attrs = this.model.toJSON()
            var plot1 = $.jqplot('plot', attrs.data, $.extend(true, {}, attrs.theme, attrs.plotOptions));
            this.model.on('change:data',function(){
                plot1.replot({clear:true,data:[this.get('data')]});
            });
            this.$('#resizable').bind('resize', function(event, ui) {plot1.replot( { resetAxes: true } );});
            
            var s1 = [2, -6, 7, -5];        
            var ticks = ['a', 'b', 'c', 'd'];
            plot2 = $.jqplot('plot2', [s1], {            
                seriesDefaults:{                
                    renderer:$.jqplot.BarRenderer,                
                    rendererOptions: { 
                        fillToZero: true 
                    },                    
                    pointLabels: { 
                        show: true 
                    }            
                },            
                axes: {                
                    // yaxis: { autoscale: true },                
                    xaxis: {                    
                        renderer: $.jqplot.CategoryAxisRenderer,                    
                        ticks: ticks                
                    }            
                }        
            });
            
            var l2 = [11, 9, 5, 12, 14];    
            var l3 = [4, 8, 5, 3, 6];    
            var l4 = [12, 6, 13, 11, 2]; 
            //plot2.on('click',function(e){alert('clicked')});
         
                        
            var plot3 = this.$('#plot3').jqplot([l2, l3, l4],{       
                stackSeries: true,       
                showMarker: false,       
                seriesDefaults: {           
                    fill: true       
                },       
                axes: {           
                    xaxis: {               
                        renderer: $.jqplot.CategoryAxisRenderer,               
                        ticks: ["Mon", "Tue", "Wed", "Thr", "Fri"]           
                    }       
                }    
            });
            this.$('#plot3').bind('jqplotDataUnhighlight',         
                function (ev) {
                    //alert("this worked: unhighlight")            
                    $('#info1b').html('Nothing');        
            }); 
            this.$('#plot3').bind('jqplotDataHighlight',         
                function (ev, seriesIndex, pointIndex, data) { 
                    //alert('highlight');           
                    $('#info1b').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);        
            }); 
                
            //setTimeout(function(){ 
                //alert('timeout')
                //$('#plot3').on('click',function(e){alert('clicked')})       
            
            //},3)
            //this.collection.fetch();
        },
        // Re-render the contents of the todo item.
        render: function() {
            var that = this;
            
            var temp = this.template({});
            
            this.$el.html( temp );
            this.$('#slider').slider({
                range: true,
                min: this.model.get('datemin'),
                max: this.model.get('datemax'),
                values: [this.model.get('datemin')+15, this.model.get('datemax')-20],
                slide: function(event, ui) {
                    //alert(ui.values);
                    that.$('#dtFrom').html(new Date(ui.values[0],1).format("yyyy"));
                    that.$('#dtTo').html(new Date(ui.values[1],1).format("yyyy"));
                }
            });
            this.$('#resizable').resizable({delay:20,minHeight: 326,minWidth: 400});
                      
            
            
            
            return this;
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