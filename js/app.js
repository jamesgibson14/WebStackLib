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
      	jquery: "jquery-1.9.1",
      	jqueryUI: 'jquery-ui-1.10.2.custom.min',
      	underscore: "lodash-1.1.1",
      	engine: '../app/engine',
      	database: '../app/database',
      	backboneADO: '../app/backbone.ado',
      	backbone: "backbone-1.0.0",
      	handlebars:"handlebars-1.0.rc.1.min",
		ieconfig: 'ieconfig',
		jqpall: 'jqplotAllPlugins',
		jq: 'jqplot/',
		jqp: 'jqplot/jquery.jqplot',
		jqpp: "jqplot/plugins",
      	// Require.js Plugins
      	sg: 'SlickGrid-2.02',
      	text: "plugins/text-2.0.0"
    },
    //packages: ["SlickGrid-2.02"],
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
        'jquery.ui.widgets': ['jqueryUI']
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
