nlapiLogExecution("audit","FLOStart",new Date().getTime());
function SetInventoryItem()
{
  if(type == 'create'  || type == 'edit')
  {
    nlapiLogExecution("DEBUG","Return Auth Id : " + nlapiGetRecordId());
    var obj = nlapiLoadRecord('returnauthorization',nlapiGetRecordId());
    var currentRepairResize = obj.getFieldValue('custbody142');
    var oldRepairResize = 0;
	
    if(type == 'edit')
    {
      //Get Previous Repair Resize value
      var ctx = nlapiGetContext();
      oldRepairResize = ctx.getSessionObject('oldRepairResize');
      nlapiLogExecution("DEBUG","Old Repair Resize value : "+ oldRepairResize);	
    }
    var count = obj.getLineItemCount('item');    
    nlapiLogExecution("DEBUG","Total Item Count : "+ count);

    for(var i = 1; i <= count; i++) 
    {           
      var itemId = obj.getLineItemValue('item','item',i);
      var itemType = obj.getLineItemValue('item','itemtype',i);
      if( itemType == 'InvtPart')
      {
         var itemObj = nlapiLoadRecord('inventoryitem',itemId);     
         var form = itemObj.getFieldValue('customform');
         var itemCategory = itemObj.getFieldValue('custitem20');
         if(form == 21 || form == 1)
         {
           
           if((currentRepairResize != oldRepairResize) && (currentRepairResize == 19))
           {
              UpdateInventoryItem(itemObj);
           } 
	   else if((currentRepairResize == oldRepairResize) && (currentRepairResize == 19))
	   {
	      nlapiLogExecution("DEBUG","No any syncing condition occur.");
	   }          
         }
      }                 
    }
  }
} // Main Function End

 //Function Update Inventory Item Page
 function UpdateInventoryItem(obj)
 {
    obj.setFieldValue('custitem179',1); 
    var Id = nlapiSubmitRecord(obj,true,true); 
    nlapiLogExecution("DEBUG","Updated Inventory Item : "+ Id); 
 }

 //Function to get old value
 function GetOldRepairResizeValue(type)
 {   
   if(type == 'edit')
   {
     nlapiLogExecution("DEBUG","Return Auth Id before submit : "+ nlapiGetRecordId());
     var oldRepairResize = nlapiLookupField('returnauthorization',nlapiGetRecordId(),'custbody142');              
     var ctx = nlapiGetContext();
     ctx.setSessionObject('oldRepairResize',oldRepairResize);     
   }
 }

