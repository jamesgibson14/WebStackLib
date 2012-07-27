define(['jquery', 'backbone', 'engine', 'handlebars', 'models/model', 'text!templates/main.html', 'models/collection'], function($, Backbone, E, Handlebars, Model, template, Collection){

    var View = Backbone.View.extend({

        // Represents the actual DOM element that corresponds to your View (There is a one to one relationship between View Objects and DOM elements)
        el: 'body',
        template: template,
        // View constructor
        initialize: function() {

            // Setting the view's model property to the passed in model
            this.model = new Model();

            // Setting the view's template property
            this.template = Handlebars.compile(this.template);
			
        },

        events: {

            "click #mcontent": "promptUser",
            'click #todoview': 'loadlink'

	    },

        render: function() {
            var temp = this.model.toJSON();
            this.$el.find("#example").append(this.template(temp));

        },

        promptUser: function() {

            prompt("Isn't this amazing?", "Yes, yes it is");

        },
        loadlink: function(e){
        	debugger;
        	var id = $(e.currentTarget).attr('id');
        	$('#mainview').html('YOu loaded ' + id);
        	
        	
        	//define(['jquery','backbone'])
        	
        } 

    });
	
    // Returns the View class
    return View;
});