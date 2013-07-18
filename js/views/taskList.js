define(['jquery', 'backbone', 'engine','handlebars', 'models/taskList', 'text!templates/taskList.html','text!templates/TodoStats.html','views/task', 'models/task','models/lists'], 
function($, Backbone, E, Handlebars, Model, template, statsTemp, subView, task){
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
            var that = this;
            this.collection = this.model.tasks;
            _.bindAll(this, 'addOne', 'addAll', 'render','renderStats','reOrder');
            this.listenTo(this.collection,'reset',     this.addAll);
            this.statsTemplate = Handlebars.compile(this.statsTemplate);
            subView = subView.extend({
                associateCollection: E.lists.getList('associates'),
                associateList: E.lists.getList('associates').renderForDataEntry()
            });            
        },
        onRender: function(){
            var that = this;
            
            if(this.options.isNew)
                this.collection.reset(this['defaultTasks' + this.options.IdeaType])
            else
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
        addOne: function(model) {
            var view = new subView({model: model});
            this.$("#todo-list").append(view.render().el);
            this.renderStats();
        },
        renderNew: function(){            
            var that = this;
            var view = new subView({model: null});
            var obj = {}
            view.model.collection = this.collection;
            obj.Options = {LP:this.collection.length + 1}
            if(this.options.Item_ID)
                obj.Item_ID = this.options.Item_ID;
            view.model.set(obj)
            this.$("#todo-list").append(view.render().el);
            this.renderStats();
            view.model.once('sync',function(){
                view.model.trigger('change');               
                that.collection.add(view.model);           
                that.renderNew();
            })
        },
        reOrder: function(e, ui) {
            //alert('pos: ' + ui.item.index() + ', ' + ui.placeholder.index());
            var now = new Date();
            var startAt = ui.item.index();
            var that = this;
            this.$('div.task').each(function(i){
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
        addAll: function() {
            this.filteredModels = this.collection.models;
            
            // create element in memory 
            var $el = $('<ul id="todo-list" />');
            $el.empty();
            // append everything to the in-memory element 
            _.each(this.filteredModels, function(model){ 
                var rowView = new subView({model: model}); 
                $el.append(rowView.render().el); 
            });
            // replace the old view element with the new one, in the DOM 
            this.$(".container").html($el);
            this.renderStats();
        },
        defaultTasksCell: [
            {Task: 'Approval', Options:{LP:1}},
            {Task: 'Design', Options:{LP:2}},
            {Task: 'Planning', Options:{LP:3}},
            {Task: 'Fabrication', Options:{LP:4}},
            {Task: 'Installation', Options:{LP:5}}
        ],
        defaultTasksApp: [
            {Task: 'Prioritize'},
            {Task: 'Backend'},
            {Task: 'Frontend'},
            {Task: 'Fabrication'},
            {Task: 'Installation'}
        ]

    });
	
    // Returns the View class
    return View;
});