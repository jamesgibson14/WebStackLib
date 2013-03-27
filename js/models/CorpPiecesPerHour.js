define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({
            sql: "SELECT Machines = '[' + STUFF((select ', {\"code\": \"' + MachineCode + '\",\"label\": \"' + MachineCode + '\"}' from PeopleSoftData WHERE MachineCode <> '' GROUP BY MachineCode ORDER BY MachineCode for xml PATH('')),1,2,'') + ']'",
            store: new WebSQLStore(E.sqlTest2,'dbo.spGetDataForPeopleSoftEntry',false),
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
                       color:'#88ccff', 
                    },
                    HAS: {
                        name: 'Hastings',
                        color:'#ff2233'
                    },
                    LOG: {
                        name: 'Logan',
                        color:'rgb(96,74,123)'
                    },
                    LOC: {
                        name: 'Locust Grove',
                        color:'rgb(119,147,60)'
                    },
                    REY: {
                        name: 'Reynosa',
                        color:''
                    }
                },
                machineTypes: [
                    {name:'Hanging File', machines:[564,3700,4878,4186,1089,4408,4686,1064,3059,4704,4879]},
                    {name:'Single Top 3 Up', machines:[3191,3557,4706,2115,4957,4655,4705,207,2133,4956,4930,3193]},
                    {name:'Pressboard Die Cutter', machines:[5147,2061,4900,5071,4348]},
                    {name:'Auto Classification', machines:[4077,9141,4078,3702,5161,4916,4112,4111]},
                    {name:'', machines:[]},
                    {name:'', machines:[]},
                    {name:'', machines:[]},
                    {name:'', machines:[]}
                    
                ]
            },

            // Model Constructor
            initialize: function() {

            },

            // Any time a model attribute is set, this method is called
            validate: function(attrs) {

            }

    });

    // Returns the Model class
    return Model;

});