function FedEx_Hold_for_Pickup_Validation()
{
	var templateID = nlapiGetContext().getSetting("SCRIPT","custscript_fedex_locs_xml");
	
	var cols = [];
	cols.push(new nlobjSearchColumn("custbody_fedex_std_addr_1"));
	cols.push(new nlobjSearchColumn("custbody_fedex_std_addr_2"));
	cols.push(new nlobjSearchColumn("custbody_fedex_std_city"));
	cols.push(new nlobjSearchColumn("custbody_fedex_std_state"));
	cols.push(new nlobjSearchColumn("custbody_fedex_std_zip_code"));
	cols.push(new nlobjSearchColumn("custbody_fedex_std_country"));
	
	var orderID = nlapiGetContext().getSetting("SCRIPT","custscript_fedex_locs_order_id");
	if(orderID!=null && orderID!="")
	{
		var filters = [];
		filters.push(new nlobjSearchFilter("internalid",null,"is",orderID));
		filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
		nlapiLogExecution("debug","Using order internal ID: " + orderID);
		
		var results = nlapiSearchRecord("salesorder",null,filters,cols);
	}
	else
	{
		var results = nlapiSearchRecord("salesorder","customsearch_validate_fedex_hold_for_pu",null,cols);
	}
	
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			checkGovernance();
			
			var locationType = null;
			
			var shipValidateObject = {
				address1 : results[x].getValue("custbody_fedex_std_addr_1"),
				address2 : results[x].getValue("custbody_fedex_std_addr_2"),
				city : results[x].getValue("custbody_fedex_std_city"),
				state : results[x].getValue("custbody_fedex_std_state"),
				zip : results[x].getValue("custbody_fedex_std_zip_code"),
				country : results[x].getValue("custbody_fedex_std_country")				
			};
			
			//Check Billing Address
			var templateFile = nlapiLoadFile(templateID);
			var template = templateFile.getValue();
			var xmlTemp = Handlebars.compile(template);
			
			var soap = xmlTemp(shipValidateObject);
			
			if(nlapiGetContext().getSetting("SCRIPT","custscript_fedex_locs_log_requests")=="T")
			{
				//Create Request Log file
				var requestFile = nlapiCreateFile("Location_Validation_Request.txt","PLAINTEXT",soap);
				requestFile.setFolder("8771896");
				var requestFileId = nlapiSubmitFile(requestFile);
			}
			
			var headers = new Object();
			headers["Content-Type"] = "application/xml";
			
			var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
			
			nlapiLogExecution("debug","Response Code",cResp.getCode());
			nlapiLogExecution("debug","Response Body (XML)",cResp.getBody());
			
			var body = cResp.getBody();
			
			if(nlapiGetContext().getSetting("SCRIPT","custscript_fedex_locs_log_requests")=="T")
			{
				//Create Request Log file
				var responseFile = nlapiCreateFile("Location_Validation_Response.txt","PLAINTEXT",body);
				responseFile.setFolder("8771896");
				var responseFileId = nlapiSubmitFile(responseFile);
			}
			
			var xmlBody = nlapiStringToXML(body);
			
			var resultsNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='SearchLocationsReply']/*[name()='AddressToLocationRelationships']");
			var addressType = nlapiSelectValue(resultsNode,".//*[name()='Classification']");
			
			var attributeNodes = nlapiSelectNodes(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='SearchLocationsReply']/*[name()='AddressToLocationRelationships']/*[name()='DistanceAndLocationDetails']");
			for(var i=0; i < attributeNodes.length && i < 1; i++)
			{
				var address1 = nlapiSelectValue(attributeNodes[i],".//*[name()='LocationContactAndAddress']/*[name()='Address']/*[name()='StreetLines']");
				var city = nlapiSelectValue(attributeNodes[i],".//*[name()='LocationContactAndAddress']/*[name()='Address']/*[name()='City']");
				var state = nlapiSelectValue(attributeNodes[i],".//*[name()='LocationContactAndAddress']/*[name()='Address']/*[name()='StateOrProvinceCode']");
				var zip = nlapiSelectValue(attributeNodes[i],".//*[name()='LocationContactAndAddress']/*[name()='Address']/*[name()='PostalCode']");
				var country = nlapiSelectValue(attributeNodes[i],".//*[name()='LocationContactAndAddress']/*[name()='Address']/*[name()='CountryCode']");
				
				if(zip.indexOf("-")==-1 && shipValidateObject.zip.indexOf("-")!=-1)
				{
					shipValidateObject.zip = shipValidateObject.zip.substring(0,5);
				}
				
				var locationType = "";
				var locationDescs = nlapiSelectValues(attributeNodes[i],".//*[name()='LocationContactAndAddress']/*[name()='AddressAncillaryDetail']/*[name()='AdditionalDescriptions']");
				
				locationType = locationDescs.join(",");
				
				var match = true;
				
				if(address1.toUpperCase()!=shipValidateObject.address1.toUpperCase())
				{
					nlapiLogExecution("debug","Address 1 (FedEx): " + address1,"Address 1 (NetSuite): " + shipValidateObject.address1);
					match = false;
				}
				if(city.toUpperCase()!=shipValidateObject.city.toUpperCase())
				{
					nlapiLogExecution("debug","City (FedEx): " + city,"City (NetSuite): " + shipValidateObject.city);
					match = false;
				}
				if(state.toUpperCase()!=shipValidateObject.state.toUpperCase())
				{
					nlapiLogExecution("debug","State (FedEx): " + state,"State (NetSuite): " + shipValidateObject.state);
					match = false;
				}
				if(zip.toUpperCase()!=shipValidateObject.zip.toUpperCase())
				{
					nlapiLogExecution("debug","Zip Code (FedEx): " + zip,"Zip Code (NetSuite): " + shipValidateObject.zip);
					match = false;
				}
				if(country.toUpperCase()!=shipValidateObject.country.toUpperCase())
				{
					nlapiLogExecution("debug","Country (FedEx): " + country,"Country (NetSuite): " + shipValidateObject.country);
					match = false;
				}
				
				if(match===true)
				{
					nlapiLogExecution("debug","Match=True","FedEx WS Returned Location Type: " + locationType);
					
					nlapiSubmitField("salesorder",results[x].getId(),"custbody_fedex_location_type",locationType);
				}
				else
				{
					nlapiSubmitField("salesorder",results[x].getId(),"custbody_fedex_location_type","Not Applicable");
				}
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