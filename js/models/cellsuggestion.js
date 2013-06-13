define(['jquery', 'backbone','engine', 'models/BaseADODBModel'], function($, Backbone,E, BaseADOModel) {

    var Model = BaseADOModel.extend({
        sql: '',
        sqlArgs: [],
        store: new WebSQLStore(E.sqlTest2,'Tasks',false,false),
        urlRoot: '/Ideas',   
        validate: function  (attrs) {
            var err = {};
            if(!attrs.Idea)
                 err.Idea = "Input error: An idea is needed.";
            if(!attrs.Associate_ID)
                 err.Associate_ID = "Input error: please select a correct associate code or name";

                 
            return ($.isEmptyObject(err)) ? false : err;   
        },
        initialize: function() {
            
        },
        onBeforeCreate: function(options){
            this.set({EnteredAt: new Date(), EnteredBy: E.user.get('Associate_ID')},{silent:true})
        }   

  });

    // Returns the Model class
    return Model;

});