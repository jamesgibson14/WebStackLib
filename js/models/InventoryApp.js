define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({
            store: new WebSQLStore(E.sqlProd2,'dbo.spGetDataForPeopleSoftEntry',false),
            defaults: {
	            component: "",
	            item: "",
	            pid: "PID1610999"
            },

            // Model Constructor
            initialize: function() {

            },

            // Any time a model attribute is set, this method is called
            validate: function(attrs) {

            },
            groupByPIDOpseqDate: function() {
              this.dataView.setGrouping([
                {
                  getter: "PIDText",
                  formatter: function (g) {
                    return "Duration:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
                  },
                  aggregators: [
                    new Slick.Data.Aggregators.Sum("Scrap"),
                    new Slick.Data.Aggregators.Sum("NetQtyProduced")
                  ],
                  aggregateCollapsed: true
                },
                {
                  getter: "effortDriven",
                  formatter: function (g) {
                    return "Effort-Driven:  " + (g.value ? "True" : "False") + "  <span style='color:green'>(" + g.count + " items)</span>";
                  },
                  aggregators :[
                    new Slick.Data.Aggregators.Sum("duration"),
                    new Slick.Data.Aggregators.Sum("cost")
                  ],
                  aggregateCollapsed: true
                },
                {
                  getter: "percentComplete",
                  formatter: function (g) {
                    return "% Complete:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
                  },
                  aggregators: [
                    new Slick.Data.Aggregators.Avg("percentComplete")
                  ],
                  aggregateCollapsed: true,
                  collapsed: true
                }
              ]);
            }

    });

    // Returns the Model class
    return Model;

});