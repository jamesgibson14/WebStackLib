define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({

            defaults: {
	            username: 'tempuser'
            },

            // Model Constructor
            initialize: function() {
                var dt = new Date().format("isoDateTime");
                var details = this.toJSON();
                
                details = JSON.stringify(details)
                this.sql = "Execute spGetUserInfoWeb @username = '" + this.get("username") + "', @now = '" + dt + "', @details = '" + details + "'";
                this.store =  new WebSQLStore(E.sqlProd2,'todos',false,false);
            },
            sql: '',
            store: null           

    });
    // Returns the Model class
    return Model;

});