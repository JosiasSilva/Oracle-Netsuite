nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Drop_Ship_Checklist_Customer_Address()
{
	var orders = [];
	var poId = "";

	try
	{
		//Find sales orders that have updated; update sales order fields
		var results = nlapiSearchRecord(null,5193);
		if(results)
		{
			nlapiLogExecution("debug","# Results: " + results.length);
			
			for(var x=0; x < results.length; x++)
			{
				var cols = results[x].getAllColumns();				
				var shipAddressCol = results[x].getValue(cols[4]);
				nlapiLogExecution("debug","ShipAddress Column Found");				
				
				if(shipAddressCol != null && shipAddressCol != "")
				{
					var shipAddress = shipAddressCol.split('\n');
					nlapiLogExecution("debug","ShipAddress: " + shipAddress);				
					var po_tranid=results[x].getValue(cols[2]);
					
					var filters = [];
					filters[0] = nlobjSearchFilter("tranid",null,"is",po_tranid);
					filters[1] = nlobjSearchFilter("mainline",null,"is","T");				
					var searchRecord = nlapiSearchRecord("purchaseorder",null,filters,null);
					if(searchRecord != null)
					{
						poId = searchRecord[0].id;
					}							
					SendNStoPortal(shipAddress,poId,"1129");
				}			
			}
		}
	}
	catch(ex)
	{
		nlapiLogExecution("debug","# Error is : " + ex.message);
	}
}

function SendNStoPortal(shipAddress,poId,scriptId)
{
	var objJSON = {
					"shipping_address_name" : shipAddress[0],
					"shipping_address_street" : shipAddress[1], 
					"shipping_address_city" : shipAddress[2],
					"shipping_address_country" : shipAddress[3],
                     "script_id" : scriptId
				};

	//Setting up URL of CDP  		
	var url = "https://testportal.brilliantearth.com/api/production/po/"+poId+"/customer-address/";      //for sandbox 
    //var url = "https://partner.brilliantearth.com/api/production/po/"+poId+"/customer-address/"; //for production
			
	//Setting up Headers 
	var headers = new Array(); 
	headers['http'] = '1.1';    
	headers['Accept'] = 'application/json';       						
	headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542';	//on sandbox
   // headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';	//for production
	headers['Content-Type'] = 'application/json'; 
	headers['User-Agent-x'] = 'SuiteScript-Call';			
													
	//Stringifying JSON
	var myJSONText = JSON.stringify(objJSON, replacer); 
	nlapiLogExecution('debug','PO Response Body as NS Input:', myJSONText);					   
	var response = nlapiRequestURL(url, myJSONText, headers); 
	nlapiLogExecution('debug','Ship Address Response Body as Portal Output:', response.body);
			
	if(response.code==200)
	{
		var responsebody = JSON.parse(response.getBody());	
		nlapiLogExecution("debug", "Portal response for ship address submition is : ",responsebody.message);		
	}
	else
	{	
		nlapiLogExecution("debug","Portal error response is : ",response.body);		
	} 
}

function replacer(key, value)
{
	if (typeof value == "number" && !isFinite(value))
	{
		return String(value);
	}
	return value;
}