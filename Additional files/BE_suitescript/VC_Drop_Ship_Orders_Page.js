nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Drop_Ship_Orders(request,response)
{
	var pos = [];
	
	var search = nlapiLoadSearch("purchaseorder","customsearch1241");
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
				"custpage_so_number" : results[x].getValue("tranid","createdfrom"),
				"custpage_date_needed_by_ch" : results[x].getValue("custbody59"),
				"custpage_date_shipped_from_vendor" : results[x].getValue("custbody209"),
				"custpage_so_shipping_addr" : results[x].getValue("shipaddress","createdfrom"),
				"custpage_drop_ship_materials_sent" : results[x].getValue("custbody39"),
				"custpage_vendor" : results[x].getText("entity")
			});
		}
		searchid++;
	}while(results.length >= 1000);
	
	var list = nlapiCreateList("Drop Ship Orders");
	list.addColumn("custpage_date","date","Date Created","left");
	var linkCol = list.addColumn("custpage_number","text","Number","left");
	linkCol.setURL(nlapiResolveURL("RECORD","purchaseorder"));
	linkCol.addParamToURL("id","custpage_id",true);
	list.addColumn("custpage_date_shipped_from_vendor","date","Date Shipped from Vendor","left");
	list.addColumn("custpage_date_needed_by_ch","date","Date Needed in SF","left");
	list.addColumn("custpage_drop_ship_materials_sent","text","Drop Ship Materials Sent to Vendor","left");
	list.addColumn("custpage_so_number","text","Created From : Number","left");
	list.addColumn("custpage_so_shipping_addr","text","Created From : Shipping Address","left");
	
	list.addRows(pos);
	
	response.writePage(list);
}
