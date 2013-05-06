define(['jquery', 'backbone', 'engine', 'handlebars', 'views/BaseView', 'models/model', 'text!templates/main.html', 'models/collection','views/plot','views/idea','app/engine.outlook'], 
function($, Backbone, E, Handlebars, BaseView, Model, template, Collection,plotV,ideaV){

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
            'click #todoview': 'loadlink',
            'click #restart':'restart'
	    },
        onRender: function() {
            if (!this.options.module){
                $('#mainview').html('<span>Database Interaction... <img src="assets/images/ajax-loader2.gif" /></span>')
                this.$('#testbuttons > div').button();
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
                this.$('#mainview').prepend(graph.render().el)         
                //var wshshell=new ActiveXObject("wscript.shell");
                //var objShell = new ActiveXObject("shell.application");
                //wshshell.run("powershell ./test.ps1")
                //objShell.ShellExecute('powershell.exe','./test.ps1','c:\temp',null,0);
                //E.outlook.sendMail('test','testing email','gibsonj')
                //E.outlook.getTasks()
            }
            //this.$('#sidebarBtns').position({my:'bottom',at:'right bottom',of:'#footer',collision:'none'})
            this.$('#sidebarBtns > input').button({text:false})
            this.$('#sidebarBtns > input').each(function(value){
                var btn = $(this);
                var icon = btn.attr('data-icon');
                //alert(icon)
                
                btn.button('option','icons',{primary:icon})
                btn.css('height','50px')
            })
            this.$('#sidebarBtns > label').css({'display':'block'})
            .hover(function(e){
                var $el = $(this)
                $el.prepend( "<span class='tempspan'>title</span>" )
                $el.width(function(index, width){return width+150});
            },function(e){
                var $el = $(this)
                $el.find('.tempspan').remove()
                $el.width(function(index, width){return width-150});
            })
            //this.$('#sidebarBtns > label').css({'display':'block'});
            
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
            
            return this;
        },
        loadlink: function(e){
        	var id = $(e.currentTarget).attr('id');
        	$('#mainview').html('YOu loaded ' + id);        	
        	//define(['jquery','backbone'])        	
        },
        restart: function(){
            if(E.views.currentView)
                window.location = this.location + '?module=' + E.views.currentView;
            else
                window.location = this.location + '';
        }

    });
	
    // Returns the View class
    return View;
});