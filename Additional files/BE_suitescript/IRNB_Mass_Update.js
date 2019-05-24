nlapiLogExecution("audit","FLOStart",new Date().getTime());
function IRNB_Mass_Update_PO(rec_type,rec_id)
{
	try
	{
		var poRec = nlapiLoadRecord("purchaseorder",rec_id);
		
		for(var x=0; x < poRec.getLineItemCount("item"); x++)
		{
			//Set Match Bill To Receipt = Checked
			poRec.setLineItemValue("item","matchbilltoreceipt",x+1,"T");
		}
		
		nlapiSubmitRecord(poRec,true,true);
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating PO Match Bill to Receipt, PO ID: " + rec_id,"Details: " + err.message);
	}
}

function IRNB_Mass_Update_Item(rec_type,rec_id)
{
	try
	{
		var itemRec = nlapiLoadRecord(rec_type,rec_id);
		
		itemRec.setFieldValue("billpricevarianceacct","360"); //5030-03 Inventory Adjustment : Purchase Price Variance
		itemRec.setFieldValue("billqtyvarianceacct","364"); //5030-4 Cost of Goods Sold : Bill Quantity Variance
		
		nlapiSubmitRecord(itemRec,true,true);
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating Item Record Variance Accounts, Item ID: " + rec_id,"Details: " + err.message);
	}
}
