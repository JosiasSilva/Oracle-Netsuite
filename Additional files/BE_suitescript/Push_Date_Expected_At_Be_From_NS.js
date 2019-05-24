function Push_Date_Expected_At_Be_From_NS(type,form)
{
  try
  {
    var cdp_id = nlapiGetRecordId();
    nlapiLogExecution("DEBUG","Cdp Id(WorkFlow) :",cdp_id);
    var date_expected_at_be = nlapiLookupField("customrecord_custom_diamond",cdp_id,"custrecord_diamond_eta");
    nlapiLogExecution("DEBUG","Date Expected At Be (WorkFlow) :",date_expected_at_be);
    if(date_expected_at_be !='' && date_expected_at_be!=null)
    {
      var result = Push_Date_Expected_At_Be_To_Portal(cdp_id,date_expected_at_be);
      nlapiLogExecution('DEBUG','Response Body Output From Portal having Cdp Id (WorkFlow) :'+ cdp_id, result.getBody());
      nlapiLogExecution('DEBUG','Response Code from Portal having Cdp Id (WorkFlow) :'+ cdp_id, result.getCode());
      if(result.getCode() == 200)
      {
        nlapiLogExecution('DEBUG',"Information for pushing date expected at be to portal (WorkFlow)" ,'Date expected at be has been pushed to Portal successfully having CdpId (WorkFlow):' + cdp_id);
      }
    }
  }
  catch(ex)
  {
    nlapiLogExecution('DEBUG',"Error occurred during pushing date expected at be to portal (WorkFlow)" ,ex.message);
  }
}
function  Push_Date_Expected_At_Be_To_Portal(cdp_id,date_expected_at_be)
{
  //Setting up URL of CDP             
 // var url = "https://partner.brilliantearth.com/api/cdp/";    // live portal
  var url = "https://testportal.brilliantearth.com/api/cdp/";    // test portal 
  //Setting up Headers 
  var headers = new Array(); 
  headers['http'] = '1.1';    
  headers['Accept'] = 'application/json';       
  //headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; // live portal
  headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //Test Portal
  headers['Content-Type'] = 'application/json'; 
  headers['User-Agent-x'] = 'SuiteScript-Call';
  var cdpFieldVal = nlapiLookupField('customrecord_custom_diamond',cdp_id,["custrecord_custom_diamond_vendor","custrecord_on_vendor_portal","custrecord_action_needed","custrecordoverride_mapping_logic","custrecord_item_status","custrecord165"]);
  var vendor_id = cdpFieldVal.custrecord_custom_diamond_vendor;
  var on_vendor_portal= cdpFieldVal.custrecord_on_vendor_portal;
  if(on_vendor_portal=='F')
    on_vendor_portal ='T';
  var action_needed = cdpFieldVal.custrecord_action_needed;
  action_needed = "["+ action_needed +"]";
  var manual_override = cdpFieldVal.custrecordoverride_mapping_logic;
  var item_status =cdpFieldVal.custrecord_item_status;
  var portal_request_type = cdpFieldVal.custrecord165;
  var jsonobj =
      {
        "cdp_id"      		  :   	cdp_id,
        "vendor_id"           :   	vendor_id,
        "on_vendor_portal"    : 	on_vendor_portal,
        "action_needed"       : 	action_needed,
        "manual_override"     :		manual_override,
        "item_status"         : 	item_status,
        "portal_request_type" :		portal_request_type,
        "date_expected_at_be" :   	date_expected_at_be
      }
  //Stringifying JSON
  var myJSONText = JSON.stringify(jsonobj, replacer); 
  nlapiLogExecution('DEBUG','CDP Date Expected At Be Response Body From NS: (WorkFlow)', myJSONText);
  var response = nlapiRequestURL(url, myJSONText, headers);  
  return response;
}
function replacer(key, value)
{
  if (typeof value == "number" && !isFinite(value))
  {
    return String(value);
  }
  return value;
}