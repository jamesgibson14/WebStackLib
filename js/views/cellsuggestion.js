define(['jquery', 'backbone', 'engine', 'handlebars', 'views/BaseView', 'text!templates/cellsuggestion.html', 'models/cellsuggestion','views/taskList','models/lists'], 
function($, Backbone, E, Handlebars, BaseView, template,Model, TaskList, Lists){

    var View = BaseView.extend({
        className: "CellSuggestion ofh",
        template: template,
        serializeData:function(){
            return {
                suggestion: "this is a test",
                isNew: true
            }
        },
        events: {
            'change .editable': 'edit'
        },
        initialize: function(){
            this.model = new Model({Idea: 'Hello world'})
            this.taskList = new TaskList();
        },
        onRender: function(){
            this.$('#tasksList').html(this.taskList.render().el)
            this.$el.find('input, textarea').placeholder();            
        },
        edit: function(e){
            var that = this;
            var $container = $(e.currentTarget)
            var attr = $container.attr('data-attr')
            var label = $container.attr('data-label')
            var $input;
            var val = $container.val();
            var success = function(){
                that.model.save();
                that.model.trigger('change');
            };
            var options = {
                silent:true
            }
            alert('Attr: ' + attr + ': ' + val);
            
            /*
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
            }     */    
        }        
    
    });
    // Returns the View class
    return View;
});