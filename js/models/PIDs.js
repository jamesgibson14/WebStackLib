define([
  'jquery',
  'underscore',
  'backbone',
  'models/PID'
], function($, _, Backbone, Model){
    var collection = Backbone.Collection.extend({
        // Reference to this collection's model.
        model: Model,
        filters: {},
        sql: 'Execute dbo.spDataIntegrity',
        modelsToSave: [],
        sqlToExecute: null,
        store: new WebSQLStore(E.sqlProd2,'dbo.spGetDataForPeopleSoftEntry',false),
        sqldb: E.sqlProd2,
        accessdb: E.accessdb,
        applyFilters: function(){
            
        }    

    });
    
    // Returns the Model class
    return collection;

});