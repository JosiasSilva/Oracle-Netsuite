function IF_Deletion(type)
{
	if(type=="delete")
	{
		try
		{
			var sales_order = nlapiGetOldRecord().getFieldValue("createdfrom");
			if(sales_order!=null && sales_order!="")
			{
				//Get sales order # (tranid)
				sales_order = nlapiLookupField("salesorder",sales_order,"tranid");
				
				//Search for inventory transfer with SO# in memo
				var filters = [];
				filters.push(new nlobjSearchFilter("memomain",null,"contains",sales_order));
				filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
				var cols = [];
				cols.push(new nlobjSearchColumn("memomain"));
				var results = nlapiSearchRecord("inventorytransfer",null,filters,cols);
				if(results)
				{
					for(var x=0; x < results.length; x++)
					{
						var memo = results[x].getValue("memomain");
						var index = memo.indexOf(sales_order);
						
						//Verify there is an exact match on order number to ensure we're not bringin up an order with a suffix like RP, EX, etc.
						if(sales_order.length + index == memo.length)
						{
							//Delete inventory transfer
							nlapiDeleteRecord("inventorytransfer",results[x].getId());
						}
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Deleting Inventory Transfer(s)","Details: " + err.message);
			return true;
		}
	}
}
