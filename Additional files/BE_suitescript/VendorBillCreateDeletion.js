nlapiLogExecution("audit","FLOStart",new Date().getTime());
//Set Invoiced on CDP 
function Set_Invoiced_On_CDP(type)
{
	if(type == "create" || type == "edit")
	{
		var vId = nlapiGetRecordId();
		var vObj = nlapiLoadRecord("vendorbill",vId);
		for(var i=1;i<=vObj.getLineItemCount("item");i++)
		{
			var itemId = vObj.getLineItemValue("item","item",i);
			var cdpIds = GetCdpIds(itemId);
			if(cdpIds != null)
			{
				for(var j=0; j<cdpIds.length; j++)
				{
					SendActNeededStatusToPortal(cdpIds[j],type);
					nlapiLogExecution("debug","On VendorBill creation, Action Needed field successfully updated on portal and NS side for cdp Id is :",cdpIds[j]);
				}
			}
		}
	}
}

//Update Ready to Invoice on portal
function Set_ReadyToInvoice_On_Portal(type)
{
	try
	{
		if(type == "delete")
		{
			var vId = nlapiGetRecordId();
			var vObj = nlapiLoadRecord("vendorbill",vId);
			for(var i=1;i<=vObj.getLineItemCount("item");i++)
			{
				var itemId = vObj.getLineItemValue("item","item",i);
				var cdpIds = GetCdpIds(itemId);
				if(cdpIds != null)
				{
					for(var k=0; k<cdpIds.length; k++)
					{
						SendActNeededStatusToPortal(cdpIds[k],type);
						nlapiLogExecution("debug","On vendor bill deletion, Action Needed field successfully updated on portal and NS side for cdp Id is :",cdpIds[k]);
					}
				}
			}			
		}
	}
	catch(e)
	{
		nlapiLogExecution("debug","Error raised on vendor bill deletion and action needed field updation is :",e.message);
	}
}

function GetCdpIds(itemId)
{
	var cdpIds = [];
	filters = new Array();
    filters[0] = nlobjSearchFilter("custrecord_be_diamond_stock_number",null,"anyOf",itemId);                                        
    
	var cols = [];
	cols.push(new nlobjSearchColumn("internalid"));
    var searchRecord = nlapiSearchRecord("customrecord_custom_diamond",null,filters ,cols);
	if(searchRecord != null)
	{
		for(var i=0; i<searchRecord.length; i++)
		{
			var cdpId = searchRecord[i].getValue(cols[0]);
            cdpIds.push(cdpId);			
		}
	}
	return cdpIds;
}

//Send Action Needed value to PORTAL
function SendActNeededStatusToPortal(cdpId,type)
{
	var actNeedStr= null;
    var actNeededValue = null;
    var invoiced = 0; var jsonobj = null;
	if(type == "delete")
	{
		//actNeedStr='['+4+']'; //For Ready to Invoice Status
        actNeededValue = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_action_needed");
	    actNeededValue = actNeededValue.replace(12,4);	//For Ready to Invoice	
	    actNeedStr = '['+actNeededValue+']';	//Setting up URL of CDP
	}
	else if(type == "create" || type == "edit")
	{
		//actNeedStr='['+12+']'; //For Invoiced Status
        actNeededValue = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_action_needed");
	    actNeededValue = actNeededValue.replace(4,12);	//For Invoiced	
	    actNeedStr = '['+actNeededValue+']';	//Setting up URL of CDP
      
        //Added New code
		if(actNeededValue != null && actNeededValue != "")
	    {
			var actNeedArr = actNeededValue.split(',');
			for(var i=0; i<actNeedArr.length; i++)
			{
				if(actNeedArr[i] == 12)
				{
					invoiced = 1;
				}
			}
	    }
		//Ended new code
	}
	//Setting up URL of CDP
	var url = "https://testportal.brilliantearth.com/api/cdp/";   // for Sandbox 
	//var url = "https://partner.brilliantearth.com/api/cdp/";    //for production
  
	//Setting up Headers 
	var headers = new Array(); 
	headers['http'] = '1.1';    
	headers['Accept'] = 'application/json';  	
	headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542';   // for Sandbox
	//headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; // for production    
	headers['Content-Type'] = 'application/json'; 
	headers['User-Agent-x'] = 'SuiteScript-Call';
		
	//Json data
	if(invoiced == 1)
	{
		jsonobj = { "cdp_id": cdpId, 					     
					"action_needed":actNeedStr,
					"manual_override":'T',
                    "has_bills" :'T'
				  }
	}
	else
	{
		jsonobj = { "cdp_id": cdpId, 					     
					"action_needed":actNeedStr,
					"manual_override":'T',
                    "has_bills" :'F'
				  }
	}
				  
	var myJSONText = JSON.stringify(jsonobj, replacer); 
    nlapiLogExecution('debug','Request Input Body:', myJSONText);
	var response = nlapiRequestURL(url, myJSONText, headers); 
	nlapiLogExecution("debug","Response body output is :",response.getBody());
	if(response.code == '200')
	{
		var responsebody = JSON.parse(response.getBody());
        var action_needed = responsebody['action_needed'];
		var actionArr = new Array();
		if(responsebody['action_needed'] != null)
		{
			if(type == "delete")
			{
				for(var i=0; i<action_needed.length;i++){
					if(action_needed[i] != 12){
						actionArr.push(action_needed[i]);
					}
				}
			}
			else if(type == "create" || type == "edit")
			{
				for(var i=0; i<action_needed.length;i++){
					if(action_needed[i] != 4){
						actionArr.push(action_needed[i]);
					}
				}
			}
		}
		nlapiSubmitField("customrecord_custom_diamond",cdpId,"custrecord_action_needed",actionArr);
		nlapiLogExecution("debug","Successfully submited action needed field on CDP for cdpId is : ",cdpId);
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