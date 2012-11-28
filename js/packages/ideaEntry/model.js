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
                flagreason:'',
                entered: false,
                dateentered: null
            },
            db: new E.ADODB({type: 'access'}),
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
                var temp = this.get("entered");
                if(temp){
                    var sql ='';
                    if(this.get('recordtype')=='n')
                        sql = "UPDATE tblData2 SET PSoft = %s, UserStampDate=NOW() WHERE PID='%s' AND OpSeq=%s";
                    else
                        sql = "UPDATE tblAutoKData2 SET chkPSoft = %s, dtLineEnteredOn=NOW() WHERE txtPID='%s' AND intOpSeq=%s"
                        
                    var params = [temp,this.get('pid'),this.get('opseq'),this.get('Paper_ID')],
                    success = function(sql){return;},error = function(sql){alert('error on: ' + sql);};
                    
                    if (this.get('Paper_ID')) 
                        sql += 'AND Paper_ID = %s;';
                    this.db.transaction(function(db) {
                        return db.executeSql(sql, params, success, error);
                    });
                }
            }
    });

    // Returns the Model class
    return Model;

});