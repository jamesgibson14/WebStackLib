define(['jquery', 'backbone', 'engine', 'handlebars', 'text!templates/machineperformance.html'], function($, Backbone, E, Handlebars, template){

    var View = Backbone.View.extend({

        //... is a list tag.
        tagName:  "div",
        className: "row",

        template: template,
    
        initialize: function() {
            this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render');
            this.model.bind('destroy', this.close,this);
        },
    
        render: function() {
          //alert('view render');
          var temp = this.model.toJSON();            
          temp = this.template(temp);    
          this.$el.html( temp );
          return this;
        }
    });

    return View;
});