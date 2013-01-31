define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var collection = Backbone.Collection.extend({
        model: Backbone.Model,

        sqlArgs: null,
    
        sql: "Execute dbo.spDemandPriority @startdate ='%s',  @enddate ='%s'",
        store: new WebSQLStore(E.sqldb,'dbo.spGetDataForPeopleSoftEntry',false),
        dataRenderer: function(){
            
        },
        toDataView: function(headers){
            return this.map(function(model){
                var obj = {};
                var pidt = model.get('pidTotals')
                obj.id = model.id;
                for (var i = 0; i < headers.length; i++) {
                   obj[headers[i]] = model.get(headers[i]); 
                }
                obj.pidCount = (pidt.count) ? pidt.count : 0;
                obj.pidExpectedQty = pidt.exptQty;
                obj.pidCompletedQty = pidt.compQty;
                obj.differenceQty = pidt.diffQty;
                obj.oversold = ((parseInt(obj.available) + parseInt(obj.differenceQty))-parseInt(obj.eaches))
                return obj;           
            })
        }
    });

    return collection;

});