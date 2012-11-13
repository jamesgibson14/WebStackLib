define(['jquery', 'backbone', 'engine','handlebars', 'models/todo', 'text!templates/ProdScheduleApp.html','models/todos','text!templates/TodoStats.html','views/todo'], 
function($, Backbone, E, Handlebars, Model, template, collection,statsTemp,subView){
    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'ProdScheduleApp ofh',
        collection: new collection(),
        filteredModels: [],

        // Our template for the line of statistics at the bottom of the app.
        template: template,
        statsTemplate: statsTemp,
    
        // Delegated events for creating new items, and clearing completed ones.
        events: {
          "keypress #new-todo":  "createOnEnter",
          "keyup #new-todo":     "showTooltip",
          "click .todo-clear a": "clearCompleted",
          "click .mark-all-done": "toggleAllComplete",
          "click .filter-all-done": "filter",
          'click #btnTest': 'test'
        },
    
        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize: function() {
            _.bindAll(this, 'addOne', 'addAll', 'render', 'toggleAllComplete','renderStats','reOrder','filter');
            this.collection.bind('reset',     this.filter);
            this.collection.bind('add',     this.addOne);
             
            this.template = Handlebars.compile(this.template);
            this.statsTemplate = Handlebars.compile(this.statsTemplate);
            var temp = this.template({});
            this.$el.html( temp );
            this.$('#sortable2 tbody').sortable({
                receive: function(e,ui){
                    alert('offset' + ui.offset.top + ' offset' + ui.offset.left + ' p' + ui.position.top + ' p' + ui.position.left + ' op' + ui.originalPosition.top + ' op' + ui.originalPosition.left);
                }
            }).disableSelection();
                   
           this.$( "#accordion" ).accordion({            
                collapsible: true,
                heightStyle: "content"        
            });    
            
            this.$( "#sortable1 tbody tr").draggable({            
                helper: "clone",
                connectToSortable: '#sortable2  tbody'        
            }).disableSelection();
            this.$('#sortable').sortable({
                sort: function() {              
                    $( this ).removeClass( "ui-state-default" );            
                }
            }).disableSelection();
            //this.input = this.$("#new-todo");
            //this.renderStats();
            //this.collection.fetch();
           
        },
        test: function(e){
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
            this.$("#todo-list").append(view.render().el);
            this.renderStats();
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
            //this.$('#todo-list').sortable('destroy');
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
            content: this.input.val(),
            order:   this.collection.nextOrder(),
            done:    false
          };
        },
    
        // If you hit return in the main input field, create new **Todo** model,
        // persisting it to *localStorage*.
        createOnEnter: function(e) {
          if (e.keyCode != 13) return;
          this.collection.create(this.newAttributes(),{wait:true});
          this.input.val('');
          e.preventDefault();
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