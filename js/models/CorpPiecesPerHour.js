define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({
            sql: "SELECT Machines = '[' + STUFF((select ', {\"code\": \"' + MachineCode + '\",\"label\": \"' + MachineCode + '\"}' from PeopleSoftData WHERE MachineCode <> '' GROUP BY MachineCode ORDER BY MachineCode for xml PATH('')),1,2,'') + ']'",
            store: new WebSQLStore(E.sqlTest2,'dbo.spGetDataForPeopleSoftEntry',false),
            defaults: {                
                startDate: '01/01/2013',
                endDate:'3/19/2013',
                machineCodes: '',
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
                    {name:'Pressboard Die Cutter', machines:[5147,2061,4900,5071,4348]}
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