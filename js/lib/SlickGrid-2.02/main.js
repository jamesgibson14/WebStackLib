require.config({
    
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
require(['slick.core','slick.grid'],
function   (core,grid) {
    //main app title
    //document.title = 'SmeadAnalytics'
    alert(core);
    // Instantiates a new Router
    //this.router = new App();
});
