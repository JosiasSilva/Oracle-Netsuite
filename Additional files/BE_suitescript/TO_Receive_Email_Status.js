nlapiLogExecution("audit","FLOStart",new Date().getTime());
function TO_Receive_Email_Status(type)
{
	if(type=="create")
	{
		try
		{
			var receiptId = nlapiGetRecordId();
			var createdFrom = nlapiGetNewRecord().getFieldValue("createdfrom");
			
			var filters = [];
			filters.push(new nlobjSearchFilter("internalid",null,"is",createdFrom));
			filters.push(new nlobjSearchFilter("custcol_linked_item_fulfillment",null,"noneof","@NONE@"));
			filters.push(new nlobjSearchFilter("custbody89","custcol_linked_item_fulfillment","is","7")); //In Transit
			var cols = [];
			cols.push(new nlobjSearchColumn("internalid","custcol_linked_item_fulfillment","group").setSort(true));
			var results = nlapiSearchRecord("transferorder",null,filters,cols);
			if(results)
			{
				for(var x=0; x < results.length; x++)
				{
					nlapiSubmitField("itemfulfillment",results[x].getValue("internalid","custcol_linked_item_fulfillment","group"),"custbody89","1");
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Updating IF Email Conf Status to To Be Emailed","Details: " + err.message);
		}
	}
}
