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
            },
            closeSession: function(){
                var dt = new Date().format("isoDateTime");
                this.sql = "UPDATE User_Sessions SET RenewedAt= '" + dt + "' WHERE ID= " + this.get("Session_ID")
                this.update();
            }           

    });
    // Returns the Model class
    return Model;

});