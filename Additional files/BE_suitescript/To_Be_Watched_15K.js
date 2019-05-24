nlapiLogExecution("audit","FLOStart",new Date().getTime());
function To_Be_Watched_15K(type)
{
	try
	{
		if(type=="create")
		{
			var customer = nlapiGetFieldValue("entity");
			
			var filters = [];
			filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
			filters.push(new nlobjSearchFilter("entity",null,"is",customer));
			filters.push(new nlobjSearchFilter("totalamount",null,"greaterthanorequalto",15000.00));
			filters.push(new nlobjSearchFilter("status",null,"noneof",["SalesOrd:C","SalesOrd:G","SalesOrd:H"]));
			var results = nlapiSearchRecord("salesorder",null,filters);
			if(results)
			{
				nlapiLogExecution("debug","Order over $15K found");
				nlapiSetFieldValue("custbody129","T");
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Setting To Be Watched","Details: " + err.message);
		return true;
	}
}