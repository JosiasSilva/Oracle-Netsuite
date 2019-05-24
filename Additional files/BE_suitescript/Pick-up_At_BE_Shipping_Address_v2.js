function setShippingAddress(type,name)
{
	if(name=="custbody53")
	{
		try
		{
			if(nlapiGetFieldValue("custbody53")=="T")
			{
				nlapiSetFieldValue("shipaddressee","Pick-up at BE");
				nlapiSetFieldValue("shipaddr1","");
				nlapiSetFieldValue("shipaddr2","");
				nlapiSetFieldValue("shipcountry","US");
				nlapiSetFieldValue("shipcity","San Francisco");
				nlapiSetFieldValue("shipstate","CA");
				nlapiSetFieldValue("shipzip","94108");
				nlapiSetFieldValue("shipaddress","Pick-up at BE\nSan Francisco, CA 94108,\nUnited States");
				nlapiSetFieldValue("istaxable","T");
				nlapiSetFieldValue("taxitem","-178");
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Pick-up Address","Details: " + err.message);
			return true;
		}
	}
}