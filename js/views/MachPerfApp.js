define(['jquery', 'backbone', 'engine','handlebars',  'text!templates/MachPerfApp.html','models/machineperformanceCollection','views/machineperformance'], 
function($, Backbone, E, Handlebars, template, collection,subView){
    debugger;
    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'MachPerfApp',
        collection: new collection(),
        filteredModels: [],

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
            this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','addAll', 'addWeekday');
            this.listenTo(this.collection,'reset',this.addAll);
            setTimeout(function(){
                if(E.ui == 'hta')
                    document.location = document.location.pathname + '?module=MachPerfApp';
                else
                    document.location = document.location.pathname.slice(1) + '?module=MachPerfApp';

            },1000 * 60 * 60);
        },
        addWeekday: function(){
            debugger;
            var wkdy = new Date('' + this.collection.at(0).get('Weekday'));
            wkdy = wkdy.format('ddd mmm-d');
            this.$('.day').text(wkdy);
        },
        // Re-render the contents of the todo item.
        render: function() {
            this.$el.empty();
            var temp = this.template({});
            
            this.$el.html( temp );

            if((document.location + '').indexOf('.hta','.hta')>-1) 
                this.$('#autoentry').attr('src','http://scmprd2005.smead.us:7001/servlets/iclientservlet/PRD/?cmd=login');
            this.collection.fetch({reset:true})
            return this;
        },
        addAll: function() {
            // create in memory element
            var $ele = this.$('#list')
            
            this.collection.each(function(model,index){ 
                var rowView = new subView({model: model});
                var screenRow =  $ele.find("#m"+model.get('MachineCode')).find('.replacable');
                screenRow.replaceWith(rowView.render().el); 
            }); 

            this.addWeekday();
            E.hideLoading();
        }

    });
	
    // Returns the View class
    return View;
});