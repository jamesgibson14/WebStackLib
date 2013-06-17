define([
  'jquery',
  'underscore',
  'backbone',
  'models/PSDetail',
  'text!templates/PrepareDataForPeopleSoftEntry.sql'
], function($, _, Backbone, Model,SQL){
    var collection = Backbone.Collection.extend({
        // Reference to this collection's model.
        model: Model,
        filters: {},
        sql: SQL,
        modelsToSave: [],
        sqlToExecute: null,
        store: new WebSQLStore(E.sqlProd2,'dbo.spGetDataForPeopleSoftEntry',false),
        sqldb: E.sqlProd2,
        accessdb: E.accessdb,
        save: function(){
            if(modelsToSave.length>0){
                _.each(modelsToSave, function(modelid){
                    getByCid(modelid).save()
                })
            }
            else if(sqlToExecute){
                
            }
        },
        applyFilters: function(){
            
        },
        syncServer: function(){
            var sql = "UPDATE dbo_ProductionDataDetails INNER JOIN tblData2 ON dbo_ProductionDataDetails.RecordID = tblData2.RecordID SET dbo_ProductionDataDetails.PSoft = [tblData2].[PSoft] WHERE (((([dbo_ProductionDataDetails].[PSoft]))<>([tblData2].[PSoft])));",
            success = function(sql){return;},error = function(sql){alert('error on: ' + sql);};

            this.db.executeSql(sql, success, error);
        }    

    });
    
    // Returns the Model class
    return collection;

});