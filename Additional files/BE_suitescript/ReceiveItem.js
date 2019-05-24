function SetReceiveItemLocation(type)
{
nlapiLogExecution("DEBUG","Type : "+ type);

 if(type=='view')
 {
   var obj = nlapiLoadRecord('returnauthorization',nlapiGetRecordId());
   var count = obj.getLineItemCount('item');

   nlapiLogExecution("DEBUG","Total Item Count : "+ count);
   if( count > 0)
   {
      for(var i = 1; i <= count; i++) 
      {          
        var itemId = obj.getLineItemValue('item','item',i);
        var itemObj = nlapiLoadRecord('inventoryitem',itemId);
        var itemCategory = itemObj.getFieldValue('custitem20');
        if(itemCategory ==1 || itemCategory==23 || itemCategory==30)
        {         
           //obj.setLineItemValue('item','location',i,'3');
           //obj.setLineItemValue('item','restock',i,'F');   
             obj.setCurrentLineItemValue('item','location',3);
             obj.setCurrentLineItemValue('item','restock','F');
        }
        else
        {        
           //obj.setLineItemValue('item','location',i,'2');         
           obj.setCurrentLineItemValue('item','location,2);
        }
        nlapiCommitLineItem('item');
        var id = nlapiSubmitRecord(obj, true,true); 
        nlapiLogExecution("DEBUG","Received Return Authorization Id : "+ id);         
      }
    }
  }
}



