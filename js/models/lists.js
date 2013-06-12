define(['jquery', 'backbone','engine','models/BaseCollection'], function($, Backbone,E, BaseCollection) {

    var Model = Backbone.Model.extend({

            defaults: {
	            associates: BaseCollection.extend({
	                sql: "SELECT ID = RecordID, UserID = Users.ID, Name, AssociateCode = [Employee Number], Cell = ExprCell FROM Associates LEFT JOIN Users ON Users.Associate_ID=Associates.RecordID WHERE ExprStatus <> 'Terminated' OR ExprStatusDate > DateADD(year,-1,GETDATE())",
	                db: E.sqlProd2,
	                url: '/Associates',
	                getByUserID:function(id){
	                    return this.findWhere({User_ID: id});
	                },
	                renderForDataEntry: function(){
	                    return this.map(function(model){
	                        return {id:model.id, label: model.get('Name') + ' (' + model.get('AssociateCode') + ')'}
	                    })
	                }
	            }),
	            users: new BaseCollection(),
	            items: new BaseCollection(),
	            
            },
            getList: function(list){
                var list = this.get(list)
                if (!list.length){
                    list = new list()
                    this.set(list)
                    list.fetch();
                    return list; 
                }
                else
                    return list;
            }
    });
    E.lists = new Model()
    // Returns the Model class
    return E.lists

});