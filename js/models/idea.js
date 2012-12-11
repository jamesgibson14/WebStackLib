define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({
        db: E.sqldb,
        defaults: {
            details: {gains: 'It will make us all richer'}
        },
        // Ensure that each todo created has `content`.
        initialize: function() {
    
        },
        read: function(){
            var sql ='SELECT * FROM Ideas';
            this.db.transaction(function(db) {
                return db.executeSql(SQL, [], success, error);
            });
        },
        create: function(){
            var that = this
            var sql ="Execute spIdeas @method='create', @data='" + JSON.stringify(this.toJSON()) + "', @now = '" + new Date().toISOString() + "', @associate_ID = " + E.user.get('Associate_ID') + ";";
            alert(sql);
            var success = function(tx,rs){
                
                that.set('id',rs.fields('ID').value);
                //alert('successfull id: ' + that.id);
                
            },
            error = function(){alert('failed');return}
            this.db.transaction(function(db) {
                return db.executeSql(sql, null, success, error);
            });
        },
        update: function(){
              
        },
        remove: function(){
            
        },
        sync: function(method, model,options){
            switch(method){
                case "read":    this.read(); 
                    break;
                case "create":  this.create();
                    break;
                case "update":   this.update();
                    break;
                case "updateAll":  store._executeSql(model.sqlqueue,[],function(){return;},error);
                    break;
                case "delete":  this.remove();
                    break;
                default:
                    alert(method);
            }
        }

  });

    // Returns the Model class
    return Model;

});