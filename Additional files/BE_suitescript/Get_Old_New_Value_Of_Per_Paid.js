function get_old_new_value_of_per_paid(cdpId,temp_old_paid,temp_new_paid)
{
  try
  {
    var system_note_date_per_paid ='';
    var filter = new Array();
    var column = new Array();

    filter.push(new nlobjSearchFilter('field','systemnotes','anyof','CUSTRECORD_CUSTOM_DIAMOND_PERCENT_PAID'));
    filter.push(new nlobjSearchFilter('internalid',null,'anyof',cdpId));

    column.push(new nlobjSearchColumn('oldvalue','systemnotes'));
    column.push(new nlobjSearchColumn('newvalue','systemnotes'));
    column.push(new nlobjSearchColumn('date','systemnotes').setSort(true));
    var searchresult = nlapiSearchRecord("customrecord_custom_diamond",null,filter,column);
    nlapiLogExecution("debug","Search Result of % Paid(System Notes)",JSON.stringify(searchresult) + " having cdp id " + cdpId);
    if(searchresult)
    {
      var temp_old_paid = searchresult[0].getValue('oldvalue','systemnotes');
      nlapiLogExecution("Debug","Old Value (% Paid) From System Notes",temp_old_paid +" having cdp id " + cdpId);
      var temp_new_paid = searchresult[0].getValue('newvalue','systemnotes');
      nlapiLogExecution("Debug","New Value (% Paid) From System Notes",temp_new_paid +" having cdp id " + cdpId);
      system_note_date_per_paid= searchresult[0].getValue('date','systemnotes');
      //system_note_date_per_paid = system_note_date_per_paid.split(' ');
      //system_note_date_per_paid = system_note_date_per_paid[0];
      nlapiLogExecution("Debug","Date (% Paid) From System Notes",system_note_date_per_paid +" having cdp id " + cdpId);
    }
    return[temp_old_paid,temp_new_paid,system_note_date_per_paid];
  }
  catch(ex)
  {
    nlapiLogExecution("Debug","Error in % paid lib file", ex.message +" having cdp id " + cdpId);
  }
}