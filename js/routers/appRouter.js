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
    var loc = document.location + ''
    E.appState = loc.indexOf('prodweb')>=0 ? 'Production' : (loc.indexOf('webdev')>=0 ? 'Test' : (loc.indexOf('DevProjects')>=0 ? 'Developer' : 'n/a'))
    E.user = new user({username: username, appState: E.appState, screen: {aHeight: screen.availHeight, aWidth: screen.availWidth, width: screen.width, height: screen.height}});
    E.user.fetch();    
    
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
            'tab/:view': 'tab',
            'popup/:view': 'popup'
        },

        'home': function(){
            var that = this;
            var viewName = 'view';
            var defaults = {
                header: true,
                footer: true,
                sidebar: true,
                module: false 
            };
            
            
            if (this.mainView)
                this.mainView.close();
            if(E.GET['module'] != undefined){
               viewName = E.GET['module'];
               defaults.header = false;
               defaults.footer = false;
               defaults.sidebar = false;
               defaults.module = true;               
            }
            E.views.currentView = viewName
            
            require(['views/view'], function(View) { 
                var view = new View(defaults);
                that.mainView = view;
                $('#bodyview').html(view.render().el);
                
                if (viewName != "view"){                                
                    require(['views/'+viewName], function(View) { 
                        var view = new View();
                        $(that.mainView.el).html(view.render().el);
                        if(view.postRender)
                            E.loading(that.mainView, view.postRender,view) 
                        
                    });
                } 
                
            });
            
            
        },
        'main': function(view,modelid){
            if(E.GET['module'] != undefined)
               view = E.GET['module'];
            //alert('modelid: ' + modelid)
            E.views.currentView = view
            require(['views/' + view], function(View) { 
                
                var view = new View({modelid:modelid});
                
                $('#mainview').html(view.render().el);
                if(view.postRender)
                    E.loading($('#mainview'), view.postRender,view) 
            }); 
        },
        'tab': function(view){
            //if not loaded... load
            //add to tabs
            //switch to new tab
        },
        'popup': function(view){
            //add view as pop-up window.
        }
    });

    // Returns the Router class
    return Router;
});