// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone-localstorage.js)
// to persist Backbone models within your browser.

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Todo Model
  // ----------

  // Our basic **Todo** model has `content`, `order`, and `done` attributes.
  var Todo = Backbone.Model.extend({

    // Default attributes for the todo.
    defaults: {
      content: "empty todo...",
	  assignedTo: "james",
      done: false
    },
	url: function(){ return this.isNew() ? '/todos' : '/todos/' + this.get('id');},

    // Ensure that each todo created has `content`.
    initialize: function() {
      if (!this.get("content")) {
        this.set({"content": this.defaults.content},{silent: true});
      }
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.set({done: !this.get("done")},{silent: true});
    }

  });

  // Todo Collection
  // ---------------
  
  // The collection of todos is backed by *localStorage* instead of a remote
  // server.
  var TodoList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Todo,
	urlRoot: '/todos',
	url: function(){ return this.urlRoot;},
    // Save all of the todo items under the `"todos"` namespace.
    localStorage: new Store("todos-backbone"),
	
	
    // Filter down the list of all todo items that are finished.
    done: function() {
	  //alert('done');
      return this.filter(function(todo){ return todo.get('done'); });
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    // Todos are sorted by their original insertion order.
    comparator: function(todo) {
      return todo.get('order');
    }

  });

  // Create our global collection of **Todos**.
  var Todos = new TodoList;

  // Todo Item View
  // --------------

  // The DOM element for a todo item...
  var TodoView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",
	className: "ui-state-default",
    // Cache the template function for a single item.
    template: Handlebars.compile($('#handlebars-item-template').html()),

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
      _.bindAll(this, 'render', 'close', 'remove');
      this.model.bind('change', this.render);
      this.model.bind('destroy', this.remove,this);
    },

    // Re-render the contents of the todo item.
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      this.input = this.$('.todo-input');
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

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  window.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-todo":  "createOnEnter",
      "keyup #new-todo":     "showTooltip",
      "click .todo-clear a": "clearCompleted",
      "click .mark-all-done": "toggleAllComplete"
	  ,"click .filter-all-done": "showRemaining"
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
		_.bindAll(this, 'addOne', 'addAll', 'render', 'toggleAllComplete');

		this.input = this.$("#new-todo");
		this.allCheckbox = this.$(".mark-all-done")[0];

		Todos.bind('add',     this.addOne);
		//Todos.bind('reset',   this.addAll());
		Todos.bind('all',     this.render);
		var that = this;
		Todos.fetch({success:  function(collection,res) {
			
			that.addAll(collection.models);
			//this.addAll(Todos);
      }});
		
		this.$("#todo-list").sortable({
			update: this.reOrder
		});
		//$( "#todo-list" ).disableSelection();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      var done = Todos.done().length;
      var remaining = Todos.remaining().length;

      this.$('#todo-stats').html(this.statsTemplate({
        total:      Todos.length,
        done:       done,
        remaining:  remaining
      }));

      this.allCheckbox.checked = !remaining;
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },
	
	showRemaining: function(todo) {
	  this.$("#todo-list").html('');
      if(this.$(".filter-all-done")[0].checked)
		this.addAll(Todos.remaining());
	  else
		this.addAll(Todos);
    },
	reOrder: function(event, ui) {
		alert('pos: ' + ui.item.index() + ', ' + ui.placeholder.index());
		
		$('div.todo',this).each(function(i){
			
			var id = $(this).attr('data-id'),
				todo = Todos.get(id);
			//console.log(id,todo);	
			todo.set({order: i + 1},{silent: true});
		});
	},
    
	// Add all items in the **Todos** collection at once.
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
    },

    // Generate the attributes for a new Todo item.
    newAttributes: function() {
      return {
        content: this.input.val(),
        order:   Todos.nextOrder(),
        done:    false
      };
    },

    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      Todos.create(this.newAttributes());
      this.input.val('');
    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.each(Todos.done(), function(todo){ todo.destroy(); });
      return false;
    },

    // Lazily show the tooltip that tells you to press `enter` to save
    // a new todo item, after one second.
    showTooltip: function(e) {
      var tooltip = this.$(".ui-tooltip-top");
      var val = this.input.val();
      tooltip.fadeOut();
      if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
      if (val == '' || val == this.input.attr('placeholder')) return;
      var show = function(){ tooltip.show().fadeIn(); };
      this.tooltipTimeout = _.delay(show, 1000);
    },

    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      Todos.each(function (todo) { todo.set({'done': done}); });
    }

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});
