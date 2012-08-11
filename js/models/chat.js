define(['jquery', 'backbone','engine'], function($, Backbone,E) {
	var chat = Backbone.Model.extend({

	    	// Default attributes for the chat.
	     	idAttribute: '_id',
	    	initialize: function () {
	      		_.bindAll(this);
	    	},
	    	url: function () {
		      	if (this.isNew()) {
				return '/ws/chat/';
		      	} else {
				return '/ws/chat/' + this.get('_id');
		      	}
    		}
  	})

    // Returns the Model class
    return chat;									 
});	
