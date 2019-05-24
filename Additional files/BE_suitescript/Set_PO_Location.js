nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Set_PO_Location(type)
{
	if(type=="create" || type=="specialorder")
	{
		try
		{
			var location = nlapiGetFieldValue("location");
			if(location==null || location=="")
			{
				var sales_order = nlapiGetFieldValue("createdfrom");
				if(sales_order!=null && sales_order!="")
				{
					var item = nlapiGetLineItemValue("item","item",1);
					
					var soRec = nlapiLoadRecord("salesorder",sales_order);
					for(var x=0; x < soRec.getLineItemValue("item"); x++)
					{
						if(soRec.getLineItemValue("item","item",x+1)==item)
						{
							location = soRec.getLineItemValue("item","location",x+1);
							nlapiSetFieldValue("location",location);
							return true;
						}
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting PO Location","Details: " + err.message);
			return true;
		}
	}
}
