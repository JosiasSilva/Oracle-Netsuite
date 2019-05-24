function Fixed_Cost_Field(type)
{
	if(type=="create" || type=="specialorder")
	{
		try
		{
			//Run for Unique New York and GM Casting House POs only
			var vendor = nlapiGetNewRecord().getFieldValue("entity");
			if(vendor=="153" || vendor=="7773")
			{
				var po = nlapiLoadRecord("purchaseorder",nlapiGetRecordId());
				for(var x=0; x < po.getLineItemCount("item"); x++)
				{
					var fixed_cost = "";
					if(vendor=="153")
						fixed_cost = nlapiLookupField("item",po.getLineItemValue("item","item",x+1),"custitem_fixed_cost");
					else
						fixed_cost = nlapiLookupField("item",po.getLineItemValue("item","item",x+1),"custitem_fixed_cost_usny");
						
					po.setLineItemValue("item","custcol_fixed_cost",x+1,fixed_cost);
				}
				nlapiSubmitRecord(po,true,true);
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Fixed Cost Field","Details: " + err.message);
			return true;
		}
	}
}
