function PU_Automation_CD_Redirect()
{
	try
	{
		var deposit = nlapiGetNewRecord();
		var puReceipt = deposit.getFieldValue("custbody_triggered_from_pu_receipt");
		
		if(puReceipt!=null && puReceipt!="")
		{
			var params = new Object();
			params["puid"] = puReceipt;
			params["state"] = "collect_balance";
			
			nlapiSetRedirectURL("SUITELET","customscript_pickup_window","customdeploy_pickup_window",null,params);
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Redirecting CD to PU Receipt","Details: " + err.message);
	}
}
