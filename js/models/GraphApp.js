define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({

            defaults: {
	            content: "Graph Testing",
	            data: [[1,5],[2,4],[3,2],[4,15],[5,1],[6,3],[7,9]],
	            datemin: 2011,
	            datemax: 2050
            },

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