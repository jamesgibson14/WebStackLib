define(['jquery', 'backbone','engine'], function($, Backbone,E) {

   E.BaseADODB = Backbone.Model.extend({
        constructor: function(){
            Backbone.Model.apply(this, arguments);    
            
        },
        router: new Backbone.Router(),
        idAttribute: "ID",
        db: E.sqlTest2,      
        sync: function(method, model, options) {
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
            var columns;
            var values;
            var sql ;
            this._executeSql(model.sql,model.sqlArgs || null);
            this._executeSql('Select id= SCOPE_IDENTITY();',null,success)
        },
        update: function(options){
            var sql = this.sql || ''
            if (!this.hasChanged())
                return sql;
            var that = this;
            var queue = options && options.queue ? options.queue : false;
            var success = options && options.success ? options.success : function(){return;}
            if (!sql){
                var params = this.router._extractParameters(this.router._routeToRegExp('/:table/:id'),this.url())
                sql = "UPDATE " + params[0] + ' SET '; 
                
                $.each(this.changed,function(key, value){
                    //alert(typeof(value))
                    if(typeof(value) == 'String')
                        sql += key + " = '" + that._escapeQuotes(value) + "'";
                    else if(typeof(value) == 'Boolean')
                        sql += key + " = '" + value ? 1 : 0 + "'";
                    else if(typeof(value) == 'object'){
                        if(Object.prototype.toString.call(value) === "[object Date]")
                            sql += key + " = '" + value.format('isoDateTime') + "'";
                        else
                            sql += key + " = '" + JSON.stringify(value) + "'";                         
                        
                    }
                    else
                        sql += key + " = '" + value + "'";
                })
                sql += " WHERE ID = " + params[1]
            }
            
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
            
            if(!options.queue)
                var rs = this._executeSql(sql)
            
            return sql;
        },
        _executeSql: function(sql,success,error){
            return this.db.executeSql(sql,success,error);
        },
        _escapeQuotes: function(string){
            return string.replace("'","''")
        }
        
    });

    // Returns the Model class
    return E.BaseADODB;

});