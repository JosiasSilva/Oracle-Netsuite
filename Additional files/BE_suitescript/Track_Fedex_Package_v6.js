nlapiLogExecution("audit","FLOStart",new Date().getTime());
var templateID = "17835989";
var templateFile, template, xmlTemp;

function Track_Package(packageId,statusOnly)
{
	var trackObj = {
		trackingnumber : nlapiLookupField("customrecord_custom_package_record",packageId,"custrecord_tracking_id")
	}
	
	var soap = xmlTemp(trackObj);
	
	var headers = new Object();
	headers["Content-Type"] = "application/xml";
	
	try{
		var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);	
	}catch(reqErr){
		var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
	}
	
	nlapiLogExecution("debug","Response Code",cResp.getCode());
	nlapiLogExecution("debug","Response Body (XML)",cResp.getBody());
	
	var body = cResp.getBody();
	
	var xmlBody = nlapiStringToXML(body);
	
	//Check for errors and handle appropriately
	var errors = [];
	var errorNodes = nlapiSelectNodes(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='TrackReply']/*[name()='CompletedTrackDetails']/*[name()='TrackDetails']/*[name()='Notification']");
	for(var x=0; x < errorNodes.length; x++)
	{
		var code = nlapiSelectValue(errorNodes[x],".//*[name()='Code']");
		var message = nlapiSelectValue(errorNodes[x],".//*[name()='Message']");
		var severity = nlapiSelectValue(errorNodes[x],".//*[name()='Severity']");
		
		nlapiLogExecution("error","Error Code: " + code,"Message: " + message);
		
		if(code=="0000")
			continue;
			
		if(severity=="WARNING" || severity=="SUCCESS")
			continue;
		
		errors.push({
			code : code,
			message : message
		});
		
		if(code=="6035" && message=="Invalid tracking numbers.   Please check the following numbers and resubmit.")
		{
			nlapiSubmitField("customrecord_custom_package_record",packageId,"custrecord_valid_fedex_tracking_id","2");
			return true;
		}
		else if(code=="9040" && message=="This tracking number cannot be found. Please check the number or contact the sender.")
		{
			nlapiSubmitField("customrecord_custom_package_record",packageId,"custrecord_valid_fedex_tracking_id","2");
			return true;
		}
	}
	
	if(statusOnly==false)
	{
		var pckg = nlapiLoadRecord("customrecord_custom_package_record",packageId);
		pckg.setFieldValue("custrecord_valid_fedex_tracking_id","1");
		
		var latestActivity = null;
	
		var statusDetailNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='TrackReply']/*[name()='CompletedTrackDetails']/*[name()='TrackDetails']/*[name()='StatusDetail']");
		if(statusDetailNode!=null)
		{
			var creationTime = nlapiSelectValue(statusDetailNode,".//*[name()='CreationTime']");
			nlapiLogExecution("debug","Creation Time",creationTime);
			var description = nlapiSelectValue(statusDetailNode,".//*[name()='Description']");
			nlapiLogExecution("debug","Description",description);
			latestActivity = description;
			
			pckg.setFieldValue("custrecord_package_date_created",creationTime);
			pckg.setFieldText("custrecord_package_latest_activity",description);	
		}
		
		nlapiLogExecution("debug","Finished Status Detail Nodes");
		
		var locationNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='TrackReply']/*[name()='CompletedTrackDetails']/*[name()='TrackDetails']/*[name()='StatusDetail']/*[name()='Location']");
		if(locationNode!=null && locationNode!="")
		{
			var city = nlapiSelectValue(locationNode,".//*[name()='City']");
			nlapiLogExecution("debug","City",city);
			var state = nlapiSelectValue(locationNode,".//*[name()='StateOrProvinceCode']");
			var countryCode = nlapiSelectValue(locationNode,".//*[name()='CountryCode']");
			var countryName = nlapiSelectValue(locationNode,".//*[name()='CountryName']");
			var residential = nlapiSelectValue(locationNode,".//*[name()='Residential']");
			
			var location = "City: " + city + "\nState: " + state + "\nCountry Code: " + countryCode + "\nCountryName: " + countryName + "\nResidential: " + residential;
			nlapiLogExecution("debug","Location",location);
			pckg.setFieldValue("custrecord_package_location",location);	
		}
		
		nlapiLogExecution("debug","Finished Location Nodes");
		
		var ancillaryDetailsNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='TrackReply']/*[name()='CompletedTrackDetails']/*[name()='TrackDetails']/*[name()='StatusDetail']/*[name()='AncillaryDetails']");
		if(ancillaryDetailsNode!=null && ancillaryDetailsNode!="")
		{
			var reason = nlapiSelectValue(ancillaryDetailsNode,".//*[name()='Reason']");
			var reasonDescription = nlapiSelectValue(ancillaryDetailsNode,".//*[name()='ReasonDescription']");
			var action = nlapiSelectValue(ancillaryDetailsNode,".//*[name()='Action']");
			var actionDescription = nlapiSelectValue(ancillaryDetailsNode,".//*[name()='ActionDescription']");
			
			var trackDetailsNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='TrackReply']/*[name()='CompletedTrackDetails']/*[name()='TrackDetails']");
			var serviceCommitMessage = "";
			if(trackDetailsNode!=null && trackDetailsNode!="")
			{
				serviceCommitMessage = nlapiSelectValue(trackDetailsNode,".//*[name()='ServiceCommitMessage']");
			}
			
			var clearanceInfo = "Reason: " + reason + "\nReason Description:" + reasonDescription + "\nAction: " + action + "\nAction Description: " + actionDescription + "\nService Commit Message: " + serviceCommitMessage;
			nlapiLogExecution("debug","Clearance Information",clearanceInfo);
			pckg.setFieldValue("custrecord_clearance_information",clearanceInfo);	
		}
		
		nlapiLogExecution("debug","Finished Ancillary Detail Nodes");
		
		var trackDetailsNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='TrackReply']/*[name()='CompletedTrackDetails']/*[name()='TrackDetails']");
		if(trackDetailsNode!=null && trackDetailsNode!="")
		{
			var carrierDescription = nlapiSelectValue(trackDetailsNode,".//*[name()='OperatingCompanyOrCarrierDescription']");
			nlapiLogExecution("debug","Carrier Description",carrierDescription);
			pckg.setFieldValue("custrecord_package_carrier_description",carrierDescription);
			
			var deliveryAttempts = nlapiSelectValue(trackDetailsNode,".//*[name()='DeliveryAttempts']")
			nlapiLogExecution("debug","Delivery Attempts",deliveryAttempts);
			pckg.setFieldValue("custrecord_package_delivery_attempts",deliveryAttempts);
			
			var shipTimestamp = nlapiSelectValue(trackDetailsNode,".//*[name()='ShipTimestamp']")
			nlapiLogExecution("debug","Ship Timestamp",shipTimestamp);
			pckg.setFieldValue("custrecord_ship_time_stamp",shipTimestamp);	
			
			if(latestActivity==null && (shipTimestamp==null || shipTimestamp==""))
			{
				//When Latest Activity is EMPTY and Ship Time Stamp is EMPTY, set LATEST ACTIVITY = Shipment information sent to FedEx
				pckg.setFieldValue("custrecord_package_latest_activity","1");
			}
			
			var actualDeliveryTimestamp = nlapiSelectValue(trackDetailsNode,".//*[name()='ActualDeliveryTimestamp']");
			nlapiLogExecution("debug","Actual Delivery Timestamp",actualDeliveryTimestamp);
			pckg.setFieldValue("custrecord_delivery_time",actualDeliveryTimestamp);
			
			if(actualDeliveryTimestamp!=null && actualDeliveryTimestamp!="")
			{
				//When delivery timestamp is not empty, set LATEST ACTIVITY = Delivered
				pckg.setFieldValue("custrecord_package_latest_activity","15");
			}
			
			var deliverySignatureName = nlapiSelectValue(trackDetailsNode,".//*[name()='DeliverySignatureName']");
			nlapiLogExecution("debug","Delivery Signature Name",deliverySignatureName);
			pckg.setFieldValue("custrecord_delivery_signature_name",deliverySignatureName);
		}
		
		nlapiLogExecution("debug","Finished Track Detail Nodes");
		
		var weightNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='TrackReply']/*[name()='CompletedTrackDetails']/*[name()='TrackDetails']/*[name()='PackageWeight']");
		if(weightNode!=null && weightNode!="")
		{
			var weight = nlapiSelectValue(weightNode,".//*[name()='Value']") + " " + nlapiSelectValue(weightNode,".//*[name()='Units']");
			nlapiLogExecution("debug","Weight",weight);
			pckg.setFieldValue("custrecord_package_weight",weight);	
		}
		
		nlapiLogExecution("debug","Finished Weight Nodes");
		
		var serviceNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='TrackReply']/*[name()='CompletedTrackDetails']/*[name()='TrackDetails']/*[name()='Service']");
		if(serviceNode!=null && serviceNode!="")
		{
			var serviceType = nlapiSelectValue(serviceNode,".//*[name()='Description']");
			pckg.setFieldValue("custrecord_package_service_type",serviceType);	
		}
		
		nlapiLogExecution("debug","Finished Service Nodes");
		
		var shipperNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='TrackReply']/*[name()='CompletedTrackDetails']/*[name()='TrackDetails']/*[name()='ShipperAddress']");
		if(shipperNode!=null && shipperNode!="")
		{
			var shipperCity = nlapiSelectValue(shipperNode,".//*[name()='City']");
			var shipperState = nlapiSelectValue(shipperNode,".//*[name()='StateOrProvinceCode']");
			var shipperCountryCode = nlapiSelectValue(shipperNode,".//*[name()='CountryCode']");
			var shipperCountryName = nlapiSelectValue(shipperNode,".//*[name()='CountryName']");
			var shipperResidential = nlapiSelectValue(shipperNode,".//*[name()='Residential']");
			
			var shipper = "City: " + shipperCity + "\nState: " + shipperState + "\nCountry Code: " + shipperCountryCode + "\nCountryName: " + shipperCountryName + "\nResidential: " + shipperResidential;
			pckg.setFieldValue("custrecord_shipper_address",shipper);	
		}
		
		nlapiLogExecution("debug","Finished Shipper Nodes");
		
		var destinationNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='TrackReply']/*[name()='CompletedTrackDetails']/*[name()='TrackDetails']/*[name()='DestinationAddress']");
		if(destinationNode!=null && destinationNode!="")
		{
			var destinationCity = nlapiSelectValue(destinationNode,".//*[name()='City']");
			var destinationState = nlapiSelectValue(destinationNode,".//*[name()='StateOrProvinceCode']");
			var destinationCountryCode = nlapiSelectValue(destinationNode,".//*[name()='CountryCode']");
			var destinationCountryName = nlapiSelectValue(destinationNode,".//*[name()='CountryName']");
			var destinationResidential = nlapiSelectValue(destinationNode,".//*[name()='Residential']");
			
			var destination = "City: " + destinationCity + "\nState: " + destinationState + "\nCountry Code: " + destinationCountryCode + "\nCountryName: " + destinationCountryName + "\nResidential: " + destinationResidential;
			pckg.setFieldValue("custrecord_recipient_address",destination);	
		}
		
		nlapiLogExecution("debug","Finished Destination Nodes");
		
		var idNodes = nlapiSelectNodes(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='TrackReply']/*[name()='CompletedTrackDetails']/*[name()='TrackDetails']/*[name()='OtherIdentifiers']/*[name()='PackageIdentifier']");
		if(idNodes!=null && idNodes!="")
		{
			for(var x=0; x < idNodes.length; x++)
			{
				var idType = nlapiSelectValue(idNodes[x],".//*[name()='Type']");
				if(idType=="INVOICE")
				{
					pckg.setFieldValue("custrecord_cpr_invoice",nlapiSelectValue(idNodes[x],".//*[name()='Value']"));
				}
				else if(idType=="SHIPPER_REFERENCE")
				{
					pckg.setFieldValue("custrecord_reference",nlapiSelectValue(idNodes[x],".//*[name()='Value']"));
				}
				else if(idType=="RETURNED_TO_SHIPPER_TRACKING_NUMBER")
				{
					pckg.setFieldValue("custrecordreturned_to_shipper_tracking",nlapiSelectValue(idNodes[x],".//*[name()='Value']"));
				}
			}
		}
		
		nlapiLogExecution("debug","Finished ID Nodes");
		
		var specialHandlingsNodes = nlapiSelectNodes(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='TrackReply']/*[name()='CompletedTrackDetails']/*[name()='TrackDetails']/*[name()='SpecialHandlings']");
		if(specialHandlingsNodes!=null && specialHandlingsNodes!="")
		{
			for(var x=0; x < specialHandlingsNodes.length; x++)
			{
				var shType = nlapiSelectValue(specialHandlingsNodes[x],".//*[name()='Type']");
				var shDescription = nlapiSelectValue(specialHandlingsNodes[x],".//*[name()='Description']");
				var shPaymentType = nlapiSelectValue(specialHandlingsNodes[x],".//*[name()='PaymentType']");
				
				pckg.setFieldValue("custrecord_package_payment_type",shPaymentType);
				pckg.setFieldValue("custrecord_package_special_handling",shDescription);
			}
		}
		
		nlapiLogExecution("debug","Finished Special Handling Nodes");
		
		var eventsNodes = nlapiSelectNodes(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='TrackReply']/*[name()='CompletedTrackDetails']/*[name()='TrackDetails']/*[name()='Events']");
		if(eventsNodes!=null && eventsNodes!="" && eventsNodes.length > 0)
		{
			var statusTimestamp = nlapiSelectValue(eventsNodes[0],".//*[name()='Timestamp']");
			nlapiLogExecution("debug","Status Time Stamp",statusTimestamp);
			pckg.setFieldValue("custrecord_status_time_stamp",statusTimestamp);
		}
		
		nlapiLogExecution("debug","Finished Events Nodes");
		
		nlapiSubmitRecord(pckg,true,true);
	}
	else
	{
		var statusDetailNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='TrackReply']/*[name()='CompletedTrackDetails']/*[name()='TrackDetails']/*[name()='StatusDetail']");
		if(statusDetailNode!=null)
		{
			var creationTime = nlapiSelectValue(statusDetailNode,".//*[name()='CreationTime']");
			nlapiLogExecution("debug","Creation Time",creationTime);
			
			var description = nlapiSelectValue(statusDetailNode,".//*[name()='Description']");
			nlapiLogExecution("debug","Description",description);
			
			//nlapiSubmitField("customrecord_custom_package_record",packageId,["custrecord_package_date_created","custrecord_package_latest_activity"],[creationTime,description]);
			var cpr = nlapiLoadRecord("customrecord_custom_package_record",packageId);
			cpr.setFieldValue("custrecord_package_date_created",creationTime);
			cpr.setFieldText("custrecord_package_latest_activity",description);
			nlapiSubmitRecord(cpr,true,true);
		}
	}
}

function Update_Packages()
{
	Load_Template();
	
	var filters = [];
	filters.push(new nlobjSearchFilter("isinactive",null,"is","F"));
	//filters.push(new nlobjSearchFilter("internalid",null,"is","1881"));
	filters.push(new nlobjSearchFilter("custrecord_package_latest_activity",null,"noneof","15"));
	filters.push(new nlobjSearchFilter("custrecord_valid_fedex_tracking_id",null,"noneof","2"));
	filters.push(new nlobjSearchFilter("custrecord_tracking_id",null,"isnotempty"));
	//filters.push(new nlobjSearchFilter("custrecord_received",null,"is","F"));
	
	var searchid = 0;
	var search = nlapiCreateSearch("customrecord_custom_package_record", filters, null);
	var resultSet = search.runSearch();
	do {
        var results = resultSet.getResults(searchid, searchid + 1000);
        
		for(var x=0; x < results.length; x++)
		{
			try
			{
				checkGovernance();
				Track_Package(results[x].getId(),false);
	            searchid++;
			}
			catch(err)
			{
				nlapiLogExecution("error","Error Updating Package: " + results[x].getId(),"Details: " + err.message);
			}
        }

    }while(results.length >= 1000);
}

function Update_Packages_Status_Only_SL(request,response)
{
	//Initiate scheduled script for updating package statuses only
	nlapiScheduleScript("customscript_update_pckg_statuses_only",null);
	
	//Redirect user back to ops receiving dashboard for packages
	response.sendRedirect("SUITELET","customscript_ops_receiving_dashboard","customdeploy_receiving_dashboard");
}

function Update_Packages_Status_Only()
{
	var now = new Date();
	nlapiLogExecution("debug","Script Started",now.toString());
	
	Load_Template();
	
	var filters = [];
	filters.push(new nlobjSearchFilter("isinactive",null,"is","F"));
	//filters.push(new nlobjSearchFilter("custrecord_received",null,"is","F"));
	filters.push(new nlobjSearchFilter("custrecord_package_latest_activity",null,"noneof","15")); //Not Delivered
	filters.push(new nlobjSearchFilter("custrecord_valid_fedex_tracking_id",null,"noneof","2"));
	filters.push(new nlobjSearchFilter("custrecord_tracking_id",null,"isnotempty"));
	
	var searchid = 0;
	var search = nlapiCreateSearch("customrecord_custom_package_record", filters, null);
	var resultSet = search.runSearch();
	do {
        var results = resultSet.getResults(searchid, searchid + 1000);
        
		for(var x=0; x < results.length; x++)
		{
			try
			{
				checkGovernance();
				Track_Package(results[x].getId(),true);
				nlapiLogExecution("debug","Finished Package " + searchid);
			}
			catch(err)
			{
				nlapiLogExecution("error","Error Updating Package: " + results[x].getId(),"Details: " + err.message);
			}
			
            searchid++;
        }

    }while(results.length >= 1000);
	
	now = new Date();
	nlapiLogExecution("debug","Script Finished",now.toString());
}

function Update_Tracking_Button(type,form)
{
	if(type=="view")
	{
		try
		{
			var url = nlapiResolveURL("SUITELET","customscript_track_pckg_sl","customdeploy_track_pckg_sl");
			url += "&package=" + nlapiGetRecordId();
			
			form.addButton("custpage_update_tracking","Update Tracking","window.location.href='"+url+"';");
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Update Buttong","Details: " + err.message);
		}
	}
}

function Update_Tracking_SL(request,response)
{
	try
	{
		var pckg = request.getParameter("package");
		nlapiLogExecution("debug","Package ID: " + pckg);
		
		Load_Template();
		
		Track_Package(pckg,false);
		
		response.sendRedirect("RECORD","customrecord_custom_package_record",pckg);
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating Package","Details: " + err.message);
		response.sendRedirect("RECORD","customrecord_custom_package_record",pckg);
	}
}

function Load_Template()
{
	if(nlapiGetContext().getEnvironment()=="PRODUCTION")
	{
		templateID = "18493373";
	}
	else
	{
		templateID = "17835989";
	}
	
	templateFile = nlapiLoadFile(templateID);
	template = templateFile.getValue();
	xmlTemp = Handlebars.compile(template);
}

function checkGovernance()
{
	var context = nlapiGetContext();
	if(context.getRemainingUsage() < 100)
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