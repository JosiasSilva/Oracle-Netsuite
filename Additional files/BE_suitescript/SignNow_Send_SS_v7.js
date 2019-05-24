function SignNow_Send_SS()
{
	var results = nlapiSearchRecord("customrecord_custom_signnow_document","customsearch_signnow_send_fsd_to_cust");
	
	if(results)
	{
		var configId = nlapiGetContext().getSetting("SCRIPT","custscript_signnow_config");
		var config = nlapiLoadRecord("customrecord_signnow_token",configId);
		
		var userConfig = nlapiLoadRecord("customrecord_signnow_token","2");
		
		var encoded_credentials = nlapiEncrypt(config.getFieldValue("custrecord_signnow_client_id")+":"+config.getFieldValue("custrecord_signnow_client_secret"),"base64");
		nlapiLogExecution("debug","Encoded Credentials",encoded_credentials);
		
		for(var x=0; x < results.length; x++)
		{
			var docType = results[x].getValue("custrecord_document_type");
			var docConfig = nlapiLoadRecord("customrecord_signnow_doc_configuration",docType);
	
			var fileId = results[x].getValue("custrecord_signnow_document");
			var file = nlapiLoadFile(fileId);
			
			//Post document to SignNow and get Document ID
			var url = "https://integrations.signnow.com/netsuite/document/";
				url+= "" + results[x].getText("custrecord_signnow_document") + "/application%2Fpdf/" + results[x].getId();
			
			var headers = new Object();
			headers["Authorization"] = "Bearer " + config.getFieldValue("custrecord_access_token");
			headers["Content-Type"] = ' text/plain;charset=UTF-8';
			
			var res = nlapiRequestURL(url, file.getValue(), headers, 'POST');
			
			var documentId = res.getBody();
			nlapiLogExecution("debug","Document ID",documentId);
			
			if(documentId.indexOf("error")!=-1)
			{
				var errorMsg = JSON.parse(documentId);
				nlapiSubmitField("customrecord_custom_signnow_document",results[x].getId(),"custrecord_signnow_error",errorMsg.error);
				
				continue;
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
					
					nlapiSubmitField("customrecord_custom_signnow_document",results[x].getId(),"custrecord_signnow_error",errorMessage);
				
					continue;
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
			nlapiSubmitField("customrecord_custom_signnow_document",results[x].getId(),["custrecord_signnow_status","custrecord_signnow_date_sent","custrecord_signnow_document_id","custrecord_signnow_signing_link","custrecord_signnow_error"],["2",nlapiDateToString(new Date(),"date"),documentId,signingURL,""]);
			
			var emailTemplate = docConfig.getFieldValue("custrecord_email_template_signnow");
			nlapiLogExecution("debug","Email Template to Use",emailTemplate);
			
			var emailMerger = nlapiCreateEmailMerger(emailTemplate);
			emailMerger.setEntity("customer",results[x].getValue("custrecord_signnow_customer"));
			emailMerger.setCustomRecord("customrecord_custom_signnow_document",results[x].getId());
			
			var mergeResult = emailMerger.merge();
			
			var records = new Object();
			records["recordtype"] = "customrecord_custom_signnow_document";
			records["record"] = results[x].getId();
			records["entity"] = results[x].getValue("custrecord_signnow_customer");
			
			var attachments = null;
			
			var recordType = docConfig.getFieldValue("custrecord_doc_field_id_record_type");
			var recordField = docConfig.getFieldValue("custrecord_field_record_to_map");
			
			if(recordType=="transaction")
			{
				switch(results[x].getText(recordField).substring(0,3))
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
	
			var includeTransaction = docConfig.getFieldValue("custrecord_include_transaction_copy");
			if(includeTransaction=="T")
			{
				attachments = nlapiPrintRecord("transaction",results[x].getValue("custrecord_signnow_transaction"),"PDF");
			}
			
			nlapiSendEmail("20561",results[x].getValue("custrecord_signnow_customer"),mergeResult.getSubject(),mergeResult.getBody(),null,null,records,attachments,false);
			
			nlapiLogExecution("debug","TransactionType: " + results[x].getValue("type","custrecord_signnow_transaction"));
			
			//Update fields on transaction record
			var recordStatusField = docConfig.getFieldValue("custrecord_record_status_field");
			nlapiLogExecution("debug","Record Status Field to Use",recordStatusField);
			
			var recordStatusFieldValueSent = docConfig.getFieldValue("custrecord_status_field_value_sent");
			nlapiLogExecution("debug","Record Status Field Value to Use",recordStatusFieldValueSent);
			
			if(recordType!=null && recordStatusField!=null && recordStatusField!="" && recordStatusFieldValueSent!=null && recordStatusFieldValueSent!="")
				nlapiSubmitField(recordType,results[x].getValue(recordField),recordStatusField,recordStatusFieldValueSent); //Shipper's Declaration Status = Shipper's Decl. Requested
		}
	}
}

function SignNow_Check_Updates_SS()
{
	var results = nlapiSearchRecord("customrecord_custom_signnow_document","customsearchsignnow_pending_signature");
	
	if(results)
	{
		nlapiLogExecution("debug","# Results",results.length);
		
		var configId = nlapiGetContext().getSetting("SCRIPT","custscript_signnow_config");
		var config = nlapiLoadRecord("customrecord_signnow_token",configId);
		
		for(var x=0; x < results.length; x++)
		{
			//Get doc type data
			var docType = results[x].getValue("custrecord_document_type");
			
			//Check document in SignNow for updates
			var url = "https://api.signnow.com/document/" + results[x].getValue("custrecord_signnow_document_id");
			
			var headers = new Object();
			headers["Authorization"] = "Bearer " + config.getFieldValue("custrecord_access_token");
			
			var cResp = nlapiRequestURL(url,null,headers);
		
			nlapiLogExecution("debug","Response Code",cResp.getCode());
			nlapiLogExecution("debug","Response Body",cResp.getBody());
			
			var respBody = JSON.parse(cResp.getBody());
			var signatures = respBody.signatures;
			
			if(signatures!=null && signatures.length > 0)
			{
				var docConfig = nlapiLoadRecord("customrecord_signnow_doc_configuration",docType);
				
				//If signed, download document
				var url = "https://api.signnow.com/document/" + results[x].getValue("custrecord_signnow_document_id") + "/download?type=collapsed";
				
				var cResp = nlapiRequestURL(url,null,headers);
			
				nlapiLogExecution("debug","Response Code",cResp.getCode());
				nlapiLogExecution("debug","Response Body",cResp.getBody());
				
				var rawPDF = cResp.getBody();
				
				//Get original file name
				var fileName = nlapiLookupField("customrecord_custom_signnow_document",results[x].getId(),"custrecord_signnow_document",true);
				fileName = fileName.substring(0,fileName.length - 4) + "-signed.pdf";				
				
				var pdfFile = nlapiCreateFile(fileName,"PDF",rawPDF);
				pdfFile.setFolder("7671491");
				var pdfFileId = nlapiSubmitFile(pdfFile);
				
				//Update fields on custom record
				nlapiSubmitField("customrecord_custom_signnow_document",results[x].getId(),["custrecord_signnow_status","custrecord_signnow_document"],["3",pdfFileId]);
				
				var recordType = docConfig.getFieldValue("custrecord_doc_field_id_record_type");
				var recordField = docConfig.getFieldValue("custrecord_field_record_to_map");
				
				if(recordType=="transaction")
				{
					nlapiLogExecution("debug","Transaction Number",results[x].getText(recordField));
					
					switch(results[x].getText(recordField).substring(0,3))
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
				
				var fileFieldToUpdate = docConfig.getFieldValue("custrecord_record_document_field");
				nlapiLogExecution("debug","Record File Field to Use",fileFieldToUpdate);
				
				var statusFieldToUpdate = docConfig.getFieldValue("custrecord_record_status_field");
				nlapiLogExecution("debug","Record Status Field to Use",statusFieldToUpdate);
				
				var recordStatusFieldValueCompleted = docConfig.getFieldValue("custrecord_status_field_value_complete");
				nlapiLogExecution("debug","Record Status Field Value to Use",recordStatusFieldValueCompleted);
				
				var fieldsToUpdate = [];
				var dataToUpdate = [];
				
				if(statusFieldToUpdate!=null && statusFieldToUpdate!="" && recordStatusFieldValueCompleted!=null && recordStatusFieldValueCompleted!="")
				{
					fieldsToUpdate.push(statusFieldToUpdate);
					dataToUpdate.push(recordStatusFieldValueCompleted);
				}
				
				if(fileFieldToUpdate!=null && fileFieldToUpdate!="" && pdfFileId!=null && pdfFileId!="")
				{
					fieldsToUpdate.push(fileFieldToUpdate);
					dataToUpdate.push(pdfFileId);
				}
				
				if(fieldsToUpdate.length > 0 && recordField!=null && recordField!="" && recordType!=null && recordType!="")
					nlapiSubmitField(recordType,results[x].getValue(recordField),fieldsToUpdate,dataToUpdate);
			}
		}
	}
}
