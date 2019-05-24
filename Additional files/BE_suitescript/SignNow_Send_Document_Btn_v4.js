function SignNow_Send_Document_Btn(type,form)
{
	if(type=="view")
	{
		try
		{
			var url = nlapiResolveURL("SUITELET","customscript_signnow_send_single_doc","customdeploy_signnow_send_single_doc");
				url+= "&record=" + nlapiGetRecordId();
				
			form.addButton("custpage_send_for_signature","Send For Signature*","window.open('" + url + "','sigWin','dependent=yes,width=600,height=600');");
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Adding Send For Signature Button","Details: " + err.message);
		}
	}
}

function SignNow_Send_Document_SL(request,response)
{
	//var configId = nlapiGetContext().getSetting("SCRIPT","custscript_signnow_config");
	var config = nlapiLoadRecord("customrecord_signnow_token","1");
	var userConfig = nlapiLoadRecord("customrecord_signnow_token","2");
	
	var encoded_credentials = nlapiEncrypt(config.getFieldValue("custrecord_signnow_client_id")+":"+config.getFieldValue("custrecord_signnow_client_secret"),"base64");
	nlapiLogExecution("debug","Encoded Credentials",encoded_credentials);
	
	var snRec = nlapiLoadRecord("customrecord_custom_signnow_document",request.getParameter("record"));
	
	var docType = snRec.getFieldValue("custrecord_document_type");
	var docConfig = nlapiLoadRecord("customrecord_signnow_doc_configuration",docType);
	
	var fileId = snRec.getFieldValue("custrecord_signnow_document");
	nlapiLogExecution("debug","Using File ID",fileId);
	
	var file = nlapiLoadFile(fileId);
	
	//Post document to SignNow and get Document ID
	var url = "https://integrations.signnow.com/netsuite/document/";
		url+= "" + snRec.getFieldText("custrecord_signnow_document") + "/application%2Fpdf/" + request.getParameter("record");
	
	var headers = new Object();
	headers["Authorization"] = "Bearer " + config.getFieldValue("custrecord_access_token");
	headers["Content-Type"] = ' text/plain;charset=UTF-8';
	
	var res = nlapiRequestURL(url, file.getValue(), headers, 'POST');
	
	var documentId = res.getBody();
	nlapiLogExecution("debug","Document ID",documentId);
	
	if(documentId.indexOf("error")!=-1)
	{
		var errorMsg = JSON.parse(documentId);
		nlapiSubmitField("customrecord_custom_signnow_document",request.getParameter("record"),"custrecord_signnow_error",errorMsg.error);
		
		return true;
	}
	
	var headers1 = new Object();
	headers1["Authorization"] = "Bearer " + config.getFieldValue("custrecord_access_token");
	headers1["Content-Type"] = 'application/json';
	
	//Create Invite to Sign Uploaded Document
	var inviteURL = "https://api.signnow.com/document/" + documentId + "/invite?email=disable";
	
	var invitePayload = {
		to : [{
			email : userConfig.getFieldValue("custrecord_signnow_api_username"),
			role : "signer",
			order : 1,
			role_id : ""
		}],
		from : config.getFieldValue("custrecord_signnow_api_username"),
		cc : [],
		subject : "Please Sign",
		message : "Please Sign"
	};
	
	var cResp = nlapiRequestURL(inviteURL,JSON.stringify(invitePayload),headers1,"POST");
	nlapiLogExecution("debug","Invite Response Body",cResp.getBody());
	
	if(cResp.getBody())
	{
		var responseBody = JSON.parse(cResp.getBody());
		
		if(responseBody.errors && responseBody.errors.length > 0)
		{
			var errorMessage = responseBody.errors[0].message;
			
			nlapiSubmitField("customrecord_custom_signnow_document",request.getParameter("record"),"custrecord_signnow_error",errorMessage);
		
			return true;
		}
	}
	
	//Generate Restricted Scope Access Token for Signing Link
	var headers2 = new Object();
	headers2["Authorization"] = "Basic " + encoded_credentials;
	headers2["Accept"] = "application/json";
	headers2["Content-Type"] = "application/x-www-form-urlencoded";
	
	var body = "username=" + userConfig.getFieldValue("custrecord_signnow_api_username");
		body+= "&password=" + escape(userConfig.getFieldValue("custrecord_signnow_api_password"));
		body+= "&grant_type=password";
		body+= "&scope=signer_limited_scope_token document/" + documentId;
		
	nlapiLogExecution("debug","Body",body);
		
	var url = "https://api.signnow.com/oauth2/token";
	
	var cResp = nlapiRequestURL(url,body,headers2);
	
	nlapiLogExecution("debug","Response Code",cResp.getCode());
	nlapiLogExecution("debug","Response Body",cResp.getBody());
	
	var tokenData = JSON.parse(cResp.getBody());
	var userToken = tokenData.access_token;
	
	if(userToken==null || userToken=="" || userToken=="undefined" || userToken==undefined)
	{
		nlapiSubmitField("customrecord_custom_signnow_document",request.getParameter("record"),"custrecord_signnow_error","Error getting user token. " + cResp.getBody());
		
		return true;
	}
	
	var signingURL = "https://signnow.com/dispatch?route=fieldinvite&document_id=" + documentId + "&access_token=" + userToken + "&disable_email=true";
		signingURL+= "&redirect_uri=https://app.signnow.com/html/thanks-for-signing?organizations=" + documentId;
	
	//Update fields on custom record
	nlapiSubmitField("customrecord_custom_signnow_document",request.getParameter("record"),["custrecord_signnow_status","custrecord_signnow_date_sent","custrecord_signnow_document_id","custrecord_signnow_signing_link","custrecord_signnow_error"],["2",nlapiDateToString(new Date(),"date"),documentId,signingURL,""]);
	
	var emailTemplate = docConfig.getFieldValue("custrecord_email_template_signnow");
	nlapiLogExecution("debug","Email Template to Use",emailTemplate);
	
	var emailMerger = nlapiCreateEmailMerger(emailTemplate);
	emailMerger.setEntity("customer",snRec.getFieldValue("custrecord_signnow_customer"));
	//emailMerger.setTransaction(snRec.getFieldValue("custrecord_signnow_transaction"));
	emailMerger.setCustomRecord("customrecord_custom_signnow_document",request.getParameter("record"));
	
	var mergeResult = emailMerger.merge();
	
	nlapiLogExecution("debug","mergeResult created (email template merged)","Email Body:<br><br>" + mergeResult.getBody());
	
	var records = new Object();
	records["recordtype"] = "customrecord_custom_signnow_document";
	records["record"] = request.getParameter("record");
	//records["transaction"] = snRec.getFieldValue("custrecord_signnow_transaction");
	records["entity"] = snRec.getFieldValue("custrecord_signnow_customer");
	
	var recordType = docConfig.getFieldValue("custrecord_doc_field_id_record_type");
	var recordField = docConfig.getFieldValue("custrecord_field_record_to_map");
	
	if(recordType=="transaction")
	{
		switch(snRec.getFieldText(recordField).substring(0,3))
		{
			case "Ret":
				recordType = "returnauthorization";
				break;
			case "Sal":
				recordType = "salesorder";
				break;
			case "Inv":
				recordType = "invoice";
				break;
			case "Ite":
				recordType = "itemfulfillment";
				break;
		}
	}
	
	var attachments = null;
	
	var includeTransaction = docConfig.getFieldValue("custrecord_include_transaction_copy");
	if(includeTransaction=="T")
	{
		attachments = nlapiPrintRecord("transaction",snRec.getFieldValue(recordField),"PDF");
	}
	
	nlapiSendEmail("20561",snRec.getFieldValue("custrecord_signnow_customer"),mergeResult.getSubject(),mergeResult.getBody(),null,null,records,attachments);
	nlapiLogExecution("debug","Email sent");
	
	//Update fields on transaction record
	var recordStatusField = docConfig.getFieldValue("custrecord_record_status_field");
	nlapiLogExecution("debug","Record Status Field to Use",recordStatusField);
	
	var recordStatusFieldValueSent = docConfig.getFieldValue("custrecord_status_field_value_sent");
	nlapiLogExecution("debug","Record Status Field Value to Use",recordStatusFieldValueSent);
	
	if(recordType!=null && recordStatusField!=null && recordStatusField!="" && recordStatusFieldValueSent!=null && recordStatusFieldValueSent!="")
	{
		nlapiSubmitField(recordType,snRec.getFieldValue(recordField),recordStatusField,recordStatusFieldValueSent); //Shipper's Declaration Status = Shipper's Decl. Requested
	}	
	
	var script = "<script>window.opener.location.reload(); this.close();</script>";
	
	response.write(script);
}
