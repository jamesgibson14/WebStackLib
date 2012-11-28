define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({

            defaults: {
	            content: "Graph Testing",
	            data: [[11, 123, 1236, "Acura"], [45, 92, 1067, "Alfa Romeo"],     
	               [24, 104, 1176, "AM General"], [50, 23, 610, "Aston Martin Lagonda"],     
	               [18, 17, 539, "Audi"], [7, 89, 864, "BMW"], [2, 13, 1026, "Bugatti"]],
	            plotOptions: {
	                title: 'Bubble Chart with Gradient Fills',        
	                seriesDefaults:{            
	                    renderer: $.jqplot.BubbleRenderer,            
	                    rendererOptions: {                
	                        bubbleGradients: true            
	                    },            
	                    shadow: true        
	                }
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