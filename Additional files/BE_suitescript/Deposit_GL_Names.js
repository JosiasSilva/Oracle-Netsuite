function customizeGlImpact(transactionRecord,standardLines,customLines,book)
{
	try
	{
		//Clear custom line values so far to reset
		for(var x=0; x < customLines.getCount(); x++)
		{
			var line = customLines.getLine(x);
			line.setCreditAmount(0);
			line.setDebitAmount(0);
		}
		
		nlapiLogExecution("debug","Finished removing any existing custom lines...");
		
		for(var x=0; x < standardLines.getCount(); x++)
		{
			//Get current line values
			var line = standardLines.getLine(x);
			
			var account = line.getAccountId();
			var classification = line.getClassId();
			var credit = line.getCreditAmount();
			var debit = line.getDebitAmount();
			var location = line.getLocationId();
			
			//Reverse out impact (do not include A/R, Sales Order, and Return Authorizations accounts)
			if(account=="322")
			{
				if(debit > 0)
				{
					nlapiLogExecution("debug","Reversing Impact of Standard Line (Debit)","Account: " + account + "  |  Amount: " + credit);
					var newLine = customLines.addNewLine();
					newLine.setCreditAmount(Math.abs(debit));
					newLine.setAccountId(account);
				}
			}
		}
		
		nlapiLogExecution("debug","Finished reversing any existing standard lines...");
		
		//Get all transactions where the amount is not USD
		var transactions = [];
		var transactionIds = [];
		
		var sublistFields = transactionRecord.getAllLineItemFields("payment");
		
		nlapiLogExecution("debug","Payment Sublist Fields",JSON.stringify(sublistFields));
		
		for(var x=0; x < transactionRecord.getLineItemCount("payment"); x++)
		{
			if(transactionRecord.getLineItemValue("payment","deposit",x+1)=="T")
			{
				transactionIds.push(transactionRecord.getLineItemValue("payment","id",x+1));
				
				transactions.push({
					id : transactionRecord.getLineItemValue("payment","id",x+1),
					depAmt : transactionRecord.getLineItemValue("payment","paymentamount",x+1)
				});
			}
		}
		
		var filters = [];
		filters.push(new nlobjSearchFilter("internalid",null,"anyof",transactionIds));
		filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
		filters.push(new nlobjSearchFilter("currency",null,"noneof","1"));
		var cols = [];
		cols.push(new nlobjSearchColumn("entity"));
		cols.push(new nlobjSearchColumn("total"));
		var results = nlapiSearchRecord("transaction",null,filters,cols);
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				for(var i=0; i < transactions.length; i++)
				{
					if(results[x].getId() == transactions[i].id)
					{
						var depAmt = transactions[i].depAmt;
						var tranAmt = results[x].getValue("total");
						
						nlapiLogExecution("debug","Transaction Internal ID: " + results[x].getId(),"Deposit Amount: " + depAmt + "  |  Transaction Amount: " + tranAmt);
						
						var diff = parseFloat(tranAmt) - parseFloat(depAmt);
						nlapiLogExecution("debug","Unrealized Gain/Loss",diff);
						
						//Reverse gain/loss in amount of difference
						var newLine = customLines.addNewLine();
						if(diff < 0)
							newLine.setDebitAmount(Math.abs(diff));
						else
							newLine.setCreditAmount(Math.abs(diff));
						newLine.setAccountId(322);
						
						//Re-apply gain/loss amount with customer name
						var newLine = customLines.addNewLine();
						if(diff < 0)
							newLine.setCreditAmount(Math.abs(diff));
						else
							newLine.setDebitAmount(Math.abs(diff));
						newLine.setAccountId(322);
						newLine.setEntityId(parseInt(results[x].getValue("entity")));
						
						
						//Reverse Undeposited Funds in amount of difference
						var newLine = customLines.addNewLine();
						if(diff < 0)
							newLine.setCreditAmount(Math.abs(diff));
						else
							newLine.setDebitAmount(Math.abs(diff));
						newLine.setAccountId(13);
						
						//Re-apply Undeposited Funds amount with customer name
						var newLine = customLines.addNewLine();
						if(diff < 0)
							newLine.setDebitAmount(Math.abs(diff));
						else
							newLine.setCreditAmount(Math.abs(diff));
						newLine.setAccountId(13);
						newLine.setEntityId(parseInt(results[x].getValue("entity")));
						
						break;
					}
				}
			}
		}
		
		nlapiLogExecution("debug","Transactions JSON",JSON.stringify(transactions));
		
		for(var x=0; x < transactions.length; x++)
		{
			//transactions[x].transAmt = nlapiLookupField("",transactions[x].id,"total");
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Calculating UK GL Impact","Details: " + err.message);
	}
	
}
