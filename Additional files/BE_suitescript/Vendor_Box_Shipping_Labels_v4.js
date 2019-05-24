var DATA_CENTER_URL = "";

function Vendor_Box_Shipping_Labels(type)
{
	if(type=="view")
	{
		try
		{
			var url = nlapiResolveURL("SUITELET","customscript_vendor_box_label","customdeploy_vendor_box_label");
			url += "&vendorbox=" + nlapiGetRecordId();
			
			form.addButton("custpage_label","Create Shipping Label","window.open('" + url + "','printLabelWin','height=800,width=600');");
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Print Label Button","Details: " + err.message);
		}
	}
}

function Vendor_Box_Shipping_Label(request,response)
{
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
		saturday_delivery : "",
		signature_required : true,
		key : "",
		password : "",
		accountnumber : "",
		meternumber : "",
		package_type : "FEDEX_BOX"
	};
	
	var location,to_location;
	var boxId = request.getParameter("vendorbox");
	
	var FEDEX_ENDPOINT_TYPE;
	
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",boxId));
	var cols = [];
	cols.push(new nlobjSearchColumn("custrecord_box_insurance_value"));
	cols.push(new nlobjSearchColumn("custrecord_box_country"));
	cols.push(new nlobjSearchColumn("custrecord_box_attention"));
	cols.push(new nlobjSearchColumn("custrecord_box_addressee"));
	cols.push(new nlobjSearchColumn("custrecord_box_phone"));
	cols.push(new nlobjSearchColumn("custrecord_box_address1"));
	cols.push(new nlobjSearchColumn("custrecord_box_address2"));
	cols.push(new nlobjSearchColumn("custrecord_box_city"));
	cols.push(new nlobjSearchColumn("custrecord_box_state"));
	cols.push(new nlobjSearchColumn("custrecord_box_zip"));
	cols.push(new nlobjSearchColumn("custrecord_box_from_location"));
	cols.push(new nlobjSearchColumn("custrecord_box_ship_date"));
	cols.push(new nlobjSearchColumn("custrecord_box_location"));
	cols.push(new nlobjSearchColumn("custrecord_box_shipping_method"));
	cols.push(new nlobjSearchColumn("custrecord_box_special_instructions"));
	var results = nlapiSearchRecord("customrecord_box_record",null,filters,cols);
	if(results)
	{
		location = results[0].getValue("custrecord_box_from_location");
		to_location = results[0].getValue("custrecord_box_location");
		var to_location_txt = results[0].getText("custrecord_box_location");
		
		//Get FedEx API information from custom record for that location
		var apiFilters = [];
		if(to_location==null || to_location=="" || to_location_txt.substring(0,14)=="BE Fulfillment")
			apiFilters.push(new nlobjSearchFilter("custrecord_fedex_integration_vendor_acct",null,"is","T"));
		else
			apiFilters.push(new nlobjSearchFilter("custrecord_fedex_int_location",null,"is",to_location));
		var apiCols = [];
		apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_account_number"));
		apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_meter_number"));
		apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_key"));
		apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_password"));
		apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_endpoint_type"));
		var apiResults = nlapiSearchRecord("customrecord_fedex_integration_key",null,apiFilters,apiCols);
		if(apiResults)
		{
			labelObj.key = apiResults[0].getValue("custrecord_fedex_int_key");
			labelObj.password = apiResults[0].getValue("custrecord_fedex_int_password");
			labelObj.accountnumber = apiResults[0].getValue("custrecord_fedex_int_account_number");
			labelObj.meternumber = apiResults[0].getValue("custrecord_fedex_int_meter_number");
			
			FEDEX_ENDPOINT_TYPE = apiResults[0].getValue("custrecord_fedex_int_endpoint_type");
		}
		else
		{
			//If no match found, use SF credentials
			var sfCredentials = nlapiLookupField("customrecord_fedex_integration_key","1",["custrecord_fedex_int_key","custrecord_fedex_int_password","custrecord_fedex_int_account_number","custrecord_fedex_int_meter_number"]);
			
			labelObj.key = sfCredentials.custrecord_fedex_int_key;
			labelObj.password = sfCredentials.custrecord_fedex_int_password;
			labelObj.accountnumber = sfCredentials.custrecord_fedex_int_account_number;
			labelObj.meternumber = sfCredentials.custrecord_fedex_int_meter_number;
			
			FEDEX_ENDPOINT_TYPE = "PRODUCTION";
		}
		
		var now = nlapiStringToDate(results[0].getValue("custrecord_box_ship_date"));
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
		switch(results[0].getValue("custrecord_box_shipping_method"))
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
			case "5668899":
				shipService = "FEDEX_GROUND";
				labelObj.package_type = "YOUR_PACKAGING";
				break;
			case "5668900":
				shipService = "FIRST_OVERNIGHT";
				break;
			case "5668898":
				shipService = "FEDEX_EXPRESS_SAVER";
				labelObj.package_type = "YOUR_PACKAGING";
				break;
			default:
				shipService = "PRIORITY_OVERNIGHT";
				break;
		}
		
		labelObj.service_type = shipService;
		
		var insurance = results[0].getValue("custrecord_box_insurance_value");
		var insurance_label = results[0].getValue("custrecord_box_insurance_value");
		nlapiLogExecution("debug","Insurance Value",insurance);
		
		//If order is over 50k then only declare 50K
		if(insurance > 50000 && insurance <= 120000)
		{
			insurance_label =  insurance - 50000;
			insurance = 50000;
		}
		else if(insurance > 120000)
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
		
		var insurance_label = "RE2014" + parseInt(insurance_label) + "200305";
		
		labelObj.insurance_value = insurance;
		labelObj.insurance_label = insurance_label;
		
		nlapiSubmitField("customrecord_box_record",boxId,"custrecord_box_declared_value",insurance);
		
		if(insurance < 50000)
		{
			labelObj.insurance_label = "";
		}
		
		labelObj.ship_addressee = results[0].getValue("custrecord_box_addressee");
		labelObj.ship_attention = results[0].getValue("custrecord_box_attention");
		labelObj.ship_address1 = results[0].getValue("custrecord_box_address1");
		labelObj.ship_address2 = results[0].getValue("custrecord_box_address2");
		labelObj.ship_city = results[0].getValue("custrecord_box_city");
		//labelObj.ship_state = stateAbbrev(results[0].getText("custrecord_box_state"));
		//labelObj.ship_state = results[0].getValue("custrecord_box_state");
		labelObj.ship_state = stateAbbrev(results[0].getValue("custrecord_box_state"));
		//if(labelObj.ship_state=="New York")
		//	labelObj.ship_state = "NY";
		labelObj.ship_zipcode = results[0].getValue("custrecord_box_zip");
		labelObj.ship_country = results[0].getValue("custrecord_box_country");
		if(labelObj.ship_country=="230")
			labelObj.ship_country = "US";
		labelObj.ship_phone = results[0].getValue("custrecord_box_phone");
		
		labelObj.tranid = results[0].getId();
		
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
		
		if(results[0].getValue("custrecord_box_special_instructions")!=null && results[0].getValue("custrecord_box_special_instructions")!="")
		{
			var specInstruc = results[0].getText("custrecord_box_special_instructions");
			nlapiLogExecution("debug","Special Instructions",specInstruc);
			
			if(specInstruc.indexOf("Saturday Delivery")!=-1)
				labelObj.saturday_delivery = true;
			if(specInstruc.indexOf("Direct Signature NOT Required")!=-1)
				labelObj.signature_required = "";
		}
	}
	
	if(nlapiGetContext().getEnvironment()=="PRODUCTION")
	{
		var templateID = "20357148"; //Old: 16756534
		var folderID = "8762529";
	}
	else
	{
		var templateID = "20357148";
		var folderID = "8762529";
	}
	
	var templateFile = nlapiLoadFile(templateID);
	var template = templateFile.getValue();
	var xmlTemp = Handlebars.compile(template);
	
	var soap = xmlTemp(labelObj);
	
	//Create Request Log file
	var requestFile = nlapiCreateFile(labelObj.tranid + "_Request.txt","PLAINTEXT",soap);
	requestFile.setFolder("8762529");
	var requestFileId = nlapiSubmitFile(requestFile);
	
	var headers = new Object();
	headers["Content-Type"] = "application/xml";
	
	if(FEDEX_ENDPOINT_TYPE=="PRODUCTION")
		var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
	else
		var cResp = nlapiRequestURL("https://wsbeta.fedex.com:443/web-services",soap,headers);
	
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
	
	getDataCenterURL();
	
	if(errors.length == 0)
	{
		var partsNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='Label']/*[name()='Parts']")
		var imageXml = nlapiSelectValue(partsNode,".//*[name()='Image']");
		
		nlapiLogExecution("debug","Image XML",imageXml);
		
		var trackingNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='TrackingIds']");
		var trackingNumber = nlapiSelectValue(trackingNode,".//*[name()='TrackingNumber']");
		
		nlapiLogExecution("debug","Tracking Number",trackingNumber);
		
		var boxLabelFields = nlapiLookupField("customrecord_box_record",boxId,["custrecord_box_shipping_label","custrecord_box_shipping_label_png"]);
		if(boxLabelFields.custrecord_box_shipping_label!=null && boxLabelFields.custrecord_box_shipping_label!="")
			nlapiDeleteFile(boxLabelFields.custrecord_box_shipping_label);
		if(boxLabelFields.custrecord_box_shipping_label_png!=null && boxLabelFields.custrecord_box_shipping_label_png!="")
			nlapiDeleteFile(boxLabelFields.custrecord_box_shipping_label_png);
		
		var labelfile = nlapiCreateFile(boxId + "_shipping_label.png","PNGIMAGE",imageXml);
		labelfile.setFolder(folderID);
		labelfile.setIsOnline(true);
		var labelFileID = nlapiSubmitFile(labelfile);
		
		var labelFileObj = nlapiLoadFile(labelFileID);
		var labelImageUrl = labelFileObj.getURL();
		if(nlapiGetContext().getEnvironment()=="PRODUCTION")
			labelImageUrl = DATA_CENTER_URL + labelImageUrl.replace(/&/g,"&amp;");
		else
			labelImageUrl = DATA_CENTER_URL + labelImageUrl.replace(/&/g,"&amp;");
			
		var pdfxml = "<?xml version='1.0'?><!DOCTYPE pdf PUBLIC '-//big.faceless.org//report' 'report-1.1.dtd'>";
		pdfxml+= "<pdf>";
			pdfxml+= "<body width='4.00in' height='6.00in' padding='0' margin='0.00in'>";
				pdfxml+= "<img src='" + labelImageUrl + "' dpi='200'/>";
			pdfxml+= "</body>";
		pdfxml+= "</pdf>";
		
		//Get last 4 digits of tracking #
		var last4 = trackingNumber.substring(trackingNumber.length - 4);
		
		var pdfFileObj = nlapiXMLToPDF(pdfxml);
			pdfFileObj.setName(boxId + "_SL_" + last4 + ".pdf");
			pdfFileObj.setFolder(folderID);
			pdfFileObj.setIsOnline(true);
		var pdfFileId = nlapiSubmitFile(pdfFileObj);
		
		//Update item fulfillment with label
		nlapiSubmitField("customrecord_box_record",boxId,["custrecord_box_shipping_label","custrecord_box_shipping_label_png","custrecord_box_tracking_id","custrecord_box_fedex_error_message"],[pdfFileId,labelFileID,trackingNumber,""]);
		
		response.setContentType("PDF",boxId + "_shipping_label.pdf","inline");
		response.write(pdfFileObj.getValue());	
	}
	else
	{
		//Store errors back on IF record
		nlapiLogExecution("debug","Writing errors to custom field",JSON.stringify(errors));
		
		nlapiSubmitField("customrecord_box_record",boxId,"custrecord_box_fedex_error_message",JSON.stringify(errors));

		var responseHTML = "The following errors have occurred:<br/><br/>";
	
		for(var x=0; x < errors.length; x++)
		{
			responseHTML += errors[x].code + ": " + errors[x].message + "<br/><br/>";
		}
		
		response.write(responseHTML);
	}
}

function stateAbbrev(stateStr)
{
	nlapiLogExecution("debug","State String",stateStr);
	
	var statesList = [
		{text:'Alabama',id:'AL'},
		{text:'Alaska',id:'AK'},
		{text:'Arizona',id:'AZ'},
		{text:'Arkansas',id:'AR'},
		{text:'Armed Forces Americas',id:'AA'},
		{text:'Armed Forces Europe',id:'AE'},
		{text:'Armed Forces Pacific',id:'AP'},
		{text:'California',id:'CA'},
		{text:'Colorado',id:'CO'},
		{text:'Connecticut',id:'CT'},
		{text:'Delaware',id:'DE'},
		{text:'District of Columbia',id:'DC'},
		{text:'Florida',id:'FL'},
		{text:'Georgia',id:'GA'},
		{text:'Hawaii',id:'HI'},
		{text:'Idaho',id:'ID'},
		{text:'Illinois',id:'IL'},
		{text:'Indiana',id:'IN'},
		{text:'Iowa',id:'IA'},
		{text:'Kansas',id:'KS'},
		{text:'Kentucky',id:'KY'},
		{text:'Louisiana',id:'LA'},
		{text:'Maine',id:'ME'},
		{text:'Maryland',id:'MD'},
		{text:'Massachusetts',id:'MA'},
		{text:'Michigan',id:'MI'},
		{text:'Minnesota',id:'MN'},
		{text:'Mississippi',id:'MS'},
		{text:'Missouri',id:'MO'},
		{text:'Montana',id:'MT'},
		{text:'Nebraska',id:'NE'},
		{text:'Nevada',id:'NV'},
		{text:'New Hampshire',id:'NH'},
		{text:'New Jersey',id:'NJ'},
		{text:'New Mexico',id:'NM'},
		{text:'New York',id:'NY'},
		{text:'North Carolina',id:'NC'},
		{text:'North Dakota',id:'ND'},
		{text:'Ohio',id:'OH'},
		{text:'Oklahoma',id:'OK'},
		{text:'Oregon',id:'OR'},
		{text:'Pennsylvania',id:'PA'},
		{text:'Puerto Rico',id:'PR'},
		{text:'Rhode Island',id:'RI'},
		{text:'South Carolina',id:'SC'},
		{text:'South Dakota',id:'SD'},
		{text:'Tennessee',id:'TN'},
		{text:'Texas',id:'TX'},
		{text:'Utah',id:'UT'},
		{text:'Vermont',id:'VT'},
		{text:'Virginia',id:'VA'},
		{text:'Washington',id:'WA'},
		{text:'West Virginia',id:'WV'},
		{text:'Wisconsin',id:'WI'},
		{text:'Wyoming',id:'WY'}
	];
	
	var abbrev = "";
	for(var x=0; x < statesList.length; x++)
	{
		if(statesList[x].text == stateStr)
		{
			abbrev = statesList[x].id;
			break;
		}
	}
	
	if(abbrev=="")
		abbrev = stateStr;
	
	nlapiLogExecution("debug","Abbreviation",abbrev);
	
	return abbrev;
}

function getDataCenterURL()
{
	var environment = nlapiGetContext().getEnvironment();
	
	var filters = [];
	filters.push(new nlobjSearchFilter("name",null,"is",environment));
	var cols = [];
	cols.push(new nlobjSearchColumn("custrecord_data_center_url"));
	var results = nlapiSearchRecord("customrecord_data_center_url",null,filters,cols);
	if(results)
		DATA_CENTER_URL = results[0].getValue("custrecord_data_center_url");
}
