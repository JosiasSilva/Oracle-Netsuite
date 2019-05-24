nlapiLogExecution("audit","FLOStart",new Date().getTime());
var lastdays = ["31","28","31","30","31","30","31","31","30","31","30","31"];

function Create_LA_COGS_JE()
{
	try
	{
		var results = nlapiSearchRecord("itemfulfillment","customsearch2408");
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
