/*
 * Script: PO Line Item Link
 * Type: User Event
 * Trigger: After Submit
 * Usage: 10 * 110 per Invoice # (grouped)
 * Record(s): Purchase Order
 * 
 * Summary:
 * Creates/updates vendor billed based on column fields on PO for invoice number, invoice date, and due date. Bill is set
 * at custom due date if present and posting period is set to the posting period assocaited with the sales order.
 */

function createBillLineItem(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			//Get Purchase Order Internal ID & Body Details
			var purchaseOrderID = nlapiGetRecordId()
			
			var vendor, location, poNumber, poDate, poMemo, salesOrder
			
			vendor = nlapiGetNewRecord().getFieldValue("entity")
			location = nlapiGetNewRecord().getFieldValue("location")
			poNumber = nlapiGetNewRecord().getFieldValue("tranid")
			poDate = nlapiGetNewRecord().getFieldValue("trandate")
			poMemo = nlapiGetNewRecord().getFieldValue("memo")
			salesOrder = nlapiGetNewRecord().getFieldValue("createdfrom")
		}
		catch(err)
		{
			nlapiLogExecution("error","Error getting PO Info","Error getting body information from PO. Details: " + err.message)
			return true
		}
		
		try
		{
			var po_invoices = new Array()
			
			//Run Saved Search To Retrieve All Invoice Numbers From PO (grouped to have only a unique invoice number returned)
			var filters = new Array()
			filters[0] = new nlobjSearchFilter("internalid",null,"is",purchaseOrderID)
			filters[1] = new nlobjSearchFilter("mainline",null,"is","F")
			filters[2] = new nlobjSearchFilter("shipping",null,"is","F")
			filters[3] = new nlobjSearchFilter("taxline",null,"is","F")
			filters[4] = new nlobjSearchFilter("custcol_invoice_number",null,"isnotempty")
			filters[5] = new nlobjSearchFilter("custcol_invoice_date",null,"isnotempty")
			filters[6] = new nlobjSearchFilter("custcol_invoice_processed",null,"is","F")
			filters[7] = new nlobjSearchFilter("billingtransaction",null,"anyof","@NONE@") //Added to filter out already billed lines before script was implemented
			
			var cols = new Array()
			cols[0] = new nlobjSearchColumn("custcol_invoice_number",null,"group")
			
			var results = nlapiSearchRecord("purchaseorder",null,filters,cols)
			
			if(results!=null)
			{
				for(var x=0; x < results.length; x++)
				{
					po_invoices[x] = results[x].getValue("custcol_invoice_number",null,"group")
				}
			}
			else
			{
				nlapiLogExecution("debug","Invoice Info Gathering","No results returned for non-processed, completed invoice link lines for PO internal ID " + purchaseOrderID + ".")
				return true
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Invoice Info Gathering Error","Error collecting unique invoice numbers for line items on PO internal ID " + purchaseOrderID + ". Details: " + err.message)
			return true
		}
		
		try
		{
			//Go Through Each Unique Invoice Number
			var invoice_items
			
			for(var x=0; x < po_invoices.length; x++)
			{
				invoice_items = null
				
				//Search Each Unique Invoice Number To Find All Corresponding Unprocessed Line Items
				var filters = new Array()
				filters[0] = new nlobjSearchFilter("internalid",null,"is",purchaseOrderID)
				filters[1] = new nlobjSearchFilter("mainline",null,"is","F")
				filters[2] = new nlobjSearchFilter("custcol_invoice_number",null,"is",po_invoices[x])
				filters[3] = new nlobjSearchFilter("custcol_invoice_date",null,"isnotempty")
				filters[4] = new nlobjSearchFilter("custcol_invoice_processed",null,"is","F")
				
				var cols = new Array()
				cols[0] = new nlobjSearchColumn("item")
				cols[1] = new nlobjSearchColumn("line")
				cols[2] = new nlobjSearchColumn("quantity")
				cols[3] = new nlobjSearchColumn("rate")
				cols[4] = new nlobjSearchColumn("custcol_invoice_date")
				cols[5] = new nlobjSearchColumn("custcol_invoice_number")
				cols[6] = new nlobjSearchColumn("custcol_invoice_due_date")
				
				var results = nlapiSearchRecord("purchaseorder",null,filters,cols)
				if(results!=null)
				{
					invoice_items = new Array()
					
					for(var i=0; i < results.length; i++)
					{
						invoice_items[i] = new Array()
						invoice_items[i]["item"] = results[i].getValue("item")
						invoice_items[i]["line"] = results[i].getValue("line")
						invoice_items[i]["quantity"] = results[i].getValue("quantity")
						invoice_items[i]["rate"] = results[i].getValue("rate")
						invoice_items[i]["custcol_invoice_date"] = results[i].getValue("custcol_invoice_date")
						invoice_items[i]["custcol_invoice_number"] = results[i].getValue("custcol_invoice_number")
						invoice_items[i]["custcol_invoice_due_date"] = results[i].getValue("custcol_invoice_due_date")
						
						//nlapiLogExecution("debug","Line ID",invoice_items[i]["line"])
					}
				}
				
				//Check to see if Vendor Bill is already created with that number
				var invoiceCreated = false
				
				var filters = new Array()
				filters[0] = new nlobjSearchFilter("tranid",null,"is",po_invoices[x])
				//filters[1] = new nlobjSearchFilter("mainname",null,"is",vendor)
				
				var results = nlapiSearchRecord("vendorbill",null,filters)
				if(results!=null)
					invoiceCreated = true
				else
					invoiceCreated = false
					
				if(invoiceCreated)
				{
					//Invoice Already In System - Append Line Items
					var vendorBill = nlapiLoadRecord("vendorbill",results[0].getId())
					
					//Add Line Items To Vendor Bill
					for(var i=0; i < invoice_items.length; i++)
					{
						vendorBill.selectNewLineItem("item")
						vendorBill.setCurrentLineItemValue("item","item",invoice_items[i]["item"])
						vendorBill.setCurrentLineItemValue("item","quantity",invoice_items[i]["quantity"])
						vendorBill.setCurrentLineItemValue("item","rate",invoice_items[i]["rate"])
						vendorBill.setCurrentLineItemValue("item","location",location)
						vendorBill.setCurrentLineItemValue("item","orderdoc",purchaseOrderID)
						vendorBill.setCurrentLineItemValue("item","orderline",invoice_items[i]["line"])
						vendorBill.commitLineItem("item")
					}
						
					nlapiSubmitRecord(vendorBill,true,true)
				}
				else
				{
					//No Invoice Exists - Created Invoice and Add Line Items
					var vendorBill = nlapiCreateRecord("vendorbill")
					var vendorTerms = nlapiLookupField("vendor",vendor,"terms")
					var dueDate
					vendorBill.setFieldValue("entity",nlapiLookupField("purchaseorder",purchaseOrderID,"entity"))
					vendorBill.setFieldValue("trandate",invoice_items[0]["custcol_invoice_date"])
					vendorBill.setFieldValue("terms",vendorTerms)
					
					if(poMemo!=null && poMemo!="")
						vendorBill.setFieldValue("memo",poMemo)
					
					var location = nlapiLookupField("purchaseorder",purchaseOrderID,"location")
					vendorBill.setFieldValue("tranid",invoice_items[0]["custcol_invoice_number"])			
					
					//Check to See if Due Date Column Is Filled In - If Its Filled In Then Use That Due Day
					//Otherwise will use vendor terms to pull in due date
					if(invoice_items[0]["custcol_invoice_due_date"]==null || invoice_items[0]["custcol_invoice_due_date"]=="")
					{
						var vendorTerms = nlapiLookupField("vendor",vendor,"terms")
						var daysUntilDue = nlapiLookupField("term",vendorTerms,"daysuntilnetdue")
						if(daysUntilDue!=null && daysUntilDue!="")
						{
							dueDate = nlapiAddDays(nlapiStringToDate(nlapiGetFieldValue("trandate")),parseInt(daysUntilDue))
							dueDate = nlapiDateToString(dueDate,"date")
							//nlapiLogExecution("debug","Due Date",dueDate)
						}
					}	
					else
					{
						//nlapiLogExecution("debug","Bill Due Date",invoice_items[0]["custcol_invoice_due_date"])
						dueDate = invoice_items[0]["custcol_invoice_due_date"]
					}
					
					//Add Line Items To Vendor Bill
					for(var i=0; i < invoice_items.length; i++)
					{
						vendorBill.selectNewLineItem("item")
						vendorBill.setCurrentLineItemValue("item","item",invoice_items[i]["item"])
						vendorBill.setCurrentLineItemValue("item","quantity",invoice_items[i]["quantity"])
						vendorBill.setCurrentLineItemValue("item","rate",invoice_items[i]["rate"])
						vendorBill.setCurrentLineItemValue("item","location",location)
						vendorBill.setCurrentLineItemValue("item","orderdoc",purchaseOrderID)
						vendorBill.setCurrentLineItemValue("item","orderline",invoice_items[i]["line"])
						vendorBill.commitLineItem("item")
					}
					vendorBill.setFieldValue("duedate",dueDate)
					
					//Set Posting Period to Match Sales Order
					var postingPeriod, monthText, month, year, orderDate
					if(salesOrder!=null && salesOrder!="")
					{
						orderDate = nlapiLookupField("salesorder",salesOrder,"trandate")
					}
					else
					{
						//Set Posting Period To Most Recent SO Connected To That Line Item
						var filters = new Array()
						filters[0] = new nlobjSearchFilter("item",null,"is",invoice_items[0]["item"])
						
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
					
					var billID = nlapiSubmitRecord(vendorBill,true,true)
					
					//Re-submit vendor bill to adjust due date
					//Note: NS does not set this properly before the initial save for some reason...
					if(invoice_items[0]["custcol_invoice_due_date"]!=null && invoice_items[0]["custcol_invoice_due_date"]!="")
					{
						var newBill = nlapiLoadRecord("vendorbill",billID)
						newBill.setFieldValue("duedate",dueDate)
						nlapiSubmitRecord(newBill,false,true)
						//nlapiLogExecution("debug","Due Date Field Set","Due Date field set with nlapiSubmitField API call.")
					}
					
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Create Vendor Bill Error","Error creating or updating vendor bill. Details: " + err.message)
			return true
		}
		
		try
		{
			//Mark Line(s) of PO as Processed
			var purchOrdRec = nlapiLoadRecord("purchaseorder",purchaseOrderID)
			for(var x=0; x < invoice_items.length; x++)
			{
				for(var z=0; z < purchOrdRec.getLineItemCount("item");z++)
				{
					if(purchOrdRec.getLineItemValue("item","line",z+1)==invoice_items[x]["line"])
					{
						purchOrdRec.setLineItemValue("item","custcol_invoice_processed",z+1,"T")
						break
					}
				}
			}
			nlapiSubmitRecord(purchOrdRec,false,true)
		}
		catch(err)
		{
			nlapiLogExecution("error","Create Vendor Bill Error","Error updating purchase line items as being processed. Details: " + err.message)
			return true
		}
	}
}
