define(['jquery', 'backbone','engine', 'models/BaseADODBModel'], function($, Backbone,E, BaseADOModel) {

    var Model = BaseADOModel.extend({
        sql: '',
        sqlArgs: [],
        store: new WebSQLStore(E.sqlTest2,'Tasks',false,false),
        urlRoot: '/Ideas',
        urlDetails: 'IdeaDetails',
        detailsMap:[
            'Gain','alpha','numeric','estimate','actual'
        ],   
        validate: function  (attrs) {
            var err = {};
            if(!attrs.Associate_ID)
                 err.Associate_ID = "Input error: please select a correct associate code or name";
            if(!attrs.Idea)
                 err.Idea = "Input error: An idea is needed.";
            if(!attrs.Details_Gain)
                 err.Details_Gain = "Input error: please select a correct associate code or name";
            if(!attrs.Details_Urgency)
                 err.Details_Urgency = "Input error: please select a correct associate code or name";
            if(!attrs.Details_EstimateCost)
                 err.Details_EstimateCost = "Input error: please select a correct associate code or name";
            if(!attrs.Details_ActualCost)
                 err.Details_ActualCost = "Input error: please select a correct associate code or name";     
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