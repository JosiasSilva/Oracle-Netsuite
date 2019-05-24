nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Item_Transaction_Dates_SS()
{
	var deployment = nlapiGetContext().getSetting("SCRIPT","custscript_item_trans_date_deploy_type");
	var interval = nlapiGetContext().getSetting("SCRIPT","custscript_item_trans_date_deploy_interv");
	
	var timestamp = new Date();
	switch(interval)
	{
		case "1":
			timestamp = new Date(timestamp - 15 * 60000);
			break;
		case "2":
			timestamp = new Date(timestamp - 30 * 60000);
			break;
		case "3":
			timestamp = new Date(timestamp - 45 * 60000);
			break;
		case "4":
			timestamp = new Date(timestamp - 60 * 60000);
			break;
	}
	timestamp = nlapiDateToString(timestamp,"datetime");
	nlapiLogExecution("debug","Timestamp",timestamp);
	
	switch(deployment)
	{
		case "1":
			updateSalesOrders();
			break;
		case "2":
			updatePurchaseOrders(timestamp);
			break;
		case "3":
			updateItemFulfillments(timestamp);
			break;
		case "4":
			updateInvoices(timestamp);
			break;
		case "5":
			updateRemaining(timestamp);
			break;
	}
}

function updateSalesOrders()
{
	var filters = [];
	filters.push(new nlobjSearchFilter("custbody_run_item_date_fields_update",null,"is","T"));
	filters.push(new nlobjSearchFilter("custitem20","item","anyof",["7","24"])); //Category = Loose Diamond or Antique
	
	var cols = [];
	cols.push(new nlobjSearchColumn("internalid",null,"group"));
	cols.push(new nlobjSearchColumn("item",null,"group"));
	cols.push(new nlobjSearchColumn("trandate",null,"group"));
	cols.push(new nlobjSearchColumn("custitem112","item","group")); //Sales Order
	
	//var search = nlapiCreateSearch("salesorder",filters,cols);
	var search = nlapiLoadSearch("salesorder","customsearch_trans_item_date_sales_order");
    var resultSet = search.runSearch();
	var searchid = 0;
	
	do{
        var results = resultSet.getResults(searchid,searchid+1000);
        for(var x=0; x < results.length; x++)
        {
			checkGovernance(200);
			
			try
			{
				if(nlapiStringToDate(results[x].getValue("trandate",null,"group")) > nlapiStringToDate(results[x].getValue("custitem112","item","group")))
					nlapiSubmitField("inventoryitem",results[x].getValue("item",null,"group"),"custitem112",results[x].getValue("trandate",null,"group"));
					
				nlapiSubmitField("salesorder",results[x].getValue("internalid",null,"group"),"custbody_run_item_date_fields_update","F");	
			}
			catch(err)
			{
				nlapiLogExecution("error","Error Updating Item " + results[x].getText("item",null,"group"),"Details: " + err.message)
			}
								
            searchid++;
        }

    }while(results.length >= 1000);
	
	nlapiLogExecution("debug","# Sales Order",searchid);
}

function updateInvoices(timestamp)
{
	var filters = [];
	filters.push(new nlobjSearchFilter("lastmodifieddate",null,"onorafter",timestamp));
	filters.push(new nlobjSearchFilter("custitem20","item","anyof",["7","24"])); //Category = Loose Diamond or Antique
	
	var cols = [];
	cols.push(new nlobjSearchColumn("item",null,"group"));
	cols.push(new nlobjSearchColumn("trandate",null,"group"));
	cols.push(new nlobjSearchColumn("custitem111","item","group")); //Invoice
	
	var search = nlapiCreateSearch("invoice",filters,cols);
    var resultSet = search.runSearch();
	var searchid = 0;
	
	do{
        var results = resultSet.getResults(searchid,searchid+1000);
        for(var x=0; x < results.length; x++)
        {
			checkGovernance(200);
			
			
			try
			{
				if(nlapiStringToDate(results[x].getValue("trandate",null,"group")) > nlapiStringToDate(results[x].getValue("custitem111","item","group")))
					nlapiSubmitField("inventoryitem",results[x].getValue("item",null,"group"),"custitem111",results[x].getValue("trandate",null,"group"));
			}	
			catch(err)
			{
				nlapiLogExecution("error","Error Updating Item " + results[x].getText("item",null,"group"),"Details: " + err.message)
			}
			
								
            searchid++;
        }

    }while(results.length >= 1000);
	
	nlapiLogExecution("debug","Completed Invoice Section");
	
	nlapiLogExecution("debug","# Invoices",searchid);
}

function updateItemFulfillments(timestamp)
{
	var filters = [];
	filters.push(new nlobjSearchFilter("lastmodifieddate",null,"onorafter",timestamp));
	filters.push(new nlobjSearchFilter("custitem20","item","anyof",["7","24"])); //Category = Loose Diamond or Antique
	
	var cols = [];
	cols.push(new nlobjSearchColumn("item",null,"group"));
	cols.push(new nlobjSearchColumn("trandate",null,"group"));
	cols.push(new nlobjSearchColumn("custitem115","item","group")); //Item Fulfillment
	
	var search = nlapiCreateSearch("itemfulfillment",filters,cols);
    var resultSet = search.runSearch();
	var searchid = 0;
	
	do{
        var results = resultSet.getResults(searchid,searchid+1000);
        for(var x=0; x < results.length; x++)
        {
			checkGovernance(200);
			
			
			try
			{
				if(nlapiStringToDate(results[x].getValue("trandate",null,"group")) > nlapiStringToDate(results[x].getValue("custitem115","item","group")))
					nlapiSubmitField("inventoryitem",results[x].getValue("item",null,"group"),"custitem115",results[x].getValue("trandate",null,"group"));
			}	
			catch(err)
			{
				nlapiLogExecution("error","Error Updating Item " + results[x].getText("item",null,"group"),"Details: " + err.message)
			}
								
            searchid++;
        }

    }while(results.length >= 1000);
	
	nlapiLogExecution("debug","Completed Item Fulfillment Section");
	
	nlapiLogExecution("debug","# Item Fulfillments",searchid);
}

function updatePurchaseOrders(timestamp)
{
	var filters = [];
	filters.push(new nlobjSearchFilter("lastmodifieddate",null,"onorafter",timestamp));
	filters.push(new nlobjSearchFilter("custitem20","item","anyof",["7","24"])); //Category = Loose Diamond or Antique
	
	var cols = [];
	cols.push(new nlobjSearchColumn("item",null,"group"));
	cols.push(new nlobjSearchColumn("trandate",null,"group"));
	cols.push(new nlobjSearchColumn("custitem107","item","group")); //Purchase Order
	
	var search = nlapiCreateSearch("purchaseorder",filters,cols);
    var resultSet = search.runSearch();
	var searchid = 0;
	
	do{
        var results = resultSet.getResults(searchid,searchid+1000);
        for(var x=0; x < results.length; x++)
        {
			checkGovernance(200);
			
			
			try
			{
				if(nlapiStringToDate(results[x].getValue("trandate",null,"group")) > nlapiStringToDate(results[x].getValue("custitem107","item","group")))
					nlapiSubmitField("inventoryitem",results[x].getValue("item",null,"group"),"custitem107",results[x].getValue("trandate",null,"group"));
			}	
			catch(err)
			{
				nlapiLogExecution("error","Error Updating Item " + results[x].getText("item",null,"group"),"Details: " + err.message)
			}
				
								
            searchid++;
        }

    }while(results.length >= 1000);
	
	nlapiLogExecution("debug","Completed Purchase Order Section");
	
	nlapiLogExecution("debug","# Purchase Orders",searchid);
}

function updateRemaining(timestamp)
{
	var filters = [];
	filters.push(new nlobjSearchFilter("lastmodifieddate",null,"onorafter",timestamp));
	filters.push(new nlobjSearchFilter("type",null,"anyof",["CustCred","VendBill","VendCred","VendAuth","ItemRcpt"]))
	filters.push(new nlobjSearchFilter("custitem20","item","anyof",["7","24"])); //Category = Loose Diamond or Antique
	
	var cols = [];
	cols.push(new nlobjSearchColumn("item",null,"group"));
	cols.push(new nlobjSearchColumn("trandate",null,"group"));
	cols.push(new nlobjSearchColumn("type",null,"group"));
	cols.push(new nlobjSearchColumn("custitem108","item","group")); //Vendor Bill
	cols.push(new nlobjSearchColumn("custitem109","item","group")); //Item Receipt
	cols.push(new nlobjSearchColumn("custitem110","item","group")); //Vendor RA
	cols.push(new nlobjSearchColumn("custitem113","item","group")); //Vendor Credit
	cols.push(new nlobjSearchColumn("custitem114","item","group")); //Credit Memo
	
	var search = nlapiCreateSearch("transaction",filters,cols);
    var resultSet = search.runSearch();
	var searchid = 0;
	
	do{
        var results = resultSet.getResults(searchid,searchid+1000);
        for(var x=0; x < results.length; x++)
        {
			checkGovernance(200);
			
			nlapiLogExecution("debug","Transaction Type",results[x].getValue("type",null,"group"));
			
			try
			{
				switch(results[x].getValue("type",null,"group"))
				{
					case "CustCred":
						if(nlapiStringToDate(results[x].getValue("trandate",null,"group")) > nlapiStringToDate(results[x].getValue("custitem114","item","group")))
							nlapiSubmitField("inventoryitem",results[x].getValue("item",null,"group"),"custitem114",results[x].getValue("trandate",null,"group"));
						break;
					case "VendBill":
						if(nlapiStringToDate(results[x].getValue("trandate",null,"group")) > nlapiStringToDate(results[x].getValue("custitem108","item","group")))
							nlapiSubmitField("inventoryitem",results[x].getValue("item",null,"group"),"custitem108",results[x].getValue("trandate",null,"group"));
						break;
					case "VendCred":
						if(nlapiStringToDate(results[x].getValue("trandate",null,"group")) > nlapiStringToDate(results[x].getValue("custitem113","item","group")))
							nlapiSubmitField("inventoryitem",results[x].getValue("item",null,"group"),"custitem113",results[x].getValue("trandate",null,"group"));
						break;
					case "VendAuth":
						if(nlapiStringToDate(results[x].getValue("trandate",null,"group")) > nlapiStringToDate(results[x].getValue("custitem110","item","group")))
							nlapiSubmitField("inventoryitem",results[x].getValue("item",null,"group"),"custitem110",results[x].getValue("trandate",null,"group"));
						break;
					case "ItemRcpt":
						if(nlapiStringToDate(results[x].getValue("trandate",null,"group")) > nlapiStringToDate(results[x].getValue("custitem109","item","group")))
							nlapiSubmitField("inventoryitem",results[x].getValue("item",null,"group"),"custitem109",results[x].getValue("trandate",null,"group"));
						break;
				}	
			}	
			catch(err)
			{
				nlapiLogExecution("error","Error Updating Item " + results[x].getText("item",null,"group"),"Details: " + err.message)
			}
				
								
            searchid++;
        }

    }while(results.length >= 1000);
	
	nlapiLogExecution("debug","Completed Multi-Transaction Section");
	
	nlapiLogExecution("debug","# Other Transactions",searchid);
}

/**
 * Check usage of the script.
 * 
 * @param governanceThreshold
 */
function checkGovernance(governanceThreshold)
{
	var CONTEXT = nlapiGetContext();
	var LOG_TITLE = 'checkGovernance';
	
	nlapiLogExecution('DEBUG', LOG_TITLE, 'USAGE Remaining = ' + CONTEXT.getRemainingUsage());
	if( CONTEXT.getRemainingUsage() < governanceThreshold )
	{
		var state = nlapiYieldScript();
		
		if( state.status == 'FAILURE')
		{
			nlapiLogExecution( 'ERROR', LOG_TITLE, "Failed to yield script, exiting: Reason = " + state.reason + " / Size = " + state.size);
			throw "Failed to yield script.";
		} 
		else if ( state.status == 'RESUME' )
		{
			nlapiLogExecution('ERROR', LOG_TITLE, "Resuming script because of " + state.reason+".  Size = " + state.size);
		}
	}
}