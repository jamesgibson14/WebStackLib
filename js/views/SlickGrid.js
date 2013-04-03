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
            _.bindAll(this, 'render','afterRender','temp');
               
        },
        render: function(options) {
            if(!options)
                options = {};
            var sql = options.sql || '';
            var html;
            html = Handlebars.compile(this.template)            
            //html = "<div>No data found</div>"   
            var columns;
            // TODO : extract all data to SlickGrid - model
            options.grid = {
                editable: true,
                autoEdit: false,
                enableCellNavigation: true,
                enableColumnReorder: false,
                dataItemColumnValueExtractor: this.collection.dataItemColumnValueExtractor,
                defaultFormatter: this.collection.defaultFormatter,
                explicitInitialization: true
            };
        
            
            var data = [];
            for (var i = 0; i < 500; i++) {
                data[i] = {
                    title: "Task " + i,
                    duration: "5 days",
                    percentComplete: Math.round(Math.random() * 100),
                    start: "01/01/2009",
                    finish: "01/05/2009",
                    effortDriven: (i % 5 == 0)
                };
            }
            this.collection.sql = options.sql;
            this.collection.fetch();
            data = this.collection;
            if (!columns)
                columns = this.collection.getColumns();
            if (options.columns)
                $.extend(columns,options.columns);
                
            this.myGrid = $("<div id='myGrid' style='width:600px;height:500px;'></div>");
            this.grid = new Slick.Grid(this.myGrid, data, columns, options.grid);        
            this.grid.onCellChange.subscribe(function(e){
                alert('cell change')
            })
                
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