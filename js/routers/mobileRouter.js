define(['jquery','backbone'], function($, Backbone){

    var Router = Backbone.Router.extend({

        initialize: function(){
        
            // Tells Backbone to start watching for hashchange events
            Backbone.history.start();

        },

        // All of your Backbone Routes (add more)
        routes: {

            // When there is no hash bang on the url, the home method is called
            '': 'home'

        },

        'home': function(){
            var user = Backbone.Model.extend({urlRoot : 'data/users'});
            var model = new user()
            
            model.set({hair: "brown"});
            model.save();
            
            model.on('sync', function(){
                var attrs = model.toJSON();
                $.each(attrs,function(value, key){
                    $('#bodyview').append('<div>' + key + ': ' + value + '</div>');
                });
            })
        }
    });

    // Returns the Router class
    return Router;
});