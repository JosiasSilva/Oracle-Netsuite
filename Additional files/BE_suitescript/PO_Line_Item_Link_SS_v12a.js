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
 *  02/09/2018 - Added additional logging to troubleshoot bills being entered in locked/closed periods
 *  10/19/2011 - Updated to auto-receive expense line items prior to billing.
 *  10/30/2011 - Added default bill location to San Francisco (internal ID 2)
 *  06/30/2016 - Added governance check and nlapiYieldScript to re-queue as needed if usage goes over 10,000
 */

var oldestOpenPeriod = null;

function findPurchaseOrdersReadyToBill()
{
	try
	{
		//Search For Open Purchase Orders and Group Together By Invoice Number
		var results = nlapiSearchRecord("transaction","customsearch_open_po_lines_inv_num_grp")
		if(results!=null)
		{
			findOldestOpenPeriod();
			nlapiLogExecution("debug","Old Open Accounting Period",oldestOpenPeriod);
			
			for(var x=0; x < results.length; x++)
			{
				//Generate Vendor Bill For Each Unique Invoice Number Found
				checkGovernance();
				
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
				checkGovernance();
				
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
		var vendorBill = nlapiCreateRecord("vendorbill",{recordmode:"dynamic"});
		var vendorTerms = nlapiLookupField("vendor",vendor,"terms")
		
		vendorBill.setFieldValue("entity",vendor)
		vendorBill.setFieldValue("trandate",billItems[0]["custcol_invoice_date"])
		vendorBill.setFieldValue("terms",vendorTerms)
		vendorBill.setFieldValue("tranid",billItems[0]["custcol_invoice_number"])
		
		//Set Vendor Bill Due Date (Either Manually Defined or Based On Vendor Terms)
		var dueDate
		var vendorTerms = nlapiLookupField("vendor",vendor,"terms")
		if(billItems[0]["custcol_invoice_due_date"]!=null && billItems[0]["custcol_invoice_due_date"]!="")
			vendorBill.setFieldValue("duedate",billItems[0]["custcol_invoice_due_date"]);
		
		//Verify posting period is not closed
		var postingperiod = vendorBill.getFieldValue("postingperiod");
		nlapiLogExecution("debug","Posting Period","ID: " + postingperiod + "  |  Name: " + vendorBill.getFieldText("postingperiod"));
		
		var filters = [];
		filters.push(new nlobjSearchFilter("internalid",null,"is",postingperiod));
		var cols = [];
		cols.push(new nlobjSearchColumn("aplocked"));
		cols.push(new nlobjSearchColumn("arlocked"));
		cols.push(new nlobjSearchColumn("alllocked"));
		cols.push(new nlobjSearchColumn("closed"));
		var results = nlapiSearchRecord("accountingperiod",null,filters,cols);
		if(results)
		{
			nlapiLogExecution("debug","Checking First Posting Period in Search (" + results[0].getId() + ")","AP Locked: " + results[0].getValue("aplocked") + "  |  Closed: " + results[0].getValue("closed"));
			
			if(results[0].getValue("aplocked")=="T" || results[0].getValue("arlocked")=="T" || results[0].getValue("alllocked")=="T" || results[0].getValue("closed")=="T")
			{
				nlapiLogExecution("debug","Period is Locked or Closed...");
				
				vendorBill.setFieldValue("postingperiod",oldestOpenPeriod);
				
				nlapiLogExecution("debug","New Posting Period Field Value (after setFieldText)",vendorBill.getFieldText("postingperiod"));
			}
		}

		
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

function findOldestOpenPeriod()
{
	var filters = [];
	filters.push(new nlobjSearchFilter("aplocked",null,"is","F"));
	filters.push(new nlobjSearchFilter("closed",null,"is","F"));
	filters.push(new nlobjSearchFilter("alllocked",null,"is","F"));
	filters.push(new nlobjSearchFilter("isadjust",null,"is","F"));
	filters.push(new nlobjSearchFilter("isquarter",null,"is","F"));
	filters.push(new nlobjSearchFilter("isyear",null,"is","F"));
	var cols = [];
	cols.push(new nlobjSearchColumn("enddate").setSort());
	var results = nlapiSearchRecord("accountingperiod",null,filters,cols);
	if(results)
		oldestOpenPeriod = results[0].getId();
}

function checkGovernance()
{
	var context = nlapiGetContext();
	if(context.getRemainingUsage() < 400)
	{
 		var state = nlapiYieldScript();
		if(state.status == 'FAILURE')
     	{
      		nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = "+state.reason + " / Size = "+ state.size);
   			throw "Failed to yield script";
  		} 
  		else if(state.status == 'RESUME')
  		{
   			nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
  		}
  		// state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
 	}
}