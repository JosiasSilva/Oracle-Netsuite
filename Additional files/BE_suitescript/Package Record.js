nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Check_Traking_number()
{

  var tracking_id=nlapiGetFieldValue('custrecord_tracking_id');
  if(nlapiGetFieldValue('custrecord_droup_off')=='2' ||  !nlapiGetFieldValue('custrecord_droup_off'))
  {
    if(!tracking_id)
    {
      alert('Please enter value(s) for : TRACKING ID');
      return false;
    }

  }
  if(tracking_id)
  {
    var ck_duplcate= Check_Duplicate_Tracking(tracking_id);
    if(ck_duplcate)
    {
      alert('Duplicate Trcking id '+tracking_id);
      return false;
    }
  }
  return true;

}


function Check_Duplicate_Tracking(tracking_id)
{
  var filter=[];
  filter.push(new nlobjSearchFilter('custrecord_tracking_id',null,'is',tracking_id));
  if(nlapiGetRecordId ( ) )
  {
    filter.push(new nlobjSearchFilter('internalid',null,'noneof',nlapiGetRecordId ( ) ));
  }
  var check_dulicate =nlapiSearchRecord('customrecord_custom_package_record',null,filter);

  if(check_dulicate)
  {
    return true;
  }
  return false;
}







function Received_by(type,name)
{
  if(name=='custrecord_received')
  {
    if(nlapiGetFieldValue('custrecord_received')=='T' )
    {
      nlapiSetFieldValue('custrecord_received_by',nlapiGetUser ( ) );
    }
    else
    {
      nlapiSetFieldValue('custrecord_received_by','');
    }
  }
  return true;
}