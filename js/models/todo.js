define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Todo = Backbone.Model.extend({

    // Default attributes for the todo.
    defaults: {
      content: "empty todo...",
      done: false
    },
	url: function(){ return this.isNew() ? '/todos' : '/todos/' + this.get('id');},

    // Ensure that each todo created has `content`.
    initialize: function() {
      if (!this.get("content")) {
        this.set({"content": this.defaults.content},{silent: true});
      };
	  
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.save({done: !this.get("done")});
    }

  });

    // Returns the Model class
    return Todo;

});