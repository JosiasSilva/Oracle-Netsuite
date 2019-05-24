nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Change_Tracking(type,form)
{
  try
  {

    var record_type=nlapiGetRecordType ( ) ;

    if(record_type=='itemfulfillment')
    {
      if( type=='edit')
      {
        try
        {
          var search_cpr=nlapiSearchRecord('customrecord_custom_package_record',null,new nlobjSearchFilter('custrecord_if_link',null,'anyof',nlapiGetRecordId ( ) ));
          if(search_cpr)
          {
            for(var t=0;t<search_cpr.length;t++)
            {
              try{
                nlapiSubmitField ( 'customrecord_custom_package_record' , search_cpr[t].getId() , 'custrecord_tracking_id' ,nlapiGetFieldValue('custbody69') ); 
              }
              catch(er){}
            }
          } 
        }
        catch(er)
        {
          nlapiLogExecution ( 'debug' , 'error' , er.message ); 
        }
      }
    }
    else
    {
      Tracking_Update(type,form);
    }
  }
  catch(er){}
}
function beforeSubmit(type,form)
{
  try
  {
    var record_type=nlapiGetRecordType ( ) ;
    if(record_type=='itemfulfillment')
    {
      var CPRs=nlapiSearchRecord('customrecord_custom_package_record',null,new nlobjSearchFilter('custrecord_if_link',null,'anyof',nlapiGetRecordId()));
      if(CPRs)
      {
        if(type=='delete')
        {
          for(var i=0;i<CPRs.length;i++)
          {
            nlapiDeleteRecord('customrecord_custom_package_record',CPRs[i].getId());
          }
        }
      }
    }
  }
  catch(er){}
}



function Tracking_Update(type,form)
{
  try
  {
    var type_interface= nlapiGetContext().getExecutionContext() ;
    nlapiLogExecution ( 'debug' , 'type' ,type ); 
    if(type_interface=='userinterface' )
    {
      if(type=='edit')
      {

        var lookup_value=nlapiLookupField ( nlapiGetRecordType ( )  , nlapiGetRecordId ( )  , 'custbody123') ;
        if(lookup_value)
        {
          nlapiLogExecution ( 'debug' ,'lookup_value',lookup_value) 
          var search_cust=nlapiSearchRecord('customrecord_custom_package_record',null,          
                                            new nlobjSearchFilter('custrecord_transaction_record',null,'anyof',nlapiGetRecordId ( )),
                                            new nlobjSearchColumn('custrecord_cpr_direction'));
          if(search_cust )
          {
            if(search_cust[0].getValue('custrecord_cpr_direction')=='2')
            {
              nlapiSubmitField ( 'customrecord_custom_package_record' , search_cust[0].getId() , 'custrecord_tracking_id' , lookup_value ) ;
            }
          }
        }
      }
    }
  }
  catch(er){ nlapiLogExecution ( 'debug' ,'er',er.message); }
}

