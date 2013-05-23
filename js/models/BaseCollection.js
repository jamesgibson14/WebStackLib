define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
    var collection = Backbone.Collection.extend({
        
    renderAsList: function(options){
        options && options = {};
        var getLabel = function(model){
            return model.get('label');
        }  
        return _this.map(function(model){
            {id: model.id, label: getLabel(model)}
        })
    }
    })
    // Returns the Model class
    return collection;
});