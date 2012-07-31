define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var Model = Backbone.Model.extend({

            defaults: {
                pid: 'PID1517002',
                opseq: 10,
                machine: 5147,
                shift: 'F',
                scrap: 2,
                endscrap: 7,
                qtycompleted: 2001,
                setuptime: .33,
                runtime: 1.1,
                downtime: .25,
                operator: 0 + "2165",
                date: '7/17/2012',
                componentcode: "0208861",
                flag: false,
                flagreason:''
            },
            initialize: function(){
                //console.log('this model has been initialized');
                this.on("change", function(){
                    //alert('module changed');
                });
            },
            toggleflag: function() {
                var temp = !this.get("flag"),
                reason = this.get("flagreason");
                if(temp) reason += prompt("What is the reason for flaggin this PID-Opseq");
                this.set({flag: temp, flagreason: reason});
            }
    });

    // Returns the Model class
    return Model;

});