define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/SlickGrid.html', 'models/SlickGrid', 'slickgrid'], 
function($, Backbone, E, Handlebars, template, Collection, slickgrid){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'SlickGrid',
        collection: new Collection(),
        template: template,
        events: {
            'click .test': 'temp'
        },
        initialize: function() {
            _.bindAll(this, 'render','postRender','temp');
               
        },
        render: function(options) {
            if(!options)
                options = {};
            var sql = options.sql || '';
            var html;
            var sortdir;
            var sortcol;
            var that = this;
            html = Handlebars.compile(this.template)            
            //html = "<div>No data found</div>"   
            var columns;
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
            
            var data;
            
            this.collection.sql = options.sql;
            if (options.store)
                this.collection.store = options.store;
            this.collection.fetch({add_id: true});
            data = this.collection;
            var customColumns = {
                SetupHrs: {
                    editor: Slick.Editors.Text
                },
                StartDate: {
                    editor: Slick.Editors.Date
                }
            }
            if (!columns)
                columns = this.collection.getColumns(customColumns);
            if (options.columns)
                $.extend(columns,options.columns);
            this.dataView = new Slick.Data.DataView();   
            this.myGrid = $("<div id='myGrid' style='width:98%;height:500px;'></div>");
            this.grid = new Slick.Grid(this.myGrid, this.dataView, columns, options.grid);        
            this.grid.onCellChange.subscribe(function(e){
                alert('cell change')
            })
            
            var comparer = function(a, b) {
                var x = a[sortcol], y = b[sortcol];
                return (x == y ? 0 : (x > y ? 1 : -1));
            }

            this.grid.onSort.subscribe(function (e, args) {
                sortdir = args.sortAsc ? 1 : -1;
                sortcol = args.sortCol.field;
                that.dataView.sort(comparer, args.sortAsc);
                
            });
            this.dataView.onRowCountChanged.subscribe(function (e, args) {
                that.grid.updateRowCount();
                that.grid.render();
            });
        
            this.dataView.onRowsChanged.subscribe(function (e, args) {
                that.grid.invalidateRows(args.rows);
                that.grid.render();
            });
            
            this.dataView.setItems(this.collection.toDataView());
            if (this.grouping){
                _.bind(this.grouping,this);
                this.grouping();
                
            }
            this.$el.html( html );

            return this;
        },
        postRender: function(){
            this.$el.append(this.myGrid)
            this.grid.init();
            E.hideLoading();
        },
        temp: function(e){
            alert(this.collection.getColumns());  
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
        }
    });
    
    // Returns the View class
    return View;
});