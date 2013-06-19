define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/ItemVerificationDataEntry.html', 'models/ItemVerificationDataEntry','models/lists'], function($, Backbone, E, Handlebars, template, Model){

    var View = E.BaseView.extend({
        tagName:  "div",
        template: template,    
        events: {
          "focus .editable"              : "edit"
         
        },
    
        initialize: function() {
            var obj ={}
            if (!this.model)
                this.model = new Model(obj);
            this.associateCollection = E.lists.getList('associates');  
            this.itemCollection = E.lists.getList('items');
            this.itemList = this.itemCollection.renderForDataEntry();  
            this.listenTo(this.model,'change', this.render);
            this.listenTo(this.model,'destroy', this.remove,this);                        
        },
        temp: function(){
            this.model.set({ID:30})
            this.model.trigger('sync')  
        },     
        serializeData: function(){
            var obj = this.model.toJSON();
            obj.itemList = this.itemList
            
            return obj;
        },
        edit: function(e){
            var that = this;
            var $container = $(e.currentTarget)
            var attr = $container.attr('data-attr')
            var $input;
            var success = function(){
                that.model.save();
                that.model.trigger('change');
            };
            var options = {
                silent:true
            }
            this.on('edit:success', success);
            switch(attr){
                case "UserName": 
                    options.source = this.associateCollection.renderForDataEntry()
                    $input = this.editAutoComplete(e,options);
                break;
                case "Item": 
                    options.source = this.itemList
                    $input = this.editAutoComplete(e,options);                   
                break;
                case "AssignedTo": 
                    options.source = this.associateList;
                    $input = this.editAutoComplete(e,options);
                break;
                case "Completed": this.model.toggle();
                break;
                case "Clear": this.model.destroy();
                break;
            }             
        }  
    });
    
    // Returns the View class
    return View;
});