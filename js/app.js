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
      	jquery: "jquery-1.7.2.min",
      	jqueryUI: 'jquery-ui-1.8.22.custom.min',
	handlebars: 'handlebars-1.0.0.beta.6',
      	underscore: "lodash-0.4.2",
      	engine: '../app/engine',
      	database: '../app/database',
      	backboneADO: '../app/backbone.ado',
      	backbone: "backbone-0.9.2",
		ieconfig: 'ieconfig',
      	// Require.js Plugins
      	text: "text-2.0.0"
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
	'handlebars': {
            exports: 'Handlebars'
        },
        'engine': ['jquery'],
        'jqueryUI': ['jquery'],
        'database': ['engine'],
        'backbone.iosync': ['backbone'],
        'backbone.iobind': ['backbone.iosync']
    }

});

// Start the main app logic.
require(['routers/appRouter'],
function   (App) {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
    
  	// Instantiates a new Router
    this.router = new App();
});
