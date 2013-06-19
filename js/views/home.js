define(['jquery', 'backbone', 'engine', 'handlebars', 'views/BaseView', 'text!templates/home.html', 'raphael', 'icons', 'app/engine.outlook'], 
function($, Backbone, E, Handlebars, BaseView,  template, Raphael, Icons){

    var View = BaseView.extend({
        // Represents the actual DOM element that corresponds to your View (There is a one to one relationship between View Objects and DOM elements)
        tagName:  "div",
        className: 'relative',
        attributes: {},
        template: template,
        // View constructor
        initialize: function() {
            
        },
        serializeData: function(){
            return E.user.toJSON();
        },
        events: {
            
	    },
        onRender: function() {
            if (!this.options.module){                
                this.$('#testbuttons > div').button();                
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
                var paper = Raphael(this.$('#icon1').get(0),40, 40);
                var c = paper.path(Icons.stopsign).attr({fill: "#000", stroke: "none"});
                var paper = Raphael(this.$('#icon2').get(0),40, 40);
                var c = paper.path(Icons.arrowleft2).attr({fill: "#000", stroke: {stroke: "#fff", "stroke-width": 3, "stroke-linejoin": "round", opacity: 0}});
                var paper = Raphael(this.$('#icon3').get(0),40, 40);
                var c = paper.path(Icons.warning).attr({fill: "#000", stroke: "none"});
                //this.$el.append(c);
                //var wshshell=new ActiveXObject("wscript.shell");
                //var objShell = new ActiveXObject("shell.application");
                //wshshell.run("powershell ./test.ps1")
                //objShell.ShellExecute('powershell.exe','./test.ps1','c:\temp',null,0);
                //E.outlook.sendMail('test','testing email','gibsonj')
                //E.outlook.getTasks()
            }
            return this;
        },
        postRender: function(){
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
            this.$('#ialpha').combobox();
            E.hideLoading()
        }

    });
	
    // Returns the View class
    return View;
});