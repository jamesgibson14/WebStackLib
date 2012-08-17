define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Todo = Backbone.Model.extend({

    // Default attributes for the todo.
    defaults: {
      content: "empty todo...",
	  code: "blah"
    },

    // Ensure that each todo created has `content`.
    initialize: function() {
	   //this.on('change', this.save);
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.set({done: !this.get("done")});
    }

  });

    // Returns the Model class
    return Todo;

});