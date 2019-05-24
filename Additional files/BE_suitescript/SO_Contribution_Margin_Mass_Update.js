nlapiLogExecution("audit","FLOStart",new Date().getTime());
/*
 * Title: Calculate Sales Order Contribution Margin
 * Type: Mass Update
 * Units: 30
 * 
 * Description: Scripts runs when creating or editting a sales order. It will calculate the contribution margin based on 
 * total revenue and COGS. COGS is determined by the Billed PO rate (unbilled POs will exit the script) or the last purchase
 * price on the item itself.
 */

function setContributionMargin(rec_type,rec_id)
{
	try
	{
		var lineItems = new Array()
		
		var revenue = 0.00
		
		//Run SO Search To Get Order and Line Item Data
		var filters = new Array()
		filters.push(new nlobjSearchFilter("internalid", null, "is", rec_id))
		filters.push(new nlobjSearchFilter("mainline", null, "is", "F"))
		filters.push(new nlobjSearchFilter("shipping", null, "is", "F"))
		filters.push(new nlobjSearchFilter("taxline", null, "is", "F"))
		//filters.push(new nlobjSearchFilter("type","item","noneof",["Service","NonInvtPart","Discount","OthCharge"]))
		
		var columns = new Array()
		columns.push(new nlobjSearchColumn("internalid"))
		columns.push(new nlobjSearchColumn("tranid"))
		columns.push(new nlobjSearchColumn("item"))
		columns.push(new nlobjSearchColumn("quantityuom"))
		columns.push(new nlobjSearchColumn("rate"))
		columns.push(new nlobjSearchColumn("netamountnotax"))
		columns.push(new nlobjSearchColumn("purchaseorder"))
		columns.push(new nlobjSearchColumn("status", "purchaseorder"))
		columns.push(new nlobjSearchColumn("amount", "purchaseorder"))
		columns.push(new nlobjSearchColumn("trandate"))
		columns.push(new nlobjSearchColumn("type","item"))
		
		var results = nlapiSearchRecord("salesorder",null,filters,columns)
		if(results!=null)
		{
			//revenue = results[0].getValue("netamountnotax")
			
			for(var x=0; x < results.length; x++)
			{
				/*Old revenue calculation
				if(results[x].getValue("netamountnotax")!="" && results[x].getValue("netamountnotax")!=null)
					revenue += parseFloat(results[x].getValue("netamountnotax"))
				*/
				
				if(results[x].getValue("rate")!="" && results[x].getValue("rate")!=null)
					revenue += (parseFloat(results[x].getValue("rate")) * parseFloat(results[x].getValue("quantityuom")))
				
				//nlapiLogExecution("error","Item Type (DEBUG)",results[x].getValue("type","item"))
				
				lineItems[x] = new Array()
				lineItems[x]["item"] = results[x].getValue("item")
				lineItems[x]["quantity"] = results[x].getValue("quantityuom")
				lineItems[x]["po"] = results[x].getValue("purchaseorder")
				lineItems[x]["po_status"] = results[x].getValue("status","purchaseorder")
				lineItems[x]["po_amount"] = results[x].getValue("amount","purchaseorder")
				lineItems[x]["order_date"] = results[x].getValue("trandate")
					
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
			if(lineItems[x]["po_status"]=="Closed" || lineItems[x]["po"]==null || lineItems[x]["po"]=="")
			{
				//IF NO PO ASSOCIATED THEN USE LAST PURCHASE PRICE
				//nlapiLogExecution("debug","Script Execution","COGS (LPP): " + (parseFloat(lineItems[x]["lastpurchaseprice"]) * parseFloat(lineItems[x]["quantity"])))
				var filters = new Array()
				filters[0] = new nlobjSearchFilter("item",null,"is",lineItems[x]["item"])
				filters[1] = new nlobjSearchFilter("status",null,"noneof","PurchOrd:H")
				var cols = new Array()
				cols[0] = new nlobjSearchColumn("trandate")
				cols[1] = new nlobjSearchColumn("item")
				cols[2] = new nlobjSearchColumn("formulanumeric")
				//nlapiLogExecution("debug","Script Execution","Order Date: " + lineItems[x]["order_date"])
				cols[2].setFormula("ABS({trandate} - TO_DATE('" + lineItems[x]["order_date"] + "','MM/DD/YYYY'))")
				cols[2].setSort()
				cols[3] = new nlobjSearchColumn("formulanumeric")
				cols[3].setFormula("{rate}*{quantity}/{quantityuom}")
				var results = nlapiSearchRecord("purchaseorder",null,filters,cols)
				if(results!=null)
				{
					//nlapiLogExecution("debug","Script Execution","Closest PO Rate: " + results[0].getValue(cols[3]))
					lineItems[x]["lastpurchaseprice"] = results[0].getValue(cols[3])
				}
				else
				{
					//If no purchase order found for item, then skip item
					nlapiLogExecution("debug","Script Execution","No Closest PO Found for Item " + lineItems[x]["item"])
					lineItems[x]["lastpurchaseprice"] = 0.00
					return true;
				}
				COGS += parseFloat(lineItems[x]["lastpurchaseprice"])
			}
			else
			{
				//IF PO FOUND CHECK STATUS AND USE PO AMOUNT
				if(lineItems[x]["po_status"]!="fullyBilled")
				{
					//nlapiLogExecution("debug","Script Execution","PO Status: " + lineItems[x]["po_status"])
					//IF PO NOT BILLED THEN EXIT SCRIPT
					nlapiLogExecution("debug", "Calc Contribution Margin Error", "PO found that has not been billed. Script will now exit.")
					return true
				}
				else
				{
					//nlapiLogExecution("debug","Script Execution","PO Status: " + lineItems[x]["po_status"])
					//nlapiLogExecution("debug","Script Execution","COGS (PO): " + lineItems[x]["po_amount"])
					COGS += parseFloat(lineItems[x]["po_amount"])
				}
			}
		}
		nlapiLogExecution("debug","Script Execution","Calculated COGS: " + COGS)
	}
	catch(err)
	{
		nlapiLogExecution("error", "Calc Contribution Margin Error", "Error calculating COGS for sales order ID " + rec_id + ". Details: " + err.message)
		return true	
	}
	
	try
	{
		//Calculate Contribution Margin and Set on Sales Order (percent to one decimal place)
		if(parseFloat(revenue)<= 0)
		{
			var contributionMargin = 0
		}
		else
		{
			var contributionMargin = Math.round(parseFloat((1 - (COGS / parseFloat(revenue))) * 100) * 10)/10	
		}
		var contributionMarginAmount = parseFloat(revenue) - COGS
		
		var fields = new Array()
		fields[0] = "custbody_contribution_margin"
		fields[1] = "custbody_contribution_margin_amt"
		
		var data = new Array()
		data[0] = contributionMargin
		data[1] = contributionMarginAmount
		
		nlapiLogExecution("debug","Script Execution (DEBUG)","Calculated contribution margin %: " + contributionMargin)
		nlapiLogExecution("debug","Script Execution (DEBUG)","Calculated contribution margin $: " + contributionMarginAmount)
		
		nlapiSubmitField(rec_type,rec_id,fields,data)
	}
	catch(err)
	{
		nlapiLogExecution("error", "Calc Contribution Margin Error", "Error calculating contribution margin and setting field on sales order ID " + rec_id + ". Details: " + err.getDetails() || err.message)
		return true	
	}	
}
