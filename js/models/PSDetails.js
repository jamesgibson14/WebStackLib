define([
  'jquery',
  'underscore',
  'backbone',
  'models/PSDetail'
], function($, _, Backbone, Model){
  var collection = Backbone.Collection.extend({
// Reference to this collection's model.
    model: Model,
    store: new WebSQLStore(new E.MSSQLDB(),'qryShopPaperDetail',false)
            

    });

    // Returns the Model class
    return collection;

});