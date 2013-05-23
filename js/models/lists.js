define(['jquery', 'backbone','engine','BaseCollection'], function($, Backbone,E, BaseCollection) {

    var Model = Backbone.Model.extend({

            defaults: {
	            associates: new BaseCollection(),
	            users: new BaseCollection(),
	            items: new BaseCollection(),
	            
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