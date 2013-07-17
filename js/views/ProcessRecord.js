define(['jquery', 'backbone', 'engine', 'views/BaseView', 'text!templates/ProcessRecord.html', 'models/ProcessRecord'], 
function($, Backbone, E, BaseView, template, Collection){

    var View = BaseView.extend({

        tagName:  "div",
        className: 'ProcessRecord ofh',
        collection: new Collection(),
        template: template,
        initialize: function() {            
            this.listenTo(this.collection,'reset',this.render);  
        },
        serializeData: function(){
            var context = {};
            if(this.collection.length < 1){
                context.error = 'No Data'; 
            }
            else { 
                var model = this.collection.at(0)
                context = $.extend(context,model.toJSON());
                context.Date =  new Date(context.Date).format('mm/dd/yyyy')
                context.details = this.collection.dataRender();
            }
            return context
        },
        onRender: function() {
            
        }
    });
	
    // Returns the View class
    return View;
});