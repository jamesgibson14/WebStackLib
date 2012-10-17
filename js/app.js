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
      	jquery: "jquery-1.8.2",
      	jqueryUI: 'jquery-ui-1.9.0.custom.min',
      	underscore: "lodash-0.3.1",
      	engine: '../app/engine',
      	database: '../app/database',
      	backboneADO: '../app/backbone.ado',
      	backbone: "backbone-0.9.2",
		ieconfig: 'ieconfig',
		jqall: 'jqplotAllPlugins',
		jq: 'jqplot/',
		jqp: 'jqplot/pluggins',
		jqplot: "jqplot/jquery.jqplot.min",
      	// Require.js Plugins
      	text: "plugins/text-2.0.0"
    },
    //packages: ["app/jqplotAll", "store"],
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
        'jqueryUI': ['jquery'],
        'database': ['engine'],
        'backboneADO': ['backbone'],
        'jqplot': ['jquery']
    }

});

// Start the main app logic.
require(['routers/appRouter'],
function   (App) {
    //main app title
    document.title = 'SmeadAnalytics'

  	// Instantiates a new Router
    this.router = new App();
});
