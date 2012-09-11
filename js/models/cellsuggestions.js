define([
  'jquery',
  'underscore',
  'backbone',
  'engine',
  'models/cellsuggestion'
], function($, _, Backbone, E, Model){
  var collection = Backbone.Collection.extend({
// Reference to this collection's model.
    model: Model,
    //urlRoot: '/todos',
    //url: function(){ return this.urlRoot;},
    
    // set all of the todo items under the `"todos"` namespace.
    //localStorage: new Store("todos-backbone"),
    //store: new WebSQLStore(new E.ADODB({type: 'access'}),'todos',false,true),
    
    // Filter down the list of all todo items that are finished.
    done: function() {
      return this.filter(function(model){ return model.get('done'); });
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    // Todos are sorted by their original insertion order.
    comparator: function(model) {
      return model.get('date');
    }
  });

  return collection;
});