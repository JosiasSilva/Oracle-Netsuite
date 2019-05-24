function Repair_Resize_Client(type,name)
{
	if(name=="custpage_pickup_at_be")
	{
		if(nlapiGetFieldValue("custpage_pickup_at_be")=="T")
		{
			//nlapiSetFieldValue("custpage_addressee","Pick-up at BE");
			nlapiSetFieldValue("custpage_address_1","Pick-up at BE");
			nlapiSetFieldValue("custpage_address_2","26 O'Farrell Street, Floor 10");
			nlapiSetFieldValue("custpage_city","San Francisco");
			nlapiSetFieldValue("custpage_state","CA");
			nlapiSetFieldValue("custpage_zip","94108");
			nlapiSetFieldValue("custpage_country","US");
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
		
		return true;
	}
	catch(err)
	{
		return true;
	}
}
