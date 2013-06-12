define(['jquery', 'backbone','engine', 'models/BaseADODBModel'], function($, Backbone,E, BaseADOModel) {

var Todo = BaseADOModel.extend({
    idAttribute: "ID",
    attrMap: {
        Task:'Task',
        AssignedTo: 'AssignedTo',
        Options: 'Options',
        Created: 'Created',
        CreatedBy: 'CreatedBy'
    },
    urlRoot : '/Tasks',
    defaults: {
      Completed: false,
      Task: 'Double Click to Add New Task',
      Name: "Assign To"  
    },
    // Ensure that each todo created has `content`.
    initialize: function() {

    },
    toggle: function() {
      this.save({Completed: this.get("Completed") ? null : new Date()});
    },
    parse: function(res){
        if(typeof(res.Completed) ==='date')
            res.Completed = new Date(res.Completed)
        if(typeof(res.DueAt) ==='date')
            res.DueAt = new Date(res.DueAt)
        return res
    },
    onBeforeCreate: function(options){
        if (!this.get('Options')){
            var op = this.get('Options') || {}
            op.LP = this.collection.nextOrder()
            this.set({Options: op},{silent:true})
        }
        if(!this.get('AssignedTo'))
            this.set('AssignedTo',E.user.get('Associate_ID'),{silent:true})
        this.set({Created: new Date(), CreatedBy: E.user.get('Associate_ID')},{silent:true})
    }

  });

    // Returns the Model class
    return Todo;

});