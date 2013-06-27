define(['jquery', 'backbone', 'engine', 'handlebars', 'views/BaseView', 'text!templates/CorpCharts.html', 'models/CorpCharts', 'views/CorpPiecesPerHour', 'views/jqplot', 'models/jqplot','bootstrap'], 
function($, Backbone, E, Handlebars, BaseView, template,Model, PiecesPlot, BasePlot,BasePlotModel){

    var View = BaseView.extend({
        className: "CorpCharts ofh",
        template: template,
        views: {
            'noi': function(){
                var that = this;
                this.el='';
                this.render = function(){
                    this.el = '<div>Hey our rendering function is working Number Of Items</div>';
                    return this;
                }
            },
            'nop': function(){
                var that = this;
                this.el='';
                this.render = function(){
                    this.el = '<div>Hey our rendering function is working Number Of PIDs</div>';
                    return this;
                }
            }
        },
        tabs: {
            'pph': new PiecesPlot()
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
           this.currentTab = this.tabs['pph'];
        },
        onRender: function(){
            this.$('#pph').html( this.currentTab.render().el);
            this.$('.accordion-group').on('show', function(){
                $(this).find(".icon-chevron-right").removeClass("icon-chevron-right").addClass("icon-chevron-down");
            }).on('hide', function(){
                $(this).parent().find(".icon-chevron-down").removeClass("icon-chevron-down").addClass("icon-chevron-right");
            });                     
        },
        tabChange: function(e){
            var str = e.target + '';
            var target = str.slice(str.indexOf('#') + 1);
            //require(new view)
            if(!this.tabs[target])
                this.currentTab = new this.views[target];
            else
                this.currentTab = this.tabs[target];          
            this.$('#' + target).html( this.currentTab.render().el);
        }
    });
    // Returns the View class
    return View;
});