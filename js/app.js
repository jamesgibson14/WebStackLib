require.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app',
        views: '../views',
        routers: '../routers',
        templates: '../templates',
        models: '../models',
        modernizr: "modernizr-2.5.3",
      	jquery: "jquery-1.7.2",
      	underscore: "lodash-0.3.1",
      	engine: '../app/engine',
      	backbone: "backbone-0.9.2",
		database: 'database',
		ieconfig: 'ieconfig',
      	// Require.js Plugins
      	text: "plugins/text-2.0.0"
    },
    shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery','ieconfig'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'engine': ['jquery'],
        'backbone.adostorage': ['backbone','database']
    }

});

// Start the main app logic.
require(['routers/appRouter'],
function   (App) {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
    
  	// Instantiates a new Router
    this.router = new Desktop();
});
