nlapiLogExecution("audit","FLOStart",new Date().getTime());
function graphHolder(portlet,column)
{
	try
	{
		//Get Date Filter Parameter
		var dateRange
		var filter = nlapiGetContext().getSetting("SCRIPT","custscript_graph_weekly_rev_date_range")
		
		switch(filter)
		{
			case "1":
				dateRange = "thisweek"
				break
			case "2":
				dateRange = "lastweek"
				break
			case "3":
				dateRange = "last2weeks"
				break
			default:
				dateRange = "thisweek"
				break
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Getting Parameters","Error getting date filter parameter. Details: " + err.message)
		return true
	}
	
	try
	{
		var URL = nlapiResolveURL("SUITELET","customscript_weekly_rev_by_rep_graph","customdeploy_weekly_rev_by_rep_graph")
		URL += "&range=" + dateRange
		nlapiLogExecution("debug","URL",URL)
		var content = "<td><iframe src='" + URL + "' frameborder='0' height='400' width='100%' scrolling='no'></iframe></td>"
		portlet.setTitle("Sales KPI Graph Portlet")
		portlet.setHtml(content)
	}
	catch(err)
	{
		nlapiLogExecution("error","Error","Details: " + err.message)
		return true
	}
}

function Weekly_Credit_Memos(portlet,column)
{
	try
	{
		//Get Date Filter Parameter
		var dateRange
		var filter = nlapiGetContext().getSetting("SCRIPT","custscript_graph_weekly_cred_date_range")
		
		switch(filter)
		{
			case "1":
				dateRange = "thisweek"
				break
			case "2":
				dateRange = "lastweek"
				break
			case "3":
				dateRange = "last2weeks"
				break
			default:
				dateRange = "thisweek"
				break
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Getting Parameters","Error getting date filter parameter. Details: " + err.message)
		return true
	}
	
	try
	{
		var URL = nlapiResolveURL("SUITELET","customscript_weekly_credit_memos","customdeploy_weekly_credit_memos")
		URL += "&range=" + dateRange
		nlapiLogExecution("debug","URL",URL)
		var content = "<td><iframe src='" + URL + "' frameborder='0' height='400' width='100%' scrolling='no'></iframe></td>"
		portlet.setTitle("Sales KPI Graph Portlet")
		portlet.setHtml(content)
	}
	catch(err)
	{
		nlapiLogExecution("error","Error","Details: " + err.message)
		return true
	}
}

function Weeklys_Order_Count(portlet,column)
{
	try
	{
		//Get Date Filter Parameter
		var dateRange
		var filter = nlapiGetContext().getSetting("SCRIPT","custscript_graph_weekly_ord_date_range")
		
		switch(filter)
		{
			case "1":
				dateRange = "thisweek"
				break
			case "2":
				dateRange = "lastweek"
				break
			case "3":
				dateRange = "last2weeks"
				break
			default:
				dateRange = "thisweek"
				break
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Getting Parameters","Error getting date filter parameter. Details: " + err.message)
		return true
	}
	
	try
	{
		var URL = nlapiResolveURL("SUITELET","customscript_orders_by_rep_graph","customdeploy_orders_by_rep_graph")
		URL += "&range=" + dateRange
		nlapiLogExecution("debug","URL",URL)
		var content = "<td><iframe src='" + URL + "' frameborder='0' height='400' width='100%' scrolling='no'></iframe></td>"
		portlet.setTitle("Sales KPI Graph Portlet")
		portlet.setHtml(content)
	}
	catch(err)
	{
		nlapiLogExecution("error","Error","Details: " + err.message)
		return true
	}
}