var FEDEX_RETURN_TAG_PRODUCTION = "26051782";
var FEDEX_RETURN_TAG_SANDBOX = "22330694";

function Return_Label_Email_Queue(request,response)
{
	if(request.getMethod()=="GET")
	{
		try
		{
			//Load email configurations
			var config = [];
			var templates = [];
			
			var filters = [];
			filters.push(new nlobjSearchFilter("isinactive",null,"is","F"));
			var cols = [];
			cols.push(new nlobjSearchColumn("custrecord_rlec_order_type"));
			cols.push(new nlobjSearchColumn("custrecord_rlec_email_subject"));
			cols.push(new nlobjSearchColumn("custrecord_rlec_email_template"));
			cols.push(new nlobjSearchColumn("custrecord_rlec_email_type"));
			var results = nlapiSearchRecord("customrecord_return_label_email_config",null,filters,cols); //10 Units
			if (results) {
				for (var x = 0; x < results.length; x++) {
					config.push({
						order_type: results[x].getValue("custrecord_rlec_email_type"),
						email_subject: results[x].getValue("custrecord_rlec_email_subject"),
						email_template: results[x].getValue("custrecord_rlec_email_template")
					});
					
					templates.push({
						id : results[x].getValue("custrecord_rlec_email_template"),
						name : results[x].getText("custrecord_rlec_email_template")
					});
				}
			}
			
			nlapiLogExecution("debug","Loaded configs");
			
			var form = nlapiCreateForm("Return Label Email Queue");
			form.setScript("customscript_return_label_queue_cs");
			
			var list = form.addSubList("custpage_orders","list","Sales Orders");
			var fld = list.addField("custpage_order_id","select","Sales Order","salesorder");
			fld.setDisplayType("inline");
			//list.addField("custpage_order_date","date","Date");
			fld = list.addField("custpage_order_customer","select","Customer","customer");
			fld.setDisplayType("inline");
			list.addField("custpage_order_rsl_status","select","Return Shipping Label Status","customlist126");
			fld = list.addField("custpage_order_return_label","text","Return Shipping Label");
			fld = list.addField("custpage_order_type","select","Type of Order","customlist38");
			fld.setDisplayType("inline");
			fld = list.addField("custpage_so_important_notes","textarea","SO Important Notes");
			fld = list.addField("custpage_order_customer_email","text","Customer Email");
			fld.setDisplayType("hidden");
			fld = list.addField("custpage_order_return_insurance","currency","Return Label Insurance");
			fld.setDisplayType("entry");
			fld = list.addField("custpage_order_return_ship_method","select","Shipping Method");
			fld.addSelectOption("","",true);
			fld.addSelectOption("FEDEX_2_DAY","FedEx 2Day",true);
			fld.addSelectOption("PRIORITY_OVERNIGHT","FedEx Priority Overnight",false);
			fld.addSelectOption("FEDEX_GROUND","FedEx Ground",false);
			
			fld = list.addField("custpage_created_from","text","Created From");
			//fld.setDisplayType("inline");
			
			fld = list.addField("custpage_cc_emails","text","CC");
			fld.setDisplayType("entry");
			
			fld = list.addField("custpage_email_template","select","Email Template");
			fld.addSelectOption("","",true);
			for(var x=0; x < templates.length; x++)
			{
				fld.addSelectOption(templates[x].id,templates[x].name,false);
			}
			
			fld = list.addField("custpage_order_record_type","text","Record Type");
			fld.setDisplayType("hidden");
			fld = list.addField("custpage_order_tranid","text","Transaction #");
			fld.setDisplayType("hidden");
			
			fld = list.addField("custpage_email_type","select","Email Type","customlist_return_label_email_type");
			fld.setDisplayType("inline");
			
			nlapiLogExecution("debug","Created UI");
			
			var orders = [];
			
			//Load email configurations
			var config = [];
			
			var filters = [];
			filters.push(new nlobjSearchFilter("isinactive",null,"is","F"));
			var cols = [];
			cols.push(new nlobjSearchColumn("custrecord_rlec_order_type"));
			cols.push(new nlobjSearchColumn("custrecord_rlec_email_subject"));
			cols.push(new nlobjSearchColumn("custrecord_rlec_email_template"));
			cols.push(new nlobjSearchColumn("custrecord_rlec_email_type"));
			var results = nlapiSearchRecord("customrecord_return_label_email_config",null,filters,cols); //10 Units
			if(results)
			{
				for(var x=0; x < results.length; x++)
				{
					config.push({
						order_type : results[x].getValue("custrecord_rlec_email_type"),
						email_subject : results[x].getValue("custrecord_rlec_email_subject"),
						email_template : results[x].getValue("custrecord_rlec_email_template")
					});
				}
			}
			
			
			var filters = [
				["type","anyof",["SalesOrd","RtnAuth"]],
				"and",["mainline","is","T"],
				"and",["shipcountry","is","US"],
				"and",["custbody138","noneof",["@NONE@","3","4","6","7"]],
				"and",["status","anyof",["SalesOrd:A","RtnAuth:A","RtnAuth:B"]],
				"and",[
					["custbody_linked_rma","anyof","@NONE@"],
					"or",["custbody_linked_rma.mainline","is","T"]
				]
			];
			
			
			//var filters = [];
			//filters.push(new nlobjSearchFilter("type",null,"anyof",["SalesOrd","RtnAuth"]));
			//filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
			//filters.push(new nlobjSearchFilter("shipcountry",null,"is","US"));
			//filters.push(new nlobjSearchFilter("custbody138",null,"noneof",["@NONE@","3","4","7"])); //Return Shipping Label Status != 'Label Sent to Customer', 'No Label Needed', Empty
			//filters.push(new nlobjSearchFilter("status",null,"anyof",["SalesOrd:A","RtnAuth:A","RtnAuth:B"]));
			
			//filters.push(new nlobjSearchFilter("custbody137",null,"noneof","@NONE@")); //Return Shipping Label Field = Not Empty
			var cols = [];
			cols.push(new nlobjSearchColumn("tranid"));
			cols.push(new nlobjSearchColumn("trandate"));
			cols.push(new nlobjSearchColumn("entity"));
			cols.push(new nlobjSearchColumn("custbody138").setSort()); //Return Shipping Label Status
			cols.push(new nlobjSearchColumn("custbody137")); //Return Shipping Label (file)
			cols.push(new nlobjSearchColumn("custbody87")); //Type of Order
			cols.push(new nlobjSearchColumn("custbody2")); //Customer Email
			cols.push(new nlobjSearchColumn("custbody_return_label_insurance")); //Return Label Insurance
			//cols.push(new nlobjSearchColumn("custbody_return_label_insurance","createdfrom")); //Return Label Insurance (Created From)
			cols.push(new nlobjSearchColumn("custbody_return_label_insurance","custbody_linked_rma")); //Return Label Insurance (Linked RMA)
			cols.push(new nlobjSearchColumn("createdfrom"));
			cols.push(new nlobjSearchColumn("custbody58")); //SO Important Notes
			cols.push(new nlobjSearchColumn("custbody_return_label_email_type")); //Return Label Email Type
			var results = nlapiSearchRecord("transaction",null,filters,cols);
			if(results)
			{
				for(var x=0; x < results.length; x++)
				{
					var template = "";
					for(var i=0; i < config.length; i++)
					{
						if(config[i].order_type == results[x].getValue("custbody_return_label_email_type"))
						{
							template = config[i].email_template;
							break;
						}
					}
					
					var createdFromLink = "";
					if(results[x].getValue("createdfrom")!=null && results[x].getValue("createdfrom")!="")
					{
						createdFromLink = "<a href='/app/accounting/transactions/salesord.nl?id=" + results[x].getValue("createdfrom") + "'>" + results[x].getText("createdfrom") + "</a>";
					}
					
					//Find email configuration for particular order type
					/*
					var template = "";
					for(var i=0; i < config.length; i++)
					{
						if(config[i].order_type == results[x].getValue("custbody87"))
						{
							template = config[i].email_template;
							break;
						}
					}
					*/
					
					var insurance = results[x].getValue("custbody_return_label_insurance");
					if(insurance==null || insurance=="")
						insurance = results[x].getValue("custbody_return_label_insurance","custbody_linked_rma");
					
					orders.push({
						custpage_order_id : results[x].getId(),
						custpage_order_date : results[x].getValue("trandate"),
						custpage_order_customer : results[x].getValue("entity"),
						custpage_order_rsl_status : results[x].getValue("custbody138"),
						custpage_order_return_label : results[x].getValue("custbody137"),
						custpage_order_type : results[x].getValue("custbody87"),
						custpage_order_customer_email : results[x].getValue("custbody2"),
						custpage_order_return_insurance : results[x].getValue("custbody_return_label_insurance"),
						custpage_order_record_type : results[x].getRecordType(),
						custpage_order_tranid : results[x].getValue("tranid"),
						custpage_created_from : createdFromLink,
						custpage_email_template : template,
						custpage_so_important_notes : results[x].getValue("custbody58"),
						custpage_email_type : results[x].getValue("custbody_return_label_email_type")
					});
				}
				
				list.setLineItemValues(orders);
			}
			
			form.addSubmitButton("Send Emails");
			
			response.writePage(form);
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Return Shipping Label Email Queue","Details: " + err.message);
		}
	}
	else
	{
		//Load email configurations
		var config = [];
		
		var filters = [];
		filters.push(new nlobjSearchFilter("isinactive",null,"is","F"));
		var cols = [];
		cols.push(new nlobjSearchColumn("custrecord_rlec_order_type"));
		cols.push(new nlobjSearchColumn("custrecord_rlec_email_subject"));
		cols.push(new nlobjSearchColumn("custrecord_rlec_email_template"));
		cols.push(new nlobjSearchColumn("custrecord_rlec_email_type"));
		var results = nlapiSearchRecord("customrecord_return_label_email_config",null,filters,cols); //10 Units
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				config.push({
					order_type : results[x].getValue("custrecord_rlec_email_type"),
					email_subject : results[x].getValue("custrecord_rlec_email_subject"),
					email_template : results[x].getValue("custrecord_rlec_email_template")
				});
			}
		}
		
		//40 Units Per Email
		for(var x=0; x < request.getLineItemCount("custpage_orders"); x++)
		{
			if(request.getLineItemValue("custpage_orders","custpage_order_rsl_status",x+1)=="5") //Email customer label
			{
				nlapiLogExecution("debug","Order: " + request.getLineItemValue("custpage_orders","custpage_order_id",x+1));
				
				var templateFound = false;
				
				//Find email configuration for particular order type
				for(var i=0; i < config.length; i++)
				{
					if(config[i].order_type == request.getLineItemValue("custpage_orders","custpage_email_type",x+1))
					{
						templateFound = true;
						
						var EMAIL_TO = request.getLineItemValue("custpage_orders","custpage_order_customer_email",x+1);
						var SUBJECT = config[i].email_subject;
						var LABEL = request.getLineItemValue("custpage_orders","custpage_order_return_label",x+1);
						
						if(LABEL==null || LABEL=="")
						{
							//Generate return label
							nlapiLogExecution("debug","BEGIN Generating Label....");
							LABEL = Gen_Return_Label(request.getLineItemValue("custpage_orders","custpage_order_id",x+1),request.getLineItemValue("custpage_orders","custpage_order_record_type",x+1),request.getLineItemValue("custpage_orders","custpage_order_tranid",x+1),request.getLineItemValue("custpage_orders","custpage_order_return_ship_method",x+1),request.getLineItemValue("custpage_orders","custpage_order_return_insurance",x+1));
							nlapiLogExecution("debug","END Generating Label....");
						}
						
						LABEL = nlapiLoadFile(LABEL); //10 Units	
						
						var template = config[i].email_template;
						
						if(request.getLineItemValue("custpage_orders","custpage_email_template",x+1)!=null && request.getLineItemValue("custpage_orders","custpage_email_template",x+1)!="")
						{
							template = request.getLineItemValue("custpage_orders","custpage_email_template",x+1);
						}
						
						//Merge email template
						var emailMerger = nlapiCreateEmailMerger(template);
						emailMerger.setTransaction(request.getLineItemValue("custpage_orders","custpage_order_id",x+1));
						emailMerger.setEntity("customer",request.getLineItemValue("custpage_orders","custpage_order_customer",x+1));
						
						var mergeResult = emailMerger.merge(); //20 Units
						
						var RECORDS = new Object();
						RECORDS["transaction"] = request.getLineItemValue("custpage_orders","custpage_order_id",x+1);
						
						var cc = null;
						if(request.getLineItemValue("custpage_orders","custpage_cc_emails",x+1)!=null && request.getLineItemValue("custpage_orders","custpage_cc_emails",x+1)!="")
							cc = request.getLineItemValue("custpage_orders","custpage_cc_emails",x+1);
						
						nlapiSendEmail(nlapiGetUser(),EMAIL_TO,SUBJECT,mergeResult.getBody(),cc,null,RECORDS,LABEL); //10 Units
						
						nlapiSubmitField(request.getLineItemValue("custpage_orders","custpage_order_record_type",x+1),request.getLineItemValue("custpage_orders","custpage_order_id",x+1),["custbody138"],["3"]); //10 Units
					}
				}
				
				if(templateFound==false)
				{
					if(request.getLineItemValue("custpage_orders","custpage_email_template",x+1)!=null && request.getLineItemValue("custpage_orders","custpage_email_template",x+1)!="")
					{
						var EMAIL_TO = request.getLineItemValue("custpage_orders","custpage_order_customer_email",x+1);
						
						var LABEL = request.getLineItemValue("custpage_orders","custpage_order_return_label",x+1);
						
						if(LABEL==null || LABEL=="")
						{
							//Generate return label
							nlapiLogExecution("debug","BEGIN Generating Label....");
							LABEL = Gen_Return_Label(request.getLineItemValue("custpage_orders","custpage_order_id",x+1),request.getLineItemValue("custpage_orders","custpage_order_record_type",x+1),request.getLineItemValue("custpage_orders","custpage_order_tranid",x+1),request.getLineItemValue("custpage_orders","custpage_order_return_ship_method",x+1),request.getLineItemValue("custpage_orders","custpage_order_return_insurance",x+1));
							nlapiLogExecution("debug","END Generating Label....");
						}
						
						LABEL = nlapiLoadFile(LABEL); //10 Units
						
						var template = request.getLineItemValue("custpage_orders","custpage_email_template",x+1);
						
						//Merge email template
						var emailMerger = nlapiCreateEmailMerger(template);
						emailMerger.setTransaction(request.getLineItemValue("custpage_orders","custpage_order_id",x+1));
						emailMerger.setEntity("customer",request.getLineItemValue("custpage_orders","custpage_order_customer",x+1));
						
						var mergeResult = emailMerger.merge(); //20 Units
						
						var RECORDS = new Object();
						RECORDS["transaction"] = request.getLineItemValue("custpage_orders","custpage_order_id",x+1);
						
						var cc = null;
						if(request.getLineItemValue("custpage_orders","custpage_cc_emails",x+1)!=null && request.getLineItemValue("custpage_orders","custpage_cc_emails",x+1)!="")
							cc = request.getLineItemValue("custpage_orders","custpage_cc_emails",x+1);
						
						nlapiSendEmail(nlapiGetUser(),EMAIL_TO,mergeResult.getSubject(),mergeResult.getBody(),cc,null,RECORDS,LABEL); //10 Units
						
						nlapiSubmitField(request.getLineItemValue("custpage_orders","custpage_order_record_type",x+1),request.getLineItemValue("custpage_orders","custpage_order_id",x+1),["custbody138"],["3"]); //10 Units
					}
				}
			}
		}
	}
}

function Gen_Return_Label(internalid,recordType,transId,shipMethod,insuranceAmount)
{
	var now = new Date();
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
	
	var insurance = parseFloat(insuranceAmount);
	var insurance_label = "";
	if(insurance > 15000 && shipMethod=="FEDEX_2_DAY")
	{
		var diff = insurance - 15000;
		insurance = 15000;
		
		insurance_label = "RE2014" + parseInt(diff) + "200305";
	}
	else if(insurance > 50000)
	{
		var diff = insurance - 50000;
		insurance = 50000;
		
		insurance_label = "RE2014" + parseInt(diff) + "200305";
	}
	else
	{
		insurance_label = "BEF8956" + parseInt(insurance) + "X1560";
	}
	
	var labelObj = {
		ship_timestamp : timestamp,
		service_type : shipMethod,
		insurance_value : insurance,
		insurance_label : insurance_label,
		tranid : transId,
		ship_to_addressee : "",
		ship_to_address_1 : "",
		ship_to_address_2 : "",
		ship_to_city : "",
		ship_to_state : "",
		ship_to_zip : "",
		ship_to_country : ""
	};
	
	//Get return label email config record
	var shipToLocation = "2"; 
	var typeOfOrder = nlapiLookupField(recordType,internalid,"custbody87");
	var filters = [];
	filters.push(new nlobjSearchFilter("custrecord_rlec_order_type",null,"anyof",typeOfOrder));
	var cols = [];
	cols.push(new nlobjSearchColumn("custrecord_inventory_location_returns"));
	var results = nlapiSearchRecord("customrecord_return_label_email_config",null,filters,cols);
	if(results)
	{
		if(results[0].getValue("custrecord_inventory_location_returns")!=null && results[0].getValue("custrecord_inventory_location_returns")!=null)
			shipToLocation = results[0].getValue("custrecord_inventory_location_returns");
	}
	
	//Get address details from location record
	var shipToFilters = [];
	shipToFilters.push(new nlobjSearchFilter("internalid",null,"is",shipToLocation));
	var shipToCols = [];
	shipToCols.push(new nlobjSearchColumn("address1","address"));
	shipToCols.push(new nlobjSearchColumn("address2","address"));
	shipToCols.push(new nlobjSearchColumn("city","address"));
	shipToCols.push(new nlobjSearchColumn("state","address"));
	shipToCols.push(new nlobjSearchColumn("zip","address"));
	shipToCols.push(new nlobjSearchColumn("countrycode","address"));
	shipToCols.push(new nlobjSearchColumn("phone","address"));
	shipToCols.push(new nlobjSearchColumn("addressee","address"));
	shipToCols.push(new nlobjSearchColumn("attention","address"));
	var shipToResults = nlapiSearchRecord("location",null,shipToFilters,shipToCols);
	if(shipToResults)
	{
		labelObj.ship_to_addressee = shipToResults[0].getValue("attention","address");
		labelObj.ship_to_address_1 = shipToResults[0].getValue("address1","address");
		labelObj.ship_to_address_2 = shipToResults[0].getValue("address2","address");
		labelObj.ship_to_city = shipToResults[0].getValue("city","address");
		labelObj.ship_to_state = shipToResults[0].getValue("state","address");
		labelObj.ship_to_zip = shipToResults[0].getValue("zip","address");
		labelObj.ship_to_country = shipToResults[0].getValue("countrycode","address");
		labelObj.ship_to_phone = shipToResults[0].getValue("phone","address");	
	}
	
	if(nlapiGetContext().getEnvironment()=="SANDBOX")
		templateID = FEDEX_RETURN_TAG_SANDBOX;
	else
		templateID = FEDEX_RETURN_TAG_PRODUCTION;
	
	nlapiLogExecution("debug","FedEx Template ID",templateID);
	var templateFile = nlapiLoadFile(templateID);
	var template = templateFile.getValue();
	var xmlTemp = Handlebars.compile(template);
	
	var soap = xmlTemp(labelObj);
	
	var headers = new Object();
	headers["Content-Type"] = "application/xml";
	
	nlapiLogExecution("debug","Environment",nlapiGetContext().getEnvironment());
		
	var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
	
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
	
	var trackingLast4 = trackingNumber.substr(trackingNumber.length - 4);
	
	var file = nlapiCreateFile(transId + " return_label " + trackingLast4 + ".pdf","PDF",imageXml);
	file.setFolder("407735"); //Return Shipping Labels
	var fileID = nlapiSubmitFile(file);
	
	nlapiSubmitField(recordType,internalid,["custbody137","custbody123","custbody138"],[fileID,trackingNumber,"3"]);
	
	//Return file internal ID
	return fileID;
}
