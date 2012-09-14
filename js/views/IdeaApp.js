define(['jquery', 'backbone', 'engine', 'handlebars', 'models/IdeaApp', 'text!templates/IdeaApp.html', 'models/cellsuggestions','views/idea'], 
function($, Backbone, E, Handlebars, Model, template, Collection, subView){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'PSApp',
        collection: new Collection(),
        filteredModels: [],
        filters: false,
        template: template,
        $inputs: {},
        attributes: {style:'overflow:hidden;'},
        events: {
            'blur .pid':'change',
            'click .loadtable': 'loadData',
            'click #btnCreate': 'newCellSuggestion'        
        },
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','change','filter', 'newCellSuggestion','addOne');
            this.collection.bind('reset',     this.filter);
            this.collection.bind('add',     this.addOne);
        },
        loadData: function(){
            this.collection.fetch();
        },
        // Re-render the contents of the todo item.
        render: function() {
            
            var temp = this.template({});
            
            this.$el.html( temp );
            this.$inputs.iassociate = this.$('#iassociate');
            this.$inputs.idate = this.$('#idate');
            this.$inputs.imachine = this.$('#imachine');
            this.$inputs.iidea = this.$('#iidea');
            this.$inputs.igain = this.$('#igain');
            this.$('input, textarea').placeholder();
            this.$('#idate').datepicker();
            this.$('#btnCreate').button();
            //var machines = this.model.get('machines'); [{id:35,code: 3555,cell: 520,workcenter:52004},{etc},{etc}]
            var machines = [
            "3191",
            "3555",
            "519",
            "3700",
            "4270"
            ];
            this.$( "#imachine" ).autocomplete({
                source: machines
                //add on select: set machine_ID, set cell
            });
            var associates = [
            "1234 - jane",
            "5678 - bill",
            "2233 - alice",
            "4499 - hennry",
            "9012 - zach"
            ];
            this.$( "#iassociate" ).autocomplete({
                source: associates
                //add on select: set associate_ID
            });
            return this;
        },
        change: function(){
            
            var newvalue = this.$el.find('.pid').val();
            this.model.set({pid: newvalue})
        },
        filter: function(){
            //alert('filter and sort');
            debugger;
            //this.collection.sort({silent:true});
            //alert('filters: ' + this.filters);
            if(this.filters)
                this.filteredModels = this.collection.filter(function(model){
                    _.each(this.filters,function(filter){
                        filter(model)
                    })
                });
            else
                this.filteredModels = this.collection.models
            
            this.addAll();
        },
        addAll: function() {
            // create in memory element
            var $el = this.$('#list').clone(true,true);
            var header = $el.find('.header').clone(true,true);
            // also get the `className`, `id`, `attributes` if you need them 
            $el.empty();
            $el.append(header);
            // append everything to the in-memory element 
            _.each(this.filteredModels, function(model){ 
                var rowView = new subView({model: model}); 
                $el.append(rowView.render().el); 
            }); 
            // replace the old view element with the new one, in the DOM 
            this.$("#list").replaceWith($el);//.replaceWith($el);             
        },
        addOne: function(model) {
            var view = new subView({model: model});
            this.$("#list").append(view.render().el);
        },
        newAttributes: function() {
          return {
            associate: this.$inputs.iassociate.val(),
            date: this.$inputs.idate.val(),
            machine: this.$inputs.imachine.val(),
            idea: this.$inputs.iidea.val(),
            gain: this.$inputs.igain.val()
          };
        },
        newCellSuggestion: function(){
            var attributes = this.newAttributes();
            //if(attributes.date=='Invalid Date'){}
            var errors; 

            this.collection.create(attributes,{ 
                error: function(model, error) {
                    errors = error;
                },wait:true
            });
            if(errors){
                _.each(errors, function(val, key){
                    switch(key) {
                        case "db":   
                            alert('Error with Database; Please contact Data Support.\n\n' + val); 
                        break;
                        case "machine":  alert(key + ': ' + val);//highlight area red.
                            break;
                        case "date":  alert(key + ': ' + val);
                            break;
                        case "associate":  alert(key + ': ' + val);
                            break;
                        case "idea":  alert(key + ': ' + val);
                            break;
                        case "gain":  alert(key + ': ' + val);
                            break;
                        default:
                            alert(key + ': ' + val);
                    }
                })
                return;
            } 
            this.$('#todo-stats').html('Total Suggesion: ' + this.collection.length);
            //alert('creating new Cell Suggestion')
            _.each(this.$inputs,function(value,key){
                value.val('');
            })
        }
    });
	
    // Returns the View class
    return View;
});