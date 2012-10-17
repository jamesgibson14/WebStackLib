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
        store: new WebSQLStore(new E.ADODB(),'dbo.spGetDataForPeopleSoftEntry',false),
        sqldb: new E.ADODB({type: 'sqlserver'}),
        accessdb: new E.ADODB({type: 'access'}),
        applyFilters: function(){
            
        }    

    });
    
    // Returns the Model class
    return collection;

});