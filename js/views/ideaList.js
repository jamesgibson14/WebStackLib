define(['jquery', 'backbone', 'engine','handlebars', 'text!templates/ideaList.html','text!templates/ideaListItem.html'], 
function($, Backbone, E, Handlebars, template, itemTemp){
    var View = Backbone.View.extend({

        tagName:  "div",
        id: 'ideaList',
        className: 'border boxpad left',
        filteredModels: [],

        // Our template for the line of statistics at the bottom of the app.
        template: template,
        itemTemplate: itemTemp,
    
        // Delegated events for creating new items, and clearing completed ones.
        events: {
          
        },
    
        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize: function() {
            _.bindAll(this, 'render', 'addOne','updateStats');

            this.listenTo(this.collection,'reset',this.filter);             
            this.listenTo(this.collection,'add',this.addOne);
            
            this.template = Handlebars.compile(this.template);
            this.itemTemplate = Handlebars.compile(this.itemTemplate);
            var temp = this.template({});
            this.$el.html( temp );
            
           //this.collection.fetch();
           
        },
        render: function(){
            this.collection.each(this.addOne)
            return this;
        },
        addOne: function(model) {

            var html = this.itemTemplate(model)

            var $temp = $(html);
            
            this.$(".list tbody").append($temp);
            $temp.toggleClass("dataSuccess",700).toggleClass("dataSuccess",700).toggleClass("dataSuccess",700).toggleClass("dataSuccess",700);
            this.updateStats()
        },
        updateStats: function(){
            this.$('#todo-stats').html('Total Suggesions Entered: ' + this.collection.length);
        }
    });
	
    // Returns the View class
    return View;
});