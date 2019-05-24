nlapiLogExecution("audit","FLOStart",new Date().getTime());
function EstateResizePurchaseOrders()
{
  nlapiLogExecution("debug","Sales Order Id : ",nlapiGetRecordId());
  var salesObj = nlapiLoadRecord('salesorder',nlapiGetRecordId());
  var count = salesObj.getLineItemCount('item');
  nlapiLogExecution("debug","Total line item count : ",count);
  var insuranceVal = 0; var desc = ''; var resizeDesc = ''; var descVal='';
  if(count > 0)
  {
    for(var i=1; i<= count; i++)
    {
      var itemId = salesObj.getLineItemValue('item','item',i);
      var itemType = salesObj.getLineItemValue('item','itemtype',i);
      if( itemType == 'InvtPart')
      {
        var itemCategory = nlapiLookupField('inventoryitem',itemId,'custitem20'); 
        var itemName = nlapiLookupField('inventoryitem',itemId,'itemid');
        if(itemCategory == 24 && itemName != 'Resize Ring')
        {
          insuranceVal = salesObj.getLineItemValue('item','custcol_full_insurance_value',i);
          descVal = salesObj.getLineItemValue('item','description',i);
          if(descVal != null)
          {
            desc = salesObj.getLineItemValue('item','description',i).split(',')[0];
          }
        }
        else if(itemName == 'Resize Ring')
        { 
          var resizeArr = new Array(); var lastValArr = new Array(); var resizeVal = '';
          var resizeItemDesc = ''; var note = '';
          resizeVal = salesObj.getLineItemValue('item','description',i);

          if(resizeVal != null)
          {
            resizeArr = resizeVal.split(',');
            lastValArr = resizeArr[resizeArr.length - 1].split(' ');
            resizeDesc = lastValArr[lastValArr.length - 1];
          }
          
          if(desc != '' && resizeDesc != '')
          {
            resizeItemDesc = desc +', Resize to Size'+' '+resizeDesc;
            note = 'Resize to Size'+' '+resizeDesc;
          }
          else if(desc != '' && resizeDesc == '')
          {
            resizeItemDesc = desc;
          }
          
          var poId = salesObj.getLineItemValue('item','createdpo',i);
          if(poId != null)
          {
             UpdatePOLineItem(poId,insuranceVal,resizeItemDesc,note,itemId);
          }          
        }
      }
    }
  }
} //Main function end

function UpdatePOLineItem(poId,insuranceVal,resizeItemDesc,note,itemId)
{
  var poObj = nlapiLoadRecord('purchaseorder',poId);
  var count = poObj.getLineItemCount('item');
  nlapiLogExecution("debug","Total line item count : ",count);
  if(count > 0)
  {
    for(var i=1; i <= count; i++)
    {
      var poItemId = poObj.getLineItemValue('item','item',i);
      if(poItemId == itemId)
      {          
        poObj.setLineItemValue('item','custcol_full_insurance_value',i,insuranceVal);
        poObj.setLineItemValue('item','description',i,resizeItemDesc);
        poObj.setLineItemValue('item','custcol5',i,note);     
      }
    }
  }
  var id = nlapiSubmitRecord(poObj, true,true); 
  nlapiLogExecution("DEBUG","Updated Resize Item of Purchase Order : "+ id); 
}


