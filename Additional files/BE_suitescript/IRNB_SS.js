var IRNB_OWNED = "405"; //2400-1 IRNB-Owned
var COGS_VENDOR_VARIANCE = "360"; //5030-3 Vendor Bill Variance
var IRNB_MEMO = "406"; //2400-2 IRNB-Memo

function IRNB()
{
	var shipped = [];
	var non_shipped_owned = [];
	var non_shipped_memo = [];
	
	var results = nlapiSearchRecord("transaction","customsearch_irnb_script_search");
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			var soStatus = results[x].getValue("status","createdfrom");
			nlapiLogExecution("debug","Sales Order Status",soStatus);
			
			if(soStatus=="pendingBilling" || soStatus=="fullyBilled" || soStatus=="partiallyFulfilled")
			{
				shipped.push({
					item : results[x].getValue("item"),
					bill_amount : parseFloat(results[x].getValue("amount","billingtransaction")),
					receipt_amount : parseFloat(results[x].getValue("amount","applyingtransaction")),
					asset_account : results[x].getValue("assetaccount","item"),
					item_receipt : results[x].getValue("applyingtransaction"),
					vendor_bill : results[x].getValue("billingtransaction"),
					location : results[x].getValue("location"),
					purchase_order : results[x].getId(),
					po_line : results[x].getValue("line")
				});
			}
			else
			{
				if(results[x].getValue("assetaccount","item")=="183" || results[x].getValue("assetaccount","item")=="256")
				{
					non_shipped_owned.push({
						item : results[x].getValue("item"),
						bill_amount : parseFloat(results[x].getValue("amount","billingtransaction")),
						receipt_amount : parseFloat(results[x].getValue("amount","applyingtransaction")),
						asset_account : results[x].getValue("assetaccount","item"),
						item_receipt : results[x].getValue("applyingtransaction"),
						vendor_bill : results[x].getValue("billingtransaction"),
						location : results[x].getValue("location"),
						purchase_order : results[x].getId(),
						po_line : results[x].getValue("line")
					});
				}
				else
				{
					non_shipped_memo.push({
						item : results[x].getValue("item"),
						bill_amount : parseFloat(results[x].getValue("amount","billingtransaction")),
						receipt_amount : parseFloat(results[x].getValue("amount","applyingtransaction")),
						asset_account : results[x].getValue("assetaccount","item"),
						item_receipt : results[x].getValue("applyingtransaction"),
						vendor_bill : results[x].getValue("billingtransaction"),
						purchase_order : results[x].getId(),
						po_line : results[x].getValue("line")
					});
				}
			}
		}
	}
	
	if(shipped!=null && shipped!="" && shipped.length > 0)
	{
		var je = nlapiCreateRecord("journalentry");
		je.setFieldValue("custbody_irnb_je","T");
		
		for(var x=0; x < shipped.length; x++)
		{
			if(shipped[x].bill_amount < shipped[x].receipt_amount)
			{
				je.selectNewLineItem("line");
				
				if(shipped[x].asset_account=="183" || shipped[x].asset_account=="256")
				{
					//Asset Account = 1200-08 Inventory - Loose Diamond (own) OR 1200-12 Inventory - Estate
					je.setCurrentLineItemValue("line","account",IRNB_OWNED);
				}
				else if(shipped[x].asset_account=="189" || shipped[x].asset_account=="270")
				{
					//Asset Account = 1210 On Memo-Diamonds OR 1211 On Memo-Estate
					je.setCurrentLineItemValue("line","account",IRNB_MEMO);
				}
				
				je.setCurrentLineItemValue("line","debit",shipped[x].receipt_amount - shipped[x].bill_amount);
				je.setCurrentLineItemValue("line","custcol_je_item_receipt",shipped[x].item_receipt);
				je.setCurrentLineItemValue("line","custcol_je_item",shipped[x].item);
				je.setCurrentLineItemValue("line","custcol_vendor_bill",shipped[x].vendor_bill);
				je.setCurrentLineItemValue("line","memo","Automated Inventory Received Not Billed (IRNB) adjustment");
				je.commitLineItem("line");
				
				je.selectNewLineItem("line");
				je.setCurrentLineItemValue("line","account",COGS_VENDOR_VARIANCE);
				je.setCurrentLineItemValue("line","credit",shipped[x].receipt_amount - shipped[x].bill_amount);
				je.setCurrentLineItemValue("line","custcol_je_item_receipt",shipped[x].item_receipt);
				je.setCurrentLineItemValue("line","custcol_je_item",shipped[x].item);
				je.setCurrentLineItemValue("line","custcol_vendor_bill",shipped[x].vendor_bill);
				je.setCurrentLineItemValue("line","memo","Automated Inventory Received Not Billed (IRNB) adjustment");
				je.commitLineItem("line");
			}
			else
			{
				je.selectNewLineItem("line");
				
				if(shipped[x].asset_account=="183" || shipped[x].asset_account=="256")
				{
					//Asset Account = 1200-08 Inventory - Loose Diamond (own) OR 1200-12 Inventory - Estate
					je.setCurrentLineItemValue("line","account",IRNB_OWNED);
				}
				else if(shipped[x].asset_account=="189" || shipped[x].asset_account=="270")
				{
					//Asset Account = 1210 On Memo-Diamonds OR 1211 On Memo-Estate
					je.setCurrentLineItemValue("line","account",IRNB_MEMO);
				}
				
				je.setCurrentLineItemValue("line","credit",shipped[x].receipt_amount - shipped[x].bill_amount);
				je.setCurrentLineItemValue("line","custcol_je_item_receipt",shipped[x].item_receipt);
				je.setCurrentLineItemValue("line","custcol_je_item",shipped[x].item);
				je.setCurrentLineItemValue("line","custcol_vendor_bill",shipped[x].vendor_bill);
				je.setCurrentLineItemValue("line","memo","Automated Inventory Received Not Billed (IRNB) adjustment");
				je.commitLineItem("line");
				
				je.selectNewLineItem("line");
				je.setCurrentLineItemValue("line","account",COGS_VENDOR_VARIANCE);
				je.setCurrentLineItemValue("line","debit",shipped[x].receipt_amount - shipped[x].bill_amount);
				je.setCurrentLineItemValue("line","custcol_je_item_receipt",shipped[x].item_receipt);
				je.setCurrentLineItemValue("line","custcol_je_item",shipped[x].item);
				je.setCurrentLineItemValue("line","custcol_vendor_bill",shipped[x].vendor_bill);
				je.setCurrentLineItemValue("line","memo","Automated Inventory Received Not Billed (IRNB) adjustment");
				je.commitLineItem("line");
			}
		}
		
		nlapiSubmitRecord(je,true,true);
	}
	
	if(non_shipped_owned!=null && non_shipped_owned!="" && non_shipped_owned.length > 0)
	{
		var ia = nlapiCreateRecord("inventoryadjustment");
		ia.setFieldValue("account",IRNB_OWNED);
		
		for(var x=0; x < non_shipped_owned.length; x++)
		{
			ia.selectNewLineItem("inventory");
			ia.setCurrentLineItemValue("inventory","item",non_shipped_owned[x].item);
			ia.setCurrentLineItemValue("inventory","location",non_shipped_owned[x].location);
			ia.setCurrentLineItemValue("inventory","adjustqtyby",-1);
			ia.commitLineItem("inventory");
			
			nlapiLogExecution("debug","Unit Cost",non_shipped_owned[x].bill_amount);
			
			ia.selectNewLineItem("inventory");
			ia.setCurrentLineItemValue("inventory","item",non_shipped_owned[x].item);
			ia.setCurrentLineItemValue("inventory","location",non_shipped_owned[x].location);
			ia.setCurrentLineItemValue("inventory","adjustqtyby",1);
			ia.setCurrentLineItemValue("inventory","unitcost",Math.abs(non_shipped_owned[x].bill_amount));
			ia.commitLineItem("inventory");
		}
		
		nlapiSubmitRecord(ia,true,true);
	}
	
	if(non_shipped_memo!=null && non_shipped_memo!="" && non_shipped_memo.length > 0)
	{
		var ia = nlapiCreateRecord("inventoryadjustment");
		ia.setFieldValue("account",IRNB_MEMO);
		
		for(var x=0; x < non_shipped_memo.length; x++)
		{
			ia.selectNewLineItem("inventory");
			ia.setCurrentLineItemValue("inventory","item",non_shipped_memo[x].item);
			ia.setCurrentLineItemValue("inventory","location",non_shipped_memo[x].location);
			ia.setCurrentLineItemValue("inventory","adjustqtyby",-1);
			ia.commitLineItem("inventory");
			
			nlapiLogExecution("debug","Unit Cost",non_shipped_memo[x].bill_amount);
			
			ia.selectNewLineItem("inventory");
			ia.setCurrentLineItemValue("inventory","item",non_shipped_memo[x].item);
			ia.setCurrentLineItemValue("inventory","location",non_shipped_memo[x].location);
			ia.setCurrentLineItemValue("inventory","adjustqtyby",1);
			ia.setCurrentLineItemValue("inventory","unitcost",Math.abs(non_shipped_memo[x].bill_amount));
			ia.commitLineItem("inventory");
		}
		
		nlapiSubmitRecord(ia,true,true);
	}
	
	//For those items that have shipped, update the SO line column (custcol_irnb_amount) so that we can use this value on the item receipt of an RMA
	if(shipped!=null && shipped!="" && shipped.length > 0)
	{
		for(var x=0; x < shipped.length; x++)
		{
			var filters1 = [];
			filters1.push(new nlobjSearchFilter("item",null,"is",shipped[x].item));
			filters1.push(new nlobjSearchFilter("status",null,"anyof",["SalesOrd:D","SalesOrd:E","SalesOrd:F","SalesOrd:G"]));
			var results1 = nlapiSearchRecord("salesorder",null,filters1);
			if(results1)
			{
				var so = nlapiLoadRecord("salesorder",results1[0].getId());
				var line = so.findLineItemValue("item","item",shipped[x].item);
				so.setLineItemValue("item","custcol_irnb_amount",line,Math.abs(shipped[x].bill_amount));
				nlapiSubmitRecord(so,true,true);
			}
		}
	}
	
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			var po = nlapiLoadRecord("purchaseorder",results[x].getId());
			for(var i=0; i < po.getLineItemCount("item"); i++)
			{
				if(po.getLineItemValue("item","item",i+1)==results[x].getValue("item") && po.getLineItemValue("item","line",i+1)==results[x].getValue("line"))
				{
					po.setLineItemValue("item","custcol_irnb_generated",i+1,"T");
				}
			}
			nlapiSubmitRecord(po,true,true);
		}
	}
}
