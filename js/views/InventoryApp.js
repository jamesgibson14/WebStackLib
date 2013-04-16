define(['jquery', 'backbone', 'engine', 'handlebars', 'models/InventoryApp', 'text!templates/InventoryApp.html', 'views/SlickGrid'], 
function($, Backbone, E, Handlebars, Model, template, SlickGrid){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'PSApp',
        model: new Model(),
        template: template,
        events: {
            'blur .pid':'change',
            'change #iPID':'loadPID',
            'click .loadtable': 'loadPID'       
        },
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','change');
            this.SlickGrid = new SlickGrid();
        },
        loadPID: function(){
            var that = this;
            var pid = this.$('#iPID').val();
            var options = {
                sql: "SELECT PIDText, p.Status, i.Code, i.Description, r.TaskCode,r.WorkCenter_ID, r.Scrap, crd.NetQtyProduced, crd.Scrap FROM ProductionDemandGroups p LEFT JOIN ProductionDemandGroupsRouting r ON PIDText=r.PID LEFT JOIN CompiledReportingData crd ON PIDText= crd.PID LEFT JOIN Items i ON p.Item_ID=i.ID WHERE PIDText = 'PID1609348' ORDER By crd.OpSeq, crd.Date, crd.Shift",
                store: this.model.store
            };
            this.SlickGrid.grouping = this.model.groupByPIDOpseqDate
            html = this.SlickGrid.render(options).el
            this.$('#slickGrid').html(html)
            setTimeout(function(){                
                that.SlickGrid.postRender();
            },1)
        },
        render: function() {
            var temp = this.model.toJSON();            
            temp = this.template(temp);            
            this.$el.html( temp );
            return this;
        },
        change: function(){            
            var newvalue = this.$el.find('.pid').val();
            this.model.set({pid: newvalue})
        }
    });
	
    // Returns the View class
    return View;
});