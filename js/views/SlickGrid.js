define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/SlickGrid.html', 'models/SlickGrid', 'slickgrid'], 
function($, Backbone, E, Handlebars, template, Collection, slickgrid){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'SlickGrid',
        collection: new Collection(),
        template: template,
        groupingOn: false,
        events: {
            'click .test': 'groupOnOff'
        },
        initialize: function() {
            _.bindAll(this, 'render','postRender','groupOnOff','setData');
            this.listenTo(this.collection,'reset',this.setData)              
        },
        render: function(options) {
            if(!options)
                options = {};
            var html;
            var sortdir;
            var sortcol;
            var that = this;
            
            html = Handlebars.compile(this.template)            

            // TODO : extract all data to SlickGrid - model
            options.grid = {
                editable: true,
                autoEdit: false,
                sortable:true,
                enableCellNavigation: true,
                enableColumnReorder: false,
                dataItemColumnValueExtractor: this.collection.dataItemColumnValueExtractor,
                defaultFormatter: this.collection.defaultFormatter,
                explicitInitialization: true
            };        
            
            var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
            this.collection.sql = options.sql || '';
            this.collection.sqlArgs = options.sqlArgs || null;
            if (options.store)
                this.collection.store = options.store;
            
           this.customColumns = {
                SetupHrs: {
                    editor: Slick.Editors.Text
                },
                StartDate: {
                    editor: Slick.Editors.Date
                }
            }
            if (!this.columns)
                this.columns = this.collection.getColumns($.extend(this.customColumns,options.customColumns));
            if (options.columns)
                $.extend(this.columns,options.columns);
            
            this.dataView = new Slick.Data.DataView({groupItemMetadataProvider: groupItemMetadataProvider});   
            this.myGrid = $("<div id='myGrid' style='width:98%;height:500px;'></div>");
            this.grid = new Slick.Grid(this.myGrid, this.dataView, this.columns, options.grid);        
            this.grid.onCellChange.subscribe(function(e){
                alert('cell change')
            })
            
            var comparer = function(a, b) {
                var x = a[sortcol], y = b[sortcol];
                return (x == y ? 0 : (x > y ? 1 : -1));
            }

            this.grid.onSort.subscribe(function (e, args) {
                //alert('gridOnSort')
                sortdir = args.sortAsc ? 1 : -1;
                sortcol = args.sortCol.field;
                that.dataView.sort(comparer, args.sortAsc);
                
            });
            this.grid.registerPlugin(groupItemMetadataProvider);
            this.dataView.onRowCountChanged.subscribe(function (e, args) {
                //alert('rowsCountChanged')
                that.grid.updateRowCount();
                that.grid.render();
            });
        
            this.dataView.onRowsChanged.subscribe(function (e, args) {
                //alert('rowsChanged')
                that.grid.invalidateRows(args.rows);
                that.grid.render();
            });
            
            this.collection.reset({'id':1,'PIDText':'test', 'Opseq':20, 'Status':'30', 'ParentRecord_ID':'999999', 'Code':'item', 'Description':'description', 'TaskCode':'taskcode', 'WorkCenter_ID':'99999', 'Scrap':'50', 'Date':'10/10/2012', 'Shift':'F', 'NetQtyProduced':'5000'});
            this.$el.html( html );
            setTimeout(this.postRender,100)
            return this;
        },
        postRender: function(){
            this.$el.append(this.myGrid)
            this.grid.init();
        },
        temp: function(e){
            alert(this.collection.getColumns());  
        },
        setData: function(){
            //alert('hello')
            this.grid.setColumns(this.collection.getColumns(this.customColumns))
            this.dataView.setItems(this.collection.toDataView());            
            //if (this.grouping){
            //    _.bind(this.grouping,this);
            //    this.grouping();                
            //}
        },
        setColumns: function(){
              
        },
        TextEditor: function (args) {
            var $input;
            var defaultValue;
            var scope = this;
        
            this.init = function () {
              $input = $("<INPUT type=text class='editor-text' />")
                  .appendTo(args.container)
                  .bind("keydown.nav", function (e) {
                    if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                      e.stopImmediatePropagation();
                    }
                  })
                  .focus()
                  .select();
            };
        
            this.destroy = function () {
              $input.remove();
            };
        
            this.focus = function () {
              $input.focus();
            };
        
            this.getValue = function () {
              return $input.val();
            };
        
            this.setValue = function (val) {
              $input.val(val);
            };
        
            this.loadValue = function (model) {
              defaultValue = model.get(args.column.field) || "";
              $input.val(defaultValue);
              $input[0].defaultValue = defaultValue;
              $input.select();
            };
        
            this.serializeValue = function () {
              return $input.val();
            };
        
            this.applyValue = function (model, state) {
              model.set(args.column.field, state);
            };
        
            this.isValueChanged = function () {
              return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            };
        
            this.validate = function () {
              if (args.column.validator) {
                var validationResults = args.column.validator($input.val());
                if (!validationResults.valid) {
                  return validationResults;
                }
              }
        
              return {
                valid: true,
                msg: null
              };
            };
        
            this.init();
        },
        avgTotalsFormatter: function(totals, columnDef) {
            var val = totals.avg && totals.avg[columnDef.field];
            if (val != null) {
                return "avg: " + Math.round(val);
            }
            return "";
        },        
        sumTotalsFormatter: function(totals, columnDef) {
            var val = totals.sum && totals.sum[columnDef.field];
            if (val != null) {
                return "total: " + ((Math.round(parseFloat(val)*100)/100));
            }
            return "";
        },
        groupOnOff: function(){
            this.groupingOn = !this.groupingOn
            if(this.groupingOn && this.grouping)
                this.grouping();
            else
                this.dataView.setGrouping([])
        },
        dateFormatter: function(row, cell, value, columnDef, dataContext) {      
            if (value == null) {        
                return "";      
            } else {        
                return new Date(value).format('mm/dd/yyyy')     
            }    
        }
    });
    
    // Returns the View class
    return View;
});