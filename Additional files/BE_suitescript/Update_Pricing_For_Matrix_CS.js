nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Update_Matrix_Pricing_CS_SR()
{
	try
	{
		//Check if there is an eternity pricing fields set. If so, make sure box is checked, otherwise, alert user.
		var isEternity = nlapiGetFieldValue("custpage_variable_eternity_ring_pricing");
		if(isEternity=="F")
		{
			var alertMsg = false;
			
			for(var x=3; x <= 9; x++)
			{
				var size = x.toString();
				size = size.replace(".","");
				
				if(nlapiGetFieldValue("custpage_platinum_price_" + size)!=null && nlapiGetFieldValue("custpage_platinum_price_" + size)!="")
				{
					alertMsg = true;
					break;
				}
				if(nlapiGetFieldValue("custpage_18ky_price_" + size)!=null && nlapiGetFieldValue("custpage_18ky_price_" + size)!="")
				{
					alertMsg = true;
					break;
				}
				if(nlapiGetFieldValue("custpage_18kw_price_" + size)!=null && nlapiGetFieldValue("custpage_18kw_price_" + size)!="")
				{
					alertMsg = true;
					break;
				}
				if(nlapiGetFieldValue("custpage_14kr_price_" + size)!=null && nlapiGetFieldValue("custpage_14kr_price_" + size)!="")
				{
					alertMsg = true;
					break;
				}
				if(nlapiGetFieldValue("custpage_palladium_price_" + size)!=null && nlapiGetFieldValue("custpage_palladium_price_" + size)!="")
				{
					alertMsg = true;
					break;
				}
				
				x = x - 0.5;
			}
			
			if(alertMsg==true)
			{
				var proceed = confirm("You have entered pricing information in the eternity section but have not checked the checkbox to use eternity pricing. Are you sure you wish to proceed?");
				return proceed;
			}
		}
		
		return true;
	}
	catch(err)
	{
		return true;
	}
}
