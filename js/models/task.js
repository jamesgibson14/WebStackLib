define(['jquery', 'backbone','engine', 'models/BaseADODBModel'], function($, Backbone,E, BaseADOModel) {

var Todo = BaseADOModel.extend({
    idAttribute: "ID",
    attrMap: {
        Task:'Task',
        AssignedTo: 'AssignedTo'
    },
    urlRoot : '/Tasks',
    defaults: {
      Completed: false,
      Task: 'Double Click to Add New Task',
      Name: "Assign To"  
    },
    // Ensure that each todo created has `content`.
    initialize: function() {
        //if(typeof(this.get('Completed'))==='date')
            //this.set('Completed',new)
    },
    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.save({Completed: this.get("Completed") ? NULL : new Date()});
    },
    parse: function(res){
        if(typeof(res.Completed) ==='date')
            res.Completed = new Date(res.Completed)
        return res
    }

  });

    // Returns the Model class
    return Todo;

});