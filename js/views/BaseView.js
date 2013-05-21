define(['jquery', 'backbone', 'engine', 'handlebars' ], 
function($, Backbone, E, Handlebars){

    E.BaseView = Backbone.View.extend({

        tagName:  "div",
        constructor: function(){
            Backbone.View.apply(this, arguments);
            _.bindAll(this,'editText')
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
                    header: "&w &b &D",
                    footer: "&b &b &p / &P",
                    Shrink_To_Fit: "yes",
                    Print_Background: "no"
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
        },
        editor: function(){
            
        },
        editText: function(e){
            debugger;
            
            var $container = $(e.currentTarget)
            var model =  this.model
            var attr = $container.attr('data-attr')
            var value;            
            var $input;
            
            $input = $("<INPUT type=text class='editor-text' />")
                  .appendTo(e.currentTarget)
                  .on("keydown", function (e) {
                    if (e.key === 'Enter') {
                      applyValue()
                      destroy()
                    }
                  }).autocomplete({
                      autoFocus: true,
                      delay: 0,
                      minLength:  0,
                      source: ['James','David','Samual']
                  })
                  .focus()
                  .select();
            
            var destroy = function () {
              $input.remove();
            };
            
            var loadValue = function () {
              value = model.get(attr) || "";
              $input.val(value);
              $input[0].defaultValue = value;
              $input.select();
            };
            
            var applyValue = function () {
              model.set(attr, $input.val());
            };
            loadValue(); 
            return $input;  
        }
        
    });
    
    return E.BaseView;
});