nlapiLogExecution("audit","FLOStart",new Date().getTime());
function IA_Print_Queue_CS_FC(type,name,linenum)
{
	try
	{
		if(type=="custpage_orders" && name=="custpage_print")
		{
			var selected = 0;
                        var Count_page=nlapiGetLineItemCount("custpage_orders");
			for(var x=1; x <=Count_page ; x++)
			{
				if(nlapiGetLineItemValue("custpage_orders","custpage_print",x)=="T")
                                  {
					selected++;
                                  }
			}
			
			nlapiSetFieldValue("custpage_selected",selected);
		}
		else if(name=="custpage_page")
		{
			var page = nlapiGetFieldValue("custpage_page");
			
			window.onbeforeunload = null;
			window.location.href = nlapiResolveURL("SUITELET","customscript_print_queue_v4","customdeploy_print_queue_v4") + "&page=" + page;
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
       var Count_page=nlapiGetLineItemCount("custpage_orders");
	for(var x=1; x <= Count_page; x++)
	{
		nlapiSetLineItemValue("custpage_orders","custpage_print",x,"T");
	}
	
	nlapiSetFieldValue("custpage_selected",Count_page);
}

function IA_Print_Queue_Unmark_All()
{
       var Count_page=nlapiGetLineItemCount("custpage_orders");
	for(var x=1; x <= Count_page; x++)
	{
		nlapiSetLineItemValue("custpage_orders","custpage_print",x,"F");
	}
	
	nlapiSetFieldValue("custpage_selected",0);
}
function PageInit()
{

 IA_Print_Queue_Unmark_All()
}

function Save_Record()
{
var Count_page=nlapiGetLineItemCount("custpage_orders");
var selected = 0;
for(var x=1; x <=Count_page ; x++)
{
	if(nlapiGetLineItemValue("custpage_orders","custpage_print",x)=="T")
                 {
			selected++;
                 }
}
if(selected==0)
{
  return false;
}
else if(selected>20)
{
  //alert("You can't select more than 20 record  to print at a time!");
   return true;
}
return true
                               
}