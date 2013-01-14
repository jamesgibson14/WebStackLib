define(['jquery', 'backbone', 'engine', 'handlebars', 'slickgrid','text!templates/demand.html', 'models/demandList'], 
function($, Backbone, E, Handlebars,slick, template,col){

    var View = Backbone.View.extend({

        //... is a list tag.
        tagName:  "div",
        className: 'ofh',
        collection: new col(),
        // Cache the template function for a single item.
        template: template,
    
        // The DOM events specific to an item.
        events: {
          'click #newidea'              :'render',
          'change .date': 'updateData',
          'change #days': 'updateDates'
        },
    
        initialize: function() {
            
            _.bindAll(this, 'render', 'close', 'remove','updateData','updateDates');
           // this.listenTo(this.collection,'reset',this.updateView)
            
        },
    
        // Re-render the contents of the todo item.
        render: function() {
            var that = this;
            var ctemp = Handlebars.compile(this.template);
            var context = {}
            
            context.days = 1;
            
               
            var html = ctemp(context);    
            this.$el.html( html );
            this.$( ".date" ).datepicker({ defaultDate: '+1d', dateFormat: "M-dd-yy" });
            sqlArgs = [
                '2013-01-11',
                '2013-01-11'
            ]
            this.collection.sqlArgs = sqlArgs;
            var now = new Date()
            this.collection.fetch()
            var grid;
            var columns = [
                {id: "plannercode", name: "Planner Code", field: "plannercode"},
                {id: "itemID", name: "itemID", field: "itemID", width: 110, editor: Slick.Editors.Text},
                {id: "itemDescription", name: "Item Description", field: "itemDescription", editor: Slick.Editors.LongText},
                {id: "available", name: "available", field: "available"},
                {id: "eaches", name: "Demand", field: "eaches", width: 110},
                {id: "orderCount", name: "# Orders", field: "orderCount"},
                {id: "pids", name: "# PIDS", field: "pids"}
            ];
            
            var options = {
                editable: true,
                enableCellNavigation: true,
                enableColumnReorder: false,
                explicitInitialization: true,
                leaveSpaceForNewRows: true,
                addNewRows: true
            };
            function sumTotalsFormatter(totals, columnDef) {
                return "sum: " + Math.round(totals.sum[columnDef.field]);
            }
            function collapseAllGroups() {
              dataView.beginUpdate();
              for (var i = 0; i < dataView.getGroups().length; i++) {
                dataView.collapseGroup(dataView.getGroups()[i].value);
              }
              dataView.endUpdate();
            }
            
            function expandAllGroups() {
              dataView.beginUpdate();
              for (var i = 0; i < dataView.getGroups().length; i++) {
                dataView.expandGroup(dataView.getGroups()[i].value);
              }
              dataView.endUpdate();
            }
            
            function clearGrouping() {
              dataView.groupBy(null);
            }
            function groupByDuration() {
              dataView.groupBy(
                  "itemID",
                  function (g) {
                    return "Item:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
                  },
                  function (a, b) {
                    return a.value - b.value;
                  }
              );
              dataView.setAggregators([
                new Slick.Data.Aggregators.Avg("percentComplete")
              ], false);
            }
            function multiColumnGroup(){
                dataView.groupBy(
                    function (row) {
                        return row["itemID"]+":"+row["orderID"];
                    },
                    function (g) {
                       var values = g.value.split(":", 2); //3 is number of grouping columns*
                       return "Col1: "+values[0]+", Col2: "+values[1];
                    },
                    function (a, b) {
                        return a.value - b.value;
                    }
                );
            }
            
            var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();

            var dataView = this.dv = new Slick.Data.DataView({
                groupItemMetadataProvider: groupItemMetadataProvider,
                inlineFilters: true
            });
         
            // create a detached container element
            var myGrid = $("<div id='myGrid' style='width:800px;height:500px;'></div>");
            var grid = this.grid = new Slick.Grid(myGrid, dataView, columns, options);
            // register the group item metadata provider to add expand/collapse group handlers
            grid.registerPlugin(groupItemMetadataProvider);
            //grid.setSelectionModel(new Slick.CellSelectionModel());
            
            //var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);


            grid.onSort.subscribe(function (e, args) {
                sortdir = args.sortAsc ? 1 : -1;
                sortcol = args.sortCol.field;
            
                if ($.browser.msie && $.browser.version <= 8) {
                  // using temporary Object.prototype.toString override
                  // more limited and does lexicographic sort only by default, but can be much faster
            
                  var percentCompleteValueFn = function () {
                    var val = this["percentComplete"];
                    if (val < 10) {
                      return "00" + val;
                    } else if (val < 100) {
                      return "0" + val;
                    } else {
                      return val;
                    }
                  };
            
                  // use numeric sort of % and lexicographic for everything else
                  dataView.fastSort((sortcol == "percentComplete") ? percentCompleteValueFn : sortcol, args.sortAsc);
                }
                else {
                  // using native sort with comparer
                  // preferred method but can be very slow in IE with huge datasets
                  dataView.sort(comparer, args.sortAsc);
                }
            });
        
            // wire up model events to drive the grid
            dataView.onRowCountChanged.subscribe(function (e, args) {
                grid.updateRowCount();
                grid.render();
            });
        
            dataView.onRowsChanged.subscribe(function (e, args) {
                grid.invalidateRows(args.rows);
                grid.render();
            });
            
            dataView.beginUpdate();
            dataView.setItems(this.collection.toDataView(['plannercode','itemID','itemDescription', 'available','eaches','orderCount']));
            //groupByDuration();
            dataView.setAggregators([
                new Slick.Data.Aggregators.Sum("eaches")
            ], true);
            dataView.collapseGroup(0);
            dataView.endUpdate();
        
            // ... later on, append the container to the DOM and initialize SlickGrid
            setTimeout(function(){
                myGrid.appendTo(that.$el);
                grid.init();
            },1);
            return this;
        },
        updateData: function(){
            alert('date changed')
            sqlArgs = [
                (this.$('#startDate').datepicker('getDate')).toISOString().slice(0,10),
                (this.$('#endDate').datepicker('getDate')).toISOString().slice(0,10)
            ]
            this.collection.sqlArgs = sqlArgs;
            this.collection.fetch();
            this.updateView();
        },
        updateDates: function(e){
            var val = parseInt($(e.currentTarget).val())
            if (val <= 0 || val == NaN)
                return alert('Please enter a number greater than 0');
            

            this.$('#startDate').datepicker('setDate', '+1d')
            this.$('#endDate').datepicker('setDate', '+' + (val + 1) + 'd' );
            this.updateData();
        },
        updateView: function(){
            this.dv.setItems(this.collection.toDataView(['plannercode','itemID','itemDescription', 'available','eaches','orderCount']));
        }
    
    });
    
    // Returns the View class
    return View;
});