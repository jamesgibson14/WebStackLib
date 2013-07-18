define(['jquery', 'backbone', 'engine','views/BaseView', 'text!templates/machineperformance.html'], function($, Backbone, E, BaseView, template){

    var View = BaseView.extend({
        className: 'modeldiv',
        
        template: template,
    
        initialize: function() {
            _.bindAll(this, 'render');
            this.listenTo(this.model,'destroy', this.remove);
        },
        serializeData: function(){
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
            return temp;
        },
        clear: function(){
            this.model.destroy();
        }
    });

    return View;
});