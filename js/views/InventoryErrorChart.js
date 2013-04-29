define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/InventoryErrorChart.html', 'models/InventoryErrorCollection', 'models/InventoryErrorChart', 'views/SlickGrid', 'jqp','jqpall'], 
function($, Backbone, E, Handlebars, template, Collection,Model,SlickGrid){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'InventoryErrorChart',
        model: Model,
       
        plot: null,
        template: template,
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render');
            this.model = new this.model()
            this.model.fetch();
        
            
            //this.collection.fetch();
        },
       render: function() {
            var that = this;
            var obj = this.model.toJSON();
            obj.errorCount =39
            obj.errorTypes = ["Please Select Error Type","Backorder","Insufficient","Customer Errors",362]
            var temp = this.template(obj);
            
            
            this.$el.html( temp );
            this.$('.dPicker').datepicker();
            return this
        }
        
       
         
    });
	
    // Returns the View class
    return View;
});