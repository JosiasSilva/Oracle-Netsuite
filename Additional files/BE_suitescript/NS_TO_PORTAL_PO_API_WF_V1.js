nlapiLogExecution("audit","FLOStart",new Date().getTime());
function PushPODataNSToPortal()
{
	try
	{
        var poId = nlapiGetRecordId();
        var obj = PushPOToPortal(poId);
		obj = JSON.parse(obj);
		if(obj.status == "OK")
		{
			PushCustomerAddress(poId);			
		}
		else
		{
			nlapiLogExecution("debug","Message during Push from NS to portal is : ",obj.message);			
		}
	}
	catch(err)
	{             
	    nlapiLogExecution("error","Error occur during CDPID Push from NS to portal is : ",err.message);        
	}
}

//Added by ajay 01Dec 2016
function PushCustomerAddress(poId)
{
	try
	{		
		var soId = nlapiLookupField("purchaseorder",poId,"createdfrom");
		if(soId != null && soId != "")
		{
			var shipTo = nlapiLookupField("salesorder",soId,"shipaddress");
			
			if(shipTo != null && shipTo != "")
			{
				var shipAddress = shipTo.split('\n');
				SendNStoPortal(shipAddress,poId);
			}
		}
		else
		{
			nlapiLogExecution("debug","Sales order record does not link with existing PO");
		}
	}
	catch(ex)
	{
		nlapiLogExecution("error","Error on pushing ship address is : ",ex.message);
	}
}

function SendNStoPortal(shipAddress,poId)
{
	var objJSON = {
					"shipping_address_name" : shipAddress[0],
					"shipping_address_street" : shipAddress[1], 
					"shipping_address_city" : shipAddress[2],
					"shipping_address_country" : shipAddress[3]						
				};

	//Setting up URL of CDP  		
	//var url = "https://partner.brilliantearth.com/api/production/po/"+poId+"/customer-address/"; 	
	var url = "https://testportal.brilliantearth.com/api/production/po/"+poId+"/customer-address/"; 	
			
	//Setting up Headers 
	var headers = new Array(); 
	headers['http'] = '1.1';    
	headers['Accept'] = 'application/json';       						
	//headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';						  
	headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //Test Portal
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
//Ended by ajay 01Dec 2016

function replacer(key, value)
{
	if (typeof value == "number" && !isFinite(value))
	{
		return String(value);
	}
	return value;
}
