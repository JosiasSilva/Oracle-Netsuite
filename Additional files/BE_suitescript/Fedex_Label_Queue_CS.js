function Fedex_Label_Queue_CS_FC(type,name,linenum)
{
	if(name=="custpage_allow_reprinting")
	{
		try
		{
			var allowReprint = 'F';
			
			if(nlapiGetFieldValue("custpage_allow_reprinting")=="T")
				allowReprint = 'T';
				
			var url = nlapiResolveURL("SUITELET","customscript_fedex_label_print_queue","customdeploy_fedex_label_print_queue");
				url+= "&reprint=" + allowReprint;
				
			window.onbeforeunload = null;
			window.location.href = url;
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Handling Reprint Checkbox","Details: " + err.message);
		}
	}
}
