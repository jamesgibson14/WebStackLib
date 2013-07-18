define(['jquery', 'backbone','engine','models/BaseCollection'], function($, Backbone,E, BaseCollection) {

    var Model = Backbone.Model.extend({

            defaults: {
	            associates: BaseCollection.extend({
	                sql: "SELECT ID = RecordID, UserID = Users.ID, Name, AssociateCode = [Employee Number], Cell = ExprCell FROM Associates LEFT JOIN Users ON Users.Associate_ID=Associates.RecordID WHERE ExprStatus <> 'Terminated' OR ExprStatusDate > DateADD(year,-1,GETDATE()) ORDER BY Name",
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
	            items: BaseCollection.extend({
	                sql:"SELECT ID, Code, Description From Items Order by Code",
	                db: E.sqlProd2,
	                url: '/Items',
	                initialize: function(){
	                    _.bindAll(this,'listSource','renderForDataEntry')
	                },
	                renderForDataEntry: function(){
	                    return this.map(function(model){
	                        return {id:model.id, label: model.get('Code'), title: model.get('Description')}
	                    })
	                },
	                listSource: function(request,response){
	                    var data = [];
	                    var term = request.term.toUpperCase();
	                    var itemMTO = (term[0]==='F' || term[0]==='Z') 
	                    this.each(function(model){
	                        var code = model.get('Code');
	                        if(code.indexOf(term)>=0){ 
                                data.push({id: model.id, label: code})
                            }
	                    }) || [];
	                    response(data.slice(0,30))
	                }	              
	            })
	            
            },
            getList: function(listAttr){
                var list = this.get(listAttr)
                if (!list.length){
                    list = new list()
                    this.set(listAttr,list)
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