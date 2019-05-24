function setShippingAddress(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			if(nlapiGetNewRecord().getFieldValue("custbody53")=="T")
			{
				var salesOrder = nlapiLoadRecord("salesorder",nlapiGetRecordId());
				salesOrder.setFieldValue("shipaddressee","Pick-up at BE");
				salesOrder.setFieldValue("shipaddr1","");
				salesOrder.setFieldValue("shipaddr2","");
				salesOrder.setFieldValue("shipcountry","US");
				salesOrder.setFieldValue("shipcity","San Francisco");
				salesOrder.setFieldValue("shipstate","CA");
				salesOrder.setFieldValue("shipzip","94108");
				salesOrder.setFieldValue("shipaddress","Pick-up at BE\nSan Francisco, CA 94108");
				nlapiSubmitRecord(salesOrder,false,true);
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Pick-up Address","Details: " + err.message);
			return true;
		}
	}
	/*
	if(type=="edit")
	{
		try
		{
			if(nlapiGetOldRecord().getFieldValue("custbody53")!="T" && nlapiGetNewRecord().getFieldValue("custbody53")=="T")
			{
				var salesOrder = nlapiLoadRecord("salesorder",nlapiGetRecordId());
				salesOrder.setFieldValue("shipaddressee","Pick-up at BE");
				salesOrder.setFieldValue("shipaddr1","");
				salesOrder.setFieldValue("shipaddr2","");
				salesOrder.setFieldValue("shipcountry","US");
				salesOrder.setFieldValue("shipcity","San Francisco");
				salesOrder.setFieldValue("shipstate","CA");
				salesOrder.setFieldValue("shipzip","94108");
				salesOrder.setFieldValue("shipaddress","Pick-up at BE\nSan Francisco, CA 94108");
				nlapiSubmitRecord(salesOrder,false,true);
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Pick-up Address","Details: " + err.message);
			return true;
		}
	}
	*/
}
