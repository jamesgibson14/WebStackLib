define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var collection = Backbone.Collection.extend({
        store: new WebSQLStore(E.sqlProd2,'dbo.spGetDataForPeopleSoftEntry',false),
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