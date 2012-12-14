define(['jquery', 'backbone', 'engine', 'handlebars', 'models/model', 'text!templates/main.html', 'models/collection','views/plot','views/idea',], 
function($, Backbone, E, Handlebars, Model, template, Collection,plotV,ideaV){

    var View = Backbone.View.extend({
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
            this.model = new Model();
            _.bindAll(this,'render');
            // Setting the view's template property
            this.template = Handlebars.compile(this.template);			
        },
        events: {
            'click #todoview': 'loadlink',
            'click #restart':'restart'
	    },
        render: function() {
            var temp = this.model.toJSON();
            var that = this;
            _.extend(temp,E.user.toJSON());
            this.$el.append(this.template(temp));
            
            this.$('#tabsmenu').buttonset()
            this.$('#links').menu({role: "null"});
            this.$('#ialpha').combobox();
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
            $( ".resizable" ).resizable({handles: "se"});
            this.$('#sidebarBtns').on('click','label', function(e){
                var curView = $(this).prev().attr('data-view');
                
                if(that.sidebuttons.active == curView){
                    $(this).removeClass('ui-state-active');
                    dialog.dialog('close')
                    that.sidebuttons.active = null
                }
                else{
                    debugger;
                    var view = new ideaV();
                    var html = view.render().el;
                
                    that.sidebuttons.active = curView;
                    
                    $('#dialog-form .content').html(html);
                    dialog.dialog('option','buttons',{});
                    dialog.dialog('open')
                    
                }
                e.preventDefault()
            })
            var graph = new plotV();
            this.$('#mainview').append(graph.render().el)         

            return this;
        },
        afterRender: function() {
            //this.$('#sidebarBtns').position({my:'bottom',at:'right bottom',of:'#footer',collision:'none'})
            this.$('#sidebarBtns > input').button({text:false})
            this.$('#sidebarBtns > input').each(function(value){
                var btn = $(this);
                var icon = btn.attr('data-icon');
                //alert(icon)
                
                btn.button('option','icons',{primary:icon})
                btn.css('height','50px')
            })
            this.$('#sidebarBtns > label').hover(function(e){
                $(this).width(function(index, width){return width+50}).prepend( "<span class='tempspan'>title</span>" );
            },function(e){
                $(this).width(function(index, width){return width-50}).find('.tempspan').remove();
            })
            this.$('#sidebarBtns > label').css({'display':'block'});
            
             $( ".column" ).sortable({            
                 connectWith: ".column"        
             });         
             $( ".portlet" ).addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )            
                 .find( ".portlet-header" )                
                 .addClass( "ui-widget-header ui-corner-all" )                
                 .prepend( "<span class='ui-icon ui-icon-minusthick'></span>")                
                 .end()            
                 .find( ".portlet-content" );         
             $( ".portlet-header .ui-icon" ).click(function() {            
                 $( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );            
                 $( this ).parents( ".portlet:first" ).find( ".portlet-content" ).toggle();        
             });         
             $( ".column" ).disableSelection();
            
            //var height = this.$el.height();
            //alert(height)
            //this.$el.height(height-300);
        },
        loadlink: function(e){
        	var id = $(e.currentTarget).attr('id');
        	$('#mainview').html('YOu loaded ' + id);        	
        	//define(['jquery','backbone'])        	
        },
        restart: function(){
            window.location = this.location + '';
        }

    });
	
    // Returns the View class
    return View;
});