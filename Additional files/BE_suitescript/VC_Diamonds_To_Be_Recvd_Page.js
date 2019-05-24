nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Diamonds_To_Be_Received(request,response)
{
	var pos = [];
	
	var search = nlapiLoadSearch("purchaseorder","customsearch1242");
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
				"custpage_item" : results[x].getText("item"),
				"custpage_date_needed_by_ch" : results[x].getValue("custbody59"),
				"custpage_memo" : results[x].getValue("memo"),
				"custpage_drop_ship_materials_sent" : results[x].getValue("custbody39"),
				"custpage_diamond_received" : results[x].getValue("custbody208"),
				"custpage_date_sent_from_sf" : results[x].getValue("custcol18"),
				"custpage_comments" : results[x].getValue("custcol5")
			});
		}
		searchid++;
	}while(results.length >= 1000);
	
	var list = nlapiCreateList("Diamonds To Be Received");
	
	list.addColumn("custpage_date","date","Date Created","left");
	var linkCol = list.addColumn("custpage_number","text","Number","left");
	linkCol.setURL(nlapiResolveURL("RECORD","purchaseorder"));
	linkCol.addParamToURL("id","custpage_id",true);
	list.addColumn("custpage_diamond_received","text","Diamond Received By Vendor","left");
	list.addColumn("custpage_date_needed_by_ch","date","Date Needed in SF","left");
	list.addColumn("custpage_date_sent_from_sf","date","Date Sent from SF","left");
	list.addColumn("custpage_item","text","Item","left");
	list.addColumn("custpage_memo","text","Memo","left");
	list.addColumn("custpage_comments","text","Comments","left");
	
	list.addRows(pos);
	
	response.writePage(list);
}
