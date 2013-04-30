define(['jquery', 'backbone', 'engine', 'handlebars', 'views/BaseView', 'text!templates/cellsuggestion.html', 'models/cellsuggestion'], 
function($, Backbone, E, Handlebars, BaseView, template,Model){

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
            this.model = new Model({Idea: 'Hello world'})
        },
        onRender: function(){
            this.$el.find('input, textarea').placeholder();
        },
        updateModel: function(e){
            //alert($(e.target).attr('id'));
        }
        
    
    });
    // Returns the View class
    return View;
});