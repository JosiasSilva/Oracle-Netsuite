nlapiLogExecution("audit","FLOStart",new Date().getTime());
/*
 * Add Item Fulfillment Date from Original Sales Order to all Post Sales Orders
 * 
 * Type: User Event
 * Execution: Before Submit
 * 
 * Units: 10
 * 
 * Finds the original sales order item fulfillment date and sets in a custom field on the
 * post sales order.
 * 
 * Change Log:
 *   07/05/2014 - Initial script creation.
 *   07/26/2014 - Added criteria to run on return authorizations and split logic based on record type.
 */
function Add_FF_Date(type)
{
	if(type=="create")
	{
		try
		{
			if(nlapiGetRecordType()=="salesorder")
			{
				var customer = nlapiGetFieldValue("entity");
				var originalSO = nlapiGetFieldValue("custbody_created_from");
			
				if(originalSO!=null && originalSO!="")
					nlapiSetFieldValue("custbody_original_item_fulfill_date",nlapiLookupField("salesorder",originalSO,"actualshipdate"));
			}
			else if(nlapiGetRecordType()=="returnauthorization")
			{
				var originalSO = nlapiGetFieldValue("createdfrom");
				
				if(originalSO!=null && originalSO!="")
					nlapiSetFieldValue("custbody_original_item_fulfill_date",nlapiLookupField("salesorder",originalSO,"actualshipdate"));
			}
			
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Item Fulfillment Date","Details: " + err.message);
			return true;
		}
	}
}
