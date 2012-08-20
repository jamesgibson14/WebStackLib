// ====== [UTILS] ======
//function for generating "random" id of objects in DB
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

// ====== [ WebSQLStore ] ======

var WebSQLStore = function (db, tableName, initSuccessCallback, initErrorCallback) {
	var success, error;
	this.tableName = tableName;
	this.db = db;
	success = function (tx,res) {
		if(initSuccessCallback) initSuccessCallback();
	};
	error = function (tx,error) {
		//console.log("Error while create table",error);
		if (initErrorCallback) initErrorCallback();
	};
	db.transaction (function(db) {
		return db.executeSql("CREATE TABLE " + tableName + "(ID VARCHAR(100) PRIMARY KEY, [value] MEMO)",[],success, error);
		//CREATE TABLE Employees("EmployeeId INTEGER NOT NULL, LastName   VARCHAR(40)  NOT NULL, FirstName  VARCHAR(40)  NOT NULL)"
	});
};

_.extend(WebSQLStore.prototype,{
	
	create: function (model,initsuccess,error) {
		//when you want use your id as identifier, use apiid attribute
		if (model.attributes.apiid) {
			model.id = model.attributes.id = model.attributes.apiid;
		}
		else {
			model.id = model.attributes.id = guid();
		}
		success = function () {
			return;
		};
		this._executeSql("INSERT INTO " + this.tableName + " VALUES ('%s','%s')",[model.id, JSON.stringify(model.toJSON())], success, error);
	},
	
	destroy: function (model, success, error) {
		//console.log("sql destroy");
		var id = (model.id || model.attributes.id);
		success = function(){return;};
		this._executeSql("DELETE * FROM "+this.tableName+" WHERE id='%s'",[model.id],success, error);
	},
	
	find: function (model, success, error) {
		//console.log("sql find");
		var id = (model.id || model.attributes.id);
		this._executeSql("SELECT id, [value] FROM "+this.tableName+" WHERE id='%s'",[model.id], success, error);
	},
	
	findAll: function (model, success,error) {
		//console.log("sql findAll");
		this._executeSql("SELECT id, [value] FROM "+this.tableName,[], success, error);			
	},
	
	update: function (model, success, error) {
		//console.log("sql update")
		var id = (model.id || model.attributes.id);
		success = function(){return;};
		this._executeSql("UPDATE "+this.tableName+" SET [value]='%s' WHERE id='%s'",[JSON.stringify(model.toJSON()),model.id], success, error);
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
		this.db.transaction(function(db) {
			return db.executeSql(SQL, params, success, error);
		});
	}
});

// ====== [ Backbone.sync WebSQL implementation ] ======

Backbone.sync = function (method, model, options) {
	var store = model.store || model.collection.store, success, error;
	
	if (store == null) {
		console.warn("[BACKBONE-WEBSQL] model without store object -> ", model);
		return;
	}
	
	success = function (tx, rs) {
		var count = 0,len = rs.Fields.Count,result = [];
		while (!rs.ActiveConnection || !rs.eof){
			
			result.push(JSON.parse(rs.fields('value').value));
			rs.movenext;
			count++;
		} 
		
		options.success(result);
	};
	error = function (tx,error) {
		//console.log("sql error");
		//console.log(error);
		//console.log(tx);
		options.error(error);
	};
	
	switch(method) {
		case "read":	(model.id ? store.find(model,success,error) : store.findAll(model, success, error)); 
			break;
		case "create":	store.create(model,success,error);
			break;
		case "update":	store.update(model,success,error);
			break;
		case "delete":	store.destroy(model,success,error);
			break;
		default:
			alert(method);
	}		
};