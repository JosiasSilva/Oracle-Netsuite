nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Purchase_Orders_Pending_Bill(request,response)
{
	var pos = [];
	
	var search = nlapiLoadSearch("purchaseorder","customsearch1226");
	search.addFilter(new nlobjSearchFilter("entity",null,"is",nlapiGetUser()));
	var resultSet = search.runSearch();
	var searchid = 0;
	do{
		var results = resultSet.getResults(searchid,searchid+1000);
		for(var x=0; x < results.length; x++)
		{
			pos.push({
				"custpage_id" : results[x].getId(),
				"custpage_number" : results[x].getValue("tranid"),
				"custpage_vendor_name" : results[x].getValue("entityid","entity"),
				"custpage_status" : results[x].getText("status"),
				"custpage_date_needed_by_ch" : results[x].getValue("custbody59"),
				"custpage_date_shipped" : results[x].getValue("custbody209"),
				"custpage_amount" : results[x].getValue("amount"),
				"custpage_item" : results[x].getText("item"),
				"custpage_memo" : results[x].getValue("memo"),
				"custpage_invoice_number" : results[x].getValue("custcol_invoice_number")
			});
		}
		searchid++;
	}while(results.length >= 1000);
	
	var list = nlapiCreateList("Purchase Orders Pending Bill");
	var linkCol = list.addColumn("custpage_number","text","Number","left");
	linkCol.setURL(nlapiResolveURL("RECORD","purchaseorder"));
	linkCol.addParamToURL("id","custpage_id",true);
	list.addColumn("custpage_vendor_name","text","Vendor : Name","left");
	list.addColumn("custpage_status","text","Status","left");
	list.addColumn("custpage_date_needed_by_ch","date","Date Needed in SF","left");
	list.addColumn("custpage_date_shipped","date","Date Shipped from Vendor","left");
	list.addColumn("custpage_amount","currency","Amount","right");
	list.addColumn("custpage_item","text","Item","left");
	list.addColumn("custpage_memo","text","Memo","left");
	list.addColumn("custpage_invoice_number","text","Invoice Number","left");
	
	list.addRows(pos);
	
	response.writePage(list);
}
