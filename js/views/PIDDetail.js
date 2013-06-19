define(['jquery', 'backbone', 'engine', 'handlebars', 'models/PID', 'text!templates/PID.html'], function($, Backbone, E, Handlebars, Model, template){

    var View = Backbone.View.extend({

        //... is a list tag.
        tagName:  "div",
        className: "row",
        // Cache the template function for a single item.
        template: template,
    
        // The DOM events specific to an item.
        events: {
          "click .check"              : "toggleFlag",
          'click .chkentered':'toggleEntered',
          'click .chkendscrap':'toggleEndscrap',
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
            var temp = this.model.toJSON();
          
            temp = this.template(temp);
    
            this.$el.html( temp );
            if(this.model.get('flag'))
                this.$el.addClass('error');
            else
                this.$el.removeClass("error");
            if(this.model.get('entered'))
                this.$el.addClass('entered');
            else
                this.$el.removeClass("entered");
            return this;
        },
        // Toggle the `"flag"` state of the model.
        toggleFlag: function() {
            var temp = {};
            if(this.$('.check').prop('checked')){
                temp.flagreason = this.model.get('flagreason') +  prompt("Please enter the reason for flagging this PID?") + '<br />';
                temp.flag = true;
            }
            else
                temp.flag =false
            this.model.set(temp);
        },
        // Toggle the `"flag"` state of the model.
        toggleEntered: function() {
            var temp = {}
            temp.entered = !this.model.get('entered')
            if(temp.entered)
                temp.dateentered = new Date().format('mm/dd/yyyy h:MM:ss TT');
            else
                temp.dateentered = null;
            this.model.set(temp);
        },
        toggleEndscrap: function() {
            var temp = {}
            temp.enterendscrap = !this.model.get('enterendscrap')
            this.model.set(temp);
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