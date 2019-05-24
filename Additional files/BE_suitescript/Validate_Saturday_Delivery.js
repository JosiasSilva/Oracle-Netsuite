var timestamp = null;

function Validate_Saturday_Delivery()
{
	var context = nlapiGetContext();
	
	var searchid = 0;
	var search = nlapiLoadSearch("salesorder",context.getSetting("SCRIPT","custscript_sat_del_validate_orders_ss"));
	var resultSet = search.runSearch();
	do {
        var results = resultSet.getResults(searchid, searchid + 1000);
        
		for(var x=0; x < results.length; x++)
		{
			var orderObj = {
				id : results[x].getId(),
				shipaddr1 : results[x].getValue("shipaddress1"),
				shipaddr2 : results[x].getValue("shipaddress2"),
				shipcity : results[x].getValue("shipcity"),
				shipstate : results[x].getValue("shipstate"),
				shipzip : results[x].getValue("shipzip"),
				shipcountry : results[x].getValue("shipcountry")
			};
			
			try
			{
				checkGovernance();
				
				Validate_Sat_Del(orderObj);	
			}
			catch(err)
			{
				nlapiLogExecution("error","Error Validating Saturday Delivery (Order ID: " + results[x].getId() + ")","Details: " + err.message);	
			}
			
            searchid++;
        }

    }while(results.length >= 1000);
}

function Validate_Sat_Del(order)
{
	if(timestamp==null)
	{
		timestamp = "";
		
		var today = new Date();
		var dayOfWeek = today.getDay();
		
		var nextFriday;
		switch(dayOfWeek)
		{
			case 0:
				nextFriday = nlapiAddDays(today,5);
				break;
			case 1:
				nextFriday = nlapiAddDays(today,4);
				break;
			case 2:
				nextFriday = nlapiAddDays(today,3);
				break;
			case 3:
				nextFriday = nlapiAddDays(today,2);
				break;
			case 4:
				nextFriday = nlapiAddDays(today,1);
				break;
			case 5:
				nextFriday = today;
				break;
			case 6:
				nextFriday = nlapiAddDays(today,6);
				break;
		}
		
		timestamp += nextFriday.getFullYear() + "-";
		
		var month = nextFriday.getMonth();
		var day = nextFriday.getDate();
		month = month + 1;
		if(month < 10)
			month = "0" + month;
		if(day < 10)
			day = "0" + day;
		
		timestamp += month + "-" + day;
		
		
		timestamp += "T22:00:00";
		
		nlapiLogExecution("debug","Ship Timestamp",timestamp);
	}
	
	var fedexData = {
		ship_state : order.shipstate,
		ship_zipcode : order.shipzip,
		ship_country : order.shipcountry,
		key : "",
		password : "",
		accountnumber : "",
		meternumber : "",
		shiptimestamp : timestamp
	};
	
	var context = nlapiGetContext();
	
	var fedExLogin = nlapiLookupField("customrecord_fedex_integration_key","1",["custrecord_fedex_int_account_number","custrecord_fedex_int_meter_number","custrecord_fedex_int_key","custrecord_fedex_int_password"]);
	fedexData.key = fedExLogin.custrecord_fedex_int_key;
	fedexData.password = fedExLogin.custrecord_fedex_int_password;
	fedexData.accountnumber = fedExLogin.custrecord_fedex_int_account_number;
	fedexData.meternumber = fedExLogin.custrecord_fedex_int_meter_number;
	
	var templateFile = nlapiLoadFile(context.getSetting("SCRIPT","custscript_fedex_rate_request_template"));
	var template = templateFile.getValue();
	var xmlTemp = Handlebars.compile(template);
	
	var soap = xmlTemp(fedexData);
	
	if(nlapiGetContext().getEnvironment()=="SANDBOX")
	{
		//Create Request Log file
		var requestFile = nlapiCreateFile(order.id + "_RateRequest.txt","PLAINTEXT",soap);
		requestFile.setFolder("8771896");
		var requestFileId = nlapiSubmitFile(requestFile);
	}
	
	var headers = new Object();
	headers["Content-Type"] = "application/xml";
	
	var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
	
	nlapiLogExecution("debug","Response Code",cResp.getCode());
	nlapiLogExecution("debug","Response Body (XML)",cResp.getBody());
	
	var body = cResp.getBody();
	
	if(body.indexOf("<AppliedOptions>SATURDAY_DELIVERY</AppliedOptions>")!=-1)
	{
		nlapiLogExecution("debug","Saturday Delivery Available");
		nlapiSubmitField("salesorder",order.id,"custbody_saturday_delivery_available","1");
	}
	else
	{
		nlapiLogExecution("debug","Saturday Delivery Not Available");
		nlapiSubmitField("salesorder",order.id,"custbody_saturday_delivery_available","2");
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