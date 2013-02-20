define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var collection = Backbone.Collection.extend({
        model: Backbone.Model,

        sqlArgs: null,
    
        sql: "EXECUTE dbo.spOperatorTracking @AssociateToQualification_ID = 35",
        store: new WebSQLStore(E.sqldb,'dbo.spGetDataForPeopleSoftEntry',false),
        dataRenderer: function(url, plot, options){
            var that = this;
            var labels = [];
            var obj = {};
            var data = [];
            this.map(function(model){
                var label = model.get('Code');
                if (labels.indexOf(label + '_Target') > -1){
                    obj[label + '_Target'].push([model.get('Date'),model.get('Target')*100]);
                    obj[label + '_Actual'].push([model.get('Date'),model.get('PerformancePercent')*100,model.get('AssignedMinutes'),model.get('LineCount')]);
                }
                else{
                    labels.push(label + '_Target');
                    labels.push(label + '_Actual');
                    obj[label + '_Target'] = [[model.get('Date'),model.get('Target')*100]]
                    obj[label + '_Actual'] = [[model.get('Date'),model.get('PerformancePercent')*100,model.get('AssignedMinutes'),model.get('LineCount')]]
                }                           
            });
            $.each( obj, function(array, i) {
                //alert(typeof(array) + ' ' + array + ' _ i:' + i)
                data.push(i);
                //alert(array + ' ' + array.length);
            })
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