function get_old_new_value_of_diamond_status(cdpId,temp_old_diamond_status,temp_new_diamond_status)
{
  try
  {
    var system_note_date ='';
    var filter = new Array();
    var column = new Array();

    filter.push(new nlobjSearchFilter('field','systemnotes','anyof','CUSTRECORD_DIAMOND_STATUS'));
    filter.push(new nlobjSearchFilter('internalid',null,'anyof',cdpId));

    column.push(new nlobjSearchColumn('oldvalue','systemnotes'));
    column.push(new nlobjSearchColumn('newvalue','systemnotes'));
    column.push(new nlobjSearchColumn('date','systemnotes').setSort(true));
    var searchresult = nlapiSearchRecord("customrecord_custom_diamond",null,filter,column);
    nlapiLogExecution("debug","Search Result of Diamond Status(System Notes)",JSON.stringify(searchresult) + " having cdp id " + cdpId);
    if(searchresult) 
    {
      temp_old_diamond_status = searchresult[0].getValue('oldvalue','systemnotes');
      nlapiLogExecution("Debug","Old Value (Diamond Status) From System Notes",temp_old_diamond_status +" having cdp id " + cdpId);
      temp_new_diamond_status = searchresult[0].getValue('newvalue','systemnotes');
      nlapiLogExecution("Debug","New Value(Diamond Status) From System Notes",temp_new_diamond_status +" having cdp id " + cdpId);
      system_note_date= searchresult[0].getValue('date','systemnotes');
      //system_note_date = system_note_date.split(' ');
      //system_note_date = system_note_date[0];
      nlapiLogExecution("Debug","Date (Diamond Status) From System Notes",system_note_date +" having cdp id " + cdpId);
    }
    if(temp_old_diamond_status !='' && temp_old_diamond_status!=null)
      temp_old_diamond_status = Convert_Into_Old_Diamond_Status_Value(temp_old_diamond_status);
    if(temp_new_diamond_status!='' && temp_new_diamond_status!= null)
      temp_new_diamond_status = Convert_Into_New_Diamond_Status_Value(temp_new_diamond_status);
    nlapiLogExecution("Debug","Convert Old Value(in string) (Diamond Status) From System Notes into numeric value",temp_old_diamond_status +" having cdp id " + cdpId);
    nlapiLogExecution("Debug","Convert New Value(in string)(Diamond Status) From System Notes into numeric value",temp_new_diamond_status +" having cdp id " + cdpId);
    return [temp_old_diamond_status,temp_new_diamond_status,system_note_date];
  }
  catch(ex)
  {
    nlapiLogExecution("Debug","Error in Diamond Status Lib file",ex.message +" having cdp id" + cdpId);
  }
}
//Convert diamond status string old value into numeric value
function Convert_Into_Old_Diamond_Status_Value(temp_old_diamond_status)
{
  if(temp_old_diamond_status == "Confirmed")
  {
    temp_old_diamond_status = 1;
    return temp_old_diamond_status ;
  }
  else if(temp_old_diamond_status == "Requested-pending")
  {
    temp_old_diamond_status = 2;
    return temp_old_diamond_status ;
  }
  else if(temp_old_diamond_status == "Not available")
  {
    temp_old_diamond_status = 3;
    return temp_old_diamond_status ;
  }
  else if(temp_old_diamond_status == "Not eye clean")
  {
    temp_old_diamond_status = 4;
    return temp_old_diamond_status ;
  }
  else if(temp_old_diamond_status == "Canceled")
  {
    temp_old_diamond_status = 5;
    return temp_old_diamond_status ;
  }
  else if(temp_old_diamond_status == "Not available-replacement confirmed")
  {
    temp_old_diamond_status = 6;
    return temp_old_diamond_status ;
  }
  else if(temp_old_diamond_status == "On Hold Pending Customer Decision")
  {
    temp_old_diamond_status = 7;
    return temp_old_diamond_status ;
  }
  else if(temp_old_diamond_status == "Hold Release")
  {
    temp_old_diamond_status = 8;
    return temp_old_diamond_status ;
  }
  else if(temp_old_diamond_status == "On Hold - Customer Payment Pending")
  {
    temp_old_diamond_status = 9;
    return temp_old_diamond_status ;
  }
}
//Convert diamond status string new value into numeric value
function Convert_Into_New_Diamond_Status_Value(temp_new_diamond_status)
{
  if(temp_new_diamond_status == "Confirmed")
  {
    temp_new_diamond_status = 1;
    return temp_new_diamond_status ;
  }
  else if(temp_new_diamond_status == "Requested-pending")
  {
    temp_new_diamond_status = 2;
    return temp_new_diamond_status ;
  }
  else if(temp_new_diamond_status == "Not available")
  {
    temp_new_diamond_status = 3;
    return temp_new_diamond_status ;
  }
  else if(temp_new_diamond_status == "Not eye clean")
  {
    temp_new_diamond_status = 4;
    return temp_new_diamond_status ;
  }
  else if(temp_new_diamond_status == "Canceled")
  {
    temp_new_diamond_status = 5;
    return temp_new_diamond_status ;
  }
  else if(temp_new_diamond_status == "Not available-replacement confirmed")
  {
    temp_new_diamond_status = 6;
    return temp_new_diamond_status ;
  }
  else if(temp_new_diamond_status == "On Hold Pending Customer Decision")
  {
    temp_new_diamond_status = 7;
    return temp_new_diamond_status ;
  }
  else if(temp_new_diamond_status == "Hold Release")
  {
    temp_new_diamond_status = 8;
    return temp_new_diamond_status ;
  }
  else if(temp_new_diamond_status == "On Hold - Customer Payment Pending")
  {
    temp_new_diamond_status = 9;
    return temp_new_diamond_status ;
  }
}