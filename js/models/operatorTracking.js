define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var collection = Backbone.Collection.extend({
        model: Backbone.Model,

        sqlArgs: null,
    
        sql: "EXECUTE dbo.spOperatorTracking @AssociateToQualification_ID = 394",
        store: new WebSQLStore(E.sqldb,'dbo.spGetDataForPeopleSoftEntry',false),
        dataRenderer: function(url, plot, options){
            var that = this;
            var labels = [];
            var obj = {};
            var data = [[["2008-08-12 4:00PM",40], ["2008-09-12 4:00PM",61.5], ["2008-10-12 4:00PM",52.7], ["2008-11-12 4:00PM",9], ["2008-12-12 4:00PM",8.2]],
                [["2008-09-12 4:00PM",0.654], ["2008-11-12 4:00PM",51.7], ["2010-11-12 4:00PM",99.9], ["2010-12-12 4:00PM",85.2]]];
            this.map(function(model){
                var label = model.get('Code');
                if (labels.indexOf(label + '_Target') > -1){
                    obj[label + '_Target'].push([model.get('Date'),model.get('Target')]);
                    obj[label + '_Actual'].push([model.get('Date'),model.get('PerformancePercent')]);
                }
                else{
                    labels.push(label + '_Target');
                    labels.push(label + '_Actual');
                    obj[label + '_Target'] = [[model.get('Date'),model.get('Target')]]
                    obj[label + '_Actual'] = [[model.get('Date'),model.get('PerformancePercent')]]
                }                           
            });
            data = []
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