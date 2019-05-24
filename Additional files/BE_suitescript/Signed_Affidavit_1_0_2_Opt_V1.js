function Signed_Affidavit_Automation(type)
{
	var ctx = nlapiGetContext().getExecutionContext();
	if(ctx!="userinterface" && ctx!="webserivces" && ctx!="suitelet")
		return true;
	
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
			var order = nlapiGetNewRecord();
			var affidavit = null;
			
			nlapiLogExecution("debug","Bill State",order.getFieldValue("billstate"));
			nlapiLogExecution("debug","Pick-up Order",order.getFieldValue("custbody53"));
			
			var billstate = order.getFieldValue("billstate");
			var custbody35 = order.getFieldValue("custbody53");
			var shipstate = order.getFieldValue("shipstate");
			var custbody125 = order.getFieldValue("custbody125");
			
			/********************* Start Add by Yagya Kumar 03-01-2016 for NS-526 **************************/
			nlapiLogExecution("debug","billstate : " + billstate,"shipstate : "+shipstate);
			if((billstate=="IL" || billstate == "Illinois") && (shipstate != "Illinois" && shipstate != "IL" ))
			{
				affidavit = "5";
			}
			/********************* End Add by Yagya Kumar 03-01-2016  for NS-526  **************************/
			else if(billstate!="CA" && billstate!="California" && billstate!="MA" && billstate!="Massachusetts")
			{
				//If billing address if not in California or Massachusetts, Signed Affidavit = Does Not Apply
				affidavit = "1";
			}
			else if(custbody35=="T")
			{
				//If Pick-Up At BE order, Signed Affidavit = Does Not Apply
				affidavit = "1";
			}
			else if(((billstate=="MA" || billstate=="Massachusetts") && (shipstate!="MA" && shipstate!="Massachusetts") || (billstate=="CA" || billstate=="California") && (shipstate!="CA" && shipstate!="California")) && custbody125!="3" && custbody125!="4" && custbody125!="2")
			{
				//If billing address IS in California/Massachusetts, but shipping address is not, Signed Affidavit = Affidavit Needed
				affidavit = "5";
			}
			else if(custbody125!="3" && custbody125!="4" && custbody125!="2")
			{
				//Default to Does Not Apply if none of the above rules match
				affidavit = "1";
			}
				
			if(affidavit!=null)
				nlapiSetFieldValue("custbody125",affidavit);
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Signed Affidavit field values","Details: " + err.message);
			return true;
		}
	}
}