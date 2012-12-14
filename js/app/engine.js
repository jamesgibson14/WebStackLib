// main code

(function( window, undefined ) {
    
    var engine = function() {
        
        var privatevar = "Private Variable Reached";
        this.test1 = "Engine Public Variable";
        this.callbackque = []
        //Engine Setup
        
        this.getprivatevar = function() {
            return 'privatevar: ' + privatevar;
        }
        this.setprivatevar = function(value) {
             privatevar = value;
        }
        privatefunction = function(){ 
            return 'You have reached a Private Function';
        }
        if (!Array.prototype.indexOf) {   
            Array.prototype.indexOf = function (obj, fromIndex) {     
                if (fromIndex == null) {         
                    fromIndex = 0;     
                } else if (fromIndex < 0) {         
                    fromIndex = Math.max(0, this.length + fromIndex);     
                }     
                for (var i = fromIndex, j = this.length; i < j; i++) {         
                    if (this[i] === obj)             
                    return i;     
                }     
                return -1;   
            }; 
        } 
        this.loadCss = function(url) {
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;
            document.getElementsByTagName("head")[0].appendChild(link);
        }
   
        //alert("inside Engine");
        //engine.support = alert("support inside engine");
        //engine.fn = engine.prototype = {test: = alert(test2 + test3)};
        //engine.fn.init.prototype = engine.fn;
    }
    
    engine.prototype.support = function(){
        return "Support prototype called: " + privatefunction();
    }
    
    /*
    
    */
    
    window.engine = window.E = new engine;
})(window);

    //Get window username variable
(function(engine) {
        engine.help = "Help Reached";
        engine.getwinuser = function(){
            var username;
            try {
                var wshshell=new ActiveXObject("wscript.shell");
                username=wshshell.ExpandEnvironmentStrings("%username%"); 
            }
            catch(e){
                alert(e);
            };
            return username || "guest";
        }
    })(engine);

//Validation
(function(e) {
    var v = e.validate = {};
    
    v.time = function(timestr) {
        return timestr;
    }
    
})(engine);



//Loading - to add a loading icon
(function(E) {
    var l = E.loading = function(selector, callback,scope){       
        $('#loading').addClass('loading-visible');
        setTimeout(function () {callback.call(scope);},100);
    }
    E.hideLoading = function(){
        $('#loading').removeClass('loading-visible');
    }
    
})(engine);

//tick - code run on every certain interval
(function(e) {
    var t = e.tick = function(options){     
        // input her:
        // automated code and process
        // chating
        // Clock update
        // check session informations
        // autosave work
    }
    
})(engine);

//Freeze - lock up the browser by runing code for testing.
(function(e) {
    var l = e.freeze = function(){      
        for(var i=0;i<10000000;i++){
            var b = 1+1+1+1;
        }
        //alert("unfreeze");
    }
    
})(engine);

//include - run code and append/insert html
(function(E) {
    E.include = function(options){
        //can accept url as string or options as object
        //E.debug.log("<br> entered include: " + options);
        var htmldata;
        var settings = {
            url: 'html/request.html',
            datatype: 'html',
            selector: '#maindiv',
            append: false,
            tab: 'null'
        }
        if (typeof(options)=='string')
            settings.url = options
        else
            $.extend(settings,options);
        //E.debug.log("<br> url: " + settings.url);
        //alert(dumpObj(settings));
        if (settings.tab == 'null'){
            //alert('not tab');
            $.get(settings.url, function(data) {
                htmldata = data
                //alert("<br> data: " + data);
                addHtml();
            });
        }
        else{
            htmldata = E.ui.tabs[settings.tab].htmltxt;
            addHtml();
        }
        function addHtml() {
            if (!settings.append) {
                $(settings.selector).empty()
                $(settings.selector).html(htmldata);
            }
            else
                $(settings.selector).append(htmldata);
        }
        return htmldata;
    }
    
})(engine);
//loadTemplate - load template
(function(E) {
    E.loadTemplate = function(options){
        //can accept url as string or options as object
        //E.debug.log("<br> entered include: " + options);
        var htmldata;
        var settings = {
            url: 'html/request.html',
            dataType: 'text',
            success: function(data) {
                htmldata = data
            }
        }
        if (typeof(options)=='string')
            settings.url = options
        else
            $.extend(settings,options);
        
        $.ajax(settings);   

        return htmldata;
    }
    
})(engine);

//loadAMDModule - load AMD module for use
(function(E) {
    E.loadModule= function(options){
        //can accept url as string or options as object
        //E.debug.log("<br> entered include: " + options);
        var htmldata;
        var settings = {
            url: 'html/request.html',
            dataType: 'text',
            success: function(data) {
                htmldata = data
            }
        }
        if (typeof(options)=='string')
            settings.url = options
        else
            $.extend(settings,options);
        
           

        return $.getScript(settings.url);
    }
    
})(engine);

//Queue - a queue for events and callback.
(function(e) {
    var v = e.queue = function(){

      // store your callbacks
      this._methods = [];

      // keep a reference to your response
      this._response = null;

      // all queues start off unflushed
      this._flushed = false;
    }

    v.prototype = {
      // adds callbacks to your queue
      add: function(fn) {
        // if the queue had been flushed, return immediately
        if (this._flushed) {
          fn(this._response);
        // otherwise push it on the queue
        } else {
          this._methods.push(fn);
        }
      },
      flush: function(resp) {
        // note: flush only ever happens once
        if (this._flushed) {
          return;
        }
        // store your response for subsequent calls after flush()
        this._response = resp;
        // mark that it's been flushed
        this._flushed = true;
        // shift 'em out and call 'em back
        while (this._methods[0]) {
          this._methods.shift()(resp);
        }
      }
    };
    
})(engine);

    
    
//Debugger
(function(E) {
    var Debug = function(options){ 
        // Create some defaults, extending them with any options that were provided
        var settings =  {
            'selector': '#debuglog',
            'level': 1,
            'debugging': false,
            'readylog': 'The document is ready'
        }
        var startup = startup || new Date();
        $.extend(settings, options);
        //store timers in an array.
        var timers = {'startup': startup || new Date()};
        timers.last = 0;
        //set timer
        this.settimer = function(name) {
            if (!name){
                var name = timers.last;
                timers.last ++;
            }
            var start = new Date().getTime();
            timers[name]=start;
        }
        //get timer
        this.gettimer = function(name, time) {
            if (!name)
                var name = timers.last;
            var now = new Date().getTime();
            return now - timers[name];
        }
        //clear times
        this.cleartimers = function() {
            return 'clear timers';
        }
        
        //base log function
        this.log = function(options){
            $(settings.selector).prepend(options);
            return options;
        }
        //store logs and errors to display later
        var logs = [];
        
    };
    E.debug = new Debug();
})(engine);
(function(E) {
    E.worker = {
        intId:''
        ,interval: 1,
        start: function(milsec){
            this.intId = setInterval('E.worker.tick()',milsec || 1000);
        },
        stop: function(){
            clearInterval(this.intId);
        },
        events: [],
        tick: function() {
            //alert('tickrunning');
            var tickn = new Date().getMinutes();
            var that = this;
            if (this.events.length > 0){
                //alert('tickn: ' + tickn + '' + new Date());
                if ((tickn)%this.interval == 0) {
                    //alert('that.events: ' + that.events.length);
                    $.each(this.events, function(i,val){
                        //alert(typeof(val));
                        if(typeof(val)== 'function') {
                            val();
                        }
                    })
                }
            }
            return;
        }
    }
})(engine);
(function(E) {
    E.purge = function(d) {
        var a = d.attributes, i, l, n;
        if (a) {
            for (i = a.length - 1; i >= 0; i -= 1) {
                n = a[i].name;
                if (typeof d[n] === 'function') {
                    d[n] = null;
                }
            }
        }
        a = d.childNodes;
        if (a) {
            l = a.length;
            //alert(l);
            for (i = 0; i < l; i += 1) {
                E.purge(d.childNodes[i]);
            }
        }
    }
})(engine);
(function(E) {
    E.fs = {
        files2array: function(npath, nfilters){
            //alert(npath + nfilters);
            var fso = new ActiveXObject("Scripting.FileSystemObject"),
            settings = {
                path: '//smead.us/data/Share.CC/DB/HistPerm/ServerClient/html/presentations/',
                files:[],
                filters:[]
            };
            if (npath) {settings.path +=npath;}
            if (typeof(nfilters)=='object') settings.filters = settings.filters.concat(nfilters);
            var fi = fso.GetFolder(settings.path),
            fcs = new Enumerator(fi.files);
            for (; !fcs.atEnd(); fcs.moveNext()) {
                var name = (fcs.item().Name)
                
                if ($.inArray(name.substr(name.length-3,3).toLowerCase(),settings.filters) >-1) {
                    settings.files.push(fcs.item().name);               
                }
            }
            fso = null;
            fi = null;
            fcs = null;
            return settings.files
        }
    }
})(engine);
(function(E) {

    E.ui = ((document.location.href).indexOf('.hta')>0) ? 'hta' : 'html'
    function getUrlVars() {
        var vars = {};
        var parts = document.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        if(hta.commandLine)
            var parts = hta.commandLine.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                vars[key] = value;
            });
        return vars;
        /* Example of use
        var first = getUrlVars()["id"];
        var second = getUrlVars()["page"];  
        */
    
    }
    E.GET = getUrlVars()
    
})(engine);
(function(E) {
    //Util from http://www.siteexperts.com/tips/html/ts16/page2.asp
    E.getSelected = function(opt) {
        var selected = new Array();
        var index = 0;
        for (var intLoop = 0; intLoop < opt.length; intLoop++) {
           if ((opt[intLoop].selected) ||
               (opt[intLoop].checked)) {
              index = selected.length;
              selected[index] = new Object;
              selected[index].value = opt[intLoop].value;
              selected[index].index = intLoop;
           }
        }
        return selected;
     }

     E.outputSelected = function(opt) {
        var sel = E.getSelected(opt);
        alert(opt[1].value)
        var strSel = "";
        for (var item in sel)       
           strSel += sel[item].value + "\n";
        alert("Selected Items:\n" + strSel);
     }
     E.split = function ( val ) {            
         return val.split( /,\s*/ );        
     }        
     E.extractLast = function ( term ) {            
         return split( term ).pop();        
     }
    
})(engine);

//to work in require.js
define(function() {
 return window.engine;
});