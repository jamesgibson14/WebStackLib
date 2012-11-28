define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({
        defaults: {
            idea: 'Click here for new idea'
        },
        // Ensure that each todo created has `content`.
        initialize: function() {
    
        }

  });

    // Returns the Model class
    return Model;

});