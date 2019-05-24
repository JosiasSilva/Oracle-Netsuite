function Set_Shipping_Methods()
{
	var filters1 = [];
	
	if(nlapiGetContext().getSetting("SCRIPT","custscript_test_estate_approval_wf")=="T")
		filters1.push(new nlobjSearchFilter("custbodyestate_auto_approved_wf",null,"is","T"));
		
	if(nlapiGetContext().getSetting("SCRIPT","custscript_ship_method_update_test")=="T")
		filters1.push(new nlobjSearchFilter("custbody_test_order",null,"is","T"));
		
	//FedEx Overnight
	if(filters1.length > 0)
		var results1 = nlapiSearchRecord("salesorder","customsearch_overnight_fedex_orders",filters1);
	else
		var results1 = nlapiSearchRecord("salesorder","customsearch_overnight_fedex_orders");
	if(results1)
	{
		for(var x=0; x < results1.length; x++)
		{
			nlapiLogExecution("debug","Updating Order Internal ID " + results1[x].getId(),"FedEx Overnight");
			
			try{
				nlapiSubmitField("salesorder",results1[x].getId(),"shipmethod","1965157");	
			}catch(err){
				nlapiLogExecution("error","Error Updating Shipping Method (" + results1[x].getId() + ")","Details: " + err.message);
			}
		}
	}
	
	//Fedex 2Day
	if(filters1.length > 0)
		var results2 = nlapiSearchRecord("salesorder","customsearch_overnight_fedex_orders_2",filters1);
	else
		var results2 = nlapiSearchRecord("salesorder","customsearch_overnight_fedex_orders_2");
	if(results2)
	{
		for(var x=0; x < results2.length; x++)
		{
			nlapiLogExecution("debug","Updating Order Internal ID " + results2[x].getId(),"FedEx 2Day");
			
			try{
				nlapiSubmitField("salesorder",results2[x].getId(),"shipmethod","2221264");	
			}catch(err){
				nlapiLogExecution("error","Error Updating Shipping Method (" + results2[x].getId() + ")","Details: " + err.message);
			}
		}
	}
	
	//PUs and APOs
	if(filters1.length > 0)
		var results3 = nlapiSearchRecord("salesorder","customsearch2991",filters1);
	else
		var results3 = nlapiSearchRecord("salesorder","customsearch2991");
	if(results3)
	{
		for(var x=0; x < results3.length; x++)
		{
			nlapiLogExecution("debug","Updating Order Internal ID " + results3[x].getValue("internalid",null,"group"),"PU/APO");
			
			try{
				nlapiSubmitField("salesorder",results3[x].getValue("internalid",null,"group"),"shipmethod","2421916");	
			}catch(err){
				nlapiLogExecution("error","Error Updating Shipping Method (" + results3[x].getValue("internalid",null,"group") + ")","Details: " + err.message);
			}
		}
	}
	
	//Drop Ship - Web Services
	var dsSearch,dsShipMethod;
	if(nlapiGetContext().getEnvironment()=="PRODUCTION")
	{
		dsSearch = "customsearch5274";
		dsShipMethod = "4459837";
	}
	else
	{
		dsSearch = "customsearch4718";
		dsShipMethod = "3839901";
	}
	if(filters1.length > 0)
		var results4 = nlapiSearchRecord("salesorder",dsSearch,filters1);
	else
		var results4 = nlapiSearchRecord("salesorder",dsSearch);
	if(results4)
	{
		for(var x=0; x < results4.length; x++)
		{
			nlapiLogExecution("debug","Updating Order Internal ID " + results4[x].getId(),"Drop Ship - Web Services");
			
			try{
				nlapiSubmitField("salesorder",results4[x].getId(),"shipmethod",dsShipMethod);	
			}catch(err){
				nlapiLogExecution("error","Error Updating Shipping Method (" + results4[x].getId() + ")","Details: " + err.message);
			}
		}
	}
	
	//International
	var intlSearch,intlShipMethod;
	if(nlapiGetContext().getEnvironment()=="PRODUCTION")
	{
		intlSearch = "customsearch5220";
		intlShipMethod = "2531266";
	}
	else
	{
		intlSearch = "customsearch4707";
		intlShipMethod = "2531266";
	}
	if(filters1.length > 0)
		var results5 = nlapiSearchRecord("salesorder",intlSearch,filters1);
	else
		var results5 = nlapiSearchRecord("salesorder",intlSearch);
	if(results5)
	{
		for(var x=0; x < results5.length; x++)
		{
			nlapiLogExecution("debug","Updating Order Internal ID " + results5[x].getId(),"FedEx International Priority");
			
			try{
				nlapiSubmitField("salesorder",results5[x].getId(),"shipmethod",intlShipMethod);	
			}catch(err){
				nlapiLogExecution("error","Error Updating Shipping Method (" + results5[x].getId() + ")","Details: " + err.message);
			}
		}
	}
	
	//Queue up Auto Fulfillment Scheduled Script
	//nlapiScheduleScript("customscript_automated_fulfillment","customdeploy_automated_fulfillment");
}
