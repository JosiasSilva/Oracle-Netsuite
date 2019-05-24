nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Fixed_Cost_Field_CS_PS(type,name,linenum)
{
	if(name=="entity")
	{
		//Handle changing of vendor on PO
		try
		{
			var vendor = nlapiGetFieldValue("entity");
			if(vendor=="153" || vendor=="7773")
			{
				for(var x=0; x < nlapiGetLineItemCount("item"); x++)
				{
					var fixed_cost = "";
					if(vendor=="153")
						fixed_cost = nlapiLookupField("item",nlapiGetLineItemValue("item","item",x+1),"custitem_fixed_cost");
					else
						fixed_cost = nlapiLookupField("item",nlapiGetLineItemValue("item","item",x+1),"custitem_fixed_cost_usny");
						
					nlapiSelectLineItem("item",x+1);
					nlapiSetCurrentLineItemValue("item","custcol_fixed_cost",fixed_cost);
					nlapiCommitLineItem("item");
				}
			}
		}
		catch(err)
		{
			
		}
	}
	else if(type=="item" && name=="item")
	{
		//Handle changing of new line item or item change
		try
		{
			var vendor = nlapiGetFieldValue("entity");
			if(vendor=="153" || vendor=="7773")
			{
				var fixed_cost = "";
				if(vendor=="153")
					fixed_cost = nlapiLookupField("item",nlapiGetLineItemValue("item","item",x+1),"custitem_fixed_cost");
				else
					fixed_cost = nlapiLookupField("item",nlapiGetLineItemValue("item","item",x+1),"custitem_fixed_cost_usny");
					
				nlapiSetCurrentLineItemValue("item","custcol_fixed_cost",fixed_cost,false,true);
			}
		}
		catch(err)
		{
			
		}
	}
}
