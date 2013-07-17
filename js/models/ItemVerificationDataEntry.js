define(['jquery', 'backbone','engine', 'models/BaseADODBModel'], function($, Backbone,E, BaseADOModel) {

var Todo = BaseADOModel.extend({
    idAttribute: "RecordNumber",
    
    urlRoot : '/ItemVerification',
    initialize: function() {
    this.set({DateEntered: new Date(), UserName: E.user.get('Name')},{silent:true})
    },
    
    parse: function(res){
        if(typeof(res.Completed) ==='date')
            res.Completed = new Date(res.Completed)
        if(typeof(res.DueAt) ==='date')
            res.DueAt = new Date(res.DueAt)
        return res
    },
    onBeforeCreate: function(options){
        
           
    }

  });

    // Returns the Model class
    return Todo;

});