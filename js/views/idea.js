define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/idea.html', 'models/idea'], 
function($, Backbone, E, Handlebars, template,model){

    var View = Backbone.View.extend({

        //... is a list tag.
        tagName:  "div",
        className: 'model ofh',
        id: 'create-model',
        model: new model(),
        // Cache the template function for a single item.
        template: template,
    
        // The DOM events specific to an item.
        events: {
          'click #newidea'              :'updateOnEnter',
          "click .check"                : "toggleDone",
          "dblclick .editable"          : "edit",
          "click span.todo-destroy"     : "clear",
          "keypress .todo-input"        : "updateOnEnter",
          "blur #iidea"                 : "close"
        },
    
        initialize: function() {
            
            _.bindAll(this, 'render', 'close', 'remove');
            this.model.bind('change:id', this.render);
            this.model.bind('destroy', this.remove,this);
        },
    
        // Re-render the contents of the todo item.
        render: function() {
          //alert('view render');
          var ctemp = Handlebars.compile(this.template);
          var context = this.model.toJSON();
          context.tags = {bug:false}
          context.isNew = this.model.isNew(); 
          //alert(JSON.stringify(context));        
          var html = ctemp(context);    
          this.$el.html( html );

          this.$('#tags > input').button();
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
            alert('gotcha');
            //$(this.el).addClass("editing");
            //this.$('.todo-input').focus();
        },
    
        // Close the `"editing"` mode, saving changes to the todo.
        close: function(e) {
          var val = this.$('#iidea').val()
          if (val=='') return;
          
          this.model.save({idea: val},{wait:true});
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