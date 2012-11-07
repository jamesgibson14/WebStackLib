define(['jquery', 'backbone', 'engine', 'handlebars', 'models/IdeaApp', 'text!templates/IdeaApp.html', 'models/cellsuggestions','views/idea'], 
function($, Backbone, E, Handlebars, Model, template, Collection, subView){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'PSApp',
        collection: new Collection(),
        model: new Model(),
        filteredModels: [],
        filters: false,
        template: template,
        $inputs: {},
        attributes: {style:'overflow:hidden;'},
        events: {
            'blur .pid':'change',
            'click .loadtable': 'loadData',
            'click #btnCreate': 'timeDelay'        
        },
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','change','filter', 'newCellSuggestion','addOne', 'timeDelay');
            this.collection.bind('reset',     this.filter);
            this.collection.bind('add',     this.addOne);
            this.model.fetch({wait:true});
        },
        loadData: function(){
            this.collection.fetch();
        },
        // Re-render the contents of the todo item.
        render: function() {
            var that = this;
            var temp = this.template({});
            
            this.$el.html( temp );
            this.$inputs.iassociateID = this.$('#iassociateID');
            this.$inputs.iassociate = this.$('#iassociate');
            this.$inputs.idate = this.$('#idate');
            this.$inputs.imachineCode = this.$('#imachineCode');
            this.$inputs.iidea = this.$('#iidea');
            this.$inputs.igain = this.$('#igain');
            this.$inputs.iworkcenter = this.$('#sworkcenter');
            this.$inputs.icell = this.$('#scell');
            this.$inputs.iestimate = this.$('#iestimate');
            this.$inputs.iactual = this.$('#iactual');
            this.$('input, textarea').placeholder();
            this.$('#idate').datepicker();
            this.$('#btnCreate').button();
            //var machines = this.model.get('machines'); [{id:35,code: 3555,cell: 520,workcenter:52004},{etc},{etc}]

            var machines = this.model.get('machines');
  
            this.$( "#imachine" ).autocomplete({
                source: machines,
                autoFocus: true,
                minLength: 0,
                delay: 0,
                select: function( event, ui ) {
                    that.$( "#imachine" ).val( ui.item.label );                    
                    that.$('#imachineCode').val( ui.item.code );
                    that.$('#scell').html( ui.item.cell );
                    that.$('#sworkcenter').html( ui.item.wc );
                    return false;
                }

                //add on select: set machine_ID, set cell
            });
            this.$("#imachine").on('focus',function(e){
                that.$( "#imachine" ).autocomplete( "search", "" );
            })
            var associates = this.model.get('associates');
            
            this.$( "#iassociate" ).autocomplete({
                source: associates,
                autoFocus: true,
                minLength: 0,
                delay: 100,
                select: function( event, ui ) {                    
                    that.$('#iassociateID').val( ui.item.id );
                    $( "#iassociate" ).val( ui.item.label );
                    return false;
                }

                //add on select: set associate_ID
            });
            this.$("#ialpha").combobox();
            this.$('#tabs').tabs();
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
            view.$el.toggleClass("dataSuccess",700).toggleClass("dataSuccess",700).toggleClass("dataSuccess",700).toggleClass("dataSuccess",700);

        },
        newAttributes: function() {
          return {
            associateID: this.$inputs.iassociateID.val(),
            associate: this.$inputs.iassociate.val(),
            date: this.$inputs.idate.val(),
            machine: this.$inputs.imachineCode.val(),
            idea: this.$inputs.iidea.val().replace("'","&#39;").replace('"','&#34;'),
            gain: this.$inputs.igain.val().replace("'","&#39;").replace('"','&#34;'),
            workcenter:this.$inputs.iworkcenter.html(),
            cell:this.$inputs.icell.html()            
          };
        },
        timeDelay:function(){
          E.loading(this.$el,this.newCellSuggestion,this);  
        },
        newCellSuggestion: function(){
            var attributes = this.newAttributes();
            //if(attributes.date=='Invalid Date'){}
            //alert(attributes.machine);
            var errors; 

            this.collection.create(attributes,{ 
                error: function(model, error) {
                    errors = error;
                },wait:true
            });
            if(errors){
                 E.hideLoading();
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
            
            this.$('#todo-stats').html('Total Suggesions Entered: ' + this.collection.length);
            //alert('creating new Cell Suggestion')
            _.each(this.$inputs,function(value,key){
                value.val('');
                value.html('');
            })
            E.hideLoading();
        }
    });
	
    // Returns the View class
    return View;
});