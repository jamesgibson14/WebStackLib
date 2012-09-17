define(['jquery', 'backbone', 'engine', 'handlebars', 'models/model', 'text!templates/main.html', 'models/collection'], function($, Backbone, E, Handlebars, Model, template, Collection){

    var View = Backbone.View.extend({

        // Represents the actual DOM element that corresponds to your View (There is a one to one relationship between View Objects and DOM elements)
        tagName:  "div",
        className: 'SmeadApp',
        attributes: {},
        template: template,
        location: '' + window.location.href,
        // View constructor
        initialize: function() {
            // Setting the view's model property to the passed in model
            this.model = new Model();
            _.bindAll(this,'render');
            // Setting the view's template property
            this.template = Handlebars.compile(this.template);
			
        },

        events: {

            "click #mcontent": "promptUser",
            'click #todoview': 'loadlink',
            'click #restart':'restart'

	    },

        render: function() {
            var temp = this.model.toJSON();
            this.$el.append(this.template(temp));
            this.$el.find('#tabs').buttonset();
            return this;
        },

        promptUser: function() {

            prompt("Isn't this amazing?", "Yes, yes it is");

        },
        loadlink: function(e){
        	var id = $(e.currentTarget).attr('id');
        	$('#mainview').html('YOu loaded ' + id);
        	
        	
        	//define(['jquery','backbone'])
        	
        },
        restart: function(){
            window.location = this.location + '';
        }

    });
	
    // Returns the View class
    return View;
});