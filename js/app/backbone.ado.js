// ====== [UTILS] ======
//function for generating "random" id of objects in DB

function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

// ====== [ WebSQLStore ] ======

var WebSQLStore = function (db, tableName, createTable, isJSON, initSuccessCallback, initErrorCallback) {
	var success, error;
	this.createTable = createTable || false;
	this.tableName = tableName;
	this.isJSON = isJSON || false;
	this.db = db;
	if(createTable){
    	success = function (tx,res) {
    		if(initSuccessCallback) initSuccessCallback();
    	};
    	error = function (tx,error) {
    		if (initErrorCallback) initErrorCallback();
    	};
    	db.transaction (function(db) {
    		return db.executeSql("CREATE TABLE " + tableName + "(ID VARCHAR(100) PRIMARY KEY, [value] MEMO)",[],success, error);
    		//CREATE TABLE Employees("EmployeeId INTEGER NOT NULL, LastName   VARCHAR(40)  NOT NULL, FirstName  VARCHAR(40)  NOT NULL)"
    	});
	}
};

_.extend(WebSQLStore.prototype,{
	
	create: function (model,success,error) {
		//when you want use your id as identifier, use apiid attribute
		
		if (model.attributes.apiid) {
			model.id = model.attributes.id = model.attributes.apiid;
		}
		else {
			model.id = model.attributes.id = guid();
		}
		this._executeSql("INSERT INTO " + this.tableName + " VALUES ('%s','%s')",[model.id, JSON.stringify(model.toJSON())], success, error);
	},
	
	destroy: function (model, success, error) {
		//console.log("sql destroy");
		var id = (model.id || model.attributes.id);
		success = function(){return;};
		this._executeSql("DELETE FROM "+this.tableName+" WHERE id='%s'",[model.id],success, error);
	},
	
	find: function (model, success, error) {
		//console.log("sql find");
		var id = (model.id || model.attributes.id);
		this._executeSql("SELECT * FROM "+this.tableName+" WHERE id='%s'",[model.id], success, error);
	},
	
	findAll: function (model, success,error) {
		//console.log("sql findAll");
		if(!model.sql)
		    this._executeSql("SELECT * FROM "+this.tableName,[], success, error);	
		else {
            var args = (model.sqlArgs) ? model.sqlArgs : null;
            this._executeSql(model.sql,args,success,error);
            
        }		
	},
	
	update: function (model, success, error, queue) {
		//console.log("sql update")
		var id = (model.id || model.attributes.id);
		var sql = ''
		success = function(){return;};
		debugger;
		if(!model.storetype){
		  sql = "UPDATE "+this.tableName+" SET [value]='%s' WHERE id='%s'"
		  if (!queue){
		      var attrs = model.toJSON()
		      this._executeSql(sql,[JSON.stringify(attrs),model.id], success, error);
		      
		  }
		  else
		      model.collection.sqlqueue +=  vsprintf(sql, [JSON.stringify(model.toJSON()),model.id]) + ';';		    
	   }
		else {
		    var fields = [],values = [], sql;
		    sql = "UPDATE "+this.tableName+" SET " + this._parseUpdateString(model.changed) + " WHERE id='" + model.id + "'"
		    this._executeSql(sql,values, success, error);
		}
	},
	updateAll: function(){
	    
	},
	_save: function (model, success, error) {
		//console.log("sql _save");
		var id = (model.id || model.attributes.id);
		this.db.transaction(function(tx) {
			tx.executeSql("");
		});
	},
	
	_executeSql: function (SQL, params, successCallback, errorCallback) {
		var success = function(sql,result) {
			//console.log(sql + " - finished");
			if(successCallback) successCallback(sql,result);
		};
		var error = function(sql,error) {
			//console.log(sql + " - error: " + error);
			if(errorCallback) errorCallback(sql,error);
		};
		if (params)
          SQL = vsprintf(SQL,params);
        if(this.debug)
            alert(SQL);
		this.db.transaction(function(db) {
			return db.executeSql(SQL, success, error,true);
		});
	},
	_parseUpdateString: function(attrs, attrMap){
	    var string = '';
	    for (var attr in attrs){
	        if (attr in attrMap)
	           string = string + attr + " = '" + attrs[attr] + "', "
	    }
	    return string.slice(0,-2)
	},
	_parseInsertString: function(attrs, attrMap){
        var columns = '';
        var values = '';
        for (var attr in attrMap){
            columns = columns + "'" + attr + "', ";
            values = values + "'" + attrs[attr] + "', "
        }
        return "(" + columns.slice(0,-2) + ") VALUES (" + values.slice(0,-2) + ")";
    }
});

// ====== [ Backbone.sync WebSQL implementation ] ======

Backbone.sync = function (method, model, options) {
	var store = model.store || model.collection.store, success, error;
	var db;
	var queue =options.queue;
	if(model.collection) 
	   db = model.collection.db
	if(model.db)
	   db = model.db
	 
	if (store == null && db == null) {
		alert("Error: No Storage method available", model);
		return;
	}
	store.debug = options.debug;
    var dtime;
    if (options.now) dtime = options.now
	 debugger;
	success = function (tx, rs) {	   
	    if (options.now){
	        alert('data from server in: ' + (dtime = (new Date() - dtime)))
	        dtime = new Date()
	    }
		var count = 0,len = rs.Fields.Count,result = [];
		if(store.isJSON) {		
    		try{
    		    while (!rs.ActiveConnection || !rs.eof){
        			result.push(JSON.parse(rs.fields('value').value));
        			rs.movenext;
        			count++;
    			}
    		} 
    		catch(err){
    		    
    		}		
		}
		else if (rs.fields(0).name == 'jsonmodels') {
		    result = JSON.parse(rs.fields(0).value);
		}
		else {
    		while (!rs.ActiveConnection || !rs.eof){
                var attr ={}
                var i = 0;
                while(i<len){
                    var val = rs.fields(i).value + '', sl = val.slice(0,1);
                    if(sl=='[' || sl == '{')
                        attr[rs.fields(i).name] = JSON.parse( rs.fields(i).value);
                    else if(rs.fields(i).name.indexOf('time')>-1){
                           attr[rs.fields(i).name] = Math.round(rs.fields(i).value*100)/100
                    }                
                    else{
                        attr[rs.fields(i).name] = rs.fields(i).value;
                    }
                    i++;   
                } 
                //check if model... vs collection
                if(model.attributes)
                    result = attr
                else
                    result.push(attr);
                rs.movenext;
                count++;
            }
	   }
	   if (options.now){ 
	       alert('data from server parsed in: ' + (dtime = (new Date() - dtime)))
	       dtime = new Date()
        }
	   options.success(result);
	   if (options.now){ 
           alert('Backbone ready: ' + (dtime = (new Date() - dtime)))
           dtime = new Date()
        }
	};
	error = function (tx,error) {
		//console.log("sql error");
		//console.log(error);
		//console.log(tx);
		if (options.error)
		  options.error(error);
	};
	
	switch(method) {
		case "read":	(model.id ? store.find(model,success,error) : store.findAll(model, success, error)); 
			break;
		case "create":	store.create(model,success,error);
			break;
		case "update":	 store.update(model,success,error,queue);
			break;
	    case "updateAll":  store._executeSql(model.sqlqueue,[],function(){return;},error);
            break;
		case "delete":	store.destroy(model,success,error);
			break;
		default:
			alert(method);
	}		
};