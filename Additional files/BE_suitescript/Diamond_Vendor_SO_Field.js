function Diamond_Vendor_SO_Field(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var diamondVendors = [];
			var soRec = nlapiLoadRecord("salesorder",nlapiGetRecordId());
			for(var x=0; x < soRec.getLineItemCount("item"); x++)
			{
				var item = soRec.getLineItemValue("item","item",x+1);
				if(nlapiLookupField("item",item,"custitem20")=="7")
				{
					diamondVendors.push(soRec.getLineItemValue("item","povendor",x+1));
				}
			}
			
			if(diamondVendors!=null && diamondVendors.length > 0)
			{
				soRec.setFieldValues("custbody_diamond_vendors",diamondVendors);
				nlapiSubmitRecord(soRec,false,true);
			}	
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting SO Diamond Vendors Field","Details: " + err.message);
			return true;
		}
	}
}

function Diamond_Vendor_SO_Field_Update(rec_type,rec_id)
{
	try
	{
		var diamondVendors = [];
		var soRec = nlapiLoadRecord(rec_type,rec_id);
		for(var x=0; x < soRec.getLineItemCount("item"); x++)
		{
			var item = soRec.getLineItemValue("item","item",x+1);
			if(nlapiLookupField("item",item,"custitem20")=="7")
			{
				diamondVendors.push(soRec.getLineItemValue("item","povendor",x+1));
			}
		}
		
		if(diamondVendors!=null && diamondVendors.length > 0)
		{
			soRec.setFieldValues("custbody_diamond_vendors",diamondVendors);
			nlapiSubmitRecord(soRec,false,true);
		}	
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Setting SO Diamond Vendors Field","Details: " + err.message);
		return true;
	}
}
