define(['jquery', 'backbone', 'engine', 'handlebars', 'models/IdeaApp', 'text!templates/IdeaApp.html', 'models/PSDetails','views/PSDetail'], 
function($, Backbone, E, Handlebars, Model, template, Collection, subView){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'PSApp',
        collection: new Collection(),
        filteredModels: [],
        filters: false,
        template: template,
        events: {
            'blur .pid':'change',
            'click .loadtable': 'loadData',
            'click .filter': 'filter'        
        },
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','change','filter');
            this.collection.bind('reset',     this.filter);
            
        },
        loadData: function(){
            this.collection.fetch();
        },
        // Re-render the contents of the todo item.
        render: function() {
            //var temp = this.model.toJSON();
            
            var temp = this.template({});
            
            this.$el.html( temp );
            return this;
        },
        change: function(){
            
            var newvalue = this.$el.find('.pid').val();
            this.model.set({pid: newvalue})
        },
        filter: function(){
            //alert('filter and sort');
            debugger;
            //this.collection.sort({silent:true});
            //alert('filters: ' + this.filters);
            if(this.filters)
                this.filteredModels = this.collection.filter(function(model){
                    _.each(this.filters,function(filter){
                        filter(model)
                    })
                });
            else
                this.filteredModels = this.collection.models
            
            this.addAll();
        },
        addAll: function() {
            // create in memory element
            var $el = this.$('#pidList').clone(true,true);
            var header = $el.find('.header').clone(true,true);
            // also get the `className`, `id`, `attributes` if you need them 
            $el.empty();
            $el.append(header);
            // append everything to the in-memory element 
            _.each(this.filteredModels, function(model){ 
                var rowView = new subView({model: model}); 
                $el.append(rowView.render().el); 
            }); 
            // replace the old view element with the new one, in the DOM 
            this.$("#pidList").replaceWith($el);//.replaceWith($el);             
        }
    });
	
    // Returns the View class
    return View;
});