define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var collection = Backbone.Collection.extend({
        model: Backbone.Model,
            
        sql: "",
        sqlArgs: [],
        store: new WebSQLStore(E.sqlTest2,'dbo.spGetDataForPeopleSoftEntry',false),
        data: function(filter){
            //var data = .map(function(m){})
            return this.where(filter);  
        },
        dataRenderer: function(mod, options){
            var that = this;
            var labels = [];
            var series = [];
            var obj = {};
            var data = [];
            var model = mod;
            var getLabel = function(m){
                if(model.get('level')=='0')
                    return m.get('Unit');
                else
                    return m.get('Unit') + "_" + m.get('MachineCode');
            }
            this.map(function(model){
                var label = getLabel(model);
                
                if (labels.indexOf(label) > -1){
                    obj[label].push([new Date(model.get('StartDate')),model.get('PcsPerHour')]);
                }
                else{
                    labels.push(label);
                    obj[label] = [[new Date(model.get('StartDate')),model.get('PcsPerHour')]]
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
        }
    });

    return collection;

});