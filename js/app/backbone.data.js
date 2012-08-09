/**
 * @author gibsonj
 */
//Way to easily filter collections
Backbone.collection.filters = {};

Backbone.collection.boolFilter = function(model, attr, value){
    return (model.get(attr) == value);
}

Backbone.collection.txtFilter = function(model, attr, value){
    return (model.get(attr) == value);
}