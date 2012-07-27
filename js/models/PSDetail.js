define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({

            defaults: {
                pid: 'blah',
                opseq: 10,
                machine: 698,
                shift: 'F',
                scrap: 156,
                endscrap: 7,
                qtycompleted: 21520,
                setuptime: .33,
                runtime: 1.1,
                downtime: .25,
                operator: 0 + "2165",
                date: '6/26/2012',
                componentcode: "0089123"
            },
            initialize: function(){
                //console.log('this model has been initialized');
                this.on("change", function(){
                    alert('module changed');
                });
            }
    });

    // Returns the Model class
    return Model;

});