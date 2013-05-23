define(['jquery', 'backbone', 'engine', 'handlebars' ], 
function($, Backbone, E, Handlebars){

    E.BaseView = Backbone.View.extend({

        tagName:  "div",
        constructor: function(){
           _.bindAll(this, "render");    
           var args = Array.prototype.slice.apply(arguments);    
           Backbone.View.prototype.constructor.apply(this, args);
           
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
            $input = $("<INPUT type=text />")
                .appendTo(e.currentTarget)
                .on("keydown", function (e) {
                    if (e.key === 'Enter') {
                      applyValue()
                      destroy()
                    }
                })
                .focus()
                .select();
            loadValue(); 
            return $input;  
        },
        editAutoComplete: function(e){
            debugger;
            
            var $container = $(e.currentTarget)
            var model =  this.model
            var attr = $container.attr('data-attr')
            var label = $container.attr('data-label')
            var value;            
            var $input;
            var source = [{id: 3,label:'James'},{id: 82,label:'David'},{id: 13,label:'Lynae'}, {id: 33,label:'Carrie'}];
           
            var destroy = function () {
              $input.remove();
            };
            
            var loadValue = function () {
              value = model.get(attr) || "";
              var result = $.grep(source, function(e){ return e.id == value; });
              value = result[0].label
              
              $input.focus();
              $input.autocomplete('search',"");
              
            };
            
            var applyValue = function (e, ui) {
              model.set(attr, ui.item.id,{silent:true});
              model.set(label, ui.item.label);
              destroy();
            };
            
             $input = $("<INPUT type=text />")
                .on('blur', function(){destroy();model.trigger('change')})
                 .autocomplete({
                      autoFocus: true,
                      delay: 0,
                      minLength:  0,
                      source: source,
                      select: applyValue
                  })
            $container.replaceWith($input)
            loadValue(); 
            return $input;  
        }
        
    });
    
    return E.BaseView;
});