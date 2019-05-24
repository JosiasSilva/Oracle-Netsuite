function bulk_diamond_field_update(type,form)
{
	try
	{
		var get_id = nlapiGetRecordId();
		var obj = nlapiLookupField('purchaseorder',get_id,['status','vendor.custentity4']);
		var status = obj.status;
		var vendor = obj['vendor.custentity4'];
		nlapiLogExecution('debug','vendor',vendor);
		if((status == 'pendingReceipt'|| status =='partiallyReceived'|| status == 'pendingBillPartReceived') &&  vendor =='1')
		{
			var url = nlapiResolveURL("SUITELET","customscript_bulk_diamond_field_suitelet","customdeploy_bulk_diamond_field_suitelet")+ "&po_id=" + get_id ;
			form.addButton('custpage_button','Bulk Diamond Field Update',"window.open('" + url + "', 'purchord', 'location=no,menubar=yes,resizable=yes,scrollbars=yes,status=no,titlebar=yes,toolbar=yes,height=500,width=600')")
		}
	}
	catch(err)
	{
		nlapiLogExecution('error','Error While executing the code',err.message);
	}
}