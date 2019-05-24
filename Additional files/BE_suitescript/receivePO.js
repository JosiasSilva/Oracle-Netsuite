nlapiLogExecution("audit","FLOStart",new Date().getTime());
function receivePO()
{
	try{
		//Run search to find open POs
		var PO
		
		var results = nlapiSearchRecord("transaction", "customsearch359")
		if(results!=null)
		{
			PO = new Array()
			for(var x=0; x < results.length; x++)
			{
				PO[x] = new Array()
				PO[x]["internalid"] = results[x].getValue("internalid", null, "group")
				PO[x]["trandate"] = results[x].getValue("trandate",  "billingtransaction", "max")
				PO[x]["postingperiod"] = results[x].getValue("postingperiod", "billingtransaction", "max")
				PO[x]["number"] = results[x].getValue("tranid", null, "group")
			}
		}
	}
	catch(err){
		nlapiLogExecution("error", "Error Occurred", "An error occurred while getting PO internal IDs. Details: " + err.message)
		return
	}
	
	if(PO!=null)
	{
		for(var x=0; x < 200; x++)
		{
			try{
				nlapiLogExecution("error", "Beginning Transform", "Beginning Receipt Of PO# " + PO[x]["number"])
				
				var receipt = nlapiTransformRecord("purchaseorder", PO[x]["internalid"], "itemreceipt")
				receipt.setFieldText("postingperiod", PO[x]["postingperiod"])
				
				var tranDate = ""
				switch(PO[x]["postingperiod"])
				{
					case "Jan 2010":
						tranDate = "1/1/2010"
						break;
					case "Feb 2010":
						tranDate = "2/1/2010"
						break;
					case "Mar 2010":
						tranDate = "3/1/2010"
						break;
					case "Apr 2010":
						tranDate = "4/1/2010"
						break;
					case "May 2010":
						tranDate = "5/1/2010"
						break;
					case "Jun 2010":
						tranDate = "6/1/2010"
						break;
					case "Jul 2010":
						tranDate = "7/1/2010"
						break;
					case "Aug 2010":
						tranDate = "8/1/2010"
						break;
					case "Sep 2010":
						tranDate = "9/1/2010"
						break;
					case "Oct 2010":
						tranDate = "10/1/2010"
						break;
					case "Nov 2010":
						tranDate = "11/1/2010"
						break;
					case "Dec 2010":
						tranDate = "12/1/2010"
						break;
				}
				receipt.setFieldValue("trandate", tranDate)
				for(var i=1; i <= receipt.getLineItemCount("item"); i++)
				{
					receipt.setLineItemValue("item", "itemreceive", i, "T")
					receipt.setLineItemValue("item", "location", i, 1) //BE Fulfillment-CH
				}
				nlapiSubmitRecord(receipt, true, true)
				
				nlapiLogExecution("error", "Receive PO", "Received PO # " + PO[x]["number"])
			}
			catch(err){
				nlapiLogExecution("error", "Error Occurred", "An error occurred while receiving PO # " + PO[x]["number"] + ". Details: " + err.message)
				return
			}
		}
	}
}
