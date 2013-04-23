define(['jquery', 'backbone', 'engine', 'handlebars', 'views/BaseView', 'text!templates/cellsuggestion.html'], function($, Backbone, E, Handlebars, BaseView, template){

    var View = BaseView.extend({
        className: "CellSuggestion ofh",
        template: template,
        serializeData:function(){
            return {
                suggestion: "this is a test"
            }
        },
        events: {
            'blur input': 'updateModel'
        },
        initialize: function(){
            
        },
        onRender: function(){
            this.$el.find('input, textarea').placeholder();
        },
        updateModel: function(e){
            alert($(this).attr('id'));
        }
        
    
    });
    // Returns the View class
    return View;
});