define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/task.html', 'models/task'], function($, Backbone, E, Handlebars, template, Model){

    var View = E.BaseView.extend({

        //... is a list tag.
        tagName:  "li",
        // Cache the template function for a single item.
        template: template,
    
        // The DOM events specific to an item.
        events: {
          "click .check"              : "toggleDone",
          "dblclick label.content" : "edit",
          "click span.todo-destroy"   : "clear",
          "keypress .todo-input"      : "updateOnEnter",
          "blur .todo-input"          : "close",
          "dblclick .dueAt": "edit",
          "dblclick .AssignedTo": "editAutoComplete"
        },
    
        // The TodoView listens for changes to its model, re-rendering. Since there's
        // a one-to-one correspondence between a **Todo** and a **TodoView** in this
        // app, we set a direct reference on the model for convenience.
        initialize: function() {
            _.bindAll(this, 'close', 'remove');
            if (!this.model)
                this.model = new Model();
            this.listenTo(this.model,'change', this.render);
            this.listenTo(this.model,'destroy', this.remove,this);
            
        },
        temp: function(){
            this.model.set({ID:30})
            this.model.trigger('sync')  
        },     
        serializeData: function(){
            var obj = this.model.toJSON();
            if(!obj.Completed)
                obj.done =  false
            else {
                obj.done =  true
                obj.Completed.format('m/d/yyyy h:MM:ss TT')
            }
            obj.isNew = this.model.isNew();   
            return obj;
        },
        edit: function(e){
            var $container = $(e.currentTarget)
            var attr = $container.attr('data-attr')
            var label = $container.attr('data-label')
            var $input;
            
            switch(attr){
                case "DueAt": $input = this.editDatePicker(e)
                break;
                case "Task": $input = this.editText(e)
                break;
                case "DueAt": $input = this.editDatePicker(e)
                break;
                case "DueAt": $input = this.editDatePicker(e)
                break;
            } 
              
            
        },
        toggleDone: function() {           
          this.model.toggle();
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