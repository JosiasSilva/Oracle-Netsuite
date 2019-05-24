function Set_Shipping_Methods()
{
	var twodays = [];
	
	var filters1 = [];
	
	if(nlapiGetContext().getSetting("SCRIPT","custscript_test_estate_approval_wf")=="T")
		filters1.push(new nlobjSearchFilter("custbodyestate_auto_approved_wf",null,"is","T"));
	
	//Fedex 2Day
	if(filters1.length > 0)
		var results = nlapiSearchRecord("salesorder","customsearch_overnight_fedex_orders_2",filters1);
	else
		var results = nlapiSearchRecord("salesorder","customsearch_overnight_fedex_orders_2");
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			nlapiLogExecution("debug","Updating Order Internal ID " + results[x].getId(),"FedEx 2Day");
			
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
	if(nlapiGetContext().getSetting("SCRIPT","custscript_test_estate_approval_wf")=="T")
		filters.push(new nlobjSearchFilter("custbodyestate_auto_approved_wf",null,"is","T"));
	var results = nlapiSearchRecord("salesorder","customsearch_overnight_fedex_orders",filters);
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			nlapiLogExecution("debug","Updating Order Internal ID " + results[x].getId(),"FedEx Overnight");
			
			try{
				nlapiSubmitField("salesorder",results[x].getId(),"shipmethod","1965157");	
			}catch(err){
				nlapiLogExecution("error","Error Updating Shipping Method (" + results[x].getId() + ")","Details: " + err.message);
			}
		}
	}
	
	//PUs and APOs
	if(filters1.length > 0)
		var results = nlapiSearchRecord("salesorder","customsearch2991",filters1);
	else
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
