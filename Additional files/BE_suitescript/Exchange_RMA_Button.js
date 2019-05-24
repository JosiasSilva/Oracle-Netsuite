nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Exchange_RMA_Button(type,form)
{
	if(type=="view")
	{
		try
		{
			var url = nlapiResolveURL("SUITELET","customscript_exchange_page","customdeploy_exchange_page");
			var order = nlapiGetFieldValue("createdfrom");
			url += "&order=" + order;
			url += "&rma=" + nlapiGetRecordId();
			form.addButton("custpage_exchange","Convert to Exchange","window.location.href='"+url+"';");
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Exchange Button","Details: " + err.message);
		}
	}
}
