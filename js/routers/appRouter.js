define(['jquery','backbone','engine', 'handlebars', 'require', 'database','backboneADO','helpers','jqueryUI','jquery.placeholder.min','jquery.cookie'], function($, Backbone, E, Handlebars, require){
    Backbone.View.prototype.close = function () {    
        if (this.beforeClose) {        
            this.beforeClose();    
        }    
        this.remove();
        if(this.unbindAll)
            this.unbindAll();    
        this.unbind();
    };
    //$.cookie("cookietest", "you stored a cookie", { expires: 1})
    //$.cookie("cookiesession", "this is a session a cookie")
    //alert($.cookie('cookietest'));
    //alert($.cookie('cookiesession'));
    var Router = Backbone.Router.extend({
        mainView: null,
        initialize: function(){
        
            // Tells Backbone to start watching for hashchange events
            Backbone.history.start();

        },

        // All of your Backbone Routes (add more)
        routes: {

            // When there is no hash bang on the url, the home method is called
            '': 'home',
            'main/:view': 'main',
            'tab/:view': 'tab'

        },

        'home': function(){
            var that = this;
            var view = 'view';
            if(E.GET['module'] != undefined)
               view = E.GET['module'];
            if (this.mainView)
                this.mainView.close();
            require(['views/'+view], function(View) { 
                that.mainView = new View();
                var view = that.mainView.render().el;
                 $('#bodyview').html(view);
            }); 

            // anotherView.js extends view.js.  anotherView.js does not have a promptUser method, so JavaScript looks up the prototype chain and uses the view.js promptUser method instead.
            //!!! I could extend view for security ie: Dev view extends "editor view" which extends "read only view"
            //anotherView.promptUser();
        },
        'main': function(view){
            if(E.GET['module'] != undefined)
               view = E.GET['module'];

            require(['views/' + view], function(View) { 
                
                var view = new View().render().el;
                
                $('#mainview').html(view);
            }); 
        },
        'tab': function(view){
            //if not loaded... load
            //add to tabs
            //switch to new tab
        }
    });

    // Returns the Router class
    return Router;
});