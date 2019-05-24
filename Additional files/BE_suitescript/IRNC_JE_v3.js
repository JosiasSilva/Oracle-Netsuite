nlapiLogExecution("audit","FLOStart",new Date().getTime());
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
				case "244": //1200-11
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
			je.setCurrentLineItemValue("line","memo","Automated Inventory Received Not Credited (IRNC) adjustment");
			je.commitLineItem("line");
			
			je.selectNewLineItem("line");
			je.setCurrentLineItemValue("line","account",creditAccount);
			je.setCurrentLineItemValue("line","credit",results[x].getValue("amount","fulfillingtransaction"));
			je.setCurrentLineItemValue("line","custcol_je_item_receipt",results[x].getValue("fulfillingtransaction"));
			je.setCurrentLineItemValue("line","custcol_je_item",results[x].getValue("item"));
			je.setCurrentLineItemValue("line","custcol_je_vra",results[x].getValue("applyingtransaction"));
			je.setCurrentLineItemValue("line","memo","Automated Inventory Received Not Credited (IRNC) adjustment");
			je.commitLineItem("line");
		}
		
		je.setFieldValue("custbody_irnc_je","T");
		
		var jeID = nlapiSubmitRecord(je,true,true);
		
		//Update PO Lines with IRNC JE#
		for(var x=0; x < results.length; x++)
		{
			checkGovernance();
			
			var poID = results[x].getId();
			var poRec = nlapiLoadRecord("purchaseorder",poID);
			for(var i=0; i < poRec.getLineItemCount("item"); i++)
			{
				if(poRec.getLineItemValue("item","line",i+1)==results[x].getValue("line"))
				{
					poRec.setLineItemValue("item","custcol_irnc_je",i+1,jeID);
					break;
				}
			}
			nlapiSubmitRecord(poRec,true,true);
		}
	}
}

function checkGovernance()
{
	var context = nlapiGetContext();
	if(context.getRemainingUsage() < 100)
	{
 		var state = nlapiYieldScript();
		if(state.status == 'FAILURE')
     	{
      		nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = "+state.reason + " / Size = "+ state.size);
   			throw "Failed to yield script";
  		} 
  		else if(state.status == 'RESUME')
  		{
   			nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
  		}
  		// state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
 	}
}