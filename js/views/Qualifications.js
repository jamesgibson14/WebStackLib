define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/Qualifications.html', 'models/Qualifications', 'views/SlickGrid'], 
function($, Backbone, E, Handlebars, template, Model,SlickGrid){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'Qualifications ofh',
        model: Model,
        collection: new Collection(),
        plot: null,
        template: template,
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render');
            this.model = new this.model()
            this.SlickGrid = new SlickGrid()
        },
        render: function() {
            var that = this;
            var obj = this.model.toJSON();
            
            var temp = this.template(obj);
            
            this.$el.html( temp );
            return this;
        },
        postRender: function(){
            //this.collection.sqlArgs = [this.model.get('startDate'),this.model.get('endDate')];
            //this.collection.fetch({noJSON:true})
            E.hideLoading();
        }
         
    });
	
    // Returns the View class
    return View;
});