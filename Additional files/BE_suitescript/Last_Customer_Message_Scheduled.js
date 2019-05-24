nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Last_Customer_Message_Scheduled()
{	
	try
	{
		var filters = [];
		filters.push(new nlobjSearchFilter("isinactive",null,"is","F"))
		filters.push(new nlobjSearchFilter("recipientemail","messages","contains","@brilliantearth.com"));
		filters.push(new nlobjSearchFilter("messagedate","messages","on","today"));
		
		var cols = [];
		cols.push(new nlobjSearchColumn("messagedate","messages").setSort(true));
		cols.push(new nlobjSearchColumn("message","messages"));
		
		var results = nlapiSearchRecord("customer",null,filters,cols)
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				var messageBody;
				if(results[x].getValue("message","messages").length > 3999)
				{
					messageBody = results[x].getValue("message","messages").substr(0,3999)
				}
				else
				{
					messageBody = results[x].getValue("message","messages")
				}
				nlapiSubmitField("customer",results[x].getId(),"custentity_last_customer_email_body",messageBody);	
			}
		}
		else
		{
			nlapiLogExecution("debug","No results found...")
		}
	}
	catch(err)
	{
		nlapiLogExecution("error", "Last Customer Message Update Error", "Details: " + err.message)
		return true
	}
}
