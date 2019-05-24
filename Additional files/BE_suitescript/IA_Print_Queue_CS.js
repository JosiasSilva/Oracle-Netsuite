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
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Calculating # Selected","Details: " + err.message);
		return true;
	}
}
