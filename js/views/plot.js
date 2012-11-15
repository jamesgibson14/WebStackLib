define(['jquery', 'backbone', 'engine', 'handlebars', 'models/plot', 'text!templates/plot.html', 'jqp','jqpp/jqplot.bubbleRenderer'], 
function($, Backbone, E, Handlebars, Model, template){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'ReportApp ofh',
        attributes: {style:'border:3px solid black;'},
        model: new Model(),
        filteredModels: [],
        filters: false,
        template: template,
        events: {
            'blur .pid':'change',
            'click #btnTest': 'loadData',
            'click #btnRun': 'runEntry',
            'click .filter': 'filter'        
        },
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','change','enterPeopleSoftScript','tester','filter');
        },
        loadData: function(){
            var that = this;
            //E.loading(this.$el,that.collection.fetch,this.collection);
            
            var attrs = this.model.toJSON()
            var plot1 = $.jqplot('plot', [attrs.data],attrs.plotOptions);
            this.model.on('change:data',function(){
                plot1.replot({clear:true,data:[this.get('data')]});
            });
            this.$('#resizable').bind('resize', function(event, ui) {plot1.replot( { resetAxes: true } );});

            //this.collection.fetch();
        },
        // Re-render the contents of the todo item.
        render: function() {
            var that = this;
            
            var temp = this.template({});
            
            this.$el.html( temp );
            this.$('#slider').slider({
                range: true,
                min: this.model.get('datemin'),
                max: this.model.get('datemax'),
                values: [this.model.get('datemin')+15, this.model.get('datemax')-20],
                slide: function(event, ui) {
                    //alert(ui.values);
                    that.$('#dtFrom').html(new Date(ui.values[0],1).format("yyyy"));
                    that.$('#dtTo').html(new Date(ui.values[1],1).format("yyyy"));
                }
            });
            this.$('#resizable').resizable({delay:20,minHeight: 326,minWidth: 400});
            
            return this;
        },
        change: function(){
            
            var newvalue = this.$el.find('.pid').val();
            this.model.set({pid: newvalue})
        },
        runEntry: function(){
            this.model.set('data',[1,2,3,4,5,6,7,8,9,10])          
        }
    });
	
    // Returns the View class
    return View;
});