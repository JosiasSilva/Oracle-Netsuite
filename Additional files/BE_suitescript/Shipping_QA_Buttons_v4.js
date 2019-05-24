function Shipping_QA_Button_UE(type)
{
	if(type=="view")
	{
		try
		{
			var order = nlapiGetNewRecord();
			if((order.getFieldValue("custbody_shipping_qa_employee")==null || order.getFieldValue("custbody_shipping_qa_employee")=="") && (order.getFieldValue("orderstatus")=="B" || order.getFieldValue("orderstatus")=="D"))
			{
				//Check for existing item fulfillments
				var filters = [];
				filters.push(new nlobjSearchFilter("createdfrom",null,"is",nlapiGetRecordId()));
				filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
				filters.push(new nlobjSearchFilter("status",null,"noneof","ItemShip:C"));
				var results = nlapiSearchRecord("itemfulfillment",null,filters);
				if(results)
				{
					form.setScript("customscript_shipping_qa_logic");
					form.addButton("custpage_shipping_qa","Shipping QA","qaorder('"+nlapiGetRecordId()+"','"+nlapiGetUser()+"');");
				}
			}
			else if(order.getFieldValue("custbody_shipping_qa_employee")!=null && order.getFieldValue("custbody_shipping_qa_employee")!="")
			{
				var fulfill = null;
				
				var filters = [];
				filters.push(new nlobjSearchFilter("createdfrom",null,"is",nlapiGetRecordId()));
				filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
				var results = nlapiSearchRecord("itemfulfillment",null,filters);
				if(results)
				{
					fulfill = results[0].getId();
				}
				
				form.setScript("customscript_shipping_qa_logic");
				form.addButton("custpage_shipping_undo_qa","Revert QA","unqaorder('"+nlapiGetRecordId()+"','"+fulfill+"');");
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Shipping QA Button","Details: " + err.message);
			return true;
		}
	}
}

function qaorder(order,user)
{
	try
	{
		var truebalance = findTrueBalance(order);
		
		var orderFields = nlapiLookupField("salesorder",order,["custbody140","custbody194"],true);
		var csffstatus = orderFields.custbody140;
		var custbody194 = orderFields.custbody194;
		
		var alertMsg = "";
		
		if(truebalance > 0)
			alertMsg+= "This order has a balance of $" + nlapiFormatCurrency(truebalance) + ". ";
		
		if(csffstatus!=null && csffstatus!="")
			alertMsg+= "This order has a CS Fulfillment Status of " + csffstatus + ". ";
			
		if(custbody194!=null && custbody194!="" && custbody194.substring(0,3)!="DNU")
			alertMsg+= "Order is marked with Delivery Instrucionts: " + custbody194;
			
		if(alertMsg!="")
		{
			var proceed = confirm("Are you sure you want to continue? " + alertMsg);
			if(!proceed)
				return true;
		}
		
		//Get CS Fulfillment Status IDs
		var csIDs = nlapiLookupField("salesorder",order,"custbody140");
		if(csIDs.indexOf(",")!=-1)
		{
			csIDs = csIDs.split(",");
		}
		else if(csIDs!=null && csIDs!="")
		{
			var temp = csIDs;
			csIDs = [];
			csIDs.push(temp);
		}
		
		var newStatus = [];
		if(csIDs!=null && csIDs!="")
		{
			//newStatus = csIDs;
			//newStatus.push(csIDs);
			for(var x=0; x < csIDs.length; x++)
				newStatus.push(csIDs[x]);
		}
		
		newStatus.push("20");
		
		//Update CS Fulfillment Status on SO and log user name
		var orderRec = nlapiLoadRecord("salesorder",order);
		
		//If pick-up order and PU Location is not SF, set to In Transit too
		if(orderRec.getFieldValue("custbody53")=="T" && orderRec.getFieldValue("custbody_pickup_location")!="1")
		{
			newStatus.push("22"); //In Transit
		}
		
		orderRec.setFieldValues("custbody140",newStatus);
		orderRec.setFieldValue("custbody_shipping_qa_employee",user);
		if(csIDs!=null && csIDs!="")
			orderRec.setFieldValues("custbody_cs_ff_status_pre_qa",csIDs);
		if(orderRec.getFieldValue("custbody53")=="T")
			orderRec.setFieldValue('custbody58', 'At BE - All materials ready. ' + orderRec.getFieldValue('custbody58'));
		if(orderRec.getFieldValue("custbody39")!=null && orderRec.getFieldValue("custbody53")!="")
			orderRec.setFieldValue('custbody58', 'Drop Ship materials sent. ' + orderRec.getFieldValue('custbody58'));
		nlapiSubmitRecord(orderRec,true,true);
		
		//Update item fulfillment to Packed state (if available)
		var tracking = null;
		
		var filters = [];
		filters.push(new nlobjSearchFilter("createdfrom",null,"is",order));
		filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
		filters.push(new nlobjSearchFilter("status",null,"is","ItemShip:A"));
		var results = nlapiSearchRecord("itemfulfillment",null,filters);
		if(results)
		{
			var itemfulfillment = nlapiLoadRecord("itemfulfillment",results[0].getId());
			itemfulfillment.setFieldValue("shipstatus","B");
			
			if(itemfulfillment.getLineItemCount("packagefedex") > 0)
			{
				tracking = itemfulfillment.getLineItemValue("packagefedex","packagetrackingnumberfedex","1");
			}
			
			if(itemfulfillment.getFieldValue("custbody_fedex_ws_tracking_number")!=null && itemfulfillment.getFieldValue("custbody_fedex_ws_tracking_number")!="")
			{
				tracking = itemfulfillment.getFieldValue("custbody_fedex_ws_tracking_number");
				itemfulfillment.setFieldValue("custbody69",tracking);
			}
			
			nlapiSubmitRecord(itemfulfillment);
		}
		else
		{
			var filters2 = [];
			filters2.push(new nlobjSearchFilter("createdfrom",null,"is",order));
			filters2.push(new nlobjSearchFilter("mainline",null,"is","T"));
			filters2.push(new nlobjSearchFilter("status",null,"is","ItemShip:A"));
			var cols2 = [];
			cols2.push(new nlobjSearchColumn("custbody_fedex_ws_tracking_number"));
			var results2 = nlapiSearchRecord("itemfulfillment",null,filters2);
			if(results2)
			{
				if(results2[0].getValue("custbody_fedex_ws_tracking_number")!=null && results2[0].getValue("custbody_fedex_ws_tracking_number")!="")
				{
					tracking = results2[0].getValue("custbody_fedex_ws_tracking_number");
					nlapiSubmitField("itemfulfillment",results2[0].getId(),"custbody69",results2[0].getValue("custbody_fedex_ws_tracking_number"));
				}
			}
		}
		
		if(tracking!=null)
			nlapiSubmitField("salesorder",order,"custbody69",tracking);
		
		var url = nlapiResolveURL("RECORD","salesorder",order);
		
		window.location.href = url;
	}
	catch(err)
	{
		alert("Error QA'ing this order. Details: " + err.message);
	}
}

function unqaorder(order,fulfill)
{
	var unqa = confirm("Are you sure you want to continue? The item fulfillment will be deleted.");
	if(unqa)
	{
		if(fulfill!=null && fulfill!="")
		{
			nlapiDeleteRecord("itemfulfillment",fulfill);
			//var fulfillment = nlapiLoadRecord("itemfulfillment",fulfill);
			//fulfillment.setFieldValue("shipstatus","A");
			//nlapiSubmitRecord(fulfillment,true,true);
		}
		
		var csIDs = nlapiLookupField("salesorder",order,"custbody_cs_ff_status_pre_qa");
		if(csIDs.indexOf(",")!=-1)
		{
			csIDs = csIDs.split(",");
		}
		else if(csIDs!=null && csIDs!="")
		{
			var temp = csIDs;
			csIDs = [];
			csIDs.push(temp);
		}
		
		var orderRec = nlapiLoadRecord("salesorder",order);
		if(csIDs!=null && csIDs!="")
			orderRec.setFieldValues("custbody140",csIDs);
		else
			orderRec.setFieldValue("custbody140","");
		orderRec.setFieldValue("custbody_shipping_qa_employee","");
		nlapiSubmitRecord(orderRec,true,true);
		
		var url = nlapiResolveURL("RECORD","salesorder",order);
			
		window.location.href = url;
	}
	
}

function findTrueBalance(orderId)
{
	var payments = 0.00;
	var deposit_total = 0.00;
	var refunds = 0.00;
	
	var orderFields = nlapiLookupField("salesorder",orderId,["entity","total"]);
	var custId = orderFields.entity;
	var total = orderFields.total;
	
	//CUSTOMER PAYMENTS
	var filters = [];
	filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
	filters.push(new nlobjSearchFilter("createdfrom","appliedtotransaction","is",orderId));
	var cols = [];
	cols.push(new nlobjSearchColumn("appliedtoforeignamount",null,"sum"));
	var results = nlapiSearchRecord("customerpayment",null,filters,cols);
	if(results)
		payments = results[0].getValue("appliedtoforeignamount",null,"sum");
		
	if(payments==null || payments=="")
		payments = 0.00;
	
	nlapiLogExecution("debug","Customer Payments",payments);
	
	//CUSTOMER REFUNDS
	var deposits = [];
	var filters = [];
	filters.push(new nlobjSearchFilter("salesorder",null,"is",orderId));
	filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
	var cols = [];
	cols.push(new nlobjSearchColumn("fxamount"));
	var results = nlapiSearchRecord("customerdeposit",null,filters,cols);
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			deposits.push(results[x].getId());
			deposit_total += parseFloat(results[x].getValue("fxamount"));
		}
			
	}
	
	if(deposits.length > 0)
	{
		var deposit_ids = [];
		var filters = [];
		filters.push(new nlobjSearchFilter("internalid",null,"anyof",deposits));
		filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
		filters.push(new nlobjSearchFilter("type","applyingtransaction","is","DepAppl"));
		var cols = [];
		cols.push(new nlobjSearchColumn("applyingtransaction"));
		var results = nlapiSearchRecord("customerdeposit",null,filters,cols);
		if(results)
		{
			for(var x=0; x < results.length; x++)
				deposit_ids.push(results[x].getValue("applyingtransaction"));
		}
		
		nlapiLogExecution("debug","Deposit Application ID's",deposit_ids.toString());
		
		if(deposit_ids.length > 0)
		{
			var filters = [];
			filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
			filters.push(new nlobjSearchFilter("applyingtransaction",null,"anyof",deposit_ids));
			var cols = [];
			cols.push(new nlobjSearchColumn("applyingforeignamount",null,"sum"));
			var results = nlapiSearchRecord("customerrefund",null,filters,cols);
			if(results)
				refunds = results[0].getValue("applyingforeignamount",null,"sum");
				
			if(refunds==null || refunds=="")
				refunds = 0.00;	
		}
	}
	
	nlapiLogExecution("debug","Customer Refunds",refunds);
	
	//OPEN CREDIT MEMOS
	var credit = 0.00;
	var filters = [];
	filters.push(new nlobjSearchFilter("custrecord_credit_memo_link_parent",null,"is",orderId));
	var cols = [];
	cols.push(new nlobjSearchColumn("custrecord_credit_memo_link_amount",null,"sum"));
	var results = nlapiSearchRecord("customrecord_credit_memo_link",null,filters,cols);
	if(results)
		credit = results[0].getValue("custrecord_credit_memo_link_amount",null,"sum");
				
	if(credit==null || credit=="")
		credit = 0.00;	
	
	nlapiLogExecution("debug","Credit Memos (Open)",credit);
	
	//APPLIED CREDIT MEMOS
	var credit2 = 0.00;
	var filters = [];
	filters.push(new nlobjSearchFilter("entity",null,"is",custId));
	filters.push(new nlobjSearchFilter("createdfrom","appliedtotransaction","is",orderId));
	filters.push(new nlobjSearchFilter("type","appliedtotransaction","is","CustInvc"));
	filters.push(new nlobjSearchFilter("status",null,"is","CustCred:B"));
	var cols = [];
	cols.push(new nlobjSearchColumn("appliedtoforeignamount",null,"sum"));
	var results = nlapiSearchRecord("creditmemo",null,filters,cols);
	if(results)
		credit2 = results[0].getValue("appliedtoforeignamount",null,"sum");
				
	if(credit2==null || credit2=="")
		credit2 = 0.00;	
	
	nlapiLogExecution("debug","Credit Memos (Fully Applied)",credit2);
	
	//DEPOSITS WITH SALES ORDER LINK
	var deposit2 = 0.00;
	var filters = [];
	filters.push(new nlobjSearchFilter("entity",null,"is",custId));
	filters.push(new nlobjSearchFilter("createdfrom","appliedtotransaction","is",orderId));
	filters.push(new nlobjSearchFilter("type","appliedtotransaction","is","CustInvc"));
	filters.push(new nlobjSearchFilter("salesorder","createdfrom","is","@NONE@"));
	var cols = [];
	cols.push(new nlobjSearchColumn("appliedtoforeignamount",null,"sum"));
	var results = nlapiSearchRecord("depositapplication",null,filters,cols);
	if(results)
		deposit2 = results[0].getValue("appliedtoforeignamount",null,"sum");
				
	if(deposit2==null || deposit2=="")
		deposit2 = 0.00;
		
	nlapiLogExecution("debug","Deposits Not Linked to SO",deposit2);
		
	var balance = parseFloat(total) - parseFloat(payments) - parseFloat(deposit_total) + parseFloat(refunds) + parseFloat(credit) - parseFloat(credit2) - parseFloat(deposit2);
	
	nlapiLogExecution("debug","Balance",balance);
	
	return balance;
}