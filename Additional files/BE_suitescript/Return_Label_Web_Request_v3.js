var FEDEX_RETURN_TAG_PRODUCTION = "16353289";
var FEDEX_RETURN_TAG_SANDBOX = "17831927";
var DATA_CENTER_URL = "";

function Return_Label_Web_Request(type)
{
	if(type=="create")
	{
		try
		{
			var order = nlapiGetNewRecord();
			
			//Return Label Status = 'Website Generated Label'
			if(order.getFieldValue("custbody138")=="6")
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
				
				var shipMethod = "FEDEX_2_DAY";
				
				var insurance = parseFloat(order.getFieldValue("custbody_return_label_insurance"));
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
					tranid : order.getFieldValue("tranid")
				};
				
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
				
				var file = nlapiCreateFile(order.getFieldValue("tranid") + " return_label.pdf","PDF",imageXml);
				file.setFolder("407735"); //Return Shipping Labels
				file.setIsOnline(true);
				var fileID = nlapiSubmitFile(file);
				
				var xml = "<?xml version='1.0'?><!DOCTYPE pdf PUBLIC '-//big.faceless.org//report' 'report-1.1.dtd'>";
				xml+= "<pdfset>";
				
				getDataCenterURL();
				
				var fileObj = nlapiLoadFile(fileID); //10 Units
				var fileUrl = fileObj.getURL();
				if(nlapiGetContext().getEnvironment()=="PRODUCTION")
					fileUrl = DATA_CENTER_URL + "" + fileUrl;
				else
					fileUrl = DATA_CENTER_URL + "" + fileUrl;
				nlapiLogExecution("debug","File URL",fileUrl);
				
				xml+= "<pdf src='" + nlapiEscapeXML(fileUrl) + "' />";
				
				fileObj = nlapiLoadFile(nlapiGetContext().getSetting("SCRIPT","custscript_return_instructions_pdf")); //10 Units
				fileUrl = fileObj.getURL();
				if(nlapiGetContext().getEnvironment()=="PRODUCTION")
					fileUrl = DATA_CENTER_URL + "" + fileUrl;
				else
					fileUrl = DATA_CENTER_URL + "" + fileUrl;
				nlapiLogExecution("debug","File URL",fileUrl);
				
				xml+= "<pdf src='" + nlapiEscapeXML(fileUrl) + "' />";
				
				xml+= "</pdfset>";
				
				var pdf = nlapiXMLToPDF(xml);
				pdf.setFolder("407735");
				pdf.setName(order.getFieldValue("tranid") + " return_label.pdf");
				var pdfId = nlapiSubmitFile(pdf);
				
				nlapiSubmitField("salesorder",nlapiGetRecordId(),["custbody137","custbody123"],[pdfId,trackingNumber]);
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Generating Return Label","Details: " + err.message);
		}
	}
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
