define(['jquery', 'backbone','engine', 'models/CorpPIDShiftCollection'], function($, Backbone,E, collection) {

    var Model = Backbone.Model.extend({
        sql: "SELECT Machines = '[' + STUFF((select ', {\"code\": \"' + MachineCode + '\",\"label\": \"' + MachineCode + '\"}' from PeopleSoftData WHERE MachineCode <> '' GROUP BY MachineCode ORDER BY MachineCode for xml PATH('')),1,2,'') + ']'",
        store: new WebSQLStore(E.sqlTest2,'dbo.spGetDataForPeopleSoftEntry',false),
        collection: new collection(),
        defaults: {                
            startDate: '01/01/2013',
            endDate: new Date().format('mm/dd/yyyy'),
            machineCodes: [],
            groupBy: 'month',
            level: 'Branch',
            sqlPerLevel: {
                dayBranch: "SELECT StartDate, Unit, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, StartDate, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND StartDate > '%s' AND StartDate <= '%s' GROUP BY Unit, StartDate, PID, OpSeq) AS dt1 GROUP BY StartDate, Unit",
                dayMachine: "SELECT StartDate, Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, StartDate, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND StartDate > '%s' AND StartDate <= '%s' GROUP BY Unit, StartDate, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, StartDate ORDER BY Unit",
                monthBranch: "SELECT StartDate = LEFT(convert(varchar, StartDate, 121),7), Unit, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, StartDate, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND StartDate > '%s' AND StartDate <= '%s' GROUP BY Unit, StartDate, PID, OpSeq) AS dt1 GROUP BY Unit, LEFT(convert(varchar, StartDate, 121),7) ORDER BY Unit",
                monthMachine: "SELECT StartDate = LEFT(convert(varchar, StartDate, 121),7), Unit, MachineCode, PcsPerHour = SUM(CompletedQty) / SUM(Hours) , PcsPerAssignedHour = SUM(CompletedQty) / SUM(AssignedHours), RecordCount = COUNT(*) FROM (SELECT Unit, StartDate, MachineCode, PID, OpSeq,CompletedQty = MIN(CompletedQty), Hours =  SUM(Runhrs) + SUM(DowntimeHrs), AssignedHours = SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs) FROM PeopleSoftData WHERE MachineCode IN (%s) AND StartDate > '%s' AND StartDate <= '%s' GROUP BY Unit, StartDate, MachineCode, PID, OpSeq) AS dt1 GROUP BY Unit, MachineCode, LEFT(convert(varchar, StartDate, 121),7) ORDER BY Unit"
            },
            branches: {
                CED:{
                   name:'Cedar City',
                   colors:['#0467d5', '#0000ff', '#10a7ef', '#06e0f9', '#1be4d0', '#88ccff'], 
                },
                HAS: {
                    name: 'Hastings',
                    colors:['#ff2233','#bd322b', '#ff0000', '#ff7171', '#f54784']
                },
                LOG: {
                    name: 'Logan',
                    colors:['rgb(96,74,123)', '#8000ff', '#b871ff', '#e48bd2']
                },
                LOC: {
                    name: 'Locust Grove',
                    colors:['rgb(119,147,60)','#004000', '#008000', '#00ff00', '#80ff00']
                },
                REY: {
                    name: 'Reynosa',
                    colors:['yellow','#fbc404', '#ffff00', '#e9ee11', '#ffff80']
                },
                MCG: {
                    name: "McGregor",
                    colors:['black']
                }
            },
            machineTypes: [
                {name:'Hanging File', machines:[564,3700,4878,4186,1089,4408,4686,1064,3059,4704,4879]},
                {name:'Single Top 3 Up', machines:[3191,3557,4706,2115,4957,4655,4705,207,2133,4956,4930,3193]},
                {name:'Pressboard Die Cutter', machines:[5147,2061,4900,5071,4348]},
                {name:'Auto Classification', machines:[4077,9141,4078,3702,5161,4916,4112,4111]},
                {name:'Auto B Fastener', machines:[698,631,8643,8649,4243,4619,8143,4242,8637,8655]},
                {name:'PSB Fast Auto/Manual K/B', machines:[49,2105,2105,4618,521,3806,4129,4637,9312,90,719,4141,4240,3810,171,214]},
                {name:'Single Top Single Lane', machines:[519,3555,3521,95,3993,4847,3823,4621,3724]},
                {name:'Colly Collator', machines:[5992,4834,5993,4835,6293]},
                {name:'Flat Jacket', machines:[4677,3007,3620]},
                {name:'Reinforced Side Tab', machines:[3729,631,698,3816,67,1028,3196,3815,3817]}
            ],
            plotData: [],
            series: []
        },

        // Model Constructor
        initialize: function() {
              this.on('change:machineCodes change:startDate change:endDate change:level change:groupBy', this.renderPlot)
        },
        renderPlot: function(e){
            
            //Instead of destroying plot just reload data, lables and then re-plot 
            //no data check
            var machines = this.get('machineCodes');
            if (machines.length ==0)
                return alert("Please select a machine");
            this.collection.sql = this.get('sqlPerLevel')[this.get('groupBy') + this.get('level')]  
            this.collection.sqlArgs = [machines, this.get('startDate'),this.get('endDate')];
            this.collection.fetch({noJSON:true});
            this.collection.dataRenderer(this);                   
        }
    });

    // Returns the Model class
    return Model;

});