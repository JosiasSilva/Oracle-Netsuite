nlapiLogExecution("audit","FLOStart",new Date().getTime());
function setShippingAddress(type,name)
{
	if(name=="custbody53" || name=="custbody_pickup_location")
	{
		try
		{
			if(nlapiGetFieldValue("custbody53")=="T")
			{
				var puLocation = nlapiGetFieldValue("custbody_pickup_location");
				
				var filters = [];
				filters.push(new nlobjSearchFilter("custrecord_pick_up_location_link",null,"is",puLocation));
				var results = nlapiSearchRecord("location",null,filters);
				if(results)
				{
					var location = nlapiLoadRecord("location",results[0].getId());
					
					nlapiSetFieldValue("shipaddressee","Brilliant Earth Showroom",false,true);
					
					var customerName = nlapiGetFieldText("entity");
					nlapiLogExecution("debug","Customer Name (Pre-Substr)",customerName);
					customerName = customerName.substr(customerName.indexOf(" ")+1);
					nlapiLogExecution("debug","Customer Name (Post-Substr)",customerName);
					
					nlapiSetFieldValue("shipattention",customerName,false,true);
					nlapiSetFieldValue("shipaddr1",location.getFieldValue("addr1"),false,true);
					nlapiSetFieldValue("shipaddr2",location.getFieldValue("addr2"),false,true);
					nlapiSetFieldValue("shipcountry",location.getFieldValue("country"),false,true);
					nlapiSetFieldValue("shipcity",location.getFieldValue("city"),false,true);
					nlapiSetFieldValue("shipstate",location.getFieldValue("state"),false,true);
					nlapiSetFieldValue("shipzip",location.getFieldValue("zip"),false,true);
					
					var addrText = customerName + "\nBrilliant Earth Showroom\n";
					nlapiLogExecution("debug","addrText",addrText);
					if(location.getFieldValue("addr1")!=null && location.getFieldValue("addr1")!="")
						addrText += location.getFieldValue("addr1") + "\n";
					nlapiLogExecution("debug","addrText",addrText);
					if(location.getFieldValue("addr2")!=null && location.getFieldValue("addr2")!="")
						addrText += location.getFieldValue("addr2") + "\n";
					nlapiLogExecution("debug","addrText",addrText);
					addrText += location.getFieldValue("city") + " " + location.getFieldValue("state") + " " + location.getFieldValue("zip") + "\n";
					nlapiLogExecution("debug","addrText",addrText);
					addrText += "United States";
					nlapiLogExecution("debug","addrText",addrText);
					
					//nlapiSetFieldValue("shipaddress",nlapiGetFieldText("entity")+"\nBrilliant Earth Showroom\n"+location.getFieldValue("addrtext"),true,true);
					nlapiSetFieldValue("shipaddress",addrText,true,true);
					
					if(location!="26")
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
