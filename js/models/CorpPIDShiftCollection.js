define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var collection = Backbone.Collection.extend({
        model: Backbone.Model,
            
        sql: "SELECT Unit, MachineCode, StartDate, PcsPerHour = ISNULL(SUM(CompletedQty) / NULLIF(SUM(Runhrs) + SUM(DowntimeHrs),0),0), PcsPerAssignedHour = SUM(CompletedQty) / NULLIF(SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs),0) FROM PeopleSoftData  WHERE MachineCode IN (%s) AND StartDate > '%s' AND StartDate <= '%s' GROUP BY Unit, MachineCode, StartDate",
        sqlNew: "SELECT Unit, PID, OpSeq, PIDRun, MachineCode, StartDate, Shift, AssociateCode, SetupHrs, RunHrs, DowntimeHrs, CompletedQty, ScrapQty FROM PeopleSoftData  WHERE  StartDate > '%s' AND StartDate <= '%s'",
        sqlArgs: [],
        store: new WebSQLStore(E.sqlProd2,'dbo.spGetDataForPeopleSoftEntry',false),
        dataRenderer: function(url, plot, options){
            var that = this;
            var labels = [];
            var series = [];
            var obj = {};
            var data = [];
            this.map(function(model){
                var label = model.get('Unit') + "_" + model.get('MachineCode');
                if (labels.indexOf(label) > -1){
                    obj[label].push([new Date(model.get('StartDate')),model.get('PcsPerHour'),model.get('PcsPerAssignedHour')]);
                }
                else{
                    labels.push(label);
                    obj[label] = [[new Date(model.get('StartDate')),model.get('PcsPerHour'),model.get('PcsPerAssignedHour')]]
                }                           
            });
            $.each( obj, function(array, i) {
                //alert(typeof(array) + ' ' + array + ' _ i:' + i)
                data.push(i);
                //alert(array + ' ' + array.length);
            })
            this.labels= labels;
            return {
                labels:labels,
                data:data
            }
        },
        getStageMinutes: function(lastReviewDate){
            //alert(lastReviewDate)
            var cStage = this.getCurrentStage()
            var sumMinutes=0;
            this.map(function(mod){
                if(mod.get('CurrentStage')== cStage && mod.get('Date')>=lastReviewDate)
                    sumMinutes += mod.get('AssignedMinutes')
            })
            return sumMinutes
        },
        getCurrentStage: function(){
            return this.at(this.length-1).get('CurrentStage');
        }
    });

    return collection;

});