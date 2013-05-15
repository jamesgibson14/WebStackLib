define(['jquery', 'backbone', 'engine','handlebars', 'models/taskList', 'text!templates/taskList.html','text!templates/TodoStats.html','models/task','views/task'], 
function($, Backbone, E, Handlebars, Model, template, statsTemp,subModel, subView){
    var View = E.BaseView.extend({

        tagName:  "div",
        className: 'PSApp',
        model: new Model(),
        filteredModels: [],
        template: template,
        statsTemplate: statsTemp,
        events: {
          "keypress #new-todo":  "createOnEnter",
          "keyup #new-todo":     "showTooltip",
          "click .todo-clear a": "clearCompleted",
          "click .mark-all-done": "toggleAllComplete",
          "click .filter-all-done": "filter",
          "click .print": "print"
        },
        initialize: function() {
            this.collection = this.model.tasks;
            _.bindAll(this, 'addOne', 'addAll', 'render', 'toggleAllComplete','renderStats','reOrder','filter');
            this.listenTo(this.collection,'reset',     this.filter);
            this.listenTo(this.collection,'add',     this.addOne);
            this.statsTemplate = Handlebars.compile(this.statsTemplate);                    
        },
        onRender: function(){
            this.collection.fetch({reset:true});  
            this.input = this.$("#new-todo");
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
    
        // Add a single task to the list by creating a view for it, and
        // appending its element to the `<ul>`.
        addOne: function(model) {
            var view = new subView({model: model});
            this.$("#todo-list").append(view.render().el);
            this.renderStats();
        },
        
        filter: function() {
            if(this.$el.find(".filter-all-done")[0].checked)
                this.filteredModels = this.collection.remaining();
            else
                this.filteredModels = this.collection.models
        
            this.addAll();
        },
        reOrder: function(e, ui) {
            //alert('pos: ' + ui.item.index() + ', ' + ui.placeholder.index());
            var now = new Date();
            var startAt = ui.item.index();
            alert(startAt)
            var that = this;
            this.$('div.todo').each(function(i){
                debugger;
                var id = $(this).attr('data-id');
                var model = that.collection.get(id);
                var obj = $.extend({},model.get('Options'),{LP:i + 1})
                model.set({Options: obj});                
                that.collection.sqlqueue += ';' + model.update({queue:true})
            });
            this.collection.saveQueued();
            //alert(new Date()-now);
        },
        
        // Add all items in the **Todos** collection at once.
        addAll: function() {
            // create element in memory 
            var $el = this.$('#todo-list').clone(true,true); 
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
            this.renderStats();
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