define(['jquery', 'backbone','engine'], function($, Backbone,E) {
    var currentTarget = [[9, 3.5], [15, 4.4], [22, 6.0], [38, 9.1], [51, 12.0], [62, 14.4]];  
    var nextTarget = [[9, 6], [15, 20], [22, 1.3], [38, 2], [51, 12.0], [62, 11]];   
    var actualPerformance = [[9, 1.7], [15, 4.4], [22, 2.5], [38, 9.1], [51, 16], [62, 29]];
    var bdat = [[[9, 2], [15, 3], [22, 1], [38, 7], [51, 12.0], [62, 20]],     
                [[9, 5], [15, 6], [22, 6.3], [38, 11], [51, 12.0], [62, 7]]];         
    var dat = [['7/1/2011', 10], ['7/2/2011', 11], ['7/3/2011', 10], ['7/4/2011', 15], ['7/5/2011', 13], ['7/6/2011', 15]];
    var myTheme = {  
        grid: {      
            drawBorder: false,      
            shadow: false,      
            background: 'rgba(255, 255, 255, 0.0)'  
        },  
        seriesDefaults: {    
            shadow: false,    
            showMarker: false  
        },  
        axes: {      
            xaxis: {          
                pad: 1.0,          
                tickOptions: {              
                    showGridline: false          
                }      
            },      
            yaxis: {          
                pad: 1.05      
            }  
        }
    };
    
    var Model = Backbone.Model.extend({
            
            defaults: {
	            content: "Graph Testing",
	            
	            data: [currentTarget],
	            plotOptions: {
	                theme: myTheme,
	                title: 'Chart Testing',
	                series:[           
	                {            
	                    renderOptions: {
                            bandData: bdat,               
                            smooth: true
                        }
	                           
	                }     
	                ]
	            },
	            title: 'Test Graph',
	            datemin: 2011,
	            datemax: 2050
            },
            sql: "Execute dbo.spGetOperatorPerformance @StartDate = N' & dtStart & ', @EndDate = N' & dtEnd & ',@type = 1, @associateID =  + operatorID",
            // Model Constructor
            initialize: function() {
               
            },

            // Any time a model attribute is set, this method is called
            validate: function(attrs) {

            }

    });

    // Returns the Model class
    return Model;

});