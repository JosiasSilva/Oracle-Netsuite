/*
 * Title: Calculate Sales Order Contribution Margin
 * Type: User Event - After Submit
 * Units: 30
 * 
 * Description: Scripts runs when creating or editting a sales order. It will calculate the contribution margin based on 
 * total revenue and COGS. COGS is determined by the Billed PO rate (unbilled POs will exit the script) or the last purchase
 * price on the item itself.
 */
function calcSOContributionMargin(type)
{
	if(type=="create" || type=="edit" || type=="approve")
	{
		nlapiLogExecution("debug","Script Execution","In Script")
		try
		{
			//Get Sales Order Internal ID
			var soID = nlapiGetRecordId()
			
			//Run contribution margin calculation on sales order
			nlapiLogExecution("error","DEBUG","Order Status: " + nlapiGetNewRecord().getFieldValue("status"))
			if(nlapiGetNewRecord().getFieldValue("status")!="Pending Approval" && nlapiGetNewRecord().getFieldValue("status")!=null && nlapiGetNewRecord().getFieldValue("status")!="In Progress")
				setContributionMargin(soID)
		}
		catch(err)
		{
			nlapiLogExecution("error", "Calc Contribution Margin Error", "Error finding Sales Order internal ID. Details: " + err.message)
			return true
		}
		
	}
}

/*
 * Title: Calculate Sales Order Contribution Margin (Vendor Bill)
 * Type: User Event - After Submit
 * Units: 10 + (30 * # Sales Orders)
 * 
 * Description: Calculates sales order contribution margin following the creation or modification of a vendor bill record.
 */
function calcSOContributionMargin_VendorBill(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var salesOrders = new Array()
			
			//Get Vendor Bill Information and Associated POs
			var filters = new Array()
			filters.push(new nlobjSearchFilter("internalid",null,"is",nlapiGetRecordId()))
			filters.push(new nlobjSearchFilter("appliedtotransaction",null,"noneof","@NONE@"))
			filters.push(new nlobjSearchFilter("createdfrom","appliedtotransaction","noneof","@NONE@"))
			
			var cols = new Array()
			cols.push(new nlobjSearchColumn("appliedtotransaction"))
			cols.push(new nlobjSearchColumn("createdfrom","appliedtotransaction"))
			
			var results = nlapiSearchRecord("vendorbill",null,filters,cols)
			if(results!=null)
			{
				for(var x=0; x < results.length; x++)
					salesOrders.push(results[x].getValue("createdfrom","appliedtotransaction"))
			}
			else
			{
				nlapiLogExecution("error","Script Exit","Script exit because no POs found for vendor bill ID " + nlapiGetRecordId() + ".")
				return true
			}
		}
		catch(err)
		{
			nlapiLogExecution("error", "Calc Contribution Margin Error (Vendor Bill)", "Error finding associated sales order to vendor bill internal ID " + nlapiGetRecordId() + ". Details: " + err.message)
			return true
		}
		
		try
		{
			for(var x=0; x < salesOrders.length; x++)
			{
				setContributionMargin(salesOrders[x])
			}
		}
		catch(err)
		{
			nlapiLogExecution("error", "Calc Contribution Margin Error (Vendor Bill)", "Error calculating contribution margin for sales order " + salesOrders[x] + " from vendor bill ID " + nlapiGetRecordId() + ". Details: " + err.message)
			return true
		}
	}
}

function setContributionMargin(soID)
{
	try
	{
		var lineItems = new Array()
		
		var revenue = 0.00
		
		//Run SO Search To Get Order and Line Item Data
		var filters = new Array()
		filters.push(new nlobjSearchFilter("internalid", null, "is", soID))
		filters.push(new nlobjSearchFilter("mainline", null, "is", "F"))
		filters.push(new nlobjSearchFilter("shipping", null, "is", "F"))
		filters.push(new nlobjSearchFilter("taxline", null, "is", "F"))
		filters.push(new nlobjSearchFilter("custbody_contribution_margin",null,"isempty"))
		
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
			//revenue = results[0].getValue("netamountnotax")
			
			for(var x=0; x < results.length; x++)
			{
				if(results[x].getValue("netamountnotax")!="" && results[x].getValue("netamountnotax")!=null)
					revenue += parseFloat(results[x].getValue("netamountnotax"))
					
				lineItems[x] = new Array()
				lineItems[x]["item"] = results[x].getValue("item")
				lineItems[x]["quantity"] = results[x].getValue("quantityuom")
				lineItems[x]["po"] = results[x].getValue("purchaseorder")
				lineItems[x]["po_status"] = results[x].getValue("status","purchaseorder")
				lineItems[x]["po_amount"] = results[x].getValue("amount","purchaseorder")
				lineItems[x]["lastpurchaseprice"] = results[x].getValue("lastpurchaseprice","item")
				
				//Check and reset null values (Added 7-9-2011)
				if(lineItems[x]["lastpurchaseprice"]==null || lineItems[x]["lastpurchaseprice"]=="")
					lineItems[x]["lastpurchaseprice"] = 0.00
					
				if(lineItems[x]["po_amount"]==null || lineItems[x]["po_amount"]=="")
					lineItems[x]["po_amount"] = 0.00
			}
			nlapiLogExecution("debug","Total Revenue",revenue)
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
					nlapiLogExecution("debug", "Calc Contribution Margin Error", "PO found that has not been billed. Script will now exit.")
					return true
				}
				else
				{
					nlapiLogExecution("debug","Script Execution","PO Status: " + lineItems[x]["po_status"])
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
		nlapiLogExecution("debug","Script Execution (DEBUG)","Calculated contribution margin: " + contributionMargin)
	}
	catch(err)
	{
		nlapiLogExecution("error", "Calc Contribution Margin Error", "Error calculating contribution margin and setting field on sales order ID " + soID + ". Details: " + err.message)
		return true	
	}	
}
