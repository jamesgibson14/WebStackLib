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
          'click .loadtable': 'loadData'
        },
    
        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize: function() {            
            this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','filter','addAll', 'loadData');
            this.collection.bind('reset',     this.filter);
           var that = this;
           setTimeout(function(){
                    debugger;
                    if(E.ui == 'hta')
                        document.location = document.location.pathname + '?module=MachPerfApp';
                    else
                        alert(document.location = document.location.pathname.slice(1) + '?module=MachPerfApp')
               },1000*60*10);
        },
        loadData: function(){
            debugger;
            //alert(this.filteredModels.length);
            var that = this;
            $.each(this.filteredModels,function(index,model){              
                that.filteredModels[0].destroy();            
            });

            //this.filteredModels = []
            this.collection.fetch();
        },
        // Re-render the contents of the todo item.
        render: function() {
            //var temp = this.model.toJSON();
            this.$el.empty();
            var temp = this.template({});
            
            this.$el.html( temp );

            if((document.location + '').indexOf('.hta','.hta')>-1) 
                this.$('#autoentry').attr('src','http://scmprd2005.smead.us:7001/servlets/iclientservlet/PRD/?cmd=login');
            this.collection.fetch();
            return this;
        },
        filter: function(){
            //alert('filter and sort');
            //this.collection.sort({silent:true});
            //alert('filters: ' + this.filters);
            //alert(this.collection.length);
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
            var header = $ele.find('.header').clone(true,true);
            // also get the `className`, `id`, `attributes` if you need them 
            $ele.empty();
            $ele.append(header);
            // append everything to the in-memory element 
            
            _.each(this.filteredModels, function(model,index){ 
                var cl = 'row'
                if (index % 2 !=0) cl = 'row odd'
                var rowView = new subView({model: model,className: cl}); 
                $ele.append(rowView.render().el); 
            }); 
            // replace the old view element with the new one, in the DOM 
            this.$("#list").replaceWith($ele);//.replaceWith($el); 
            
        }

    });
	
    // Returns the View class
    return View;
});