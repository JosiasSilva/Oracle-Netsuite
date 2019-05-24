nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Update_Open_IF_Posting_Periods()
{
	var today = new Date();
	var postingPeriod = "";
	var month = today.getMonth();
	var year = today.getFullYear();
	
	switch(month)
	{
		case 0:
			postingPeriod = "Jan " + year;
			break;
		case 1:
			postingPeriod = "Feb " + year;
			break;
		case 2:
			postingPeriod = "Mar " + year;
			break;
		case 3:
			postingPeriod = "Apr " + year;
			break;
		case 4:
			postingPeriod = "May " + year;
			break;
		case 5:
			postingPeriod = "Jun " + year;
			break;
		case 6:
			postingPeriod = "Jul " + year;
			break;
		case 7:
			postingPeriod = "Aug " + year;
			break;
		case 8:
			postingPeriod = "Sep " + year;
			break;
		case 9:
			postingPeriod = "Oct " + year;
			break;
		case 10:
			postingPeriod = "Nov " + year;
			break;
		case 11:
			postingPeriod = "Dec " + year;
			break;
	}
	
	var results = nlapiSearchRecord("transaction","customsearch_open_item_fulfillments");
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			if(x % 10 == 0)
				checkGovernance(); //Check governance every 10 iterations
			
			try
			{
				var ifRec = nlapiLoadRecord("itemfulfillment",results[x].getId());
				ifRec.setFieldText("postingperiod",postingPeriod);
				nlapiSubmitRecord(ifRec,true,true);
			}
			catch(err)
			{
				nlapiLogExecution("error","Error Updating Posting Period For IF " + results[x].getId(),"Details: " + err.message);
			}
		}
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