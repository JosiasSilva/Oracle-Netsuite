function salesRepMetricsGraph(portlet, column)
{
	try
	{
		//Get the Sales Rep parameter (if assigned) for the portlet to filter the Sales Rep for the metrics
		var repDefined
		var salesRep = nlapiGetContext().getSetting("SCRIPT", "custscript_sales_rep_metrics_graph_rep")
		if(salesRep==null || salesRep=="")
			repDefined=false
		else
			repDefined=true
	}
	catch(err)
	{
		nlapiLogExecution("error", "Sales Rep Metrics Graph Error", "Error getting Sales Rep parameter. Details: " + err.message)
		return true
	}
	
	try
	{
		//Get Lead Source Filter (if assigned)
		var leadSourceDefined
		var leadSource = nlapiGetContext().getSetting("SCRIPT", "custscript_graph_lead_source_filter")
		if(leadSource==null || leadSource=="")
			leadSourceDefined = false
		else
			leadSourceDefined = true
			
		var leadSourceTitle = ""
		if(leadSourceDefined==true)
			leadSourceTitle = nlapiLookupField("campaign", leadSource, "title")
	}
	catch(err)
	{
		nlapiLogExecution("error", "Sales Rep Metrics Graph Error", "Error getting Lead Source parameter. Details: " + err.message)
		return true
	}
	
	try
	{
		//Get Appointment Filter (if assigned)
		var appointmentSelected = false
		var appointment = nlapiGetContext().getSetting("SCRIPT", "custscript_graph_metric_apt")
		nlapiLogExecution("error", "Appointment", appointment)
		if(appointment==null || appointment=="")
			appointmentSelected = false
		else
			appointmentSelected = true
	}
	catch(err)
	{
		nlapiLogExecution("error", "Sales Rep Metrics Graph Error", "Error getting Appointment parameter. Details: " + err.message)
		return true
	}
	
	try
	{
		//Set Portlet Title
		portlet.setTitle("Sales Rep Metrics")	
	}
	catch(err)
	{
		nlapiLogExecution("error", "Sales Rep Metrics Graph Error", "Error setting portlet title. Details: " + err.message)
		return true
	}
	
	try
	{
		//Month Labels for X Axis
		var monthLabels = new Array()
		monthLabels[0] = "Jan"
		monthLabels[1] = "Feb"
		monthLabels[2] = "Mar"
		monthLabels[3] = "Apr"
		monthLabels[4] = "May"
		monthLabels[5] = "Jun"
		monthLabels[6] = "Jul"
		monthLabels[7] = "Aug"
		monthLabels[8] = "Sep"
		monthLabels[9] = "Oct"
		monthLabels[10] = "Nov"
		monthLabels[11] = "Dec"
		
		var currentMonth = new Date().getMonth()
		var monthIndex = currentMonth+1
		var monthLabelStr = ""
		
		for(var x=0; x < 12; x++)
		{
			monthLabelStr += monthLabels[monthIndex]
			if(x+1<12)
				monthLabelStr += "|"
			monthIndex++
			if(monthIndex==12)
				monthIndex = 0
		}
		//nlapiLogExecution("error", "DEBUG: Month String",monthLabelStr)
	}
	catch(err)
	{
		nlapiLogExecution("error", "Sales Rep Metrics Graph Error", "Error constructing x axis month label string. Details: " + err.message)
		return true
	}
	
	try
	{
		//Get Sales Metrics from NetSuite Saved Search
		var metric_data = new Array(12)
		
		//Past Month 1
		var filters = new Array()
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago1", "monthsago0")
		
		if(repDefined)
		{
			filters[1] = new nlobjSearchFilter("salesrep", null, "is", salesRep)
		}
		
		if(leadSourceDefined)
			filters.push(new nlobjSearchFilter("leadsource", null, "is", leadSource))
			
		if(appointmentSelected)
		{
			switch(appointment)
			{
				case "1":
					filters.push(new nlobjSearchFilter("custentity46", null, "is", "T"));
					break;
				case "2":
					filters.push(new nlobjSearchFilter("custentity46", null, "is", "F"));
					break;
			}	
		}
		
		var results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[11] = new Array()
			metric_data[11]["leads"] = results[0].getValue("altname", null, "count")
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="# Conversions")
				{
					metric_data[11]["conversions"] = results[0].getValue(searchCols[i])
					if(parseInt(metric_data[11]["conversions"]) < 5)
						metric_data[11]["conversions"] = 0
				}
			}
		}
		else
		{
			metric_data[11]["leads"] = "0"
			metric_data[11]["conversions"] = "0"
		}
		
		nlapiLogExecution("error", "SCRIPT DEBUG", "Past Month 1 Successfully...")
		
		//Past Month 2
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago2", "monthsago1")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[10] = new Array()
			metric_data[10]["leads"] = results[0].getValue("altname", null, "count")
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="# Conversions")
				{
					metric_data[10]["conversions"] = results[0].getValue(searchCols[i])
					if(parseInt(metric_data[10]["conversions"]) < 5)
						metric_data[10]["conversions"] = 0
				}
			}
		}
		else
		{
			metric_data[10]["leads"] = "0"
			metric_data[10]["conversions"] = "0"
		}
		
		nlapiLogExecution("error", "SCRIPT DEBUG", "Past Month 2 Successfully...")
		
		//Past Month 3
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago3", "monthsago2")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[9] = new Array()
			metric_data[9]["leads"] = results[0].getValue("altname", null, "count")
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="# Conversions")
				{
					metric_data[9]["conversions"] = results[0].getValue(searchCols[i])
					if(parseInt(metric_data[9]["conversions"]) < 5)
						metric_data[9]["conversions"] = 0
				}
			}
		}
		else
		{
			metric_data[9]["leads"] = "0"
			metric_data[9]["conversions"] = "0"
		}
		
		nlapiLogExecution("error", "SCRIPT DEBUG", "Past Month 3 Successfully...")
		
		//Past Month 4
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago4", "monthsago3")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[8] = new Array()
			metric_data[8]["leads"] = results[0].getValue("altname", null, "count")
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="# Conversions")
				{
					metric_data[8]["conversions"] = results[0].getValue(searchCols[i])
					if(parseInt(metric_data[8]["conversions"]) < 5)
						metric_data[8]["conversions"] = 0
				}
			}
		}
		else
		{
			metric_data[8]["leads"] = "0"
			metric_data[8]["conversions"] = "0"
		}
		
		nlapiLogExecution("error", "SCRIPT DEBUG", "Past Month 4 Successfully...")	
		
		//Past Month 5
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago5", "monthsago4")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[7] = new Array()
			metric_data[7]["leads"] = results[0].getValue("altname", null, "count")
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="# Conversions")
				{
					metric_data[7]["conversions"] = results[0].getValue(searchCols[i])
					if(parseInt(metric_data[7]["conversions"]) < 5)
						metric_data[7]["conversions"] = 0
				}
			}
		}	
		else
		{
			metric_data[7]["leads"] = "0"
			metric_data[7]["conversions"] = "0"
		}
		
		nlapiLogExecution("error", "SCRIPT DEBUG", "Past Month 5 Successfully...")
		
		//Past Month 6
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago6", "monthsago5")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[6] = new Array()
			metric_data[6]["leads"] = results[0].getValue("altname", null, "count")
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="# Conversions")
				{
					metric_data[6]["conversions"] = results[0].getValue(searchCols[i])
					if(parseInt(metric_data[6]["conversions"]) < 5)
						metric_data[6]["conversions"] = 0
				}
			}
		}
		else
		{
			metric_data[6]["leads"] = "0"
			metric_data[6]["conversions"] = "0"
		}	
		
		nlapiLogExecution("error", "SCRIPT DEBUG", "Past Month 6 Successfully...")
		
		//Past Month 7
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago7", "monthsago6")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[5] = new Array()
			metric_data[5]["leads"] = results[0].getValue("altname", null, "count")
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="# Conversions")
				{
					metric_data[5]["conversions"] = results[0].getValue(searchCols[i])
					if(parseInt(metric_data[5]["conversions"]) < 5)
						metric_data[5]["conversions"] = 0
				}
			}
		}
		else
		{
			metric_data[5]["leads"] = "0"
			metric_data[5]["conversions"] = "0"
		}
		
		nlapiLogExecution("error", "SCRIPT DEBUG", "Past Month 7 Successfully...")	
		
		//Past Month 8
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago8", "monthsago7")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[4] = new Array()
			metric_data[4]["leads"] = results[0].getValue("altname", null, "count")
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="# Conversions")
				{
					metric_data[4]["conversions"] = results[0].getValue(searchCols[i])
					if(parseInt(metric_data[4]["conversions"]) < 5)
						metric_data[4]["conversions"] = 0
				}
			}
		}
		else
		{
			metric_data[4]["leads"] = "0"
			metric_data[4]["conversions"] = "0"
		}
		
		nlapiLogExecution("error", "SCRIPT DEBUG", "Past Month 8 Successfully...")	
		
		//Past Month 9
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago9", "monthsago8")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[3] = new Array()
			metric_data[3]["leads"] = results[0].getValue("altname", null, "count")
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="# Conversions")
				{
					metric_data[3]["conversions"] = results[0].getValue(searchCols[i])
					if(parseInt(metric_data[3]["conversions"]) < 5)
						metric_data[3]["conversions"] = 0
				}
			}
		}
		else
		{
			metric_data[3]["leads"] = "0"
			metric_data[3]["conversions"] = "0"
		}
		
		nlapiLogExecution("error", "SCRIPT DEBUG", "Past Month 9 Successfully...")	
		
		//Past Month 10
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago10", "monthsago9")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[2] = new Array()
			metric_data[2]["leads"] = results[0].getValue("altname", null, "count")
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="# Conversions")
				{
					metric_data[2]["conversions"] = results[0].getValue(searchCols[i])
					if(parseInt(metric_data[2]["conversions"]) < 5)
						metric_data[2]["conversions"] = 0
				}
			}
		}
		else
		{
			metric_data[2]["leads"] = "0"
			metric_data[2]["conversions"] = "0"
		}
		
		nlapiLogExecution("error", "SCRIPT DEBUG", "Past Month 10 Successfully...")	
		
		//Past Month 11
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago11", "monthsago10")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[1] = new Array()
			metric_data[1]["leads"] = results[0].getValue("altname", null, "count")
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="# Conversions")
				{
					metric_data[1]["conversions"] = results[0].getValue(searchCols[i])
					if(parseInt(metric_data[1]["conversions"]) < 5)
						metric_data[1]["conversions"] = 0
				}
			}
		}
		else
		{
			metric_data[1]["leads"] = "0"
			metric_data[1]["conversions"] = "0"
		}
		
		nlapiLogExecution("error", "SCRIPT DEBUG", "Past Month 11 Successfully...")	
		
		//Past Month 12
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago12", "monthsago11")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[0] = new Array()
			metric_data[0]["leads"] = results[0].getValue("altname", null, "count")
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="# Conversions")
				{
					metric_data[0]["conversions"] = results[0].getValue(searchCols[i])
					if(parseInt(metric_data[0]["conversions"]) < 5)
						metric_data[0]["conversions"] = 0
				}
			}
		}
		else
		{
			metric_data[0]["leads"] = "0"
			metric_data[0]["conversions"] = "0"
		}
		
		nlapiLogExecution("error", "SCRIPT DEBUG", "Past Month 12 Successfully...")		
			
	}
	catch(err)
	{
		nlapiLogExecution("error", "Sales Rep Metrics Graph Error", "Error getting sales metric data. Details: " + err.message)
		return true
	}
	
	try
	{
		var maxLeadValue
		var leadDataStr = ""
		var convDataStr = ""
		var labelStr = ""
		for(var x=0; x < metric_data.length; x++)
		{
			leadDataStr += metric_data[x]["leads"]
			//nlapiLogExecution("debug", "Leads Data Value: ", metric_data[x]["leads"])
			convDataStr += metric_data[x]["conversions"]
			//nlapiLogExecution("debug", "Conversions Data Value: ", metric_data[x]["conversions"])
			if(x+1 < metric_data.length)
			{
				leadDataStr += ","
				convDataStr += ","	
			}
			
			if(x==0)
			{
				maxLeadValue = metric_data[x]["leads"]
			}
			else
			{
				if(parseInt(metric_data[x]["leads"]) > maxLeadValue)
					maxLeadValue = parseInt(metric_data[x]["leads"])
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error", "Sales Rep Metrics Graph Error", "Error constructing lead data string and conversions data string. Details: " + err.message)
		return true
	}
	
	try
	{
		//Set the maximum height of the graph to 15% over the maxLeadValue
		var graphHeight = Math.round(maxLeadValue * 1.25)
		//nlapiLogExecution("debug", "Graph Height", graphHeight)
	}
	catch(err)
	{
		nlapiLogExecution("error", "Sales Rep Metrics Graph Error", "Error setting graph height. Details: " + err.message)
		return true
	}
	
	try
	{
		//Build Google Charts API URL String
		var chartURL = "http://chart.apis.google.com/chart"
		chartURL += "?chxl=1:|" + monthLabelStr
		chartURL += "&chxp=1,1,2,3,4,5,6,7,8,9,10,11,12"
		chartURL += "&chxr=0,0," + graphHeight + "|1,1,12"
		chartURL += "&chxt=y,x"
		chartURL += "&chs=500x300" //Chart Size
		chartURL += "&cht=lc" //Chart Type - Line Chart
		chartURL += "&chco=3D7930,FF9900"
		chartURL += "&chds=0," + graphHeight + ",0," + graphHeight //height of graph
		chartURL += "&chd=t:" + convDataStr + "|" + leadDataStr //data points
		chartURL += "&chdl=Conversions|Leads" //Data Legends
		chartURL += "&chg=9.090909,-1,0,0"
		chartURL += "&chls=2|2"
		chartURL += "&chm=B,FF990091,1,0,0,1|B,00FF0073,0,0,0,1" //Fill for data values
		chartURL += "&chts=676767,10"
		chartURL += "&chtt=Lead+and+Conversion+Metrics"
		
		if(repDefined)
		{
			var repName = nlapiLookupField("employee", salesRep, ["firstname", "lastname"])
			chartURL += ":+" + repName["firstname"] + "+" + repName["lastname"]
		}
		else
		{
			chartURL += ":+All+Sales+Reps"
		}
		
		if(leadSourceDefined)
			chartURL += "+(" + replaceSpaces(leadSourceTitle) + ")"
			
		if(appointmentSelected)
			chartURL += "+-+Apt"
			
		nlapiLogExecution("error", "Chart URL", chartURL)
		
		var content = "<img src='" + chartURL + "' style='width: 600px; height: 300px;'>"
	}
	catch(err)
	{
		nlapiLogExecution("error", "Sales Rep Metrics Graph Error", "Error building string URL for Google Charts API. Details: " + err.message)
		return true
	}
	
	try
	{
		//Write portlet HTML content
		portlet.setHtml(content)
	}
	catch(err)
	{
		nlapiLogExecution("error", "Sales Rep Metrics Graph Error", "Error writing HTML content to portlet. Details: " + err.message)
		return true
	}
}

function replaceSpaces(value)
{
	if(value==null || value=="" || value=="undefined")
		return value
		
	while(value.indexOf(" ")!=-1)
		value = value.replace(" ", "+")
		
	return value
}
