function SetRefundItemLocation(type)
{   
    if( type == 'copy')
    {
        try
        {            
            var transactionType = nlapiLookupField('transaction', nlapiGetFieldValue('createdfrom'), 'type'); 
            if(transactionType == 'RtnAuth')
           {
               var obj = nlapiLoadRecord('returnauthorization',nlapiGetFieldValue('createdfrom'));           
               if(obj)
               {
                 var salesrep = obj.getFieldValue('salesrep');
                 //obj.setFieldValue('customform',118);
      
                 if(salesrep != null || salesrep != '')
                 {
                      var empObj = nlapiLoadRecord('employee',salesrep);
                      var invtLocation = empObj.getFieldValue('location');         
                      obj.setFieldValue('location',invtLocation);
                 }
                else
                {         
                     obj.setFieldValue('location',2);
                }      
                var id = nlapiSubmitRecord(obj, true,true); 
                nlapiLogExecution("DEBUG","Refund Return Authorization Id : "+ id); 
            }
         }
      }
      catch(e)
      {
           alert("Error: " + e.message);
      }
   }
}




