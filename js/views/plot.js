define(['jquery', 'backbone', 'engine', 'handlebars', 'models/plot', 'text!templates/plot.html', 'models/operatorTracking', 'jqp','jqpall'], 
function($, Backbone, E, Handlebars, Model, template, opTrack){

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
            _.bindAll(this, 'render','change');
            
        },
        loadData: function(){
            var that = this;
            //E.loading(this.$el,that.collection.fetch,this.collection);
            $.jqplot.config.enablePlugins = true;
            var attrs = this.model.toJSON()
            var plot1 = $.jqplot('plot4', attrs.data, $.extend(true, {}, attrs.theme, attrs.plotOptions));
            this.model.on('change:data',function(){
                plot1.replot({clear:true,data:[this.get('data')]});
            });
            this.$('#resizable').bind('resize', function(event, ui) {plot4.replot( { resetAxes: true } );});
            
            

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
                    $('#info1b').html('series: ' + seriesIndex + ', point: ' + pointIndex + ', data: ' + data);        
            }); 
            
            var jsonurl = "js/lib/jqplot/examples/KCPsample4.csv";
            this.optrack = new opTrack()
            this.optrack.fetch();
            var coll = this.optrack.dataRenderer();
            var data = coll.data; //infos[0];
            var labels = coll.labels; //infos[1]; ['3700_Target','2_two','3_three','4_four'] //
            //var ticks = infos[2];
            var plot4 = $.jqplot("plot", data, {
                title: "John Doe's Performance",
                //animate: true,
                seriesDefaults:{                    
                    pointLabels: { 
                        show: false
                    },
                    trendline: {
                        show: true,
                        type: 'linear'
                    },
                    isDragable:false             
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
                            formatString:'%b %#d, %#I %p',
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
                    sizeAdjust: 10,
                    tooltipLocation: 'n',
                    tooltipAxes: 'y',
                    tooltipFormatString: '<b><i><span style="color:red;">hello</span></i></b> %.3f %s %s',
                    useAxesFormatters: false,
                    yvalues: 5,          
                    formatString:'<table class="jqplot-highlighter"> \          <tr><td>date:</td><td>%s</td></tr> \          <tr><td>open:</td><td>%s</td></tr> \          <tr><td>hi:</td><td>%s</td></tr> \          <tr><td>low:</td><td>%s</td></tr> \          <tr><td>close:</td><td>%s</td></tr> \          <tr><td>letter:</td><td>%s</td></tr></table>'
               },
               cursor: {
                 show: true,
                 zoom: true,
                 draggable: false
               }
            });
            
            var ajaxDataRenderer = function(url, plot, options) {
                var ret = null;
                $.ajax({
                  // have to use synchronous here, else the function 
                  // will return before the data is fetched
                  async: false,
                  url: url,
                  dataType:"json",
                  success: function(data) {
                    ret = data;
                    //alert("data" + data)
                  }
                });
                return ret;
            };
            
            // The url for our json data
            var jsonurl = "js/lib/jqplot/examples/jsondata2.txt";
        
            // passing in the url string as the jqPlot data argument is a handy
            // shortcut for our renderer.  You could also have used the
            // "dataRendererOptions" option to pass in the url.
            var line1=[['2008-06-30 8:00AM',4], ['2008-7-14 8:00AM',6.5], ['2008-7-28 8:00AM',5.7], ['2008-8-11 8:00AM',9], ['2008-8-25 8:00AM',8.2]];
            var plot5 = $.jqplot('plot5', jsonurl,{
                title: "AJAX JSON Data Renderer Dates",
                dataRenderer: ajaxDataRenderer,
                dataRendererOptions: {
                  unusedOptionalUrl: jsonurl
                },
                axes:{        
                    xaxis:{            
                        renderer:$.jqplot.DateAxisRenderer,                     
                        tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                        tickOptions: {
                            showGridline: false,
                            formatString:'%b %#d, %#I %p',
                            angle: -30 
                        }       
                    }    
                },
                highlighter: {
                    sizeAdjust: 10,
                    tooltipLocation: 'n',
                    tooltipAxes: 'y',
                    tooltipFormatString: '<div class="fixed z2k"><b><i><span style="color:red;">hello</span></i></b> %.2f</div>',
                    useAxesFormatters: false
               },
               cursor: {
                 show: true
               }
            });
            
            
            //this.addImageBtns();
               
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
        },
        addImageBtns: function(){
            if(!$.jqplot.use_excanvas){
                $("div.jqplot-target").each(function(){
                    var d=$(document.createElement("div"));
                    var g=$(document.createElement("div"));
                    var f=$(document.createElement("div"));
                    d.append(g);d.append(f);
                    d.addClass("jqplot-image-container");
                    g.addClass("jqplot-image-container-header");
                    f.addClass("jqplot-image-container-content");
                    g.html("Right Click to Save Image As...");
                    var e=$(document.createElement("a"));
                    e.addClass("jqplot-image-container-close");
                    e.html("Close");e.attr("href","#");
                    e.click(function(){
                        $(this).parents("div.jqplot-image-container").hide(500)
                   });
                    g.append(e);$(this).after(d);
                    d.hide();
                    d=g=f=e=null;
                    if(!$.jqplot._noToImageButton){
                        var c=$(document.createElement("button"));
                        c.text("View Plot Image");
                        c.addClass("jqplot-image-button");
                        c.bind("click",{chart:$(this)},function(h){
                            var j=h.data.chart.jqplotToImageElem();
                            var i=$(this).nextAll("div.jqplot-image-container").first();
                            i.children("div.jqplot-image-container-content").empty();
                            i.children("div.jqplot-image-container-content").append(j);
                            i.show(500);i=null}
                         );
                         $(this).after(c);
                         c.after("<br />");
                         c=null
                    }
                })
            }
        },
        parseCSVFile: function(url) {
            var ret = null;
            var labels = [];
            var ticks = [];
            var values = [];
            var temp;
            $.ajax({
                // have to use synchronous here, else returns before data is fetched
                async: false,
                url: url,
                dataType:"text",
                success: function(data) {
                    // parse csv data
                    var lines = data.split('\n');
                    var line;
                    for (var i=0, l=lines.length; i<l; i++) {
                        line = lines[i].replace('\r', '').split(',');
                        // console.log(line);
                        if (line.length > 1) {
                            if (i === 0) {
                              ticks = line.slice(1, line.length);
                            }
                            else {
                              labels.push(line[0]);
                              values.push(line.slice(1, line.length));
                              temp = values[values.length-1];
                              for (n in temp) {
                                values[values.length-1][n] = parseFloat(temp[n]);
                              }
                            } 
                        }
                    }
                    ret = [values, labels, ticks];
                }
            });
            return ret;
        }
         
    });
	
    // Returns the View class
    return View;
});