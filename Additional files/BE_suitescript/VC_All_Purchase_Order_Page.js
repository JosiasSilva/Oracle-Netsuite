nlapiLogExecution("audit","FLOStart",new Date().getTime());
function All_Purchase_Orders(request,response)
{
	var pos = [];
	
	var search = nlapiLoadSearch("purchaseorder","customsearch1184");
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
				"custpage_date" : results[x].getValue("trandate"),
				"custpage_status" : results[x].getText("status"),
				"custpage_date_needed_by_ch" : results[x].getValue("custbody59"),
				"custpage_amount" : results[x].getValue("amount"),
				"custpage_vendor" : results[x].getText("entity"),
				"custpage_date_shipped_from_vendor" : results[x].getValue("custbody209")
			});
		}
		searchid++;
	}while(results.length >= 1000);
	
	var list = nlapiCreateList("All Open Purchase Orders");
	list.addColumn("custpage_date","date","Date Created","left");
	var linkCol = list.addColumn("custpage_number","text","Number","left");
	linkCol.setURL(nlapiResolveURL("RECORD","purchaseorder"));
	linkCol.addParamToURL("id","custpage_id",true);
	list.addColumn("custpage_vendor","text","Name","left");
	list.addColumn("custpage_date_needed_by_ch","date","Date Needed in SF","left");
	list.addColumn("custpage_status","text","Status","left");
	list.addColumn("custpage_amount","currency","Amount","right");
	list.addColumn("custpage_date_shipped_from_vendor","date","Date Shipped from Vendor","left");
	
	list.addRows(pos);
	
	response.writePage(list);
}
