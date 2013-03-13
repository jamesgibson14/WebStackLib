define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/ProcessRecord.html', 'models/ProcessRecord'], 
function($, Backbone, E, Handlebars, template, Collection){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'ProcessRecord',
        collection: new Collection(),
        template: template,
        initialize: function() {
            _.bindAll(this, 'render');   
        },
        render: function(Record_ID) {
            this.collection.sqlArgs = [Record_ID]
            this.collection.fetch();
            var html;
            if(this.collection.length>0){
                var ctemp = Handlebars.compile(this.template);
                var context = {};
                context.details = this.collection.toJSON();
                html = ctemp(context);
            }
            else{
                html = "<div>No data found</div>"   
            }       
                
            this.$el.html( html );

            return this;
        }
    });
	
    // Returns the View class
    return View;
});