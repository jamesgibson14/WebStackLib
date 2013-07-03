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
                alert("Remember to manually adjust printer settings like orientation and color.")
                window.print();
            },100);
        },
        editor: function(){
            
        },
        editText: function(e, options){
            var that = this;
            var $container = $(e.currentTarget)
            var model =  this.model
            var attr = $container.attr('data-attr')            
            var value;            
            var $input;      
            var options = options || {};
            
            var destroy = function () {
                $input.remove();
                model.trigger('change')
            };
            
            var loadValue = function () {
                value = model.get(attr) || "";
                $input.val(value);
                $input[0].defaultValue = value;
                $input.select();
            };
            
            var applyValue = function () {
                var obj = {}
                obj[attr] = $input.val();
                model.set(obj,options);
                that.trigger('edit:success')
            };
            $input = $("<INPUT type=text />")                
                .on("keydown", function (e) {
                    if (e.key === 'Enter') {
                      applyValue()
                      destroy()
                    }
                })
                .focus()
                .select();
            $container.replaceWith($input)
            loadValue(); 
            return $input;  
        },
        editAutoComplete: function(e,options){
            var that = this;
            var $container = $(e.currentTarget)
            var model =  this.model
            var attr = $container.attr('data-attr')
            var label = $container.attr('data-label')
            var value;            
            var $input;
            var source = options.source || [{id: 3,label:'James'},{id: 82,label:'David'},{id: 13,label:'Lynae'}, {id: 33,label:'Carrie'}];
           
            var destroy = function () {
              $input.remove();
              model.trigger('change')
            };
            
            var loadValue = function () {
              value = model.get(attr) || "";
              var result = $.grep(source, function(e){ return e.id == value; });
              value = result.length ? result[0].label : ""; 
              
              $input.focus();
              $input.autocomplete('search',"");
              
            };
            
            var applyValue = function (e, ui) {
                model.set(attr, ui.item.id,options);                
                destroy();
                that.trigger('edit:success')
            };
            var keyHandler = function(e){
                if(e.key !== 'Esc')
                    return;
                destroy();               
            };
            $input = $("<INPUT type=text />")
                .on('blur', function(){destroy();})
                .on('keydown', keyHandler)
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
        },
        editDatePicker: function(e, options){
            var that = this;
            var $container = $(e.currentTarget)
            var model =  this.model
            var attr = $container.attr('data-attr')
            var label = $container.attr('data-label')
            var value;            
            var $input;
           
            var destroy = function () {
                $input.remove();
                model.trigger('change')
            };
            
            var loadValue = function () {
              value = model.get(attr) || "";
              $input.val(value);
              $input[0].defaultValue = value;
              $input.select();
            };
            
            var applyValue = function () {
              model.set(attr, new Date($input.val()),options);
              destroy();
              that.trigger('edit:success');              
            };
            
             $input = $("<INPUT type=text />")
                .on('change', function(){applyValue();destroy();})
                .datepicker();
            $container.replaceWith($input);
            loadValue(); 
            return $input;  
        },
        longTextEditor: function(e,options) {
            var $wrapper;
            var that = this;
            var $container = $(e.currentTarget);
            var model =  this.model;
            var attr = $container.attr('data-attr');           
            var value;            
            var $input;      
            options || (options = {});
                    
            var handleKeyDown = function (e) {
              if (e.key == 'Enter' && e.ctrlKey) {
                applyValue();
              } else if (e.key == 'Esc') {
                e.preventDefault();
                destroy();
              } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
                e.preventDefault();
              } else if (e.which == $.ui.keyCode.TAB) {
                e.preventDefault();
              }
            };
        
            var position = function() {
                $wrapper
                  .css("top", $container.position().top - 5)
                  .css("left", $container.position().left - 15);
            };
        
            var destroy = function () {
                $wrapper.remove();
                model.trigger('change');
            };

            var loadValue = function (item) {
                value = model.get(attr) || "";
                $input.val(value);
                $input[0].defaultValue = value;
                $input.select();
            };
        
            var applyValue = function () {
                var obj = {}
                obj[attr] = $input.val();
                model.set(obj,options);                
                destroy();
                that.trigger('edit:success')
            };

            if(options.popup){
                $wrapper = $("<div style='z-index:10000;position:absolute;background:white;padding:5px;border:2px solid gray; border-radius:10px;'/>")
                    .appendTo($container.parent())
            }
            else{
                $wrapper = $("<div style='padding:5px;'/>");
                $container.replaceWith($wrapper);
            }
                
            $input = $("<textarea style='backround:white;width:90%;height:80px;border:none;outline:0'>")
                .appendTo($wrapper);
            
            $("<div style='text-align:right'><button>Save</button><button>Cancel</button></div>")
                .appendTo($wrapper);
            
            $wrapper.find("button:first").bind("click", applyValue);
            $wrapper.find("button:last").bind("click", destroy);
            $input.bind("keydown", handleKeyDown);
            loadValue();
            position();
            $input.focus().select();
            
            return $wrapper;
        }

        
    });
    
    return E.BaseView;
});