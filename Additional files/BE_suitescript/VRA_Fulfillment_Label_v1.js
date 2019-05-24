function VRA_Fulfillment_Label(shipment,showLabel)
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
		ship_from_attention : "",
		ship_from_address1 : "",
		ship_from_address2 : "",
		ship_from_city : "",
		ship_from_state : "",
		ship_from_zipcode : "",
		ship_from_country : "",
		ship_from_phone : "",
		key : "",
		password : "",
		accountnumber : "",
		meternumber : "",
		eei : "",
		ein : "203413075",
		currency : "",
		terms_of_sale : "DDU",
		purpose_of_shipment : "NOT_SOLD"
	};
	
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",shipment));
	filters.push(new nlobjSearchFilter("cogs",null,"is","F"));
	filters.push(new nlobjSearchFilter("taxline",null,"is","F"));
	filters.push(new nlobjSearchFilter("shipping",null,"is","F"));
	filters.push(new nlobjSearchFilter("item",null,"noneof","@NONE@"));
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
	cols.push(new nlobjSearchColumn("entity"));
	cols.push(new nlobjSearchColumn("item"));
	cols.push(new nlobjSearchColumn("quantity"));
	cols.push(new nlobjSearchColumn("trandate"));
	cols.push(new nlobjSearchColumn("tranid"));
	cols.push(new nlobjSearchColumn("custbody_aes_eei"));
	cols.push(new nlobjSearchColumn("currency"));
	cols.push(new nlobjSearchColumn("quantityuom"));
	cols.push(new nlobjSearchColumn("memo","appliedtotransaction"));
	cols.push(new nlobjSearchColumn("phone","vendor"));
	cols.push(new nlobjSearchColumn("tranid","createdfrom"));
	cols.push(new nlobjSearchColumn("custbody8","createdfrom")); //Contact Phone Number
	cols.push(new nlobjSearchColumn("custbody6","createdfrom")); //Delivery Date
	cols.push(new nlobjSearchColumn("custbody53","createdfrom")); //Is Pick Up
	cols.push(new nlobjSearchColumn("custbody_pickup_location","createdfrom")); //Pick-up Location
	cols.push(new nlobjSearchColumn("custbody194","createdfrom")); //Delivery Instructions
	cols.push(new nlobjSearchColumn("cost","item")); //Purchase Price/Cost
	cols.push(new nlobjSearchColumn("custitem20","item")); //Item Category
	cols.push(new nlobjSearchColumn("custitem27","item")); //Carat
	cols.push(new nlobjSearchColumn("custitem198","item")); //Unique Diamond
	var results = nlapiSearchRecord("itemfulfillment",null,filters,cols);
	if(results)
	{
		switch(results[0].getValue("currency"))
		{
			case "1":
				labelObj.currency = "USD";
				break;
			case "3":
				labelObj.currency = "CAD";
				break;
			case "5":
				labelObj.currency = "AUD";
				break;
			case "2":
				labelObj.currency = "UKL";
				break;
		}
		
		nlapiLogExecution("debug","Currency",labelObj.currency);
		
		var vendorName = results[0].getText("entity");
		
		//Calculate Total Purchase Price/Cost
		var totalCost = 0.00;
		for(var x=0; x < results.length; x++)
		{
			if(results[x].getValue("cost","item")!=null && results[x].getValue("cost","item")!="")
			{
				totalCost += (-1 * (parseFloat(results[x].getValue("cost","item")) * parseFloat(results[x].getValue("quantity"))));
			}
		}
		nlapiLogExecution("debug","Total Purchase Price",totalCost);
		
		labelObj.tranid = results[0].getValue("tranid","createdfrom");
		
		var location = results[0].getValue("location");
		nlapiLogExecution("debug","Location",location);
		
		var shipCountry = results[0].getValue("shipcountry");
		
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
			labelObj.ship_from_addressee = shipFromResults[0].getValue("addressee","address");
			labelObj.ship_from_attention = shipFromResults[0].getValue("attention","address");
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
		apiFilters.push(new nlobjSearchFilter("internalid",null,"is","8")); //Default to empty location config record
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
		
		labelObj.ship_addressee = results[0].getValue("shipaddressee");
		labelObj.ship_attention = results[0].getValue("shippingattention");
		labelObj.ship_address1 = results[0].getValue("shipaddress1");
		labelObj.ship_address2 = results[0].getValue("shipaddress2");
		labelObj.ship_city = results[0].getValue("shipcity");
		labelObj.ship_state = results[0].getValue("shipstate");
		labelObj.ship_zipcode = results[0].getValue("shipzip");
		labelObj.ship_country = results[0].getValue("shipcountry");
		labelObj.ship_phone = results[0].getValue("phone","vendor");
		
		if(shipCountry!="US")
		{
			labelObj.ship_from_attention = "Brilliant Earth";
		}	
		
		var shipDate = nlapiStringToDate(results[0].getValue("trandate"));
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
		nlapiLogExecution("debug","Shipping Method",results[0].getValue("shipmethod"));
		
		switch(results[0].getValue("shipmethod"))
		{
			case "5668897":
				shipService = "FEDEX_2_DAY";
				break;
			case "5668900":
				shipService = "FIRST_OVERNIGHT";
				break;
			case "5668896":
				shipService = "PRIORITY_OVERNIGHT";
				break;
			case "5668896":
				shipService = "FEDEX_GROUND"; //GROUND
				break;
			case "5668896":
				shipService = "FEDEX_EXPRESS_SAVER"; //SAVER
				break;
			default:
				shipService = "PRIORITY_OVERNIGHT";
				break;
		}
		
		if(shipCountry!="US")
			shipService = "INTERNATIONAL_PRIORITY";
		
		labelObj.service_type = shipService;
		
		//Declared Value
		var insurance, insurance_label;
		
		nlapiLogExecution("debug","Shipping Country",shipCountry);
		
		var scilFilters = []
		//scilFilters.push(new nlobjSearchFilter("custrecord_insurance_limit_country",null,"is",shipCountry));
		scilFilters.push(new nlobjSearchFilter("formulatext",null,"is",results[0].getText("shipcountry")).setFormula("{custrecord_insurance_limit_country}"));
		scilFilters.push(new nlobjSearchFilter("custrecord_shipping_method",null,"anyof",results[0].getValue("shipmethod")));
		var scilCols = [];
		scilCols.push(new nlobjSearchColumn("custrecord_fedex_insurance_limit"));
		scilCols.push(new nlobjSearchColumn("custrecord_parcel_pro_insurance_limit"));
		var scilResults = nlapiSearchRecord("customrecord_shipping_country_insurance",null,scilFilters,scilCols);
		if(scilResults)
		{
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
				insurance_label = "RE2014" + parseInt(totalCost - fedexLimit) + "200305";
			}
			else
			{
				insurance = totalCost;
				insurance_label = "BEF8956" + parseInt(totalCost) + "X1560";
			}
		}
		
		nlapiLogExecution("debug","Insurance Value",insurance);
		nlapiLogExecution("debug","Insurance Label",insurance_label);
		
		labelObj.insurance_value = insurance;
		labelObj.insurance_label = insurance_label;
		labelObj.customs_value = totalCost;
		
		
		if(shipCountry!="US")
		{
			nlapiLogExecution("debug","Total Cost",totalCost);
			
			if(shipCountry!="CA" && totalCost > 2500)
				labelObj.eei = results[0].getValue("custbody_aes_eei");
			else
				labelObj.eei = "";
			
			//Check if country does not allow ETD
			nlapiLogExecution("debug","Ship Country",results[0].getValue("shipcountry"));
			switch(results[0].getValue("shipcountry"))
			{
				
				case "AE":
				case "AN":
				case "AO":
				case "BD":
				case "BN":
				case "BS":
				case "BQ":
				case "CW":
				case "DJ":
				case "DO":
				case "EG":
				case "GH":
				case "GP":
				case "GT":
				case "HN":
				case "JO":
				case "KE":
				case "KH":
				case "KN":
				case "KW":
				case "KY":
				case "LA":
				case "LC":
				case "LS":
				case "MF":
				case "MG":
				case "MS":
				case "MT":
				case "OM":
				case "PA":
				case "SA":
				case "SV":
				case "VG":
				case "SX":
				case "TC":
				case "TL":
				case "TT":
				case "VG":
				case "VI":
					labelObj.allowETD = false;
					break;
				default:
					labelObj.allowETD = true;
					break;
			}
			
			var itemData = [];
			
			for(var x=0; x < results.length; x++)
			{
				var category = results[x].getValue("custitem20","item");
				var carat = results[x].getValue("custitem27","item");
				var uniqueDiamond = results[x].getValue("custitem198","item");
				
				nlapiLogExecution("debug","Item Category",category);
				nlapiLogExecution("debug","Item Carat",carat);
				nlapiLogExecution("debug","Item Unique Diamond",uniqueDiamond);
				
				if(carat!=null && carat!="")
					carat = parseFloat(carat);
				
				var item = new Object();
				
				var itemCost = 0.00;
				
				if(results[x].getValue("cost","item")!=null && results[x].getValue("cost","item")!="")
				{
					itemCost = (-1 * (parseFloat(results[x].getValue("cost","item")) * parseFloat(results[x].getValue("quantity"))));
				}
				
				if((category=="7" || uniqueDiamond=="T") && carat <= .50)
				{
					//Carat <= 0.50 AND Category = Loose Diamond or Loose Colored Gemstone AND Unique Diamond = T
					nlapiLogExecution("debug","Carat <= 0.50");
					
					item.description = "Non industrial polished diamond weighing not over 0.5 carat each";
					item.code = "7102.39.0010";
					item.weight = "0.1";
					item.uom = "CAR";
					item.com = "US";
					item.qty = carat;
					item.rate = itemCost / carat;
					item.amount = itemCost;
					item.currency = labelObj.currency;
				}
				else if((category=="7" || uniqueDiamond=="T") && carat > .50)
				{
					//Carat > 0.50 AND Category = Loose Diamond or Loose Colored Gemstone AND Unique Diamond = T
					nlapiLogExecution("debug","Carat > 0.50");
					
					item.description = "Non industrial polished diamond weighing over 0.5 carat each";
					item.code = "7102.39.0050";
					item.weight = "0.1";
					item.uom = "CAR";
					item.com = "US";
					item.qty = carat;
					item.rate = itemCost / carat;
					item.amount = itemCost;
					item.currency = labelObj.currency;
				}
				else if(category=="8")
				{
					//Category = Loose Sapphire
					item.description = "Precious stones and semiprecious stones - Sapphires";
					item.code = "7103.91.0020";
					item.weight = "0.1";
					item.uom = "PCS";
					item.com = "US";
					item.qty = Math.abs(results[x].getValue("quantityuom"));
					item.amount = itemCost;
					item.rate = itemCost / Math.abs(results[x].getValue("quantityuom"));
					item.currency = labelObj.currency;
				}
				else if(category=="20")
				{
					//Category = Loose Emerald
					item.description = "Precious stones and semiprecious stones - Emeralds";
					item.code = "7103.91.0030";
					item.weight = "0.1";
					item.uom = "PCS";
					item.com = "US";
					item.qty = Math.abs(results[x].getValue("quantityuom"));
					item.amount = itemCost;
					item.rate = itemCost / Math.abs(results[x].getValue("quantityuom"));
					item.currency = labelObj.currency;
				}
				else if(category=="18")
				{
					//Category = Loose Colored Gemstone
					item.description = "MOISSANITE LOOSE STONES";
					item.code = "7104.90.1000";
					item.weight = "0.1";
					item.uom = "PCS";
					item.com = "US";
					item.qty = Math.abs(results[x].getValue("quantityuom"));
					item.amount = itemCost;
					item.rate = itemCost / Math.abs(results[x].getValue("quantityuom"));
					item.currency = labelObj.currency;
				}
				else if(category=="21")
				{
					//Category = Loose Pearls
					item.description = "RETURNED GOODS-NATURAL PEARLS";
					item.code = "7101.21.0000";
					item.weight = "0.1";
					item.uom = "PCS";
					item.com = "US";
					item.qty = Math.abs(results[x].getValue("quantityuom"));
					item.amount = itemCost;
					item.rate = itemCost / Math.abs(results[x].getValue("quantityuom"));
					item.currency = labelObj.currency;
				}
				else if(category=="14")
				{
					//Category = Loose Ruby
					item.description = "Precious stones and semiprecious stones - Rubies";
					item.code = "7103.91.0010";
					item.weight = "0.1";
					item.uom = "PCS";
					item.com = "US";
					item.qty = Math.abs(results[x].getValue("quantityuom"));
					item.amount = itemCost;
					item.rate = itemCost / Math.abs(results[x].getValue("quantityuom"));
					item.currency = labelObj.currency;
				}
				else
				{
					//All other items
					nlapiLogExecution("debug","Reading as Other Item...");
					
					item.description = results[x].getValue("memo","appliedtotransaction");
					item.code = "7113.19.0000";
					item.weight = "0.1";
					item.uom = "PCS";
					item.com = "US";
					item.qty = Math.abs(results[x].getValue("quantityuom"));
					item.amount = itemCost;
					item.rate = itemCost / Math.abs(results[x].getValue("quantityuom"));
					item.currency = labelObj.currency;
				}
				
				itemData.push(item);
			}
			
			labelObj.items = itemData;
			nlapiLogExecution("debug","Item JSON",JSON.stringify(itemData));
		}
	}
	
	var folderID = "8762529";
	
	if(shipCountry=="US")
	{
		if(nlapiGetContext().getEnvironment()=="PRODUCTION")
			var templateID = "25723083";
		else
           var templateID = "25723083";
       //var templateID = "22303322"; //old for Sandbox
	}
	else
	{
		if(nlapiGetContext().getEnvironment()=="PRODUCTION")
			var templateID = "25723082";
		else
          var templateID = "25723082";
		//var templateID = "22327396"; ////old for Sandbox
	}
	
	
	var templateFile = nlapiLoadFile(templateID);
	var template = templateFile.getValue();
	var xmlTemp = Handlebars.compile(template);
	
	var soap = xmlTemp(labelObj);
	
	//if(nlapiGetContext().getEnvironment()=="SANDBOX")
	//{
		//Create Request Log file
		var requestFile = nlapiCreateFile(labelObj.tranid + "_Request.txt","PLAINTEXT",soap);
		requestFile.setFolder("8771896");
		var requestFileId = nlapiSubmitFile(requestFile);
	//}
	
	var headers = new Object();
	headers["Content-Type"] = "application/xml";
	
	var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
	
	nlapiLogExecution("debug","Response Code",cResp.getCode());
	nlapiLogExecution("debug","Response Body (XML)",cResp.getBody());
	
	var body = cResp.getBody();
	
	if(nlapiGetContext().getEnvironment()=="SANDBOX")
	{
		//Create Request Log file
		var responseFile = nlapiCreateFile(labelObj.tranid + "_Response.txt","PLAINTEXT",body);
		responseFile.setFolder("8771896");
		var responseFileId = nlapiSubmitFile(responseFile);
	}
	
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
	
	if(shipCountry=="US")
	{
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
			
			//Get last 4 digits of tracking #
			var last4 = trackingNumber.substring(trackingNumber.length - 4);
			
			var fileName = vendorName.substring(0,5) + "_" + labelObj.tranid + "_" + "_" + last4;
			
			var labelfile = nlapiCreateFile(fileName + ".png","PNGIMAGE",imageXml);
			labelfile.setFolder(folderID);
			labelfile.setIsOnline(true);
			var labelFileID = nlapiSubmitFile(labelfile);
			
			var labelFileObj = nlapiLoadFile(labelFileID);
			var labelImageUrl = labelFileObj.getURL();
			if(nlapiGetContext().getEnvironment()=="PRODUCTION")
				labelImageUrl = labelImageUrl.replace(/&/g,"&amp;");
			else
				labelImageUrl = labelImageUrl.replace(/&/g,"&amp;");
				
			var pdfxml = "<?xml version='1.0'?><!DOCTYPE pdf PUBLIC '-//big.faceless.org//report' 'report-1.1.dtd'>";
			pdfxml+= "<pdf>";
				pdfxml+= "<body width='4.00in' height='6.00in' padding='0' margin='0.00in'>";
					pdfxml+= "<img src='" + labelImageUrl + "' dpi='200'/>";
				pdfxml+= "</body>";
			pdfxml+= "</pdf>";
			
			var pdfFileObj = nlapiXMLToPDF(pdfxml);
				pdfFileObj.setName(fileName + ".pdf");
				pdfFileObj.setFolder(folderID);
				pdfFileObj.setIsOnline(true);
			var pdfFileId = nlapiSubmitFile(pdfFileObj);
			
			//Update item fulfillment with label
			nlapiSubmitField("itemfulfillment",shipment,["custbody_fedex_shipping_label","custbody_fedex_label_png","custbody_fedex_ws_tracking_number","custbody69"],[pdfFileId,labelFileID,trackingNumber,trackingNumber]);
			
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
	else
	{
		if(errors.length == 0)
		{
			var partsNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='Label']/*[name()='Parts']")
			var imageXml = nlapiSelectValue(partsNode,".//*[name()='Image']");
			
			nlapiLogExecution("debug","Image XML",imageXml);
			
			var partsNode2 = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='ShipmentDocuments']/*[name()='Parts']")
			var commercialInvoiceXml = nlapiSelectValue(partsNode2,".//*[name()='Image']");
		
			nlapiLogExecution("debug","Commercial Invoice XML",commercialInvoiceXml);
			
			var trackingNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='TrackingIds']");
			var trackingNumber = nlapiSelectValue(trackingNode,".//*[name()='TrackingNumber']");
			
			nlapiLogExecution("debug","Tracking Number",trackingNumber);
			
			var image2xml = null;
			var ciPNG = null;
			
			try
			{
				var testNode = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='PackageDocuments']");
				var labelType = nlapiSelectValue(testNode,".//*[name()='Type']");
				if(labelType=="AUXILIARY_LABEL")
				{
					var partsNode3 = nlapiSelectNode(xmlBody,"//SOAP-ENV:Envelope/SOAP-ENV:Body/*[name()='ProcessShipmentReply']/*[name()='CompletedShipmentDetail']/*[name()='CompletedPackageDetails']/*[name()='PackageDocuments']/*[name()='Parts']")
					if(partsNode3!=null && partsNode3!='')
					{
						image2xml = nlapiSelectValue(partsNode3,".//*[name()='Image']");
						nlapiLogExecution("debug","Image XML (2)",imageXml2);	
					}
				}
			}
			catch(e1)
			{
				nlapiLogExecution("error","Error Handling Label #2","Details: " + e1.message);
			}
			
			var ifLabelFields = nlapiLookupField("itemfulfillment",shipment,["custbody_fedex_shipping_label","custbody_commercial_invoice","custbody_fedex_label_png","custbody_fedex_label_png_2","custbody_fedex_label_png_3"]);
			if(ifLabelFields.custbody_commercial_invoice!=null && ifLabelFields.custbody_commercial_invoice!="")
				nlapiDeleteFile(ifLabelFields.custbody_commercial_invoice);
			if(ifLabelFields.custbody_fedex_shipping_label!=null && ifLabelFields.custbody_fedex_shipping_label!="")
				nlapiDeleteFile(ifLabelFields.custbody_fedex_shipping_label);
			if(ifLabelFields.custbody_fedex_label_png!=null && ifLabelFields.custbody_fedex_label_png!="")
				nlapiDeleteFile(ifLabelFields.custbody_fedex_label_png);
			if(ifLabelFields.custbody_fedex_label_png_2!=null && ifLabelFields.custbody_fedex_label_png_2!="")
				nlapiDeleteFile(ifLabelFields.custbody_fedex_label_png_2);
			if(ifLabelFields.custbody_fedex_label_png_3!=null && ifLabelFields.custbody_fedex_label_png_3!="")
				nlapiDeleteFile(ifLabelFields.custbody_fedex_label_png_3);
			
			//Get last 4 digits of tracking #
			var last4 = trackingNumber.substring(trackingNumber.length - 4);
			
			var fileName = vendorName.substring(0,5) + "_" + labelObj.tranid + "_" + "_" + last4;
			
			var labelfile = nlapiCreateFile(fileName + ".png","PNGIMAGE",imageXml);
			labelfile.setFolder(folderID);
			labelfile.setIsOnline(true);
			var labelFileID = nlapiSubmitFile(labelfile);
			
			var labelFileID2 = "";
			if(image2xml!=null)
			{
				var labelfile2 = nlapiCreateFile(fileName + "_intlabel_2.png","PNGIMAGE",image2xml);
				labelfile2.setFolder(folderID);
				labelfile2.setIsOnline(true);
				labelFileID2 = nlapiSubmitFile(labelfile2);
			}
			
			var labelFileID3 = "";
			
			var labelFileObj = nlapiLoadFile(labelFileID);
			var labelImageUrl = labelFileObj.getURL();
			if(nlapiGetContext().getEnvironment()=="PRODUCTION")
				labelImageUrl = labelImageUrl.replace(/&/g,"&amp;");
			else
				labelImageUrl = labelImageUrl.replace(/&/g,"&amp;");
				
			var pdfxml = "<?xml version='1.0'?><!DOCTYPE pdf PUBLIC '-//big.faceless.org//report' 'report-1.1.dtd'>";
			pdfxml+= "<pdf>";
				pdfxml+= "<body width='4.00in' height='6.00in' padding='0' margin='0.00in'>";
					pdfxml+= "<img src='" + labelImageUrl + "' dpi='200'/>";
					if(image2xml!=null)
					{
						var labelFileObj2 = nlapiLoadFile(labelFileID2);
						var labelImageUrl2 = labelFileObj2.getURL();
						if(nlapiGetContext().getEnvironment()=="PRODUCTION")
							labelImageUrl2 =  labelImageUrl2.replace(/&/g,"&amp;");
						else
							labelImageUrl2 =  labelImageUrl2.replace(/&/g,"&amp;");
							
						pdfxml+= "<pbr/>";
						pdfxml+= "<img src='" + labelImageUrl2 + "' dpi='200'/>";
					}
				pdfxml+= "</body>";
			pdfxml+= "</pdf>";
			
			var pdfFileObj = nlapiXMLToPDF(pdfxml);
				pdfFileObj.setName(fileName + ".pdf");
				pdfFileObj.setFolder(folderID);
				pdfFileObj.setIsOnline(true);
			var pdfFileId = nlapiSubmitFile(pdfFileObj);
			
			var ciFile = nlapiCreateFile(fileName + "_CI.pdf","PDF",commercialInvoiceXml);
			ciFile.setFolder(folderID); //Return Shipping Labels
			ciFile.setIsOnline(true);
			var ciFileID = nlapiSubmitFile(ciFile);
			
			//Update item fulfillment with label
			nlapiSubmitField("itemfulfillment",shipment,["custbody_fedex_shipping_label","custbody_commercial_invoice","custbody_fedex_label_png","custbody_fedex_label_png_2","custbody_fedex_ws_tracking_number","custbody_fedex_label_png_3","custbody69"],[pdfFileId,ciFileID,labelFileID,labelFileID2,trackingNumber,labelFileID3,trackingNumber]);
			
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
	
	
		
	
}
