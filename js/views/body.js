define(['jquery', 'backbone', 'engine', 'handlebars', 'views/BaseView', 'models/model', 'text!templates/body.html'], 
function($, Backbone, E, Handlebars, BaseView, Model, template){

    var View = BaseView.extend({
        // Represents the actual DOM element that corresponds to your View (There is a one to one relationship between View Objects and DOM elements)
        tagName:  "div",
        className: 'SmeadApp relative',
        attributes: {},
        template: template,
        sidebuttons: {},
        location: '' + window.location.href,
        // View constructor
        initialize: function() {
            // Setting the view's model property to the passed in model
            this.model = new Model($.extend(this.options,E.user.toJSON()));            		
        },
        serializeData: function(){
            return this.model.toJSON();
        },
        events: {
            'click #restart':'restart'
	    },
        onRender: function() {
            
            var that = this;
            var dialog = this.$( "#dialog-form" ).dialog({
                autoOpen:false,
                buttons: {
                    "Ok":function(){
                        $(this).find('.content').append("<input type='text' /><br /><input type='text' /><br /><input type='text' /><br /><input type='text' /><br /><input type='text' /><br /><input type='text' /><br /><input type='text' />")
                    }
                },
                close:function(){
                    $('.ui-state-active').click();
                }
            });
            this.$('#tabsmenu').buttonset()            
            this.$('#sidebarBtns > input').button({text:false})
            this.$('#sidebarBtns > input').each(function(value){
                var btn = $(this);
                var icon = btn.attr('data-icon');
                btn.button('option','icons',{primary:icon})
                btn.css('height','50px')
            })
            this.$('#sidebarBtns label').css({'display':'block'})
            this.$('#sidebarBtns').on('click','label', function(e){
                var curView = $(this).prev().attr('data-view');
                
                if(that.sidebuttons.active == curView){
                    $(this).removeClass('ui-state-active');
                    dialog.dialog('close')
                    that.sidebuttons.active = null
                }
                else{
                    //var html = "<div>Hello World</div"
                
                    that.sidebuttons.active = curView;
                    
                    //$('#dialog-form .content').html(html);
                    //dialog.dialog('option','buttons',{});
                    dialog.dialog('open')
                    
                }
                e.preventDefault()
            })  
            return this;
        },
        restart: function(){
            if(E.views.currentView)
                window.location = this.location + '?module=' + E.views.currentView;
            else
                window.location = this.location + '';
        }

    });	
    return View;
});