function SetReceiveItemLocation(type)
{   
    if( type == 'copy')
    { 
       try
      {  
         var transactionType = nlapiLookupField('transaction', nlapiGetFieldValue('createdfrom'), 'type'); 
         //if( transactionType != 'PurchOrd') 
         if( transactionType == 'RtnAuth') 
         {  
             var obj = nlapiLoadRecord('returnauthorization',nlapiGetFieldValue('createdfrom'));

            if(obj )
            {
              //count line item
              var count = obj.getLineItemCount('item');
              nlapiLogExecution("DEBUG","Total Item Count : "+ count);
              if( count > 0)
              {
                  for(var i=1; i<= count; i++) 
                  {
                       var itemId = obj.getLineItemValue('item','item',i);
                       var itemType = obj.getLineItemValue('item','itemtype',i);
                       if( itemType == 'InvtPart')
                       {
                          var itemObj = nlapiLoadRecord('inventoryitem',itemId);
                          var itemCategory = itemObj.getFieldValue('custitem20');
                
                          nlapiSelectLineItem('item',i);       

                          if(itemCategory ==1 || itemCategory==23 || itemCategory==30)
                          {           
                            nlapiSetCurrentLineItemValue('item','location',3,true,true);
                            nlapiSetCurrentLineItemValue('item','restock','F',true,true);         
                          }
                          else
                          {        
                            nlapiSetCurrentLineItemValue('item','location',2,true,true);      
                          }          
                            nlapiCommitLineItem('item'); 
                            /*
                               nlapiSelectLineItem('item',i);
                               nlapiSetCurrentLineItemValue('item','restock','F',true,true); 
                               nlapiCommitLineItem('item'); 
                            */
                      }
                  }
             }
         }
           var id = nlapiSubmitRecord(obj, true,true); 
           nlapiLogExecution("DEBUG","Received Return Authorization Id : "+ id); 
        }
      }
      catch(e)
      {
           alert("Error : " + e.message);
      }
   }
}



