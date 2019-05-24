nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Set_Order_Pickup_Date(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			//Get record internal ID
			var internalid = nlapiGetRecordId();
			
			//Find appointment with linked pick-up sales order transaction
			var filters = [];
			filters.push(new nlobjSearchFilter("internalid",null,"is",internalid));
			filters.push(new nlobjSearchFilter("custbody53","custevent_pickup_apt_sales_order","is","T"));
			var cols = [];
			cols.push(new nlobjSearchColumn("startdate"));
			cols.push(new nlobjSearchColumn("custevent_pickup_apt_sales_order"));
			var results = nlapiSearchRecord("calendarevent",null,filters,cols);
			if(results)
			{
				//Set Pick-up Appt. Date on sales order
				nlapiSubmitField("salesorder",results[0].getValue("custevent_pickup_apt_sales_order"),"custbody_pickup_appt_date",results[0].getValue("startdate"));
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Pickup Date","Details: " + err.message);
			return true;
		}
	}
}
