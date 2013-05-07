define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/ProcessRecord.html', 'models/ProcessRecord'], 
function($, Backbone, E, Handlebars, template, Collection){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'ProcessRecord ofh',
        collection: new Collection(),
        template: template,
        initialize: function() {
            _.bindAll(this, 'render');   
        },
        render: function(Record_ID) {
            this.collection.sqlArgs = [Record_ID || 48285]
            this.collection.fetch();
            var html;
            if(this.collection.length>0){
                var ctemp = Handlebars.compile(this.template);
                var context = {};
                var model = this.collection.at(0)
                context = $.extend(context,model.toJSON());
                context.details = this.collection.dataRender();
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