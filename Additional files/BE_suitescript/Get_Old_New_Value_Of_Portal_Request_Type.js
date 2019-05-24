

function get_old_new_value_of_portal_request_type(cdpId,temp_old_portal_request_type,temp_new_portal_request_type)
{
  try
  {
    var system_note_date ='';
    var filter = new Array();
    var column = new Array();

    filter.push(new nlobjSearchFilter('field','systemnotes','anyof','CUSTRECORD165'));
    filter.push(new nlobjSearchFilter('internalid',null,'anyof',cdpId));

    column.push(new nlobjSearchColumn('oldvalue','systemnotes'));
    column.push(new nlobjSearchColumn('newvalue','systemnotes'));
    column.push(new nlobjSearchColumn('date','systemnotes').setSort(true));
    var searchresult = nlapiSearchRecord("customrecord_custom_diamond",null,filter,column);
    nlapiLogExecution("debug","Search Result of Portal Request Type(System Notes) (Diamond ETA)",JSON.stringify(searchresult) + " having cdp id " + cdpId);
    if(searchresult) 
    {
      temp_old_portal_request_type = searchresult[0].getValue('oldvalue','systemnotes');
      nlapiLogExecution("Debug","Old Value (Portal Request Type) From System Notes (Diamond ETA)",temp_old_portal_request_type +" having cdp id " + cdpId);
      temp_new_portal_request_type = searchresult[0].getValue('newvalue','systemnotes');
      nlapiLogExecution("Debug","New Value (Portal Request Type) From System Notes (Diamond ETA)",temp_new_portal_request_type +" having cdp id " + cdpId);
      system_note_date= searchresult[0].getValue('date','systemnotes');
      //system_note_date = system_note_date.split(' ');
      //system_note_date = system_note_date[0];
      nlapiLogExecution("Debug","Date (Portal Request Type) From System Notes (Diamond ETA)",system_note_date +" having cdp id " + cdpId);
    }
    if(temp_old_portal_request_type !='' && temp_old_portal_request_type!=null)
      temp_old_portal_request_type = Convert_Into_Old_Portal_Request_Type(temp_old_portal_request_type);
    if(temp_new_portal_request_type!='' && temp_new_portal_request_type!= null)
      temp_new_portal_request_type = Convert_Into_New_Portal_Request_Type(temp_new_portal_request_type);
    nlapiLogExecution("Debug","Convert Old Value(in string) (Portal Request Type) From System Notes into value (Diamond ETA)",temp_old_portal_request_type +" having cdp id " + cdpId);
    nlapiLogExecution("Debug","Convert New Value(in string) (Portal Request Type) From System Notes into value (Diamond ETA)",temp_new_portal_request_type +" having cdp id " + cdpId);
    return [temp_old_portal_request_type,temp_new_portal_request_type,system_note_date];
  }
  catch(ex)
  {
    nlapiLogExecution("Debug","Error in Portal Request Type Lib File ",ex.message + " having cdp id " + cdpId);
  }
}
function Convert_Into_Old_Portal_Request_Type(temp_old_portal_request_type)
{
  if(temp_old_portal_request_type == "Hold")
  {
    temp_old_portal_request_type = 2;
    return temp_old_portal_request_type ;
  }
  else if(temp_old_portal_request_type == "Sold")
  {
    temp_old_portal_request_type = 3;
    return temp_old_portal_request_type ;
  }
  else if(temp_old_portal_request_type == "Memo")
  {
    temp_old_portal_request_type = 4;
    return temp_old_portal_request_type ;
  }
  else if(temp_old_portal_request_type == "Checking Available/Eye-Clean")
  {
    temp_old_portal_request_type = 5;
    return temp_old_portal_request_type ;
  }
  else if(temp_old_portal_request_type == "Image Request")
  {
    temp_old_portal_request_type = 6;
    return temp_old_portal_request_type ;
  }
  else if(temp_old_portal_request_type == "Cert Request")
  {
    temp_old_portal_request_type = 7;
    return temp_old_portal_request_type ;
  }
  
}
function Convert_Into_New_Portal_Request_Type(temp_new_portal_request_type)
{
   if(temp_new_portal_request_type == "Hold")
  {
    temp_new_portal_request_type = 2;
    return temp_new_portal_request_type ;
  }
  else if(temp_new_portal_request_type == "Sold")
  {
    temp_new_portal_request_type = 3;
    return temp_new_portal_request_type ;
  }
  else if(temp_new_portal_request_type == "Memo")
  {
    temp_new_portal_request_type = 4;
    return temp_new_portal_request_type ;
  }
  else if(temp_new_portal_request_type == "Checking Available/Eye-Clean")
  {
    temp_new_portal_request_type = 5;
    return temp_new_portal_request_type ;
  }
  else if(temp_new_portal_request_type == "Image Request")
  {
    temp_new_portal_request_type = 6;
    return temp_new_portal_request_type ;
  }
  else if(temp_new_portal_request_type == "Cert Request")
  {
    temp_new_portal_request_type = 7;
    return temp_new_portal_request_type ;
  }
}