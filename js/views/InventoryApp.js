define(['jquery', 'backbone', 'engine', 'handlebars', 'models/InventoryApp', 'text!templates/InventoryApp.html', 'views/SlickGrid'], 
function($, Backbone, E, Handlebars, Model, template, SlickGrid){

    var View = Backbone.View.extend({

        tagName:  "div",
        className: 'PSApp',
        model: new Model(),
        template: template,
        SlickGrid: new SlickGrid(),
        events: {
            'blur .pid':'change',
            'keypress input':'loadPID',
            'click .loadtable': 'loadPID'      
        },
        initialize: function() {
          this.template = Handlebars.compile(this.template);
            _.bindAll(this, 'render','change','loadPID');
        },
        loadPID: function(e){
            if (e.key != "Enter") return;
           
            
            var filter = $(e.target).attr('id')
            var where = ' 1=0 '
            var col = this.SlickGrid.collection
            if(filter == 'component')
                where = " Component = '" + e.target.value + "'"
            else if(filter == 'item')
                where = " i.Code = '" + e.target.value + "'"
            else if (filter == 'pid')
                where = " PIDText = '" + e.target.value + "'"
            col.sql= "SELECT DISTINCT PIDText, c.Opseq, Item = i.Code, crd.Date, r.TaskCode, r.WorkCenter_ID, crd.NetQtyProduced, crd.Scrap, crd.QtyProduced, crd.Shift, p.Status, ParentRecord_ID, i.Description FROM ProductionDemandComponents c INNER JOIN ProductionDemandGroups p ON c.PID=p.PIDText LEFT JOIN SQLPROD2.CCDB.DBO.ProductionDemandGroupsRouting r ON PIDText=r.PID LEFT JOIN SQLPROD2.CCDB.DBO.viewProductionPerformanceData crd ON PIDText= crd.PID AND r.Opseq=crd.Opseq LEFT JOIN Items i ON p.Item_ID=i.ID AND c.Opseq=r.Opseq WHERE %s AND Status > 0 AND Status < 70",
            col.sqlArgs = [where]
            $(e.target).siblings().val('')
            col.fetch({reset:true,add_id: true});
            e.preventDefault();
        },
        render: function() {
            var temp = this.model.toJSON();            
            temp = this.template(temp);            
            this.$el.html( temp );
            
            var that = this;
            var pid = this.$('#iPID').val();
            var options = {
                store: this.model.store,
                customColumns: {
                    'PIDText': {width:115},
                    'Scrap': {groupTotalsFormatter: this.SlickGrid.sumTotalsFormatter},
                    'NetQtyProduced': {groupTotalsFormatter: this.SlickGrid.sumTotalsFormatter},
                    'Date': {width: 110,formatter: this.SlickGrid.dateFormatter},
                    'QtyProduced': {groupTotalsFormatter: this.SlickGrid.sumTotalsFormatter}                   
                }
            };
            this.SlickGrid.grouping = this.model.groupByPIDOpseqDate
            html = this.SlickGrid.render(options).el
            this.$('#slickGrid').html(html)
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