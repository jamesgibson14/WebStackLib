define(['jquery', 'backbone', 'engine', 'handlebars', 'models/PSDetail', 'text!templates/PSApp.html', 'models/PSDetails','views/PSDetail','jquery.tablesorter.min'], 
function($, Backbone, E, Handlebars, Model, template, Collection, subView){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'PSApp',
        collection: new Collection(),
        filteredModels: [],
        filters: false,
        template: template,
        noScan: false,
        events: {
            'blur .pid':'change',
            'click .loadtable': 'loadData',
            'click .printPIDs': 'printPIDs',
            'click .btnRun': 'runEntry',
            'click .filter': 'filterList',
            'keypress .colfilter': 'filterList',
            'click #filterclear': 'filter',
            'keypress #pidSearch': 'scanPID',
            'keypress #opSearch': 'scanPID',
            'click .playsound': 'playSound',
            'click .btnTest': 'fnTest',
            'click legend.ui-widget-header': 'toggleFilter'      
        },
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','change','tester','filter','fnTest');
            this.collection.bind('reset',     this.filter);
            
        },
        fnTest: function(){
            var fr = document.getElementById("autoentry").contentWindow.document;
                    
            var myObjs = fr.querySelectorAll('tr td:first-child'); // get element by tag name
            alert(myObjs.length); // show number of items
            
            for (var i=0;i<myObjs.length; i++){
                var html = myObjs[i].innerHTML+ '';
                
                if(html.indexOf('#ICRow')>=0 && html.indexOf(10)>=0 ){
                    alert(myObjs[i].innerHTML)
                    var index = html.indexOf('#ICRow');
                    var row = html.slice(index,index +7);
                    alert(row)
                }
                    
            }
        },
        playSound: function(){
            $('.soundIAmMad')[0].play();
        },
        toggleFilter: function(e){
            $(e.target).next().toggle('blind',500)
        },
        loadData: function(){
            var that = this;
            var fetch = function(){
                that.collection.fetch({reset:true})
            }
            this.$('#scanError').html(' ')
            E.loading(this.$el,fetch,this.collection);
        },
        scanPID: function(e){
            var $el = $(e.currentTarget);
            var id = $el.attr('id');

            if (e.key == 'Enter') {
                if(id == 'pidSearch')
                    this.$('#opSearch').val('').focus();
                else {
                    $pid = this.$('#pidSearch')
                    this.searchAndMarkPID($pid.val(),$el.val())
                    $pid.val('').focus();
                }
            }
        },
        searchAndMarkPID: function(fPID, fOp){
            var i=0;
            fPID = fPID.toUpperCase()
            var flagged = false;
            _.each(this.filteredModels,function(model, index){
                //alert(filter)
                var pid = model.get('pid') + ''
                var op = model.get('opseq') + ''
                if (pid == fPID && op == fOp){
                    if(model.get('flag'))
                        flagged = true;
                    else
                        model.set({isReady:true});
                    //TODO: find row and move to top 
                    //TODO:or re-order by Ready
                    //TODO:or nothing
                    i++;
                }
                
            })
            if(i<1 || flagged) {
                var errMessage = '';
                var sounds = this.$('.soundError')
                sounds.get(0).play();
                if (flagged)
                    errMessage = '<br /><span class="scanError">PID: ' + fPID + " Opseq: " + fOp + ' has been flagged 999</span>' 
                else
                    errMessage = '<br /><span class="scanError">Could not find PID: ' + fPID + " Opseq: " + fOp + '</span>'
                
                this.$('#scanError').append(errMessage)
                //TODO: error checking why isnt PID&OP found
            }
        },
        printPIDs: function(){
            var HKEY_Root, HKEY_Path, HKEY_Key;
            HKEY_Root = "HKEY_CURRENT_USER";
            HKEY_Path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
            // Set the page footer to print the header is empty
            function PageSetup_Null (){
              try{
                var Wsh = new ActiveXObject("WScript.Shell");
                HKEY_Key = "header";
                Wsh.RegWrite (HKEY_Root + HKEY_Path + HKEY_Key ,"");
                HKEY_Key = "footer";
                Wsh.RegWrite (HKEY_Root + HKEY_Path + HKEY_Key ,"");
              }catch (e) {}
            }
            // Set the page footer to print the header for the default value
            function PageSetup_Default (){
              /*
               * &b = break/space
               * &w = page title
               * &p / &P = current page / Total pages
               * &u = url
               * &d = short date
               */

              try{
                var Wsh = new ActiveXObject ( "WScript.Shell");
                HKEY_Key = "header";
                Wsh.RegWrite (HKEY_Root + HKEY_Path + HKEY_Key, "&w &b on page 00 yards, &p / &P");
                HKEY_Key = "footer";
                Wsh.RegWrite (HKEY_Root + HKEY_Path + HKEY_Key, "&u &b &d");
                HKEY_Key = "Shrink_To_Fit";
                Wsh.RegWrite (HKEY_Root + HKEY_Path + HKEY_Key, "yes");
              }
              catch (e) {}
            }
            PageSetup_Default();
            
            this.filter(true,'checkbox','isReady');
            
            setTimeout(function(){
                window.print();
            },100);
        },
        // Re-render the contents of the todo item.
        render: function() {
            //var temp = this.model.toJSON();
            
            var temp = this.template({});
            
            this.$el.html( temp );
            this.$("#pidList").tablesorter({
                headers:{
                    1:{sorter:false},3:{sorter:false},4:{sorter:false},5:{sorter:false},
                    6:{sorter:false},7:{sorter:false},8:{sorter:false},9:{sorter:false},10:{sorter:false},
                    12:{sorter:false},13:{sorter:false},14:{sorter:false}
                }
            });   
            if((document.location + '').indexOf('.hta','.hta')>-1) 
                this.$('#autoentry').attr('src','http://scmprd2005.smead.us:7001/servlets/iclientservlet/PRD/?cmd=login');
            
            this.$('#pidfilters .content').hide();    
            
            return this;
        },
        change: function(){            
            var newvalue = this.$el.find('.pid').val();
            this.model.set({pid: newvalue})
        },
        filter: function(filter, type, attr){
            
            //alert('filters: ' + this.filters);
            if(attr){
                var tempmods = [];
                //alert(this.filteredModels[0].get(attr) == 'true');
                
                _.each(this.filteredModels,function(model, index){
                    //alert(filter)
                    switch(type){
                        case "checkbox":
                            if(filter === model.get(attr)) 
                                tempmods.push(model)
                        break;
                        case "number":
                            if(parseFloat(filter) === model.get(attr)) 
                                tempmods.push(model)
                        break;
                        case "text":
                            if (model.get(attr) + ''.indexOf(filter)>=0)
                                tempmods.push(model);
                        break;
                    }
                })
                
                //alert(tempmods.length);
                if(tempmods.length>0){
                    this.filteredModels = tempmods;
                    this.addAll();
                }
                else{
                    alert('No matches found. Try clearing the filters')
                }
            }
            else{
                this.filteredModels = this.collection.models;
                this.addAll();
                this.$('#pidSearch').focus();
            }

        },
        filterList: function(e){
            
            if(e.keyCode != 13 && e.keyCode != undefined ) return;
            var $el = $(e.currentTarget)
            var filter = $el.val();
            var type = $el.attr('type');
            if (type == 'checkbox')
                filter = !!$el.attr('checked');
            
            var attr = $el.attr('filteron');
            //alert(filter + ' ' + type + ' '+ attr);

            this.filter(filter,type,attr);
            
            if(e.keyCode == 13)
                e.preventDefault();
        },
        addAll: function() {
            // create in memory element
            this.$('#pidlisttbody').children().remove();
            var $el = this.$('#pidlisttbody').clone(true,true);
            //var header = $el.find('.header').clone(true,true);
            // also get the `className`, `id`, `attributes` if you need them 
            $el.empty();
            //$el.append(header);
            // append everything to the in-memory element 
            _.each(this.filteredModels, function(model){ 
                var rowView = new subView({model: model}); 
                $el.append(rowView.render().el); 
            }); 
            // replace the old view element with the new one, in the DOM 
            
            this.$("#pidlisttbody").replaceWith($el);//.replaceWith($el);            
            
            this.$('#collection-stats').html('Total lines: ' + this.filteredModels.length);
            E.loading(this.$el,this.resort,this);
            //E.hideLoading();            
        },
        resort: function(){
            this.$("#pidList").trigger("update");             
            // set sorting column and direction, this will sort on the first and third column             
            var sorting = [[11,1],[2,0],[0,0]];             
            // sort on the first column
            var that =this;
            setTimeout(function(){           
                that.$("#pidList").trigger("sorton",[sorting]);
            },1) 
            E.hideLoading();
        },
        runEntry: function(){
            if (this.filteredModels.length <=0)
                return;
            var url = 'http://scmprd2005.smead.us:7001/servlets/iclientservlet/PRD/?cmd=login';
            var node =this.$el.find('#autoentry')
            var that = this;
            //alert(node.attr('src'));
            
            node.show()
            
            this.job = this.tester('step1');
            this.job.run();        
          
        },
        tester: function(step){
            debugger;
            var that = this;
            var _step = step;
            var _currentModel = 0;
            var _collection = this.filteredModels;
            var _model;
            var _errors=false;
            var context = $('#autoentry');
            var debug = false;
            var blockAlerts = function(){   
                //alert('change ' + this.readyState);
                if (this.readyState == 'interactive'){
                    //alert('I am inside the interactive state');
                    //unbind the function
                    document.getElementById("autoentry").onreadystatechange = null;
                    //block alert popups
                    document.getElementById("autoentry").contentWindow.oldAlert = document.getElementById("autoentry").contentWindow.alert
                    document.getElementById("autoentry").contentWindow.alert = function(){};
                    
                    //document.getElementById("autoentry").contentWindow.oldAlert("OldAlert");
                    //document.getElementById("autoentry").contentWindow.alert("Alert");
                }                
            };
            var map = {
                step1: function(){
                    //alert('step1: wait for login screen then login.');
                    //var contents = context.contents();
                    var fr = document.getElementById("autoentry").contentWindow.document;
                    if (context.attr('src') != 'http://scmprd2005.smead.us:7001/servlets/iclientservlet/PRD/?cmd=login'){
                        _step = 'step10';
                        _errors = true;
                        _currentModel = -1;
                        nextStep();
                        return;
                    }
                    if (fr.getElementById('userid').length  == 0){
                        //if not loaded yet... run agian
                        nextStep();
                    }
                    else{
                        var user = fr.getElementById('userid').value = 'GIBSONJ';
                        var pwd = fr.getElementById('pwd').value = 'GIBSONJ';                 
                        fr.login.submit();
                         _step = 'step2';
                        context.one('load', function(){
                            nextStep();       
                        });
                    }           
                    
                },
                step2: function(){
                    //alert('step2: Check for logged in, then go to report screen')
                  
                    //var contents = context.contents();                   
                    _model = _collection[_currentModel].toJSON();                                      
                    if(_model.flag || _model.entered || !_model.isReady){
                         _errors = true;
                         _step = 'step10';
                        nextStep();
                        return;
                    }
                    //alert(context.attr("src"));               
                    
                    var url = 'http://scmprd2005.smead.us:7001/servlets/iclientservlet/PRD/?Menu=PROCESS_PRODUCTION&Component=SM_SF_SHIFT_RPT&Market=GBL&Page=SM_SF_SHIFT_RPT&Action=U&target=Transfer21'
                    context.attr("src",url);
                    _step = 'step3';
                    context.one('load', function(){                                
                        nextStep();       
                    });
                },
                step3: function(){  
                    //alert('step3: Test PID validity (open/closed)');
                    //alert("step 3.1")
                    //var contents = context.contents();
                    //alert("step 3.2")
                    var fr = document.getElementById("autoentry").contentWindow.document;
                    var pid = fr.getElementById('SM_SF_PID_WRK_PRODUCTION_ID').value = _model.pid;
                    var op = fr.getElementById('SM_SF_PID_WRK_OP_SEQUENCE').value = _model.opseq;
                    //var btn = fr.getElementById('#SM_SF_PID_WRK_REFRESH_BTN')
                    //alert("step 3.3")
                    
                    var btn2 = fr.getElementById('SM_SF_PID_WRK_REFRESH_BTN')
                    btn2.click();
                    //alert("step 3.4")
                    document.getElementById("autoentry").onreadystatechange = function(){   
                        //alert('change ' + this.readyState);
                        if (this.readyState == 'interactive'){
                            //alert('I am inside the interactive state');
                            //unbind the function
                            document.getElementById("autoentry").onreadystatechange = null;
                            //block alert popups
                            document.getElementById("autoentry").contentWindow.oldAlert = document.getElementById("autoentry").contentWindow.alert
                            document.getElementById("autoentry").contentWindow.alert = function(){};
                            //document.getElementById("autoentry").contentWindow.oldAlert("OldAlert");
                            //document.getElementById("autoentry").contentWindow.alert("Alert");
                        }
                    }
                    
                    _step = 'step4';
                    context.one('load', function(){
                        nextStep();       
                    });
                    
                },
                step4: function(){
                    //alert('step4: if no PID error then enter Data');
                    //alert("step 4.1")
                    //var contents = context.contents();
                    var fr = document.getElementById("autoentry").contentWindow.document;
                    var pid = fr.getElementById('SM_SF_PID_WRK_PRODUCTION_ID').getAttribute("class");
                    
                    if (pid =="PSERROR"){
                        alert("Error with PID go to next record");
                        var temp = {}
                        temp.flag = _errors = true;
                        temp.flagreason = 'AutoEntry: PID closed or other error';
                        _collection[_currentModel].set(temp);
                        _step = 'step10';
                        nextStep();
                        return;
                    };
                    var chkOpDone = fr.getElementById('SM_SF_PID_WRK_SM_OP_COMPL_FLAG')
                    _model.prevscrap = parseFloat(fr.getElementById('SM_SF_SHIFT_RPT_SCRAP_QTY$0').value)+0;
                    
                    //alert("step 4.2")
                    
                    if(chkOpDone.checked) {                    
                        //---ajust scrap that needs to be entered-----
                        
                        
                        // uncheck and overwrite the data with the new data
                        //this will combine multiple shifts worth of data on the same PID-opseq combination
                        
                        var frm = fr.forms[1];
                        frm.SM_SF_PID_WRK_SM_OP_COMPL_FLAG$chk.value='N';
                        frm.ICAction.value="SM_SF_PID_WRK_SM_OP_COMPL_FLAG";
                        frm.submit();
                        
                        //chkOpDone.click(); 
                        _step = 'step4';
                        context.one('load', function(){
                            nextStep();       
                        });
                        return;
                    }
                    //no Agency Associates
                    if(_model.operator.indexOf('T'<-1))
                        _model.operator = '';
                    
                    var shift = (_model.shift == "F") ? 1 : 2;
                    var txtMachine = fr.getElementById('SM_SF_SHIFT_RPT_MACHINE_CODE$0').value = _model.machine;
                    var txtDate = fr.getElementById('SM_SF_SHIFT_RPT_OP_START_DT$0').value = _model.date;
                    var txtOperator = fr.getElementById('SM_SF_SHIFT_RPT_EMPLID$0').value = _model.operator;
                    //var txtShift= contents.find('#SM_SF_SHIFT_RPT_MG_SHIFT\\$0').val(shift);
                    var txtSetupTime = fr.getElementById('SM_SF_SHIFT_RPT_SM_CLK_SETUP_HOURS$0').value = _model.setuptime;
                    var txtRunTime = fr.getElementById('SM_SF_SHIFT_RPT_SM_CLK_RUN_HOURS$0').value = _model.runtime;
                    var txtDownTime = fr.getElementById('SM_SF_SHIFT_RPT_SM_CLK_DT_HOURS$0').value = _model.downtime;
                    var txtQtyCompleted = fr.getElementById('SM_SF_SHIFT_RPT_COMPLETED_QTY$0').value = _model.qtycompleted;
                    var txtScrapQty = fr.getElementById('SM_SF_SHIFT_RPT_SCRAP_QTY$0').value = _model.scrap;
                    //chkOpDone.checked = true;
                    //alert("step 4.3")
                    chkOpDone.click();
                    //alert("step 4.4")              
                     _step = 'step5';
                    context.one('load', function(){
                        nextStep();       
                    });             
                },
                step5: function(){
                    //alert('step5: save form');
                    if(debug) alert('doublecheck values');
                    var fr = document.getElementById("autoentry").contentWindow.document;
                    var frm = fr.forms[1];
                    frm.ICAction.value="#ICSave";
                    frm.submit();
                     _step = 'step6';
                    context.one('load', function(){
                        nextStep();       
                    }); 
                },
                step6: function(){
                    //alert('step6: goto Scrap Entry PID lookup page');
                    if (_model.status >40 || !(_model.scrap > 0 || _model.PaperConverting == 1)){
                        //no scrap or endscrap goto next record
                        //alert("No Scrap/EndScrap: go to next record");
                        _step = 'step10';
                        nextStep();                       
                    }
                    else {
                        var url = 'http://scmprd2005.smead.us:7001/servlets/iclientservlet/PRD/?ICType=Panel&Menu=PROCESS_PRODUCTION&Market=GBL&PanelGroupName=PRODID_COMPLETIONS';
                        context.attr("src",url);
                        _step = 'step7';
                        context.one('load', function(){
                            nextStep();       
                        }); 
                    }
                },
                step7: function(){
                    //alert('step7: enter in PID then submit form to go to scrap entry screen');
                    
                    //var contents = context.contents();
                    var fr = document.getElementById("autoentry").contentWindow.document;
                    var pid = fr.getElementById('SF_PRDN_PRM_WRK_PRODUCTION_ID$11$').value = _model.pid;
                    var frm = fr.forms[1];
                   
                    if(_model.scrap<0) 
                        frm.SF_PRDN_PRM_WRK_REVERSE_COMPL$chk.value = "y";
                    //alert('check for negative: ' + frm.SF_PRDN_PRM_WRK_REVERSE_COMPL$chk.value);
                    
                    frm.ICAction.value="SF_PB_WRK_RFR_PRDN_COMPL_PB";
                    frm.submit();
                    //opScrap is for step 8 and 8_1
                    _model.opScrap = false;
                    _step = 'step8';
                    context.one('load', function(){
                        nextStep();       
                    }); 
                },
                step8: function(){
                    //alert('step8: Add scrap, recurse, add machine number, if endscrap, go to step9, else go to next pid');
                    
                    var fr = document.getElementById("autoentry").contentWindow.document;
                    var txtMachine = fr.getElementById('SM_SFRPTLINK_WK_MACHINE_CODE$0')
                    var op = fr.getElementById('SF_COMPL_WRK_COMPL_OP_SEQ$0');  
                    var txtScrapQty = fr.getElementById('SF_COMPL_WRK_SCRAPPED_QTY$0')
                    //alert(_model.scrap);
                    //alert(parseInt(txtScrapQty.value) == _model.scrap)
                    if (!_model.step8_1){                      
                        //alert('1')
                        var frm = fr.forms[1];
                        frm.ICAction.value = "SF_COMPL_WRK_COMPL_OP_SEQ$prompt$0";
                        frm.submit();
                        _step = 'step8_1';
                        document.getElementById("autoentry").onreadystatechange = blockAlerts;
                        context.one('load', function(){
                            nextStep();       
                        }); 
                    }
                    else if (txtMachine && parseInt(txtScrapQty.value) == _model.scrap){
                        //alert('2')
                        txtMachine.value = _model.machine;
                        _step = 'stepSaveScrap'; 
                        nextStep();                         
                    }
                    else if(parseInt(txtScrapQty.value) == _model.scrap) {
                        //alert('3')
                        op.value = _model.opseq;
                        op.onchange();
                        _step = 'step8';
                        document.getElementById("autoentry").onreadystatechange = blockAlerts;                       
                        context.one('load', function(){
                            nextStep();       
                        }); 
                    }
                    
                    else {
                        //alert('4')
                        txtScrapQty.focus()
                        txtScrapQty.value = _model.scrap;
                        txtScrapQty.onchange()          
                        document.getElementById("autoentry").onreadystatechange = blockAlerts;
                        _step = 'step8';                        
                        context.one('load', function(){
                            nextStep();       
                        });      
                         
                    }
                },
                step8_1: function(){
                    //alert("step8_1")
                    var fr = document.getElementById("autoentry").contentWindow.document;
                    var scrap;
                    var myObjs = fr.querySelectorAll('tr td:first-child'); // get element by tag name 
                    var index;
                    var row;
                    // Search DOM for table row of current opseq
                    for (var i=0;i<myObjs.length; i++){
                        var html = myObjs[i].innerHTML+ '';                        
                        if(html.indexOf('#ICRow')>=0 && html.indexOf(_model.opseq)>=0 ){
                            index = html.indexOf('#ICRow');
                            row = html.slice(index,index +7);
                           
                        }
                            
                    }
                    // Find the scrap value by it's column
                    var myObjs = fr.querySelectorAll('tr td:nth-of-type(7) a'); // get element by tag name 
                    for (var i=0;i<myObjs.length; i++){
                        var html = myObjs[i]+ '';
                        if(html.indexOf(row)>=0){
                            scrap = parseInt(myObjs[i].innerHTML);                            
                        }
                            
                    }
                    if (scrap > 0)
                        _model.endscrap = 0;

                    _model.scrap -= scrap;
                    if (_model.scrap<0){
                        _model.scrap = 0;
                    }                         
                    var frm = fr.forms[1];
                    _model.step8_1=true;
                    frm.ICAction.value=row;
                    frm.submit();
                    _model.opScrap = true
                    if(_model.scrap == 0)
                        _step = 'stepSaveScrap'
                    else
                        _step = 'step8';
                    
                    document.getElementById("autoentry").onreadystatechange = blockAlerts;
                    context.one('load', function(){
                        nextStep();       
                    }); 
                },
                step9: function(){
                    //alert('step9: Find Paper component and add on endscrap length, Save and go to next PID')
                    var contents = context.contents();
                    var fr = document.getElementById("autoentry").contentWindow.document;
                    var temp = {}
                    if(_model.enterendscrap){
                        for(var i=0,len=_model.componentcode.length;i<len;i++){
                            var num = contents.find('input[value="' + _model.componentcode[i].cc + '"]');
                            if (num.length ==0){
                                alert("step9-PeopleSoftEntry" + " Could not find paper component");
                                
                                temp.flag = _errors = true;
                                temp.flagreason = 'AutoEntry: incorrect paper component: ' + _model.componentcode[i].cc;
                                _collection[_currentModel].set(temp);
                                _step = 'step10';
                                nextStep(); 
                                return;
                            }
                            num = num.attr("id").substr(-1);
                            
                            //alert('component row:' + ();
                            var txtEndScrap = contents.find('#SF_COMP_LIST_PEND_CONSUME_QTY\\$' + num);
                            var feedup = parseFloat(contents.find('#SF_COMPQTY_WRK_QTY_PER\\$' + num).val());
                            var qty = txtEndScrap.val();
                            //alert('psfeedup: ' + feedup + ' CEDfeedup: ' + _model.feedup + ',assort: ' + _model.assortment);
                            //alert('row: ' + num + ', ' + qty + ' + ' + _model.componentcode[i].sc + ' + ' + _model.componentcode[i].es + ' = ' + (Math.round(((_model.assortment ? 0 : qty)+ (_model.componentcode[i].es + _model.componentcode[i].sc))*100)/100));
                            txtEndScrap.val(Math.round(((_model.assortment ? 0 : qty) + (_model.componentcode[i].es + _model.componentcode[i].sc))*100)/100);
                        } 
                    } 
                    _model.endscrap = 0;  
                   //submitAction_main0(document.main0, '#ICPanel18')
                   _step = 'stepSaveScrap';
                    
                   nextStep();                    
                },
                stepSaveScrap: function(){
                    //alert('stepSaveScrap: Save scrap entry');
                    var fr = document.getElementById("autoentry").contentWindow.document;
                    //alert('endscrap: ' +_model.endscrap )
                    if (_model.endscrap <= 0 || !_model.enterendscrap){
                        //save page here
                        if (_model.scrap == 0){
                            _step = 'step10';
                            nextStep();
                            return;
                        }

                        var btnS = fr.getElementsByName('#ICSave')
                        //alert(btnS[0]);
                        btnS[0].click();
                        _step = 'step10';
                        
                        document.getElementById("autoentry").onreadystatechange = blockAlerts;
                        
                        context.one('load', function(){
                            nextStep();       
                        });                        
                    }
                    else {
                        //set form to go to component screen
                        
                        var frm = fr.forms[1];
                        frm.ICAction.value = "#ICPanel18";
                        frm.submit();
                        _step = 'step9';
                        context.one('load', function(){
                            nextStep();       
                        }); 
                    }
                },
                step10: function(){
                    //alert('Step10: check for errors with save.. if none go to next record');
                    if(!_errors)
                        _collection[_currentModel].set({entered:true});
                    else{
                        //alert('errors... not marking entered');    
                    } 
                    _errors = false;
                    _currentModel++;
                    if(_currentModel<_collection.length){
                        _step = 'step2';
                        nextStep();
                    }
                    else {
                        alert('Data Entry finished');
                        //that.collection.syncServer();
                    }
                }
            }
            var nextStep = function(){
                var thisStep = map[_step];
                if (thisStep) {
                    thisStep();
                    //setTimeout(function(){thisStep(context,fr,data);},100);
                }
            } 
            
            return {
                run: function(){
                    var thisStep = map[_step];
                    if (thisStep) {
                        thisStep();
                        //setTimeout(function(){thisStep(context,fr,data);},100);
                    }
                }
            }
        }
    });
	
    // Returns the View class
    return View;
});