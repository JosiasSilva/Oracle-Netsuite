function VRA_Label_Button(type,form)
{
	if(type=="view")
	{
		try
		{
			var today = new Date();
			today = new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0,0);
			
			var createdFrom = nlapiGetFieldText("createdfrom");
			var trandate = nlapiGetFieldValue("trandate");
			trandate = nlapiStringToDate(trandate);
			
			if(createdFrom.substring(0,3)=="Ven" && trandate >= today)
			{
				var url = nlapiResolveURL("SUITELET","customscript_vra_label_creator","customdeploy_vra_label_creator");
					url+= "&shipid=" + nlapiGetRecordId();
					
				form.addButton("custpage_vra_label","Create FedEx Shipping Label","window.open('" + url + "','vraLabelWin','width=800,height=600');");
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing VRA FedEx Label Button","Details: " + err.message);
		}
	}
}

function VRA_Label_SL(request,response)
{
	var fulfillmentId = request.getParameter("shipid");
	
	VRA_Fulfillment_Label(fulfillmentId,true);
}

/*
function VRA_Label_SL_Auto_IF(request,response)
{
	var fulfillmentId = request.getParameter("shipid");
	
	VRA_Fulfillment_Label(fulfillmentId,false);
}
*/