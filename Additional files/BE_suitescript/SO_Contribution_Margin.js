function calcSOContributionMargin(type)
{
	if(type=="create" || type=="edit")
	{
		nlapiLogExecution("debug","Script Execution","In Script")
		try
		{
			//Get Sales Order Internal ID
			var soID = nlapiGetRecordId()
		}
		catch(err)
		{
			nlapiLogExecution("error", "Calc Contribution Margin Error", "Error finding Sales Order internal ID. Details: " + err.message)
			return true
		}
		
		try
		{
			var lineItems = new Array()
			
			var revenue
			
			//Run SO Search To Get Order and Line Item Data
			var filters = new Array()
			filters.push(new nlobjSearchFilter("internalid", null, "is", soID))
			filters.push(new nlobjSearchFilter("mainline", null, "is", "F"))
			filters.push(new nlobjSearchFilter("shipping", null, "is", "F"))
			filters.push(new nlobjSearchFilter("taxline", null, "is", "F"))
			
			var columns = new Array()
			columns.push(new nlobjSearchColumn("internalid"))
			columns.push(new nlobjSearchColumn("tranid"))
			columns.push(new nlobjSearchColumn("item"))
			columns.push(new nlobjSearchColumn("quantityuom"))
			columns.push(new nlobjSearchColumn("netamountnotax"))
			columns.push(new nlobjSearchColumn("purchaseorder"))
			columns.push(new nlobjSearchColumn("status", "purchaseorder"))
			columns.push(new nlobjSearchColumn("amount", "purchaseorder"))
			columns.push(new nlobjSearchColumn("lastpurchaseprice","item"))
			
			var results = nlapiSearchRecord("salesorder",null,filters,columns)
			if(results!=null)
			{
				revenue = results[0].getValue("netamountnotax")
				
				for(var x=0; x < results.length; x++)
				{
					lineItems[x] = new Array()
					lineItems[x]["item"] = results[x].getValue("item")
					lineItems[x]["quantity"] = results[x].getValue("quantityuom")
					lineItems[x]["po"] = results[x].getValue("purchaseorder")
					lineItems[x]["po_status"] = results[x].getValue("status","purchaseorder")
					lineItems[x]["po_amount"] = results[x].getValue("amount","purchaseorder")
					lineItems[x]["lastpurchaseprice"] = results[x].getValue("lastpurchaseprice","item")
				}
			}
			else
			{
				nlapiLogExecution("error", "Calc Contribution Margin Error", "No results found looking for SO Internal ID. Exiting the script.")
				return true
			}
			nlapiLogExecution("debug","Script Execution","Finished Getting Data")
		}
		catch(err)
		{
			nlapiLogExecution("error", "Calc Contribution Margin Error", "Error getting sales order line item data. Details: " + err.message)
			return true	
		}
		
		try
		{
			var COGS = 0
			
			//Calculate COGS
			for(var x=0; x < lineItems.length; x++)
			{
				if(lineItems[x]["po"]==null || lineItems[x]["po"]=="")
				{
					//IF NO PO ASSOCIATED THEN USE LAST PURCHASE PRICE
					COGS += (parseFloat(lineItems[x]["lastpurchaseprice"]) * parseFloat(lineItems[x]["quantity"]))
					nlapiLogExecution("debug","Script Execution","COGS (LPP): " + (parseFloat(lineItems[x]["lastpurchaseprice"]) * parseFloat(lineItems[x]["quantity"])))
				}
				else
				{
					//IF PO FOUND CHECK STATUS AND USE PO AMOUNT
					if(lineItems[x]["po_status"]!="fullyBilled")
					{
						nlapiLogExecution("debug","Script Execution","PO Status: " + lineItems[x]["po_status"])
						//IF PO NOT BILLED THEN EXIT SCRIPT
						nlapiLogExecution("error", "Calc Contribution Margin Error", "PO found that has not been billed. Script will now exit.")
						return true
					}
					else
					{
						nlapiLogExecution("debug","Script Execution","COGS (PO): " + lineItems[x]["po_amount"])
						COGS += parseFloat(lineItems[x]["po_amount"])
					}
				}
			}
			nlapiLogExecution("debug","Script Execution","Calculated COGS: " + COGS)
		}
		catch(err)
		{
			nlapiLogExecution("error", "Calc Contribution Margin Error", "Error calculating COGS for sales order ID " + soID + ". Details: " + err.message)
			return true	
		}
		
		try
		{
			//Calculate Contribution Margin and Set on Sales Order (percent to one decimal place)
			var contributionMargin = Math.round(parseFloat((1 - (COGS / parseFloat(revenue))) * 100) * 10)/10
			
			nlapiSubmitField("salesorder",soID,"custbody_contribution_margin",contributionMargin)
			nlapiLogExecution("debug","Script Execution","Calculated contribution margin: " + contributionMargin)
		}
		catch(err)
		{
			nlapiLogExecution("error", "Calc Contribution Margin Error", "Error calculating contribution margin and setting field on sales order ID " + soID + ". Details: " + err.message)
			return true	
		}	
	}
}
