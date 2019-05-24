function Drop_Ship_Fulfillment_Label(shipment,showLabel)
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
		saturday_delivery : false,
		key : "",
		password : "",
		accountnumber : "",
		meternumber : ""
	};
	
	var endPointType;
	var isDropShip = false;
	
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
	cols.push(new nlobjSearchColumn("custbody39"));
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
		
		if(results[0].getValue("custbody39")!=null && results[0].getValue("custbody39")!="")
			isDropShip = true;
		
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
		apiCols.push(new nlobjSearchColumn("custrecord_fedex_int_endpoint_type"));
		var apiResults = nlapiSearchRecord("customrecord_fedex_integration_key",null,apiFilters,apiCols);
		if(apiResults)
		{
			labelObj.key = apiResults[0].getValue("custrecord_fedex_int_key");
			labelObj.password = apiResults[0].getValue("custrecord_fedex_int_password");
			labelObj.accountnumber = apiResults[0].getValue("custrecord_fedex_int_account_number");
			labelObj.meternumber = apiResults[0].getValue("custrecord_fedex_int_meter_number");
			
			endPointType = 	apiResults[0].getValue("custrecord_fedex_int_endpoint_type");
		}
		else
		{
			//If no match found, use SF credentials
			var sfCredentials = nlapiLookupField("customrecord_fedex_integration_key","1",["custrecord_fedex_int_key","custrecord_fedex_int_password","custrecord_fedex_int_account_number","custrecord_fedex_int_meter_number","custrecord_fedex_int_endpoint_type"]);
			
			labelObj.key = sfCredentials.custrecord_fedex_int_key;
			labelObj.password = sfCredentials.custrecord_fedex_int_password;
			labelObj.accountnumber = sfCredentials.custrecord_fedex_int_account_number;
			labelObj.meternumber = sfCredentials.custrecord_fedex_int_meter_number;
			
			endPointType = 	sfCredentials.custrecord_fedex_int_endpoint_type;
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
			case "5668897":
			case "6":
				shipService = "FEDEX_2_DAY";
				break;
			case "2":
			case "1965157":
			case "5668896":
				shipService = "PRIORITY_OVERNIGHT";
				break;
			default:
				shipService = "PRIORITY_OVERNIGHT";
				break;
		}
		
		labelObj.service_type = shipService;
		
		var insurance = 0.00;
		var insurance_label = "";
		
		var insFilters = [];
		insFilters.push(new nlobjSearchFilter("internalid",null,"is",shipment));
		insFilters.push(new nlobjSearchFilter("cogs",null,"is","F"));
		insFilters.push(new nlobjSearchFilter("custcol_full_insurance_value","appliedtotransaction","isnotempty"));
		var insCols = [];
		insCols.push(new nlobjSearchColumn("amount","appliedtotransaction"));
		insCols.push(new nlobjSearchColumn("custcol_category","appliedtotransaction"));
		insCols.push(new nlobjSearchColumn("item","appliedtotransaction"));
		insCols.push(new nlobjSearchColumn("custbody_category1","appliedtotransaction"));
		insCols.push(new nlobjSearchColumn("custbody_category2","appliedtotransaction"));
		insCols.push(new nlobjSearchColumn("custbody_category3","appliedtotransaction"));
		insCols.push(new nlobjSearchColumn("custbody_category4","appliedtotransaction"));
		insCols.push(new nlobjSearchColumn("custbody_category5","appliedtotransaction"));
		insCols.push(new nlobjSearchColumn("custbody_category6","appliedtotransaction"));
		insCols.push(new nlobjSearchColumn("custcol_full_insurance_value","appliedtotransaction"));
		var insResults = nlapiSearchRecord("itemfulfillment",null,insFilters,insCols);
		if(insResults)
		{
			var antique = false;
			var service = false;
			var antiqueValue = 0.00;
				
			var cat1 = results[0].getValue("custbody_category1","appliedtotransaction");
			var cat2 = results[0].getValue("custbody_category2","appliedtotransaction");
			var cat3 = results[0].getValue("custbody_category3","appliedtotransaction");
			var cat4 = results[0].getValue("custbody_category4","appliedtotransaction");
			var cat5 = results[0].getValue("custbody_category5","appliedtotransaction");
			var cat6 = results[0].getValue("custbody_category6","appliedtotransaction");
			
			if(cat1=="24" || cat2=="24" || cat3=="24" || cat4=="24" || cat5=="24" || cat6=="24")
				antique = true;
			
			if(cat1=="12" || cat2=="12" || cat3=="12" || cat4=="12" || cat5=="12" || cat6=="12")
				service = true;
					
			for(var x=0; x < insResults.length; x++)
			{
				//Handle promo/gift items at $0 (Earrings, Pendants, Finished Jewelry, or Bracelets)
				var category = insResults[x].getValue("custcol_category","appliedtotransaction");
				var item = insResults[x].getText("item","appliedtotransaction");
				var itemId = insResults[x].getValue("item","appliedtotransaction");
				var amount = parseFloat(insResults[x].getValue("amount","appliedtotransaction"));
				nlapiLogExecution("debug","Amount AppliedToTransaction",amount);
				
				if(amount==0 && (category=="4" || category=="5" || category=="9" || category=="34"))
				{
					//Insurance value for these lines will be $0
					nlapiLogExecution("debug","Promo Item - Setting to $0 Insurance Value")
				}
				else if(item.substring(0,7)=="DNU BE1" || item.substring(0,7)=="DNU BE5" || item.substring(0,3)=="BE1" || item.substring(0,3)=="BE5" || itemId=="14375" || itemId=="487939" || itemId=="487937" || itemId=="487942" || itemId=="502780" || itemId=="537603" || itemId=="487938" || itemId=="487941" || itemId=="487940")
				{
					/*
					var subAmount = 0.00;
					for(var i=0; i < insResults.length; i++)
					{
						var sub_item = insResults[i].getValue("item","appliedtotransaction");
						var sub_category = nlapiLookupField("item",sub_item,"custitem20");
						
						if(i!=x && (sub_category==TYPE_LOOSE_DIAMOND || sub_category==TYPE_LOOSE_SAPPHIRE))
						{
							subAmount += parseFloat(insResults[i].getValue("amount","appliedtotransaction")) * 0.8;
						}
					}
					*/
					insurance += (parseFloat(amount) * .8);
					
				}
				else if(item.substring(0,7)=="DNU BE2" || item.substring(0,3)=="BE2" || itemId=="14385")
				{
					insurance += (parseFloat(amount) * .8);
				}
				else
				{
					if(antique && service)
					{
						nlapiLogExecution("debug","Is Both Antique/Service");
						
						if(nlapiLookupField("item",itemId,"custitem20")=="24")
						{
							antiqueValue = (parseFloat(amount) * .8);
							
							nlapiLogExecution("debug","Antique Value",antiqueValue);
							
							insurance += antiqueValue;
						}
						else if(itemId=="15381")
						{
							//insurance += antiqueValue;
						}
						else
						{
							insurance += (parseFloat(amount) * .8);
						}
					}
					else
					{
						//insurance += (parseFloat(amount) * .8);
						insurance += parseFloat(insResults[x].getValue("custcol_full_insurance_value","appliedtotransaction"));
					}
				}
			}
			
			nlapiLogExecution("debug","Insurance Value (Calculating)",insurance);
			
			//insurance = parseFloat(insResults[0].getValue("custcol_full_insurance_value","appliedtotransaction","sum"));
		}
		
		nlapiLogExecution("debug","Insurance Value (Order)",insurance);
		nlapiLogExecution("debug","Insurance Value (Multiplier)",insurance / 0.8);
		
		//If order is over 50k then only declare 50K
		if(isDropShip==true)
		{
			insurance_label = "RE2014" + parseInt(insurance / 0.80) + "200305";
		}
		else
		{
			if(shipService=="FEDEX_2_DAY")
			{
				if(insurance > 15000)
				{
					insurance = 15000;
					insurance_label = "RE2014" + parseInt(insurance - 15000) + "200305";
				}
				else
				{
					insurance_label = "BEF8956" + parseInt(insurance) + "X1560";
				}
			}
			else
			{
				if(insurance > 50000)
				{
					insurance = 50000;
					insurance_label = "RE2014" + parseInt(insurance - 50000) + "200305";
				}
				else
				{
					insurance_label = "BEF8956" + parseInt(insurance) + "X1560";
				}
			}
		}
		
		nlapiLogExecution("debug","Insurance Label",insurance_label);
		
		labelObj.insurance_value = insurance;
		labelObj.insurance_label = insurance_label;
	}
	
	if(nlapiGetContext().getEnvironment()=="PRODUCTION")
	{
		var templateID = "18619902"; //Old: 16756534
		var folderID = "8762529";
	}
	else
	{
		var templateID = "18619902";
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
	
	if(endPointType=="PRODUCTION")
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
			labelImageUrl = "https://system.netsuite.com" + labelImageUrl.replace(/&/g,"&amp;");
		else
			labelImageUrl = "https://system.sandbox.netsuite.com" + labelImageUrl.replace(/&/g,"&amp;");
			
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
