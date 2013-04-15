define(['jquery', 'backbone', 'engine', 'handlebars', 'models/InventoryApp', 'text!templates/InventoryApp.html', 'models/PIDs','views/PIDDetail', 'views/SlickGrid'], 
function($, Backbone, E, Handlebars, Model, template, Collection, subView,SlickGrid){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'PSApp',
        collection: new Collection(),
        filteredModels: [],
        model: new Model(),
        filters: false,
        template: template,
        events: {
            'blur .pid':'change',
            'change #iPID':'loadPID',
            'click .loadtable': 'loadPID',
            'click .filter': 'filter'        
        },
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','change','enterPeopleSoftScript','tester','filter');
            this.SlickGrid = new SlickGrid()
            this.collection.bind('reset',     this.filter);
            //alert(this.collection.sql);
        },
        loadPID: function(){
            var that = this;
            var pid = this.$('#iPID').val();
            //alert(pid);
            this.collection.sql = "Execute dbo.spDataIntegrity @pid = '" + pid + "', @inventory = 1";
            E.loading(this.$el,that.collection.fetch,this.collection);
            var options = {
                sql: "SELECT Top 10 * FROM Items"
            };
            html = this.SlickGrid.render(options).el
            this.$('#slickGrid').html(html)
            setTimeout(function(){
                
                that.SlickGrid.postRender();
            },1)
        },
        // Re-render the contents of the todo item.
        render: function() {
            var temp = this.model.toJSON();
            
            var temp = this.template(temp);
            
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
        }
    });
	
    // Returns the View class
    return View;
});