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
			
			var emailMerger = nlapiCreateEmailMerger(config.getFieldValue("custrecord_signnow_email_template"));
			emailMerger.setEntity("customer",results[x].getValue("custrecord_signnow_customer"));
			//emailMerger.setTransaction(results[x].getValue("custrecord_signnow_transaction"));
			emailMerger.setCustomRecord("customrecord_custom_signnow_document",results[x].getId());
			
			var mergeResult = emailMerger.merge();
			
			var records = new Object();
			records["recordtype"] = "customrecord_custom_signnow_document";
			records["record"] = results[x].getId();
			//records["transaction"] = results[x].getValue("custrecord_signnow_transaction");
			records["entity"] = results[x].getValue("custrecord_signnow_customer");
			
			nlapiSendEmail("20561",results[x].getValue("custrecord_signnow_customer"),"Your Brilliant Earth Return Shipment - Information Needed",mergeResult.getBody(),null,null,records,null,false);
			
			nlapiLogExecution("debug","TransactionType: " + results[x].getValue("type","custrecord_signnow_transaction"));
			
			//Update fields on transaction record
			var transactionType = null;
			switch(results[x].getValue("type","custrecord_signnow_transaction"))
			{
				case "RTNAUTH":
				case "RtnAuth":
					transactionType = "returnauthorization";
					break;
				case "SALESORD":
				case "SalesOrd":
					transactionType = "salesorder";
					break;
				case "CUSTINVC":
				case "CustInvc":
					transactionType = "invoice";
					break;
				case "ITEMSHIP":
				case "ItemShip":
					transactionType = "itemfulfillment";
					break;
			}
			nlapiSubmitField(transactionType,results[x].getValue("custrecord_signnow_transaction"),"custbody297","1"); //Shipper's Declaration Status = Shipper's Decl. Requested
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
				//If signed, download document
				var url = "https://api.signnow.com/document/" + results[x].getValue("custrecord_signnow_document_id") + "/download?type=collapsed";
				
				var cResp = nlapiRequestURL(url,null,headers);
			
				nlapiLogExecution("debug","Response Code",cResp.getCode());
				nlapiLogExecution("debug","Response Body",cResp.getBody());
				
				var rawPDF = cResp.getBody();
				
				//Need to Base 64 encode to create PDF file in NetSuite
				//var encodedPDF = nlapiEncrypt(rawPDF,"base64");
				
				//Get original file name
				var fileName = nlapiLookupField("customrecord_custom_signnow_document",results[x].getId(),"custrecord_signnow_document",true);
				fileName = fileName.substring(0,fileName.length - 4) + "-signed.pdf";				
				
				var pdfFile = nlapiCreateFile(fileName,"PDF",rawPDF);
				pdfFile.setFolder("7671491");
				var pdfFileId = nlapiSubmitFile(pdfFile);
				
				//Update fields on custom record
				nlapiSubmitField("customrecord_custom_signnow_document",results[x].getId(),["custrecord_signnow_status","custrecord_signnow_document"],["3",pdfFileId]);
			
				//Update fields on transaction record
				nlapiLogExecution("debug","Transaction Type",results[x].getValue("type","custrecord_signnow_transaction"));
				
				var transactionType = null;
				switch(results[x].getValue("type","custrecord_signnow_transaction"))
				{
					case "RTNAUTH":
					case "RtnAuth":
						transactionType = "returnauthorization";
						break;
					case "SALESORD":
					case "SalesOrd":
						transactionType = "salesorder";
						break;
					case "CUSTINVC":
					case "CustInvc":
						transactionType = "invoice";
						break;
					case "ITEMSHIP":
					case "ItemShip":
						transactionType = "itemfulfillment";
						break;
				}
				
				nlapiSubmitField(transactionType,results[x].getValue("custrecord_signnow_transaction"),["custbody297","custbody320"],["2",pdfFileId]); //Shipper's Declaration Status = Shipper's Decl. Received
			}
		}
	}
}
