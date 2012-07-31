define(['jquery', 'backbone', 'engine', 'handlebars', 'models/PSDetail', 'text!templates/PSApp.html', 'models/PSDetails','views/PSDetail'], function($, Backbone, E, Handlebars, Model, template, Collection, subView){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'PSApp',
        collection: new Collection(),
        template: template,
        events: {
            'blur .pid':'change',
            'click .loadtable': 'loadTable',
            'click .btnRun': 'runEntry'        
        },
        initialize: function() {
            this.collection.add (new Model());
            this.collection.add (new Model());
            this.collection.add (new Model());
            this.template = Handlebars.compile(this.template);
            this.model = new Model();
            _.bindAll(this, 'render','change','enterPeopleSoftScript','tester');
            
        },
    
        // Re-render the contents of the todo item.
        render: function() {
            var temp = this.model.toJSON();
            
            temp = this.template(temp);
            
            this.$el.html( temp );
            return this;
        },
        change: function(){
            
            var newvalue = this.$el.find('.pid').val();
            this.model.set({pid: newvalue})
        },
        addAll: function(models) {
            
          // create in memory element 
          var $el = $('#pidList').clone(); 
          // also get the `className`, `id`, `attributes` if you need them 
         
          // append everything to the in-memory element 
          _.each(models,function(model){ 
            debugger;
            var rowView = new subView({model: model}); 
            $el.append(rowView.render().el); 
          }); 
            
          // replace the old view element with the new one, in the DOM 
          this.$("#pidList").replaceWith($el); 
         
          // reset the view instance to work with the new $el 
          //this.setElement($el); 
    
          //Todos.each(this.addOne);
        },
        loadTable: function(){
            
            this.addAll(this.collection.models);
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
            var _step = step;
            var _collection = this.collection;
            var _model;
            var map = {
                step1: function(){
                    alert('step1: ' + _step);
                    _step = 'step2';
                    nextStep();
                },
                step2: function(){
                    
                    _.each(_collection.models,function(model){
                         alert('step2:' + model.get('opseq'));
                         _model = model.toJSON();
                         _step = 'step3';
                         nextStep();
                    });
                   
                },
                step3: function(){
                    debugger;
                    alert(_model.opseq);
                    //_step = 'step4';
                    //nextStep();
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
        },
        enterPeopleSoftScript: function(step){
        //alert('step: ' + step + ' ' + fr + ',context: ' + context);
        debugger;
        var that= this;
        var fr = document.getElementById("autoentry").contentWindow.document;
        var data = {};
        data.pid = "PID1517002";
        data.opseq = 10;
        data.machine = "5147";
        data.shift = "F";
        data.scrap = 2;
        data.endscrap = 1;
        data.qtycompleted = 15;
        data.setuptime = .33;
        data.runtime = 1.1;
        data.downtime = .25;
        data.operator = 0 + "4703";
        data.date = '7/17/2012';
        data.componentcode = "0208861"
        //alert(document.getElementById("autoentry").contentWindow.window);
        //alert = function(){};
        //alert(alert);
        var context = $('#autoentry')
        var map = {
            step1: function(context,fr){
                //wait for login screen then login.
                var contents = context.contents();
                //alert('step1');
                if (contents.find('#userid').length  == 0){
                    //if not loaded yet... run agian
                    that.enterPeopleSoftScript('step1', context,fr);
                }
                else{
                    var user = contents.find('#userid').val('GIBSONJ');
                    var pwd = contents.find('#pwd').val('GIBSONJ');                 
                    fr.login.submit();
                    context.one('load', function(){
                        that.enterPeopleSoftScript('step2');         
                    });
                }           
                
            },
            step2: function(context,fr){
                //Check for logged in, then go to report screen
                var contents = context.contents();
                if (fr.frames.length >0) {
                    //logged in
                    var url = 'http://scmprd2005.smead.us:7001/servlets/iclientservlet/PRD/?Menu=PROCESS_PRODUCTION&Component=SM_SF_SHIFT_RPT&Market=GBL&Page=SM_SF_SHIFT_RPT&Action=U&target=Transfer21'
                    context.attr("src",url);
                    context.one('load',function(){
                        that.enterPeopleSoftScript('step3');         
                    });
                }       
            },
            step3: function(context,fr, data){
                //alert('step3');
                var contents = context.contents();
                var pid = contents.find('#SM_SF_PID_WRK_PRODUCTION_ID').val(data.pid);
                var op = contents.find('#SM_SF_PID_WRK_OP_SEQUENCE').val(data.opseq);
                var btn = contents.find('#SM_SF_PID_WRK_REFRESH_BTN')

                btn.click();
                document.getElementById("autoentry").onreadystatechange = function(){   
                    //alert('change ' + this.readyState);
                    //E.debug.log('<br />readyState: ' + this.readyState);
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
                debugger;
                
                context.one('load',function(){
                    that.enterPeopleSoftScript('step4');                     
                });
            },
            step4: function(context,fr,data){
                //alert('step4');
                var contents = context.contents();
                var pid = contents.find('#SM_SF_PID_WRK_PRODUCTION_ID').attr("class");
                if (pid =="PSERROR"){
                    //goto next record and start again at step2
                    alert("next record from step4");
                };
                var chkOpDone = contents.find('#SM_SF_PID_WRK_SM_OP_COMPL_FLAG')
                if(chkOpDone.prop('checked')) {
                    //alert('checked already')
                    /*chkOpDone.prop('checked',false);
                    //chkOpDone.click();
                    context.one('load',function(){
                                                        
                    }); 
                    */
                    that.enterPeopleSoftScript('step6'); 
                    return;
                }
                var shift = (data.shift == "F") ? 1 : 2;
                var txtMachine = contents.find('#SM_SF_SHIFT_RPT_MACHINE_CODE\\$0').val(data.machine);
                var txtDate = contents.find('#SM_SF_SHIFT_RPT_OP_START_DT\\$0').val(data.date);
                var txtOperator = contents.find('#SM_SF_SHIFT_RPT_EMPLID\\$0').val(data.operator);
                //var txtShift= contents.find('#SM_SF_SHIFT_RPT_MG_SHIFT\\$0').val(shift);
                var txtSetupTime = contents.find('#SM_SF_SHIFT_RPT_SM_CLK_SETUP_HOURS\\$0').val(data.setuptime);
                var txtRunTime = contents.find('#SM_SF_SHIFT_RPT_SM_CLK_RUN_HOURS\\$0').val(data.runtime);
                var txtDownTime = contents.find('#SM_SF_SHIFT_RPT_SM_CLK_DT_HOURS\\$0').val(data.downtime);
                var txtQtyCompleted = contents.find('#SM_SF_SHIFT_RPT_COMPLETED_QTY\\$0').val(data.qtycompleted);
                var txtScrapQty = contents.find('#SM_SF_SHIFT_RPT_SCRAP_QTY\\$0').val(data.scrap);
                chkOpDone.prop('checked',true);
                
                chkOpDone.click();              
                context.one(function(){
                    that.enterPeopleSoftScript('step5');                                     
                });             
            },
            step5: function(context,fr,data){
                alert('step5: save form');
                var frm = fr.forms[1];
                frm.ICAction.value="#ICSave";
                frm.submit();
                context.one(function(){
                    that.enterPeopleSoftScript('step6');                                                             
                });
            },
            step6: function(context,fr){
                //alert('step6: goto Scrap Entry PID lookup page');
                if (!(data.scrap > 0 || data.endscrap > 0)){
                    //no scrap or endscrap goto next record
                    alert("next record from step6");
                    return;
                }
                else {
                    var url = 'http://scmprd2005.smead.us:7001/servlets/iclientservlet/PRD/?ICType=Panel&Menu=PROCESS_PRODUCTION&Market=GBL&PanelGroupName=PRODID_COMPLETIONS';
                    context.attr("src",url);
                    context.one('load',function(){
                        that.enterPeopleSoftScript('step7');                                                             
                    });
                }
            },
            step7: function(context,fr,data){
                //alert('step7' + context.attr("src"));
                var contents = context.contents();
                var pid = contents.find('#SF_PRDN_PRM_WRK_PRODUCTION_ID\\$11\\$').val(data.pid);
                var frm = fr.forms[1];
                frm.ICAction.value="SF_PB_WRK_RFR_PRDN_COMPL_PB";
                frm.submit();
                context.one('load', function(){
                    that.enterPeopleSoftScript('step8');                                                             
                });
            },
            step8: function(context,fr,data){
                //step8: Add scrap, recurse, add machine number, if endscrap, go to step9, else go to next pid
                var contents = context.contents();
                var txtMachine = contents.find('#SM_SFRPTLINK_WK_MACHINE_CODE\\$0')
                if(txtMachine.length==0){
                    var txtScrapQty = contents.find('#SF_COMPL_WRK_SCRAPPED_QTY\\$0').val(data.scrap);
                    var op = contents.find('#SF_COMPL_WRK_COMPL_OP_SEQ\\$0');               
                    op.val(data.opseq);
                    var frm = fr.forms[1];
                    frm.ICAction.value="SF_COMPL_WRK_COMPL_OP_SEQ$0";
                    frm.submit();
                    context.one('load', function(){
                        that.enterPeopleSoftScript('step8');                                                             
                    });
                }
                else {
                    txtMachine.val(data.machine);
                    //var btnSave = contents.find('#ICSave').click();
                    
                    //submitAction_main0(document.main0, '#ICPanel18')
                    var frm = fr.forms[1];
                    frm.ICAction.value = "#ICPanel18";
                    frm.submit();
                    context.one('load', function(){
                        that.enterPeopleSoftScript('step9');                                                             
                    });
                }
            },
            step9: function(context,fr,data){
                //alert('step9');//Find Paper component and add on endscrap length, Save and go to next PID
                var contents = context.contents();
                var num = contents.find('input[value="' + data.componentcode + '"]');
                if (num.length ==0){
                    //db.logError("step9-PeopleSoftEntry","Could not find paper component",data)
                }
                
                alert('component row:' + (num = num.attr("id").substr(-1)));
                var txtEndScrap = contents.find('#SF_COMP_LIST_PEND_CONSUME_QTY\\$' + num);
                alert(txtEndScrap.val());
                txtEndScrap.val(parseFloat(txtEndScrap.val()) + data.endscrap);
                //save page here
            }
        }
        var thisStep = map[step]; 
        if (thisStep) {
            thisStep(context,fr,data);
            //setTimeout(function(){thisStep(context,fr,data);},100);
        }
        else alert('map didnt work');
        return
    }

    });
	
    // Returns the View class
    return View;
});