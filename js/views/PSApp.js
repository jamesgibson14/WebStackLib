define(['jquery', 'backbone', 'engine', 'handlebars', 'models/PSDetail', 'text!templates/PSApp.html', 'models/PSDetails'], function($, Backbone, E, Handlebars, Model, template, Collection){

    var View = Backbone.View.extend({

        tagName:  "div",
        collection: new Collection(),
        template: template,
        events: {
            'blur .pid':'change'        
        },
        initialize: function() {
            this.collection.add (new Model());
            this.template = Handlebars.compile(this.template);
            this.model = new Model();
            _.bindAll(this, 'render','change');
            this.model.bind('change', this.render);
            this.model.bind('destroy', this.remove,this);
        },
    
        // Re-render the contents of the todo item.
        render: function() {
            var temp = this.model.toJSON();
            var pid = {"pidArray":[]};
            pid.pidArray.push(temp);
            pid.pidArray.push(temp);
            pid.pidArray.push(temp);
            
            temp = this.template(pid);
    
            this.$el.html( temp );
            return this;
        },
        change: function(){
            
            var newvalue = this.$el.find('.pid').val();
            this.model.set({pid: newvalue})
        },
        addAll: function(collection) {
          // create in memory element 
          var $el = $('<ul id="todo-list"></ul>'); 
          // also get the `className`, `id`, `attributes` if you need them 
         
          // append everything to the in-memory element 
          _.each(collection,function(model){ 
            var rowView = new TodoView({model: model}); 
            $el.append(rowView.render().el); 
          }); 
            
          // replace the old view element with the new one, in the DOM 
          this.$("#todo-list").replaceWith($el); 
         
          // reset the view instance to work with the new $el 
          //this.setElement($el); 
    
          //Todos.each(this.addOne);
        }
    });
	
    // Returns the View class
    return View;
});