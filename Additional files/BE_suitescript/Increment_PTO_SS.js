nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Increment_PTO()
{
	try
	{
		//Retrieve list of all active BE Employees and their PRO hours per pay period
		var filters = [];
		filters.push(new nlobjSearchFilter("isinactive",null,"is","F"));
		var cols = [];
		cols.push(new nlobjSearchColumn("custentity_available_pto"));
		var results = nlapiSearchRecord("employee",null,filters,cols);
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				var currentPTO = parseFloat(results[x].getValue("custentity_available_pto"));
				var increment = parseFloat(results[x].getValue("custentity_available_pto"));
				var newPTO = currentPTO + increment;
				
				nlapiSubmitField("employee",results[x].getId(),"custentity_available_pto",newPTO);
			}
		}
		
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating PTO Values","Details: " + err.message);
		return true;
	}
}
