nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Weekly_Revenue_Email()
{
	try
	{
		//Determine Current Week (Tues. - Mon.)
		var currentDate = new Date()
		var startDate,endDate
		startDate = nlapiAddDays(currentDate,-7);
		endDate = nlapiAddDays(currentDate,-1);
		
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
		
		var results = nlapiSearchRecord("invoice",null,filters,cols)
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
		var totalRevenue
		
		var filters = new Array()
		filters[0] = new nlobjSearchFilter("trandate",null,"within",startDate,endDate)
		filters[1] = new nlobjSearchFilter("mainline",null,"is","T")
		
		var cols = new Array()
		cols[0] = new nlobjSearchColumn("total",null,"sum")
		
		var results = nlapiSearchRecord("invoice",null,filters,cols)
		if(results)
		{
			totalRevenue = nlapiFormatCurrency(results[0].getValue("total",null,"sum"))
		}
		else
		{
			totalRevenue = "0.00"
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Finding Total Revenue","Error finding total weekly revenue. Details: " + err.message)
		return true
	}
	
	try
	{
		//Prepare email to send to Beth and Eric
		var emailBody = "";
		emailBody += "<h3>All Weekly Revenue By Sales Rep<br/>Week of " + startDate + " thru " + endDate + "</h3>";
		emailBody += "<table cellpadding='2' cellspacing='0' border='0'><tr><th>Sales Rep</th><th>Revenue</th></tr>";
		for(var x=0; x < graphData.length; x++)
		{
			emailBody += "<tr><td>" + graphData[x]["salesrep"] + "</td><td>$" + addCommas(nlapiFormatCurrency(graphData[x]["revenue"])) + "</td></tr>";
		}
		emailBody += "</table>";
		emailBody += "<h4>Total Weekly Revenue: $" + addCommas(totalRevenue) + "</h4>";
		
		nlapiSendEmail(-5,-5,"All Weekly Revenue By Sales Rep: " + startDate + " thru " + endDate,emailBody);
		nlapiSendEmail(-5,1877,"All Weekly Revenue By Sales Rep: " + startDate + " thru " + endDate,emailBody);
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Sending Email","Error sending weekly revenue email. Details: " + err.message)
		return true
	}
}

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

