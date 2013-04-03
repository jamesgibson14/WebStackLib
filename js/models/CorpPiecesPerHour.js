define(['jquery', 'backbone','engine', 'models/CorpPIDShiftCollection'], function($, Backbone,E, collection) {

    var Model = Backbone.Model.extend({
            sql: "SELECT Machines = '[' + STUFF((select ', {\"code\": \"' + MachineCode + '\",\"label\": \"' + MachineCode + '\"}' from PeopleSoftData WHERE MachineCode <> '' GROUP BY MachineCode ORDER BY MachineCode for xml PATH('')),1,2,'') + ']'",
            store: new WebSQLStore(E.sqlTest2,'dbo.spGetDataForPeopleSoftEntry',false),
            collection: new collection(),
            defaults: {                
                startDate: '01/01/2013',
                endDate:'3/19/2013',
                machineCodes: [],
                groupBy: 'month',
                level: 'Branch',
                sqlPerLevel: {
                    dayBranch: "SELECT StartDate, Unit, PcsPerHour = ISNULL(SUM(CompletedQty) / NULLIF(SUM(Runhrs) + SUM(DowntimeHrs),0),0), PcsPerAssignedHour = SUM(CompletedQty) / NULLIF(SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs),0), RecordCount = COUNT(*) FROM PeopleSoftData WHERE MachineCode IN (%s) AND StartDate > '%s' AND StartDate <= '%s' GROUP BY Unit, StartDate",
                    dayMachine: "SELECT StartDate, Unit, MachineCode, PcsPerHour = ISNULL(SUM(CompletedQty) / NULLIF(SUM(Runhrs) + SUM(DowntimeHrs),0),0), PcsPerAssignedHour = SUM(CompletedQty) / NULLIF(SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs),0), RecordCount = COUNT(*) FROM PeopleSoftData WHERE MachineCode IN (%s) AND StartDate > '%s' AND StartDate <= '%s' GROUP BY Unit, MachineCode, StartDate",
                    monthBranch: "SELECT StartDate = LEFT(convert(varchar, StartDate, 121),7), Unit, PcsPerHour = ISNULL(SUM(CompletedQty) / NULLIF(SUM(Runhrs) + SUM(DowntimeHrs),0),0), PcsPerAssignedHour = SUM(CompletedQty) / NULLIF(SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs),0), RecordCount = COUNT(*) FROM PeopleSoftData WHERE MachineCode IN (%s) AND StartDate > '%s' AND StartDate <= '%s' GROUP BY Unit, LEFT(convert(varchar, StartDate, 121),7)",
                    monthMachine: "SELECT StartDate = LEFT(convert(varchar, StartDate, 121),7), Unit, MachineCode, PcsPerHour = ISNULL(SUM(CompletedQty) / NULLIF(SUM(Runhrs) + SUM(DowntimeHrs),0),0), PcsPerAssignedHour = SUM(CompletedQty) / NULLIF(SUM(Runhrs) + SUM(SetupHrs) + SUM(DowntimeHrs),0), RecordCount = COUNT(*) FROM PeopleSoftData WHERE MachineCode IN (%s) AND StartDate > '%s' AND StartDate <= '%s' GROUP BY Unit, MachineCode, LEFT(convert(varchar, StartDate, 121),7)"
                },
                branches: {
                    CED:{
                       name:'Cedar City',
                       colors:['#88ccff'], 
                    },
                    HAS: {
                        name: 'Hastings',
                        colors:['#ff2233']
                    },
                    LOG: {
                        name: 'Logan',
                        colors:['rgb(96,74,123)']
                    },
                    LOC: {
                        name: 'Locust Grove',
                        colors:['rgb(119,147,60)']
                    },
                    REY: {
                        name: 'Reynosa',
                        colors:['yellow']
                    }
                },
                machineTypes: [
                    {name:'Hanging File', machines:[564,3700,4878,4186,1089,4408,4686,1064,3059,4704,4879]},
                    {name:'Single Top 3 Up', machines:[3191,3557,4706,2115,4957,4655,4705,207,2133,4956,4930,3193]},
                    {name:'Pressboard Die Cutter', machines:[5147,2061,4900,5071,4348]},
                    {name:'Auto Classification', machines:[4077,9141,4078,3702,5161,4916,4112,4111]},
                    {name:'Auto B Fastener', machines:[8643,8649,4243,4619,8143,4242,8637,8655]},
                    {name:'PSB Fast Auto/Manual K/B', machines:[49,2105,2105,4618,521,3806,4129,4637,9312,90,719,4141,4240,3810,171,214]},
                    {name:'Single Top Single Lane', machines:[519,3555,3521,95,3993,4847,3823,4621,3724]},
                    {name:'Colly Collator', machines:[5992,4834,5993,4835,6293]}
                ],
                plotData: [],
                series: []
            },

            // Model Constructor
            initialize: function() {
                  
            }
    });

    // Returns the Model class
    return Model;

});