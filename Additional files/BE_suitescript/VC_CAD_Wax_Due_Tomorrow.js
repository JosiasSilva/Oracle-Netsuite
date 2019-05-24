nlapiLogExecution("audit","FLOStart",new Date().getTime());
function All_Purchase_Orders(request,response)
{
	var pos = [];
	
	var search = nlapiLoadSearch("purchaseorder","customsearch1225");
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
				"custpage_sales_order_num" : results[x].getValue("tranid","createdfrom"),
				"custpage_cad_wax_due_date" : results[x].getValue("custbody116"),
				"custpage_cad_rx" : results[x].getValue("custbody124"),
				"custpage_so_custom_design" : results[x].getText("custbody16","createdfrom"),
				"custpage_design_approval_status" : results[x].getText("custbody41"),
				"custpage_so_cad_wax_status" : results[x].getText("custbody155","createdfrom"),
				"custpage_so_delivery_date" : results[x].getValue("custbody6","createdfrom")
			});
		}
		searchid++;
	}while(results.length >= 1000);
	
	var list = nlapiCreateList("CAD or Wax Due Tomorrow");
	list.addColumn("custpage_date","date","Date Created");
	list.addColumn("custpage_sales_order_num","text","Created From : Number");
	var linkCol = list.addColumn("custpage_number","text","Number","left");
	linkCol.setURL(nlapiResolveURL("RECORD","purchaseorder"));
	linkCol.addParamToURL("id","custpage_id",true);
	list.addColumn("custpage_cad_wax_due_date","date","Cad or Wax Due Date");
	list.addColumn("custpage_cad_rx","text","Cad Rx");
	list.addColumn("custpage_so_custom_design","text","Created From : Custom Design");
	list.addColumn("custpage_design_approval_status","text","PO Status");
	list.addColumn("custpage_so_cad_wax_status","text","SO Status");
	list.addColumn("custpage_so_delivery_date","date","Created From : Delivery Date");
	list.addColumn("custpage_status","text","Status");
	
	list.addRows(pos);
	
	response.writePage(list);
}
