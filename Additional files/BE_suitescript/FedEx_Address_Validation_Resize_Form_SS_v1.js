function FedEx_Address_Validation()
{
	var templateID = nlapiGetContext().getSetting("SCRIPT","custscript_fedex_aval_rs_xml");
	nlapiLogExecution("debug","Template ID",templateID);
	
	var filters = [];
	filters.push(new nlobjSearchFilter("custrecorddate_ring_sizer_requested",null,"on","today"));
	
	var cols = [];
	cols.push(new nlobjSearchColumn("custrecord_ocf_address_line_1"));
	cols.push(new nlobjSearchColumn("custrecord_ocf_address_line_2"));
	cols.push(new nlobjSearchColumn("custrecord_ocf_city"));
	cols.push(new nlobjSearchColumn("custrecord_ocf_state"));
	cols.push(new nlobjSearchColumn("custrecord_ocf_zip_postal_code"));
	cols.push(new nlobjSearchColumn("custrecord_ocf_country"));
	
	var recordID = nlapiGetContext().getSetting("SCRIPT","custscript_fedex_aval_record_id");
	if(recordID!=null && recordID!="")
	{
		filters.push(new nlobjSearchFilter("internalid",null,"is",recordID));
		nlapiLogExecution("debug","Using custom record internal ID: " + recordID);
	}
	
	var results = nlapiSearchRecord("customrecord_online_customer_form",null,filters,cols);
	
	if(results)
	{
		nlapiLogExecution("debug","# Results",results.length);
		
		for(var x=0; x < results.length; x++)
		{
			checkGovernance();
			
			var fields = ["custrecord_ocf_ring_sizer_request_valid","custrecord_standardized_shipping_address","custrecord_ocf_ring_sizer_aval_error"];
			var data = ["","",""];
			var stateZipMismatch = false;
			
			var addrValidateObject = {
				address1 : results[x].getValue("custrecord_ocf_address_line_1"),
				address2 : results[x].getValue("custrecord_ocf_address_line_2"),
				city : results[x].getValue("custrecord_ocf_city"),
				state : results[x].getValue("custrecord_ocf_state"),
				zip : results[x].getValue("custrecord_ocf_zip_postal_code"),
				country : results[x].getValue("custrecord_ocf_country")				
			};
			
			if(addrValidateObject.zip!=null && addrValidateObject.zip!="")
				addrValidateObject.zip = addrValidateObject.zip.replace(/\s/g, '');
				
			
			//Check Address
			var templateFile = nlapiLoadFile(templateID);
			var template = templateFile.getValue();
			var xmlTemp = Handlebars.compile(template);
			
			var soap = xmlTemp(addrValidateObject);
			
			var headers = new Object();
			headers["Content-Type"] = "application/xml";
			
			var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
			
			nlapiLogExecution("debug","Response Code",cResp.getCode());
			nlapiLogExecution("debug","Response Body (XML)",cResp.getBody());
			
			var body = cResp.getBody();
			var xmlBody = nlapiStringToXML(body);
			
			var countrySupported = true;
			var errors = [];
			
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
							errors.push(attributeName);
						break;
					case "InvalidSuiteNumber":
						if(attributeValue=="true")
							errors.push(attributeName);
						break;
					case "MultipleMatches":
						if(attributeValue=="true")
							errors.push(attributeName);
						break;
					case "PostalValidated":
						if(attributeValue=="false")
							errors.push(attributeName);
						break;
					case "GeneralDelivery":
						if(attributeValue=="false")
							errors.push(attributeName);
						break;
					case "StreetRangeValidated":
						if(attributeValue=="false")
							errors.push(attributeName);
						break;
					case "StreetValidated":
						if(attributeValue=="false")
							errors.push(attributeName);
						break;
					case "MissingOrAmbiguousDirectional":
						if(attributeValue=="true")
							errors.push(attributeName);
						break;
					case "CityStateValidated":
						if(attributeValue=="false")
							errors.push(attributeName);
						break;
					case "Resolved":
						if(attributeValue=="false")
							errors.push(attributeName);
						break;
					case "DPV":
						if(attributeValue=="false")
							errors.push(attributeName);
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
			
			nlapiLogExecution("debug","Returned Shipping Zip: " + returnedZip,"SO Billing Zip: " + addrValidateObject.zip);
			
			if(formatUpper(returnedState) != formatUpper(addrValidateObject.state))
				stateZipMismatch = true;
			if(returnedZip != addrValidateObject.zip)
				stateZipMismatch = true;
			
			//RES (1), BUS (2), UNKNOWN (3), INVALID - UPDATE (4), COUNTRY NOT SUPPORTED (5)
			if(countrySupported==false)
				data[0] = "5";
			if(addressType=="RESIDENTIAL" && errors.length == 0)
				data[0] = "1";
			else if(addressType=="BUSINESS" && errors.length == 0)
				data[0] = "2";
			else if((addressType=="UNKNOWN" || addressType=="MIXED") && errors.length == 0)
				data[0] = "3";
			else
				data[0] = "4";
				
			//Retrieve Standardized Address
			var standardizedAddress = "";
				
			var streetLines = nlapiSelectValues(effectiveAddressNode,".//*[name()='StreetLines']");
			for(var i=0; i < streetLines.length; i++)
			{
				standardizedAddress += streetLines[i] + "\n";
			}
			
			standardizedAddress += nlapiSelectValue(effectiveAddressNode,".//*[name()='City']")  + " ";
			standardizedAddress += nlapiSelectValue(effectiveAddressNode,".//*[name()='StateOrProvinceCode']") + " ";
			standardizedAddress += nlapiSelectValue(effectiveAddressNode,".//*[name()='PostalCode']").replace(/\s/g, '');
			
			data[1] = standardizedAddress;
				
			if(errors.length > 0)
			{
				var errorMsg = "";
				if(errors.length > 0)
					errorMsg += "" + errors.join(",");
				
				data[2] = errorMsg;
			}
			
			nlapiSubmitField("customrecord_online_customer_form",results[x].getId(),fields,data);
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

function formatUpper(value)
{
	if(value!=null && value!="")
		return value.toUpperCase();
	else
		return value;
}
