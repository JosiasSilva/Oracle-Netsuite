/*
 * Script: PO Line Item Link
 * Type: Scheduled
 * Usage: 10 * 70 per Invoice # (grouped)
 * 
 * Summary:
 * Creates/updates vendor billed based on column fields on PO for invoice number, invoice date, and due date. Bill is set
 * at custom due date if present and posting period is set to the posting period associated with the sales order.
 * 
 * Updates:
 *  10/19/2011 - Updated to auto-receive expense line items prior to billing.
 *  10/30/2011 - Added default bill location to San Francisco (internal ID 2)
 */

function findPurchaseOrdersReadyToBill()
{
	try
	{
		//Search For Open Purchase Orders and Group Together By Invoice Number
		var results = nlapiSearchRecord("transaction","customsearch_open_po_lines_inv_num_grp")
		if(results!=null)
		{
			for(var x=0; x < results.length; x++)
			{
				//Generate Vendor Bill For Each Unique Invoice Number Found
				generateVendorBill(results[x].getValue("mainname",null,"group"),results[x].getValue("custcol_invoice_number",null,"group"))
			}
		}
		else
		{
			nlapiLogExecution("error","Script Exit","No results found in initial PO search.")
			return true;
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Invoice PO Error","Error generating vendor bill for purchase orders. Details: " + err.message)
		return true
	}
}

function generateVendorBill(vendor,billNumber)
{
	try
	{
		//Get and check function parameters
		var poVendor = vendor;
		var billNum = billNumber;
		
		if(poVendor==null || poVendor=="")
			return true;
		
		if(billNum==null || billNum=="")
			return true;
	}
	catch(err)
	{
		nlapiLogExecution("error","Invoice PO Error","Error validating function parameters. Details: " + err.message)
		return true
	}
	
	try
	{
		//Search for all line items that match vendor and invoice number (non-billed)
		var billItems = new Array()
		
		var filters = new Array()
		filters[0] = new nlobjSearchFilter("custcol_invoice_number",null,"is",billNumber)
		filters[1] = new nlobjSearchFilter("mainline",null,"is","F")
		filters[2] = new nlobjSearchFilter("shipping",null,"is","F")
		filters[3] = new nlobjSearchFilter("taxline",null,"is","F")
		filters[4] = new nlobjSearchFilter("billingtransaction",null,"anyof","@NONE@") //Added to filter out already billed lines before script was implemented
		filters[5] = new nlobjSearchFilter("mainname",null,"is",vendor)
		
		var cols = new Array()
		cols.push(new nlobjSearchColumn("internalid"))
		cols.push(new nlobjSearchColumn("tranid"))
		cols.push(new nlobjSearchColumn("trandate"))
		cols.push(new nlobjSearchColumn("item"))
		cols.push(new nlobjSearchColumn("line"))
		cols.push(new nlobjSearchColumn("custcol_invoice_number"))
		cols.push(new nlobjSearchColumn("custcol_invoice_date"))
		cols.push(new nlobjSearchColumn("rate"))
		cols.push(new nlobjSearchColumn("quantity"))
		cols.push(new nlobjSearchColumn("location"))
		cols.push(new nlobjSearchColumn("amount"))
		cols.push(new nlobjSearchColumn("expensecategory"))
		cols.push(new nlobjSearchColumn("account"))
		
		var results = nlapiSearchRecord("purchaseorder",null,filters,cols)
		if(results!=null)
		{
			for(var x=0; x < results.length; x++)
			{
				billItems[x] = new Array()
				billItems[x]["internalid"] = results[x].getId()
				billItems[x]["tranid"] = results[x].getValue("tranid")
				billItems[x]["trandate"] = results[x].getValue("trandate")
				billItems[x]["item"] = results[x].getValue("item")
				billItems[x]["line"] = results[x].getValue("line")
				billItems[x]["custcol_invoice_number"] = results[x].getValue("custcol_invoice_number")
				billItems[x]["custcol_invoice_date"] = results[x].getValue("custcol_invoice_date")
				billItems[x]["rate"] = results[x].getValue("rate")
				billItems[x]["quantity"] = results[x].getValue("quantity")
				billItems[x]["location"] = results[x].getValue("location")
				billItems[x]["amount"] = results[x].getValue("amount")
				billItems[x]["expensecategory"] = results[x].getValue("expensecategory")
				billItems[x]["account"] = results[x].getValue("account")
				billItems[x]["createdfrom"] = results[x].getValue("createdfrom")
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Invoice PO Error","Error getting vendor bill line items for bill # " + billNumber + ". Details: " + err.message)
		return true
	}
	
	try
	{
		//Create Item Receipt For Expense Line Items
		var filters = new Array()
		filters[0] = new nlobjSearchFilter("custcol_invoice_number",null,"is",billNumber)
		filters[1] = new nlobjSearchFilter("mainline",null,"is","F")
		filters[2] = new nlobjSearchFilter("shipping",null,"is","F")
		filters[3] = new nlobjSearchFilter("taxline",null,"is","F")
		filters[4] = new nlobjSearchFilter("billingtransaction",null,"anyof","@NONE@") //Added to filter out already billed lines before script was implemented
		filters[5] = new nlobjSearchFilter("mainname",null,"is",vendor)
		filters[6] = new nlobjSearchFilter("item",null,"anyof","@NONE@")
		filters[7] = new nlobjSearchFilter("account",null,"noneof","@NONE@")
		
		var cols = new Array()
		cols[0] = new nlobjSearchColumn("internalid",null,"group")
		
		var results = nlapiSearchRecord("purchaseorder",null,filters,cols)
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				var expReceipt = nlapiTransformRecord("purchaseorder",results[x].getValue("internalid",null,"group"),"itemreceipt")
				nlapiSubmitRecord(expReceipt,true,true)	
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Receiving Expenses Error","Error receiving expense line items for bill # " + billNumber + ". Details: " + err.message)
		return true
	}
	
	try
	{
		//Create Vendor Bill and Link To Purchase Orders
		var vendorBill = nlapiCreateRecord("vendorbill")
		var vendorTerms = nlapiLookupField("vendor",vendor,"terms")
		
		vendorBill.setFieldValue("entity",vendor)
		vendorBill.setFieldValue("trandate",billItems[0]["custcol_invoice_date"])
		vendorBill.setFieldValue("terms",vendorTerms)
		vendorBill.setFieldValue("tranid",billItems[0]["custcol_invoice_number"])
		
		//Set Vendor Bill Due Date (Either Manually Defined or Based On Vendor Terms)
		var dueDate
		var vendorTerms = nlapiLookupField("vendor",vendor,"terms")
		if(billItems[0]["custcol_invoice_due_date"]==null || billItems[0]["custcol_invoice_due_date"]=="")
		{
			var daysUntilDue = nlapiLookupField("term",vendorTerms,"daysuntilnetdue")
			if(daysUntilDue!=null && daysUntilDue!="")
			{
				dueDate = nlapiAddDays(nlapiStringToDate(billItems[0]["trandate"]),parseInt(daysUntilDue))
				dueDate = nlapiDateToString(dueDate,"date")
			}
		}	
		else
		{
			dueDate = billItems[0]["custcol_invoice_due_date"]
		}
		
		vendorBill.setFieldValue("duedate",dueDate)
		
		//Set Posting Period to Match Sales Order
		var postingPeriod, monthText, month, year, orderDate
		var salesOrder = billItems[0]["createdfrom"]
		if(salesOrder!=null && salesOrder!="")
		{
			orderDate = nlapiLookupField("salesorder",salesOrder,"trandate")
		}
		else
		{
			//Set Posting Period To Most Recent SO Connected To That Line Item
			var filters = new Array()
			filters[0] = new nlobjSearchFilter("item",null,"is",billItems[0]["item"])
			
			var cols = new Array()
			cols[0] = new nlobjSearchColumn("trandate")
			cols[0].setSort(true) //Sort orders newest to oldest
			
			var results = nlapiSearchRecord("salesorder",null,filters,cols)
			if(results!=null)
			{
				orderDate = results[0].getValue("trandate")
			}
			else
			{
				orderDate = poDate
			}
		}
		
		month = orderDate.substr(0,orderDate.indexOf("/"))
		switch(month)
		{
			case "1":
				monthText = "Jan"
				break
			case "2":
				monthText = "Feb"
				break
			case "3":
				monthText = "Mar"
				break
			case "4":
				monthText = "Apr"
				break
			case "5":
				monthText = "May"
				break
			case "6":
				monthText = "Jun"
				break
			case "7":
				monthText = "Jul"
				break
			case "8":
				monthText = "Aug"
				break
			case "9":
				monthText = "Sep"
				break
			case "10":
				monthText = "Oct"
				break
			case "11":
				monthText = "Nov"
				break
			case "12":
				monthText = "Dec"
				break
		}
		year = orderDate.substr(orderDate.lastIndexOf("/")+1)
		//nlapiLogExecution("debug","Posting Period",monthText + " " + year)
		vendorBill.setFieldText("postingperiod",monthText + " " + year)
		
		//Add Line Items
		for(var x=0; x < billItems.length; x++)
		{
			if(billItems[x]["item"]!="" && billItems[x]["item"]!=null)
			{
				vendorBill.selectNewLineItem("item")
				vendorBill.setCurrentLineItemValue("item","item",billItems[x]["item"])
				vendorBill.setCurrentLineItemValue("item","quantity",billItems[x]["quantity"])
				vendorBill.setCurrentLineItemValue("item","rate",billItems[x]["rate"])
				if(billItems[x]["location"]!=null && billItems[x]["location"]!="")
					vendorBill.setCurrentLineItemValue("item","location",billItems[x]["location"])
				else
					vendorBill.setCurrentLineItemValue("item","location",2)
				vendorBill.setCurrentLineItemValue("item","orderdoc",billItems[x]["internalid"])
				vendorBill.setCurrentLineItemValue("item","orderline",billItems[x]["line"])
				vendorBill.commitLineItem("item")
			}
		}
		
		//Add Expenses
		for(var x=0; x < billItems.length; x++)
		{
			if(billItems[x]["account"]!="" && billItems[x]["account"]!=null && (billItems[x]["item"]==null || billItems[x]["item"]==""))
			{
				vendorBill.selectNewLineItem("expense")
				vendorBill.setCurrentLineItemValue("expense","account",billItems[x]["account"])
				vendorBill.setCurrentLineItemValue("expense","amount",parseFloat(billItems[x]["amount"])*-1)
				if(billItems[x]["location"]!=null && billItems[x]["location"]!="")
					vendorBill.setCurrentLineItemValue("expense","location",billItems[x]["location"])
				else
					vendorBill.setCurrentLineItemValue("expense","location",2)
				vendorBill.setCurrentLineItemValue("expense","orderdoc",billItems[x]["internalid"])
				vendorBill.setCurrentLineItemValue("expense","orderline",billItems[x]["line"])
				vendorBill.commitLineItem("expense")
			}
		}
		
		//Submit Vendor Bill Record
		nlapiSubmitRecord(vendorBill,true,true)
	}
	catch(err)
	{
		nlapiLogExecution("error","Invoice PO Error","Error creating vendor bill for bill # " + billNumber + ". Details: " + err.message)
		return true
	}
}