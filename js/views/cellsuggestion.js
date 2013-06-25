define(['jquery', 'backbone', 'engine', 'handlebars', 'views/BaseView', 'text!templates/cellsuggestion.html', 'models/cellsuggestion','views/taskList','models/lists'], 
function($, Backbone, E, Handlebars, BaseView, Template,Model, TaskList, Lists){

    var View = BaseView.extend({
        className: "CellSuggestion ofh",
        template: Template,
        serializeData:function(){
            var obj = this.model.toJSON();            
            obj.isNew = this.model.isNew();
            obj.Name = (obj.Associate_ID) ? this.associateCollection.get(obj.Associate_ID).get('Name') : "";
            return obj;
        },
        events: {
            'focus .editable': 'edit',
            'click .saveBtn': 'editSuccess'            
        },
        initialize: function(){
            this.model = new Model();
            if(!this.model.isNew())
                that.taskList = new TaskList({Idea_ID:that.model.id});
            this.associateCollection = E.lists.getList('associates');
            this.listenTo(this.model,'change',this.render);
            this.on('edit:success', this.editSuccess);
        },
        onRender: function(){
            var that = this;
            $('input').placeholder();
            var current = ''
            if(!that.taskList)
                that.taskList = new TaskList({Idea_ID:that.model.id, IdeaType: 'Cell',isNew: true}); // or type: TechnologyIdea, quicktip;
            if(!this.model.isNew() && !this.$('#tasksList').html())
                this.$('#tasksList').html(this.taskList.render().el);
            if(this.model.isNew() && !this.model.get('Associate_ID'))
                this.$('input:first').focus().select();
            if(this.model.validationError){
                $.each(this.model.validationError,function(key, val){
                    //TODO: wrap each element in a error "view"
                    if(current ==='') current = key;
                    that.$('input[data-attr=' + key + ']').css('background-color','yellow').parent().append('<span>Hello</span>')
                })
                this.$('input[data-attr=' + current + ']').focus();
            }                       
        },
        edit: function(e){
            var that = this;
            var $container = $(e.currentTarget);
            var attr = $container.attr('data-attr');
            var label = $container.attr('data-label');
            var $input;            
            
            var options = {
                silent:true
            }
            
            switch(attr){
                case "Idea": 
                    options.popup = false;
                    $input = this.longTextEditor(e, options);                    
                break;
                case "Associate_ID": 
                    options.source = this.associateCollection.renderForDataEntry()
                    $input = this.editAutoComplete(e,options);
                break;
                case 'Details_Urgency':
                    options.source = [
                        {id:'a',label:"A Items that STOP production (Downtime)"},
                        {id:'b',label:"B Items that SLOW production ( less than 100% run Speed)"},
                        {id:'e',label:"C Ergonomic Related Items and/or Preventative measures"},
                        {id:'d',label:"D Nice-to-Have/Wants/Just-in-Case Items"},
                        {id:'e',label:"E Preference Type suggestions"},
                        {id:'n/a',label:"N/A Doesn't apply to Cell Suggestion"},
                        {id:'z',label:"Z C.I. Support Items"} 
                    ];
                    $input = this.editAutoComplete(e,options);
                break;
                case "Details_Machines": 
                    options.source = [
                        {id:'a',label:"5147"},
                        {id:'b',label:"B Items that SLOW production ( less than 100% run Speed)"},
                        {id:'e',label:"C Ergonomic Related Items and/or Preventative measures"},
                        {id:'d',label:"D Nice-to-Have/Wants/Just-in-Case Items"},
                        {id:'e',label:"E Preference Type suggestions"},
                        {id:'n/a',label:"N/A Doesn't apply to Cell Suggestion"},
                        {id:'z',label:"Z C.I. Support Items"} 
                    ];
                    $input = this.editAutoComplete(e,options);
                break;
                case 'Details_EstimateCost':
                    $input = this.editText(e,options);
                break;
                case 'Details_ActualCost':
                    $input = this.editText(e,options);
                break;
                case 'Details_Gain': $input = this.longTextEditor(e,options);
                break;
                case "Clear": this.model.destroy();
                break;
            }            
        },
        editSuccess: function(){
            var that = this;
            var error = function(){
           
            };
            var success = function(){
                
            };
            this.model.once('sync',success)
            this.model.save(null,{success: success, wait:true});
            if(!this.model.isValid())
                error()
            this.model.trigger('change');
        }    
    });
    // Returns the View class
    return View;
});