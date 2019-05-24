nlapiLogExecution("audit","FLOStart",new Date().getTime());
function IA_Print_Queue_CS_FC(type,name,linenum)
{
	try
	{
		if(type=="custpage_orders" && name=="custpage_print")
		{
			var selected = 0;
			for(var x=0; x < nlapiGetLineItemCount("custpage_orders"); x++)
			{
				if(nlapiGetLineItemValue("custpage_orders","custpage_print",x+1)=="T")
					selected++;
			}
			
			nlapiSetFieldValue("custpage_selected",selected);
		}
		else if(name=="custpage_page")
		{
			var page = nlapiGetFieldValue("custpage_page");
			
			window.onbeforeunload = null;
			window.location.href = nlapiResolveURL("SUITELET","customscript455","customdeploy1") + "&page=" + page;
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Calculating # Selected","Details: " + err.message);
		return true;
	}
}

function IA_Print_Queue_Mark_All()
{
	for(var x=0; x < nlapiGetLineItemCount("custpage_orders"); x++)
	{
		nlapiSetLineItemValue("custpage_orders","custpage_print",x+1,"T");
	}
	
	nlapiSetFieldValue("custpage_selected",nlapiGetLineItemCount("custpage_orders"));
}

function IA_Print_Queue_Unmark_All()
{
	for(var x=0; x < nlapiGetLineItemCount("custpage_orders"); x++)
	{
		nlapiSetLineItemValue("custpage_orders","custpage_print",x+1,"F");
	}
	
	nlapiSetFieldValue("custpage_selected",0);
}


