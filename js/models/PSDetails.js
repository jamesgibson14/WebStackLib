define([
  'jquery',
  'underscore',
  'backbone',
  'models/PSDetail'
], function($, _, Backbone, Model){
  var collection = Backbone.Collection.extend({
// Reference to this collection's model.
    model: Model

            

    });

    // Returns the Model class
    return collection;

});