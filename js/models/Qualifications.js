define(['jquery', 'backbone','engine', 'models/CorpPIDShiftCollection'], function($, Backbone,E, collection) {

    var Model = Backbone.Model.extend({
        sql: "",
        store: new WebSQLStore(E.sqlTest2,'dbo.spGetDataForPeopleSoftEntry',false),
        collection: new collection(),
        defaults: {                
            
        },

        // Model Constructor
        initialize: function() {
              
        }
    });

    // Returns the Model class
    return Model;

});