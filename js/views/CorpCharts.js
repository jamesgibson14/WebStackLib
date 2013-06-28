define(['jquery', 'backbone', 'engine', 'handlebars', 'views/BaseView', 'text!templates/CorpCharts.html', 'models/CorpCharts', 'views/CorpPiecesPerHour', 'views/BasePlot', 'models/BasePlot','bootstrap'], 
function($, Backbone, E, Handlebars, BaseView, template,Model, PiecesPlot, BasePlot,BasePlotModel){

    var View = BaseView.extend({
        className: "CorpCharts ofh",
        template: template,
        views: {
            'noi': BasePlotModel.extend({
                sqlPerLevel: {
                    dayBranch: "SELECT DateCompleted, Unit, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted > '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, PID, OpSeq) AS dt1 GROUP BY DateCompleted, Unit",
                    dayMachine: "SELECT DateCompleted, Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted > '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, DateCompleted ORDER BY Unit",
                    monthBranch: "SELECT DateCompleted, Unit, ItemCount = Count(*) FROM (SELECT Unit, DateCompleted = LEFT(convert(varchar, DateCompleted, 121),7), Item FROM dbo.PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted >= '%s' AND DateCompleted < '%s' GROUP BY Unit, LEFT(convert(varchar, DateCompleted, 121),7), Item) As dt1 Group BY Unit, DateCompleted",
                    monthMachine: "SELECT DateCompleted = LEFT(convert(varchar, DateCompleted, 121),7), Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted > '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, LEFT(convert(varchar, DateCompleted, 121),7) ORDER BY Unit"
                },
                
            }),
            'nop': function(){
                var that = this;
                this.el='';
                this.render = function(){
                    this.el = '<div>Hey our rendering function is working Number Of PIDs</div>';
                    return this;
                }
            }
        },
        tabs: {
            'pph': new PiecesPlot()
        },
        serializeData:function(){
            var obj = {};//this.model.toJSON();  
            return obj;
        },
        events: {
            'focus .editable': 'edit',
            'show a[data-toggle="tab"]': 'tabChange'
            
        },
        initialize: function(){
           this.currentTab = this.tabs['pph'];
        },
        onRender: function(){
            this.$('.dropdown-toggle').dropdown('toggle')
            this.$('#pph').html( this.currentTab.render().el);
            this.$('.accordion-group').on('show', function(){
                $(this).find(".icon-chevron-right").removeClass("icon-chevron-right").addClass("icon-chevron-down");
            }).on('hide', function(){
                $(this).parent().find(".icon-chevron-down").removeClass("icon-chevron-down").addClass("icon-chevron-right");
            });                     
        },
        tabChange: function(e){
            var str = e.target + '';
            var target = str.slice(str.indexOf('#') + 1);
            //require(new view)
            if(!this.tabs[target])
                this.currentTab = new this.views[target];
            else
                this.currentTab = this.tabs[target];          
            this.$('#' + target).html( this.currentTab.render().el);
        }
    });
    // Returns the View class
    return View;
});