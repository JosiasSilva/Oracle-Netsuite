function Pickup_Receipt_Email(request,response)
{	
	var rtnObj = {
		success : false,
		error : ""
	}
	
	try
	{
		var emailMerger = nlapiCreateEmailMerger(1180);
		emailMerger.setEntity("customer",parseInt(request.getParameter("customer")));
		emailMerger.setTransaction(parseInt(request.getParameter("fulfillment")));
		var mergeResult = emailMerger.merge();
		
		var records = new Object();
		records["entity"] = request.getParameter("customer");
		records["transaction"] = request.getParameter("fulfillment");
		
		//Find signed PU receipt for attachment
		var puReceipt = null;
		
		var filters = [];
		filters.push(new nlobjSearchFilter("custrecord_signnow_customer",null,"is",request.getParameter("customer")));
		filters.push(new nlobjSearchFilter("custrecord_document_type",null,"is","4"));
		filters.push(new nlobjSearchFilter("custrecord_signnow_status",null,"anyof",["3","4"]));
		var cols = [];
		cols.push(new nlobjSearchColumn("internalid").setSort(true));
		cols.push(new nlobjSearchColumn("custrecord_signnow_document"));
		var results = nlapiSearchRecord("customrecord_custom_signnow_document",null,filters,cols);
		if(results)
		{
			puReceipt = nlapiLoadFile(results[0].getValue("custrecord_signnow_document"));
		}
		
		nlapiSendEmail("20561",request.getParameter("customer"),mergeResult.getSubject(),mergeResult.getBody(),null,null,records,puReceipt);
		
		rtnObj.success = true;
	}
	catch(err)
	{
		rtnObj.error = err.message;
	}
	
	response.write(JSON.stringify(rtnObj));
}
