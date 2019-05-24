nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Repair_Resize_Client(type,name)
{
	if(name=="custpage_pickup_at_be" || name=="custpage_pickup_location")
	{
		if(nlapiGetFieldValue("custpage_pickup_at_be")=="T" && nlapiGetFieldValue("custpage_pickup_location")!=null && nlapiGetFieldValue("custpage_pickup_location")!="")
		{
			switch(nlapiGetFieldValue("custpage_pickup_location"))
			{
				case "1": //San Francisco
					nlapiSetFieldValue("custpage_address_1","Pick-up at BE");
					nlapiSetFieldValue("custpage_address_2","26 O'Farrell Street, Floor 10");
					nlapiSetFieldValue("custpage_city","San Francisco");
					nlapiSetFieldValue("custpage_state","CA");
					nlapiSetFieldValue("custpage_zip","94108");
					nlapiSetFieldValue("custpage_country","US");
					break;
				case "2": //Los Angeles
					nlapiSetFieldValue("custpage_address_1","Pick-up at BE");
					nlapiSetFieldValue("custpage_address_2","8787 Beverly Blvd., Ste 206");
					nlapiSetFieldValue("custpage_city","West Hollywood");
					nlapiSetFieldValue("custpage_state","CA");
					nlapiSetFieldValue("custpage_zip","90048");
					nlapiSetFieldValue("custpage_country","US");
					break;
				case "3": //Boston
					nlapiSetFieldValue("custpage_address_1","Pick-up at BE");
					nlapiSetFieldValue("custpage_address_2","38 Newbury St, Ste 603");
					nlapiSetFieldValue("custpage_city","Boston");
					nlapiSetFieldValue("custpage_state","MA");
					nlapiSetFieldValue("custpage_zip","02116");
					nlapiSetFieldValue("custpage_country","US");
					break;
				case "4": //Chicago
					nlapiSetFieldValue("custpage_address_1","Pick-up at BE");
					nlapiSetFieldValue("custpage_address_2","34 East Oak St, 2nd Fl");
					nlapiSetFieldValue("custpage_city","Chicago");
					nlapiSetFieldValue("custpage_state","IL");
					nlapiSetFieldValue("custpage_zip","60611");
					nlapiSetFieldValue("custpage_country","US");
					break;
			}
		}
	}
}

function Repair_Resize_Client_SR()
{
	try
	{
		if(nlapiGetFieldValue("custpage_date_received_at_be")!=null && nlapiGetFieldValue("custpage_date_received_at_be")!="" && (nlapiGetFieldValue("custpage_location_received_at_be")==null || nlapiGetFieldValue("custpage_location_received_at_be")==""))
		{
			alert("Please select Location Received at BE from Customer.");
			return false;
		}
		
		var items = nlapiGetFieldValues("custpage_items");
		if(items.length > 1)
		{
			if(nlapiGetField("custpage_price_2")!=null && nlapiGetField("custpage_price_2")!="" && (nlapiGetFieldValue("custpage_price_2")==null || nlapiGetFieldValue("custpage_price_2")==""))
			{
				alert("Please fill in Price 2 field when selecting more than one item.");
				return false;
			}
		}
		
		return true;
	}
	catch(err)
	{
		return true;
	}
}
