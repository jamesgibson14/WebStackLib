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
	   var conn_str = "Provider='sqloledb';Data Source='" + s.sqlsource + "';Initial Catalog='" + s.database + "';User Id=CCADMIN;Password=S3CURITY;Connect Timeout=15";
	else if (s.type == 'access')
	   var conn_str = 'Provider=Microsoft.ACE.OLEDB.12.0;Data Source=' + s.source + ';Persist Security Info='+ s.security +';';
    if (ActiveXObject)
	   var conn = new ActiveXObject("ADODB.Connection");
    conn.open(conn_str);
	this.executeSql = function(SQL,success,error,options){
		var rs = new ActiveXObject("ADODB.Recordset");
		var result;
		conn.BeginTrans();
		try{		    
			rs = conn.Execute(SQL);
		}
		catch(err){
			alert('Error: ' + err.message + ', sql: ' + SQL);
			err.sql = SQL
			error(err);
			//throw err;
			//rs.close();
			conn.RollbackTrans();
			E.hideLoading();
			return false;
		}

		if(success)
		  success(SQL,rs,conn);
		else
		   result = _rsToJSON(rs,options,conn);
		try{
		    conn.CommitTrans();
		}
		catch(e){} 		
		return result;
	};
	
    var _rsToJSON = function (rs, options,conn) {      
        var count = 0,len = rs.Fields.Count,result = [];
        var options = options || {}
        if(options.noJSON){
            
            while (!rs.ActiveConnection || !rs.eof){
                var attr ={}
                var i = 0;
                while(i<len){
                    attr[rs.fields(i).name] = rs.fields(i).value;                        
                    i++;   
                }
                if(model.attributes)
                    result = attr
                else
                    result.push(attr);
                rs.movenext;
                count++; 
            }
        }
        else {
            while (!rs.ActiveConnection || !rs.eof){
                var attr ={}
                var i = 0; 
                if(options.add_id)
                    attr.id = count;
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
                result.push(attr);
                rs.movenext;
                count++;
            }
       }       
       conn.CommitTrans();
       return result;     
    }
	
	//this.conn = "I am connected!"
	return this;
};