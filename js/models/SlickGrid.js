define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var collection = Backbone.Collection.extend({
        model: Backbone.Model,
            
        sql: "SELECT ID, Code FROM Items",
        sqlAll: "SELECT Unit, PID, OpSeq, PIDRun, MachineCode = cast(MachineCode as int), StartDate, Shift, AssociateCode, SetupHrs, RunHrs, DowntimeHrs, CompletedQty, ScrapQty FROM PeopleSoftData  WHERE  StartDate > '%s' AND StartDate <= '%s'",
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
        },
        getColumns: function(){
            if (this.length ==0)
                return 'no data';
            var arr = [];
             $.each(this.at(0).attributes, function(i,val){
                arr.push( {id: i, name:i, field: i});
            });
            return arr;
        },
        getLength: function() {    
            return this.models.length;  
        },
        getItem: function(i) {    
            return this.models[i];  
        },
        setModelValue: function(model,value) {    
            var column = this.column;    
            var internalValue = unformatValue(value,column);    
            var newValues = {};    
            newValues[column.field] = internalValue;    
            model.set(newValues);  
        },
        dataItemColumnValueExtractor: function(model, columnDef) {
            return model.get(columnDef.field);
        },
        requiredFieldValidator: function(value) {
            if (value == null || value == undefined || !value.length) {
              return {valid: false, msg: "This is a required field"};
            } else {
              return {valid: true, msg: null};
            }
        },
        defaultFormatter: function(row, cell, value, columnDef, dataContext) {
            if (value == null) {
                return "";
            }
            else if(typeof(value)=='date')
                return value
            else {
                return value.toString().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
            }
        }


    });

    return collection;

});