define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({

            defaults: {
                isReady:false,
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
                flagreason:'',
                entered: false,
                dateentered: null
            },
            initialize: function(){
                //console.log('this model has been initialized');
                this.on("change:entered", this.markAsEntered);
                this.on("change:flag", this.toggleflag);
                var scrappercent = Math.round(this.get('scrap')/this.get('qtycompleted')*10000)/100;
                this.set({scrappercent: scrappercent});
            },
            toggleflag: function() {
                
                var temp = this.get("flag")
                if(temp){
                    var reason = this.get("flagreason");
                    var sql = "UPDATE qryData_NewRecord SET qryData_NewRecord.Flagged = %s, qryData_NewRecord.txtFlagReason = '%s' WHERE qryData_NewRecord.PID='%s' AND qryData_NewRecord.OpSeq=%s;",
                    params = [temp,reason,this.get('pid'),this.get('opseq')],
                    success = function(sql){alert('sucess: ' + sql);},error = function(sql){alert('error on: ' + sql);};
                    debugger;
                    //this.db.transaction(function(db) {
                        //return db.executeSql(sql, params, success, error);
                    //});
                }
            },
            markAsEntered: function(){
                var entered = this.get("entered");
                
                    
                var sql ='',sql2;
                if(this.get('recordtype')=='n'){
                    sql = "UPDATE dbo.ProductionDataDetails SET PSoft = %s, UserStampDate=GETDATE() WHERE PID='%s' AND OpSeq=%s";
                    sql2 = "UPDATE tblData2 SET PSoft = %s, UserStampDate=NOW() WHERE PID='%s' AND OpSeq=%s";
                }
                else {
                    sql = "UPDATE dbo.ProductionDataMultiprocessDetails SET chkPSoft = %s, dtLineEnteredOn=GETDATE() WHERE txtPID='%s' AND intOpSeq=%s"
                    sql2 = "UPDATE tblAutoKData2 SET chkPSoft = %s, dtLineEnteredOn=NOW() WHERE txtPID='%s' AND intOpSeq=%s";
                 }   
                var params = [entered  ? 1:0,this.get('pid'),this.get('opseq'),this.get('Paper_ID')],
                success = function(sql){return;},error = function(sql){alert('error on: ' + sql);};
                
                if (this.get('Paper_ID')) 
                    sql += 'AND Paper_ID = %s;';
                sql = vsprintf(sql,params);
                this.collection.sqldb.transaction(function(db) {
                    return db.executeSql(sql, success, error);
                });

                params.shift();
                params.shift();
                params.unshift(entered);
                sql2 = vsprintf(sql2,params);
                this.collection.accessdb.transaction(function(db) {
                    return db.executeSql(sql2, success, error);
                });
                
            }
    });

    // Returns the Model class
    return Model;

});