function FedEx_Address_Validation()
{
	var templateID = nlapiGetContext().getSetting("SCRIPT","custscript_fedex_aval_xml");
	
	var cols = [];
	cols.push(new nlobjSearchColumn("billaddress1"));
	cols.push(new nlobjSearchColumn("billaddress2"));
	cols.push(new nlobjSearchColumn("billcity"));
	cols.push(new nlobjSearchColumn("billstate"));
	cols.push(new nlobjSearchColumn("billzip"));
	cols.push(new nlobjSearchColumn("billcountry"));
	cols.push(new nlobjSearchColumn("shipaddress1"));
	cols.push(new nlobjSearchColumn("shipaddress2"));
	cols.push(new nlobjSearchColumn("shipcity"));
	cols.push(new nlobjSearchColumn("shipstate"));
	cols.push(new nlobjSearchColumn("shipzip"));
	cols.push(new nlobjSearchColumn("shipcountry"));
	
	var orderID = nlapiGetContext().getSetting("SCRIPT","custscript_fedex_aval_order_id");
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
		var results = nlapiSearchRecord("salesorder","customsearch_so_address_validation",null,cols);
	}
	
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			checkGovernance();
			
			var fields = ["custbody_shipping_address_validation","custbody_billing_address_validation","custbody_address_validation_error"];
			var data = ["","",""];
			var stateZipMismatch = false;
			
			var billValidateObject = {
				address1 : results[x].getValue("billaddress1"),
				address2 : results[x].getValue("billaddress2"),
				city : results[x].getValue("billcity"),
				state : results[x].getValue("billstate"),
				zip : results[x].getValue("billzip"),
				country : results[x].getValue("billcountry")				
			};
			
			var shipValidateObject = {
				address1 : results[x].getValue("shipaddress1"),
				address2 : results[x].getValue("shipaddress2"),
				city : results[x].getValue("shipcity"),
				state : results[x].getValue("shipstate"),
				zip : results[x].getValue("shipzip"),
				country : results[x].getValue("shipcountry")				
			};
			
			//Check Billing Address
			var templateFile = nlapiLoadFile(templateID);
			var template = templateFile.getValue();
			var xmlTemp = Handlebars.compile(template);
			
			var soap = xmlTemp(shipValidateObject);
			
			if(nlapiGetContext().getSetting("SCRIPT","custscript_fedex_aval_log_requests")=="T")
			{
				//Create Request Log file
				var requestFile = nlapiCreateFile("Address_Validation_Request.txt","PLAINTEXT",soap);
				requestFile.setFolder("8771896");
				var requestFileId = nlapiSubmitFile(requestFile);
			}
			
			var headers = new Object();
			headers["Content-Type"] = "application/xml";
			
			var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
			
			nlapiLogExecution("debug","Response Code",cResp.getCode());
			nlapiLogExecution("debug","Response Body (XML)",cResp.getBody());
			
			var body = cResp.getBody();
			var xmlBody = nlapiStringToXML(body);
			
			var countrySupported = true;
			var shipErrors = [];
			
			var resultsNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='AddressValidationReply']/*[name()='AddressResults']");
			var addressType = nlapiSelectValue(resultsNode,".//*[name()='Classification']");
			
			var attributeNodes = nlapiSelectNodes(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='AddressValidationReply']/*[name()='AddressResults']/*[name()='Attributes']");
			for(var i=0; i < attributeNodes.length; i++)
			{
				var attributeName = nlapiSelectValue(attributeNodes[i],".//*[name()='Name']");
				var attributeValue = nlapiSelectValue(attributeNodes[i],".//*[name()='Value']");
				
				if(attributeName=="CountrySupported")
				{
					if(attributeValue=="false")
						countrySupported = false;
				}
				
				switch(attributeName)
				{
					case "SuiteRequiredButMissing":
						if(attributeValue=="true")
							shipErrors.push(attributeName);
						break;
					case "InvalidSuiteNumber":
						if(attributeValue=="true")
							shipErrors.push(attributeName);
						break;
					case "MultipleMatches":
						if(attributeValue=="true")
							shipErrors.push(attributeName);
						break;
					case "PostalValidated":
						if(attributeValue=="false")
							shipErrors.push(attributeName);
						break;
					case "GeneralDelivery":
						if(attributeValue=="false")
							shipErrors.push(attributeName);
						break;
					case "StreetRangeValidated":
						if(attributeValue=="false")
							shipErrors.push(attributeName);
						break;
					case "StreetValidated":
						if(attributeValue=="false")
							shipErrors.push(attributeName);
						break;
					case "MissingOrAmbiguousDirectional":
						if(attributeValue=="true")
							shipErrors.push(attributeName);
						break;
					case "CityStateValidated":
						if(attributeValue=="false")
							shipErrors.push(attributeName);
						break;
					case "Resolved":
						if(attributeValue=="false")
							shipErrors.push(attributeName);
						break;
					case "DPV":
						if(attributeValue=="false")
							shipErrors.push(attributeName);
						break;
				}
			}
			
			var effectiveAddressNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='AddressValidationReply']/*[name()='AddressResults']/*[name()='EffectiveAddress']");
			var returnedState = nlapiSelectValue(effectiveAddressNode,".//*[name()='StateOrProvinceCode']");
			var returnedZip = nlapiSelectValue(effectiveAddressNode,".//*[name()='PostalCode']");
			returnedZip = returnedZip.replace(/\s/g, '');
			
			if(returnedZip.indexOf("-")!=-1)
			{
				returnedZip = returnedZip.substring(0,returnedZip.indexOf("-"));
			}
			
			nlapiLogExecution("debug","Returned Shipping Zip: " + returnedZip,"SO Shipping Zip: " + shipValidateObject.zip);
			
			if(returnedState != shipValidateObject.state)
				stateZipMismatch = true;
			if(returnedZip != shipValidateObject.zip)
				stateZipMismatch = true;
			
			//RES (1), BUS (2), UNKNOWN (5), INVALID - UPDATE (3), COUNTRY NOT SUPPORTED (4)
			if(countrySupported==false)
				data[0] = "4";
			if(addressType=="RESIDENTIAL" && shipErrors.length == 0)
				data[0] = "1";
			else if(addressType=="BUSINESS" && shipErrors.length == 0)
				data[0] = "2";
			else if((addressType=="UNKNOWN" || addressType=="MIXED") && shipErrors.length == 0)
				data[0] = "5";
			else
				data[0] = "3";
				
				
			//Check Billing Address
			var templateFile = nlapiLoadFile(templateID);
			var template = templateFile.getValue();
			var xmlTemp = Handlebars.compile(template);
			
			var soap = xmlTemp(billValidateObject);
			
			var headers = new Object();
			headers["Content-Type"] = "application/xml";
			
			var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
			
			nlapiLogExecution("debug","Response Code",cResp.getCode());
			nlapiLogExecution("debug","Response Body (XML)",cResp.getBody());
			
			var body = cResp.getBody();
			var xmlBody = nlapiStringToXML(body);
			
			var countrySupported = true;
			var billingErrors = [];
			
			var resultsNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='AddressValidationReply']/*[name()='AddressResults']");
			var addressType = nlapiSelectValue(resultsNode,".//*[name()='Classification']");
			
			var attributeNodes = nlapiSelectNodes(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='AddressValidationReply']/*[name()='AddressResults']/*[name()='Attributes']");
			for(var i=0; i < attributeNodes.length; i++)
			{
				var attributeName = nlapiSelectValue(attributeNodes[i],".//*[name()='Name']");
				var attributeValue = nlapiSelectValue(attributeNodes[i],".//*[name()='Value']");
				
				if(attributeName=="CountrySupported")
				{
					if(attributeValue=="false")
						countrySupported = false;
				}
				
				switch(attributeName)
				{
					case "SuiteRequiredButMissing":
						if(attributeValue=="true")
							billingErrors.push(attributeName);
						break;
					case "InvalidSuiteNumber":
						if(attributeValue=="true")
							billingErrors.push(attributeName);
						break;
					case "MultipleMatches":
						if(attributeValue=="true")
							billingErrors.push(attributeName);
						break;
					case "PostalValidated":
						if(attributeValue=="false")
							billingErrors.push(attributeName);
						break;
					case "GeneralDelivery":
						if(attributeValue=="false")
							billingErrors.push(attributeName);
						break;
					case "StreetRangeValidated":
						if(attributeValue=="false")
							billingErrors.push(attributeName);
						break;
					case "StreetValidated":
						if(attributeValue=="false")
							billingErrors.push(attributeName);
						break;
					case "MissingOrAmbiguousDirectional":
						if(attributeValue=="true")
							billingErrors.push(attributeName);
						break;
					case "CityStateValidated":
						if(attributeValue=="false")
							billingErrors.push(attributeName);
						break;
					case "Resolved":
						if(attributeValue=="false")
							billingErrors.push(attributeName);
						break;
					case "DPV":
						if(attributeValue=="false")
							billingErrors.push(attributeName);
						break;
				}
			}
			
			var effectiveAddressNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='AddressValidationReply']/*[name()='AddressResults']/*[name()='EffectiveAddress']");
			var returnedState = nlapiSelectValue(effectiveAddressNode,".//*[name()='StateOrProvinceCode']");
			var returnedZip = nlapiSelectValue(effectiveAddressNode,".//*[name()='PostalCode']");
			returnedZip = returnedZip.replace(/\s/g, '');
			
			if(returnedZip.indexOf("-")!=-1)
			{
				returnedZip = returnedZip.substring(0,returnedZip.indexOf("-"));
			}
			
			nlapiLogExecution("debug","Returned Shipping Zip: " + returnedZip,"SO Billing Zip: " + billValidateObject.zip);
			
			if(returnedState != billValidateObject.state)
				stateZipMismatch = true;
			if(returnedZip != billValidateObject.zip)
				stateZipMismatch = true;
			
			//RES (1), BUS (2), UNKNOWN (5), INVALID - UPDATE (3), COUNTRY NOT SUPPORTED (4)
			if(countrySupported==false)
				data[1] = "4";
			if(addressType=="RESIDENTIAL" && billingErrors.length == 0)
				data[1] = "1";
			else if(addressType=="BUSINESS" && billingErrors.length == 0)
				data[1] = "2";
			else if((addressType=="UNKNOWN" || addressType=="MIXED") && billingErrors.length == 0)
				data[1] = "5";
			else
				data[1] = "3";
				
			if(shipErrors.length > 0 || billingErrors.length > 0)
			{
				var errorMsg = "";
				if(shipErrors.length > 0)
					errorMsg += "SHIPPING: " + shipErrors.join(",");
				
				if(shipErrors.length > 0 && billingErrors.length > 0)
					errorMsg += "  |  ";
				
				if(billingErrors.length > 0)
					errorMsg += "BILLING: " + billingErrors.join(",");	
				
				data[2] = errorMsg;
			}
			
			if(stateZipMismatch==true)
			{
				fields.push("custbody_fedex_state_zip_mismatch");
				data.push("T");
			}
			else
			{
				fields.push("custbody_fedex_state_zip_mismatch");
				data.push("F");
			}
			
			//Retrieve Standardized Address
			var standardizedAddress = "";
				
			var streetLines = nlapiSelectValues(effectiveAddressNode,".//*[name()='StreetLines']");
			for(var i=0; i < streetLines.length; i++)
				standardizedAddress += streetLines[i] + "\n";
			
			standardizedAddress += nlapiSelectValue(effectiveAddressNode,".//*[name()='City']")  + " ";
			standardizedAddress += nlapiSelectValue(effectiveAddressNode,".//*[name()='StateOrProvinceCode']") + " ";
			standardizedAddress += nlapiSelectValue(effectiveAddressNode,".//*[name()='PostalCode']").replace(/\s/g, '');
				
			fields.push("custbody_standardized_shipping_address");
			data.push(standardizedAddress);
			
			nlapiSubmitField("salesorder",results[x].getId(),fields,data);
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