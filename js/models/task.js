define(['jquery', 'backbone','engine', 'models/BaseADODBModel'], function($, Backbone,E, BaseADOModel) {

    var Todo = BaseADOModel.extend({

    // Default attributes for the todo.
    defaults: {
      content: "empty todo...",
      done: false
    },
    idAttribute: "ID",
    attrMap: {
        Task:'Task',
        AssignedTo: 'AssignedTo'
    },
    // Ensure that each todo created has `content`.
    initialize: function() {

    },
    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.save({done: !this.get("done")});
    }

  });

    // Returns the Model class
    return Todo;

});