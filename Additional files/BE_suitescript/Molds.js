function updateMolds(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var items = [];
			
			var filters = [];
			filters.push(new nlobjSearchFilter("internalid",null,"is",nlapiGetRecordId()));
			filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
			filters.push(new nlobjSearchFilter("custcol17",null,"isnotempty"));
			var cols = [];
			cols.push(new nlobjSearchColumn("item",null,"group"));
			var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
			if(results)
			{
				for(var x=0; x < results.length; x++)
					items.push(results[x].getValue("item",null,"group"));
			}
			
			if(items && items.length > 0)
			{
				var filters = [];
				filters.push(new nlobjSearchFilter("item",null,"anyof",items));
				filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
				filters.push(new nlobjSearchFilter("custcol17",null,"isnotempty"));
				var cols = [];
				cols.push(new nlobjSearchColumn("item",null,"group"));
				cols.push(new nlobjSearchColumn("custcol17",null,"group"));
				var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
				if(results)
				{
					
				}
			}
		}
		catch(err)
		{
			
		}
	}
	if(type=="delete")
	{
		
	}
}
