function get_old_new_value_of_cs_status(cdpId,temp_old_cs_status,temp_new_cs_status)
{
  try
  {
    var system_note_date ='';
    var filter = new Array();
    var column = new Array();

    filter.push(new nlobjSearchFilter('field','systemnotes','anyof','CUSTRECORD_CUSTOM_DIAMOND_CS_STATUS'));
    filter.push(new nlobjSearchFilter('internalid',null,'anyof',cdpId));

    column.push(new nlobjSearchColumn('oldvalue','systemnotes'));
    column.push(new nlobjSearchColumn('newvalue','systemnotes'));
    column.push(new nlobjSearchColumn('date','systemnotes').setSort(true));
    var searchresult = nlapiSearchRecord("customrecord_custom_diamond",null,filter,column);
    nlapiLogExecution("debug","Search Result of CS Status(System Notes)",JSON.stringify(searchresult) + " having cdp id " + cdpId);
    if (searchresult) 
    {
      temp_old_cs_status = searchresult[0].getValue('oldvalue','systemnotes');
      nlapiLogExecution("Debug","Old Value (CS Status) From System Notes",temp_old_cs_status +" having cdp id " + cdpId);
      temp_new_cs_status = searchresult[0].getValue('newvalue','systemnotes');
      nlapiLogExecution("Debug","New Value(CS Status) From System Notes",temp_new_cs_status +" having cdp id " + cdpId);
      system_note_date= searchresult[0].getValue('date','systemnotes');
      //system_note_date = system_note_date.split(' ');
      //system_note_date = system_note_date[0];
      nlapiLogExecution("Debug","Date (CS Status) From System Notes",system_note_date +" having cdp id " + cdpId);
    }
    if(temp_old_cs_status !='' && temp_old_cs_status!=null)
      temp_old_cs_status = Convert_Into_Old_CS_Status_Value(temp_old_cs_status);
    if(temp_new_cs_status!='' && temp_new_cs_status!= null)
      temp_new_cs_status = Convert_Into_New_CS_Status_Value(temp_new_cs_status);
    nlapiLogExecution("Debug","Convert Old Value(in string) (CS Status) From System Notes into numeric value",temp_old_cs_status +" having cdp id " + cdpId);
    nlapiLogExecution("Debug","Convert New Value(in string)(CS Status) From System Notes into numeric value",temp_new_cs_status +" having cdp id " + cdpId);
    return [temp_old_cs_status,temp_new_cs_status,system_note_date];
  }
  catch(ex)
  {
    nlapiLogExecution("Debug","Error in CS Status Lib File",ex.message  +" having cdp id " + cdpId);
  }
}
//Convert cs status string old value into numeric value
function Convert_Into_Old_CS_Status_Value(temp_old_cs_status)
{
  if(temp_old_cs_status == "Waiting for GR reply")
  {
    temp_old_cs_status = 1;
    return temp_old_cs_status ;
  }
  else if(temp_old_cs_status == "Options/Info sent to CS")
  {
    temp_old_cs_status = 2;
    return temp_old_cs_status ;
  }
  else if(temp_old_cs_status == "Options/Info sent to customer")
  {
    temp_old_cs_status = 3;
    return temp_old_cs_status ;
  }
  else if(temp_old_cs_status == "Options accepted by customer")
  {
    temp_old_cs_status = 4;
    return temp_old_cs_status ;
  }
  else if(temp_old_cs_status == "Options rejected by customer")
  {
    temp_old_cs_status = 5;
    return temp_old_cs_status ;
  }
  else if(temp_old_cs_status == "Closed")
  {
    temp_old_cs_status = 6;
    return temp_old_cs_status ;
  }
}
//Convert cs status string new value into numeric value
function Convert_Into_New_CS_Status_Value(temp_new_cs_status)
{
  if(temp_new_cs_status == "Waiting for GR reply")
  {
    temp_new_cs_status = 1;
    return temp_new_cs_status ;
  }
  else if(temp_new_cs_status == "Options/Info sent to CS")
  {
    temp_new_cs_status = 2;
    return temp_new_cs_status ;
  }
  else if(temp_new_cs_status == "Options/Info sent to customer")
  {
    temp_new_cs_status = 3;
    return temp_new_cs_status ;
  }
  else if(temp_new_cs_status == "Options accepted by customer")
  {
    temp_new_cs_status = 4;
    return temp_new_cs_status ;
  }
  else if(temp_new_cs_status == "Options rejected by customer")
  {
    temp_new_cs_status = 5;
    return temp_new_cs_status ;
  }
  else if(temp_new_cs_status == "Closed")
  {
    temp_new_cs_status = 6;
    return temp_new_cs_status ;
  }

}