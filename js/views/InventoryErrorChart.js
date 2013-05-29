define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/InventoryErrorChart.html', 'models/InventoryErrorCollection', 'models/InventoryErrorChart', 'views/SlickGrid', 'jqp','jqpall'], 
function($, Backbone, E, Handlebars, template, Collection,Model,SlickGrid){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'InventoryErrorChart',
        model: Model,
       collection: Collection,
        plot: null,
        template: template,
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','renderCollection');
            this.collection = new this.collection()
            this.listenTo(this.collection,'reset',this.renderCollection)
            
        
            
            //this.collection.fetch();
        },
        events: {
           "click #button1": "loadReport"
        },
        
       render: function() {
            var that = this;
            var obj = {};
            obj.errorCount =39
            obj.errorTypes = ["Please Select Error Type","Backorder","Insufficient","Customer Errors",362]
            var temp = this.template(obj);
            
            
            this.$el.html( temp );
            this.$('.dPicker').datepicker();
            this.$('button').button()
            
            return this
        },
        renderCollection: function() {
            var that = this;
            that.$("#reportwindow").html("")
            this.collection.each(function(model) {
                that.$("#reportwindow").append('<div>'+ model.get('DateEntered') +' : '  + model.get('ErrorType') + ': ' + model.get('DailyErrorCount')+' </div>')
            })
        },
        loadReport: function(e){
            var startDate = this.$("#startDate").val();
            var endDate = this.$("#endDate").val();
            this.collection.sqlArgs= [startDate,endDate]
           this.collection.fetch({reset: true}); 
        }
        
       
         
    });
	
    // Returns the View class
    return View;
});