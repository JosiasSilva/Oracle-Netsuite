nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Update_PO_Insurance_Cols(rec_type,rec_id)
{
	try
	{
		var filters = [];
		filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
		filters.push(new nlobjSearchFilter("internalid",null,"is",rec_id));
		filters.push(new nlobjSearchFilter("type","appliedtotransaction","is","SalesOrd"));
		var cols = [];
		cols.push(new nlobjSearchColumn("item"));
		cols.push(new nlobjSearchColumn("line"));
		cols.push(new nlobjSearchColumn("custcol_full_insurance_value","appliedtotransaction"));
		var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
		if(results)
		{
			var poRec = nlapiLoadRecord("purchaseorder",rec_id);
			
			for(var x=0; x < poRec.getLineItemCount("item"); x++)
			{
				for(var i=0; i < results.length; i++)
				{
					//nlapiLogExecution("debug","Line ID (PO)",poRec.getLineItemValue("item","line",x+1));
					//nlapiLogExecution("debug","Line ID (SS)",results[i].getValue("line"));
					if(poRec.getLineItemValue("item","line",x+1)==results[i].getValue("line"))
					{
						//nlapiLogExecution("debug","Setting Column Value","Value: " + results[i].getValue("custcol_full_insurance_value","appliedtotransaction"));
						poRec.setLineItemValue("item","custcol_full_insurance_value",x+1,results[i].getValue("custcol_full_insurance_value","appliedtotransaction"));
						break;
					}
				}
			}
			
			nlapiSubmitRecord(poRec,true,true);
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating PO Columns (Insurance Value)","Details: " + err.message);
		return true;
	}
}
