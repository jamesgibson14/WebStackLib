define([
  'jquery',
  'underscore',
  'backbone',
  'engine'
], function($, _, Backbone, E){
  var collection = Backbone.Collection.extend({

    sql: 'Execute dbo.spKioskPerformanceData',
    store: new WebSQLStore(new E.ADODB(),'dbo.spKioskPerformanceData',false)
  });

  return collection;
});