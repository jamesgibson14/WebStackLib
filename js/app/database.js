/*
Engine Plugin: 	Database
Author:			James Gibson
Date:			2011-11-29
Description:	This will hold or base all the javascript code dealing with database interaction.
*/
engine.ADODB = function(options){
	var s = {
		database: 'CCDB',
		source: '//smead.us/data/Share.CC/DB/HistPerm/BE/shareddb.accdb',
		source: 'C:/DATABASES/Sync/DataControl.accdb',
		sqlsource: 'SQLTEST2',
		type: 'sqlserver',
		timeout: 5,
		security: 'False'
	}
	
	//build ADO Connect String
	_.extend(s,options)
	if(s.type == 'sqlserver')
	   var conn_str = "Provider='sqloledb';Data Source='" + s.sqlsource + "';Initial Catalog='" + s.database + "';User Id=CCADMIN;Password=S3CURITY;Timeout=5";
	else if (s.type == 'access')
	   var conn_str = 'Provider=Microsoft.ACE.OLEDB.12.0;Data Source=' + s.source + ';Persist Security Info='+ s.security +';';
    if (ActiveXObject)
	   var conn = new ActiveXObject("ADODB.Connection");
    conn.open(conn_str);
	this.executeSql = function(SQL,args,success,error){
		var rs = new ActiveXObject("ADODB.Recordset");
		SQL = vsprintf(SQL,args);
		try{
		    var now = new Date();
			rs = conn.Execute(SQL);
			//alert('opend query time: ' + (new Date()-now));
			now = new Date();
			success(SQL,rs);
			//alert('callback success run time: ' + (new Date()-now));
			return true;
		}
		catch(err){
			alert(err.message);
			error(SQL,err);
			//throw err;
			//rs.close();
			return false;
		}
	};
	this.transaction = function(func){
		var now = new Date();
		var res;
		
		conn.BeginTrans();		
        //alert('transaction open time: ' + (new Date()-now));
		res = func(this);

		if(res) 
			conn.CommitTrans();
		else
			conn.RollbackTrans();
		//conn.close;
		//alert('transaction to db time: ' + (new Date()-now));
	}
	
	//this.conn = "I am connected!"
	return this;
};