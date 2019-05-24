/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/ui/serverWidget'],
/**
 * @param {record} record
 * @param {serverWidget} serverWidget
 */
function(record, serverWidget) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	
    	var request = context.request;
    	var response = context.response;
            	
      
		  var appId = request.parameters.appId;
    	  var form = serverWidget.createForm({
    		  title: "Reschedule Appointment",
			  hideNavBar: true
    	  });
		  		 		  
		  log.debug("APPoint ID", appId);
        
         form.clientScriptFileId = 30223582;
      
		 var reschAppField = form.addField({
    		  id:'custpage_app',
    		  type:serverWidget.FieldType.TEXT,
    		  label: 'Resch App'
    	  });
		 reschAppField.defaultValue = appId;
		 
         var reschDateField = form.addField({
    		  id:'custpage_date',
    		  type:serverWidget.FieldType.DATE,
    		  label: 'Date'
    	  }).updateDisplaySize({ height: 20, width: 20});
         reschDateField.isMandatory = true;
      
         var reschReasonField =   form.addField({
    		  id:'custpage_reason',
    		  type:serverWidget.FieldType.SELECT,
    		  label: 'Reason',
    		  source:'customlist_reschedulereasons'
    	 }).updateDisplaySize({ height: 20, width: 300});
		 reschReasonField.isMandatory = true; 
         
         var sttimeGroup = form.addFieldGroup({
			id : 'custpage_grp_sttime',
			label : 'Reschedule Time'
		});
		 var reschStTimeField = form.addField({
    		  id:'custpage_sttime',
    		  type:serverWidget.FieldType.TEXT,
    		  label: 'Start Time',
              container : 'custpage_grp_sttime'
    	  }).updateDisplaySize({ height: 20, width: 10});
         
         reschStTimeField.isMandatory = true;  
         var reschStTimeSelectField =   form.addField({
    		  id:'custpage_stselect',
    		  type:serverWidget.FieldType.SELECT,
    		  label: ' ',
			  source: 'customlist_schedule_time',
              container : 'custpage_grp_sttime'
    	  }).updateDisplaySize({ height: 20, width: 120});
		  
		  
		  var reschEndTimeField = form.addField({
    		  id:'custpage_endtime',
    		  type:serverWidget.FieldType.TEXT,
    		  label: 'End Time',
              container : 'custpage_grp_sttime'
    	  }).updateDisplaySize({ height: 20, width: 10});
         
         reschEndTimeField.isMandatory = true;  
         var reschEndTimeSelectField =   form.addField({
    		  id:'custpage_endselect',
    		  type:serverWidget.FieldType.SELECT,
    		  label: ' ',
			  source: 'customlist_schedule_time',
              container : 'custpage_grp_sttime'
    	  }).updateDisplaySize({ height: 20, width: 120});
      
      
		 reschAppField.updateDisplayType({
			 displayType : serverWidget.FieldDisplayType.HIDDEN
		 });
      
        reschStTimeSelectField.updateLayoutType({
			layoutType : serverWidget.FieldLayoutType.NORMAL
		 });
		/*reschStTimeSelectField.updateLayoutType({
			layoutType : serverWidget.FieldLayoutType.NORMAL
		 });

		 reschEndTimeField.updateLayoutType({
			layoutType : serverWidget.FieldLayoutType.NORMAL
		 });
      reschEndTimeSelectField.updateLayoutType({
			layoutType : serverWidget.FieldLayoutType.NORMAL
		 });*/
         reschDateField.updateLayoutType({
			layoutType : serverWidget.FieldLayoutType.OUTSIDEABOVE
		 });
      	 reschReasonField.updateLayoutType({
			layoutType : serverWidget.FieldLayoutType.OUTSIDEABOVE
		 });
		
    	 form.addSubmitButton('Save');
    	 response.writePage(form);
		 
	  if (request.method == 'GET'){
		  var reschReason = request.parameters.custpage_reason;
		  log.debug("GET values", reschReason+appId);
      }	  
	  else {
		  var reschReason = request.parameters.custpage_reason;
		  var reschDate = request.parameters.custpage_date;
		  var reschStartTime = request.parameters.custpage_sttime;
		  var reschEndTime = request.parameters.custpage_endtime;
		  var reschAppointId = request.parameters.custpage_app;
		  
		  log.debug("POST values", reschReason+reschDate+reschStartTime+reschEndTime+reschAppointId);
		  
		  var currentAppointRec = record.load({
			  type: record.Type.CALENDAR_EVENT,
			  id: reschAppointId,
			  isDynamic: true
		  });
		  
		  currentAppointRec.setValue({
			fieldId:'custevent_reschedulereason',
			value: reschReason
		  });
		  
		  currentAppointRec.setText({
			fieldId:'startdate',
			text: reschDate
		  });
		  
		  currentAppointRec.setText({
			fieldId:'starttime',
			text: reschStartTime
		  });
		  
		  currentAppointRec.setText({
			fieldId:'endtime',
			text: reschEndTime
		  });
		  
		  var recId = currentAppointRec.save(); 
		  if(recId) {
			 log.debug("Appointment saved. Internal id : ",recId); 
             
		  	 
            
            var form = serverWidget.createForm({
    		  title: "Reschedule Appointment",
			  hideNavBar: true
    	  });
		  
         form.clientScriptFileId = 30223582;
      
         var reschRefreshField = form.addField({
    		   id: 'custpage_header',
			   type: serverWidget.FieldType.INLINEHTML,
			   label: ' '
			}).updateLayoutType({
			  layoutType: serverWidget.FieldLayoutType.OUTSIDEABOVE
			}).updateBreakType({
			   breakType: serverWidget.FieldBreakType.STARTROW
			}).defaultValue = "<p style='font-size:20px'><br><br> Your Appointment Reschedule Record has been saved.<br> <a href='javascript:void(0)' onClick='self.close();if(window.opener && !window.opener.closed){window.opener.location.reload();};'>Click</a> to close the window.</p><br><br>";
      response.writePage(form);
			//return true;
          }
		  //log.debug("Appoint values", currentAppoint);
	  }
      

    }

    return {
        onRequest: onRequest
    };
    
});
