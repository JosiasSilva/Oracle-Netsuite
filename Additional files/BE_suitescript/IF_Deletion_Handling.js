nlapiLogExecution("audit","FLOStart",new Date().getTime());
/*
 * Update Sales Order to Batch Fulfill ='T' Upon IF Deletion
 * 
 * Change Log:
 *   v1 - Initial script development per NS-336. Limited to only manual/UI deletions.
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
					//Update sales order with Batch Fulfill = T (NS-336)
					nlapiSubmitField("salesorder",salesorder,"custbodyestate_auto_approved_wf","T");
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Updating SO on Manual IF Deletion","Details: " + err.message);
		}
	}
}
