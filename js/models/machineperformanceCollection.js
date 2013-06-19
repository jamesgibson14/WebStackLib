define([
  'jquery',
  'underscore',
  'backbone',
  'engine'
], function($, _, Backbone, E){
  var collection = Backbone.Collection.extend({

    sql: 'Execute dbo.spKioskPerformanceData',
    store: new WebSQLStore(E.sqlProd2,'dbo.spKioskPerformanceData',false)
  });

  return collection;
});