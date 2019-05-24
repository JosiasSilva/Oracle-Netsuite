nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Integrated_Tracking_Number_Log(type)
{
	if(type=="delete")
	{
		try
		{
			if(nlapiGetContext().getExecutionContext()=="userinterface")
				var fulfillment = nlapiGetOldRecord();
			else
				var fulfillment = nlapiGetLoadRecord("itemfulfillment",nlapiGetRecordId());
			
			//if(fulfillment.getFieldValue("generateintegratedshipperlabel")=="T")
			//{
				var order = fulfillment.getFieldValue("createdfrom");
				
				if(fulfillment.getLineItemCount("packagefedex") > 0)
				{
					nlapiLogExecution("debug","FedEx/Integrated Shipping Method");
					
					var trackingNumber = fulfillment.getLineItemValue("packagefedex","packagetrackingnumberfedex","1");
					nlapiLogExecution("debug","Tracking #",trackingNumber);
					
					if(trackingNumber!=null && trackingNumber!="")
					{
						var existingNumbers = nlapiLookupField("salesorder",order,"custbody_deleted_tracking_numbers");
						if(existingNumbers!=null && existingNumbers!="")
							nlapiSubmitField("salesorder",order,"custbody_deleted_tracking_numbers",existingNumbers+","+trackingNumber);
						else
							nlapiSubmitField("salesorder",order,"custbody_deleted_tracking_numbers",trackingNumber);
					}	
				}
				else if(fulfillment.getLineItemCount("package") > 0)
				{
					nlapiLogExecution("debug","NON-FedEx/Integrated Shipping Method");
					
					var trackingNumber = fulfillment.getLineItemValue("package","packagetrackingnumber","1");
					nlapiLogExecution("debug","Tracking #",trackingNumber);
					
					if(trackingNumber!=null && trackingNumber!="")
					{
						var existingNumbers = nlapiLookupField("salesorder",order,"custbody_deleted_tracking_numbers");
						if(existingNumbers!=null && existingNumbers!="")
							nlapiSubmitField("salesorder",order,"custbody_deleted_tracking_numbers",existingNumbers+","+trackingNumber);
						else
							nlapiSubmitField("salesorder",order,"custbody_deleted_tracking_numbers",trackingNumber);
					}	
				}
			//}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Recording Deleted Tracking Numbers","Details: " + err.message);
		}
	}
}
