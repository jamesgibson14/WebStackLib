define(['jquery', 'backbone', 'engine', 'handlebars', 'views/BaseView', 'text!templates/cellsuggestion.html', 'models/cellsuggestion','views/taskList','models/lists'], 
function($, Backbone, E, Handlebars, BaseView, template,Model, TaskList, Lists){

    var View = BaseView.extend({
        className: "CellSuggestion ofh",
        template: template,
        serializeData:function(){
            var obj = this.model.toJSON();            
            obj.isNew = this.model.isNew();   
            return obj;
        },
        events: {
            'change .editable': 'edit'
        },
        initialize: function(){
            this.model = new Model({Idea: 'Hello world'});
            this.taskList = new TaskList();
        },
        onRender: function(){
            this.$('#tasksList').html(this.taskList.render().el);
            this.$el.find('input, textarea').placeholder();
            
            this.$('.associateList').on('focus',function(){
                $(this).autocomplete('search','')
            }).autocomplete({
                minLength: 0,
                source: E.lists.getList('associates').renderForDataEntry()
            }).focus();           
        },
        create: function(e){
            alert('create')
            var that = this;
            var attr = $container.attr('data-attr'); 
            var val = $container.val();
            var success = function(){
                alert('Model saved');
                
            };
            var error = function(){
                $.each(that.model.validationError, function(val, key){
                    alert(val +': ' + key);
                });
            };
            var options = {
                success: success,
                wait:true
            };
            var obj = {};
            obj[attr] = val;
            that.model.on("invalid",error);
            that.model.save(obj,options);
        },
        edit: function(){
            
        }     
    
    });
    // Returns the View class
    return View;
});