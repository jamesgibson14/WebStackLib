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
            var user = Backbone.Model.extend({urlRoot : '/users'});
            var model = new user({id:3})
            
            model.set({hair: "brown"});
            model.save();
            model.on('sync', function(){
                $('#bodyview').append('<div>Name: ' + model.get('name') + '</div>');
                $('#bodyview').append('<div>age: ' + model.get('age') + '</div>');
                $('#bodyview').append('<div>hair: ' + model.get('hair') + '</div>');
                $('#bodyview').append('<div>url: ' + model.url() + '</div>');  
            })
        }
    });

    // Returns the Router class
    return Router;
});