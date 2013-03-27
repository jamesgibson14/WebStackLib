define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/SlickGrid.html', 'models/SlickGrid', 'slickgrid'], 
function($, Backbone, E, Handlebars, template, Collection, slickgrid){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'SlickGrid',
        collection: new Collection(),
        template: template,
        initialize: function() {
            _.bindAll(this, 'render','afterRender');   
        },
        render: function(Record_ID) {
            
            var html;            
            html = "<div>No data found</div>"   
                  
                
            this.$el.html( html );

            return this;
        },
        afterRender: function(){
            
        }
    });
    
    // Returns the View class
    return View;
});