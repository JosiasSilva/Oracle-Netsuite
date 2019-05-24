/*
 * v9 - Contains updates for NS-1266 (Update Auto IF with PP Insurance for FedEx Shipping Address)
 */
function Drop_Ship_Fulfillment_Label(shipment,showLabel)
{	
	nlapiLogExecution("debug","In drop ship lable function...","FFID: " + shipment + "  |  Show Label: " + showLabel);
	
	var labelObj = {
		ship_timestamp : "",
		service_type : "PRIORITY_OVERNIGHT",
		insurance_value : "",
		insurance_label : "",
		tranid : "",
		ship_addressee : "",
		ship_attention : "",
		ship_address1 : "",
		ship_address2 : "",
		ship_city : "",
		ship_state : "",
		ship_zipcode : "",
		ship_country : "",
		ship_phone : "",
		ship_from_addressee : "",
		ship_from_address1 : "",
		ship_from_address2 : "",
		ship_from_city : "",
		ship_from_state : "",
		ship_from_zipcode : "",
		ship_from_country : "",
		ship_from_phone : "",
		saturday_delivery : false,
		key : "",
		password : "",
		accountnumber : "",
		meternumber : "",
		dsr : "yes"
	};
	
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",shipment));
	filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
	var cols = [];
	cols.push(new nlobjSearchColumn("custbody_full_insurance_amount","createdfrom"));
	cols.push(new nlobjSearchColumn("shipaddressee"));
	cols.push(new nlobjSearchColumn("shippingattention"));
	cols.push(new nlobjSearchColumn("shipaddress1"));
	cols.push(new nlobjSearchColumn("shipaddress2"));
	cols.push(new nlobjSearchColumn("shipcity"));
	cols.push(new nlobjSearchColumn("shipstate"));
	cols.push(new nlobjSearchColumn("shipzip"));
	cols.push(new nlobjSearchColumn("shipcountry"));
	cols.push(new nlobjSearchColumn("shipmethod"));
	cols.push(new nlobjSearchColumn("location"));
	cols.push(new nlobjSearchColumn("trandate"));
	cols.push(new nlobjSearchColumn("tranid","createdfrom"));
	cols.push(new nlobjSearchColumn("custbody39","createdfrom"));
	cols.push(new nlobjSearchColumn("custbody8","createdfrom")); //Contact Phone Number
	cols.push(new nlobjSearchColumn("custbody6","createdfrom")); //Delivery Date
	cols.push(new nlobjSearchColumn("custbody53","createdfrom")); //Is Pick Up
	cols.push(new nlobjSearchColumn("custbody_pickup_location","createdfrom")); //Pick-up Location
	cols.push(new nlobjSearchColumn("custbody194","createdfrom")); //Delivery Instructions
	cols.push(new nlobjSearchColumn("custbody87","createdfrom")); //Type of Order
	cols.push(new nlobjSearchColumn("custbody_fedex_location_type","createdfrom")); //FedEx Location Type
	var results = nlapiSearchRecord("itemfulfillment",null,filters,cols);
	if(results)
	{
		labelObj.tranid = results[0].getValue("tranid","createdfrom");
		
		//Check for Saturday delivery
		if(results[0].getValue("custbody194","createdfrom")!=null && results[0].getValue("custbody194","createdfrom")!="")
		{
			nlapiLogExecution("debug","Delivery Instructions",results[0].getText("custbody194","createdfrom"));
			
			if(results[0].getText("custbody194","createdfrom").indexOf("Saturday Delivery")!=-1)
				labelObj.saturday_delivery = true;
				
			nlapiLogExecution("debug","Is Saturday Delivery?",labelObj.saturday_delivery);
		}
		
		var location = results[0].getValue("location");
		nlapiLogExecution("debug","Location",location);
		
		//Get address details from location record
		var shipFromFilters = [];
		shipFromFilters.push(new nlobjSearchFilter("internalid",null,"is",location));
		var shipFromCols = [];
		shipFromCols.push(new nlobjSearchColumn("address1","address"));
		shipFromCols.push(new nlobjSearchColumn("address2","address"));
		shipFromCols.push(new nlobjSearchColumn("city","address"));
		shipFromCols.push(new nlobjSearchColumn("state","address"));
		shipFromCols.push(new nlobjSearchColumn("zip","address"));
		shipFromCols.push(new nlobjSearchColumn("countrycode","address"));
		shipFromCols.push(new nlobjSearchColumn("phone","address"));
		shipFromCols.push(new nlobjSearchColumn("addressee","address"));
		shipFromCols.push(new nlobjSearchColumn("attention","address"));
		var shipFromResults = nlapiSearchRecord("location",null,shipFromFilters,shipFromCols);
		if(shipFromResults)
		{
			labelObj.ship_from_addressee = shipFromResults[0].getValue("attention","address");
			labelObj.ship_from_address1 = shipFromResults[0].getValue("address1","address");
			labelObj.ship_from_address2 = shipFromResults[0].getValue("address2","address");
			labelObj.ship_from_city = shipFromResults[0].getValue("city","address");
			labelObj.ship_from_state = shipFromResults[0].getValue("state","address");
			labelObj.ship_from_zipcode = shipFromResults[0].getValue("zip","address");
			labelObj.ship_from_country = shipFromResults[0].getValue("countrycode","address");
			labelObj.ship_from_phone = shipFromResults[0].getValue("phone","address");	
		}
		
		//Get FedEx API information from custom record for that location
		var apiFilters = [];
		apiFilters.push(new nlobjSearchFilter("custrecord_fedex_int_location",null,"is",location));
		var apiCols = [];
		apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_account_number"));
		apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_meter_number"));
		apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_key"));
		apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_password"));
		var apiResults = nlapiSearchRecord("customrecord_fedex_integration_key",null,apiFilters,apiCols);
		if(apiResults)
		{
			labelObj.key = apiResults[0].getValue("custrecord_fedex_int_key");
			labelObj.password = apiResults[0].getValue("custrecord_fedex_int_password");
			labelObj.accountnumber = apiResults[0].getValue("custrecord_fedex_int_account_number");
			labelObj.meternumber = apiResults[0].getValue("custrecord_fedex_int_meter_number");
		}
		else
		{
			//If no match found, use SF credentials
			var sfCredentials = nlapiLookupField("customrecord_fedex_integration_key","1",["custrecord_fedex_int_key","custrecord_fedex_int_password","custrecord_fedex_int_account_number","custrecord_fedex_int_meter_number"]);
			
			labelObj.key = sfCredentials.custrecord_fedex_int_key;
			labelObj.password = sfCredentials.custrecord_fedex_int_password;
			labelObj.accountnumber = sfCredentials.custrecord_fedex_int_account_number;
			labelObj.meternumber = sfCredentials.custrecord_fedex_int_meter_number;
		}
		
		if(results[0].getValue("custbody53","createdfrom")!="T")
		{
			labelObj.ship_addressee = results[0].getValue("shipaddressee");
			labelObj.ship_attention = results[0].getValue("shippingattention");
			labelObj.ship_address1 = results[0].getValue("shipaddress1");
			labelObj.ship_address2 = results[0].getValue("shipaddress2");
			labelObj.ship_city = results[0].getValue("shipcity");
			labelObj.ship_state = results[0].getValue("shipstate");
			labelObj.ship_zipcode = results[0].getValue("shipzip");
			labelObj.ship_country = results[0].getValue("shipcountry");
			labelObj.ship_phone = results[0].getValue("custbody8","createdfrom");	
		}
		else
		{
			var puLocation = results[0].getValue("custbody_pickup_location","createdfrom");
			var locationID = null;
			
			//Convert to Location record ID
			var puLocFilters = [];
			puLocFilters.push(new nlobjSearchFilter("custrecord_pick_up_location_link",null,"is",puLocation));
			var puLocResults = nlapiSearchRecord("location",null,puLocFilters);
			if(results)
			{
				locationID = puLocResults[0].getId();
			}
			
			//Get address details from location record
			var locFilters = [];
			locFilters.push(new nlobjSearchFilter("internalid",null,"is",locationID));
			var locCols = [];
			locCols.push(new nlobjSearchColumn("address1","address"));
			locCols.push(new nlobjSearchColumn("address2","address"));
			locCols.push(new nlobjSearchColumn("city","address"));
			locCols.push(new nlobjSearchColumn("state","address"));
			locCols.push(new nlobjSearchColumn("zip","address"));
			locCols.push(new nlobjSearchColumn("countrycode","address"));
			locCols.push(new nlobjSearchColumn("phone","address"));
			locCols.push(new nlobjSearchColumn("addressee","address"));
			locCols.push(new nlobjSearchColumn("attention","address"));
			var locResults = nlapiSearchRecord("location",null,locFilters,locCols);
			if(locResults)
			{
				labelObj.ship_addressee = locResults[0].getValue("addressee","address");
				labelObj.ship_address1 = locResults[0].getValue("address1","address");
				labelObj.ship_address2 = locResults[0].getValue("address2","address");
				labelObj.ship_city = locResults[0].getValue("city","address");
				labelObj.ship_state = locResults[0].getValue("state","address");
				labelObj.ship_zipcode = locResults[0].getValue("zip","address");
				labelObj.ship_country = locResults[0].getValue("countrycode","address");
				labelObj.ship_phone = locResults[0].getValue("phone","address");	
			}
		}
		
		var deliveryDateObj = nlapiStringToDate(results[0].getValue("custbody6","createdfrom"));
		
		nlapiLogExecution("debug","Delivery Date",nlapiDateToString(deliveryDateObj,"date"));
		
		if(results[0].getValue("custbody39","createdfrom")!=null && results[0].getValue("custbody39","createdfrom")!="")
		{
			var shipDate = nlapiAddDays(deliveryDateObj,-1);
			switch(shipDate.getDay())
			{
				case 0: //Sunday
					shipDate = nlapiAddDays(shipDate,-2);
					break;
				case 6: //Saturday
					if(labelObj.saturday_delivery == false)
						shipDate = nlapiAddDays(shipDate,-1);
					break;
			}
		}
		else
		{
			var shipDate = results[0].getValue("trandate");
			shipDate = nlapiStringToDate(shipDate);
		}
		
		nlapiLogExecution("debug","Ship Date",nlapiDateToString(shipDate,"date"));
		
		var now = shipDate;
		var timestamp = "" + now.getFullYear() + "-";
		var month = now.getMonth();
		month = month + 1;
		if(month < 10)
			timestamp += "0" + month + "-";
		else
			timestamp += month + "-";
		
		if(now.getDate() < 10)
			timestamp += "0" + now.getDate() + "T";
		else
			timestamp += now.getDate() + "T";
		
		if(now.getHours() < 10)
			timestamp += "0" + now.getHours() + ":";
		else
			timestamp += now.getHours() + ":";
			
		if(now.getMinutes() < 10)
			timestamp += "0" + now.getMinutes() + ":";
		else
			timestamp += now.getMinutes() + ":";
			
		if(now.getSeconds() < 10)
			timestamp += "0" + now.getSeconds();
		else
			timestamp += now.getSeconds();
			
		labelObj.ship_timestamp = timestamp;
		
		
		var shipService;
		switch(results[0].getValue("shipmethod"))
		{
			case "2221264":
			case "6":
			case "5668897":
				shipService = "FEDEX_2_DAY";
				break;
			case "2":
			case "1965157":
			case "5668896":
				shipService = "PRIORITY_OVERNIGHT";
				break;
			case "5668896":
				shipService = "FIRST_OVERNIGHT";
				break;
			case "5668899":
				shipService = "FEDEX_GROUND";
				break;
			default:
				shipService = "PRIORITY_OVERNIGHT";
				break;
		}
		
		labelObj.service_type = shipService;
		
		var insurance, insurance_label;
		
		nlapiLogExecution("debug","Shipping Country",results[0].getText("shipcountry"));
		
		var scilFilters = []
		scilFilters.push(new nlobjSearchFilter("formulatext",null,"is",results[0].getText("shipcountry")).setFormula("{custrecord_insurance_limit_country}"));
		scilFilters.push(new nlobjSearchFilter("custrecord_shipping_method",null,"anyof",results[0].getValue("shipmethod")));
		var scilCols = [];
		scilCols.push(new nlobjSearchColumn("custrecord_fedex_insurance_limit"));
		scilCols.push(new nlobjSearchColumn("custrecord_parcel_pro_insurance_limit"));
		scilCols.push(new nlobjSearchColumn("custrecord_customer_restricted_country"));
		var scilResults = nlapiSearchRecord("customrecord_shipping_country_insurance",null,scilFilters,scilCols);
		if(scilResults)
		{
			if(scilResults[0].getValue("custrecord_customer_restricted_country")=="T")
			{
				nlapiSubmitField("itemfulfillment",shipment,"custbody_fedex_error_message","Country not eligible for customer shipment");
				
				return true;
			}
			else
			{
				var totalCost = parseFloat(results[0].getValue("custbody_full_insurance_amount","createdfrom"));
				
				var fedexLimit = scilResults[0].getValue("custrecord_fedex_insurance_limit");
				if(fedexLimit==null || fedexLimit=="")
					fedexLimit = 0.00;
				else
					fedexLimit = parseFloat(fedexLimit);
				
				var parcelProLimit = scilResults[0].getValue("custrecord_parcel_pro_insurance_limit");
				if(parcelProLimit==null || parcelProLimit=="")
					parcelProLimit = 0.00;
				else
					parcelProLimit = parseFloat(parcelProLimit);
					
				if(totalCost > (fedexLimit + parcelProLimit))
				{
					nlapiLogExecution("debug","Insurance is over Fedex + Parcel Pro...");
			
					if(showLabel==true)
					{
						var form = nlapiCreateForm("Insurance Exceeds Fedex and Parcel Pro Limits",true);
						var msg = form.addField("custpage_msg","inlinehtml","Message");
						msg.setDefaultValue("The insurance value exceeds the combined FedEx and Parcel Pro insurance limits for this country. No label will be created.");
						response.writePage(form);
					}
					
					return true;
				}
				else if(totalCost > fedexLimit)
				{
					insurance = fedexLimit;
				}
				else
				{
					insurance = totalCost;
				}
				
				if(results[0].getValue("custbody39","createdfrom")!=null && results[0].getValue("custbody39","createdfrom")!="")
				{
					insurance_label = "RE2014" + parseInt(totalCost / 0.8) + "200305";
				}
				else
				{
					if(totalCost > fedexLimit)
					{
						insurance_label = "RE2014" + parseInt(totalCost - fedexLimit) + "200305";
					}
					else
					{
						insurance_label = "BEF8956" + parseInt(totalCost) + "X1560";
					}
				}
			}
		}
		
		//NS-1266: If FedEx Location Type is not empty, not 'Not Applicable', and not 'No results found' the use parcel pro insurance code RE2014.
		//         Applies to orders with insurance >= $20,000 only.
		var fedexLocationType = results[0].getValue("custbody_fedex_location_type","createdfrom");
		
		if(fedexLocationType!=null && fedexLocationType!="" && fedexLocationType!="11" && fedexLocationType!="")
		{
			if(insurance >= 20000)
				insurance_label = "RE2014" + parseInt(totalCost / 0.8) + "200305";
		}
		
		nlapiLogExecution("debug","Insurance Value",insurance);
		nlapiLogExecution("debug","Insurance Label",insurance_label);
		
		//Check if order is under $250, if under $250 then do not require signature
		if(results[0].getValue("custbody87","createdfrom")=="1" && totalCost <= 250)
			labelObj.dsr = "";
		
		//var insurance = results[0].getValue("custbody_full_insurance_amount","createdfrom") / 0.8;
		//var insurance_label = "RE2014" + parseInt(insurance) + "200305";
		
		//nlapiLogExecution("debug","Insurance Value (Order)",results[0].getValue("custbody_full_insurance_amount","createdfrom"));
		//nlapiLogExecution("debug","Insurance Value (Multiplier)",insurance);
		
		//If order is over 50k then only declare 50K
		/*
		if(results[0].getValue("custbody_full_insurance_amount","createdfrom") > 50000 && results[0].getValue("custbody_full_insurance_amount","createdfrom") <= 120000)
		{
			insurance = 50000;
		}
		else if(results[0].getValue("custbody_full_insurance_amount","createdfrom") > 120000)
		{
			nlapiLogExecution("debug","Insurance is over 120K...");
			
			if(showLabel==true)
			{
				var form = nlapiCreateForm("Insurance Exceeds 120k",true);
				var msg = form.addField("custpage_msg","inlinehtml","Message");
				msg.setDefaultValue("The insurance value exceeds 120k. No label will be created.");
				response.writePage(form);
			}
			
			return true;
		}
		*/
		
		labelObj.insurance_value = insurance;
		labelObj.insurance_label = insurance_label;
	}
	
	if(nlapiGetContext().getEnvironment()=="PRODUCTION")
	{
		var templateID = "26235563"; //Old: 16756534
		var folderID = "8762529";
	}
	else
	{
		var templateID = "26235563";
		var folderID = "8762529";
	}
	
	//var templateID = nlapiGetContext().getSetting("SCRIPT","custscript_drop_ship_label_soap_file");
	//var templateID = "15613987";
	var templateFile = nlapiLoadFile(templateID);
	var template = templateFile.getValue();
	var xmlTemp = Handlebars.compile(template);
	
	var soap = xmlTemp(labelObj);
	
	if(nlapiGetContext().getEnvironment()=="SANDBOX")
	{
		//Create Request Log file
		var requestFile = nlapiCreateFile(labelObj.tranid + "_Request.txt","PLAINTEXT",soap);
		requestFile.setFolder("8762529");
		var requestFileId = nlapiSubmitFile(requestFile);
	}
	
	var headers = new Object();
	headers["Content-Type"] = "application/xml";
	
	var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
	
	nlapiLogExecution("debug","Response Code",cResp.getCode());
	nlapiLogExecution("debug","Response Body (XML)",cResp.getBody());
	
	var body = cResp.getBody();
	
	var xmlBody = nlapiStringToXML(body);
	
	//Check for errors and handle appropriately
	var errors = [];
	var errorNodes = nlapiSelectNodes(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='Notifications']");
	for(var x=0; x < errorNodes.length; x++)
	{
		var code = nlapiSelectValue(errorNodes[x],".//*[name()='Code']");
		var message = nlapiSelectValue(errorNodes[x],".//*[name()='Message']");
		var severity = nlapiSelectValue(errorNodes[x],".//*[name()='Severity']");
		
		nlapiLogExecution("error","Error Code: " + code,"Message: " + message);
		
		if(code=="0000")
			continue;
			
		if(severity=="WARNING")
			continue;
		
		errors.push({
			code : code,
			message : message
		});
	}
	
	if(errors.length == 0)
	{
		var partsNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='Label']/*[name()='Parts']")
		var imageXml = nlapiSelectValue(partsNode,".//*[name()='Image']");
		
		nlapiLogExecution("debug","Image XML",imageXml);
		
		var trackingNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='TrackingIds']");
		var trackingNumber = nlapiSelectValue(trackingNode,".//*[name()='TrackingNumber']");
		
		nlapiLogExecution("debug","Tracking Number",trackingNumber);
		
		var ifLabelFields = nlapiLookupField("itemfulfillment",shipment,["custbody_fedex_shipping_label","custbody_fedex_label_png"]);
		if(ifLabelFields.custbody_fedex_shipping_label!=null && ifLabelFields.custbody_fedex_shipping_label!="")
			nlapiDeleteFile(ifLabelFields.custbody_fedex_shipping_label);
		if(ifLabelFields.custbody_fedex_label_png!=null && ifLabelFields.custbody_fedex_label_png!="")
			nlapiDeleteFile(ifLabelFields.custbody_fedex_label_png);
		
		var labelfile = nlapiCreateFile(labelObj.tranid + "_shipping_label.png","PNGIMAGE",imageXml);
		labelfile.setFolder(folderID);
		labelfile.setIsOnline(true);
		var labelFileID = nlapiSubmitFile(labelfile);
		
		var labelFileObj = nlapiLoadFile(labelFileID);
		var labelImageUrl = labelFileObj.getURL();
		if(nlapiGetContext().getEnvironment()=="PRODUCTION")
			labelImageUrl = "https://system.na3.netsuite.com" + labelImageUrl.replace(/&/g,"&amp;");
		else
			labelImageUrl = "https://system.netsuite.com" + labelImageUrl.replace(/&/g,"&amp;");
			
		var pdfxml = "<?xml version='1.0'?><!DOCTYPE pdf PUBLIC '-//big.faceless.org//report' 'report-1.1.dtd'>";
		pdfxml+= "<pdf>";
			pdfxml+= "<body width='4.00in' height='6.00in' padding='0' margin='0.00in'>";
				pdfxml+= "<img src='" + labelImageUrl + "' dpi='200'/>";
			pdfxml+= "</body>";
		pdfxml+= "</pdf>";
		
		//Get last 4 digits of tracking #
		var last4 = trackingNumber.substring(trackingNumber.length - 4);
		
		var pdfFileObj = nlapiXMLToPDF(pdfxml);
			pdfFileObj.setName(labelObj.tranid + "_SL_" + last4 + ".pdf");
			pdfFileObj.setFolder(folderID);
			pdfFileObj.setIsOnline(true);
		var pdfFileId = nlapiSubmitFile(pdfFileObj);
		
		//Update item fulfillment with label
		nlapiSubmitField("itemfulfillment",shipment,["custbody_fedex_shipping_label","custbody_fedex_label_png","custbody_fedex_ws_tracking_number"],[pdfFileId,labelFileID,trackingNumber]);
		
		if(showLabel==true)
		{
			response.setContentType("PDF",labelObj.tranid + "_shipping_label.pdf","inline");
			response.write(pdfFileObj.getValue());	
		}
	}
	else
	{
		//Store errors back on IF record
		nlapiLogExecution("debug","Writing errors to custom field",JSON.stringify(errors));
		
		nlapiSubmitField("itemfulfillment",shipment,"custbody_fedex_error_message",JSON.stringify(errors));
		
		if(showLabel==true)
		{
			var responseHTML = "The following errors have occurred:<br/><br/>";
		
			for(var x=0; x < errors.length; x++)
			{
				responseHTML += errors[x].code + ": " + errors[x].message + "<br/><br/>";
			}
			
			response.write(responseHTML);
		}
	}
		
	
}
