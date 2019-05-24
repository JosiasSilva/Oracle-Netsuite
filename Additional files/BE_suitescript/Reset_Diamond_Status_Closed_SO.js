nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Reset_Diamond_Status_Closed_SO(type)
{
	nlapiLogExecution("debug","Type",type);
	if(type=="edit" || type=="cancel")
	{
		try
		{
			var orderRec = nlapiLoadRecord("salesorder",nlapiGetRecordId());
			var orderStatus = orderRec.getFieldValue("orderstatus");
			var oldStatus = nlapiGetOldRecord().getFieldValue("orderstatus");
			
			nlapiLogExecution("debug","Order Status (New)",orderStatus);
			nlapiLogExecution("debug","Order Status (Old)",oldStatus);
			
			if((orderStatus=="C" || orderStatus=="H") && orderStatus!=oldStatus)
			{
				var order = nlapiGetNewRecord();
				var orderID = nlapiGetRecordId();
				
				//Find all CDP records related to this sales order and clear the status on them
				var filters = [];
				filters.push(new nlobjSearchFilter("custrecord_diamond_so_order_number",null,"is",orderID));
				var cols = [];
				cols.push(new nlobjSearchColumn("custrecord_be_diamond_stock_number"));
				var results = nlapiSearchRecord("customrecord_custom_diamond",null,filters,cols);
				if(results)
				{
					for(var x=0; x < results.length; x++)
					{
						//Clear field DO NOT USE Status (item)
						nlapiSubmitField("inventoryitem",results[x].getValue("custitem97"),"");
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Clearing Diamond Field on Closed SO","Details: " + err.message);
			return true;
		}
	}
}
