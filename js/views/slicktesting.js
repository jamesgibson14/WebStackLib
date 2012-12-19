define(['jquery', 'backbone', 'engine', 'handlebars', 'slickgrid','text!templates/slick1.html', 'models/idea'], 
function($, Backbone, E, Handlebars,slick, template,model){

    var View = Backbone.View.extend({

        //... is a list tag.
        tagName:  "div",
        className: 'ofh',
        model: new model(),
        // Cache the template function for a single item.
        template: template,
    
        // The DOM events specific to an item.
        events: {
          'click #newidea'              :'render'
        },
    
        initialize: function() {
            
            _.bindAll(this, 'render', 'close', 'remove');
            this.model.bind('change:id', this.render);
            this.model.bind('destroy', this.remove,this);
        },
    
        // Re-render the contents of the todo item.
        render: function() {
          var that = this;
          var ctemp = Handlebars.compile(this.template);
          var context = this.model.toJSON();
 
          //alert(JSON.stringify(context));        
          var html = ctemp(context);    
          this.$el.html( html );


          var grid;
          var columns = [
            {id: "title", name: "Title", field: "title"},
            {id: "duration", name: "Duration", field: "duration"},
            {id: "%", name: "% Complete", field: "percentComplete"},
            {id: "start", name: "Start", field: "start"},
            {id: "finish", name: "Finish", field: "finish"},
            {id: "effort-driven", name: "Effort Driven", field: "effortDriven"}
          ];
        
          var options = {
            enableCellNavigation: true,
            enableColumnReorder: false,
            explicitInitialization: true
          };
        

            var data = [];
            for (var i = 0; i < 5000; i++) {
              data[i] = {
                title: "Task " + i,
                duration: "5 days",
                percentComplete: Math.round(Math.random() * 100),
                start: "01/01/2009",
                finish: "01/05/2009",
                effortDriven: (i % 5 == 0)
              };
            }
        
            // create a detached container element
            var myGrid = $("<div id='myGrid' style='width:800px;height:500px;'></div>");
            grid = new Slick.Grid(myGrid, data, columns, options);
        
        
            // ... later on, append the container to the DOM and initialize SlickGrid
            setTimeout(function(){
                myGrid.appendTo(that.$el);
                grid.init();
            },1);
          return this;
        }
    
    });
    
    // Returns the View class
    return View;
});