function customizeGlImpact(transactionRecord,standardLines,customLines,book)
{
	var type = transactionRecord.getRecordType();
	nlapiLogExecution("debug","Record Type",type);
	
	var trandate = transactionRecord.getFieldValue("trandate");
	var trandateObj = nlapiStringToDate(trandate);
	
	var today = new Date();
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
		
		//Reverse out impact (do not include A/R and Sales Order accounts)
		if(account!="159" && account!="8")
		{
			if(credit > 0)
			{
				nlapiLogExecution("debug","Reversing Impact of Standard Line","Account: " + account + "  |  Amount: " + credit);
				var newLine = customLines.addNewLine();
				newLine.setDebitAmount(Math.abs(credit));
				newLine.setAccountId(account);
			}
		}
	}
	
	nlapiLogExecution("debug","Finished reversing any existing standard lines...");
	
	//Add custom lines for item values pulling from item price column, group by income account on item record
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
			}
		}
	}
	
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
		newLine.setCreditAmount(nlapiFormatCurrency(totalVATDuty));
		newLine.setAccountId(684);
		
		nlapiLogExecution("debug","Add VAT Line","Amount: " + totalVATDuty);
	}
}
