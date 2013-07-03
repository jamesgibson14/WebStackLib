define(['jquery', 'backbone', 'engine', 'handlebars', 'views/BaseView', 'text!templates/CorpCharts.html', 'models/CorpCharts', 'views/CorpPiecesPerHour', 'views/BasePlot', 'models/BasePlot','bootstrap'], 
function($, Backbone, E, Handlebars, BaseView, template,Model, PiecesPlot, BasePlot,BasePlotModel){

    var View = BaseView.extend({
        className: "CorpCharts ofh",
        template: template,
        views: {
            pph: {
                title: 'Machines Pieces Per Hour',
                y1: 'PcsPerHour',
                plotId: '1',
                sqlPerLevel: {
                    dayBranch: "SELECT DateCompleted, Unit, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted >= '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, PID, OpSeq) AS dt1 GROUP BY DateCompleted, Unit",
                    dayMachine: "SELECT DateCompleted, Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted >= '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, DateCompleted ORDER BY Unit",
                    monthBranch: "SELECT DateCompleted = LEFT(convert(varchar, DateCompleted, 121),7), Unit, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted >= '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, PID, OpSeq) AS dt1 GROUP BY Unit, LEFT(convert(varchar, DateCompleted, 121),7) ORDER BY Unit",
                    monthMachine: "SELECT DateCompleted = LEFT(convert(varchar, DateCompleted, 121),7), Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted > '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, LEFT(convert(varchar, DateCompleted, 121),7) ORDER BY Unit"
                }
            },
            'noi': {
                title: 'Number Of Items',
                y1: 'ItemCount',
                plotId: '2',
                sqlPerLevel: {
                    dayBranch: "SELECT DateCompleted, Unit, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted > '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, PID, OpSeq) AS dt1 GROUP BY DateCompleted, Unit",
                    dayMachine: "SELECT DateCompleted, Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted > '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, DateCompleted ORDER BY Unit",
                    monthBranch: "SELECT DateCompleted, Unit, ItemCount = Count(*) FROM (SELECT Unit, DateCompleted = LEFT(convert(varchar, DateCompleted, 121),7), Item FROM dbo.PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted >= '%s' AND DateCompleted < '%s' GROUP BY Unit, LEFT(convert(varchar, DateCompleted, 121),7), Item) As dt1 Group BY Unit, DateCompleted",
                    monthMachine: "SELECT DateCompleted = LEFT(convert(varchar, DateCompleted, 121),7), Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted >= '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, LEFT(convert(varchar, DateCompleted, 121),7) ORDER BY Unit"
                }                
            },
            'nop': {
                title: 'Number Of PIDs',
                y1: 'ItemCount',
                plotId: '3',
                sqlPerLevel: {
                    dayBranch: "SELECT DateCompleted, Unit, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted > '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, PID, OpSeq) AS dt1 GROUP BY DateCompleted, Unit",
                    dayMachine: "SELECT DateCompleted, Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted > '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, DateCompleted ORDER BY Unit",
                    monthBranch: "SELECT DateCompleted, Unit, ItemCount = Count(*) FROM (SELECT Unit, DateCompleted = LEFT(convert(varchar, DateCompleted, 121),7), PID FROM dbo.PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted >= '%s' AND DateCompleted <= '%s' GROUP BY Unit, LEFT(convert(varchar, DateCompleted, 121),7), PID) As dt1 Group BY Unit, DateCompleted",
                    monthMachine: "SELECT DateCompleted = LEFT(convert(varchar, DateCompleted, 121),7), Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted >= '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, LEFT(convert(varchar, DateCompleted, 121),7) ORDER BY Unit"
                }
            },
            'pp': {
                title: 'Pieces Produced',
                y1: 'yValue',
                plotId: '4',
                sqlPerLevel: {
                    dayBranch: "SELECT DateCompleted, Unit, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted > '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, PID, OpSeq) AS dt1 GROUP BY DateCompleted, Unit",
                    dayMachine: "SELECT DateCompleted, Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted > '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, DateCompleted ORDER BY Unit",
                    monthBranch: "SELECT DateCompleted = LEFT(convert(varchar, DateCompleted, 121),7), Unit, yValue = SUM(CompletedQty) FROM (SELECT Unit, DateCompleted, PID, OpSeq,CompletedQty = MIN(CompletedQty)FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted >= '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, PID, OpSeq) AS dt1 GROUP BY Unit, LEFT(convert(varchar, DateCompleted, 121),7) ORDER BY Unit",
                    monthMachine: "SELECT DateCompleted = LEFT(convert(varchar, DateCompleted, 121),7), Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted >= '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, LEFT(convert(varchar, DateCompleted, 121),7) ORDER BY Unit"
                }
            },
            'as': {
                title: 'Average Setuptime',
                y1: 'yValue',
                plotId: '5',
                sqlPerLevel: {
                    dayBranch: "SELECT DateCompleted, Unit, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted > '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, PID, OpSeq) AS dt1 GROUP BY DateCompleted, Unit",
                    dayMachine: "SELECT DateCompleted, Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted > '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, DateCompleted ORDER BY Unit",
                    monthBranch: "SELECT Unit, DateCompleted = LEFT(convert(varchar, DateCompleted, 121),7), yValue = ROUND(AVG(SetupHrs),2) FROM (SELECT Unit, DateCompleted, PID, OpSeq,SetupHrs = SUM(SetupHrs)FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted >= '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, PID, OpSeq) AS dt1 GROUP BY Unit, LEFT(convert(varchar, DateCompleted, 121),7) ORDER BY Unit, DateCompleted",
                    monthMachine: "SELECT DateCompleted = LEFT(convert(varchar, DateCompleted, 121),7), Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted >= '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, LEFT(convert(varchar, DateCompleted, 121),7) ORDER BY Unit"
                }
            },
            'ad': {
                title: 'Average Downtime',
                y1: 'yValue',
                plotId: '6',
                sqlPerLevel: {
                    dayBranch: "SELECT DateCompleted, Unit, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted > '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, PID, OpSeq) AS dt1 GROUP BY DateCompleted, Unit",
                    dayMachine: "SELECT DateCompleted, Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted > '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, DateCompleted ORDER BY Unit",
                    monthBranch: "SELECT Unit, DateCompleted = LEFT(convert(varchar, DateCompleted, 121),7), yValue = ROUND(AVG(DowntimeHrs),2) FROM (SELECT Unit, DateCompleted, PID, OpSeq,DowntimeHrs = SUM(DowntimeHrs)FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted >= '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, PID, OpSeq) AS dt1 GROUP BY Unit, LEFT(convert(varchar, DateCompleted, 121),7) ORDER BY Unit, DateCompleted",
                    monthMachine: "SELECT DateCompleted = LEFT(convert(varchar, DateCompleted, 121),7), Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, DateCompleted, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND DateCompleted >= '%s' AND DateCompleted <= '%s' GROUP BY Unit, DateCompleted, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, LEFT(convert(varchar, DateCompleted, 121),7) ORDER BY Unit"
                }
            }
        },
        tabs: {
            
        },
        isTabs: false,
        serializeData:function(){
          var obj = this.filterModel.toJSON();
          obj.isTabs = this.isTabs;
          return obj;
        },
        events: {
            'focus .editable': 'edit',
            'show a[data-toggle="tab"]': 'tabChange',
            'click #chartOptions': 'renderChartOptions',
            'click #selectable': 'addRemoveMachine',
            'click .chartOptions': 'adjustChartOptions',
            'change .machineSelect': 'machineGroupChange',
            'click .printAll': 'print',
            'click .labelToggle': 'optionsToggle'            
        },
        initialize: function(){
            var that = this;
            var isTabs = this.isTabs
            var filterModel = new (BasePlotModel.extend({
                initialize: function(){
                    this.set('isTabs',that.isTabs);
                }
            }))({startDate: '4/01/2013', isTabs: that.isTabs});
            this.groupModel = BasePlotModel.extend({
                initialize: function() {
                    var that = this;
                    this.set('startDate',filterModel.get('startDate'));
                    this.set('isTabs',isTabs);
                    filterModel.on('change:machineCodes change:startDate change:endDate change:level change:groupBy', function(e){
                        $.each(e.changed, function(key, value){
                            that.set(key, value);
                        })
                    })
                    this.on('change:machineCodes change:startDate change:endDate change:level change:groupBy', this.renderPlot)
                }
            })
            this.filterModel = filterModel;
        },
        dataSerialize: function(){
            return this.fiterModel.toJSON();  
        },
        onRender: function(){
            var that = this;
            this.tabs.pph = new BasePlot({model: new this.groupModel(this.views.pph) });
            this.currentTab = this.tabs.pph;
            this.$('#pph').html( this.currentTab.render().el);
            this.tabs.noi = new BasePlot({model: new this.groupModel(this.views.noi) });
            this.currentTab = this.tabs.noi;
            this.$('#noi').html( this.currentTab.render().el);
            this.tabs.nop = new BasePlot({model: new this.groupModel(this.views.nop) });
            this.currentTab = this.tabs.nop;
            this.$('#nop').html( this.currentTab.render().el);
            this.tabs.pp = new BasePlot({model: new this.groupModel(this.views.pp) });
            this.currentTab = this.tabs.pp;
            this.$('#pp').html( this.currentTab.render().el);
            this.tabs.as = new BasePlot({model: new this.groupModel(this.views.as) });
            this.currentTab = this.tabs.as;
            this.$('#as').html( this.currentTab.render().el);
            this.tabs.ad = new BasePlot({model: new this.groupModel(this.views.ad) });
            this.currentTab = this.tabs.ad;
            this.$('#ad').html( this.currentTab.render().el);
            this.$('.dPicker').datepicker({numberOfMonths: 3});
            
            this.$('#startDate').on('change', function(e){
                that.filterModel.set('startDate', this.value);
            })
            this.$('#endDate').on('change', function(e){
                that.filterModel.set('endDate' ,this.value);
            })
            
            function split( val ) {      return val.split( /,\s*/ );    }    
            function extractLast( term ) {      return split( term ).pop();    }
            
            var machines = this.filterModel.get('Machines') || [];

            this.$( "#imachine" )
            // don't navigate away from the field on tab when selecting an item      
            .bind( "keydown", function( event ) {        
                if ( event.keyCode === $.ui.keyCode.TAB && $( this ).data( "ui-autocomplete" ).menu.active ) {          
                    event.preventDefault();        
                }      
            })
            .autocomplete({
                source: function( request, response ) {          
                    // delegate back to autocomplete, but extract the last term          
                    response( $.ui.autocomplete.filter([{id: '3191',label: '3191'},{id: '3077',label: '3077'},{id: '590',label: '590'}], extractLast( request.term ) ) );        
                },
                autoFocus: true,
                minLength: 0,
                delay: 0,
                focus: function() {          
                    // prevent value inserted on focus          
                    return false;        
                },        
                select: function( event, ui ) {          
                    var terms = split( this.value );          
                    // remove the current input          
                    terms.pop();          
                    // add the selected item          
                    terms.push( ui.item.id ); 
                            
                    // add placeholder to get the comma-and-space at the end          
                    terms.push( "" );
                    that.filterModel.attributes.level = 'Machine';
                    that.$('#rmachine, #rbranch').prop('disabled', true);
                    that.filterModel.set('machineCodes', terms.slice(0,-1));          
                    this.value = terms.join( ", " );
                    that.$('#machineGroups').val('')
                          
                    return false;        
                }
            })
            .tooltip({                            
                position: { 
                    my: 'bottom',                               
                    at: "right+25 top-5"                           
                },                            
                tooltipClass: "ui-state-highlight absolute z2k"                        
            });
            this.$("#imachine").on('click',function(e){
                //that.$( "#imachine" ).autocomplete( "search", "" );
            })
            this.$('input[type=radio]').click(function(e){   
                that.filterModel.set($(this).attr("name"), $(this).val())
            })
            this.$('#optionsView').dialog({      
                autoOpen: false,      
                show: {        
                    effect: "blind",        
                    duration: 300      
                },      
                hide: {        
                    effect: "explode",        
                    duration: 600      
                }  
            });
            if(this.filterModel.get('machineGroup')){
                var that = this;
                setTimeout(function(){
                    that.loadData();
                },1)
                
            }  
            return this;                 
        },
        tabChange: function(e){
            var str = e.target + '';
            var target = str.slice(str.indexOf('#') + 1);
            if(!this.tabs[target]){
                this.tabs[target] = new BasePlot({model: new BasePlotModel(this.views[target])});
                this.currentTab = this.tabs[target];
                this.$('#' + target).html( this.currentTab.render().el);  
            }
            else{
                this.currentTab = this.tabs[target];
            }            
        },
        machineGroupChange: function(e){
            if (!e.target.value)
                return false;
            if(this.$('#imachine').val()!=''){
                this.$('#imachine').val('')
                this.filterModel.attributes.level = 'Branch';
            }
            this.$('#rbranch').prop('disabled', false);
            this.$('#rmachine').prop('disabled', false);
            this.filterModel.set("machineGroup",e.target.value);
            this.filterModel.set('machineCodes',this.filterModel.get('machineTypes')[e.target.value].machines);
        },
        pointLabel: true,
        optionsToggle: function(){
            var options = {
                
            }
            var plotm = this.tabs.pph.model;
            var plot = this.tabs.pph.plot;
            this.pointLabel = !this.pointLabel;
            plot.replot({seriesDefaults:{
                pointLabels:{
                    show: this.pointLabel
                } 
            }})
        }
    });
    // Returns the View class
    return View;
});