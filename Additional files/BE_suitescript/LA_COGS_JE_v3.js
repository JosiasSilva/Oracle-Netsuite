var lastdays = ["31","28","31","30","31","30","31","31","30","31","30","31"];

function Create_LA_COGS_JE()
{
	try
	{
		var je = null;
		
		var today = new Date();
		var lastMonth = nlapiAddMonths(today,-1);
		lastMonth.setDate(lastdays[lastMonth.getMonth()]);
		
		//LA
		var results = nlapiSearchRecord("itemfulfillment","customsearch2408");
		if(results)
		{
			if(je==null)
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
		}
		
		//BOSTON
		var results = nlapiSearchRecord("itemfulfillment","customsearch3512"); //Boston COGS Monthly JE - Summary
		if(results)
		{
			if(je==null)
				var je = nlapiCreateRecord("journalentry");
			
			je.setFieldValue("trandate",nlapiDateToString(lastMonth,"date"));
			
			//Credit COGS in SF
			je.selectNewLineItem("line");
			je.setCurrentLineItemValue("line","account","65");
			je.setCurrentLineItemValue("line","credit",results[0].getValue("amount",null,"sum"));
			je.setCurrentLineItemValue("line","location","2");
			je.setCurrentLineItemValue("line","memo","Monthly Boston COGS JE.");
			je.commitLineItem("line");
			
			//Debit COGS in Boston
			je.selectNewLineItem("line");
			je.setCurrentLineItemValue("line","account","65");
			je.setCurrentLineItemValue("line","debit",results[0].getValue("amount",null,"sum"));
			je.setCurrentLineItemValue("line","location","14");
			je.setCurrentLineItemValue("line","memo","Monthly Boston COGS JE.");
			je.commitLineItem("line");
		}
		
		if(je!=null)
			nlapiSubmitRecord(je,true,true);
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Creating Monthly LA and Boston COGS JE","Details: " + err.message);
		return true;
	}
}
