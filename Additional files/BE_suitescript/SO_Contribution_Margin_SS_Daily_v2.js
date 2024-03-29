/*
 * Title: Calculate Sales Order Contribution Margin
 * Type: User Event - After Submit
 * Units: 30
 * 
 * Description: Scripts runs when creating or editting a sales order. It will calculate the contribution margin based on 
 * total revenue and COGS. COGS is determined by the Billed PO rate (unbilled POs will exit the script) or the last purchase
 * price on the item itself.
 */
function Run_Daily_Contribution_Margin()
{
	try
	{	
		var results = nlapiSearchRecord("transaction","customsearch689");
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				nlapiLogExecution("debug","Sales Order Internal ID",results[x].getValue("internalid",null,"group"));
				setContributionMargin(results[x].getValue("internalid",null,"group"));
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error", "Calc Contribution Margin Error", "Error finding Sales Order internal ID. Details: " + err.message)
		return true
	}
}

function setContributionMargin(soID)
{
	var lineItems = [];
	var revenue = 0.00;
	var COGS = 0;
	
	try
	{
		//Run SO Search To Get Order and Line Item Data
		var filters = [];
		filters.push(new nlobjSearchFilter("internalid", null, "is", soID));
		filters.push(new nlobjSearchFilter("mainline", null, "is", "F"));
		filters.push(new nlobjSearchFilter("shipping", null, "is", "F"));
		filters.push(new nlobjSearchFilter("taxline", null, "is", "F"));
		filters.push(new nlobjSearchFilter("custbody_contribution_margin",null,"isempty"));
		
		var columns = [];
		columns.push(new nlobjSearchColumn("internalid"));
		columns.push(new nlobjSearchColumn("tranid"));
		columns.push(new nlobjSearchColumn("item"));
		columns.push(new nlobjSearchColumn("quantityuom"));
		columns.push(new nlobjSearchColumn("netamountnotax"));
		columns.push(new nlobjSearchColumn("purchaseorder"));
		columns.push(new nlobjSearchColumn("status", "purchaseorder"));
		columns.push(new nlobjSearchColumn("amount", "purchaseorder"));
		columns.push(new nlobjSearchColumn("lastpurchaseprice","item"));
		columns.push(new nlobjSearchColumn("cost","item"));
		
		var results = nlapiSearchRecord("salesorder",null,filters,columns);
		if(results!=null)
		{
			//revenue = results[0].getValue("netamountnotax")
			
			for(var x=0; x < results.length; x++)
			{
				if(results[x].getValue("netamountnotax")!="" && results[x].getValue("netamountnotax")!=null)
					revenue += parseFloat(results[x].getValue("netamountnotax"));
					
				var line = {
					item : results[x].getValue("item"),
					quantity : results[x].getValue("quantityuom"),
					po : results[x].getValue("purchaseorder"),
					po_status : results[x].getValue("status","purchaseorder"),
					po_amount : results[x].getValue("amount","purchaseorder"),
					lastpurchaseprice : results[x].getValue("lastpurchaseprice","item"),
					purchaseprice : results[x].getValue("cost","item")
				};
				
				//lineItems[x] = new Array();
				//lineItems[x]["item"] = results[x].getValue("item");
				//lineItems[x]["quantity"] = results[x].getValue("quantityuom");
				//lineItems[x]["po"] = results[x].getValue("purchaseorder");
				//lineItems[x]["po_status"] = results[x].getValue("status","purchaseorder");
				//lineItems[x]["po_amount"] = results[x].getValue("amount","purchaseorder");
				//lineItems[x]["lastpurchaseprice"] = results[x].getValue("lastpurchaseprice","item");
				
				//Check and reset null values (Added 7-9-2011)
				if(line.lastpurchaseprice==null || line.lastpurchaseprice=="")
					line.lastpurchaseprice = 0.00;
					
				if(line.purchaseprice==null || line.purchaseprice=="")
					line.purchaseprice = 0.00;
					
				if(line.po_amount==null || line.po_amount=="")
					line.po_amount = 0.00;
					
				//Added to handle service/discount items without a quantity value
				if(line.quantity==null || line.quantity=="")
					line.quantity = 1;
					
				lineItems.push(line);
			}
			
			nlapiLogExecution("debug","Items",JSON.stringify(lineItems));
			nlapiLogExecution("debug","Total Revenue",revenue);
		}
		else
		{
			nlapiLogExecution("error", "Calc Contribution Margin Error", "No results found looking for SO Internal ID. Exiting the script.");
			return true;
		}
		nlapiLogExecution("debug","Script Execution","Finished Getting Data");
	}
	catch(err)
	{
		nlapiLogExecution("error", "Calc Contribution Margin Error", "Error getting sales order line item data. Details: " + err.message)
		emailErrorLog("Error calculating contribution margin on sales order ID " + soID + ". Error getting revenue and line item data. Details: " + err.message)
		return true	
	}
	
	try
	{
		//Calculate COGS
		nlapiLogExecution("debug","lineItems length",lineItems.length);
		
		for(var x=0; x < lineItems.length; x++)
		{
			nlapiLogExecution("debug","lineItems[" + x + "]");
			
			if(lineItems[x].po==null || lineItems[x].po=="")
			{
				if(lineItems[x].lastpurchaseprice!=null && lineItems[x].lastpurchaseprice!="" && lineItems[x].lastpurchaseprice!=0)
				{
					//IF NO PO ASSOCIATED THEN USE LAST PURCHASE PRICE
					COGS += (parseFloat(lineItems[x].lastpurchaseprice) * parseFloat(lineItems[x].quantity));
					nlapiLogExecution("debug","Script Execution","COGS (LPP): " + (parseFloat(lineItems[x].lastpurchaseprice) * parseFloat(lineItems[x].quantity)));	
				}
				else
				{
					//IF LAST PURCHASE PRICE IS EMPTY THEN USE PURCHASE PRICE FIELD
					COGS += (parseFloat(lineItems[x].purchaseprice) * parseFloat(lineItems[x].quantity));
					nlapiLogExecution("debug","Script Execution","COGS (PP): " + (parseFloat(lineItems[x].purchaseprice) * parseFloat(lineItems[x].quantity)));
				}
			}
			else
			{
				//IF PO FOUND CHECK STATUS AND USE PO AMOUNT
				if(lineItems[x].po_status!="fullyBilled")
				{
					nlapiLogExecution("debug","Script Execution","PO Status: " + lineItems[x].po_status)
					//IF PO NOT BILLED THEN EXIT SCRIPT
					nlapiLogExecution("debug", "Calc Contribution Margin Error", "PO found that has not been billed. Script will now exit.")
					return true
				}
				else
				{
					nlapiLogExecution("debug","Script Execution","PO Status: " + lineItems[x].po_status);
					nlapiLogExecution("debug","Script Execution","COGS (PO): " + lineItems[x].po_amount);
					COGS += parseFloat(lineItems[x].po_amount)
				}
			}
		}
		nlapiLogExecution("debug","Script Execution","Calculated COGS: " + COGS)
	}
	catch(err)
	{
		nlapiLogExecution("error", "Calc Contribution Margin Error", "Error calculating COGS for sales order ID " + soID + ". Details: " + err.message)
		emailErrorLog("Error calculating contribution margin on sales order ID " + soID + ". Error finding COGS. Details: " + err.message)
		return true	
	}
	
	try
	{
		//Calculate Contribution Margin and Set on Sales Order (percent to one decimal place)
		if(parseFloat(revenue)<= 0)
		{
			var contributionMargin = 0;
		}
		else
		{
			var contributionMargin = Math.round(parseFloat((1 - (COGS / parseFloat(revenue))) * 100) * 10)/10;	
		}
		var contributionMarginAmount = nlapiFormatCurrency(parseFloat(revenue) - COGS);
		var fields = ["custbody_contribution_margin","custbody_contribution_margin_amt"];
		var data = [contributionMargin,contributionMarginAmount];
		
		nlapiSubmitField("salesorder",soID,fields,data);
		nlapiLogExecution("debug","Script Execution (DEBUG)","Calculated contribution margin %: " + contributionMargin);
		nlapiLogExecution("debug","Script Execution (DEBUG)","Calculated contribution margin $: " + contributionMarginAmount);
	}
	catch(err)
	{
		nlapiLogExecution("error", "Calc Contribution Margin Error", "Error calculating contribution margin and setting field on sales order ID " + soID + ". Details: " + err.message)
		emailErrorLog("Error calculating contribution margin on sales order ID " + soID + ". Error during margin calculations. Details: " + err.message)
		return true	
	}	
}

function emailErrorLog(logMsg)
{
	//Send email log for further debugging
	try {
		nlapiSendEmail(nlapiGetUser(),'travis.buffington@gmail.com','BE Sales Order Contribution Margin Script Error',logMsg);
	} 
	catch (e) {
	}
}
