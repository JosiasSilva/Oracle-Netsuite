nlapiLogExecution("audit","FLOStart",new Date().getTime());
function SetGemStoneStsBlank_AfterVRAFF(type)
{
nlapiLogExecution("debug","Record Type :",type);
if(type=="create" || type=="edit")
{  
 try
 {     
   var itemshipId=nlapiGetRecordId();
    var itemshipObj=nlapiLoadRecord('itemfulfillment',itemshipId)  
    var vrAuthId=itemshipObj.getFieldValue('createdfrom'); 
   // var vrAuthId=4995246 //4978462
    var vrObj=nlapiLoadRecord('vendorreturnauthorization',vrAuthId);    
    var recordType =nlapiLookupField('vendorreturnauthorization',vrAuthId,'recordType'); 
    
    nlapiLogExecution("debug", "return VRAuth Id: " + vrAuthId+ ',VR Type:  ' + recordType);

    if(recordType=='vendorreturnauthorization')
    {
       
       var countLink=vrObj.getLineItemCount('links');
       var shipStatus='';
       for(k=1;k<=countLink;k++)
       {
         var linkId = vrObj.getLineItemValue('links','id',k);
         shipStatus =  vrObj.getLineItemValue('links','status',k);
       }
       //var count=vrObj.getLineItemCount('item');
       var count=itemshipObj.getLineItemCount('item');
       for(i=1;i<=count;i++)
       {  
        
          var itemId = itemshipObj.getLineItemValue('item','item',i);        
          var invItemId = itemId ;
          var itemType=itemshipObj.getLineItemValue('item','itemtype',i);

         // nlapiLogExecution("debug", "item Id: " + itemId + ", invItemId :"+invItemId +",itemType:  " + itemType);
              if(itemType=='InvtPart')
              {
                nlapiLogExecution("debug", "Id: " + invItemId + ',Event Type :  ' + type);
                var invItemObj=nlapiLoadRecord('inventoryitem',invItemId); //live -2633200,  627839 
                var itemCategory=invItemObj.getFieldValue('custitem20');
                var gemstoneStatus =invItemObj.getFieldValue('custitem40');
                var itemType=invItemObj.getFieldValue('itemtype');
                var baseRecordType=invItemObj.getFieldValue('baserecordtype');
                if(baseRecordType=='inventoryitem')
                {
                  var setGemstoneId="";
                   if(itemCategory=='7' && shipStatus =='Shipped') 
                   {
                      setGemstoneId="";
                      nlapiSetFieldValue('custitem40',setGemstoneId);    			                     
                      nlapiSubmitField('inventoryitem',invItemId,'custitem40', setGemstoneId);
                      nlapiLogExecution("debug", "Item Status Updated Successfully", "inventoryItemId: " + invItemId+", setGemstoneId:"+setGemstoneId)
                   }
                }//end check of baseRecordType 
              }
       }//end of loop
    }//end check of recordType
    var k=0;
 }
 catch(err)
 {	
    nlapiLogExecution("error", "VRA Gemstone Status Error", "Error on sales order: " + err.toString());
   return true;
 }
}
}