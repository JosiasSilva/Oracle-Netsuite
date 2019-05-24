function Set_Shipping_Methods()
{
	var twodays = [];
	
	//Fedex 2Day
	var results = nlapiSearchRecord("salesorder","customsearch_overnight_fedex_orders_2",filters);
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			try{
				nlapiSubmitField("salesorder",results[x].getId(),"shipmethod","2221264");	
			}catch(err){
				nlapiLogExecution("error","Error Updating Shipping Method (" + results[x].getId() + ")","Details: " + err.message);
			}
			
			twodays.push(results[x].getId());
		}
	}
	
	var overnights = [];
	//FedEx Overnight
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"noneof",twodays));
	var results = nlapiSearchRecord("salesorder","customsearch_overnight_fedex_orders");
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			try{
				nlapiSubmitField("salesorder",results[x].getId(),"shipmethod","1965157");	
			}catch(err){
				nlapiLogExecution("error","Error Updating Shipping Method (" + results[x].getId() + ")","Details: " + err.message);
			}
		}
	}
	
	//PUs and APOs
	var results = nlapiSearchRecord("salesorder","customsearch2991");
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			try{
				nlapiSubmitField("salesorder",results[x].getValue("internalid",null,"group"),"shipmethod","2421916");	
			}catch(err){
				nlapiLogExecution("error","Error Updating Shipping Method (" + results[x].getValue("internalid",null,"group") + ")","Details: " + err.message);
			}
		}
	}
	
	//Queue up Auto Fulfillment Scheduled Script
	//nlapiScheduleScript("customscript_automated_fulfillment","customdeploy_automated_fulfillment");
}
