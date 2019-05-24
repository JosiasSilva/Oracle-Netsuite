function scheduledMessageKPIUpdates()
{
	try
	{
		var customer_messages = new Array();
		
		var filters = null;
		var testCustomer = nlapiGetContext().getSetting("SCRIPT","custscript_message_kpi_test_customer");
		if(testCustomer!=null && testCustomer!="")
		{
			filters = [];
			filters.push(new nlobjSearchFilter("internalid",null,"is",testCustomer));
		}
		
		var search = nlapiLoadSearch("customer", "customsearch_message_kpi_script");
		if(testCustomer!=null && testCustomer!="")
			search.addFilter(new nlobjSearchFilter("internalid",null,"is",testCustomer));
        var resultSet = search.runSearch();
		var searchid = 0;
		do{
	        var results = resultSet.getResults(searchid, searchid + 1000);
			
	        if(results)
			{
				for(var x=0; x < results.length; x++)
				{
					customer_messages[x] = new Array()
					customer_messages[x]["customer"] = results[x].getValue("internalid", null, "group")
					customer_messages[x]["date"] = results[x].getValue("messagedate", "messages", "max")
					customer_messages[x]["messageid"] = results[x].getValue("internalid", "messages", "max")
					customer_messages[x]["last_email_timestamp"] = results[x].getValue("custentity_last_email_date_time", null, "group")
					
					searchid++;
				}
			}
	    }while(results.length >= 1000);
		
		if(testCustomer!=null && testCustomer!="")
		{
			nlapiLogExecution("debug","Customer Messages Array",JSON.stringify(customer_messages));
		}
		
		if(customer_messages.length == 0)
		{
			nlapiLogExecution("error", "Script Exit", "No results found in search")
			return true;
		}
	}
	catch(err)
	{
		nlapiLogExecution("error", "Message KPI Error", "Error getting customer message data from NetSuite. Details: " + err.message)
		return true
	}
	
	try
	{
		for(var x=0; x < customer_messages.length; x++)
		{	
			try
			{
				//Check governance every 10 iterations
				if(x % 10 == 0)
				{
					checkGovernance();
				}
				
				var submitData = new Array()
				var submitFields = ["custentity_last_email_from", "custentity_last_email_date_time"]
				
				switch(nlapiLookupField("message",customer_messages[x]["messageid"],"isincoming"))
				{
					case "T":
						submitData[0] = 2;
						break;
					case "F":
						submitData[0] = 1;
						break;
						
				}
				
				if(testCustomer!=null && testCustomer!="")
				{
					nlapiLogExecution("debug","Is Incoming Message?",nlapiLookupField("message",customer_messages[x]["messageid"],"isincoming"));
					nlapiLogExecution("debug","Submit Data for Value",submitData[0]);
				}
				
				if(customer_messages[x]["last_email_timestamp"]!="" && customer_messages[x]["last_email_timestamp"]!=null && nlapiStringToDate(customer_messages[x]["date"]) > nlapiStringToDate(customer_messages[x]["last_email_timestamp"]))
				{
					submitFields.push("custentity_date_time_2nd_to_last_email")
					submitFields.push("custentity_time_between_last_two_emails")
					
					//Added new 6-30-2011 for Date field to hold last email date
					submitFields.push("custentity_last_email_date")
					
					submitData[1] = customer_messages[x]["date"]
					submitData[2] = customer_messages[x]["last_email_timestamp"]
					
					var timeDiff = nlapiStringToDate(customer_messages[x]["date"]).getTime() - nlapiStringToDate(customer_messages[x]["last_email_timestamp"]).getTime()
					var daysDiff = Math.floor(timeDiff/1000/60/60/24)
					timeDiff -= daysDiff*1000*60*60*24
					var hoursDiff = Math.floor(timeDiff/1000/60/60)
					timeDiff -= hoursDiff*1000*60*60
					var minDiff = Math.floor(timeDiff/1000/60)
					timeDiff -= minDiff*1000*60
					var secDiff = Math.floor(timeDiff/1000)
									
					submitData[3] = daysDiff + "D:" + hoursDiff + "H:" + minDiff + "M:" + secDiff + "S" 
					
					//New 6-30-11
					submitData[4] = nlapiDateToString(nlapiStringToDate(customer_messages[x]["date"]),"date")
				}
				else
				{
					submitData[1] = customer_messages[x]["date"]
					
					//Added new 6-30-2011 for Date field to hold last email date
					submitFields.push("custentity_last_email_date")	
					submitData[2] = nlapiDateToString(nlapiStringToDate(customer_messages[x]["date"]),"date")
				}
				
				nlapiSubmitField("customer", customer_messages[x]["customer"], submitFields, submitData)	
			}
			catch(err2)
			{
				nlapiLogExecution("error", "Message KPI Error", "Error setting message KPI fields on entity ID " + customer_messages[x]["customer"] + ". Details: " + err2.message)		
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error", "Message KPI Error", "Error setting message KPI fields on entity ID " + customer_messages[x]["customer"] + ". Details: " + err.message)
		return true
	}
}

function checkGovernance()
{
	var context = nlapiGetContext();
	if(context.getRemainingUsage() < 400)
	{
 		var state = nlapiYieldScript();
		if(state.status == 'FAILURE')
     	{
      		nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = "+state.reason + " / Size = "+ state.size);
   			throw "Failed to yield script";
  		} 
  		else if(state.status == 'RESUME')
  		{
   			nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
  		}
  		// state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
 	}
}