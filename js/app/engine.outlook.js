define([
  'jquery',
  'underscore',
  'backbone',
  'engine'
], function($, _, Backbone, E){
  var outlook = function(options){
      var settings = {}
      
      return {
      getTasks: function(){
          outlookApp = new ActiveXObject("Outlook.Application");
          nameSpace = outlookApp.getNameSpace("MAPI");
          nameSpace.logon("","",false,false);
          Tasks = nameSpace.getDefaultFolder(13);
          myTasks = Tasks.Items;
          count = myTasks.Count;
          result = '';
          for(x = 1; x <= count; x++) {
              result += "-"+myTasks(x)+ "\n";
          }
      },
        setTask: function(sSubject, sBody, dtDueDate, dtReminderDate){
            var outlookApp = new ActiveXObject("Outlook.Application");
            var nameSpace = outlookApp.getNameSpace("MAPI");
            var mailFolder = nameSpace.getDefaultFolder(9); //olFolderTask

            var task = mailFolder.Items.add('IPM.Task');
            task .Subject = sSubject
            task .DueDate = dtDueDate
            task .Status = 1                 //0=not started, 1=in progress, 2=complete, 3=waiting,
                                        //4=deferred
            task.Importance = 1             //0=low, 1=normal, 2=high
            task.ReminderSet = true
            task.ReminderTime = dtReminderDate
            task.Categories = "Business" //use any of the predefined Categorys or create your own
            task.Body = sBody
            task.Display()  //.Save or use .Display if you wish the user to see the task form and make
                        //them perform the save
      },
      getAppointment: function(){
          
      },
      setAppointment: function(){
            /*  Script:   appt.js * Purpose:  Add Appointment to Outlook Calendar * 
             *  Author:   Brian White 
             *  Email:   brian@dynoapps.com 
             *  Date:     April 25, 2000 
             *  Comments: This is a very basic example of creating 
             *            an appointment item in Outlook.   
             *  Notes:    To date, little testing has been done 
             *            with other versions of Outlook and multiple 
             *            profiles. 
             *            Special thanks to Daren Thiel @ 
             *                              www.winscripter.com *
             */
            
            /* Define Outlook constant for Appointment Item */
            var olAppointmentItem = 1;
            /* To add other Properties, refer to the Outlook Object Model */
            function appt( Subject, Location, Start, ReminderMinutesBeforeStart ){  
                this.Subject = Subject;  
                this.Location  = Location;  
                this.Start  = Start;  
                this.ReminderMinutesBeforeStart = ReminderMinutesBeforeStart;
            }
            function saveAppt( obj ){  
                /* Create the Outlook Object and Appointment Item */  
                out = new ActiveXObject( "Outlook.Application" );   
                /* Create an Appointment Item */  
                appt = out.CreateItem( olAppointmentItem );
                /* Transfer the data */  
                appt.Subject = obj.Subject;  
                appt.Location  = obj.Location;  
                appt.Start = obj.Start;  
                appt.ReminderMinutesBeforeStart = obj.ReminderMinutesBeforeStart;   
                /* Display the data */  
                appt.Display();  
                /* If you want to save instead of viewing it change to appt.Save();*/
           }
            /* Set our values to be inserted into the Appointment */
           newAppt = new appt("test subject", "this location", "05/26/2000 9:00 AM", "15");
            /* Call our own function to save data */
           saveAppt( newAppt );
            /* Tell User to review the information */
           //alert("Please Review the following Appointment Information");
        
      }
      }
  }
    E.outlook = outlook()
    //E.outlook.setTask("check scripting",'can outlook tasks be scripted','1/21/2013','1/20/2013');
  return outlook;
});