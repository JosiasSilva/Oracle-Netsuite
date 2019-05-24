nlapiLogExecution("audit","FLOStart",new Date().getTime());
function EmailMessage(type,form)
{
  try
  {
   if( type == 'create')
   {
   //var id =form['main_form'].elements['id'].value;
   //nlapiLogExecution("debug","id : ",id);
   var params = request.getAllParameters();
   var transaction_internal_id = params['transaction'];
   var customer_internal_id = params['entity'];
   nlapiLogExecution("debug","transaction id : ",transaction_internal_id);
   nlapiLogExecution("debug","customer id : ",customer_internal_id);
   nlapiLogExecution("debug","event type : ",type);
   
   if( transaction_internal_id != null )
   {
      //validating transaction type
      var type = nlapiLookupField('transaction', transaction_internal_id, 'type');

      //loading the current record selected
      var cust_email = nlapiLookupField('transaction', transaction_internal_id, 'custbody2');  
      var default_cust_email = nlapiLookupField('customer', customer_internal_id, 'email');
 
      //validation if the transaction is equal to Sales Order
      if(type =='SalesOrd')
      { 
        if(cust_email == '')
        {
          //nlapiSetFieldValue('recipient', customer_internal_id);
          nlapiSetFieldValue('recipientemail',default_cust_email);
        }
        else
        {    
          nlapiSetFieldValue('recipientemail',cust_email);
          nlapiSetFieldValue('recipient', '');
        }
      }
    }
    else if( customer_internal_id != null )
    {
       //validating transaction type
       var type = nlapiLookupField('customer', customer_internal_id, 'recordType');
       nlapiLogExecution("debug","customer type : ",type);
       
          if( type == 'customer')
          {
           //loading the current record selected
           var default_cust_email = nlapiLookupField('customer', customer_internal_id, 'email');
           nlapiLogExecution("debug","customer email : ",default_cust_email);
         }
      }
    }
  }
  catch(e)
  {
      nlapiLogExecution("error","error to generate email : ",e.message);
  }
}




