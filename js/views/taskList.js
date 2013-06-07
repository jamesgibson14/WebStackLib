define(['jquery', 'backbone', 'engine','handlebars', 'models/taskList', 'text!templates/taskList.html','text!templates/TodoStats.html','views/task', 'models/task','models/lists'], 
function($, Backbone, E, Handlebars, Model, template, statsTemp, subView, task, Lists){
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
          "click .print": "print"
        },
        initialize: function() {
            this.collection = this.model.tasks;
            _.bindAll(this, 'addOne', 'addAll', 'render','renderStats','reOrder');
            this.listenTo(this.collection,'reset',     this.addAll);
            this.statsTemplate = Handlebars.compile(this.statsTemplate);
            subView = subView.extend({
                associateList: E.lists.getList('associates')
            })              
        },
        onRender: function(){
            var that = this;
            this.collection.fetch({reset:true});  
            this.input = this.$("#new-todo");
            this.renderNew();
        },
        renderStats: function() {
            var done = this.collection.done().length;
            var remaining = this.collection.remaining().length;
    
            this.$('#todo-stats').html(this.statsTemplate({
                total:      this.collection.length,
                done:       done,
                remaining:  remaining
            }));
        },
    
        // Add a single task to the list by creating a view for it, and
        // appending its element to the `<ul>`.
        addOne: function(model) {
            var view = new subView({model: model});
            this.$("#todo-list").append(view.render().el);
            this.renderStats();
        },
        renderNew: function(){            
            var that = this;
            var view = new subView({model: null});
            view.model.collection = this.collection;
            view.model.set({Options: {LP:this.collection.length + 1}})
            this.$("#todo-list").append(view.render().el);
            this.renderStats();
            view.model.once('sync',function(){
                view.model.trigger('change');               
                that.collection.add(view.model)                
                that.renderNew();
            })
        },
        reOrder: function(e, ui) {
            //alert('pos: ' + ui.item.index() + ', ' + ui.placeholder.index());
            var now = new Date();
            var startAt = ui.item.index();
            var that = this;
            this.$('div.todo').each(function(i){
                var id = $(this).attr('data-id');
                if (!id)
                    return;
                var model = that.collection.get(id);
                var obj = $.extend({},model.get('Options'),{LP:i + 1})
                model.set({Options: obj});                
                that.collection.sqlqueue += ';' + model.update({queue:true})
            });
            this.collection.saveQueued();
        },
        
        // Add all items in the **Todos** collection at once.
        addAll: function() {
            this.filteredModels = this.collection.models;
            
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
        }

    });
	
    // Returns the View class
    return View;
});