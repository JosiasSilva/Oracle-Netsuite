nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Change_Tracking(type,form)
{
  try
  {

    var record_type=nlapiGetRecordType ( ) ;

    if(record_type=='itemfulfillment')
    {
      if( type=='edit' || type=='create')
      {
        try
        {
          var search_cpr=nlapiSearchRecord('customrecord_custom_package_record',null,new nlobjSearchFilter('custrecord_if_link',null,'anyof',nlapiGetRecordId ( ) ));
          if(search_cpr)
          {
            for(var t=0;t<search_cpr.length;t++)
            {
              try{

                var falg_chk_apo_tracking=true; 
                if(nlapiGetFieldValue('custbody69'))
                {
                  nlapiSubmitField ( 'customrecord_custom_package_record' , search_cpr[t].getId() , 'custrecord_tracking_id' ,nlapiGetFieldValue('custbody69') ); 
                  falg_chk_apo_tracking=false;
                }
                else
                {
                  var load_if_record=nlapiLoadRecord('itemfulfillment',nlapiGetRecordId ( ) );
                  if(load_if_record.getLineItemCount('packagefedex')>0)
                  {
                    var get_pckage_tracking_no=load_if_record.getLineItemValue ('packagefedex','packagetrackingnumberfedex',1);
                    if(get_pckage_tracking_no)
                    {
                      nlapiSubmitField ( 'customrecord_custom_package_record' , search_cpr[t].getId() , 'custrecord_tracking_id' ,get_pckage_tracking_no ); 
                      falg_chk_apo_tracking=false;
                    }
                  }
                }

                if(nlapiGetFieldValue('custbody310') && falg_chk_apo_tracking)
                {
                  nlapiSubmitField ( 'customrecord_custom_package_record' , search_cpr[t].getId() , 'custrecord_tracking_id' ,nlapiGetFieldValue('custbody310') ); 
                }			

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

