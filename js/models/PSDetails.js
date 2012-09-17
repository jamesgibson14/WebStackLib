define([
  'jquery',
  'underscore',
  'backbone',
  'models/PSDetail'
], function($, _, Backbone, Model){
    var collection = Backbone.Collection.extend({
        // Reference to this collection's model.
        model: Model,
        filters: {},
        sql: 'Execute dbo.spGetDataForPeopleSoftEntry',
        modelsToSave: [],
        sqlToExecute: null,
        store: new WebSQLStore(new E.ADODB(),'dbo.spGetDataForPeopleSoftEntry',false),
        sqldb: new E.ADODB({type: 'sqlserver'}),
        accessdb: new E.ADODB({type: 'access'}),
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
            params = [],
            success = function(sql){return;},error = function(sql){alert('error on: ' + sql);};

            this.db.transaction(function(db) {
                return db.executeSql(sql, params, success, error);
            });  
        }    

    });
    
    // Returns the Model class
    return collection;

});