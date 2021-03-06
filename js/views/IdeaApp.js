define(['jquery', 'backbone', 'engine', 'handlebars', 'models/IdeaApp', 'text!templates/IdeaApp.html', 'models/cellsuggestions','views/ideaList','views/cellsuggestion'], 
function($, Backbone, E, Handlebars, Model, template, Collection, ideaList, CellSuggestion){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'IdeaApp',
        collection: new Collection(),
        model: new Model(),
        cellSuggestion: new CellSuggestion(),
        filteredModels: [],
        filters: false,
        template: template,
        $inputs: {},
        attributes: {style:'overflow:hidden;'},
        events: {
            'blur .pid':'change',
            'click #btnCreate': 'timeDelay',
            'click #addTask': 'addTask'        
        },
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render', 'newCellSuggestion', 'timeDelay');
            //if (this.options.modelid)
                //open to specific 
            this.model.fetch({wait:true});
        },
        addTask: function(e){
            $(e.target).prev().append('<li class="ui-state-disabled"><input placeholder="type task:" /><input type="checkbox" /></li>').find('input').placeholder()
        },
        render: function() {
            var that = this;
            var view;
            var temp = this.template({});
            
            
            this.$el.html( temp );
            view = new ideaList({collection: this.collection});
            this.$("#tabs-1").prepend(view.render().el); 
            
            view = this.cellSuggestion 
            this.$("#tabs-1  .content").append(view.render().el); 
                       
            this.$inputs.iassociateID = this.$('#iassociateID');
            this.$inputs.iassociate = this.$('#iassociate');
            this.$inputs.idate = this.$('#idate');
            this.$inputs.imachine= this.$('#imachine');
            this.$inputs.imachineCode = this.$('#imachineCode');
            this.$inputs.iidea = this.$('#iidea');
            this.$inputs.igain = this.$('#igain');
            this.$inputs.iworkcenter = this.$('#sworkcenter');
            this.$inputs.icell = this.$('#scell');
            this.$inputs.ialpha = this.$('#ialpha');
            this.$inputs.inumeric = this.$('#inumeric');
            this.$inputs.iestimate = this.$('#iestimate');
            this.$inputs.iactual = this.$('#iactual');
            this.$('input, textarea').placeholder();
            this.$('#idate').datepicker();
            this.$('#btnCreate').button();
            this.$('#addTask').button();
            //var machines = this.model.get('machines'); [{id:35,code: 3555,cell: 520,workcenter:52004},{etc},{etc}]
            function removeIfInvalid(element) {                    
                var $el = $( element )
                var value = $el.val(),                        
                matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( value ) + "$", "i" ),                        
                valid = false;                    
                _.each(machines, function(mod) {                      
                    if ( mod.label.match( matcher ) ) {                            
                        valid = true;                            
                        return false;                        
                    }                    
                });                    
                if ( !valid ) {                        
                    // remove invalid value, as it didn't match anything                        
                    $el                            
                    .val( "" )                            
                    .attr( "title", value + " didn't match any item" )                            
                    .tooltip( "open" )
                    .focus();                         
                    setTimeout(function() {                            
                        $el.tooltip( "close" ).attr( "title", "" );                        
                    }, 2500 );                                               
                    return false;                    
                }                
            }  
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
                },
                change: function( event, ui ) {                            
                    if ( !ui.item )                                
                    return removeIfInvalid( this );                        
                }   

                //add on select: set machine_ID, set cell
            })
            .tooltip({                            
                position: { 
                    my: 'bottom',                               
                    at: "right+25 top-5"                           
                },                            
                tooltipClass: "ui-state-highlight absolute z2k"                        
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
            this.$("#inumeric").combobox();
            this.$('#tabs').tabs();
            
            return this;
        },
        change: function(){
            
            var newvalue = this.$el.find('.pid').val();
            this.model.set({pid: newvalue})
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
            cell:this.$inputs.icell.html(),
            alpha: this.$inputs.ialpha.val(),
            numeric: this.$inputs.inumeric.val(),
            estimate: this.$inputs.iestimate.val(),
            actual: this.$inputs.iactual.val()           
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
            //this.$("#imachine").val('')
            
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