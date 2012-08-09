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
        db: new E.ADODB({type: 'access'}),
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
            var sql = "",
            params = [temp,this.get('pid'),this.get('opseq'),this.get('Paper_ID')],
            success = function(sql){alert('sucess Psoft updated: ' + sql);},error = function(sql){alert('error on: ' + sql);};
            if (this.get('Paper_ID')) 
                sql += 'AND Paper_ID = %s;';
            this.db.transaction(function(db) {
                return db.executeSql(sql, params, success, error);
            });  
        }    

    });
    
    // Returns the Model class
    return collection;

});