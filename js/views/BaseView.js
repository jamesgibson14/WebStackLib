define(['jquery', 'backbone', 'engine', 'handlebars' ], 
function($, Backbone, E, Handlebars){

    E.BaseView = Backbone.View.extend({

        tagName:  "div",
        constructor: function(){
            Backbone.View.apply(this, arguments);

            this.buildTemplateCache();
        },
        buildTemplateCache: function(){
            var proto = Object.getPrototypeOf(this);
        
            if (proto.templateCache) { 
                return; 
            }
            proto.templateCache = Handlebars.compile(this.template);
        },        
        render: function(){
            var data;
            if (this.serializeData){
                data = this.serializeData();
            };
            
            // use the pre-compiled, cached template function
            var renderedHtml = this.templateCache(data);
            this.$el.html(renderedHtml);
            
            if (this.onRender){
                this.onRender();
            }
            return this;
        }
        
    });
    
    return E.BaseView;
});