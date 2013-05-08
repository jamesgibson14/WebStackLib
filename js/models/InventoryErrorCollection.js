define([
  'jquery',
  'underscore',
  'backbone',
  'engine',
  'models/model'
], function($, _, Backbone, E, Model){
  var collection = Backbone.Collection.extend({
// Reference to this collection's model.
    sql: "SELECT tblItemVerification.[Error Type] as ErrorType, Count(tblItemVerification.[Error Type]) AS [CountOfErrorType] FROM tblItemVerification WHERE (((tblItemVerification.[Date Entered]) Between #%s# And #%s#)) GROUP BY tblItemVerification.[Error Type];",
        store: new WebSQLStore(E.accessdb,'dbo.spGetDataForPeopleSoftEntry',false),
        sqlArgs: ["04/01/2013","04/15/2013"],
        
    model: Backbone.Model

            

    });

    // Returns the Model class
    return collection;

});