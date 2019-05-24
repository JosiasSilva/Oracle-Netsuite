nlapiLogExecution("audit","FLOStart",new Date().getTime());
function SetRepairResize()
{       
	var obj = nlapiLoadRecord('returnauthorization',nlapiGetRecordId());
	var count = obj.getLineItemCount('item');
        var match = 0;
	nlapiLogExecution("DEBUG","Total Item Count : "+ count); 

	  for(var i = 1; i <= count; i++) 
	   {           
	      var itemId = obj.getLineItemValue('item','item',i);
              var itemType = obj.getLineItemValue('item','itemtype',i);
              if( itemType == 'InvtPart')
              {
		var itemObj = nlapiLoadRecord('inventoryitem',itemId);
		var itemCategory = itemObj.getFieldValue('custitem20');
		if(itemCategory == 1 || itemCategory==3 || itemCategory==4 || itemCategory==5 || itemCategory==23 || itemCategory==30)
		{
		   match = match+1;                           
		}
              }                 
	   }   
	   if(match==count)
	   {
		  obj.setFieldValue('custbody142',''); 
	   }
	   else
	   {
		  obj.setFieldValue('custbody142',15);
	   }    
   var id = nlapiSubmitRecord(obj, true,true); 
   nlapiLogExecution("DEBUG","Updated Return authorization Id : "+ id);
}