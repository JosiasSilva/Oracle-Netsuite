nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Bar_Graph_Weekly_Revenue_Lost(request,response)
{
	try
	{
		//Determine Current Week (Tues. - Mon.)
		var currentDate = new Date()
		var startDate,endDate
		var dayOfWeek = currentDate.getDay()
		switch(dayOfWeek)
		{
			case 0:
				startDate = new Date()
				startDate.setDate(currentDate.getDate()-5)
				endDate = new Date()
				endDate.setDate(currentDate.getDate()+1)
				break
			case 1:
				startDate = new Date()
				startDate.setDate(currentDate.getDate()-6)
				endDate = new Date()
				break
			case 2:
				startDate = new Date()
				endDate = new Date()
				endDate.setDate(currentDate.getDate()+6)
				break
			case 3:
				startDate = new Date()
				startDate.setDate(currentDate.getDate()-1)
				endDate = new Date()
				endDate.setDate(currentDate.getDate()+5)
				break
			case 4:
				startDate = new Date()
				startDate.setDate(currentDate.getDate()-2)
				endDate = new Date()
				endDate.setDate(currentDate.getDate()+4)
				break
			case 5:
				startDate = new Date()
				startDate.setDate(currentDate.getDate()-3)
				endDate = new Date()
				endDate.setDate(currentDate.getDate()+3)
				break
			case 6:
				startDate = new Date()
				startDate.setDate(currentDate.getDate()-4)
				endDate = new Date()
				endDate.setDate(currentDate.getDate()+2)
				break
		}
		
		/* ADDED NEW 10-23-2011 FOR DATE RANGES*/
		var rangeFilter = request.getParameter("range")
		if(rangeFilter=="lastweek")
		{
			startDate = nlapiAddDays(startDate,-7)
			endDate = nlapiAddDays(endDate,-7)
		}
		if(rangeFilter=="last2weeks")
		{
			startDate = nlapiAddDays(startDate,-14)
			endDate = nlapiAddDays(endDate,-7)
		}
		
		//Convert Date Objects To Strings To Use In Filter
		startDate = nlapiDateToString(startDate,"date")
		endDate = nlapiDateToString(endDate,"date")
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Determining Dates","Error determining start and end dates for graph filter. Details: " + err.message)
		return true
	}
	
	try
	{
		//Retrieve Search Results
		var graphData = new Array()
		
		var filters = new Array()
		filters[0] = new nlobjSearchFilter("trandate",null,"within",startDate,endDate)
		filters[1] = new nlobjSearchFilter("mainline",null,"is","T")
		
		var cols = new Array()
		cols[0] = new nlobjSearchColumn("entityid","salesrep","group")
		cols[1] = new nlobjSearchColumn("total",null,"sum")
		
		var results = nlapiSearchRecord("creditmemo",null,filters,cols)
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				graphData[x] = new Array()
				graphData[x]["salesrep"] = results[x].getValue("entityid","salesrep","group")
				graphData[x]["revenue"] = results[x].getValue("total",null,"sum")
				if(graphData[x]["revenue"]==null || graphData[x]["revenue"]=="")
					graphData[x]["revenue"] = 0
					
				if(graphData[x]["salesrep"]=="" || graphData[x]["salesrep"]==null)
					graphData[x]["salesrep"] = "None"
					
				if(graphData[x]["salesrep"]=="- None -")
					graphData[x]["salesrep"] = "Other"
					
				nlapiLogExecution("debug","Graph Data","Sales Rep: " + graphData[x]["salesrep"] + " - Revenue: $" + parseFloat(graphData[x]["revenue"]))
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Getting Search Results","Error getting search results and graph data. Details: " + err.message)
		return true
	}
	
	try
	{
		//Get Total Revenue Figure
		var totalLosses
		
		var filters = new Array()
		filters[0] = new nlobjSearchFilter("trandate",null,"within",startDate,endDate)
		filters[1] = new nlobjSearchFilter("mainline",null,"is","T")
		
		var cols = new Array()
		cols[0] = new nlobjSearchColumn("total",null,"sum")
		
		var results = nlapiSearchRecord("creditmemo",null,filters,cols)
		if(results)
		{
			totalLosses = nlapiFormatCurrency(results[0].getValue("total",null,"sum"))
		}
		else
		{
			totalLosses = "0.00"
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Finding Total Revenue Losses","Error finding total weekly revenue losses from credit memos. Details: " + err.message)
		return true
	}
	
	try
	{
		//Build Graph
		var graphCode = "<html><head>"
		graphCode += "<script type='text/javascript' src='https://www.google.com/jsapi'></script>"
		graphCode += "<script type='text/javascript'>"
		graphCode += "google.load('visualization','1',{packages:['corechart']});"
		graphCode += "google.setOnLoadCallback(drawChart);"
		graphCode += "function drawChart() {"
		graphCode += "var data = new google.visualization.DataTable();"
		graphCode += "data.addColumn('string','Sales Rep');"
		graphCode += "data.addColumn('number','Revenue');"
		graphCode += "data.addRows(" + graphData.length + ");"
		for(var x=0; x < graphData.length; x++)
		{
			graphCode += "data.setValue(" + x + ",0,'" + graphData[x]["salesrep"] + "');"
			//nlapiLogExecution("debug","Data Value Line (Rep)","data.setValue(" + x + ",0,'" + graphData[x]["salesrep"] + "');")
			graphCode += "data.setValue(" + x + ",1," + parseFloat(graphData[x]["revenue"]) + ");"
			//nlapiLogExecution("debug","Data Value Line ($$$)","data.setValue(" + x + ",1," + parseFloat(graphData[x]["revenue"]) + ");")
		}
		graphCode += "var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));"
		graphCode += "chart.draw(data,{width:650,height:400,title:'Weekly Revenue Lost From Credit Memos By Sales Rep (" + startDate + " - " + endDate + ") - $" + totalLosses + "',hAxis:{title:'Sales Rep',format:'###,###.##',slantedTextAngle:90},legend:'none',tooltipTextStyle:{color: 'black',fontName: 'Arial',fontSize:11}});"
		graphCode += "}"
		graphCode += "</script></head>"
		graphCode += "<body><div id='chart_div'></div></body></html>"
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Creating Graph Code","Error concatenating graph HTML code. Details: " + err.message)
		return true
	}
	
	try
	{
		//Add HTML to Portlet
		response.write(graphCode)
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Creating Portlet","Error creating custom portlet. Details: " + err.message)
		return true
	}
}
