define([
  'jquery',
  'underscore',
  'backbone',
  'engine',
  'models/task'
], function($, _, Backbone, E, Model){
    var collection = Backbone.Collection.extend({
        model: Model,
        url: '/Tasks',
        sql: 'SELECT Tasks.ID, Tasks.Task, Tasks.Type, Tasks.AssignedTo, Tasks.PreviousTask_ID, Tasks.Options, Tasks.Created, Tasks.CreatedBy, Tasks.Completed, Tasks.LastUpdated,Tasks.UpdatedBy, Associates.Name, Associates_1.Name AS CreatedByName FROM Tasks LEFT JOIN dbo.Associates AS Associates_1 ON Associates_1.RecordID = CreatedBy LEFT JOIN dbo.Associates ON AssignedTo = Associates.RecordID ',
        sqlqueue: ';',
        db: E.sqlTest2,
        store: new WebSQLStore(E.sqlTest2,'Tasks',false,false),
        
        done: function() {
          return this.filter(function(model){ return model.get('done'); });
        },
    
        remaining: function() {
          return this.without.apply(this, this.done());
        },
    
        nextOrder: function() {
          if (!this.length) return 1;
          return this.last().get("Options").LP + 1;
        },
        comparator: function(model) {
            var val = model.get("Options").LP
            return val ? val : this.nextOrder();
        },
        saveQueued: function(){
            Backbone.sync('updateAll',this,{});
        }
    });

    return collection;
});