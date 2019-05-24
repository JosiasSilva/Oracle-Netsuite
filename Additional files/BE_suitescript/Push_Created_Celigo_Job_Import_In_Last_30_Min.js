function Push_Celigo_Job_Import_In_Last_30()
{
  try
  {
    // Oscar Sccess Sync
    // var mySearchOscarSuccess = nlapiLoadSearch(null, 8494); // For Sandbox
    var mySearchOscarSuccess = nlapiLoadSearch(null, 9560); // For Production
    var searchresultOscarSuccess = [];
    var resultsetOscarSuccess = mySearchOscarSuccess.runSearch();
    var searchidOscarSuccess = 0;
    do 
    {
      var resultsliceOscarSuccess = resultsetOscarSuccess.getResults(searchidOscarSuccess, searchidOscarSuccess + 1000);
      if (resultsliceOscarSuccess != null && resultsliceOscarSuccess != '') 
      {
        for (var rs in resultsliceOscarSuccess) 
        {
          searchresultOscarSuccess.push(resultsliceOscarSuccess[rs]);
          searchidOscarSuccess++;
        }
      }
    } while (resultsliceOscarSuccess.length >= 1000);

    // Oscar Error Sync

    /* var mySearchOscarError = nlapiLoadSearch(null, 8494); // For Sandbox
    //var mySearchOscarError = nlapiLoadSearch(null, 9560); // For Production
    var searchresultOscarError = [];
    var resultsetOscarError = mySearchOscarError.runSearch();
    var searchidOscarError = 0;
    do 
    {
      var resultsliceOscarError = resultsetOscarError.getResults(searchidOscarError, searchidOscarError + 1000);
      if (resultsliceOscarError != null && resultsliceOscarError != '') 
      {
        for (var rs in resultsliceOscarError) 
        {
          searchresultOscarError.push(resultsliceOscarError[rs]);
          searchidOscarError++;
        }
      }
    } while (resultsliceOscarError.length >= 1000);*/


    //var chk_error_celigo_id = false;
    var chk_success_celigo_id = false;
    var filters = [];
    var createdFormula = new nlobjSearchFilter("formulanumeric", null, "greaterthan", "-30");
    createdFormula.setFormula("({created} - {today}) * 24 * 60");
    filters.push(createdFormula);
    var results = nlapiSearchRecord(null,1078,filters);
    nlapiLogExecution("DEBUG","Search Result of Celigo Job Import for Last 30 Min(JSON)",JSON.stringify(results));
    if(results)
    {
      for(var r=0; r<results.length; r++)
      {

        var celigo_id = results[r].getId();
        //To_Check_CeligoId(searchresultOscarSuccess,searchresultOscarError,celigo_id,chk_success_celigo_id,chk_error_celigo_id);
        To_Check_CeligoId(searchresultOscarSuccess,celigo_id,chk_success_celigo_id);
      }

    }
  }
  catch(ex)
  {
    nlapiLogExecution("Debug","Error(1)!!",ex.message);
  }
}
//function To_Check_CeligoId(searchresultOscarSuccess,searchresultOscarError,celigo_id,chk_success_celigo_id,chk_error_celigo_id)
function To_Check_CeligoId(searchresultOscarSuccess,celigo_id,chk_success_celigo_id)
{
  try{
    var searchCountOscarSuccess = searchresultOscarSuccess.length;
    //var searchCountOscarError = searchresultOscarError.length;
    if(searchCountOscarSuccess>0)
    {
      for(var j = 0; j <searchresultOscarSuccess.length; j++)
      {
        var celigoId=searchresultOscarSuccess[j].getValue('custrecord_oscar_success_celigo_id');
        if(celigoId == celigo_id)
        {
          chk_success_celigo_id = true; 
          break;
        }
      }
    }
    /* if(searchCountOscarError>0)
    {
      for(var j = 0; j <searchresultOscarError.length; j++)
      {
        var celigoId=searchresultOscarError[j].getValue('custrecord_oscar_error_celigo_id');
        if(celigoId == celigo_id)
        {
          chk_error_celigo_id = true; 
          break;
        }
      }
    }*/
    //Push to website if success celigo id is false
    nlapiLogExecution("Debug","Success Celigo Id(T/F)",chk_success_celigo_id);
    if(chk_success_celigo_id == false)
    {
      GetDetailsOfCeligoJobImport(celigo_id);
    }
  }
  catch(ex)
  {
    nlapiLogExecution("Debug","Error(2)!!",ex.message);
  }
}
function GetDetailsOfCeligoJobImport(celigo_id)
{
  try
  {
    //Start
    nlapiLogExecution("DEBUG","Celigo Id (in schedule script)", celigo_id);
    if(celigo_id !='' && celigo_id !=null)
    {
      var log_id = nlapiLookupField ('customrecord_celigo_job_import' , celigo_id , 'custrecord_celigo_ji_log' );
      nlapiLogExecution("DEBUG","Internal Id & Log Id of record for Celigo Import Job(Via Schedule Script)","Internal Id of Celigo Import job: " + celigo_id +" & Log Id :"+ log_id );
      var order_id =nlapiLookupField('customrecord_celigo_job_import',celigo_id,'custrecord_celigo_ji_order_id');
      var filters = new Array();
      var columns = new Array();
      var display_error_message = '';
      var status_code = 0;
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
          nlapiLogExecution("DEBUG","In Schedule Script having error for following celigo id",celigo_id);
          Push_To_Oscar(status_code,order_id,display_error_message,celigo_id);
        }
      }
      else
      {
        status_code = 100; // sync successfully
        nlapiLogExecution("DEBUG","In Schedule Script having success sync for following celigo id",celigo_id);
        Push_To_Oscar(status_code,order_id,display_error_message,celigo_id); 
      }
    }
  }
  catch(ex)
  {
    nlapiLogExecution('DEBUG','Error!! has been occurred while getting details from Celigo Job Import',ex.message);
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
function Push_To_Oscar(status_code,order_id,display_error_message,celigo_id)
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
      nlapiLogExecution('DEBUG','Import log has been pushed successfully to the website having celigo Id (From Schedule Script):', celigo_id);
      Create_CR_Success_Sync_Celigo_Id_Via_Schedule_Script(celigo_id);
    }
  }
  catch(ex)
  {
    nlapiLogExecution('DEBUG','Error!! has been occurred while pushing log onto the website (From Schedule Script)',ex.message);
  }
}
function Create_CR_Success_Sync_Celigo_Id_Via_Schedule_Script(celigo_id)
{
  try
  {
    var successObj = nlapiCreateRecord('customrecord_oscar_success_sync');
    successObj.setFieldValue('custrecord_oscar_success_celigo_id',celigo_id);
    nlapiSubmitRecord(successObj);
    nlapiLogExecution('DEBUG','Information for Oscar Success Sync having celigo id:' + celigo_id , "Custom record created successfully via schedule script");
  }
  catch(ex)
  {
    nlapiLogExecution('DEBUG','Error!! has been occurred while creating custom record (From Schedule Script)',ex.message);
  }
}