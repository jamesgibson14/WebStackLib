define(['jquery', 'backbone', 'engine', 'handlebars', 'models/todo', 'text!templates/todo.html'], function($, Backbone, E, Handlebars, Model, template){

    var View = Backbone.View.extend({

        //... is a list tag.
        tagName:  "li",
        className: "ui-state-default",
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
            this.model = new Model();
            this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render', 'close', 'remove');
            this.model.bind('change', this.render);
            this.model.bind('destroy', this.remove,this);
        },
    
        // Re-render the contents of the todo item.
        render: function() {
          $(this.el).html(this.template(this.model.toJSON()));
          this.input = this.$('.todo-input');
          return this;
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
          this.input.focus();
        },
    
        // Close the `"editing"` mode, saving changes to the todo.
        close: function() {
          this.model.set({content: this.input.val()});
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
	//alert(View);
	//if(!E.views) E.views = [];
    //E.views.push(View);
    
    // Returns the View class
    return View;
});