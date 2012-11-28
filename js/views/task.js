define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/idea.html'], function($, Backbone, E, Handlebars, template){

    var View = Backbone.View.extend({

        //... is a list tag.
        tagName:  "tr",
        className: 'border centered',
        // Cache the template function for a single item.
        template: template,
    
        // The DOM events specific to an item.
        events: {
          "click .check"              : "toggleDone",
          //"click label.todo-content"  : "showOrder",
          "dblclick label.todo-content" : "edit",
          "click span.todo-destroy"   : "clear",
          "keypress .todo-input"      : "updateOnEnter",
          "blur .todo-input"          : "close"
        },
    
        // The TodoView listens for changes to its model, re-rendering. Since there's
        // a one-to-one correspondence between a **Todo** and a **TodoView** in this
        // app, we set a direct reference on the model for convenience.
        initialize: function() {
            this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render', 'close', 'remove');
            this.model.bind('change', this.render);
            this.model.bind('destroy', this.remove,this);
        },
    
        // Re-render the contents of the todo item.
        render: function() {
          //alert('view render');
          var temp = this.model.toJSON();            
          temp = this.template(temp);    
          this.$el.html( temp );
          return this;
        },
    
        // Toggle the `"done"` state of the model.
        toggleDone: function() {
          this.model.toggle();
        },
        
        // Alert the Order of this todo.
        showOrder: function(e) {
            //console.log(e);
          alert('you clicked me' + this.model.get("order"));
        },
        
        // Switch this view into `"editing"` mode, displaying the input field.
        edit: function() {
          $(this.el).addClass("editing");
          this.$('.todo-input').focus();
        },
    
        // Close the `"editing"` mode, saving changes to the todo.
        close: function() {
          this.model.set({content: this.$('.todo-input').val()});
          $(this.el).removeClass("editing");
        },
    
        // If you hit `enter`, we're through editing the item.
        updateOnEnter: function(e) {
          if (e.keyCode == 13) this.close();
        },
    
        // Remove the item, destroy the model.
        clear: function() {
          this.model.destroy();
        }
    
    });
    
    // Returns the View class
    return View;
});