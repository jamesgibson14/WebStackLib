define([
  'jquery',
  'underscore',
  'backbone',
  'engine',
  'models/task'
], function($, _, Backbone, E, Model){
  var collection = Backbone.Collection.extend({
// Reference to this collection's model.
    model: Model,
    url: '/Tasks',
    sql: 'SELECT Tasks.ID, Tasks.Task, Tasks.Type, Tasks.AssignedTo, Tasks.PreviousTask_ID, Tasks.Options, Tasks.Created, Tasks.CreatedBy, Tasks.Completed, Tasks.LastUpdated,Tasks.UpdatedBy, Associates.Name, Associates_1.Name AS CreatedByName FROM dbo.Associates AS Associates_1 INNER JOIN dbo.Users AS Users_1 ON Associates_1.RecordID = Users_1.Associate_ID INNER JOIN dbo.Tasks INNER JOIN dbo.Users INNER JOIN dbo.Associates ON Users.Associate_ID = Associates.RecordID ON Tasks.AssignedTo = Users.ID ON Users_1.ID = dbo.Tasks.CreatedBy',
    sqlqueue: ';',
    db: E.sqlTest2,
    // set all of the todo items under the `"todos"` namespace.
    //localStorage: new Store("todos-backbone"),
    store: new WebSQLStore(E.sqlTest2,'Tasks',false,false),
    
    // Filter down the list of all todo items that are finished.
    done: function() {
      //alert('done');
      return this.filter(function(model){ return model.get('done'); });
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
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