define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/task.html'], function($, Backbone, E, Handlebars, template){

    var View = E.BaseView.extend({

        //... is a list tag.
        tagName:  "li",
        className: 'border',
        // Cache the template function for a single item.
        template: template,
    
        // The DOM events specific to an item.
        events: {
          "click .check"              : "toggleDone",
          "dblclick label.todo-content" : "edit",
          "click span.todo-destroy"   : "clear",
          "keypress .todo-input"      : "updateOnEnter",
          "blur .todo-input"          : "close"
        },
    
        // The TodoView listens for changes to its model, re-rendering. Since there's
        // a one-to-one correspondence between a **Todo** and a **TodoView** in this
        // app, we set a direct reference on the model for convenience.
        initialize: function() {
            _.bindAll(this, 'render', 'close', 'remove');
            this.model.bind('change', this.render);
            this.model.bind('destroy', this.remove,this);
        },        
        serializeData: function(){
            var obj = this.model.toJSON();
            if(obj.Completed=== null)
                obj.done =  false
            else {
                obj.done =  true
                obj.Completed = new Date(obj.Completed).format('m/d/yyyy h:MM:ss TT')
            }
                
            return obj;
        },    
        toggleDone: function() {           
          this.model.toggle();
        },        
        // Switch this view into `"editing"` mode, displaying the input field.
        edit: function() {
          $(this.el).addClass("editing");
          this.$('.todo-input').focus();
        },    
        // Close the `"editing"` mode, saving changes to the todo.
        close: function() {
          this.model.set({Task: this.$('.todo-input').val()})
          this.model.save();
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