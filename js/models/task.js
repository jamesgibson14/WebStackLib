define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Todo = Backbone.Model.extend({

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
    storetype: 'autosql',
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