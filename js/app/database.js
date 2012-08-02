/*
Engine Plugin: 	Database
Author:			James Gibson
Date:			2011-11-29
Description:	This will hold or base all the javascript code dealing with database interaction.
*/
engine.MSSQLDB = function(options){
	var s = {
		provider: 'Microsoft.ACE.OLEDB.12.0',
		database: 'CCDB',
		source: '//smead.us/data/Share.CC/DB/HistPerm/BE/shareddb.accdb',
		source: 'C:/DATABASES/Sync/DataControl.accdb',
		type: 'access',
		timeout: 5,
		security: 'False'
	}
	//build ADO Connect String
	//var conn_str = "Provider='sqloledb';Data Source='" + gblServer + "';Initial Catalog='" + gblDatabase + "';User Id=CCADMIN;Password=S3CURITY;Timeout=5";
	this.conn_str = 'Provider='+ s.provider +';Data Source=' + s.source + ';Persist Security Info='+ s.security +';';

	this.conn = new ActiveXObject("ADODB.Connection");

	this.executeSql = function(SQL,args,success,error){
		var rs = new ActiveXObject("ADODB.Recordset");
		SQL = vsprintf(SQL,args);
		try{
			rs = this.conn.Execute(SQL);
			success(SQL,rs);
			return true;
		}
		catch(err){
			//alert(err.message);
			error(SQL,err);
			throw err;
			return false;
		}
	};
	this.transaction = function(func){
		var now = new Date();
		var res;
		this.conn.open(this.conn_str);
		this.conn.BeginTrans();		

		res = func(this);

		if(res) 
			this.conn.CommitTrans();
		else
			this.conn.RollbackTrans();
		this.conn.close;
		alert('transaction to db time: ' + (new Date()-now));
	}
	
	//this.conn = "I am connected!"
	return this;
};