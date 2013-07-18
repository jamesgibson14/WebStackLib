define(['jquery', 'backbone', 'engine', 'views/BaseView', 'text!templates/OperatorTracking.html', 'models/operatorTracking', 'views/ProcessRecord', 'views/BasePlot','models/BasePlot', 'jqp','jqpall'], 
function($, Backbone, E, BaseView, template, Collection,ProcessRecord, BasePlot,BasePlotModel){

    var View = BaseView.extend({
        className: 'ReportApp ofh',
        qualificationList: Backbone.Collection.extend({
            sql: "SELECT id = AssociatesToQualifications.ID, label= [Name]+ '- Q' + [QualificationName], cell= ExprCell, qualification= [QualificationName] FROM dbo.Associates INNER JOIN dbo.AssociatesToQualifications ON dbo.Associates.RecordID = dbo.AssociatesToQualifications.Associate_ID INNER JOIN dbo.Qualifications q ON dbo.AssociatesToQualifications.Qualifications_ID = q.ID WHERE (ExprStatus <> N'Terminated') AND ExprStatus <> '' ORDER BY Name, QualificationName",
            store: new WebSQLStore(E.sqlProd2,'dbo.spGetDataForPeopleSoftEntry',false), }),
        modelStageTotals: Backbone.Model.extend({
            sql: "SELECT m.Code, m.Cell_ID, m.WorkCenter_ID, m.Stage5Target, m.Inactive, qa.Stage1Minutes, qa.Stage2Minutes, qa.Stage3Minutes, qa.Stage4Minutes, qa.Stage5Minutes, atq.CurrentStage,(SELECT MAX(ReviewDate) AS MaxOfReviewDate FROM dbo.MachineOperatorReviews mor WHERE (mor.QualID=atq.ID)) AS LastReviewDate FROM AssociatesToQualifications atq INNER JOIN Qualifications AS q ON atq.Qualifications_ID = q.ID INNER JOIN QualificationsToMachines ON q.ID = QualificationsToMachines.Qualifications_ID INNER JOIN Machines AS m ON QualificationsToMachines.Machines_ID = m.ID INNER JOIN QualificationsAttributes qa ON q.ID = qa.Qualifications_ID WHERE atq.ID = %s",
            sqlArgs: [430],
            store: new WebSQLStore(E.sqlProd2,'dbo.spGetDataForPeopleSoftEntry',false), }),
        collection: new Collection(),
        plotModel: {      
            atq_id: null,
            
            isTabs: true,
            title: 'Operator Tracking',
            y1: 'PcsPerHour',
            sqlPerLevel: {
                dayBranch: "SELECT crd.Machine_ID, crd.ParentRecord_ID, Date = crd.Date, crd.CurrentStage, Target = crd.NetQtyProducedPercentageTarget, StageTarget = dbo.fnGetNetProducedPercentageTarget(crd.CurrentStage,m.Stage5Target), LineCount = COUNT(*), PerformancePercent = (SUM(crd.NetQtyProduced) * 1.0) / NULLIF(SUM(crd.NetQtyProducedTarget * 1.0),0), AssignedMinutes = SUM(crd.AssignedMinutes), m.Code, crd.Multiprocess FROM CompiledReportingData crd INNER JOIN dbo.Associates INNER JOIN dbo.AssociatesToQualifications ON dbo.Associates.RecordID = dbo.AssociatesToQualifications.Associate_ID INNER JOIN dbo.Qualifications q ON dbo.AssociatesToQualifications.Qualifications_ID = q.ID INNER JOIN dbo.QualificationsToMachines ON q.ID = dbo.QualificationsToMachines.Qualifications_ID INNER JOIN Machines m ON QualificationsToMachines.Machines_ID = m.ID ON crd.Machine_ID = QualificationsToMachines.Machines_ID AND crd.Associate_ID = Associates.RecordID WHERE AssociatesToQualifications.ID = %s AND crd.Date >= '%s' AND crd.Date <= '%s' GROUP BY crd.Associate_ID, crd.Machine_ID, crd.Date, crd.CurrentStage, crd.NetQtyProducedPercentageTarget, m.Stage5Target, m.Code, crd.Multiprocess, crd.ParentRecord_ID ORDER BY crd.Date",
                monthBranch: "SELECT crd.Machine_ID, crd.ParentRecord_ID, Date= crd.Date, crd.CurrentStage, Target = crd.NetQtyProducedPercentageTarget, StageTarget = dbo.fnGetNetProducedPercentageTarget(crd.CurrentStage,m.Stage5Target), LineCount = COUNT(*), PerformancePercent = (SUM(crd.NetQtyProduced) * 1.0) / NULLIF(SUM(crd.NetQtyProducedTarget * 1.0),0), AssignedMinutes = SUM(crd.AssignedMinutes), m.Code, crd.Multiprocess FROM CompiledReportingData crd INNER JOIN dbo.Associates INNER JOIN dbo.AssociatesToQualifications ON dbo.Associates.RecordID = dbo.AssociatesToQualifications.Associate_ID INNER JOIN dbo.Qualifications q ON dbo.AssociatesToQualifications.Qualifications_ID = q.ID INNER JOIN dbo.QualificationsToMachines ON q.ID = dbo.QualificationsToMachines.Qualifications_ID INNER JOIN Machines m ON QualificationsToMachines.Machines_ID = m.ID ON crd.Machine_ID = QualificationsToMachines.Machines_ID AND crd.Associate_ID = Associates.RecordID WHERE AssociatesToQualifications.ID = %s AND crd.Date >= '%s' AND crd.Date <= '%s' GROUP BY crd.Associate_ID, crd.Machine_ID, crd.Date, crd.CurrentStage, crd.NetQtyProducedPercentageTarget, m.Stage5Target, m.Code, crd.Multiprocess, crd.ParentRecord_ID ORDER BY crd.Date",
            },
            plotFilters: {
                daterange:true
            }
        },
        associateToQualification_ID: 0,
        filteredModels: [],
        filters: false,
        plot: null,
        template: template,
        initialize: function() {
            _.bindAll(this,'loadData','renderProcessRecord');
            this.qualificationList = new this.qualificationList()
            this.modelStageTotals = new this.modelStageTotals();
            this.qualificationList.fetch();
            this.ProcessRecordView = new ProcessRecord()
            this.plotModel = new (BasePlotModel.extend({
                collection: this.collection,
                initialize: function(){
                    var dt = new Date();
                    this.on('change:atq_id change:startDate change:endDate change:level change:groupBy', this.renderPlot)
                    this.get('highlighter').tooltipContentEditor = function(str, seriesIndex, pointIndex, plot){
                        var data = plot.series[seriesIndex].data[pointIndex]
                        var format = [];
                        format[0] = new Date(data[0]).format('mm/dd/yyyy');                        
                        format[1] = new Number(data[1]).toFixed(1);
                        format[2] = data[2];
                        format[3] = data[3];
                        format[4] = data[4];
                        if(plot.legend.labels[seriesIndex].indexOf('Target') > 1){
                            str = '<table class="jqplot-highlighter"><tr><td>date:</td><td>%s</td></tr><tr><td>Percentage:</td><td>%s %</td></tr><tr><td>Stage:</td><td>%s</td></tr></table>'
                        }
                        else
                            str = '<table class="jqplot-highlighter"><tr><td>date:</td><td>%s</td></tr><tr><td>Percentage:</td><td>%s %</td></tr><tr><td>AssignedMinutes:</td><td>%s</td></tr><tr><td>Changeovers:</td><td>%s</td></tr><tr><td>Record #</td><td>%s</td></tr></table>'
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, [str].concat(format));
                        return str;
                    };
                    
                    dt = new Date(dt.setMonth(dt.getMonth()-6,1))                    
                    this.set('startDate',dt.format('mm/dd/yyyy'),{silent:true})
                },
                filterMap: ['atq_id','startDate','endDate'],
                collectionMap: function(model,labels,obj){
                    var label = model.get('Code');
                    if (labels.indexOf(label + '_Target') > -1){
                        obj[label + '_Target'].push([new Date(model.get('Date')),model.get('Target')*100,model.get('CurrentStage')]);
                        obj[label + '_Actual'].push([new Date(model.get('Date')),model.get('PerformancePercent')*100,model.get('AssignedMinutes'),model.get('LineCount'),model.get('ParentRecord_ID')]);
                    }
                    else{
                        labels.push(label + '_Target');
                        labels.push(label + '_Actual');
                        obj[label + '_Target'] = [[new Date(model.get('Date')),model.get('Target')*100,model.get('CurrentStage')]]
                        obj[label + '_Actual'] = [[new Date(model.get('Date')),model.get('PerformancePercent')*100,model.get('AssignedMinutes'),model.get('LineCount'),model.get('ParentRecord_ID')]]
                    }                           
                }                
            }))(this.plotModel);
            this.plotV = new BasePlot({model: this.plotModel});
            this.plotV.renderDataGrid = this.renderProcessRecord
            
        },
        test: function(){
           alert('caught');  
        },
        loadData: function(){   
            var cd;
            var cs = this.collection.getCurrentStage()
            if(cs != 8){
                this.modelStageTotals.sqlArgs = [this.associateToQualification_ID];
                this.modelStageTotals.fetch({error:function(model, response, options){alert()}})
                cd = this.modelStageTotals.get('LastReviewDate') ? new Date(this.modelStageTotals.get('LastReviewDate')) : 'n/a';
            }
            var cm = (this.collection.getStageMinutes(cd)/440).toFixed(2);
            var ns = this.nextStage(cs);
            if(ns==5)
                ns = 90 - cm;
            else {
                ns = this.modelStageTotals.get('Stage' + ns +  'Minutes');
                ns = ((ns / 440) - cm).toFixed(2);
            }
            this.$('#cS').html(cs)
            this.$('#cD').html(cd)
            this.$('#cM').html(cm)
            this.$('#nS').html(ns)
            

        },
        onRender: function() {
            var that = this;
            
            function removeIfInvalid(value, list) {               
                var valid = false;                    
                _.each(list, function(mod) {                      
                    if ( mod.label == value ) {                            
                        valid = true;                            
                        return false;                        
                    }                    
                });                    
                if ( !valid ) {                        
                    // remove invalid value, as it didn't match anything                        
                    $el                            
                    .val( "" )                            
                    .attr( "title", value + " didn't match any item" )                            
                    .tooltip( "open" )
                    .focus();                         
                    setTimeout(function() {                            
                        $el.tooltip( "close" ).attr( "title", "" );                        
                    }, 2500 );                                               
                    return false;                    
                }  
                return valid              
            }  

            var source = this.qualificationList.toJSON()
            
            this.$( "#iqualification" ).autocomplete({
                source: source,
                autoFocus: true,
                minLength: 0,
                delay: 0,
                select: function( event, ui ) {
                    that.$( "#iqualification" ).val( ui.item.label );
                    that.associateToQualification_ID = ui.item.id;                    
                    that.$('#atq_id').html( ui.item.id );
                    that.$('#qualName').html( ui.item.qualification );
                    that.$('#scell').html( ui.item.cell );
                    that.$('#sAssociate').html( ui.item.label.split('-')[0] );
                    if(removeIfInvalid( ui.item.label,source)) {
                        that.plotModel.set('atq_id', ui.item.id );
                        that.loadData();
                    }
                    $(this).val('').blur();
                    return false;
                }

                //add on select: set machine_ID, set cell
            })
            .tooltip({                            
                position: { 
                    my: 'bottom',                               
                    at: "right+25 top-5"                           
                },                            
                tooltipClass: "ui-state-highlight absolute z2k"                        
            });
            this.$("#iqualification").on('click',function(e){
                //$(this).val('')
                that.$( "#iqualification" ).autocomplete( "search", "" );
            })
            
            this.$('#plotarea').html( this.plotV.render().el);
            return this;
        },
        renderTable: function(){
            //Instead of destroying plot just reload data, lables and then re-plot  
        },
        renderReviews: function(){
            //Show reviews for current selected operator  
        },
        renderProcessRecord: function(ev, seriesIndex, pointIndex, data){            
            var that = this;
            var html; 
            debugger;
            if(that.plotModel.get('legend').labels[seriesIndex].indexOf('Actual')>-1) {
                var view = this.ProcessRecordView;
                view.collection.sqlArgs = [data[4]]
                view.collection.fetch({reset:true});
                //alert('series: '+seriesIndex+', point: '+pointIndex+', data: '+new Date(data[0]) + ', ' + data[1]+ ', pageX: '+ev.pageX+', pageY: '+ev.pageY);
                html = view.el
            }
            else{
                html = '<div>This is the target line.</div>'
            }
            this.$('#processRecord').html(html)
        },
        nextStage: function(cs){
            if(cs == 1)
                cs = 2;
            if(cs == 2)
                cs = 3;
            if(cs == 3)
                cs = 4;
            if(cs == 4)
                cs = 5;
            if(cs == 5)
                cs = 5;
            return cs   
        }
    });
	
    // Returns the View class
    return View;
});