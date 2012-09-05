define(['jquery', 'backbone', 'engine','handlebars',  'text!templates/MachPerfApp.html','models/machineperformanceCollection','text!templates/MachPerfApp.html','views/machineperformance'], 
function($, Backbone, E, Handlebars, template, collection,statsTemp,subView){
    debugger;
    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'MachPerfApp',
        collection: new collection(),
        filteredModels: [],

        // Our template for the line of statistics at the bottom of the app.
        template: template,
        statsTemplate: statsTemp,
    
        // Delegated events for creating new items, and clearing completed ones.
        events: {
          'click .loadtable': 'addWeekday'
        },
    
        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize: function() {            
            this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','filter','addAll', 'addWeekday');
            this.collection.bind('reset',     this.filter);
           var that = this;
           setTimeout(function(){
                    
                    debugger;
                    if(E.ui == 'hta')
                        document.location = document.location.pathname + '?module=MachPerfApp';
                    else
                        document.location = document.location.pathname.slice(1) + '?module=MachPerfApp';
                    
                   //that.collection.fetch();
               },1000*60*10);
        },
        addWeekday: function(){
            debugger;
            var wkdy = new Date('' + this.filteredModels[0].get('Weekday'));
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
            this.collection.fetch();
            return this;
        },
        filter: function(){
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
            var $ele = this.$('#list').clone(true,true);
            
            _.each(this.filteredModels, function(model,index){ 
                var rowView = new subView({model: model});
                var screenRow =  $ele.find("#m"+model.get('MachineCode'));
                screenRow.append(rowView.render().el); 
            }); 
            
            // replace the old view element with the new one, in the DOM 
            this.$("#list").replaceWith($ele);//.replaceWith($el); 
            this.addWeekday();
        }

    });
	
    // Returns the View class
    return View;
});