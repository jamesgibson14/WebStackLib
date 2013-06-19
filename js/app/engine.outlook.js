define([
  'jquery',
  'underscore',
  'backbone',
  'engine'
], function($, _, Backbone, E){
  var outlook = function(options){
      var settings = {}
      var inboxFolder = 6;
      var oldFolder = 5;
      var CalenderFolder = 9;
      var deletedFolder = 3;
      var outbox = 4;
      var contacts = 10;
      var journal = 11;
      var notes = 12;
      var tasks = 13,
      reminders = 14,
      reminders = 15,
      drafts = 16,
      conflicts = 17
    return {
      getTasks: function(){
          outlookApp = new ActiveXObject("Outlook.Application");
          nameSpace = outlookApp.getNameSpace("MAPI");
          nameSpace.logon("","",false,false);
          Tasks = nameSpace.getDefaultFolder(6);
          myTasks = Tasks.Items;
          count = myTasks.Count;
          result = '';
          for(x = 1; x <= count; x++) {
              result += "-"+myTasks(x)+ "\n";
              //result += "-"+myTasks(x)+ "\n";
          }
          alert('Name: ' + Tasks.Name + "\n" + 'count: ' + count + "\n" + 'taks: ' + result);
      },
      getTodoList: function(){
          //function that loops though all outlook email folders looking for emails mark as a Todo/Task
          outlookApp = new ActiveXObject("Outlook.Application");
          nameSpace = outlookApp.getNameSpace("MAPI");
          nameSpace.logon("","",false,false);
          Tasks = nameSpace.getDefaultFolder(6);
          myTasks = Tasks.Items;
          count = myTasks.Count;
          // loops need to be created that will check each email in each folder and sub-folder
         
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
            function saveAppointment( obj ){  
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
        
      },
        sendMail: function(p_subject,p_body, p_recipient){
            /*
            //Opens outlook email window
            var objO = new ActiveXObject('Outlook.Application'); 
            var objNS = objO.GetNameSpace('MAPI'); 
            var mItm = objO.CreateItem(0); 
            mItm.Display(); 
            mItm.To = p_recipient; 
            mItm.Subject = p_subject; 
            mItm.Body = p_body; 
            mItm.GetInspector.WindowState = 0; 
            */
            
            var outlookApp = new ActiveXObject("Outlook.Application");
            var nameSpace = outlookApp.getNameSpace("MAPI");
            var mailFolder = nameSpace.getDefaultFolder(6);
            var mailItem = mailFolder.Items.add('IPM.Note.FormA');
            with (mailItem) {
            Subject="CUSTOMER SERVICE";
            To = 'gibsonj'
            Attachments.Add ("c:\\temp\\barchart2-64px.ico");
            HTMLBody = "<html><body><p>some body script</p><img src='cid:'barchart2-64px.ico'><img src='cid:'barchart2-64px.ico'></body></html>";
            Display (0);
            Send();
            }
            mailItem=null;
            mailFolder=null;
            nameSpace=null;
            outlookApp=null;
            
        }
        /*
        Public Sub ListOutlookFolders() 
     
            Dim olApp As Outlook.Application 
            Dim olNamespace As Outlook.Namespace 
            Dim olFolder As Outlook.MAPIFolder 
             
            Set olApp = New Outlook.Application 
            Set olNamespace = olApp.GetNamespace("MAPI") 
             
            For Each olFolder In olNamespace.Folders 
                Debug.Print olFolder.Name; ":", olFolder.Description 
                ListFolders olFolder, 1 
            Next 
             
            Set olFolder = Nothing 
            Set olNamespace = Nothing 
            Set olApp = Nothing 
             
        End Sub 
        Sub ListFolders(MyFolder As Outlook.MAPIFolder, Level As Integer) 
             '
             '
             '
            Dim olFolder As Outlook.MAPIFolder 
             
            For Each olFolder In MyFolder.Folders 
                Debug.Print ":"; String(Level * 2, "-"); olFolder.Name 
                If olFolder.Folders.Count > 0 Then 
                    ListFolders olFolder, Level + 1 
                End If 
            Next 
        End Sub         
         */
    }
  }
    E.outlook = outlook()
    //E.outlook.setTask("check scripting",'can outlook tasks be scripted','1/21/2013','1/20/2013');
  return outlook;
});