function get_old_new_value_of_action_needed(cdpId,temp_old_action_needed,temp_new_action_needed)
{
  try
  {
    var system_note_date ='';
    var filter = new Array();
    var column = new Array();

    filter.push(new nlobjSearchFilter('field','systemnotes','anyof','CUSTRECORD_ACTION_NEEDED'));
    filter.push(new nlobjSearchFilter('internalid',null,'anyof',cdpId));

    column.push(new nlobjSearchColumn('oldvalue','systemnotes'));
    column.push(new nlobjSearchColumn('newvalue','systemnotes'));
    column.push(new nlobjSearchColumn('date','systemnotes').setSort(true));
    var searchresult = nlapiSearchRecord("customrecord_custom_diamond",null,filter,column);
    nlapiLogExecution("debug","Search Result of Action Needed (System Notes)",JSON.stringify(searchresult) + " having cdp id " + cdpId);
    if(searchresult) 
    {
      temp_old_action_needed = searchresult[0].getValue('oldvalue','systemnotes');
      nlapiLogExecution("Debug","Old Value (Action Needed) From System Notes",temp_old_action_needed +" having cdp id " + cdpId);
      temp_new_action_needed = searchresult[0].getValue('newvalue','systemnotes');
      nlapiLogExecution("Debug","New Value(Action Needed) From System Notes",temp_new_action_needed +" having cdp id " + cdpId);
      system_note_date= searchresult[0].getValue('date','systemnotes');
      //system_note_date = system_note_date.split(' ');
      //system_note_date = system_note_date[0];
      nlapiLogExecution("Debug","Date ( Action Needed ) From System Notes",system_note_date +" having cdp id " + cdpId);
    }
    if(temp_old_action_needed !='' && temp_old_action_needed!=null)
      temp_old_action_needed = Action_Needed_System_Notes_Old_Value(temp_old_action_needed);
    if(temp_new_action_needed!='' && temp_new_action_needed!= null)
      temp_new_action_needed = Action_Needed_System_Notes_New_Value(temp_new_action_needed);
    nlapiLogExecution("Debug","From System Notes convert Old Value(in string)(Action Needed) into old numeric value",temp_old_action_needed +" having cdp id " + cdpId);
    nlapiLogExecution("Debug","From System Notes convert New Value(in string)(Action Needed) into new numeric value",temp_new_action_needed +" having cdp id " + cdpId);
    return [temp_old_action_needed,temp_new_action_needed,system_note_date];
  }
  catch(ex)
  {
    nlapiLogExecution("Debug","Error in Action Needed Lib file",ex.message +" having cdp id " + cdpId);
  }
}
// Convert Action Needed old string value into numeric old value
function Action_Needed_System_Notes_Old_Value(temp_old_action_needed)
{
  temp_old_action_needed = temp_old_action_needed.split(',');
  var temp_old_action_needed_arr =[];
  for(var f=0; f<temp_old_action_needed.length; f++)
  {
    if(temp_old_action_needed[f].trim() == "New Message")
    {
      temp_old_action_needed_arr.push(1);
    }
    else if(temp_old_action_needed[f].trim() == "Confirmation Needed")
    {
      temp_old_action_needed_arr.push(2);
    }
    else if(temp_old_action_needed[f].trim() == "Ready to Ship" ||  temp_old_action_needed[f].trim() == "Ship")
    {
      temp_old_action_needed_arr.push(3);
    }
    else if(temp_old_action_needed[f].trim() == "Ready to Invoice")
    {
      temp_old_action_needed_arr.push(4);
    }
    else if(temp_old_action_needed[f].trim() == "Pending BE")
    {
      temp_old_action_needed_arr.push(5);
    }
    else if(temp_old_action_needed[f].trim() == "None")
    {
      temp_old_action_needed_arr.push(6);
    }
    else if(temp_old_action_needed[f].trim() == "Shipped")
    {
      temp_old_action_needed_arr.push(11);
    }
    else if(temp_old_action_needed[f].trim() == "Invoiced")
    {
      temp_old_action_needed_arr.push(12);
    }
    else if(temp_old_action_needed[f].trim() == "Certificate Required")
    {
      temp_old_action_needed_arr.push(14);
    }
  }
  return  temp_old_action_needed_arr ;
}
// Convert Action Needed new string value into numeric new value
function Action_Needed_System_Notes_New_Value(temp_new_action_needed)
{
  temp_new_action_needed = temp_new_action_needed.split(',');
  var temp_new_action_needed_arr =[];
  for(var f=0; f<temp_new_action_needed.length; f++)
  {
    if(temp_new_action_needed[f].trim() == "New Message")
    {
      temp_new_action_needed_arr.push(1);
    }
    else if(temp_new_action_needed[f].trim() == "Confirmation Needed")
    {
      temp_new_action_needed_arr.push(2);
    }
    else if(temp_new_action_needed[f].trim() == "Ready to Ship" || temp_new_action_needed[f].trim() == "Ship")
    {
      temp_new_action_needed_arr.push(3);
    }
    else if(temp_new_action_needed[f].trim() == "Ready to Invoice")
    {
      temp_new_action_needed_arr.push(4);
    }
    else if(temp_new_action_needed[f].trim() == "Pending BE")
    {
      temp_new_action_needed_arr.push(5);
    }
    else if(temp_new_action_needed[f].trim() == "None")
    {
      temp_new_action_needed_arr.push(6);
    }
    else if(temp_new_action_needed[f].trim() == "Shipped")
    {
      temp_new_action_needed_arr.push(11);
    }
    else if(temp_new_action_needed[f].trim() == "Invoiced")
    {
      temp_new_action_needed_arr.push(12);
    }
    else if(temp_new_action_needed[f].trim() == "Certificate Required")
    {
      temp_new_action_needed_arr.push(14);
    }
  }
  return  temp_new_action_needed_arr;
}