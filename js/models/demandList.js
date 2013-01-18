define([
  'jquery',
  'underscore',
  'backbone',
  'engine',
  'models/cellsuggestion'
], function($, _, Backbone, E, Model){
  var collection = Backbone.Collection.extend({
// Reference to this collection's model.
    model: Backbone.Model,
    //urlRoot: '/todos',
    //url: function(){ return this.urlRoot;},
    sqlArgs: null,
    // set all of the todo items under the `"todos"` namespace.
    //localStorage: new Store("todos-backbone"),
    //store: new WebSQLStore(new E.ADODB({type: 'access'}),'todos',false,true),
    sql: "Execute dbo.spDemandPriority @startdate ='%s',  @enddate ='%s'",
    store: new WebSQLStore(E.sqldb,'dbo.spGetDataForPeopleSoftEntry',false),
    // Filter down the list of all todo items that are finished.
    done: function() {
      return this.filter(function(model){ return model.get('done'); });
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    },
    toDataView: function(headers){
        return this.map(function(model){
            var obj = {};
            var pidt = model.get('pidTotals')
            obj.id = model.id;
            for (var i = 0; i < headers.length; i++) {
               obj[headers[i]] = model.get(headers[i]); 
            }
            obj.pidCount = (pidt.count) ? pidt.count : 0;
            obj.pidExpectedQty = pidt.exptQty;
            obj.pidCompletedQty = pidt.compQty;
            obj.differenceQty = pidt.diffQty;
            obj.oversold = ((parseInt(obj.available) + parseInt(obj.differenceQty))-parseInt(obj.eaches))
            return obj;           
        })
    }
  });

  return collection;
});