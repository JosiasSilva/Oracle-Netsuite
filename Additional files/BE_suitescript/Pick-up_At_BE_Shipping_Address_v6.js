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
					nlapiSetFieldValue("shipaddressee","Brilliant Earth Showroom",false,true);
					nlapiSetFieldValue("shipaddr1","8797 Beverly Blvd., Ste 206",false,true);
					nlapiSetFieldValue("shipaddr2","",false,true);
					nlapiSetFieldValue("shipcountry","US",false,true);
					nlapiSetFieldValue("shipcity","West Hollywood",false,true);
					nlapiSetFieldValue("shipstate","CA",false,true);
					nlapiSetFieldValue("shipzip","90048",false,true);
					nlapiSetFieldValue("shipaddress","Brilliant Earth Showroom\n8797 Beverly Blvd., Ste 206\nLos Angeles, CA 90048\nUnited States",true,true);
					nlapiSetFieldValue("istaxable","T");
					//nlapiSetFieldValue("taxitem","1731050");
				}
				else if(nlapiGetFieldValue("custbody_pickup_location")=="1")
				{
					nlapiSetFieldValue("shipaddressee","Brilliant Earth Showroom",false,true);
					nlapiSetFieldValue("shipaddr1","26 O'Farrell St, 10th Floor",false,true);
					nlapiSetFieldValue("shipaddr2","",false,true);
					nlapiSetFieldValue("shipcountry","US",false,true);
					nlapiSetFieldValue("shipcity","San Francisco",false,true);
					nlapiSetFieldValue("shipstate","CA",false,true);
					nlapiSetFieldValue("shipzip","94108",false,true);
					nlapiSetFieldValue("shipaddress","Brilliant Earth Showroom\n26 O'Farrell St, 10th Floor\nSan Francisco, CA 94108\nUnited States",true,true);
					nlapiSetFieldValue("istaxable","T");
					nlapiSetFieldValue("taxitem","-178");
				}
				else if(nlapiGetFieldValue("custbody_pickup_location")=="3")
				{
					nlapiSetFieldValue("shipaddressee","Brilliant Earth Showroom",false,true);
					nlapiSetFieldValue("shipaddr1","38 Newbury St, Ste 603",false,true);
					nlapiSetFieldValue("shipaddr2","",false,true);
					nlapiSetFieldValue("shipcountry","US",false,true);
					nlapiSetFieldValue("shipcity","Boston",false,true);
					nlapiSetFieldValue("shipstate","MA",false,true);
					nlapiSetFieldValue("shipzip","02116",false,true);
					nlapiSetFieldValue("shipaddress","Brilliant Earth Showroom\n38 Newbury St, Ste 603\nBoston, MA 02116\nUnited States",true,true);
					nlapiSetFieldValue("istaxable","T");
                }
              	else if(nlapiGetFieldValue("custbody_pickup_location")=="4")
                {
					nlapiSetFieldValue("shipaddressee","Brilliant Earth Showroom",false,true);
					nlapiSetFieldValue("shipaddr1","34 East Oak St, 2nd Fl",false,true);
					nlapiSetFieldValue("shipaddr2","",false,true);
					nlapiSetFieldValue("shipcountry","US",false,true);
					nlapiSetFieldValue("shipcity","Chicago",false,true);
					nlapiSetFieldValue("shipstate","IL",false,true);
					nlapiSetFieldValue("shipzip","60611",false,true);
					nlapiSetFieldValue("shipaddress","Brilliant Earth Showroom\n34 East Oak St, 2nd Fl\nChicago, IL 60611\nUnited States",true,true);
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
