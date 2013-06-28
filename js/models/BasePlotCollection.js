define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var collection = Backbone.Collection.extend({
        model: Backbone.Model,
            
        sql: "",
        sqlArgs: [],
        store: new WebSQLStore(E.sqlTest2,'dbo.spGetDataForPeopleSoftEntry',false)
    });

    return collection;

});