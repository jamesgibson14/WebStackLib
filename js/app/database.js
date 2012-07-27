/*
Engine Plugin: 	Database
Author:			James Gibson
Date:			2011-11-29
Description:	This will hold or base all the javascript code dealing with database interaction.
*/

(function(e) {
	var db = function(options){	
		var db = this,
		conn,
		connstr = gblconn_str || '',
		s = {
			
		};
		
		db.testdb = function(){
			return "testdb prototype called";
		}
		db.testconnection = function(){
			conn = new ActiveXObject("ADODB.Connection");
			conn.open(connstr);
			var rs = new ActiveXObject("ADODB.Recordset");
			sql = "SELECT * FROM Items";
			
			conn.execute(sql);
			return 'Connecttion Sucessfull'
		}
		db.execute = function(options){
			var settings = {
				sql: 'Execute dbo.spGraphPie '
			}
			var rs = new ActiveXObject("ADODB.Recordset");
			$.extend(true,settings,options);
			var conn = new ActiveXObject("ADODB.Connection");
			conn.open(connstr);
			rs = conn.execute(settings.sql);
			return rs;
		}
		db.getPieGraphArrayFromRecordset = function(options){
			var settings = {
				name: 'Cell',
				label: 'dbo.Machines.Cell_ID',
				data: 'SUM(dbo.CompiledReportingData.NetQtyProduced)',
				sql: 'Execute dbo.spGraphPie '
			}
			var rs = new ActiveXObject("ADODB.Recordset");
			var graphdata = [];
			var conn = new ActiveXObject("ADODB.Connection");
			conn.open(connstr);		
			$.extend(true,settings,options);
			settings.sql += " N'" + settings.data + "', N'" + settings.label + "'";
			if (settings.cellID){
				settings.sql += ", N'" + settings.cellID + "'"
			}
			rs = conn.execute(settings.sql);
			
			while (!rs.eof){      
				//groupByCollection["group" + i].avg = groupByCollection["group" + i].sum / groupByCollection["group" + i].count;
				//alert("gradata: " + i);
				//graphdata.push({ label: settings.name + " "+rs.fields("Label").value, data: rs.fields("Data").value });
				graphdata.push([settings.name + " "+rs.fields("Label").value, rs.fields("Data").value ]);
				rs.movenext;		
			}
			return graphdata;
		}
		db.getDataSetsGraphArrayFromRecordset = function(options){
			var settings = {
				name: 'Raw Stock Daily Transactions',
				label: 'dbo.Machines.Cell_ID',
				data: 'SUM(dbo.CompiledReportingData.NetQtyProduced)',
				sql: 'Execute dbo.spGraphADC '
			}
			var rs = new ActiveXObject("ADODB.Recordset");
			var graphdata = [], graphseries = [], dataobj = {};
			var conn = new ActiveXObject("ADODB.Connection");
			conn.open(connstr);		
			/*
			$.extend(true,settings,options);
			settings.sql += " N'" + settings.data + "', N'" + settings.label + "'";
			if (settings.cellID){
				settings.sql += ", N'" + settings.cellID + "'"
			}
			*/
			
			rs = conn.execute(settings.sql);
			E.debug.log("<br>RS returned in : " + E.debug.gettimer('startup') + " ms");
			$("#debuglog").prepend('<br /><br />rs.fields.count:' + dumpObj(rs.fields.count));
			for(var i=0; i!= rs.fields.count; ++i){
				//$("#debuglog").prepend('key:' + rs.fields(i).name + ' val: ' + rs.fields(i).value);
				if (rs.fields(i).name != "DateCreated"){
					graphseries[i-1] = {label:rs.fields(i).name};
					graphdata[i-1] = [];
				};
			};
			//$("#debuglog").prepend('<br /><br />dataobj:'+ i + dumpObj(dataobj));
			var i = 0;
			while (!rs.eof){  
				var x = 0;
				x = '' + rs.fields('DateCreated').value;
				//groupByCollection["group" + i].avg = groupByCollection["group" + i].sum / groupByCollection["group" + i].count;
				//alert("gradata: " + i);
				//$("#debuglog").prepend('<br /><br />rs field:'+ 0 + ':'+ rs.fields(0).name + ':'+ rs.fields(0).value);
				//$("#debuglog").prepend('<br /><br />rs field:'+ 7 + ':'+ rs.fields(7).name + ':'+ rs.fields(7).value);
				for(var i=0; i!= rs.fields.count; ++i){
					
					if (rs.fields(i).name != "DateCreated"){
						//$("#debuglog").prepend('<br />rs field:'+ i + ':'+ rs.fields(i).name + ':'+ rs.fields(i).value);
						//dataobj[i].data.push([x,rs.fields(i).value]);
						graphdata[i-1].push([x,rs.fields(i).value])
					}
				}
				//$("#debuglog").prepend('<br /><br />rs:'+ i + rs.fields('DateCreated'));
				i++;
				rs.movenext;		
			}
			//$("#debuglog").prepend('<br /><br />i:'+ i + dumpObj(dataobj));
			//$.each(dataobj, function(key, val) {
			//	$("#debuglog").prepend('<br /><br />key:' + key + ' val:' + val);
			//	graphdata.push(dataobj[key]);
			//});
			//graphdata.push(dataobj['E']);
			//graphdata.push(dataobj['F']);
			//alert("Done with calc");
			dataobj.series = graphseries;
			dataobj.data = graphdata;
			debugger;			
			return dataobj;
		}
		db.getDropdownFromRecordset = function(options){
			var settings = {
				sql: ""
			}
			conn = new ActiveXObject("ADODB.Connection");
			conn.open(E.db.conn_str);
			var rs = new ActiveXObject("ADODB.Recordset");
			var html = "";
			rs = conn.execute(settings.sql);
			
			while (!rs.eof){      
				//groupByCollection["group" + i].avg = groupByCollection["group" + i].sum / groupByCollection["group" + i].count;
				//alert("gradata: " + i);
				graphdata.push({ label: settings.label + " "+rs.fields("Cell_ID").value, data: rs.fields("Data").value });
				rs.movenext;		
			}
			
			return graphdata;
		}
	};
	e.db = new db
})(engine);

var MSSQLDB = function(options){
	var s = {
		provider: 'Microsoft.ACE.OLEDB.12.0',
		database: 'CCDB',
		source: '//smead.us/data/Share.CC/DB/HistPerm/BE/shareddb.accdb',
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
		SQL = vsprintf(SQL,args);;
		try{
			rs = this.conn.Execute(SQL);
			success(SQL,rs);
			return true;
		}
		catch(err){
			//alert(err.message);
			error(SQL,err);
			return false;
		}
	};
	this.transaction = function(func){
		var res;
		this.conn.open(this.conn_str);
		this.conn.BeginTrans();		

		res = func(this);

		if(res) 
			this.conn.CommitTrans();
		else
			this.conn.RollbackTrans();
		this.conn.close;
	}
	
	//this.conn = "I am connected!"
	return this;
};