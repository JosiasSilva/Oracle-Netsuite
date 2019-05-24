nlapiLogExecution("audit","FLOStart",new Date().getTime());
function FedEx_Return_Label(request,response)
{
	if(request.getMethod()=="GET")
	{
		var form = nlapiCreateForm("Create New FedEx Return Label",true);
		form.setScript("customscript_fedex_return_label_client");
		
		var fld = form.addField("custpage_service_type","select","Ship Service");
		fld.addSelectOption("FEDEX_2_DAY","FedEx 2Day",true); //Default to 2Day service initially
		fld.addSelectOption("PRIORITY_OVERNIGHT","FedEx Priority Overnight",false);
		
		var orderId = request.getParameter("order");
		var order = null;
		var insuranceValue = 0.00;
		
		var recordType = request.getParameter("rectype");
		
		var now = new Date();
		var daysAgo25 = nlapiAddDays(now,-25);
		
		var fullInsuranceValue = 0.00;
		var prodInsuranceValue = 0.00;
		
		var tranidFld = form.addField("custpage_tranid","text","Transaction #");
		tranidFld.setDisplayType("hidden");
		
		if(orderId!=null && orderId!="")
		{
			var filters = [];
			filters.push(new nlobjSearchFilter("internalid",null,"is",orderId));
			filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
			var cols = [];
			cols.push(new nlobjSearchColumn("custbody_full_insurance_amount"));
			cols.push(new nlobjSearchColumn("custcol_full_insurance_value"));
			cols.push(new nlobjSearchColumn("trandate"));
			cols.push(new nlobjSearchColumn("tranid"));
			cols.push(new nlobjSearchColumn("custcol_category"));
			cols.push(new nlobjSearchColumn("custbody110"));
			cols.push(new nlobjSearchColumn("custbody87")); //Type of Order
			cols.push(new nlobjSearchColumn("custbody35")); //Type of Send Back
			cols.push(new nlobjSearchColumn("custbody110","createdfrom")); //Created From: Date to Ship
			cols.push(new nlobjSearchColumn("custbody110","custbody_created_from")); //Created From: Date to Ship
			cols.push(new nlobjSearchColumn("custbody_return_label_insurance"));
			var results = nlapiSearchRecord(recordType,null,filters,cols);
			if(results)
			{
				order = results[0];
				var hasDiamond = false;
				
				if(recordType=="salesorder")
					var dateToShip = results[0].getValue("custbody110","custbody_created_from");
				else
					var dateToShip = results[0].getValue("custbody110","createdfrom");
				
				insuranceValue = results[0].getValue("custbody_return_label_insurance");
				
				var typeOfOrder = results[0].getValue("custbody87");
				var typeOfSendback = results[0].getValue("custbody35");
				
				for(var x=0; x < results.length; x++)
				{
					if(results[x].getValue("custcol_category")=="7") //Loose Diamond
					{
						hasDiamond = true;
						break;
					}
				}
				
				//Determine service level
				if(nlapiStringToDate(dateToShip) <= daysAgo25 && hasDiamond==true && (typeOfOrder=="4" || typeOfSendback=="2"))
				{
					//If Date to Ship is older than 25 days and has a Category = LOOSE DIAMOND item then use FedEx Priority Overnight service
					fld.setDefaultValue("PRIORITY_OVERNIGHT");
				}
				
				
				tranidFld.setDefaultValue(results[0].getValue("tranid"));
			}
		}
		
		fld = form.addField("custpage_insurance","currency","Return Insurance Value");
		fld.setDefaultValue(insuranceValue);
		fld.setMandatory(true);
		
		fld = form.addField("custpage_record_id","text","Record Internal ID");
		fld.setDefaultValue(orderId);
		fld.setDisplayType("hidden");
		
		fld = form.addField("custpage_record_type","text","Record Type");
		fld.setDefaultValue(recordType);
		fld.setDisplayType("hidden");
		
		form.addSubmitButton("Create");
		
		response.writePage(form);
	}
	else
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
		
		var insurance = parseFloat(request.getParameter("custpage_insurance"));
		var insurance_label = "";
		if(insurance > 15000 && request.getParameter("custpage_service_type")=="FEDEX_2_DAY")
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
			service_type : request.getParameter("custpage_service_type"),
			insurance_value : insurance,
			insurance_label : insurance_label,
			tranid : request.getParameter("custpage_tranid")
		};
		
		var templateID = nlapiGetContext().getSetting("SCRIPT","custscript_fedex_return_xml");
		var templateFile = nlapiLoadFile(templateID);
		var template = templateFile.getValue();
		var xmlTemp = Handlebars.compile(template);
		
		var soap = xmlTemp(labelObj);
		
		var headers = new Object();
		headers["Content-Type"] = "application/xml";
		
		nlapiLogExecution("debug","Environment",nlapiGetContext().getEnvironment());
		
		if(nlapiGetContext().getEnvironment()=="PRODUCTION")
			var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
		else if(nlapiGetContext().getEnvironment()=="SANDBOX")
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
		
		var file = nlapiCreateFile(request.getParameter("custpage_tranid") + " return_label.pdf","PDF",imageXml);
		file.setFolder("407735"); //Return Shipping Labels
		var fileID = nlapiSubmitFile(file);
		
		nlapiSubmitField(request.getParameter("custpage_record_type"),request.getParameter("custpage_record_id"),["custbody137","custbody123"],[fileID,trackingNumber]);
		
		//Output PDF to screen for user
		response.setContentType("PDF",request.getParameter("custpage_tranid") + " return_label.pdf","inline");
		response.write(file.getValue());
	}
}

function checkInsuranceValue()
{
	try
	{
		var insuranceValue = nlapiGetFieldValue("custpage_insurance");
		if(insuranceValue <= 0)
		{
			alert("You must enter an insurance value greater than $0.00.");
			return false;
		}
		
		return true;
	}
	catch(err)
	{
		return true;
	}
}
