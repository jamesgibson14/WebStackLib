SELECT
	recordtype = 'n',
	recordID = ProductionData.ParentRecordID,
	runcount,  
	dt2.pid,
	ProductionDemandGroups.status,
	dt2.opseq, 
	ProductionData.machine, 
	qtycompleted,
	ADCcompleted = pdgr.Completed,
	PScompleted = PeopleSoftData.CompletedQty,
	expectedqty = ProductionQty, 
	operator = right('00000' + dbo.Associates.[Employee Number],5),
	date = CONVERT(varchar, dbo.ProductionData.Date,101),
	shift = dbo.ProductionData.Shift, 
	eachescompleted, 
	scrap = CASE WHEN dt2.scrap < 0 THEN 0 ELSE dt2.scrap END,
	processscrap = pdgr.Scrap,
	psscrap =PeopleSoftData.ScrapQty,
	endscrap = ISNULL(endscrap,0),
	enterendscrap = '', --CASE WHEN endscrap > 100 THEN 'true' ELSE '' END, 
	runtime, 
	downtime = CASE WHEN downtime < 0 THEN 0 ELSE ROUND(downtime,2) END, 
	setuptime, 
	componentcode, 
	counter, 	
	flag =ProductionData.Flagged,
	flagreason = ProductionData.txtFlagReason+ CASE WHEN runtime<=0 THEN ', No Runtime' ELSE '' END,
	AssignedMinutes, 
	dt2.Item_ID, EachesPerDrop, UnitOfMeasure, Machine_ID,
	PaperScrap, 
	feedup = round(Feedup,7),PaperConverting,assortment,
	cell = Cell_ID,ItemCode
	--Paper_ID	


FROM 
	(SELECT     
		parentrecordID = MAX(parentrecordID),
		componentcode = CASE  
			WHEN PaperConverting = 1 THEN '[' + Stuff(
				(SELECT ', {"cc": "' + Components.Code +'", "es": ' + (
					CAST(IOM.PaperScrap*1.0 *
						CEILING(((((SUM([end]-[CStart]) * IOM.EachesPerDrop*1.0) --Eaches
						/ ISNULL(dt1.UnitOfMeasure,1)) --convert to Package qty				
						* dt1.Feedup) / --Feet of paper used
						(CASE WHEN Machines.WorkCenter_ID=52202 THEN 8000 ELSE 22000 END) --22000 is a guess of the avg feet of paper on a roll for each roll change.
						)--run Ceiling on number of rolls to always give an integer
						)
					AS varchar)
				) + ', "sc": ' + cast(CASE WHEN dt1.assortment=1 THEN dt1.Feedup * (SUM(dt2.Reject) / dt1.UnitOfMeasure)  ELSE 0 END AS varchar) + ', "pc": "' + PaperColor + '"}'  
              FROM   
				dbo.ProductionData dt3 INNER JOIN
				dbo.ProductionDataDetails dt2 ON dt3.ParentRecordID = dt2.ParentRecordID INNER JOIN
				dbo.Machines ON dt3.Machine_ID = dbo.Machines.ID INNER JOIN
				dbo.ItemsOnMachineCount IOM ON dt3.Machine_ID = IOM.Machine_ID AND 
				dt2.Item_ID = IOM.Item_ID  LEFT JOIN
				dbo.Components ON dt2.Paper_ID = dbo.Components.ID 
              WHERE 
				dt1.pid = dt2.PID  
                AND dt1.OpSeq = dt2.OpSeq
			  GROUP BY 
				Components.Code, IOM.PaperScrap, IOM.EachesPerDrop, Machines.WorkCenter_ID,PaperColor
              FOR XML PATH('')), 1, 2, '') + ']' 
			ELSE
				NULL
			END,
		runcount = COUNT(runcount),  
		pid, opseq,
		qtycompleted = SUM(qtycompleted), 
		eachescompleted = SUM(eachescompleted), 
		scrap = SUM(scrap),
		endscrap = ROUND(SUM(endscrap),3), 
		runtime = ROUND(SUM(runtime)/60.0,2), 
		downtime = ROUND(SUM(downtime)/60.0,2), 
		setuptime = ROUND(SUM(setuptime)/60.0,2),  
		counter = SUM(counter), 
		AssignedMinutes = SUM(AssignedMinutes), 
		Item_ID, EachesPerDrop, UnitOfMeasure, PaperScrap,
		assortment,
		Feedup,PaperConverting,Cell_ID,ItemCode
		--Paper_ID

	FROM (
			SELECT   
			parentrecordID = dbo.ProductionData.ParentRecordID,
			runcount = dbo.ProductionDataDetails.RecordID,  	
			pid = dbo.ProductionDataDetails.PID,
			opseq = dbo.ProductionDataDetails.OpSeq,
			machine = dbo.ProductionData.Machine,
			qtycompleted = dbo.ProductionDataDetails.TotalPacked,
			eachescompleted = dbo.ProductionDataDetails.TotalPacked * ISNULL(dbo.Items.PeopleSoftUOM,1),
			scrap = dbo.ProductionDataDetails.Reject/ISNULL(dbo.Items.PeopleSoftUOM,1),
			
			endscrap = (
				(ItemsOnMachineCount.PaperScrap*
					CEILING((((([end]-[CStart]) * dbo.ItemsOnMachineCount.EachesPerDrop) --Eaches
					/ ISNULL(dbo.Items.PeopleSoftUOM,1)) --convert to Package qty				
					* Items.[Feedup]) / --Feet of paper used
					(CASE WHEN Machines.WorkCenter_ID=52202 THEN 4500 ELSE 10000 END) --10000 is a guess of the avg feet of paper on a roll for each roll change.
					)--run Ceiling on number of rolls to always give an integer
				)
			),
			runtime = dbo.fnMachineRunTimeMinutes([Meter Stop],[Meter Start]),
			downtime = (
				dbo.fnAssignedMinutes(
					ClockSetup, 
					ClockEnd, 
					ReAssgnMinTotal,
					chkBreak1,
					chkBreak2,
					chkLunch,
					0
				)-dbo.fnMachineRunTimeMinutes([Meter Stop],[Meter Start])
				-(
				dbo.fnAssignedMinutes(
					ClockSetup, 
					ClockRun, 
					ReAssgnMinTotal,
					chkBreak1,
					chkBreak2,
					chkLunch,
					1
				)
			)
			),
			setuptime = (
				dbo.fnAssignedMinutes(
					ClockSetup, 
					ClockRun, 
					ReAssgnMinTotal,
					chkBreak1,
					chkBreak2,
					chkLunch,
					1
				)
			),
			componentcode = Components.Code,
			counter = ([end]-[CStart]),
			AssignedMinutes = (
				dbo.fnAssignedMinutes(
					ClockSetup, 
					ClockEnd, 
					ReAssgnMinTotal,
					chkBreak1,
					chkBreak2,
					chkLunch,
					0
				)
			),  
			dbo.ProductionDataDetails.Item_ID,
			EachesPerDrop = dbo.ItemsOnMachineCount.EachesPerDrop,
			UnitOfMeasure = dbo.Items.PeopleSoftUOM,
			ItemsOnMachineCount.PaperScrap,
			assortment = chkAsstd,
			Items.[Feedup],
			Paper_ID,PSoft,
			Machine_ID = Machines.ID,PaperConverting,Cell_ID,
			ItemCode = Items.Code
		FROM
			dbo.ProductionData INNER JOIN
			dbo.ProductionDataDetails ON dbo.ProductionData.ParentRecordID = dbo.ProductionDataDetails.ParentRecordID INNER JOIN
			dbo.Machines ON dbo.ProductionData.Machine_ID = dbo.Machines.ID INNER JOIN
			dbo.ItemsOnMachineCount ON dbo.ProductionData.Machine_ID = dbo.ItemsOnMachineCount.Machine_ID AND 
			dbo.ProductionDataDetails.Item_ID = dbo.ItemsOnMachineCount.Item_ID LEFT JOIN
			dbo.Components ON dbo.ProductionDataDetails.Paper_ID = dbo.Components.ID LEFT OUTER JOIN
			dbo.Items ON dbo.ProductionDataDetails.Item_ID = dbo.Items.ID
		WHERE     
			dbo.ProductionDataDetails.LineNum <> 0 
			AND	ProductionDataDetails.PID is not null
			AND	ProductionDataDetails.PID <>'DCP' 
			And ProductionDataDetails.PID <> 'extra'  
			AND ProductionData.Machine <> '52102'
			--AND	ProductionDataDetails.PID IN ('PID1609340', 'PID1612236')
			AND ProductionData.chkCompleted = 1 
			AND ProductionData.Date > '8/1/2012'
		) AS dt1
	GROUP BY pid, opseq, Item_ID, EachesPerDrop, UnitOfMeasure,PaperScrap, Feedup,assortment,PaperConverting,Cell_ID,ItemCode
	HAVING MIN(CAST(PSoft as INT))=0
	) as dt2	
INNER JOIN dbo.ProductionData
			 ON dt2.parentrecordID = dbo.ProductionData.ParentRecordID INNER JOIN
	dbo.Associates on dbo.Associates.RecordID=dbo.ProductionData.[Employee #] INNER JOIN
	dbo.ProductionDemandGroups ON ProductionDemandGroups.PIDText=dt2.pid LEFT JOIN
	dbo.ProductionDemandGroupsRouting pdgr ON dt2.pid = pdgr.PID AND dt2.opseq =  pdgr.opseq LEFT JOIN
	dbo.PeopleSoftData ON PeopleSoftData.PID=dt2.pid AND PeopleSoftData.OpSeq=dt2.opseq

UNION

SELECT
	recordtype = 'm',
	recordID = ProductionDataMultiprocess.ParentRecID,
	runcount,  
	dt2.pid,
	ProductionDemandGroups.Status, 
	dt2.opseq, 
	machine = CASE WHEN ProductionDataMultiProcess.txtWorkCenter='52004' THEN '4270' 
				WHEN ProductionDataMultiProcess.txtWorkCenter='52203b' THEN '2105'
				WHEN ProductionDataMultiProcess.txtWorkCenter='52203k' THEN '3757'
				ELSE 'ERROR' END, 
	qtycompleted = qtycompleted,
	ADCcompleted = pdgr.Completed,
	PScompleted = ps.CompletedQty,
	expectedqty = ProductionQty, 
	operator = CASE WHEN ProductionDataMultiProcess.txtWorkCenter='52004' THEN '' ELSE right('00000' + dbo.Associates.[Employee Number],5) END,
	date =  CONVERT(varchar, dbo.ProductionDataMultiprocess.dtDate,101),
	shift = dbo.ProductionDataMultiprocess.txtShift, 
	eachescompleted, 
	scrap = CASE WHEN dt2.scrap <> '52004' THEN 0 
				ELSE dt2.scrap END,
	processscrap = pdgr.Scrap,
	psscrap =ps.ScrapQty, 
	endscrap =0,
	enterendscrap = '',
	runtime, 
	downtime = CASE WHEN downtime < 0 THEN 0 ELSE downtime END, 
	setuptime, 
	componentcode = ' ', 
	counter,  
	flag = ProductionDataMultiprocess.chk999,
	flagreason = ProductionDataMultiprocess.txtFlagReason + CASE WHEN runtime<=0 THEN ', No Runtime' ELSE '' END,
	AssignedMinutes, 
	dt2.Item_ID, EachesPerDrop, UnitOfMeasure, Machine_ID,PaperScrap, 
	feedup = round(Feedup,7),
	PaperConverting = 0,assortment=0,
	cell = Cell_ID,ItemCode
	--Paper_ID	

FROM 
	(SELECT     
		parentrecordID = MAX(parentrecordID),
		parentrecordIDs = '[' + Stuff((SELECT ', ' + convert(varchar, ParentRecID) +''  
              FROM   dbo.ProductionDataMultiprocessDetails dt2  
              WHERE 
				dt1.pid = dt2.txtPID  
                AND dt1.OpSeq = dt2.intOpSeq
              FOR XML PATH('')), 1, 2, '') + ']',
		runcount = COUNT(runcount),  
		pid, opseq,
		qtycompleted = SUM(qtycompleted), 
		eachescompleted = SUM(eachescompleted), 
		scrap = SUM(scrap),  
		runtime = ROUND(SUM(runtime)/60.0,2), 
		downtime = ROUND(SUM(downtime)/60.0,2), 
		setuptime = ROUND(SUM(setuptime)/60.0,2), 
		counter = SUM(counter), 
		AssignedMinutes = SUM(AssignedMinutes),
		Item_ID, EachesPerDrop, UnitOfMeasure, PaperScrap,Feedup,Paper_ID,Cell_ID,ItemCode

	FROM (
			SELECT   
			parentrecordID = dbo.ProductionDataMultiprocess.ParentRecID,
			runcount = dbo.ProductionDataMultiprocessDetails.RecordID,  	
			pid = dbo.ProductionDataMultiprocessDetails.txtPID,
			opseq = dbo.ProductionDataMultiprocessDetails.intOpSeq,
			machine = Machines.Code,
			qtycompleted = dbo.ProductionDataMultiprocessDetails.lngTotalPacked,
			eachescompleted = dbo.ProductionDataMultiprocessDetails.lngTotalPacked * ISNULL(dbo.Items.PeopleSoftUOM,1),
			scrap = dbo.ProductionDataMultiprocessDetails.intScrap/ISNULL(dbo.Items.PeopleSoftUOM,1),
			runtime = dbo.ProductionDataMultiprocessDetails.intRunTime,
			downtime = (intAssignedTime - lngActualSetup - intRunTime),
			setuptime =  dbo.ProductionDataMultiprocessDetails.lngActualSetup,
			counter = (lngTotalPacked / ItemsOnMachineCount.EachesPerDrop),
			AssignedMinutes = intAssignedTime,  
			dbo.ProductionDataMultiprocessDetails.Item_ID,
			EachesPerDrop = dbo.ItemsOnMachineCount.EachesPerDrop,
			UnitOfMeasure = dbo.Items.PeopleSoftUOM,
			ItemsOnMachineCount.PaperScrap,
			Items.[Feedup],
			0 as Paper_ID,
			--SELECT	RecordID,	
			chkPSoft,
			chkConverted,chkCompleted,Cell_ID,ItemCode = Items.Code
		FROM
			dbo.ProductionDataMultiprocess INNER JOIN
			dbo.ProductionDataMultiprocessDetails ON dbo.ProductionDataMultiprocess.ParentRecID = dbo.ProductionDataMultiprocessDetails.ParentRecID INNER JOIN
			dbo.Machines ON dbo.ProductionDataMultiprocess.Machine_ID = dbo.Machines.ID LEFT JOIN
			dbo.ItemsOnMachineCount ON dbo.ProductionDataMultiprocess.Machine_ID = dbo.ItemsOnMachineCount.Machine_ID AND 
			dbo.ProductionDataMultiprocessDetails.Item_ID = dbo.ItemsOnMachineCount.Item_ID LEFT OUTER JOIN
			dbo.Items ON dbo.ProductionDataMultiprocessDetails.Item_ID = dbo.Items.ID
		WHERE     
			ProductionDataMultiprocessDetails.txtPID is not null 
			--AND ProductionDataMultiprocessDetails.txtPID in ('PID1559095')
			AND ProductionDataMultiprocess.chkCompleted = 1
			AND ProductionDataMultiprocess.dtDate > '8/1/2012'
		) AS dt1
	GROUP BY pid, opseq, Item_ID, EachesPerDrop, UnitOfMeasure,PaperScrap, Feedup,Paper_ID,Cell_ID,ItemCode
	HAVING MIN(CAST(chkPSoft as INT))=0 AND MIN(CAST(chkConverted as INT))=1 AND MIN(CAST(chkCompleted as INT))=1
	) as dt2
INNER JOIN dbo.ProductionDataMultiProcess
			 ON dt2.parentrecordID = dbo.ProductionDataMultiProcess.ParentRecID INNER JOIN
	dbo.Associates on dbo.Associates.RecordID=dbo.ProductionDataMultiProcess.txtAssociate INNER JOIN
	dbo.ProductionDemandGroups ON ProductionDemandGroups.PIDText=dt2.pid Left JOIN
	dbo.ProductionDemandGroupsRouting pdgr ON dt2.pid = pdgr.PID AND dt2.opseq =  pdgr.opseq LEFT JOIN
	dbo.PeopleSoftData ps ON ProductionDemandGroups.PIDText=ps.PID AND dt2.opseq = ps.opseq
