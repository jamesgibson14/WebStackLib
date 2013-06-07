define([
  'jquery',
  'underscore',
  'backbone','models/BaseADODBModel'
], function($, _, Backbone, Model){
    var collection = Backbone.Collection.extend({
        model: Model,
        constructor: function(){
            var args = Array.prototype.slice.apply(arguments); 
            Backbone.Collection.prototype.constructor.apply(this, args);
            _.bindAll(this, "_rsToJSON");     
            this.db =  E.sqlTest2
        },
        renderAsList: function(options){
            options && (options = {});
            var getLabel = function(model){
                return model.get('label');
            }  
            return _this.map(function(model){
                return {id: model.id, label: getLabel(model)}
            })
        },
        sync: function(method, model, options) {
            if (this.onBeforeSync) 
                this.onBeforeSync(method,model, options);
            
            var sql = this.sql || ''
            this.syncOptions = $.extend({queue:false},options)
            var success = this._rsToJSON
            this._executeSql(sql,success)
             
        },
        _executeSql: function(sql,success,error,options){
            return this.db.executeSql(sql,success,error,options);
        },
        _rsToJSON: function (SQL,rs,conn) {      
            var count = 0,len = rs.Fields.Count,result = [];
            var options = this.syncOptions || {}
            if(!options.hasJSON){
                
                while (!rs.ActiveConnection || !rs.eof){
                    var attr ={}
                    var i = 0;
                    while(i<len){
                        attr[rs.fields(i).name] = rs.fields(i).value;                        
                        i++;   
                    }
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
           options.success(result);     
        }
    })
    // Returns the Model class
    return collection;
});