define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({
        sql: "SELECT tblItemVerification.[Error Type], Count(tblItemVerification.[Error Type]) AS [CountOfError Type] FROM tblItemVerification WHERE (((tblItemVerification.[Date Entered]) Between #%s# And #%s#)) GROUP BY tblItemVerification.[Error Type];",
        store: new WebSQLStore(E.accessdb,'dbo.spGetDataForPeopleSoftEntry',false),
        sqlArgs: ["04/01/2013","04/15/2013"]
        

    });

    // Returns the Model class
    return Model;

});