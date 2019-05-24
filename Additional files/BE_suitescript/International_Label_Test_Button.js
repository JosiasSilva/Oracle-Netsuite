nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Print_Intl_Label_Btn(type)
{
	if(type=="view")
	{
		try
		{
			if(nlapiGetFieldValue("shipmethod")=="2531266")
			{
				var url = nlapiResolveURL("SUITELET","customscript_fedex_international_lbl_sl","customdeploy_fedex_international_lbl_sl") + "&shipid=" + nlapiGetRecordId();
			
				form.addButton("custpage_print_intl_label","International Label","window.open('" + url + "','intlLabel','width:800,height:600');");
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Print Label Button","Details: " + err.message);
		}
	}
}
