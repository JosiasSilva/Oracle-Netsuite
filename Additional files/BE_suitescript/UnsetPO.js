nlapiLogExecution("audit","FLOStart",new Date().getTime());
function UnsetPO(type,form)
{
  alert(form); alert(type);
  if( type == 'edit')
  {       
    nlapiLogExecution("DEBUG","Type :"+type);        
    //var objRetAuth = nlapiLoadRecord('returnauthorization', 4897454);
    var objRetAuth = nlapiLoadRecord('returnauthorization', nlapiGetRecordId());
    var createdFromId = objRetAuth.getFieldValue('createdfrom');
    var createdFrom = nlapiLookupField('returnauthorization',nlapiGetRecordId(),'createdfrom',true); 
    if( createdFrom != '' && createdFromId != null)
    {
      var objSO = nlapiLoadRecord('salesorder',createdFromId);
      var soItemCount = objSO.getLineItemCount('item');

      for(var i = 1; i <= soItemCount; i++)
      {
        var itemId = objSO.getLineItemValue('item','item',i);
        var itemType = objSO.getLineItemValue('item','itemtype',i);
        var poVendor = objSO.getLineItemValue('item','povendor',i);
        var poVendorName = objSO.getLineItemValue('item','povendor_display',i);
        var poId = objSO.getLineItemValue('item','createdpo',i);
        if( itemType == 'InvtPart')
        {
          var category = nlapiLookupField('inventoryitem',itemId,'custitem20',true); 
          if(category.indexOf('Setting with large center stone') != -1)
          {
            if( poVendor != null)
            {
              UpdatePurchaseOrder(poId,poVendor); // update purchase order
            }
          }
        }
      }
    }
  }
  return true;
}     
 

function UpdatePurchaseOrder(id,poVendor)
{
  var currentDateTime = new Date(); //today date
  var extendDate = new Date();
  var day = currentDateTime.getDay();
  if(day == 1 || day == 7)
  {       
    extendDate = nlapiDateToString(nlapiAddDays(currentDateTime, 4));  
  }
  else if(day > 1 && day <= 5)
  { 
    extendDate = nlapiDateToString(nlapiAddDays(currentDateTime, 6));  
  }
  else if(day == 6)
  {
    extendDate = nlapiDateToString(nlapiAddDays(currentDateTime, 5));  
  }       
  
  var objPO = nlapiLoadRecord('purchaseorder',id);
  objPO.setFieldValue('custbody59',extendDate);
  objPO.setFieldValue('entity',poVendor);
  var Id = nlapiSubmitRecord(objPO,true,true);
  nlapiLogExecution("debug","Date needed in SF :",extendDate);
  nlapiLogExecution("debug","Updated Purchase Order Id :",Id);
}




