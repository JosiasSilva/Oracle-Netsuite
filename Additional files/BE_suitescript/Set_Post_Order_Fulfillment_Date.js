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
 */
function Add_FF_Date(type)
{
	if(type=="create")
	{
		try
		{
			var customer = nlapiGetFieldValue("entity");
			
			var filters = [];
			filters.push(new nlobjSearchFilter("entity",null,"is",customer));
			filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
			var cols = [];
			cols.push(new nlobjSearchColumn("trandate").setSort());
			cols.push(new nlobjSearchColumn("actualshipdate"));
			var results = nlapiSearchRecord("salesorder",null,filters,cols);
			if(results)
			{
				nlapiSetFieldValue("custbody_original_item_fulfill_date",results[0].getValue("actualshipdate"));
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Item Fulfillment Date","Details: " + err.message);
			return true;
		}
	}
}
