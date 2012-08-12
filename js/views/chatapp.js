define(['jquery', 'backbone', 'engine','handlebars', 'models/chat', 'text!templates/chatapp.html','models/chats','text!templates/TodoStats.html','views/chat'], 
function($, Backbone, E, Handlebars, Model, template, collection,statsTemp,subView){
    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'chatapp',
        collection: new collection(),
        filteredModels: [],

        // Our template for the line of statistics at the bottom of the app.
        template: template,
        statsTemplate: statsTemp,
    
        // Delegated events for creating new items, and clearing completed ones.
        events: {
		  'click .chat': 'createOnEnter',
		  'keyup .text': 'createOnEnter'
		},
	initialize: function () {
		var that = this;
	   Backbone.socket = io.connect('/');
		Backbone.socket.on('connect',alert('socket connected'));
	   Backbone.socket.on('newChatFromOtherUser',function(data){
		alert("new chat");		
		var model = new Model(data);		
		that.collection.add(model);
		});
	   _.bindAll(this, 'addOne', 'addAll', 'render', 'toggleAllComplete','renderStats','reOrder','filter');
	this.collection.bind('add',     this.addOne, this);
	   this.template = Handlebars.compile(this.template);
	   var temp = this.template({});
    	   this.$el.html( temp );
	   $(this.el).find('.text').focus();
	   this.input = this.$(".text");
//	   this.collection.fetch();
	},   
        
        test: function(){
            //for testing UI interactions
            alert("Test Code");
            
        },
    
        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render: function() {
            return this;
        },
        renderStats: function() {
            var done = this.collection.done().length;
            var remaining = this.collection.remaining().length;
    
            this.$('#todo-stats').html(this.statsTemplate({
                total:      this.collection.length,
                done:       done,
                remaining:  remaining
            }));
            this.$(".mark-all-done")[0].checked = !remaining;
        },
    
        // Add a single todo item to the list by creating a view for it, and
        // appending its element to the `<ul>`.
        addOne: function(model) {
            var view = new subView({model: model});
            this.$(".history").append(view.render().el);
        },
        
        filter: function() {
            //alert('filter and sort');
            debugger;
            this.collection.sort({silent:true});
            if(this.$(".filter-all-done")[0].checked)
                this.filteredModels = this.collection.remaining();
            else
                this.filteredModels = this.collection.models
        
            this.addAll();
        },
        reOrder: function(event, ui) {
            //alert('pos: ' + ui.item.index() + ', ' + ui.placeholder.index());
            var now = new Date();
            
            var that = this;
            this.$('div.todo').each(function(i){
                
                var id = $(this).attr('data-id');
                var model = that.collection.get(id); 
                model.save({order: i + 1},{silent:true});
            });
            alert(new Date()-now);
        },
        
        // Add all items in the **Todos** collection at once.
        addAll: function() {
            // create in memory element
            this.$('#todo-list').sortable('destroy');
            var $el = this.$('#todo-list').clone(true,true); 
            // also get the `className`, `id`, `attributes` if you need them 
            $el.empty();
            // append everything to the in-memory element 
            _.each(this.filteredModels, function(model){ 
                var rowView = new subView({model: model}); 
                $el.append(rowView.render().el); 
            }); 
            $el.sortable({
                update: this.reOrder
            });
            // replace the old view element with the new one, in the DOM 
            this.$("#todo-list").replaceWith($el);//.replaceWith($el); 
            
        },
    
        // Generate the attributes for a new Todo item.
        newAttributes: function() {
          return {
            text: this.input.val(),
            author:   'james'
          };
        },
    
        // If you hit return in the main input field, create new **Todo** model,
        // persisting it to *localStorage*.
        createOnEnter: function(e) {
	  //alert('kepup');
          if (e.keyCode != 13) return;
          this.collection.create(this.newAttributes());
          this.input.val('');
        },
    
        // Clear all done todo items, destroying their models.
        clearCompleted: function() {
          _.each(this.collection.done(), function(todo){ todo.destroy(); });
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
          this.collection.each(function (todo) { todo.set({'done': done}); });
        }

    });
	
    // Returns the View class
    return View;
});
