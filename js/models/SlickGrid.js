define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var collection = Backbone.Collection.extend({
        model: Backbone.Model,
            
        sql: "SELECT ID, Code FROM Items",
        sqlAll: "SELECT Unit, PID, OpSeq, PIDRun, MachineCode = cast(MachineCode as int), StartDate, Shift, AssociateCode, SetupHrs, RunHrs, DowntimeHrs, CompletedQty, ScrapQty FROM PeopleSoftData  WHERE  StartDate > '%s' AND StartDate <= '%s'",
        sqlArgs: [],
        store: new WebSQLStore(E.sqlTest2,'dbo.spGetDataForPeopleSoftEntry',false),
        toDataView: function(headers){            
            return this.map(function(model){                
                return model.toJSON();           
            })
        },
        getColumns: function(customColumns){
            if (this.length ==0)
                return 'no data';
            var arr = [];
            var defaultColumns = {sortable:true};            
            $.each(this.at(0).attributes, function(i,val){
                // only display id column if specifically asked for.
                if (i == 'id' && !customColumns["id"])
                    return;
                var obj = $.extend({id: i, name:i, field: i},defaultColumns, customColumns[i]);                
                arr.push(obj);
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
            return model[columnDef.field];
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