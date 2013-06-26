define(['jquery', 'backbone', 'engine', 'handlebars', 'views/BaseView', 'text!templates/CorpCharts.html', 'models/CorpCharts', 'views/CorpPiecesPerHour','bootstrap'], 
function($, Backbone, E, Handlebars, BaseView, template,Model, Chart){

    var View = BaseView.extend({
        className: "CorpCharts ofh",
        template: template,
        tabs: {
            
        },
        serializeData:function(){
            var obj = {};//this.model.toJSON();  
            return obj;
        },
        events: {
            'focus .editable': 'edit',
            'show a[data-toggle="tab"]': 'tabChange'
        },
        initialize: function(){
           this.currentTab = new Chart();
        },
        onRender: function(){
                                  
        },
        tabChange: function(e){
            var str = e.target + '';
            var target = str.slice(str.indexOf('#'));
            alert(target)            
            this.$(target).html( this.currentTab.render().el);
        }
    });
    // Returns the View class
    return View;
});