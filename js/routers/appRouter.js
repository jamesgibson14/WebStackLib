define(['jquery','backbone','engine', 'handlebars', 'require','models/user', 'database','backboneADO','helpers','jqueryUI','jquery.placeholder.min','jquery.ui.widgets','jquery.cookie','jquery.tablesorter.min'], 
function($, Backbone, E, Handlebars, require,user){
    Backbone.View.prototype.close = function () {    
        if (this.beforeClose) {        
            this.beforeClose();    
        }    
        this.remove();
        if(this.unbindAll)
            this.unbindAll();    
        this.unbind();
    };
    try{
        E.sqlTest2 = new E.ADODB({type: 'sqlserver',sqlsource: 'SQLTEST2'});
        E.sqlProd2 = new E.ADODB({type: 'sqlserver',sqlsource: 'SQLPROD2'});
    }
    catch(e){};
    try{
        E.accessdb = new E.ADODB({type: 'access'});
    }
    catch(e){};
    var username;    
    if ($.cookie("username")){
        username = $.cookie("username");
    }
    else {
        username = E.getwinuser();
        $.cookie("username", username, { expires: 364})
    }
    E.user = new user({username: username});
    E.user.fetch();
    var loc = document.location + ''
    E.appState = loc.indexOf('prodweb')>=0 ? 'Production' : (loc.indexOf('webdev')>=0 ? 'Test' : (loc.indexOf('DevProjects')>=0 ? 'Developer' : 'n/a'))
    //alert(E.user.get('PicturePath'));
    //E.loadCss("js/lib/css/dark-hive/jquery-ui.css")
    E.loadCss("js/lib/jqplot/jquery.jqplot.css")
    //E.loadCss("js/lib/SlickGrid-2.02/slick.grid.css")
    E.views = {};
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
            'main/:view/:modelid': 'main',
            'tab/:view': 'tab'
        },

        'home': function(){
            var that = this;
            var view = 'view';
            if(E.GET['module'] != undefined)
               view = E.GET['module'];
            if (this.mainView)
                this.mainView.close();
            
            E.views.currentView = view
            require(['views/'+view], function(View) { 
                that.mainView = new View();
                var view = that.mainView.render().el;
                $('#bodyview').html(view);
                if(that.mainView.afterRender)
                    that.mainView.afterRender();
                
            }); 
            
        },
        'main': function(view,modelid){
            if(E.GET['module'] != undefined)
               view = E.GET['module'];
            //alert('modelid: ' + modelid)
            E.views.currentView = view
            require(['views/' + view], function(View) { 
                
                var view = new View({modelid:modelid}).render().el;
                
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