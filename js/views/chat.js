define(['jquery', 'backbone', 'engine', 'handlebars', 'models/chat', 'text!templates/chat.html'], function($, Backbone, E, Handlebars, Model, template){

    var View = Backbone.View.extend({

        //... is a list tag.
        tagName:  "li",
        className: "chat",
        // Cache the template function for a single item.
        template: template,
    
        // The DOM events specific to an item.
        events: {
          "click"              : "rmchat"
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
    
        rmchat: function(){
			alert('removing chat')
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
	
    return View;
});
