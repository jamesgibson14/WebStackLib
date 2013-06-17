define(['jquery', 'backbone','engine','models/tasks'], function($, Backbone,E, collection) {

    var Model = Backbone.Model.extend({
        sql: "",
        store: new WebSQLStore(E.sqlTest2,'dbo.spGetDataForPeopleSoftEntry',false),
        tasks: new collection(),
        defaults: {                
            
        },

        // Model Constructor
        initialize: function() {
             
        }

    });

    // Returns the Model class
    return Model;

});