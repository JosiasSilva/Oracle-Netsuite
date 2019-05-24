var lastdays = ["31","28","31","30","31","30","31","31","30","31","30","31"];

function Create_LA_COGS_JE()
{
	try
	{
		//Get LA sales reps
		//var reps = [];
		//var filters = [];
		//filters.push(new nlobjSearchFilter("location",null,"is","10"));
		//filters.push(new nlobjSearchFilter("salesrep",null,"is","T"));
		//var results = nlapiSearchRecord("employee",null,filters);
		//if(results)
		//{
		//	for(var x=0; x < results.length; x++)
		//		reps.push(results[x].getId());
		//}
		
		//var filters = [];
		//filters.push(new nlobjSearchFilter("location",null,"is","2")); //Item Fulfillment Location = SF
		//filters.push(new nlobjSearchFilter("trandate",null,"within","lastmonth"));
		//filters.push(new nlobjSearchFilter("account",null,"is","65")); //5030 Cost of Goods Sold
		//filters.push(new nlobjSearchFilter("salesrep","createdfrom","anyof",reps));
		//filters.push(new nlobjSearchFilter("status",null,"anyof","ItemShip:C"));
		//var cols = [];
		//cols.push(new nlobjSearchColumn("amount",null,"sum"));
		var results = nlapiSearchRecord("itemfulfillment","customsearch2408");
		if(results)
		{
			nlapiLogExecution("debug","JE Amount",results[0].getValue("amount",null,"sum"));
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Creating Monthly LA COGS JE","Details: " + err.message);
		return true;
	}
}
