function get_old_new_value_of_item_status(cdpId,temp_old_item_status,temp_new_item_status)
{
  try
  {
    var system_note_date ='';
    var filter = new Array();
    var column = new Array();

    filter.push(new nlobjSearchFilter('field','systemnotes','anyof','CUSTRECORD_ITEM_STATUS'));
    filter.push(new nlobjSearchFilter('internalid',null,'anyof',cdpId));

    column.push(new nlobjSearchColumn('oldvalue','systemnotes'));
    column.push(new nlobjSearchColumn('newvalue','systemnotes'));
    column.push(new nlobjSearchColumn('date','systemnotes').setSort(true));
    var searchresult = nlapiSearchRecord("customrecord_custom_diamond",null,filter,column);
    nlapiLogExecution("debug","Search Result of Item Status(System Notes)",JSON.stringify(searchresult) + " having cdp id " + cdpId);
    if(searchresult) 
    {
      temp_old_item_status = searchresult[0].getValue('oldvalue','systemnotes');
      nlapiLogExecution("Debug","Old Value (Item Status) From System Notes",temp_old_item_status +" having cdp id " + cdpId);
      temp_new_item_status = searchresult[0].getValue('newvalue','systemnotes');
      nlapiLogExecution("Debug","New Value(Item Status) From System Notes",temp_new_item_status +" having cdp id " + cdpId);
      system_note_date= searchresult[0].getValue('date','systemnotes');
      //system_note_date = system_note_date.split(' ');
      //system_note_date = system_note_date[0];
      nlapiLogExecution("Debug","Date (Item Status) From System Notes",system_note_date +" having cdp id " + cdpId);
    }
    if(temp_old_item_status !='' && temp_old_item_status!=null)
      temp_old_item_status = Convert_Into_Old_Item_Status_Value(temp_old_item_status);
    if(temp_new_item_status!='' && temp_new_item_status!= null)
      temp_new_item_status = Convert_Into_New_Item_Status_Value(temp_new_item_status);
    nlapiLogExecution("Debug","Convert Old Value(in string) (Item Status) From System Notes into value",temp_old_item_status +" having cdp id " + cdpId);
    nlapiLogExecution("Debug","Convert New Value(in string)(Item Status) From System Notes into value",temp_new_item_status +" having cdp id " + cdpId);
    return [temp_old_item_status,temp_new_item_status,system_note_date];
  }
  catch(ex)
  {
    nlapiLogExecution("Debug","Error in Item Status Lib File",ex.message + " having cdp id " + cdpId);
  }
}
function Convert_Into_Old_Item_Status_Value(temp_old_item_status)
{
  if(temp_old_item_status == "Confirmed")
  {
    temp_old_item_status = 2;
    return temp_old_item_status ;
  }
  else if(temp_old_item_status == "Not confirmed")
  {
    temp_old_item_status = 1;
    return temp_old_item_status ;
  }
  else if(temp_old_item_status == "Not eye-clean")
  {
    temp_old_item_status = 3;
    return temp_old_item_status ;
  }
  else if(temp_old_item_status == "Hold release")
  {
    temp_old_item_status = 4;
    return temp_old_item_status ;
  }
  else if(temp_old_item_status == "Request received")
  {
    temp_old_item_status = 5;
    return temp_old_item_status ;
  }
  else if(temp_old_item_status == "Cancelled")
  {
    temp_old_item_status = 6;
    return temp_old_item_status ;
  }
  else if(temp_old_item_status == "Not available")
  {
    temp_old_item_status = 7;
    return temp_old_item_status ;
  }
  else if(temp_old_item_status == "EC Unknown")
  {
    temp_old_item_status = 8;
    return temp_old_item_status ;
  }
}
function Convert_Into_New_Item_Status_Value(temp_new_item_status)
{
  if(temp_new_item_status == "Confirmed")
  {
    temp_new_item_status = 2;
    return temp_new_item_status ;
  }
  else if(temp_new_item_status == "Not confirmed")
  {
    temp_new_item_status = 1;
    return temp_new_item_status ;
  }
  else if(temp_new_item_status == "Not eye-clean")
  {
    temp_new_item_status = 3;
    return temp_new_item_status ;
  }
  else if(temp_new_item_status == "Hold release")
  {
    temp_new_item_status = 4;
    return temp_new_item_status ;
  }
  else if(temp_new_item_status == "Request received")
  {
    temp_new_item_status = 5;
    return temp_new_item_status ;
  }
  else if(temp_new_item_status == "Cancelled")
  {
    temp_new_item_status = 6;
    return temp_new_item_status ;
  }
  else if(temp_new_item_status == "Not available")
  {
    temp_new_item_status = 7;
    return temp_new_item_status ;
  }
  else if(temp_new_item_status == "EC Unknown")
  {
    temp_new_item_status = 8;
    return temp_new_item_status ;
  }
}