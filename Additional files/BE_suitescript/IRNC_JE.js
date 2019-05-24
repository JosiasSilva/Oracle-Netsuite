function IRNC_JE()
{
	//Find all item fulfillments for VRA's today
	//Only find those without an item receipt
	
	var results = nlapiSearchRecord("transaction","customsearch_irnc_je_search");
	if(results)
	{
		var je = nlapiCreateRecord("journalentry");
		je.setFieldValue("customform","197"); //Custom Journal Entry 2
		je.setFieldValue("memo","Automated IRNC adjustment");
		
		for(var x=0; x < results.length; x++)
		{
			var debitAccount, creditAccount;
			
			switch(results[x].getValue("assetaccount","item"))
			{
				case "10": //1200
				case "165": //1200-01
				case "180": //1200-03
				case "173": //1200-04
				case "199": //1200-05
				case "182": //1200-06
				case "177": //1200-07
				case "183": //1200-08
				case "178": //1200-09
				case "256": //1200-12
					creditAccount = nlapiGetContext().getSetting("SCRIPT","custscript_owned_inventory_credit");
					debitAccount = nlapiGetContext().getSetting("SCRIPT","custscript_owned_inventory_debit");
					break;
				case "189": //1210
				case "270": //1211
					creditAccount = nlapiGetContext().getSetting("SCRIPT","custscript_memo_inventory_credit");
					debitAccount = nlapiGetContext().getSetting("SCRIPT","custscript_memo_inventory_debit");
					break;
			}
			
			je.selectNewLineItem("line");
			je.setCurrentLineItemValue("line","account",debitAccount);
			je.setCurrentLineItemValue("line","debit",results[x].getValue("amount","fulfillingtransaction")); //applyingtransaction
			je.setCurrentLineItemValue("line","custcol_je_item_receipt",results[x].getValue("fulfillingtransaction"));
			je.setCurrentLineItemValue("line","custcol_je_item",results[x].getValue("item"));
			je.setCurrentLineItemValue("line","custcol_je_vra",results[x].getValue("applyingtransaction"));
			je.commitLineItem("line");
			
			je.selectNewLineItem("line");
			je.setCurrentLineItemValue("line","account",creditAccount);
			je.setCurrentLineItemValue("line","credit",results[x].getValue("amount","fulfillingtransaction"));
			je.setCurrentLineItemValue("line","custcol_je_item_receipt",results[x].getValue("fulfillingtransaction"));
			je.setCurrentLineItemValue("line","custcol_je_item",results[x].getValue("item"));
			je.setCurrentLineItemValue("line","custcol_je_vra",results[x].getValue("applyingtransaction"));
			je.commitLineItem("line");
		}
		
		je.setFieldValue("custbody_irnc_je","T");
		
		nlapiSubmitRecord(je,true,true);
	}
}
