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
        
    model: Backbone.Model

            

    });

    // Returns the Model class
    return collection;

});