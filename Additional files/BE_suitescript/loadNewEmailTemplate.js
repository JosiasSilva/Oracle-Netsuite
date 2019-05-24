function loadNewEmailTemplate()
{
  var filters = new Array();
  var columns = new Array();
  filters.push(new nlobjSearchFilter('custrecord_internal_id',null,'isnot','0'));
  columns.push(new nlobjSearchColumn('custrecord_internal_id'));
  var searchResult = nlapiSearchRecord('customrecord_email_template_copy_record',null,filters,columns);
  if(searchResult!=null)
  {
    if(searchResult.length>0)
    {
      var newTempId = searchResult[0].getValue('custrecord_internal_id');
      if(newTempId!=0)
        return newTempId;
      else
        return 0;
    }
  }
  else
    return 0;
}