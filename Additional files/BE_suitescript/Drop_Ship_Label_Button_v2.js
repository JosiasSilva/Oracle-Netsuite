function Drop_Ship_Label_Button(type,form)
{
	if(type=="view")
	{
		try
		{
			if(nlapiGetFieldValue("shipstatus")!="C" && nlapiGetFieldValue("custbody39")!=null && nlapiGetFieldValue("custbody39")!="" && nlapiGetFieldValue("shipmethod")!="2531266")
			{
				var url = nlapiResolveURL("SUITELET","customscript_drop_ship_label_creator","customdeploy_drop_ship_label_creator");
					url+= "&shipid=" + nlapiGetRecordId();
					
				form.addButton("custpage_drop_ship_label","Drop Ship Label","window.open('" + url + "','dropShipLabelWin','width=800,height=600');");
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Drop Ship Label Button","Details: " + err.message);
		}
	}
}

function Drop_Ship_Label_SL(request,response)
{
	var fulfillmentId = request.getParameter("shipid");
	
	Drop_Ship_Fulfillment_Label(fulfillmentId,true);
}
