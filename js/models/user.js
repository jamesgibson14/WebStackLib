define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({

            defaults: {
	            username: 'tempuser'
            },

            // Model Constructor
            initialize: function() {
                this.sql = "Execute spGetUserInfoWeb @username = '" + this.get("username") + "'";
                this.store =  new WebSQLStore(E.sqldb,'todos',false,false);
            },

            // Any time a model attribute is set, this method is called
            validate: function(attrs) {

            },
            sql: '',
            store: null           

    });
    // Returns the Model class
    return Model;

});