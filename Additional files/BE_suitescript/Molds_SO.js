function Molds_SO(type,form)
{
	if(type=="view" || type=="edit")
	{
		try
		{
			if(nlapiGetContext().getExecutionContext()!="userinterface")
				return true;
				
			for(var x=0; x < nlapiGetLineItemCount("item"); x++)
			{
				var molds = [];
				var item = nlapiGetLineItemValue("item","item",x+1);
				var vendor = nlapiGetLineItemValue("item","povendor",x+1);
				
				var parent = nlapiLookupField("item",item,"parent");
				if(parent==null || parent=="")
					continue;
				
				nlapiLogExecution("debug","PO Vendor",vendor);
				
				var filters = [];
				filters.push(new nlobjSearchFilter("custrecord_mold_item",null,"is",parent));
				filters.push(new nlobjSearchFilter("custrecord_mold_vendor",null,"is",vendor));
				var cols = [];
				cols.push(new nlobjSearchColumn("name"));
				var results = nlapiSearchRecord("customrecord_mold",null,filters,cols);
				if(results)
				{
					for(var i=0; i < results.length; i++)
					{
						molds.push(results[i].getValue("name"));
					}
					nlapiLogExecution("debug","Molds",molds.join("\n"));
					nlapiSetLineItemValue("item","custcol_molds_so",x+1,molds.join("\n"));
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Molds On SO","Details: " + err.message);
			return true;
		}
	}
}
