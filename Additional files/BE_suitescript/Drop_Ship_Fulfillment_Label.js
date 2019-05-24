function Drop_Ship_Fulfillment_Label(shipment,showLabel)
{	
	var labelObj = {
		ship_timestamp : "",
		service_type : "PRIORITY_OVERNIGHT",
		insurance_value : "",
		insurance_label : "",
		tranid : "",
		ship_addressee : "",
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
		saturday_delivery : false
	};
	
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",shipment));
	filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
	var cols = [];
	cols.push(new nlobjSearchColumn("custbody_full_insurance_amount","createdfrom"));
	cols.push(new nlobjSearchColumn("shipaddressee"));
	cols.push(new nlobjSearchColumn("shipaddress1"));
	cols.push(new nlobjSearchColumn("shipaddress2"));
	cols.push(new nlobjSearchColumn("shipcity"));
	cols.push(new nlobjSearchColumn("shipstate"));
	cols.push(new nlobjSearchColumn("shipzip"));
	cols.push(new nlobjSearchColumn("shipcountry"));
	cols.push(new nlobjSearchColumn("shipmethod"));
	cols.push(new nlobjSearchColumn("location"));
	cols.push(new nlobjSearchColumn("tranid","createdfrom"));
	cols.push(new nlobjSearchColumn("custbody8","createdfrom")); //Contact Phone Number
	cols.push(new nlobjSearchColumn("custbody6","createdfrom")); //Delivery Date
	cols.push(new nlobjSearchColumn("custbody53","createdfrom")); //Is Pick Up
	cols.push(new nlobjSearchColumn("custbody_pickup_location","createdfrom")); //Pick-up Location
	cols.push(new nlobjSearchColumn("custbody194","createdfrom")); //Delivery Instructions
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
		
		if(results[0].getValue("custbody53","createdfrom")!="T")
		{
			labelObj.ship_addressee = results[0].getValue("shipaddressee");
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
			
			//Convert to Location record ID
			var locationID = null;
			switch(puLocation)
			{
				case "1": //SF
					locationID = "2";
					break;
				case "2": //LA
					locationID = "10";
					break;
				case "3": //BST
					locationID = "14";
					break;
				case "4": //CH
					locationID = "18";
					break;
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
				shipService = "FEDEX_2_DAY";
				break;
			case "2":
			case "1965157":
				shipService = "PRIORITY_OVERNIGHT";
				break;
			default:
				shipService = "PRIORITY_OVERNIGHT";
				break;
		}
		
		labelObj.service_type = shipService;
		
		var insurance = results[0].getValue("custbody_full_insurance_amount","createdfrom") / 0.8;
		var insurance_label = "RE2014" + parseInt(insurance) + "200305";
		
		labelObj.insurance_value = insurance;
		labelObj.insurance_label = insurance_label;
	}
	
	if(nlapiGetContext().getEnvironment()=="PRODUCTION")
	{
		var templateID = "16756534";
		var folderID = "8762529";
	}
	else
	{
		var templateID = "15613987";
		var folderID = "407735";
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
		requestFile.setFolder("7975542");
		var requestFileId = nlapiSubmitFile(requestFile);
	}
	
	var headers = new Object();
	headers["Content-Type"] = "application/xml";
	
	if(nlapiGetContext().getEnvironment()=="PRODUCTION")
		var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
	else
		var cResp = nlapiRequestURL("https://wsbeta.fedex.com:443/web-services",soap,headers);
	
	nlapiLogExecution("debug","Response Code",cResp.getCode());
	nlapiLogExecution("debug","Response Body (XML)",cResp.getBody());
	
	var body = cResp.getBody();
	
	var xmlBody = nlapiStringToXML(body);
		
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
		labelImageUrl = "https://system.netsuite.com" + labelImageUrl.replace(/&/g,"&amp;");
	else
		labelImageUrl = "https://system.sandbox.netsuite.com" + labelImageUrl.replace(/&/g,"&amp;");
		
	var pdfxml = "<?xml version='1.0'?><!DOCTYPE pdf PUBLIC '-//big.faceless.org//report' 'report-1.1.dtd'>";
	pdfxml+= "<pdf>";
		pdfxml+= "<body width='4.00in' height='6.00in' padding='0' margin='0.00in'>";
			pdfxml+= "<img src='" + labelImageUrl + "' dpi='200'/>";
		pdfxml+= "</body>";
	pdfxml+= "</pdf>";
	
	var pdfFileObj = nlapiXMLToPDF(pdfxml);
		pdfFileObj.setName(labelObj.tranid + "_shipping_label.pdf");
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
