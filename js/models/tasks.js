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
        sql: 'SELECT Tasks.ID, Tasks.Task, Tasks.Type, Tasks.AssignedTo, Tasks.Idea_ID, Tasks.Options, Tasks.Created, Tasks.CreatedBy, Tasks.Completed, Tasks.LastUpdated,Tasks.UpdatedBy, Tasks.DueAt FROM Tasks',
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