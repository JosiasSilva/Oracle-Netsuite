function Pickup_Automation_Button(type,form,request)
{
	if(type=="view")
	{
		try
		{
			var orderId = nlapiGetRecordId();
			var status = nlapiGetFieldValue("orderstatus");
			var customer = nlapiGetFieldValue("entity");
			
			if(status!="G")
			{
				var url = nlapiResolveURL("SUITELET","customscript_pickup_window","customdeploy_pickup_window");
					url+= "&order=" + orderId + "&customer=" + customer;
					
				form.addButton("custpage_pu_button","Pick-Up Receipt","window.open('" + url + "','puReceiptWin','width=850,height=600');");
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing PU Receipt Button","Details: " + err.message);
		}
	}
}
