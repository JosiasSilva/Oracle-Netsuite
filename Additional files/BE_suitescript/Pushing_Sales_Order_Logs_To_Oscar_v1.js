function Pushing_Sales_Order_Logs_To_Oscar(type,form)
{
  try
  {
    // Saved Search :: Celigo Job Imports: Results 
    var mySearch = nlapiLoadSearch(null, 1078); // For Sandbox
    var searchid = 0;
    var resultset = mySearch.runSearch();
    var searchresult = resultset.getResults(searchid, searchid + 1);
    nlapiLogExecution("DEBUG","Search Result(JSON)",JSON.stringify(searchresult));
    if(searchresult !='' && searchresult !=null)
    {
      var searchCount = searchresult.length;
      nlapiLogExecution("DEBUG", "No Of Record in search result is : ", searchCount);
      if (searchCount > 0) 
      {
        var  celigo_id = searchresult[0].id;
        var log_id = searchresult[0].getValue('custrecord_celigo_ji_log');
        nlapiLogExecution("DEBUG","Internal Id & Log Id of recently created record for Celigo Import Job","Internal Id of Celigo Import job: " + celigo_id +" & Log Id :"+ log_id );
        // Push_Order_ID_First_Error_Message(internal_id_celigo_import_job,log_id);
        var order_id =nlapiLookupField('customrecord_celigo_job_import',celigo_id,'custrecord_celigo_ji_order_id');
        var filters = new Array();
        var columns = new Array();
        var display_error_message = '';
        var status_code = 0;
        var jsonobj = null;
        columns.push(new nlobjSearchColumn('custrecord_celigo_logger_message'));
        columns.push(new nlobjSearchColumn('id')); 
        filters.push(new nlobjSearchFilter('custrecord_celigo_logger_parent',null,'is',log_id));

        var serach_result_celigo_logger = nlapiSearchRecord("customrecord_celigo_logger",null,filters,columns);
        nlapiLogExecution("DEBUG","Error Message Information",JSON.stringify(serach_result_celigo_logger));
        if(serach_result_celigo_logger)
        {
          if(serach_result_celigo_logger.length>0)
          {
            display_error_message = serach_result_celigo_logger[0].getValue('custrecord_celigo_logger_message');
            var internal_id = serach_result_celigo_logger[0].getValue('id');
            status_code = 101 // error 
            var chk_return_val = Search_Error_Id(celigo_id);
            // true if error id exists and false if error id does not exist.
            nlapiLogExecution("DEBUG","Check Error Id",chk_return_val);
            if(chk_return_val == true)
              return;
            Create_Error_Id(internal_id,celigo_id);
            nlapiLogExecution('DEBUG','Status Code in case of error:', status_code);
            Push_Order_ID_First_Error_Message(status_code,order_id,display_error_message,celigo_id);
          }
        }
        else
        {
          status_code = 100; // sync successfully
          var chk_return_val = Search_Success_Sync_Id(celigo_id);
          // true if celigo id exists and false if celigo id does not exist.
          nlapiLogExecution("DEBUG","Check Success Sync Value",chk_return_val);
          if(chk_return_val == true)
            return;
          Create_Success_Sync_Id(celigo_id);
          nlapiLogExecution('DEBUG','Status Code in case of success :', status_code);
          Push_Order_ID_First_Error_Message(status_code,order_id,display_error_message,celigo_id);
        }
      }
    }
  }
  catch(ex)
  {
    nlapiLogExecution("DEBUG","Error Saved Search 1078",ex.message);
  }
}

function Push_Order_ID_First_Error_Message(status_code,order_id,display_error_message,celigo_id)
{
  try
  {
    var jsonobj = null;
    //var url = "https://prepublish.brilliantearth.com/order/sync-orders-status-from-netsuite/"; // sandbox api
    var url =  "https://www.brilliantearth.com/order/sync-orders-status-from-netsuite/"; // live api
    var headers = new Array();
    headers['Accept']           = 'application/json';
    headers['User-Agent-x'] 	= 'SuiteScript-Call';
    headers['Content-Type'] 	= 'application/json';
    headers['Authorization'] 	= 'NLAuth nlauth_account=666639, nlauth_email=nsconsultant@brilliantearth.com, nlauth_signature=gQLu8dOPJCqvunP9Cr9eUMMzC, nlauth_role=3';
    headers['auth-token'] 		= 'YnJpbGxpYW50ZWFydGggYmViZTEz';

    if(status_code == 100)
    {
      jsonobj =
        {
        "order_id"  			:  order_id,
        "order_status_info"		:  "Success!",
        "status_code" 			:  status_code
      }
    }
    else if(status_code == 101)
    {
      jsonobj =
        {
        "order_id" 					:  order_id,
        "status_code" 				:  status_code,
        "order_status_info"			:  display_error_message
      }
    }
    var myJSONText = JSON.stringify(jsonobj,replacer);
    nlapiLogExecution('DEBUG','Request JSON Data :', myJSONText);
    var responseData = nlapiRequestURL(url,myJSONText,headers, null, "POST");
    nlapiLogExecution('DEBUG','Response Body Output :', responseData.getBody());
    nlapiLogExecution('DEBUG','Response Code :', responseData.getCode());
    if(responseData.getCode() == 200)
    {
      nlapiLogExecution('DEBUG','Import log has been pushed successfully to the website having celigo Id :', celigo_id);
    }
  }
  catch(ex)
  {
    nlapiLogExecution('DEBUG','Error!! has been occurred while pushing log onto the website',ex.message);
  }

}
function replacer(key, value)
{
  if (typeof value == "number" && !isFinite(value))
  {
    return String(value);
  }
  return value;
}
// for error 
function Create_Error_Id(internal_id,celigo_id)
{
  var errorObj = nlapiCreateRecord('customrecord_oscar_error_id');
  errorObj.setFieldValue('custrecord_oscar_error_id',internal_id);
  errorObj.setFieldValue('custrecord_oscar_error_celigo_id',celigo_id);
  nlapiSubmitRecord(errorObj);
  nlapiLogExecution('DEBUG','Information for Oscar Error Id having celigo id:' + celigo_id , "Custom record created successfully");
}
function Search_Error_Id(celigo_id)
{
  var filters = new Array();
  var columns = new Array();
  columns.push(new nlobjSearchColumn('custrecord_oscar_error_celigo_id'));
  filters.push(new nlobjSearchFilter('custrecord_oscar_error_celigo_id',null,'is',celigo_id));
  var serach_result_error_id = nlapiSearchRecord("customrecord_oscar_error_id",null,filters,columns);
  nlapiLogExecution('DEBUG','Search result for error id having celigo Id :' + celigo_id , JSON.stringify(serach_result_error_id));
  if(serach_result_error_id)
    return true;
  else
    return false;
}
// For success sync
function Create_Success_Sync_Id(celigo_id)
{
  var successObj = nlapiCreateRecord('customrecord_oscar_success_sync');
  successObj.setFieldValue('custrecord_oscar_success_celigo_id',celigo_id);
  nlapiSubmitRecord(successObj);
  nlapiLogExecution('DEBUG','Information for Oscar Success Sync having celigo id:' + celigo_id , "Custom record created successfully");
}
function Search_Success_Sync_Id(celigo_id)
{
  var filters = new Array();
  var columns = new Array();
  columns.push(new nlobjSearchColumn('custrecord_oscar_success_celigo_id'));
  filters.push(new nlobjSearchFilter('custrecord_oscar_success_celigo_id',null,'is',celigo_id));
  var serach_result_success_sync_id = nlapiSearchRecord("customrecord_oscar_success_sync",null,filters,columns);
  nlapiLogExecution('DEBUG','Search result for success sync for having celigo Id :' + celigo_id , JSON.stringify(serach_result_success_sync_id));
  if(serach_result_success_sync_id)
    return true;
  else
    return false;
}