nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Return_Label_Email_Queue_CS_SR()
{
	try
	{
		var alertMsg = "";
		
		for(var x=0; x < nlapiGetLineItemCount("custpage_orders"); x++)
		{
			if(nlapiGetLineItemValue("custpage_orders","custpage_order_rsl_status",x+1)=="5" && (nlapiGetLineItemValue("custpage_orders","custpage_order_return_insurance",x+1)==null || nlapiGetLineItemValue("custpage_orders","custpage_order_return_insurance",x+1)==""))
			{
				alertMsg += " - Please enter insurance $$ value on line " + (x+1) + "\n";
			}
		}
		
		if(alertMsg!="")
		{
			alert(alertMsg);
			return false;
		}
		else
		{
			return true;
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Cchecking Insurance Amounts","Details: " + err.message);
		return true;
	}
}
