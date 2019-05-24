function Pickup_IF_Date(type)
{
	nlapiLogExecution("debug","Type",type);
	
	if(type=="create" || type=="edit" || type=="ship")
	{
		try
		{
			var ff = nlapiGetNewRecord();
			var status = ff.getFieldValue("shipstatus");
			
			nlapiLogExecution("debug","Status",status);
			
			if(status=="C")
			{
				var today = new Date();
				today = nlapiDateToString(today,"date");
					
				nlapiLogExecution("debug","Pick-up Order","Setting Date to " + today);
					
				nlapiSetFieldValue("trandate",today);
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Item Fulfillment Date","Details: " + err.message);
			return true;
		}
	}
}