/*
 * Update Sales Order to Batch Fulfill ='T' Upon IF Deletion
 * 
 * Change Log:
 *   v1 - Initial script development per NS-336. Limited to only manual/UI deletions.
 *   v2 - Added logic per NS-1081 to set shipping method depending on domestic vs international shipment
 */
function IF_Deletion_Handling(type)
{
	if(type=="delete")
	{
		try
		{
			if(nlapiGetContext().getExecutionContext()=="userinterface")
			{
				var salesorder = nlapiGetNewRecord().getFieldValue("createdfrom");
				nlapiLogExecution("debug","Sales Order ID",salesorder);
				
				if(salesorder!=null && salesorder!="")
				{
					//Check Ship Country on Sales Order (NS-1081)
					//If US, set shipping method to Drop Ship - Web Services
					//If International, set shipping method to FedEx International Priority
					var shipCountry = nlapiLookupField("salesorder",salesorder,"shipcountry");
					nlapiLogExecution("debug","Shipping Country",shipCountry);
					
					var shipMethod;
					if(shipCountry=="US")
						shipMethod = "5668896"; //Drop Ship - Web Services
					else
						shipMethod = "2531266"; //FedEx International Priority
						
					nlapiLogExecution("debug","Shipping Method",shipMethod);
					
					//Update sales order with Batch Fulfill = T (NS-336)
					nlapiSubmitField("salesorder",salesorder,["custbodyestate_auto_approved_wf","shipmethod"],["T",shipMethod]);
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Updating SO on Manual IF Deletion","Details: " + err.message);
		}
	}
}
