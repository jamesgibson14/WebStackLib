define(['jquery', 'backbone', 'engine', 'handlebars', 'models/PSDetail', 'text!templates/InventoryApp.html', 'models/PIDs','views/PIDDetail'], 
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
            'change #iPID':'loadPID',
            'click .loadtable': 'loadPID',
            'click .btnRun': 'runEntry',
            'click .filter': 'filter'        
        },
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','change','enterPeopleSoftScript','tester','filter');
            this.collection.bind('reset',     this.filter);
            //alert(this.collection.sql);
        },
        loadPID: function(){
            var that = this;
            var pid = this.$('#iPID').val();
            //alert(pid);
            this.collection.sql = "Execute dbo.spDataIntegrity @pid = '" + pid + "', @inventory = 1";
            E.loading(this.$el,that.collection.fetch,this.collection);
            //this.collection.fetch();
        },
        // Re-render the contents of the todo item.
        render: function() {
            //var temp = this.model.toJSON();
            
            var temp = this.template({});
            
            this.$el.html( temp );

            //if((document.location + '').indexOf('.hta','.hta')>-1) 
                //this.$('#autoentry').attr('src','http://scmprd2005.smead.us:7001/servlets/iclientservlet/PRD/?cmd=login');
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
            
            var that = this;
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
            this.$('#collection-stats').html('Total rows: ' + this.filteredModels.length);
            E.hideLoading();             
        },
        runEntry: function(){
            var url = 'http://scmprd2005.smead.us:7001/servlets/iclientservlet/PRD/?cmd=login';
            var node =this.$el.find('#autoentry')
            var that = this;
            //alert(node.attr('src'));
            
            node.show()
            
            this.job = this.tester('step1');
            this.job.run();
            //that.enterPeopleSoftScript('step1');         
          
        }
    });
	
    // Returns the View class
    return View;
});