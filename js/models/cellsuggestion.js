define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({

    // Default attributes for the todo.
    defaults: {
      content: "empty todo...",
      done: false
    },
	//url: function(){ return this.isNew() ? '/todos' : '/todos/' + this.get('id');},
    
    
    validate: function  (attrs) {
        var err = {};
        if(/Invalid|NaN/.test(new Date(attrs.date))){
            err.date = "Date error: please input a correct date";
        }
        if(!attrs.machine || attrs.workcenter == 'n/a' || attrs.cell == 'n/a')
             err.machine = "machine error: please input a correct machine";
        if(!attrs.associateID)
             err.machine = "Input error: please select a correct associate code or name";
        if(attrs.gain=='')
             this.set('gain',' ');
             
        return ($.isEmptyObject(err)) ? false : err;   
    },
    // Ensure that each todo created has `content`.
    initialize: function() {
        //_.bindAll(this, 'sync')

    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.set({done: !this.get("done")});
    },
    sync: function(method, model,options){
        /* Test without db connection
        if (1==1){
            var rand = Math.random() * 10
            options.success({peNum: '123412', id:rand, opendate: '1/24/2013', machine: '3191',associate: this.get('associate')})
            return {peNum: '123412', id:rand, opendate: '1/24/2013', machine: '3191'};
        }
        */
        var sql ='SELECT MAX(CellSuggestionNum)+1 AS cellnum FROM CellSuggestions';
        var sql2 = "INSERT INTO CellSuggestions (CellSuggestionNum, OpenDate, Suggestion, Cell, Submitter, CellorNew, Gain, OriginalMachine,alphaCode,numericCode,Estimate,ActualCost) VALUES (%s,'%s','%s', %s,'%s','%s','%s','%s','%s','%s','%s','%s')"
        var cellnum, cellid, 
        _error,
        machine = this.get('machine'),
        suggestion = this.get('idea'),
        gain = this.get('gain'),
        workcenter = this.get('workcenter'),
        associateID = this.get('associateID')
        cell = this.get('cell'),
        alpha = this.get('alpha') || 'n/a',
        numeric = this.get('numeric') || 0,
        estimate = this.get('estimate') || 0,
        actual = this.get('actual') || 0;
        var opendate = new Date();
            
        var params = [];
        var success = function(sql,rs){cellnum = rs.fields('cellnum').value; };
        var error = function(error){ 
            if(!_error)
                _error = {};
            _error.db = error;
        };
        var that = this;
        
        var transSuccessfull = this.collection.db.transaction(function(db) {
            var err = false
            err = db.executeSql(sql, success, error);
            //alert('cellnum: ' + cellnum);
            success = function(sql,rs){return;};
            params = [cellnum, opendate.format('mm/dd/yyyy'),suggestion,cell, associateID,'PE',gain,machine,alpha,numeric,estimate,actual];
            sql2 = vsprintf(sql2,params);
            err = db.executeSql(sql2, success, error);
            
            sql2 = 'SELECT CellSuggestionID FROM CellSuggestions WHERE CellSuggestionNum = ' + cellnum;
            params = null;
            success = function(sql,rs){ cellid = rs.fields('CellSuggestionID').value; };
            sql2 = vsprintf(sql2,params);
            err = db.executeSql(sql2, success, error);
            
            success = function(sql,rs){return;};
            sql2 = "INSERT INTO tblStorage (CellSuggestion, Machine, Workcenter, Status_ID) VALUES (%s,'%s','%s',13)";
            params = [cellid,machine,workcenter];
            sql2 = vsprintf(sql2,params);
            err = db.executeSql(sql2, success, error);
            
            //return false everytime for testing
            //err = false;
            
            return err;
        });
        if(transSuccessfull)
            options.success({peNum: cellnum, id:cellid})
        else
            options.error(this,_error)
        
        return (transSuccessfull) ? {peNum: cellnum, id:cellid} : false;
    }

  });

    // Returns the Model class
    return Model;

});