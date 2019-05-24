function customizeGlImpact(transactionRecord,standardLines,customLines,book)
{
	try
	{
		var type = transactionRecord.getRecordType();
		nlapiLogExecution("debug","Record Type",type);
		
		var trandate = transactionRecord.getFieldValue("trandate");
		var trandateObj = nlapiStringToDate(trandate);
		//var total = transactionRecord.getFieldValue("total");
		var total = 0.00;
		
		var today = new Date(2017,7,29);
		today.setHours(0,0,0,0);
		
		if(trandateObj < today)
		{
			nlapiLogExecution("debug","Older Transaction. Skipping over.");
			return;
		}
		
		
		var exchangeRate = transactionRecord.getFieldValue("exchangerate");
		nlapiLogExecution("debug","Exchange Rate",exchangeRate);
		
		//Determine if UK order
		var shipCountry = transactionRecord.getFieldValue("shipcountry");
		var currency = transactionRecord.getFieldValue("currency");
		if(shipCountry!="GB" && currency!="2")
		{
			nlapiLogExecution("debug","Not UK Order");
			return;
		}
		else if(shipCountry!="GB")
		{
			nlapiLogExecution("debug","Not UK Order");
			return;
		}
		
		if(transactionRecord.getFieldValue("total")==0.00)
		{
			nlapiLogExecution("debug","$0 Order. Script will exit.");
			return;
		}
		
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
			if(account!="159" && account!="8" && account!="168")
			{
				if(type=="creditmemo" || type=="returnauthorization")
				{
					if(debit > 0)
					{
						nlapiLogExecution("debug","Reversing Impact of Standard Line (Debit)","Account: " + account + "  |  Amount: " + credit);
						var newLine = customLines.addNewLine();
						newLine.setCreditAmount(Math.abs(debit));
						newLine.setAccountId(account);
						
						total += Math.abs(debit);
					}
				}
				else
				{
					if(credit > 0)
					{
						nlapiLogExecution("debug","Reversing Impact of Standard Line (Credit)","Account: " + account + "  |  Amount: " + credit);
						var newLine = customLines.addNewLine();
						newLine.setDebitAmount(Math.abs(credit));
						newLine.setAccountId(account);
						
						total += Math.abs(credit);
					}
				}
			}
		}
		
		nlapiLogExecution("debug","Finished reversing any existing standard lines...");
		
		var customTotal = 0.00;
		
		//Add custom lines for item values pulling from item price column, group by income account on item record
		/*
		var filters = [];
		filters.push(new nlobjSearchFilter("internalid",null,"is",transactionRecord.getId()));
		filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
		filters.push(new nlobjSearchFilter("taxline",null,"is","F"));
		filters.push(new nlobjSearchFilter("shipping",null,"is","F"));
		var cols = [];
		//cols.push(new nlobjSearchColumn("incomeaccount","item","group"));
		cols.push(new nlobjSearchColumn("custcol_item_price",null,"sum"));
		var results = nlapiSearchRecord(type,null,filters,cols);
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				//nlapiLogExecution("debug","Add Line","Account: " + results[x].getValue("incomeaccount","item","group") + "  |  Amount: " + results[x].getValue("custcol_item_price",null,"sum") * exchangeRate);
				nlapiLogExecution("debug","Add Line","Amount: " + results[x].getValue("custcol_item_price",null,"sum") * exchangeRate);
				
				//if(results[x].getValue("incomeaccount","item","group")!=null && results[x].getValue("incomeaccount","item","group")!="" && results[x].getValue("custcol_item_price",null,"sum")!=null && results[x].getValue("custcol_item_price",null,"sum")!="" && results[x].getValue("custcol_item_price",null,"sum") > 0)
				if(results[x].getValue("custcol_item_price",null,"sum")!=null && results[x].getValue("custcol_item_price",null,"sum")!="" && results[x].getValue("custcol_item_price",null,"sum") > 0)
				{
					//Add new lines for Item Price values per Income Account group
					var newLine = customLines.addNewLine();
					newLine.setCreditAmount(nlapiFormatCurrency(results[x].getValue("custcol_item_price",null,"sum") * exchangeRate));
					newLine.setAccountId(56); //4010 Sales	
					
					customTotal += parseFloat(nlapiFormatCurrency(results[x].getValue("custcol_item_price",null,"sum") * exchangeRate));
				}
			}
		}
		*/
		var itemPrice = 0.00;
		
		for(var x=0; x < transactionRecord.getLineItemCount("item"); x++)
		{
			var lineItemPrice = transactionRecord.getLineItemValue("item","custcol_item_price",x+1);
			nlapiLogExecution("debug","Item Price: " + lineItemPrice);
			
			if(lineItemPrice!=null && lineItemPrice!="")
				itemPrice += parseFloat(lineItemPrice);
		}
		
		var newLine = customLines.addNewLine();
		if(type=="creditmemo" || type=="returnauthorization")
			newLine.setDebitAmount(nlapiFormatCurrency(itemPrice * exchangeRate));
		else
			newLine.setCreditAmount(nlapiFormatCurrency(itemPrice * exchangeRate));
		newLine.setAccountId(56); //4010 Sales	
		
		customTotal += parseFloat(nlapiFormatCurrency(itemPrice * exchangeRate));
		
		//Add combined VAT + Duty line
		var totalVAT = transactionRecord.getFieldValue("custbody_total_vat_amount");
		if(totalVAT==null || totalVAT=="")
			totalVAT = 0.00;
		
		var totalDuty = transactionRecord.getFieldValue("custbody_total_duty_amount");
		if(totalDuty==null || totalDuty=="")
			totalDuty = 0.00;
		
		nlapiLogExecution("debug","Total VAT",totalVAT);
		nlapiLogExecution("debug","Total Duty",totalDuty);
		
		var totalVATDuty = (parseFloat(totalVAT) + parseFloat(totalDuty)) * exchangeRate;
		
		if(totalVATDuty > 0)
		{
			var newLine = customLines.addNewLine();
			if(type=="creditmemo" || type=="returnauthorization")
				newLine.setDebitAmount(nlapiFormatCurrency(totalVATDuty));
			else
				newLine.setCreditAmount(nlapiFormatCurrency(totalVATDuty));
			newLine.setAccountId(720);
			
			nlapiLogExecution("debug","Add VAT Line","Amount: " + totalVATDuty);
			
			customTotal += parseFloat(nlapiFormatCurrency(totalVATDuty));
		}
		
		total = parseFloat(nlapiFormatCurrency(total));
		
		nlapiLogExecution("debug","Order Total: " + total,"Custom Total: " + customTotal);
		
		if(nlapiFormatCurrency(total)!=nlapiFormatCurrency(customTotal))
		{
			//Account for variance if within $0.02
			if(Math.abs(total - customTotal) < 0.03)
			{
				var difference = total - customTotal;
				nlapiLogExecution("debug","Difference",difference);
				
				if(type=="creditmemo" || type=="returnauthorization")
				{
					var newLine = customLines.addNewLine();
					if(difference > 0)
					{
						difference = Math.abs(difference);
						difference = nlapiFormatCurrency(difference);
						newLine.setDebitAmount(difference);
					}
					else
					{
						difference = Math.abs(difference);
						difference = nlapiFormatCurrency(difference);
						newLine.setCreditAmount(difference);
					}
						
					newLine.setAccountId(56); //4010 Sales
				}
				else
				{
					var newLine = customLines.addNewLine();
					if(difference > 0)
					{
						difference = Math.abs(difference);
						difference = nlapiFormatCurrency(difference);
						newLine.setCreditAmount(difference);
					}
					else
					{
						difference = Math.abs(difference);
						difference = nlapiFormatCurrency(difference);
						newLine.setDebitAmount(difference);
					}
						
					newLine.setAccountId(56); //4010 Sales
				}
				
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Calculating UK GL Impact","Details: " + err.message);
	}
	
}
