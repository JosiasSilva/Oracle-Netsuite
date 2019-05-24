nlapiLogExecution("audit","FLOStart",new Date().getTime());
function FedEx_Return_Label_Button(type,form)
{
	if(type=="view")
	{
		try
		{
			var url = nlapiResolveURL("SUITELET","customscript_fedex_return_label_int","customdeploy_fedex_return_label_int");
			url += "&order=" + nlapiGetRecordId();
			url += "&rectype=" + nlapiGetRecordType();
			
			form.addButton("custpage_return_label","Return Label","window.open('" + url + "','returnLabelWin','width=800,height=600');");
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Return Label Button","Details: " + err.message);
		}
	}
}
