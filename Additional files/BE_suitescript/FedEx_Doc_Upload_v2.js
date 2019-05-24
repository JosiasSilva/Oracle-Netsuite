function FedEx_Document_Upload(request,response)
{
	var fileId = nlapiGetContext().getSetting("SCRIPT","custscript_fedex_doc_upload_file");
	var fileObj = nlapiLoadFile(fileId);
	var fileContents = fileObj.getValue();
	
	var soapJSON = {
		file : fileContents,
		image_id : nlapiGetContext().getSetting("SCRIPT","custscript_fedex_doc_upload_id"),
		account : "",
		key : "",
		password : "",
		meter : ""
	};
	
	var fedexAccount = nlapiGetContext().getSetting("SCRIPT","custscript_fedex_doc_upload_acct");
	var accountDetails = nlapiLookupField("customrecord_fedex_integration_key",fedexAccount,["custrecord_fedex_int_account_number","custrecord_fedex_int_meter_number","custrecord_fedex_int_key","custrecord_fedex_int_password"]);
	
	soapJSON.account = accountDetails.custrecord_fedex_int_account_number;
	soapJSON.key = accountDetails.custrecord_fedex_int_key;
	soapJSON.password = accountDetails.custrecord_fedex_int_password;
	soapJSON.meter = accountDetails.custrecord_fedex_int_meter_number;
	
	nlapiLogExecution("debug","soapJSON",JSON.stringify(soapJSON));
	
	var templateID = nlapiGetContext().getSetting("SCRIPT","custscript_fedex_doc_upload_soap");
	var templateFile = nlapiLoadFile(templateID);
	var template = templateFile.getValue();
	var xmlTemp = Handlebars.compile(template);
	
	var soap = xmlTemp(soapJSON);
	
	var headers = new Object();
	headers["Content-Type"] = "application/xml";
	
	var cResp = nlapiRequestURL("https://ws.fedex.com:443/web-services",soap,headers);
	
	nlapiLogExecution("debug","Response Code",cResp.getCode());
	nlapiLogExecution("debug","Response Body (XML)",cResp.getBody());
}
