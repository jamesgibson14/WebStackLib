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
            this.listenTo(this.model,'change', this.render);
            this.listenTo(this.model,'destroy', this.remove,this);                        
        },
        temp: function(){
            this.model.set({ID:30});
            this.model.trigger('sync'); 
        },     
        serializeData: function(){
            var obj = this.model.toJSON();
            //obj.itemList = this.itemList
            obj.DateEntered = obj.DateEntered.format("mm/dd/yyyy")
            
            return obj;
        },
        edit: function(e){
            var that = this;
            var $container = $(e.currentTarget);
            var attr = $container.attr('data-attr');
            var $input;
            var success = function(){
                that.model.save();
                that.model.trigger('change');
            };
            var options = {
                silent:true,
                $input: ($container.is('input')) ? $container : false
            }
            this.on('edit:success', success);
            switch(attr){
                
                case "Item":
                    options.collection = this.itemCollection;
                    $input = this.editAutoComplete(e,options);                   
                break;
                case "InventoryStatus":                    
                    options.source = [
                        {id: 'Physically Short',label: 'Physically Short'},
                        {id: 'Physically Over',label: 'Physically Over'},
                        {id: 'Unknown',label: 'Unknown'}
                    ];
                    $input = this.editAutoComplete(e,options);                   
                break;
                case "ErrorType": 
                    $input = this.longTextEditor(e,options);
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