function AfterSubmit(type)
{
 if(type=='edit')
 {
  var context = nlapiGetContext();
  var contextType = context.getExecutionContext();
  if(contextType=='userinterface')
  {
    var record_id=nlapiGetRecordId();

    var vendor_return_status=nlapiGetFieldValue('custrecord_vendor_return_status_invoice');
    nlapiLogExecution('debug','Status',vendor_return_status);
    var po_result=nlapiSearchRecord('purchaseorder',null,[new nlobjSearchFilter('mainline',null,'is','F'),
                                                          new nlobjSearchFilter('custcol_return_invoice',null,'anyOf',record_id)],new nlobjSearchColumn('item'));
    if(po_result)
    {
      for(var i=0;i<po_result.length;i++)
      {
        var item_id=po_result[i].getValue('item');
        nlapiSubmitField('inventoryitem',item_id,'custitem_vendor_return_status',vendor_return_status);
      }
    }
  }
 }

}
function beforeSubmit(type){
  if(type=='delete')
  {
    nlapiLogExecution('debug','type',type);
	
		var record_id=nlapiGetRecordId();

		//var vendor_return_status=nlapiGetFieldValue('custrecord_vendor_return_status_invoice');
		//nlapiLogExecution('debug','Status',vendor_return_status);
		var po_result=nlapiSearchRecord('purchaseorder',null,[new nlobjSearchFilter('mainline',null,'is','F'),
															  new nlobjSearchFilter('custcol_return_invoice',null,'anyOf',record_id)],new nlobjSearchColumn('item'));
		if(po_result)
		{
		  for(var i=0;i<po_result.length;i++)
		  {
			  nlapiLogExecution('debug','Item Id',po_result[i].getValue('item'));
			var item_id=po_result[i].getValue('item');
			 var po_id=po_result[i].getId();
			  var obj_po=nlapiLoadRecord('purchaseorder',po_id);
			  var items=obj_po.getLineItemCount('item');
			   for(var j=1;j<=items;j++)
			   {
					var itemId=obj_po.getLineItemValue('item','item',j);
					if(itemId==item_id)
					{
					  nlapiLogExecution('debug','Match PO Id',po_id);
					  obj_po.setLineItemValue('item','custcol_return_invoice',j,'');
					  nlapiSubmitRecord(obj_po,true,true);
					  break;
					}
				}
			nlapiSubmitField('inventoryitem',item_id,'custitem_vendor_return_status','');
		  }
		}

  }
}