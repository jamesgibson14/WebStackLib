define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({

            defaults: {
                pid: 'NULL',
                opseq: null,
                machine: null,
                shift: 'NULL',
                scrap: null,
                endscrap: null,
                qtycompleted: null,
                setuptime: null,
                runtime: null,
                downtime: null,
                operator: 0 + "NULL",
                date: 'null',
                componentcode: "null",
                flag: false,
                flagreason:''
            },
            db: new E.MSSQLDB({type: 'access'}),
            initialize: function(){
                //console.log('this model has been initialized');
                this.on("change", function(){
                    //alert('module changed');
                });
            },
            toggleflag: function(reason) {
                
                var temp = !this.get("flag")
                if(temp){
                    reason = this.get("flagreason") + reason;
                    var sql = "UPDATE qryData_NewRecord SET qryData_NewRecord.Flagged = %s, qryData_NewRecord.txtFlagReason = '%s' WHERE qryData_NewRecord.PID='%s' AND qryData_NewRecord.OpSeq=%s;",
                    params = [temp,reason,this.get('pid'),this.get('opseq')],
                    success = function(sql){alert('sucess: ' + sql);},error = function(sql){alert('error on: ' + sql);};
                    debugger;
                    this.db.transaction(function(db) {
                        return db.executeSql(sql, params, success, error);
                    });
                }
                this.set({flag: temp, flagreason: reason});
            }
    });

    // Returns the Model class
    return Model;

});