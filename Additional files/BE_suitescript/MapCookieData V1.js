function NewLeadCreation(type) 
{
     if (type == 'create') 
	 {
         try 
		 {
			 var id = nlapiGetRecordId();
             nlapiLogExecution("debug", "event type : ", type);
             nlapiLogExecution("debug", "record Id : ", id);
             var cookieData = nlapiLookupField('customer', id, 'custentity107');
/********************* Start Added by Yagya Kumar for NS-884 on 11 Sep 2017 ****************/
			 cookieData = check_type(cookieData);
/********************* End Added by Yagya Kumar for NS-884 on 11 Sep 2017 ****************/
			 var deviceArr = ['custentity105', 'custentity106', 'custentity108'];
             var deviceData = nlapiLookupField('customer', id, deviceArr);
             var deviceName = deviceData.custentity105;
             var formFactor = deviceData.custentity106;
             var isMobile = deviceData.custentity108;

             if (cookieData != '') 
			 {
                 var jsonData = JSON.parse(cookieData);
                // if(jsonData.length>0)
				{
                  var attribution = jsonData['attribution'];
                 //Create new cookie record  
                 var CookieRecord = nlapiCreateRecord('customrecord_multipth_attribution_cookie');
                 CookieRecord.setFieldValue('custrecord_cookie_customer', id); //customer id
                 CookieRecord.setFieldValue('custrecord_cookie_num_paths_in_session', jsonData.total); //total
                 CookieRecord.setFieldValue('custrecord_cps_wurfl_device_name', deviceName);
                 CookieRecord.setFieldValue('custrecord_cps_wurfl_form_factor', formFactor);
                 if (isMobile == 'false') 
				 {
                     CookieRecord.setFieldValue('custrecord_cps_wurfl_is_mobile', 'F'); //checkbox
                 } 
				 else if (isMobile == 'true') 
				 {
                     CookieRecord.setFieldValue('custrecord_cps_wurfl_is_mobile', 'T'); //checkbox
                 }

                 // Set values for the line item
                 for (var i = 0; i < attribution.length; i++) 
				 {
                     var year = attribution[i].date.substring(0, 4);
                     var month = attribution[i].date.substring(4, 6);
                     var day = attribution[i].date.substring(6, 8);
                     var currentDate = '';
                     if (year != '' && month != '' && day != '') 
					 {
                         currentDate = month + "/" + day + "/" + year;
                     }
                     CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_adid', i + 1, attribution[i].adID);
                     CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_campaign_name', i + 1, attribution[i].campaign);
                     CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_campaign_term', i + 1, "");
                     CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_click_medium', i + 1, attribution[i].medium);
                     CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_click_number', i + 1, i + 1);
                     CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_click_source', i + 1, attribution[i].source);
                     CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_content', i + 1, attribution[i].content);
                     CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_date', i + 1, currentDate);
                     CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_keyword', i + 1, attribution[i].keyword);
                     CookieRecord.setLineItemValue('recmachcustrecord_cookie_parent', 'custrecord_cookie_repeat', i + 1, attribution[i].repeat);
                 }
                 var id = nlapiSubmitRecord(CookieRecord, true, true);
                 nlapiLogExecution("DEBUG", "Submit Record Id : " + id);
                }
             }
         } 
		 catch (err) 
		 {
             nlapiLogExecution("DEBUG", "Error raised when new cookie record has been created.", err.message);
         }
     }
 }
 
/********************* Start Added by Yagya Kumar for NS-884 on 11 Sep 2017 ****************/
function check_type(cookieData) 
{
	try
	{
		if (cookieData) 
		{
			var temp_cookieData = JSON.parse(cookieData);
			var subType = typeOf(temp_cookieData);
			if (subType == 'array' && temp_cookieData.length>0) 
			{
				cookieData = temp_cookieData[0][1];
			}
		}
	}
	catch(exx)
	{
		nlapiLogExecution('error','Error in getting data of OCF',exx);
	}    
    return cookieData;
}
function typeOf(obj) 
{
	if(obj.length>0)
	{
		return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
	}
	return '';
}
/********************* End Added by Yagya Kumar for NS-884 on 11 Sep 2017 ****************/