define([
  'jquery',
  'underscore',
  'backbone',
  'engine',
  'models/cellsuggestion'
], function($, _, Backbone, E, Model){
  var collection = Backbone.Collection.extend({

    model: Model,
    db: E.accessdb,

    done: function() {
      return this.filter(function(model){ return model.get('done'); });
    },

    remaining: function() {
      return this.without.apply(this, this.done());
    },

    comparator: function(model) {
      return model.get('date');
    }
  });

  return collection;
});