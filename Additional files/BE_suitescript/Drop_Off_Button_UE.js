function Drop_Off_Automation_Button(type,form,request)
{
	if(type=="view")
	{
		try
		{
			if(nlapiGetRecordType()=="salesorder")
			{
				var orderId = nlapiGetRecordId();
				var status = nlapiGetFieldValue("orderstatus");
				var customer = nlapiGetFieldValue("entity");
				var typeOfOrder = nlapiGetFieldValue("custbody87");
				var isDropOff = nlapiGetFieldValue("custbody_drop_off");
				
				if(status!="H" && (typeOfOrder=="8" || typeOfOrder=="4" || typeOfOrder=="3" || typeOfOrder=="2" || typeOfOrder=="10") && isDropOff=="1")
				{
					var url = nlapiResolveURL("SUITELET","customscript_drop_off_wizard","customdeploy_drop_off_wizard");
						url+= "&order=" + orderId + "&customer=" + customer + "&rectype=salesorder";
						
					form.addButton("custpage_do_button","Drop-Off","window.open('" + url + "','dropOffWin','width=850,height=600');");
				}
			}
			else if(nlapiGetRecordType()=="returnauthorization")
			{
				var orderId = nlapiGetRecordId();
				var status = nlapiGetFieldValue("orderstatus");
				var customer = nlapiGetFieldValue("entity");
				var typeOfOrder = nlapiGetFieldValue("custbody87");
				var isDropOff = nlapiGetFieldValue("custbody_drop_off");
				
				if(status!="A" && status!="C" && status!="H" && (typeOfOrder=="8") && isDropOff=="1")
				{
					var url = nlapiResolveURL("SUITELET","customscript_drop_off_wizard","customdeploy_drop_off_wizard");
						url+= "&order=" + orderId + "&customer=" + customer + "&rectype=returnauthorization";
						
					form.addButton("custpage_do_button","Drop-Off","window.open('" + url + "','dropOffWin','width=850,height=600');");
				}
			}
			
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Drop-Off Button","Details: " + err.message);
		}
	}
}
