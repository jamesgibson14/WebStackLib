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
                if(model.get('level')=='Branch')
                    return m.get('Unit');
                else
                    return m.get('Unit') + "_" + m.get('MachineCode');
            };
            this.map(function(model){
                var label = getLabel(model);
                if (labels.indexOf(label) > -1){
                    obj[label].push([new Date(model.get('DateCompleted')),model.get('RecordCount')]);
                }
                else{
                    labels.push(label);
                    obj[label] = [[new Date(model.get('DateCompleted')),model.get('RecordCount')]]
                }                           
            });
            var group = {};
            var c = 0;
            $.each( obj, function(i, array) {
                data.push(array);
                var gKey = i.slice(0,3);
                
                if(!group[gKey]) 
                    group[gKey]=0;

                series.push({color: model.get('branches')[gKey].colors[group[gKey]],markerOptions: model.get('branches')[gKey].markerOptions})
                //alert(series[c].color)
                group[gKey] += 1;
                c++;
            })
            model.set('labels', labels);
            model.set('series', series);
            model.set('plotData', data);
            return {
                labels:labels,
                data:data
            }
        }
    });

    return collection;

});