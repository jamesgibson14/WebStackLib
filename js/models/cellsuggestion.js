define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({

    // Default attributes for the todo.
    defaults: {
      content: "empty todo...",
      done: false
    },
	//url: function(){ return this.isNew() ? '/todos' : '/todos/' + this.get('id');},
    
    
    validate: function  (attrs) {
        if(/Invalid|NaN/.test(new Date(attrs.date))){
            return "Date error: please input a correct date";
        }    
    },
    // Ensure that each todo created has `content`.
    initialize: function() {
      if (!this.get("content")) {
        this.set({"content": this.defaults.content},{silent: true});
      };
	   this.on('change', this.save);
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.set({done: !this.get("done")});
    }

  });

    // Returns the Model class
    return Model;

});