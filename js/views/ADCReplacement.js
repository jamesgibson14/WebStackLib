define(['jquery', 'backbone', 'engine', 'handlebars', 'views/BaseView', 'text!templates/ADCReplacement.html'], 
function($, Backbone, E, Handlebars, BaseView,  template){

    var View = BaseView.extend({
        className: 'ADCReplacement',
        template: template,
        // View constructor
        initialize: function() {
            
        },
        serializeData: function(){
            return {};
        },
        onRender: function() {
            
        }

    });
	
    // Returns the View class
    return View;
});