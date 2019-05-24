nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Last_Customer_Message_Mass_Update(rec_type,rec_id)
{	
	try
	{
		var filters = [];
		filters.push(new nlobjSearchFilter("internalid",null,"is",rec_id))
		//filters.push(new nlobjSearchFilter("messagedate","messages","onorafter","03weeksago"));
		//filters.push(new nlobjSearchFilter("subject","messages","contains","Re:"));
		filters.push(new nlobjSearchFilter("recipientemail","messages","contains","@brilliantearth.com"));
		
		var cols = [];
		cols.push(new nlobjSearchColumn("messagedate","messages").setSort(true));
		cols.push(new nlobjSearchColumn("message","messages"));
		
		var results = nlapiSearchRecord("customer",null,filters,cols)
		if(results)
		{
			nlapiLogExecution("debug","Updating Field","Customer ID " + rec_id)
			var messageBody
			if(results[0].getValue("message","messages").length > 3999)
			{
				messageBody = results[0].getValue("message","messages").substr(0,3999)
			}
			else
			{
				messageBody = results[0].getValue("message","messages")
			}
			nlapiSubmitField(rec_type,rec_id,"custentity_last_customer_email_body",messageBody);
		}
		else
		{
			nlapiLogExecution("debug","No results found...")
		}
	}
	catch(err)
	{
		nlapiLogExecution("error", "Last Customer Message MA Error", "Error updating customer internal ID " + rec_id + ". Details: " + err.message)
		return true
	}
}
