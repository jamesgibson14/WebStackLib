define(['jquery', 'backbone', 'engine','handlebars', 'views/BaseView',  'text!templates/MachPerfApp.html','models/machineperformanceCollection','views/machineperformance'], 
function($, Backbone, E, Handlebars, BaseView, template, collection,subView){
    debugger;
    var View = BaseView.extend({

        tagName:  "div",
        className: 'MachPerfApp',
        collection: new collection(),
        filteredModels: [],
        rowViews: [],
        // Our template for the line of statistics at the bottom of the app.
        template: template,
    
        // Delegated events for creating new items, and clearing completed ones.
        events: {
          'click .loadtable': 'addWeekday'
        },
    
        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize: function() {  
            var that = this;
            _.bindAll(this, 'addAll', 'addWeekday');
            this.listenTo(this.collection,'reset',this.removeAll);            
        },
        addWeekday: function(){
            var wkdy = new Date('' + this.collection.at(0).get('Weekday'));
            wkdy = wkdy.format('ddd mmm-d');
            this.$('.day').text(wkdy);
        },
        // Re-render the contents of the todo item.
        onRender: function() {           
            this.collection.fetch({reset:true});
        },
        addAll: function() {
            // create in memory element
            var $ele = this.$('#list')
            var that = this;
            this.collection.each(function(model,index){ 
                var rowView = new subView({model: model});
                var $row =  $ele.find("#m"+model.get('MachineCode')).append(rowView.render().el)
                that.rowViews.push(rowView);
            }); 

            this.addWeekday();
            E.hideLoading();
            setTimeout(function(){
                that.collection.fetch({reset:true});

            },1000 * 60);
        },
        removeAll: function() {
            var that = this;
            $.each(this.rowViews, function(key,view ){ 
                 view.clear()
            }); 

            this.rowViews = [];
            this.addAll();
        }

    });
	
    // Returns the View class
    return View;
});