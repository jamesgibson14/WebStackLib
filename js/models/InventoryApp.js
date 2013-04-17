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
                    return "PID:  " + g.value + "  <span style='color:green'>(" + g.count + " runs)</span>";
                  },
                  comparer: function (a, b) {
                      return a.count - b.count;
                  },
                  aggregators: [
                    new Slick.Data.Aggregators.Sum("Scrap"),
                    new Slick.Data.Aggregators.Sum("NetQtyProduced")
                  ],
                  aggregateCollapsed: true
                },
                {
                  getter: "opseq",
                  formatter: function (g) {
                    return "Opseq:  " + g.value  + "  <span style='color:green'>(" + g.count + " runs)</span>";
                  },
                  aggregators :[
                    new Slick.Data.Aggregators.Sum("Scrap"),
                    new Slick.Data.Aggregators.Sum("NetQtyProduced")
                  ],
                  aggregateCollapsed: true
                },
                {
                  getter: "Date",
                  formatter: function (g) {
                    return "Date:  " + g.value + "  <span style='color:green'>(" + g.count + " runs)</span>";
                  },
                  aggregators: [
                    new Slick.Data.Aggregators.Avg("Scrap")
                  ],
                  aggregateCollapsed: true,
                  collapsed: false
                }
              ]);
            }

    });

    // Returns the Model class
    return Model;

});