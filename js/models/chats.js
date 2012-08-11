define([
  'jquery',
  'underscore',
  'backbone',
  'engine',
  'models/chat'
], function($, _, Backbone, E, Model){
  var collection = Backbone.Collection.extend({
// Reference to this collection's model.
    model: Model,
    url: '/ws/chat/',
    comparator: function (model) {
	return model.get('timestamp');
    }
  });

  return collection;
});												   
											
