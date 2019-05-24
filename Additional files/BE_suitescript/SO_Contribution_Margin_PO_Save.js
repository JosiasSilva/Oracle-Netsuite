/*
 * PO Status Contribution Margin Reset
 * Type: User Event
 * Event: After Submit
 * 
 * Checks the associated sales order of a new PO. If the sales order contribution margin fields are
 * populated, it clears them out as they should only be valid when all POs on the order are billed.
 */
function PO_Status_Margin_Reset(type)
{
	if(type=="create")
	{
		try
		{
			var purchaseOrderID = nlapiGetRecordId()
			var salesOrderID = nlapiGetNewRecord().getFieldValue("createdfrom")
			if(salesOrderID!=null && salesOrderID!="")
			{
				//Check order for contribution margin values and reset if filled in
				var soFields = nlapiLookupField("salesorder",salesOrderID,["custbody_contribution_margin","custbody_contribution_margin_amt"])
				if(soFields["custbody_contribution_margin_amt"]!=null && soFields["custbody_contribution_margin_amt"]!="")
				{
					nlapiSubmitField("salesorder",salesOrderID,["custbody_contribution_margin","custbody_contribution_margin_amt"],["",""],false)
					return true
				}
				if(soFields["custbody_contribution_margin"]!=null && soFields["custbody_contribution_margin"]!="")
				{
					nlapiSubmitField("salesorder",salesOrderID,["custbody_contribution_margin","custbody_contribution_margin_amt"],["",""],false)
					return true
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Resetting Contribution Margins","Error while checking to see if SO contribution margin details are populated for unbilled PO. Purchas Order internal ID " + nlapiGetRecordId() + ". Details: " + err.message)
			return true
		}
	}
}
