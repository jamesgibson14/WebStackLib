define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({
            store: new WebSQLStore(E.sqlProd2,'dbo.spGetDataForPeopleSoftEntry',false),
            defaults: {
	            component: "",
	            item: "",
	            pid: ""
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
                  getter: function(row){
                      return 'PID' + row["PIDText"]+", OP"+row["Opseq"];
                  },
                  formatter: function (g) {
                    return g.value + "  <span style='color:green'>(" + g.count + " runs)</span>";
                  },
                  comparer: function (a, b) {
                      return a.count - b.count;
                  },
                  aggregators: [
                    new Slick.Data.Aggregators.Sum("Scrap"),
                    new Slick.Data.Aggregators.Sum("NetQtyProduced"),
                    new Slick.Data.Aggregators.Sum("QtyProduced")
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