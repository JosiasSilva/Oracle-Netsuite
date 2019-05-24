function Owned_Paid_Sold_Fields_SS()
{
	var results = nlapiSearchRecord("ITEM","customsearch_upd_owned_memo_flds");
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			try
			{
				checkDetails(results[x].getId());
				
				checkGovernance();
			}
			catch(err)
			{
				nlapiLogExecution("error","Error Updating Owned, Paid Sold Fields. Item: " + results[x].getId(),"Details: " + err.message);
			}
		}
	}
}

function checkDetails(item_id)
{
	nlapiLogExecution("debug","Begin Item Internal ID: " + item_id);
	
	//20 UNITS PER RUN
	var bill_date, bill_status;
	var order_date, order_status;
	var bill_credit_date = null;
	var receipt_date = null;
	var receipt_created_from = null;
	var ownedReason = null;
	
	var paid = false;
	var sold = false;
	var owned = false;
	
	var filters = [];
	filters.push(new nlobjSearchFilter("item",null,"is",item_id)); //10 UNITS
	var cols = [];
	cols.push(new nlobjSearchColumn("tranid"));
	cols.push(new nlobjSearchColumn("trandate").setSort(true));
	cols.push(new nlobjSearchColumn("status"));
	cols.push(new nlobjSearchColumn("createdfrom"));
	cols.push(new nlobjSearchColumn("custitem194","item"));
	var results = nlapiSearchRecord("transaction",null,filters,cols);
	if(results)
	{
		ownedReason = results[0].getValue("custitem194","item");
		nlapiLogExecution("debug","Owned Reason",ownedReason);
		
		for(var x=0; x < results.length; x++)
		{
			nlapiLogExecution("debug","Record Type: " + results[x].getRecordType());
			
			switch(results[x].getRecordType())
			{
				case "vendorbill":
					if(bill_date==null || bill_date=="")
					{
						bill_date = results[x].getValue("trandate");
						bill_status = results[x].getValue("status");
					}
					break;
				case "salesorder":
					order_date = results[x].getValue("trandate");
					order_status = results[x].getValue("status");
					break;
				case "vendorcredit":
					if(bill_credit_date==null || bill_credit_date=="")
					{
						bill_credit_date = results[x].getValue("trandate");
					}
					break;
				case "itemreceipt":
					if(receipt_date==null || receipt_date=="")
					{
						receipt_date = results[x].getValue("trandate");
						receipt_created_from = results[x].getText("createdfrom");
					}
					break;
			}
		}
	}
	
	if(ownedReason==null)
		ownedReason = nlapiLookupField("item",item_id,"custitem194");
	
	nlapiLogExecution("debug","Bill Date",bill_date);
	nlapiLogExecution("debug","Bill Status",bill_status);
	nlapiLogExecution("debug","Order Date",order_date);
	nlapiLogExecution("debug","Order Status",order_status);
	nlapiLogExecution("debug","Bill Credit Date",bill_credit_date);
	nlapiLogExecution("debug","Receipt Date",receipt_date);
	nlapiLogExecution("debug","Receipt Created From",receipt_created_from);
	
	//If Bill Status = Paid In Full, item = PAID
	if(bill_status=="paidInFull")
		paid = true;
		
	if(bill_credit_date!=null)
	{
		//If most recent bill credit date > bill date, then item = NOT PAID
		var billDate = nlapiStringToDate(bill_date);
		var creditDate = nlapiStringToDate(bill_credit_date);
		
		if(creditDate > billDate)
			paid = false;
	}
	
	//If Sales Order = Pending Approval, Pending Fulfillment, Billed item = SOLD
	if(order_date!=null && order_date!="")
	{
		if(order_status=="pendingApproval" || order_status=="pendingFulfillment" || order_status=="partiallyFulfilled" || order_status=="fullyBilled")
			sold = true;
	}
	
	if(receipt_date!=null && receipt_date!="")
	{
		if(order_date!=null && order_date!="")
		{
			var receiptDate = nlapiStringToDate(receipt_date);
			var orderDate = nlapiStringToDate(order_date);
			
			if(receiptDate > orderDate)
			{
				if(receipt_created_from.substring(0,3)=="Ret")
					sold = false;
			}
		}
	}
	
	//If Owned Reason = Preset, then owned
	if(ownedReason=="5")
		owned = true;
	if(paid==true)
		owned = true;
	if(sold==true)
		owned = true;
		
	if(owned==true)
		owned = "2";
	else
		owned = "1";
		
	if(paid==true)
		paid = "1";
	else
		paid = "2";
		
	if(sold==true)
		sold = "1";
	else
		sold = "2";
		
	nlapiSubmitField("inventoryitem",item_id,["custitemmemovsowned","custitemsoldvsnotsold","custitempaidvsnotpaid"],[owned,sold,paid]); //10 UNITS
	
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