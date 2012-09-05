define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/machineperformance.html'], function($, Backbone, E, Handlebars, template){

    var View = Backbone.View.extend({

        //... is a list tag.
        tagName:  "div",
        className: 'modeldiv',
        
        template: template,
    
        initialize: function() {
            this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render');
            this.model.bind('destroy', this.close,this);
        },
    
        render: function() {
          //alert('view render');
          var temp = this.model.toJSON();
          if(temp.GoalPercentageMonth) temp.GoalPercentageMonth += '%';
          if(temp.GoalPercentageWeek) temp.GoalPercentageWeek += '%'; 
          if(temp.GoalPercentageDay) temp.GoalPercentageDay += '%'; 
          if(temp.MachineRunTimePercentageMonth) temp.MachineRunTimePercentageMonth += '%';
          if(temp.MachineRunTimePercentageWeek) temp.MachineRunTimePercentageWeek += '%'; 
          if(temp.MachineRunTimePercentageDay) temp.MachineRunTimePercentageDay += '%'; 
          if(temp.ScrapPercentageMonth) temp.ScrapPercentageMonth += '%';
          if(temp.ScrapPercentageWeek) temp.ScrapPercentageWeek += '%'; 
          if(temp.ScrapPercentageDay)  temp.ScrapPercentageDay += '%'; 
          if(temp.ProductionRateMonth) temp.ProductionRateMonth = temp.ProductionRateMonth.format('0,000');
          if(temp.ProductionRateWeek) temp.ProductionRateWeek = temp.ProductionRateWeek.format('0,000');
          if(temp.ProductionRateDay) temp.ProductionRateDay = temp.ProductionRateDay.format('0,000');
          
          temp = this.template(temp); 
          this.$el.html( temp );
          return this;
        }
    });

    return View;
});