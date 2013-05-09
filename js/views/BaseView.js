define(['jquery', 'backbone', 'engine', 'handlebars' ], 
function($, Backbone, E, Handlebars){

    E.BaseView = Backbone.View.extend({

        tagName:  "div",
        constructor: function(){
            Backbone.View.apply(this, arguments);

            this.buildTemplateCache();
        },
        buildTemplateCache: function(){
            var proto = Object.getPrototypeOf(this);
        
            if (proto.templateCache) { 
                return; 
            }
            proto.templateCache = Handlebars.compile(this.template);
        },        
        render: function(){
            var data = {};
            if (this.serializeData){
                data = this.serializeData();
            };
            
            // use the pre-compiled, cached template function
            var renderedHtml = this.templateCache(data);
            this.$el.html(renderedHtml);
            
            if (this.onRender){
                this.onRender();
            }
            return this;
        },
        print: function(options){
            /*
               * &b = break/space
               * &w = page title
               * &p / &P = current page / Total pages
               * &u = url
               * &d = short date
           */
            var defaults = {
                HKEY_Root: "HKEY_CURRENT_USER",
                HKEY_Path: "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\",
                HKEY_Keys: {
                    header: "&w &b on page 00 yards, &p / &P",
                    footer: "&u &b &d",
                    Shrink_To_Fit: "10%"
                }
            }
            $.extend(defaults,options);
            function PageSetup_Null (){
              try{
                var Wsh = new ActiveXObject("WScript.Shell");
                $.each(defaults.HKEY_Keys,function(key, value){
                   Wsh.RegWrite (defaults.HKEY_Root + defaults.HKEY_Path + key ,value); 
                })
              }catch (e) {}
            }              
            PageSetup_Null();
            
            setTimeout(function(){
                window.print();
            },500);
        }
        
    });
    
    return E.BaseView;
});