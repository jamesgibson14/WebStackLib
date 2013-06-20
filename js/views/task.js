define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/task.html', 'models/task'], function($, Backbone, E, Handlebars, template, Model){

    var View = E.BaseView.extend({
        tagName:  "li",
        template: template,    
        events: {
          "click .check"              : "edit",
          "dblclick label.content" : "edit",
          "click span.task-destroy"   : "edit",
          "dblclick .dueAt": "edit",
          "dblclick .AssignedTo": "edit"
        },    
        initialize: function() {
            var obj ={}
            if(this.options.Idea_ID)
                obj.Idea_ID = this.options.Idea_ID;
            if (!this.model)
                this.model = new Model(obj);
            this.listenTo(this.model,'change', this.render);
            this.listenTo(this.model,'destroy', this.remove,this);                        
        },     
        serializeData: function(){
            var obj = this.model.toJSON();
            if(!obj.Completed)
                obj.done =  false
            else {
                obj.done =  true
                obj.Completed = obj.Completed.format('m/d/yyyy h:MM:ss TT')
            }
            if(obj.DueAt)
                obj.DueAt = obj.DueAt.format('m/d/yyyy')
            obj.CreatedByName = (obj.CreatedBy) ? this.associateCollection.get(obj.CreatedBy).get('Name') : "N/A";
            obj.Name = (obj.AssignedTo) ? this.associateCollection.get(obj.AssignedTo).get('Name') : "Assign To";
            obj.isNew = this.model.isNew();
            obj.Completed || (obj.Completed =  '');
            obj.Task || (obj.Task = 'Double Click to Add New Task');
            return obj;
        },
        edit: function(e){
            var that = this;
            var $container = $(e.currentTarget)
            var attr = $container.attr('data-attr')
            var label = $container.attr('data-label')
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
                case "DueAt": $input = this.editDatePicker(e);
                break;
                case "Task": 
                    options.popup = false;
                    $input = this.longTextEditor(e, options);                    
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