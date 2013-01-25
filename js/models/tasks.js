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
    urlRoot: '/todos',
    url: function(){ return this.urlRoot;},
    sql: 'Execute dbo.spTasks',
    sqlqueue: ';',
    // set all of the todo items under the `"todos"` namespace.
    //localStorage: new Store("todos-backbone"),
    store: new WebSQLStore(E.sqldb,'Tasks',false,false),
    
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
      return this.last().get('order') + 1;
    },

    // Todos are sorted by their original insertion order.
    comparator: function(model) {
      return model.get('order');
    },
    saveQueued: function(){
        Backbone.sync('updateAll',this,{});
    }
  });

  return collection;
});