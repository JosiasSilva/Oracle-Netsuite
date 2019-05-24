nlapiLogExecution("audit","FLOStart",new Date().getTime());
function FedEx_Document_Upload(request,response)
{
	var fileId = nlapiGetContext().getSetting("SCRIPT","custscript_fedex_doc_upload_file");
	var fileObj = nlapiLoadFile(fileId);
	var fileContents = fileObj.getValue();
	
	var soapJSON = {
		file : fileContents,
		image_id : nlapiGetContext().getSetting("SCRIPT","custscript_fedex_doc_upload_id")
	};
	
	var templateID = nlapiGetContext().getSetting("SCRIPT","custscript_fedex_doc_upload_soap");
	var templateFile = nlapiLoadFile(templateID);
	var template = templateFile.getValue();
	var xmlTemp = Handlebars.compile(template);
	
	var soap = xmlTemp(soapJSON);
	
	var headers = new Object();
	headers["Content-Type"] = "application/xml";
	
	if(nlapiGetContext().getEnvironment()=="PRODUCTION")
		var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
	else
		var cResp = nlapiRequestURL("https://wsbeta.fedex.com:443/web-services",soap,headers);
	
	nlapiLogExecution("debug","Response Code",cResp.getCode());
	nlapiLogExecution("debug","Response Body (XML)",cResp.getBody());
}
