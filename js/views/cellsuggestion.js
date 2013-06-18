define(['jquery', 'backbone', 'engine', 'handlebars', 'views/BaseView', 'text!templates/cellsuggestion.html', 'models/cellsuggestion','views/taskList','models/lists'], 
function($, Backbone, E, Handlebars, BaseView, template,Model, TaskList, Lists){

    var View = BaseView.extend({
        className: "CellSuggestion ofh",
        template: template,
        serializeData:function(){
            var obj = this.model.toJSON();            
            obj.isNew = this.model.isNew();
            obj.Name = (obj.Associate_ID) ? this.associateCollection.get(obj.Associate_ID).get('Name') : "N/A";
            obj.Idea || (obj.Idea = 'Double click to add new idea');
               
            return obj;
        },
        events: {
            'focus .editable': 'edit'
            
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
            
            if(!this.model.isNew())
                this.$('#tasksList').html(this.taskList.render().el);                       
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
                case 'alpha':
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
                case 'numeric':
                    options.source = [
                        {id:'1',label:"1- $ 0 to $ 100"},
                        {id:'2',label:"2- $ 101 to $ 500"},
                        {id:'3',label:"3- $ 501 to $ 1000"},
                        {id:'4',label:"4- $ 1001 to $ 2500"},
                        {id:'5',label:"5- $ 2501 to $ 4999"},
                        {id:'6',label:"6- $ 5000+ Expense"},
                        {id:'7',label:"7- $5000+ Capital"},
                        {id:'n/a',label:"N/A- Doesn't apply to Cell Suggestion"}
                    ];
                    $input = this.editAutoComplete(e,options);
                break;
                case 'Gain': $input = this.longTextEditor(e,options);
                break;
                case "Clear": this.model.destroy();
                break;
            }            
        },
        editSuccess: function(){
            var that = this;
            var error = function(){
                //alert('Error: Make sure both the idea and Associate is filled out');
            };
            var success = function(){
                that.taskList = new TaskList({Idea_ID:that.model.id,IdeaType: 'CellSuggestion'}); // or type: TechnologyIdea, quicktip;
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