define([
  'jquery',
  'underscore',
  'backbone',
  'engine',
  'models/model'
], function($, _, Backbone, E, Model){
  var collection = Backbone.Collection.extend({
// Reference to this collection's model.
    model: Model

            

    });

    // Returns the Model class
    return collection;

});