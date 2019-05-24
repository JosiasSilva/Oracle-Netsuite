var lastdays = ["31","28","31","30","31","30","31","31","30","31","30","31"];

function Create_LA_COGS_JE()
{
	try
	{
		//Get LA sales reps
		var reps = [];
		var filters = [];
		filters.push(new nlobjSearchFilter("location",null,"is","10"));
		filters.push(new nlobjSearchFilter("salesrep",null,"is","T"));
		var results = nlapiSearchRecord("employee",null,filters);
		if(results)
		{
			for(var x=0; x < results.length; x++)
				reps.push(results[x].getId());
		}
		
		var filters = [];
		filters.push(new nlobjSearchFilter("location",null,"is","2")); //Item Fulfillment Location = SF
		filters.push(new nlobjSearchFilter("trandate",null,"within","lastmonth"));
		filters.push(new nlobjSearchFilter("account",null,"is","65")); //5030 Cost of Goods Sold
		filters.push(new nlobjSearchFilter("salesrep","createdfrom","anyof",reps));
		filters.push(new nlobjSearchFilter("status",null,"anyof","ItemShip:C"));
		var cols = [];
		cols.push(new nlobjSearchColumn("amount",null,"sum"));
		var results = nlapiSearchRecord("itemfulfillment",null,filters,cols);
		if(results)
		{
			var today = new Date();
			var lastMonth = nlapiAddMonths(today,-1);
			lastMonth.setDate(lastdays[lastMonth.getMonth()]);
			
			var je = nlapiCreateRecord("journalentry");
			je.setFieldValue("trandate",nlapiDateToString(lastMonth,"date"));
			
			//Credit COGS in SF
			je.selectNewLineItem("line");
			je.setCurrentLineItemValue("line","account","65");
			je.setCurrentLineItemValue("line","credit",results[0].getValue("amount",null,"sum"));
			je.setCurrentLineItemValue("line","location","2");
			je.setCurrentLineItemValue("line","memo","Monthly LA COGS JE.");
			je.commitLineItem("line");
			
			//Debit COGS in LA
			je.selectNewLineItem("line");
			je.setCurrentLineItemValue("line","account","65");
			je.setCurrentLineItemValue("line","debit",results[0].getValue("amount",null,"sum"));
			je.setCurrentLineItemValue("line","location","10");
			je.setCurrentLineItemValue("line","memo","Monthly LA COGS JE.");
			je.commitLineItem("line");
			
			nlapiSubmitRecord(je,true,true);
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Creating Monthly LA COGS JE","Details: " + err.message);
		return true;
	}
}
