nlapiLogExecution("audit","FLOStart",new Date().getTime());
 function NewLeadCreation(type)
 {
   if(type == 'create')
   { 
     try
     {      
         nlapiLogExecution("debug","event type : ",type);
         nlapiLogExecution("debug","record Id : ",nlapiGetRecordId());
	  var cookieData = nlapiLookupField('customer',nlapiGetRecordId(),'custentity107');
	  var deviceArr =['custentity105','custentity106','custentity108'];
	  var deviceData = nlapiLookupField('customer',nlapiGetRecordId(),deviceArr);
	  var deviceName = deviceData.custentity105;
	  var formFactor = deviceData.custentity106;
	  var isMobile = deviceData.custentity108;
	   
	  if(cookieData != '')
	  {
		var jsonData = JSON.parse(cookieData);
		var attribution = jsonData['attribution'];
		//Create new cookie record  
	    var CookieRecord = nlapiCreateRecord('customrecord_multipth_attribution_cookie');
            CookieRecord.setFieldValue('custrecord_cookie_customer', nlapiGetRecordId()); //customer id
            CookieRecord.setFieldValue('custrecord_cookie_num_paths_in_session',jsonData.total); //total
            CookieRecord.setFieldValue('custrecord_cps_wurfl_device_name', deviceName);
            CookieRecord.setFieldValue('custrecord_cps_wurfl_form_factor', formFactor);
		if(isMobile == 'false')
		{
                    CookieRecord.setFieldValue('custrecord_cps_wurfl_is_mobile', 'F'); //checkbox
		}
		else if(isMobile == 'true')
		{
		   CookieRecord.setFieldValue('custrecord_cps_wurfl_is_mobile', 'T'); //checkbox
		}
                
		// Set values for the line item
        for(var i=0; i < attribution.length; i++)
        { 
	       var year = attribution[i].date.substring(0,4);
           var month = attribution[i].date.substring(4,6);
           var day = attribution[i].date.substring(6,8);
		  var currentDate = '';
		  if(year != '' && month != '' && day != '')
		  {
                      currentDate = month +"/"+ day +"/"+ year;
		  }
          CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_adid', i+1, attribution[i].adID);
          CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_campaign_name', i+1, attribution[i].campaign);
          CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_campaign_term', i+1, "");
          CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_click_medium', i+1, attribution[i].medium);
          CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_click_number', i+1, i+1);
          CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_click_source', i+1, attribution[i].source);
          CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_content', i+1, attribution[i].content);
          CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_date', i+1, currentDate);
          CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_keyword', i+1, attribution[i].keyword);
          CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_repeat', i+1, attribution[i].repeat); 
        }
        var id = nlapiSubmitRecord(CookieRecord, true, true);
        nlapiLogExecution("DEBUG","Submit Record Id : " + id );
      }
     }
     catch(err)
     {
        nlapiLogExecution("DEBUG","Error raised when new cookie record has been created.",err.message);
     }
    }
 }
