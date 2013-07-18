define([
  'jquery',
  'underscore',
  'backbone',
  'engine',
  'models/model'
], function($, _, Backbone, E, Model){
  var collection = Backbone.Collection.extend({
// Reference to this collection's model.
    sql: "select Table1.ErrorType, sum(CountOfErrorType) as DailyErrorCount, DateEntered  from  (SELECT [Error Type] AS ErrorType, Count([Error Type]) AS CountOfErrorType, convert(varchar,[Date Entered],101) as DateEntered FROM ItemVerification WHERE ((([Date Entered]) Between '%s' And '%s')) GROUP BY [Error Type],[Date Entered]) as Table1 Group By Table1.ErrorType, Table1.DateEntered;",
        store: new WebSQLStore(E.sqlTest2,'dbo.spGetDataForPeopleSoftEntry',false),
        sqlArgs: ["04/01/2013","04/15/2013"],
        
    model: Backbone.Model,
    dataRenderer: function(url, plot, options){
            var that = this;
            var labels = [];
            var obj = {};
            var data = [];
            this.map(function(model){
                var label = model.get('ErrorType');
                if (labels.indexOf(label) > -1){
                    obj[label].push([new Date(model.get('DateEntered')),model.get('DailyErrorCount')]);
                    
                }
                else{
                    labels.push(label);
                    obj[label]=[]
                    obj[label].push([new Date(model.get('DateEntered')),model.get('DailyErrorCount')]);
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
        
        updateSql: function(grouping){
            switch(grouping){
                case "Day": this.sql = "select Table1.ErrorType, sum(CountOfErrorType) as DailyErrorCount, DateEntered  from  (SELECT [Error Type] AS ErrorType, Count([Error Type]) AS CountOfErrorType, convert(varchar,[Date Entered],101) as DateEntered FROM ItemVerification WHERE ((([Date Entered]) Between '%s' And '%s')) GROUP BY [Error Type],[Date Entered]) as Table1 Group By Table1.ErrorType, Table1.DateEntered;" 
              break;
                case "Month": this.sql= "select Table1.ErrorType, sum(CountOfErrorType) as DailyErrorCount, LEFT(convert(varchar, DateEntered, 121),7) as DateEntered from  (SELECT [Error Type] AS ErrorType, Count([Error Type]) AS CountOfErrorType, [Date Entered] as DateEntered FROM ItemVerification WHERE ((([Date Entered]) Between '%s' And '%s')) GROUP BY [Error Type],[Date Entered]) as Table1 Group By Table1.ErrorType, LEFT(convert(varchar, DateEntered, 121),7);"
                break;
                case "Week": this.sql="select Table1.ErrorType, sum(CountOfErrorType) as DailyErrorCount, Convert(varchar,dateadd(day,-datepart(weekday,DateEntered)+2,DateEntered),101) as DateEntered from  (SELECT [Error Type] AS ErrorType, Count([Error Type]) AS CountOfErrorType, [Date Entered] as DateEntered FROM ItemVerification WHERE ((([Date Entered]) Between '%s' And '%s')) GROUP BY [Error Type],[Date Entered]) as Table1 Group By Table1.ErrorType, Convert(varchar,dateadd(day,-datepart(weekday,DateEntered)+2,DateEntered),101);" 
                break;
            }
        }
    
            

    });

    // Returns the Model class
    return collection;

});