
function get_old_new_value_of_diamond_eta(cdpId,temp_old_diamond_eta,temp_new_diamond_eta)
{
  try
  {
    var system_note_date ='';
    var filter = new Array();
    var column = new Array();

    filter.push(new nlobjSearchFilter('field','systemnotes','anyof','CUSTRECORD_DIAMOND_ETA'));
    filter.push(new nlobjSearchFilter('internalid',null,'anyof',cdpId));

    column.push(new nlobjSearchColumn('oldvalue','systemnotes'));
    column.push(new nlobjSearchColumn('newvalue','systemnotes'));
    column.push(new nlobjSearchColumn('date','systemnotes').setSort(true));
    var searchresult = nlapiSearchRecord("customrecord_custom_diamond",null,filter,column);
    nlapiLogExecution("debug","Search Result of DIAMOND ETA(System Notes)",JSON.stringify(searchresult) + " having cdp id " + cdpId);
    if(searchresult) 
    {
      temp_old_diamond_eta = searchresult[0].getValue('oldvalue','systemnotes');
      nlapiLogExecution("Debug","Old Value (Portal Request Type) From System Notes (Diamond ETA)",temp_old_diamond_eta +" having cdp id " + cdpId);
      temp_new_diamond_eta = searchresult[0].getValue('newvalue','systemnotes');
      nlapiLogExecution("Debug","New Value (Portal Request Type) From System Notes (Diamond ETA)",temp_new_diamond_eta +" having cdp id " + cdpId);
      system_note_date= searchresult[0].getValue('date','systemnotes');
      //system_note_date = system_note_date.split(' ');
      //system_note_date = system_note_date[0];
      nlapiLogExecution("Debug","System Notes Date (Diamond ETA)",system_note_date +" having cdp id " + cdpId);
    }
   
    return [temp_old_diamond_eta,temp_new_diamond_eta,system_note_date];
  }
  catch(ex)
  {
    nlapiLogExecution("Debug","Error in Diamond ETA Lib File ",ex.message + " having cdp id " + cdpId);
  }
}
