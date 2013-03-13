define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var collection = Backbone.Collection.extend({
        model: Backbone.Model,
            
        sql: "SELECT crd.Machine_ID, crd.ParentRecord_ID, Date = crd.Date, crd.CurrentStage, Target = crd.NetQtyProducedPercentageTarget, StageTarget = dbo.fnGetNetProducedPercentageTarget(crd.CurrentStage,m.Stage5Target), LineCount = COUNT(*), PerformancePercent = (SUM(crd.NetQtyProduced) * 1.0) / NULLIF(SUM(crd.NetQtyProducedTarget * 1.0),0), AssignedMinutes = SUM(crd.AssignedMinutes), m.Code, crd.Multiprocess FROM CompiledReportingData crd INNER JOIN dbo.Associates INNER JOIN dbo.AssociatesToQualifications ON dbo.Associates.RecordID = dbo.AssociatesToQualifications.Associate_ID INNER JOIN dbo.Qualifications q ON dbo.AssociatesToQualifications.Qualifications_ID = q.ID INNER JOIN dbo.QualificationsToMachines ON q.ID = dbo.QualificationsToMachines.Qualifications_ID INNER JOIN Machines m ON QualificationsToMachines.Machines_ID = m.ID ON crd.Machine_ID = QualificationsToMachines.Machines_ID AND crd.Associate_ID = Associates.RecordID WHERE AssociatesToQualifications.ID = %s GROUP BY crd.Associate_ID, crd.Machine_ID, crd.Date, crd.CurrentStage, crd.NetQtyProducedPercentageTarget, m.Stage5Target, m.Code, crd.Multiprocess, crd.ParentRecord_ID ORDER BY crd.Date",
        sqlArgs: [],
        store: new WebSQLStore(E.sqldb,'dbo.spGetDataForPeopleSoftEntry',false),
        dataRenderer: function(url, plot, options){
            var that = this;
            var labels = [];
            var obj = {};
            var data = [];
            this.map(function(model){
                var label = model.get('Code');
                if (labels.indexOf(label + '_Target') > -1){
                    obj[label + '_Target'].push([new Date(model.get('Date')),model.get('Target')*100,model.get('CurrentStage')]);
                    obj[label + '_Actual'].push([new Date(model.get('Date')),model.get('PerformancePercent')*100,model.get('AssignedMinutes'),model.get('LineCount'),model.get('ParentRecord_ID')]);
                }
                else{
                    labels.push(label + '_Target');
                    labels.push(label + '_Actual');
                    obj[label + '_Target'] = [[new Date(model.get('Date')),model.get('Target')*100,model.get('CurrentStage')]]
                    obj[label + '_Actual'] = [[new Date(model.get('Date')),model.get('PerformancePercent')*100,model.get('AssignedMinutes'),model.get('LineCount'),model.get('ParentRecord_ID')]]
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