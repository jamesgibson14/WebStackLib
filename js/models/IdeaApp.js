define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({
            sql: 'Execute dbo.spGetIdeaAppModel',
            store: new WebSQLStore(new E.ADODB(),'dbo.spGetIdeaAppModel',false),
            defaults: {
	            content: "You are now using Backbone, Lodash, Require, Modernizr, and jQuery! (Click Me)"
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