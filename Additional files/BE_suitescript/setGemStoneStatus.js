nlapiLogExecution("audit","FLOStart",new Date().getTime());
function setGemStoneStatus(type)
{

if(type=="create" || type=="edit" || type=="receive")
    {
      var retAuthId=nlapiGetRecordId();
       // var retAuthId=5073653
        var retAuthObj=nlapiLoadRecord("returnauthorization",retAuthId);        
        var retAuthType= nlapiLookupField('returnauthorization',retAuthId,'type');
        nlapiLogExecution("debug", "return Auth Id: " + retAuthId+ ',return Auth Type:  ' + retAuthType);
        if(retAuthType=='RtnAuth')
        {
         try
         {
           var count=retAuthObj.getLineItemCount('item');
           for(i=1;i<=count;i++)
           {        
          
              var itemId = retAuthObj.getLineItemValue('item','item',i);          
              var invItemId = retAuthObj.getLineItemValue('item','olditemid',i);
              var itemType=retAuthObj.getLineItemValue('item','itemtype',i);
              nlapiLogExecution("debug", "item Id: " + itemId + ", invItemId :"+invItemId +",itemType:  " + itemType);
              // var invItemId=2392551;
              if(itemType=='InvtPart')
              {
                //nlapiLogExecution("debug", "Id: " + invItemId + ',Event Type :  ' + type);
                var invItemObj=nlapiLoadRecord('inventoryitem',invItemId); //live -2633200,  627839 
                var itemCategory=invItemObj.getFieldValue('custitem20');
                var gemstoneStatus =invItemObj.getFieldValue('custitem40');
                var itemType=invItemObj.getFieldValue('itemtype');
                var baseRecordType=invItemObj.getFieldValue('baserecordtype');
                if(baseRecordType=='inventoryitem')
                {
                   var setGemstoneId=0
                   if(itemCategory=='7' && gemstoneStatus!='1') 
                   {
                      setGemstoneId=4;
                      nlapiSetFieldValue('custitem40',setGemstoneId);    			                     
                      nlapiSubmitField('inventoryitem',invItemId,'custitem40', setGemstoneId);
                   nlapiLogExecution("debug", "Item Status Updated Successfully", "inventoryItemId: " + invItemId+",                    setGemstoneId:"+setGemstoneId)
                   }
               }
             } //end check of itemType
          }// end of for loop
       }
      catch(err)
       { 
       nlapiLogExecution("error", "Return Authorization Set Gem Stone Status", "Error : " + err.toString());
          return true;
       }
  }// end check or return type authorization
 } // end of if 

}