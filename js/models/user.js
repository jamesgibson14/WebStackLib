define(['jquery', 'backbone', 'engine', 'models/BaseADODBModel'], function($, Backbone,E, BaseADODBModel) {

    var Model = BaseADODBModel.extend({

            defaults: {
	            username: 'tempuser'
            },
            rootUrl: '/Users',
            // Model Constructor
            initialize: function() {
                var dt = new Date().format("isoDateTime");
                var details = this.toJSON();
                
                details = JSON.stringify(details)
                this.sql = "Execute spGetUserInfoWeb @username = '" + this.get("username") + "', @now = '" + dt + "', @details = '" + details + "'";
                this.db =  E.sqlProd2;
            }           

    });
    // Returns the Model class
    return Model;

});