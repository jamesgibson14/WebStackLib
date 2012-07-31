define(['jquery', 'backbone', 'engine', 'handlebars', 'models/PSDetail', 'text!templates/PSDetail.html'], function($, Backbone, E, Handlebars, Model, template){

    var View = Backbone.View.extend({

        //... is a list tag.
        tagName:  "li",
        className: "row",
        // Cache the template function for a single item.
        template: template,
    
        // The DOM events specific to an item.
        events: {
          "click .check"              : "toggleFlag",
          //"click label.todo-content"  : "showOrder",
          "dblclick label.todo-content" : "edit",
          "click span.todo-destroy"   : "clear",
          "keypress .edit": "updateOnEnter"
        },
    
        // The TodoView listens for changes to its model, re-rendering. Since there's
        // a one-to-one correspondence between a **Todo** and a **TodoView** in this
        // app, we set a direct reference on the model for convenience.
        initialize: function() {
            this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render', 'close', 'remove','toggleFlag');
            this.model.bind('change', this.render);
            this.model.bind('destroy', this.remove,this);
        },
    
        // Re-render the contents of the todo item.
        render: function() {
          debugger;
          var temp = this.model.toJSON();
            
          temp = this.template(temp);
    
          this.$el.html( temp );
          return this;
        },
        // Toggle the `"done"` state of the model.
        toggleFlag: function() {
          this.model.toggleflag();
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
        close: function(input) {
            
            this.model.set({pid: this.$(input).val()});
            //$(this.el).removeClass("editing");
        },
    
        // If you hit `enter`, we're through editing the item.
        updateOnEnter: function(e) {
          
          if (e.keyCode == 13) {
              debugger;
              e.preventDefault();
              this.close(e.currentTarget);              
          }
        },
    
        // Remove the item, destroy the model.
        clear: function() {
          this.model.destroy();
        } 

    });
	
    // Returns the View class
    return View;
});