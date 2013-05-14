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
            switch(method) {
                case "read":   this.find(options); 
                    break;
                case "create":  this.create(options);
                    break;
                case "update":   this.update(options);
                    break;
                case "delete":  this.destroy(options);
                    break;
                default:
                    alert(method);
            }      
        },
        find: function(options){
            var id = (this.id || this.attributes.id);
            this._executeSql("SELECT * FROM "+this.url+" WHERE " + this.idAttribute + " = '" + id + "'");
        },
        create: function(options){
            var columns;
            var values;
            var sql ;
            this._executeSql(model.sql,model.sqlArgs || null);
            this._executeSql('Select id= SCOPE_IDENTITY();',null,success)
        },
        update: function(options){
            if (!this.hasChanged())
                return;
            var that = this
            var params = this.router._extractParameters(this.router._routeToRegExp('/:table/:id'),this.url())
            var sql = "UPDATE " + params[0] + ' SET '; 
            debugger;
            $.each(this.changed,function(key, value){
                sql += key + " = '" + that._escapeQuotes(value) + "'";
            })
            sql += " WHERE ID = " + params[1]
           var rs = this._executeSql(sql)
           alert(sql)
        },
        destroy: function(model,options){
            
        },
        _executeSql: function(sql){
            return this.db.transaction(function(db) {
                return db.executeSql(sql);
            });
        },
        _escapeQuotes: function(string){
            return string.replace("'","''")
        }
        
    });

    // Returns the Model class
    return E.BaseADODB;

});