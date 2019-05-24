function salesRepMetricsGraph(portlet, column)
{
	try
	{
		//Get the Sales Rep parameter (if assigned) for the portlet to filter the Sales Rep for the metrics
		var repDefined
		var salesRep = nlapiGetContext().getSetting("SCRIPT", "custscript_conv_graph_sales_rep")
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
		//Set Portlet Title
		portlet.setTitle("Sales Rep Conversion Percentage")	
	}
	catch(err)
	{
		nlapiLogExecution("error", "Sales Rep Metrics Graph Error", "Error setting portlet title. Details: " + err.message)
		return true
	}
	
	try
	{
		//Get Lead Source Filter (if assigned)
		var leadSourceDefined
		var leadSource = nlapiGetContext().getSetting("SCRIPT", "custscript_conv_graph_lead_source")
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
		var appointment = nlapiGetContext().getSetting("SCRIPT", "custscript_conv_graph_apt")
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
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="Conversion %")
				{
					metric_data[11]["conversion_percent"] = results[0].getValue(searchCols[i])
				}
			}
		}
		else
		{
			metric_data[11]["conversion_percent"] = "0"
		}
		
		//Past Month 2
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago2", "monthsago1")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[10] = new Array()
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="Conversion %")
				{
					metric_data[10]["conversion_percent"] = results[0].getValue(searchCols[i])
				}
			}
		}
		else
		{
			metric_data[10]["conversion_percent"] = "0"
		}
		
		//Past Month 3
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago3", "monthsago2")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[9] = new Array()
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="Conversion %")
				{
					metric_data[9]["conversion_percent"] = results[0].getValue(searchCols[i])
				}
			}
		}
		else
		{
			metric_data[9]["conversion_percent"] = "0"
		}
		
		//Past Month 4
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago4", "monthsago3")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[8] = new Array()
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="Conversion %")
				{
					metric_data[8]["conversion_percent"] = results[0].getValue(searchCols[i])
				}
			}
		}
		else
		{
			metric_data[8]["conversion_percent"] = "0"
		}	
		
		//Past Month 5
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago5", "monthsago4")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[7] = new Array()
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="Conversion %")
				{
					metric_data[7]["conversion_percent"] = results[0].getValue(searchCols[i])
				}
			}
		}	
		else
		{
			metric_data[7]["conversion_percent"] = "0"
		}
		
		//Past Month 6
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago6", "monthsago5")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[6] = new Array()
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="Conversion %")
				{
					metric_data[6]["conversion_percent"] = results[0].getValue(searchCols[i])
				}
			}
		}
		else
		{
			metric_data[6]["conversion_percent"] = "0"
		}	
		
		//Past Month 7
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago7", "monthsago6")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[5] = new Array()
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="Conversion %")
				{
					metric_data[5]["conversion_percent"] = results[0].getValue(searchCols[i])
				}
			}
		}
		else
		{
			metric_data[5]["conversion_percent"] = "0"
		}	
		
		//Past Month 8
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago8", "monthsago7")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[4] = new Array()
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="Conversion %")
				{
					metric_data[4]["conversion_percent"] = results[0].getValue(searchCols[i])
				}
			}
		}
		else
		{
			metric_data[4]["conversion_percent"] = "0"
		}	
		
		//Past Month 9
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago9", "monthsago8")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[3] = new Array()
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="Conversion %")
				{
					metric_data[3]["conversion_percent"] = results[0].getValue(searchCols[i])
				}
			}
		}
		else
		{
			metric_data[3]["conversion_percent"] = "0"
		}	
		
		//Past Month 10
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago10", "monthsago9")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[2] = new Array()
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="Conversion %")
				{
					metric_data[2]["conversion_percent"] = results[0].getValue(searchCols[i])
				}
			}
		}
		else
		{
			metric_data[2]["conversion_percent"] = "0"
		}	
		
		//Past Month 11
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago11", "monthsago10")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[1] = new Array()
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="Conversion %")
				{
					metric_data[1]["conversion_percent"] = results[0].getValue(searchCols[i])
				}
			}
		}
		else
		{
			metric_data[1]["conversion_percent"] = "0"
		}	
		
		//Past Month 12
		filters[0] = new nlobjSearchFilter("datecreated", null, "within", "monthsago12", "monthsago11")
		results = nlapiSearchRecord("customer", "customsearch_sales_rep_metrics_graph", filters)
		if(results!=null)
		{
			metric_data[0] = new Array()
			
			var searchCols = results[0].getAllColumns()
			for(var i = 0; i < searchCols.length; i++)
			{
				if(searchCols[i].getLabel()=="Conversion %")
				{
					metric_data[0]["conversion_percent"] = results[0].getValue(searchCols[i])
				}
			}
		}
		else
		{
			metric_data[0]["conversion_percent"] = "0"
		}		
			
	}
	catch(err)
	{
		nlapiLogExecution("error", "Sales Rep Metrics Graph Error", "Error getting sales metric data. Details: " + err.message)
		return true
	}
	
	try
	{
		var convDataStr = ""
		var labelStr = ""
		for(var x=0; x < metric_data.length; x++)
		{
			//nlapiLogExecution("debug", "Leads Data Value: ", metric_data[x]["leads"])
			convDataStr += metric_data[x]["conversion_percent"].replace("%", "")
			//nlapiLogExecution("debug", "Conversions Data Value: ", metric_data[x]["conversions"])
			if(x+1 < metric_data.length)
			{
				convDataStr += ","	
			}
			
			if(x==0)
			{
				maxLeadValue = parseFloat(metric_data[x]["conversion_percent"])
			}
			else
			{
				if(parseFloat(metric_data[x]["conversion_percent"]) > maxLeadValue)
					maxLeadValue = parseFloat(metric_data[x]["conversion_percent"])
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
		if(graphHeight > 100)
			graphHeight = 100
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
		chartURL += "&chco=3D7930"
		chartURL += "&chds=0," + graphHeight //height of graph
		chartURL += "&chd=t:" + convDataStr //data points
		chartURL += "&chg=9.090909,-1,0,0"
		chartURL += "&chls=2"
		chartURL += "&chm=B,FF990091,0,0,0" //Fill for data values
		chartURL += "&chtt=Lead+Conversion+Percentage"
		
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
