define(['jquery', 'backbone', 'engine', 'handlebars', 'models/model', 'text!templates/main.html', 'models/collection'], function($, Backbone, E, Handlebars, Model, template, Collection){

    var View = Backbone.View.extend({

        // Represents the actual DOM element that corresponds to your View (There is a one to one relationship between View Objects and DOM elements)
        el: 'body',

        // View constructor
        initialize: function() {

            // Setting the view's model property to the passed in model
            this.model = new Model();

            // Setting the view's template property
            this.template = _.template( template, { model: this.model.toJSON() } );
			
        },

        events: {

            "click #mcontent": "promptUser",
            'click #todoview': 'loadlink'

	    },

        render: function() {

            this.$el.find("#example").append(this.template);

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