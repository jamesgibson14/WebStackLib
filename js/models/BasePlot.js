define(['jquery', 'backbone','engine', 'models/BasePlotCollection'], function($, Backbone,E, Collection) {

    var Model = Backbone.Model.extend({
        collection: new Collection(),
        defaults: {                
            startDate: '03/01/2012',
            endDate: new Date().format('mm/dd/yyyy'),
            machineCodes: [],
            machineGroup: '',
            groupBy: 'month',
            level: 'Branch',
            branches: {
                CED:{
                   name:'Cedar City',
                   colors:['#0467d5', '#0000ff', '#10a7ef', '#06e0f9', '#1be4d0', '#88ccff'],
                   markerOptions: {
                       style: 'filledDiamond'
                   } 
                },
                HAS: {
                    name: 'Hastings',
                    colors:['#ff2233','#bd322b', '#ff0000', '#ff7171', '#f54784'],
                   markerOptions: {
                       style: 'filledSquare'
                   } 
                },
                LOG: {
                    name: 'Logan',
                    colors:['rgb(96,74,123)', '#8000ff', '#b871ff', '#e48bd2'],
                   markerOptions: {
                       style: 'x'
                   } 
                },
                LOC: {
                    name: 'Locust Grove',
                    colors:['rgb(119,147,60)','#004000', '#008000', '#00ff00', '#80ff00'],
                   markerOptions: {
                       style: 'plus'
                   } 
                },
                REY: {
                    name: 'Reynosa',
                    colors:['yellow','#fbc404', '#ffff00', '#e9ee11', '#ffff80'],
                   markerOptions: {
                       style: 'filledCircle'
                   } 
                },
                MCG: {
                    name: "McGregor",
                    colors:['black']
                },
                MLN: {
                    name: "MLN",
                    colors:['black']
                }
            },
            machineTypes: [
                {name:'Hanging File', machines:[564,3700,4878,4186,1089,4408,4686,1064,3059,4704,4879]},
                {name:'Single Top 3 Up', machines:[3191,3570,3557,4706,2115,4957,4655,4705,207,2133,4956,4930,3193]},
                {name:'Pressboard Die Cutter', machines:[5147,2061,4900,5071,4348]},
                {name:'Auto Classification', machines:[4077,9141,4078,3702,5161,4916,4112,4111]},
                {name:'Auto B Fastener', machines:[698,631,8643,8649,4243,4619,8143,4242,8637,8655]},
                {name:'PSB Fast Auto/Manual K/B', machines:[49,2105,2105,4618,521,3806,4129,4637,9312,90,719,4141,4240,3810,171,214]},
                {name:'Single Top Single Lane', machines:[519,3555,3521,95,3993,4847,3823,4621,3724]},
                {name:'Colly Collator', machines:[5992,4834,5993,4835,6293]},
                {name:'Flat Jacket', machines:[4677,3007,3620]},
                {name:'Reinforced Side Tab', machines:[3729,631,698,3816,67,1028,3196,3815,3817]},
                {name:'Auto K Fastener', machines: [4270,4271,4283,4552,4562,4577,3144,1040,4553,4391,4459,2071,3000,3143,1094,4350,4392,4497,4601]},
                {name:'Expanding Jacket', machines: [4291,4006,8175,3708]},
                {name:'Laminator', machines: [1077,4909]},
                {name:'Simeone Taping', machines: [9343,8704,1085,6032,1061,9342]},
                {name:'Pressboard Auto/Manual B/K Fasteners', machines: [49,3757,2105,2106,4240,4618,521,3806,4129,4637,9312,90,719,4141,4240,3810,171,214]},
                {name:'Reinforced Top Tap', machines: [443,3818,3819,474,639,515,3820,2102,3821,3822]},
                {name:'Plastic Tab', machines: [3456,2045,4033,4963,5019,4137,4065,4099,4614,4711,4780,5028,424,4009,4770,5008]},
                {name:'3 Up RTT/ST', machines: [4226,4398,4264,3506,4344]}
            ],
            plotData: [],
            //animate: true,
            seriesDefaults:{                    
                pointLabels: { 
                    show: true 
                },
                trendline: {
                    show: false,
                    type: 'linear'
                },
                isDragable:false,
                showMarker:true,
                markerOptions: {
                    style:'diamond'
                }             
            },
            series: [],
            axesDefaults: {
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                pad: 1.2
            },
            legend: {
                show: true,
                renderer: $.jqplot.EnhancedLegendRenderer,
                placement: "outsideGrid",
                labels: null,
                location: "ne",
                rowSpacing: "0px",
                rendererOptions: {
                    // set to true to replot when toggling series on/off
                    // set to an options object to pass in replot options.
                    seriesToggle: 'normal',
                    seriesToggleReplot: {resetAxes: false}
                }
            },
            axes: {
                xaxis: {
                    label: 'Timeline',
                    renderer:$.jqplot.DateAxisRenderer,          
                    tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                    numberTicks: 15,
                    max: null,
                    tickOptions: {
                        showGridline: false,
                        formatString:'%b %#d, %Y',
                        angle: -30 
                    },
                    padMax: 500
                },
                yaxis: {
                    label: 'Folders Per Hour',
                    tickOptions: {
                        suffix: ''
                    },
                    padMin: 1
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
                formatString:'<div class="boxpad border"><p>date: %s</p><p>PiecesPerHour: %s</p><div>',
                useAxesFormatters: true,
                tooltipContentEditor: function(str, seriesIndex, pointIndex, plot){
                    var data = plot.series[seriesIndex].data[pointIndex];
                    var format = [];
                    if (plot.options.groupBy === 'month')
                        format[0] = new Date(data[0] + 1000*60*60*24).format('mmmm yyyy');
                    else
                        format[0] = new Date(data[0] ).format('mmmm dd, yyyy');
                    format[1] = new Number(data[1]).toFixed(1);
                    var label = plot.legend.labels[seriesIndex].indexOf('Target'); 
                    str = '<table class="jqplot-highlighter"><tr><td>date:</td><td>%s</td></tr><tr><td>PiecesPerHour:</td><td align="right">%s</td></tr></table>';
                    str = $.jqplot.sprintf.apply($.jqplot.sprintf, [str].concat(format));
                    return str;
                }
           },
           cursor: {
             show: true,
             showTooltip:false,
             zoom: true
           }
        },
        autoPlot: true,
        // Model Constructor
        initialize: function() {
            this.on('change:machineCodes change:startDate change:endDate change:level change:groupBy', this.renderPlot)
        },
        renderPlot: function(e){
            if (!this.autoPlot) return;
            
            //Instead of destroying plot just reload data, lables and then re-plot 
            //no data check
            var machines = this.get('machineCodes');
            if (machines.length ==0)
                return alert("Please select a machine");
            this.collection.sql = this.get('sqlPerLevel')[this.get('groupBy') + this.get('level')];
            this.collection.sqlArgs = [machines, this.get('startDate'),this.get('endDate')];
            this.collection.fetch({noJSON:true});
            //this.collection.dataRenderer(this);
            this.dataRenderer();                   
        },
        dataRenderer: function(){
            var that = this;
            var labels = [];
            var series = [];
            var obj = {};
            var data = [];
            var getLabel = function(m){
                if(that.get('level')=='Branch')
                    return m.get('Unit');
                else
                    return m.get('Unit') + "_" + m.get('MachineCode');
            };
            this.collection.map(function(mod){
                var label = getLabel(mod);
                if (labels.indexOf(label) > -1){
                    obj[label].push([new Date(mod.get('DateCompleted')),mod.get(that.get('y1'))]);
                }
                else{
                    labels.push(label);
                    obj[label] = [[new Date(mod.get('DateCompleted')),mod.get(that.get('y1'))]]
                }                           
            });
            var group = {};
            var c = 0;
            $.each( obj, function(i, array) {
                data.push(array);
                var gKey = i.slice(0,3);
                
                if(!group[gKey]) 
                    group[gKey]=0;

                series.push({color: that.get('branches')[gKey].colors[group[gKey]],markerOptions: that.get('branches')[gKey].markerOptions})
                //alert(series[c].color)
                group[gKey] += 1;
                c++;
            })
            this.get('legend').labels = labels;
            this.set('series', series);
            this.set('plotData', data);
        }
    });

    // Returns the Model class
    return Model;

});