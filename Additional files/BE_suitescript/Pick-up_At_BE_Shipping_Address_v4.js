function setShippingAddress(type,name)
{
	if(name=="custbody53" || name=="custbody_pickup_location")
	{
		try
		{
			if(nlapiGetFieldValue("custbody53")=="T")
			{
				if(nlapiGetFieldValue("custbody_pickup_location")=="2")
				{
					//LA Pick-up
					nlapiSetFieldValue("shipaddressee","Pick-up at BE",false,true);
					nlapiSetFieldValue("shipaddr1","8787 Beverly Blvd.",false,true);
					nlapiSetFieldValue("shipaddr2","",false,true);
					nlapiSetFieldValue("shipcountry","US",false,true);
					nlapiSetFieldValue("shipcity","West Hollywood",false,true);
					nlapiSetFieldValue("shipstate","CA",false,true);
					nlapiSetFieldValue("shipzip","90048",false,true);
					nlapiSetFieldValue("shipaddress","Pick-up at BE\nLos Angeles, CA 90048\nUnited States",true,true);
					nlapiSetFieldValue("istaxable","T");
					//nlapiSetFieldValue("taxitem","1731050");
				}
				else if(nlapiGetFieldValue("custbody_pickup_location")=="1")
				{
					nlapiSetFieldValue("shipaddressee","Pick-up at BE",false,true);
					nlapiSetFieldValue("shipaddr1","",false,true);
					nlapiSetFieldValue("shipaddr2","",false,true);
					nlapiSetFieldValue("shipcountry","US",false,true);
					nlapiSetFieldValue("shipcity","San Francisco",false,true);
					nlapiSetFieldValue("shipstate","CA",false,true);
					nlapiSetFieldValue("shipzip","94108",false,true);
					nlapiSetFieldValue("shipaddress","Pick-up at BE\nSan Francisco, CA 94108\nUnited States",true,true);
					nlapiSetFieldValue("istaxable","T");
					nlapiSetFieldValue("taxitem","-178");
				}
				else if(nlapiGetFieldValue("custbody_pickup_location")=="3")
				{
					nlapiSetFieldValue("shipaddressee","Pick-up at BE",false,true);
					nlapiSetFieldValue("shipaddr1","",false,true);
					nlapiSetFieldValue("shipaddr2","",false,true);
					nlapiSetFieldValue("shipcountry","US",false,true);
					nlapiSetFieldValue("shipcity","Boston",false,true);
					nlapiSetFieldValue("shipstate","MA",false,true);
					nlapiSetFieldValue("shipzip","02116",false,true);
					nlapiSetFieldValue("shipaddress","Pick-up at BE\nBoston, MA 02116\nUnited States",true,true);
					nlapiSetFieldValue("istaxable","T");
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Pick-up Address","Details: " + err.message);
			return true;
		}
	}
}
