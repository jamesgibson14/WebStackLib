define(['jquery', 'backbone', 'engine', 'handlebars', 'models/PSDetail', 'text!templates/PSApp.html', 'models/PSDetails','views/PSDetail'], 
function($, Backbone, E, Handlebars, Model, template, Collection, subView){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'PSApp',
        collection: new Collection(),
        filteredModels: [],
        filters: false,
        template: template,
        events: {
            'blur .pid':'change',
            'click .loadtable': 'loadData',
            'click .btnRun': 'runEntry',
            'click .filter': 'filter'        
        },
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','change','enterPeopleSoftScript','tester','filter');
            this.collection.bind('reset',     this.filter);
            
        },
        loadData: function(){
            var that = this;
            E.loading(this.$el,that.collection.fetch,this.collection);
            //this.collection.fetch();
        },
        // Re-render the contents of the todo item.
        render: function() {
            //var temp = this.model.toJSON();
            
            var temp = this.template({});
            
            this.$el.html( temp );

            if((document.location + '').indexOf('.hta','.hta')>-1) 
                this.$('#autoentry').attr('src','http://scmprd2005.smead.us:7001/servlets/iclientservlet/PRD/?cmd=login');
            return this;
        },
        change: function(){
            
            var newvalue = this.$el.find('.pid').val();
            this.model.set({pid: newvalue})
        },
        filter: function(){
            //alert('filter and sort');
            debugger;
            //this.collection.sort({silent:true});
            //alert('filters: ' + this.filters);
            if(this.filters)
                this.filteredModels = this.collection.filter(function(model){
                    _.each(this.filters,function(filter){
                        filter(model)
                    })
                });
            else
                this.filteredModels = this.collection.models
            
            var that = this;
            this.addAll();
        },
        addAll: function() {
            // create in memory element
            
            var $el = this.$('#pidList .tablebody').clone(true,true);
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
            
            this.$("#pidList  .tablebody").replaceWith($el);//.replaceWith($el);
            this.$("#pidList").tablesorter({headers:{
                    0:{sorter:false},1:{sorter:false},3:{sorter:false},4:{sorter:false},5:{sorter:false},
                    6:{sorter:false},7:{sorter:false},8:{sorter:false},9:{sorter:false},10:{sorter:false},
                    11:{sorter:false},12:{sorter:false},13:{sorter:false},14:{sorter:false}
                }
            });
            this.$('#collection-stats').html('Total lines: ' + this.filteredModels.length);
            E.hideLoading();             
        },
        runEntry: function(){
            var url = 'http://scmprd2005.smead.us:7001/servlets/iclientservlet/PRD/?cmd=login';
            var node =this.$el.find('#autoentry')
            var that = this;
            //alert(node.attr('src'));
            
            node.show()
            
            this.job = this.tester('step1');
            this.job.run();
            //that.enterPeopleSoftScript('step1');         
          
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
            var map = {
                step1: function(){
                    //alert('step1: wait for login screen then login.');
                    var contents = context.contents();
                    var fr = document.getElementById("autoentry").contentWindow.document;
                    if (context.attr('src') != 'http://scmprd2005.smead.us:7001/servlets/iclientservlet/PRD/?cmd=login'){
                        _step = 'step10';
                        _errors = true;
                        _currentModel = -1;
                        nextStep();
                        return;
                    }
                    if (contents.find('#userid').length  == 0){
                        //if not loaded yet... run agian
                        nextStep();
                    }
                    else{
                        var user = contents.find('#userid').val('GIBSONJ');
                        var pwd = contents.find('#pwd').val('GIBSONJ');                 
                        fr.login.submit();
                         _step = 'step2';
                        context.one('load', function(){
                            nextStep();       
                        });
                    }           
                    
                },
                step2: function(){
                    //alert('step2: Check for logged in, then go to report screen')
                  
                    var contents = context.contents();                   
                    _model = _collection[_currentModel].toJSON();                                      
                    if(_model.flag || _model.entered){
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
                    
                    var contents = context.contents();
                    
                    var pid = contents.find('#SM_SF_PID_WRK_PRODUCTION_ID').val(_model.pid);
                    var op = contents.find('#SM_SF_PID_WRK_OP_SEQUENCE').val(_model.opseq);
                    var btn = contents.find('#SM_SF_PID_WRK_REFRESH_BTN')
                    btn.click();
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
                    var contents = context.contents();
                    var fr = document.getElementById("autoentry").contentWindow.document;
                    var pid = contents.find('#SM_SF_PID_WRK_PRODUCTION_ID').attr("class");
                    if (pid =="PSERROR"){
                        //alert("Error with PID go to next record");
                        var temp = {}
                        temp.flag = _errors = true;
                        temp.flagreason = 'AutoEntry: PID closed or other error';
                        _collection[_currentModel].set(temp);
                        _step = 'step10';
                        nextStep();
                        return;
                    };
                    var chkOpDone = contents.find('#SM_SF_PID_WRK_SM_OP_COMPL_FLAG')
                    _model.prevscrap = parseFloat(contents.find('#SM_SF_SHIFT_RPT_SCRAP_QTY\\$0').val())+0;
                    
                    
                    if(chkOpDone.prop('checked')) {                    
                        //---ajust scrap that needs to be entered-----
                        //_model.scrap -= _model.prevscrap;
                        //alert('scrap - prevscrap: ' + (_model.scrap ));
                        //---------------------------------------------
                        
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
                    var txtMachine = contents.find('#SM_SF_SHIFT_RPT_MACHINE_CODE\\$0').val(_model.machine);
                    var txtDate = contents.find('#SM_SF_SHIFT_RPT_OP_START_DT\\$0').val(_model.date);
                    var txtOperator = contents.find('#SM_SF_SHIFT_RPT_EMPLID\\$0').val(_model.operator);
                    //var txtShift= contents.find('#SM_SF_SHIFT_RPT_MG_SHIFT\\$0').val(shift);
                    var txtSetupTime = contents.find('#SM_SF_SHIFT_RPT_SM_CLK_SETUP_HOURS\\$0').val(_model.setuptime);
                    var txtRunTime = contents.find('#SM_SF_SHIFT_RPT_SM_CLK_RUN_HOURS\\$0').val(_model.runtime);
                    var txtDownTime = contents.find('#SM_SF_SHIFT_RPT_SM_CLK_DT_HOURS\\$0').val(_model.downtime);
                    var txtQtyCompleted = contents.find('#SM_SF_SHIFT_RPT_COMPLETED_QTY\\$0').val(_model.qtycompleted);
                    var txtScrapQty = contents.find('#SM_SF_SHIFT_RPT_SCRAP_QTY\\$0').val(_model.scrap);
                    chkOpDone.prop('checked',true);
                    
                    chkOpDone.click();              
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
                    
                    var contents = context.contents();
                    var fr = document.getElementById("autoentry").contentWindow.document;
                    var pid = contents.find('#SF_PRDN_PRM_WRK_PRODUCTION_ID\\$11\\$').val(_model.pid);
                    var frm = fr.forms[1];
                   
                    if(_model.scrap<0) 
                        frm.SF_PRDN_PRM_WRK_REVERSE_COMPL$chk.value = "y";
                    //alert('check for negative: ' + frm.SF_PRDN_PRM_WRK_REVERSE_COMPL$chk.value);
                    
                    frm.ICAction.value="SF_PB_WRK_RFR_PRDN_COMPL_PB";
                    frm.submit();
                    _step = 'step8';
                    context.one('load', function(){
                        nextStep();       
                    }); 
                },
                step8: function(){
                    //alert('step8: Add scrap, recurse, add machine number, if endscrap, go to step9, else go to next pid');
                    var contents = context.contents();
                    var fr = document.getElementById("autoentry").contentWindow.document;
                    var txtMachine = contents.find('#SM_SFRPTLINK_WK_MACHINE_CODE\\$0')
                    var op = contents.find('#SF_COMPL_WRK_COMPL_OP_SEQ\\$0');  
                    var txtScrapQty = contents.find('#SF_COMPL_WRK_SCRAPPED_QTY\\$0')
                    alert(_model.scrap);
                    if (parseInt(op.val()) != _model.opseq){
                        //only enter endscrap which is process scrap converted to feet + endscrap
                        txtScrapQty.val(_model.scrap); 
                        var frm = fr.forms[1];
                        frm.ICAction.value = "SF_COMPL_WRK_COMPL_OP_SEQ$prompt$0";
                        frm.submit();
                        _step = 'step8_1';
                        context.one('load', function(){
                            nextStep();       
                        }); 
                    }
                    else {
                        txtScrapQty.val(_model.scrap);  
                        txtMachine.val(_model.machine);
                        //alert('doublecheck values');         
                        
                        _step = 'stepSaveScrap';                        
                        nextStep();       
                         
                    }
                },
                step8_1: function(){
                    var contents = context.contents();
                    var fr = document.getElementById("autoentry").contentWindow.document;
                    var table = contents.find('tr td:first-child :contains(' + _model.opseq + ')')
                    //alert(table.parent().html());
                    var index = (table.attr('href')+'').indexOf('#');
                    //alert(index);
                    var row = (table.attr('href')+'').slice(index,index +7);
                    var scrap = table.parent().next().next().next().next().next().next().children().first();
                    
                    scrap = parseInt(scrap.html());
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
                    _step = 'step8';
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
                            alert('psfeedup: ' + feedup + ' CEDfeedup: ' + _model.feedup);
                            alert('row: ' + num + ', ' + txtEndScrap.val() + ' + ' + _model.componentcode[i].es + ' = ' + (Math.round((parseFloat(txtEndScrap.val())+ (_model.componentcode[i].es + _model.componentcode[i].sc))*100)/100));
                            txtEndScrap.val(Math.round((parseFloat(txtEndScrap.val()) + (_model.componentcode[i].es))*100)/100);
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
                    if (_model.endscrap <= 0){
                        //save page here
                        if (_model.scrap == 0){
                            _step = 'step10';
                            nextStep();
                            return;
                        }
                        if(!confirm('save scrap entries ')){
                            var temp = {}
                            temp.flag = _errors = true;
                            temp.flagreason = 'AutoEntry: ProcessScrap/EndScrap not entered';
                            _collection[_currentModel].set(temp);
                            _step = 'step10';
                            nextStep(); 
                        }
                        else {
                            var frm = fr.forms[1];
                            frm.ICAction.value = "#ICSave";
                            frm.submit();
                            _step = 'step10';
                            context.one('load', function(){
                                nextStep();       
                            });
                        }                        
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