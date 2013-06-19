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
          'change .date': 'dateChange',
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
            var d = new Date()
            d.setDate(d.getDate() + 1)
            context.startdate = d.toISOString().slice(0,10)
            context.enddate = context.startdate
            context.days = 1;
            
               
            var html = ctemp(context);    
            this.$el.html( html );
            this.$( ".date" ).datepicker({ dateFormat: "M-dd-yy" });
            sqlArgs = [
                context.startdate,
                context.enddate
            ]
            //this.collection.sqlArgs = sqlArgs;
            //var now = new Date()
            //this.collection.fetch()

            var grid;
            columnFilters = {};
            var columns = [
                {id: "plannercode", name: "Planner Code", field: "plannercode", sortable: true },
                {id: "itemID", name: "itemID", field: "itemID", width: 110},
                {id: "itemDescription", name: "Item Description", field: "itemDescription"},
                {id: "available", name: "available", field: "available"},
                {id: "eaches", name: "Demand", field: "eaches", width: 110},
                {id: "orderCount", name: "# Orders", field: "orderCount"},
                {id: "pidCount", name: "# PIDS", field: "pidCount"},
                {id: "differenceQty", name: "StillToProduce", field: "differenceQty"},
                {id: "oversold", name: "Oversold", field: "oversold", sortable: true}                
            ];
            var options = {
                editable: true,
                enableCellNavigation: true,
                enableColumnReorder: true,
                explicitInitialization: true,
                leaveSpaceForNewRows: true,
                addNewRows: true,
                showHeaderRow: true,
                headerRowHeight: 30,
                inlineFilters: false
            };
            function comparer(a, b) {
                var x = a[sortcol], y = b[sortcol];
                return (x == y ? 0 : (x > y ? 1 : -1));
            }
            function sumTotalsFormatter(totals, columnDef) {
                return "sum: " + Math.round(totals.sum[columnDef.field]);
            }
            function collapseAllGroups() {
              that.dataView.beginUpdate();
              for (var i = 0; i < that.dataView.getGroups().length; i++) {
                that.dataView.collapseGroup(that.dataView.getGroups()[i].value);
              }
              that.dataView.endUpdate();
            }
            
            function expandAllGroups() {
              that.dataView.beginUpdate();
              for (var i = 0; i < that.dataView.getGroups().length; i++) {
                that.dataView.expandGroup(that.dataView.getGroups()[i].value);
              }
              that.dataView.endUpdate();
            }
            
            function clearGrouping() {
              that.dataView.groupBy(null);
            }
            function groupByDuration() {
              that.dataView.groupBy(
                  "itemID",
                  function (g) {
                    return "Item:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
                  },
                  function (a, b) {
                    return a.value - b.value;
                  }
              );
              that.dataView.setAggregators([
                new Slick.Data.Aggregators.Avg("percentComplete")
              ], false);
            }
            function multiColumnGroup(){
                that.dataView.groupBy(
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
            function updateHeaderRow() {
                for (var i = 0; i < columns.length; i++) {
                  if (columns[i].id !== "selector") {
                    var header = grid.getHeaderRowColumn(columns[i].id);
                    //alert($(header).width())
                    $(header).empty();
                    $("<input type='text' size='7'>")
                        .data("columnId", columns[i].id)
                        .val(columnFilters[columns[i].id])
                        .appendTo(header);
                  }
                }
            }
            var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();

            this.dataView = new Slick.Data.DataView({
                groupItemMetadataProvider: groupItemMetadataProvider
            });
            function filter(item) {
                for (var columnId in columnFilters) {
                  if (columnId !== undefined && columnFilters[columnId] !== "") {
                    var c = grid.getColumns()[grid.getColumnIndex(columnId)];
                    if (item[c.field].toLowerCase().indexOf(columnFilters[columnId])<0) {
                      return false;
                    }
                  }
                }
                return true;
            }
            // create a detached container element
            var myGrid = $("<div id='myGrid' style='width:1000px;height:500px;'></div>");
            var grid = this.grid = new Slick.Grid(myGrid, this.dataView, columns, options);
            // register the group item metadata provider to add expand/collapse group handlers
            grid.registerPlugin(groupItemMetadataProvider);
            //grid.setSelectionModel(new Slick.CellSelectionModel());
            
            //var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);
            grid.onColumnsReordered.subscribe(function (e, args) {
                updateHeaderRow();
            });
        
            grid.onColumnsResized.subscribe(function (e, args) {
                updateHeaderRow();
            });

            grid.onSort.subscribe(function (e, args) {
                sortdir = args.sortAsc ? 1 : -1;
                sortcol = args.sortCol.field;
                that.dataView.sort(comparer, args.sortAsc);
                
            });
            
            $(grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
                columnFilters[$(this).data("columnId")] = $.trim($(this).val());
                that.dataView.refresh();
            });
            
            grid.onMouseEnter.subscribe(function (e) {
                var cell = grid.getCellFromEvent(e);
                var id= grid.getColumns()[cell.cell].id
                if (id == "pidCount") {
                    //alert('clicked');
                    //var pids = that.collection.get(id)
                    //alert(pids)
                    
                    that.$("#contextMenu")
                        .data("row", cell.row)
                        .css("top", e.pageY)
                        .css("left", e.pageX)
                        .show();

                    $("body").one("click", function () {
                        that.$("#contextMenu").hide();
                    });
                }
            });
            
            // wire up model events to drive the grid
            this.dataView.onRowCountChanged.subscribe(function (e, args) {
                grid.updateRowCount();
                grid.render();
            });
        
            this.dataView.onRowsChanged.subscribe(function (e, args) {
                grid.invalidateRows(args.rows);
                grid.render();
            });
            
            //this.dataView.beginUpdate();
            //this.dataView.setItems([]);
            this.dataView.setFilter(filter);
            /*groupByDuration();
            this.dataView.setAggregators([
                new Slick.Data.Aggregators.Sum("eaches")
            ], true);
            this.dataView.collapseGroup(0);
            */
            //this.dataView.endUpdate();
         
            setTimeout(function(){
                myGrid.appendTo(that.$el);
                grid.init();
                updateHeaderRow()
            },1);

            this.updateDates({currentTarget: this.$('#days')[0]})
            
            return this;
        },
        updateData: function(){
            E.hideLoading(); 
            sqlArgs = [
                (this.$('#startDate').datepicker('getDate')).toISOString().slice(0,10),
                (this.$('#endDate').datepicker('getDate')).toISOString().slice(0,10)
            ]
            this.collection.sqlArgs = sqlArgs;
            this.collection.fetch();
            this.dataView.setItems(this.collection.toDataView(['plannercode','itemID','itemDescription', 'available','eaches','orderCount']));
            E.hideLoading(); 
        },
        updateDates: function(e){
            var val = parseInt($(e.currentTarget).val())
            if (val <= 0 || val == NaN)
                return alert('Please enter a number greater than 0');                   

            this.$('#startDate').datepicker('setDate', '+1d')
            this.$('#endDate').datepicker('setDate', '+' + (val) + 'd' );
            E.loading(this.$el,this.updateData,this);
        },
        dateChange: function(){
            E.loading(this.$el,this.updateData,this);
        }
    
    });
    
    // Returns the View class
    return View;
});