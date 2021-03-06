define(['jquery', 'backbone','engine'], function($, Backbone,E) {

   E.BaseADODB = Backbone.Model.extend({
        constructor: function(){
            Backbone.Model.apply(this, arguments);    
            this.db =  E.sqlTest2
        },
        router: new Backbone.Router(),
        idAttribute: "ID",              
        sync: function(method, model, options) {
            if (this.onBeforeSync) 
                this.onBeforeSync(method,model, options);
            
            var exec
            var options = $.extend({queue:false},options)
            switch(method) {
                case "read":   this.find(options); 
                    break;
                case "create":  this.create(options);
                    break;
                case "update":   this.update(options);
                    break;
                case "delete":  this._destroy(options);
                    break;
                default:
                    alert(method);
            }      
        },
        find: function(options){
            var id = (this.id || this.attributes.id);
            var sql = this.sql || "SELECT * FROM "+this.url()+" WHERE " + this.idAttribute + " = '" + id + "'"
            var result = null;
            if(!options.queue)
                options.success(this._executeSql(sql,null,null)[0]); 
                
        },
        create: function(options){
            if (this.onBeforeCreate) 
                this.onBeforeCreate(options);
                        
            var that = this;
            var columns;
            var values;
            this.sqlDetails = '';
            var params = this.router._extractParameters(this.router._routeToRegExp('/:table'),this.url())
            var sql = 'INSERT INTO ' + params[0];
            sql += this._parseInsertString()
            var success = function(SQL,rs,conn){
                var sql = 'Select id= SCOPE_IDENTITY();'
                try{           
                    rs = conn.Execute(sql);
                }
                catch(err){
                    alert('Error: ' + err.message + ', sql: ' + sql);
                    err.sql = sql
                    conn.RollbackTrans();
                    return false;
                }
                that.id = rs.Fields(0).value;
                if(that.sqlDetails !==''){
                    sql = that.sqlDetails.replace(/%s/g,that.id)
                    try{           
                        rs = conn.Execute(sql);
                    }
                    catch(err){
                        alert('Error: ' + err.message + ', sql: ' + sql);
                        err.sql = sql
                        conn.RollbackTrans();
                        return false;
                    }
                }
                that.trigger('sync')
            };
            
            this._executeSql(sql,success,null);
        },
        update: function(options){
            var that = this;
            var sql = this.sql || '';
            this.sqlDetails = '';
            if (!this.hasChanged())
                return sql;
            var that = this;
            var idattr= this.idAttribute || "ID"
            var queue = options && options.queue ? options.queue : false;
            var success = options && options.success ? options.success : function(){return;};
            if (!sql){
                var params = this.router._extractParameters(this.router._routeToRegExp('/:table/:id'),this.url())
                var values = '';
                sql = "UPDATE " + params[0] + ' SET '; 
                
                $.each(this.changed,function(key, value){
                    if(key.indexOf('Details')>=0)
                        that.parseSqlDetails(key,value,params[1]);
                    else
                        values += key + " = " + that._parseValue(value) + ", ";
                })
                sql += values.slice(0,-2);
                sql += " WHERE "+ idattr + " = " + params[1] + ';'
                if(values.length<1)
                    sql = ';';
            }
            if(this.sqlDetails !=='')
                sql += this.sqlDetails;
            if(!queue)
                var rs = this._executeSql(sql,success)
            
            return sql;
        },
        _destroy: function(options){
            var sql = this.sql || ''
            var that = this;
            if (!sql){
                var params = this.router._extractParameters(this.router._routeToRegExp('/:table/:id'),this.url())
                sql = "DELETE FROM " + params[0] + " WHERE ID = " + params[1]
            }
            var success = options && options.success ? options.success : function(){return;};
            if(!options.queue)
                var rs = this._executeSql(sql,success)
            
            return sql;
        },
        _executeSql: function(sql,success,error){
            return this.db.executeSql(sql,success,error);
        },
        _parseValue: function(value){
            if (value == null)
                return "NULL"
            if(typeof(value) == 'string')
                value = this._escapeQuotes(value);
            else if(typeof(value) == 'Boolean')
                value = value ? 1 : 0;
            else if(typeof(value) == 'object'){
                if(Object.prototype.toString.call(value) === "[object Date]")
                    value = value.format('isoDateTime');
                else
                    value = JSON.stringify(value); 
            }
            return "'" + value + "'";
        },
        _escapeQuotes: function(string){
            return string.replace("'","''")
        },
        _parseInsertString: function(attrs, attrMap){
            var columns = '';
            var values = '';
            var attr;
            attrs || (attrs = this.attributes);
            for (attr in attrs){
                if(attr.indexOf('Details')>=0)
                    this.parseSqlDetails(attr,attrs[attr],'%s');
                else{                    
                    columns = columns + " " + attr + ", ";
                    values = values + this._parseValue(attrs[attr]) + ", ";
                }
            }
            return " (" + columns.slice(0,-2) + ") VALUES (" + values.slice(0,-2) + "); ";
        },
        parseSqlDetails: function(key, value, id){
            var sql = "DELETE FROM " + this.urlDetails + " WHERE Idea_ID = " + id + " AND [Key] = '" +  key.split('_')[1] + "';";
            sql += "INSERT INTO " + this.urlDetails + " (Idea_ID, [Key], Value) VALUES (" + id + ", '" + key.split('_')[1] + "', " + this._parseValue(value) + ")";
            this.sqlDetails += sql;
        }
        
    });

    // Returns the Model class
    return E.BaseADODB;

});