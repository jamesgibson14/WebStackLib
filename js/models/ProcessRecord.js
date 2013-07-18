define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var collection = Backbone.Collection.extend({
        model: Backbone.Model,
            
        sql: "SELECT pd.ParentRecordID, pd.Date, pd.Machine, pd.Shift, AssociateCode = pd.[Employee #], pd.MultiMachine, pd.CreatedOn, pd.CreatedBy, pd.Flagged, pd.chkCompleted, pd.chkConverted, pd.chkEdited, pd.txtFlagReason, pd.intFlagCode, pd.Machine_ID, pd.OperatorStage, pd.Stage5Target, pdd.RecordID, pdd.LineNum, pdd.Task, pdd.CrewSize, pdd.CStart, CounterEnd = pdd.[End], Scrap = pdd.Reject, AssignedMinutes = pdd.[Assigned Minutes], MeterStart = pdd.[Meter Start], MeterStop = pdd.[Meter Stop], pdd.ReAssgnMinTotal, pdd.ClockSetup, pdd.ClockRun, pdd.ClockEnd, pdd.TotalPacked, pdd.chkBreak1, pdd.chkBreak2, pdd.chkLunch, pdd.PID, pdd.OpSeq, pdd.PSoft, pdd.Setup, pdd.UserStamp, pdd.UserStampDate, pdd.lngLinkRecord, pdd.chkAsstd, pdd.txtAsstdColor, pdd.lngMachine2Start, pdd.lngMachine2End, pdd.txtProduct, pdd.SetupMinutesTarget, pdd.Item_ID, pdd.LastItem_ID, pdd.Paper_ID, pdd.LastPaper_ID, pdd.EachesPerDrop, pdd.UnitOfMeasure, pdd.CompiledReportingData_ID, pdd.ProductionDemandGroup_ID, pdd.SetupMinutes, crd.NetQtyProduced, crd.NetQtyProducedTarget, crd.NetQtyProducedPercentage, crd.NetQtyProducedPercentageTarget, crd.WorkCenter_ID, crd.ItemCode, crd.Cell_ID, crd.ScrapTarget,crd.ScrapPercentage, crd.ScrapPercentageTarget, crd.OperatorSetupMinutes, crd.OperatorSetupMinutesTarget, crd.MachineRunTimeMinutes, crd.MachineRunTimeMinutesTarget, crd.MachineRunTimePercentage, crd.MachineRunTimePercentageTarget, crd.MachineSpeed, crd.MachineSpeedTarget FROM ProductionData AS pd INNER JOIN ProductionDataDetails AS pdd ON pd.ParentRecordID = pdd.ParentRecordID LEFT JOIN dbo.viewProductionPerformanceData crd ON pdd.RecordID=crd.DetailRecord_ID AND crd.Multiprocess = 0 WHERE pd.ParentRecordID = %s",
        sqlArgs: [41111],
        store: new WebSQLStore(E.sqlProd2,'dbo.spGetDataForPeopleSoftEntry',false),
        dataRender: function(){
            var that = this;
            return this.map(function(model){
                var line = model.toJSON()
                var s = that.parseTime(line.ClockSetup);
                var r = that.parseTime(line.ClockRun);
                var e = that.parseTime(line.ClockEnd);
                var date1 = new Date(2000, 0, 1,  s.hh, s.mm); 
                var date2 = new Date(2000, 0, 1, r.hh, r.mm); 
                var date3 = new Date(2000, 0, 1, e.hh, e.mm); 
                if (date2 < date1) {
                    date2.setDate(date2.getDate() + 1);
                }
                if (date3 < date1 || date3 < date2) {
                    date3.setDate(date3.getDate() + 1);
                }
                line.breakMinutes = 0;
                if (line.chkBreak1)
                    line.breakMinutes += 10 
                if (line.chkBreak2)
                    line.breakMinutes += 10
                if (line.chkBreakLunch)
                    line.breakMinutes += 30
                line.RuntimeTarget = Math.round(((line.NetQtyProduced + line.ScrapTarget) / line.MachineSpeedTarget))
                line.AssignedMinutesTarget = Math.round(line.RuntimeTarget + line.OperatorSetupMinutesTarget)
                line.AssignedMinutesPercentage = Math.round((line.AssignedMinutesTarget*100) / line.AssignedMinutes)
                line.ScrapPercentage = (Math.round(line.ScrapPercentage*10000)/100).toFixed(1)              
                line.ScrapPercentageTarget = (Math.round(line.ScrapPercentageTarget*10000)/100).toFixed(1) 
                line.MachineRunTimePercentage = (Math.round(line.MachineRunTimePercentage*10000)/100).toFixed(1)              
                line.MachineRunTimePercentageTarget = Math.round(line.MachineRunTimePercentageTarget*1000)/100
                line.NetQtyProducedPercentage = (Math.round(line.NetQtyProducedPercentage*10000)/100).toFixed(1)              
                line.NetQtyProducedPercentageTarget = (Math.round(line.NetQtyProducedPercentageTarget*10000)/100).toFixed(1) 
                line.StagePercent = (Math.round(line.NetQtyProducedPercentageTarget/line.NetQtyProducedPercentage*10000)/100)
                line.runClock = (date3 - date2)/1000/60;
                line.Runtime = ((line.MeterStop - line.MeterStart)*60).toFixed(0);                
                line.RuntimePercentage = Math.round((line.Runtime*100) / line.RuntimeTarget);                
                line.SetupMinutes = (date2 - date1)/1000/60;
                line.AssignedClock = ((date3 - date1)/1000/60)-line.breakMinutes;
                line.downTime = (line.AssignedMinutes-line.runMeter-line.SetupMinutes);
                line.machineCount = (line.CounterEnd-line.CStart);
                line.MachineSpeed = Math.round(line.MachineSpeed);
                return line; 
            })
        },
        parseTime: function(s) {
            var part = s.match(/(\d+):(\d+)(?: )?(am|pm)?/i);
            var hh = parseInt(part[1], 10);
            var mm = parseInt(part[2], 10);
            var ap = part[3] ? part[3].toUpperCase() : null;
            if (ap === "AM") {
                if (hh == 12) {
                    hh = 0;
                }
            }
            if (ap === "PM") {
                if (hh != 12) {
                    hh += 12;
                }
            }
            return { hh: hh, mm: mm };
        }

    });

    return collection;

});