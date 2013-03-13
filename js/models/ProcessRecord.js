define(['jquery', 'backbone','engine'], function($, Backbone,E) {

    var collection = Backbone.Collection.extend({
        model: Backbone.Model,
            
        sql: "SELECT pd.ParentRecordID, pd.Date, pd.Machine, pd.Shift, AssociateCode = pd.[Employee #], pd.MultiMachine, pd.CreatedOn, pd.CreatedBy, pd.Flagged, pd.chkCompleted, pd.chkConverted, pd.chkEdited, pd.txtFlagReason, pd.intFlagCode, pd.Machine_ID, pd.OperatorStage, pd.Stage5Target, pdd.RecordID, pdd.LineNum, pdd.Task, pdd.CrewSize, pdd.CStart, CounterEnd = pdd.[End], Scrap = pdd.Reject, AssignedMinutes = pdd.[Assigned Minutes], MeterStart = pdd.[Meter Start], MeterStop = pdd.[Meter Stop], pdd.ReAssgnMinTotal, pdd.ClockSetup, pdd.ClockRun, pdd.ClockEnd, pdd.TotalPacked, pdd.chkBreak1, pdd.chkBreak2, pdd.chkLunch, pdd.PID, pdd.OpSeq, pdd.PSoft, pdd.Setup, pdd.UserStamp, pdd.UserStampDate, pdd.lngLinkRecord, pdd.chkAsstd, pdd.txtAsstdColor, pdd.lngMachine2Start, pdd.lngMachine2End, pdd.txtProduct, pdd.lngCalculatedSetup, pdd.Item_ID, pdd.LastItem_ID, pdd.Paper_ID, pdd.LastPaper_ID, pdd.EachesPerDrop, pdd.UnitOfMeasure, pdd.CompiledReportingData_ID, pdd.ProductionDemandGroup_ID, pdd.SetupMinutes FROM ProductionData AS pd INNER JOIN    ProductionDataDetails AS pdd ON pd.ParentRecordID = pdd.ParentRecordID WHERE pd.ParentRecordID = %s",
        sqlArgs: [41111],
        store: new WebSQLStore(E.sqldb,'dbo.spGetDataForPeopleSoftEntry',false)
    });

    return collection;

});