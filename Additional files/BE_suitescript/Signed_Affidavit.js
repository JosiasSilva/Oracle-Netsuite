function Signed_Affidavit_Automation(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			if(type=="edit")
			{
				var oldSA = nlapiGetOldRecord().getFieldValue("custbody125");
				var newSA = nlapiGetNewRecord().getFieldValue("custbody125");
				
				nlapiLogExecution("debug","Old Value",oldSA);
				nlapiLogExecution("debug","New Value",newSA);
				if(oldSA==null)
					oldSA="";
				if(newSA==null)
					newSA="";
				
				//Do not recalculate Signed Affidavit field if manually changed				
				if(oldSA!=newSA)
					return true;
			}
			
			var internalid = nlapiGetRecordId();
			var order = nlapiLoadRecord("salesorder",internalid);
			var affidavit;
			
			nlapiLogExecution("debug","Bill State",order.getFieldValue("billstate"));
			nlapiLogExecution("debug","Pick-up Order",order.getFieldValue("custbody53"));
			
			
			if(order.getFieldValue("billstate")!="CA" && order.getFieldValue("billstate")!="California")
			{
				//If billing address if not in California, Signed Affidavit = Does Not Apply
				affidavit = "1";
			}
			else if(order.getFieldValue("custbody53")=="T")
			{
				//If Pick-Up At BE order, Signed Affidavit = Does Not Apply
				affidavit = "1";
			}
			else if((order.getFieldValue("billstate")=="CA" || order.getFieldValue("billstate")=="California") && (order.getFieldValue("shipstate")!="CA" && order.getFieldValue("shipstate")!="California") && order.getFieldValue("custbody125")!="3" && order.getFieldValue("custbody125")!="4" && order.getFieldValue("custbody125")!="2")
			{
				//If billing address IS in California, but shipping address is not, Signed Affidavit = Affidavit Needed
				affidavit = "5";
			}
			else if(order.getFieldValue("custbody125")!="3" && order.getFieldValue("custbody125")!="4" && order.getFieldValue("custbody125")!="2")
			{
				//Default to Does Not Apply if none of the above rules match
				affidavit = "1";
			}
				
				
			order.setFieldValue("custbody125",affidavit);
			nlapiSubmitRecord(order,true,true);
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Signed Affidavit field values","Details: " + err.message);
			return true;
		}
	}
}