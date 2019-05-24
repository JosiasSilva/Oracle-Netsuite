function SignNow_Check_Status_SL(request,response)
{
	var configId = nlapiGetContext().getSetting("SCRIPT","custscript_signnow_config");
	var config = nlapiLoadRecord("customrecord_signnow_token",configId);
	
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",request.getParameter("record")));
	filters.push(new nlobjSearchFilter("mainline","custrecord_signnow_transaction","is","T"));
	var cols = [];
	cols.push(new nlobjSearchColumn("custrecord_document_type"));
	cols.push(new nlobjSearchColumn("custrecord_signnow_document_id"));
	cols.push(new nlobjSearchColumn("custrecord_signnow_transaction"));
	cols.push(new nlobjSearchColumn("custrecord_signnow_customer"));
	cols.push(new nlobjSearchColumn("custrecord_signnow_document"));
	cols.push(new nlobjSearchColumn("custrecord_signnow_status"));
	cols.push(new nlobjSearchColumn("custrecord_signnow_date_sent"));
	cols.push(new nlobjSearchColumn("custrecord_signnow_document_id"));
	cols.push(new nlobjSearchColumn("type","custrecord_signnow_transaction"));
	var results = nlapiSearchRecord("customrecord_custom_signnow_document",null,filters,cols);
	if(results)
	{
		//Get doc type data
		var docType = results[0].getValue("custrecord_document_type");
		
		//Check document in SignNow for updates
		var url = "https://api.signnow.com/document/" + results[0].getValue("custrecord_signnow_document_id");
		
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
			var url = "https://api.signnow.com/document/" + results[0].getValue("custrecord_signnow_document_id") + "/download?type=collapsed";
			
			var cResp = nlapiRequestURL(url,null,headers);
		
			nlapiLogExecution("debug","Response Code",cResp.getCode());
			nlapiLogExecution("debug","Response Body",cResp.getBody());
			
			var rawPDF = cResp.getBody();
			
			//Get original file name
			var fileName = nlapiLookupField("customrecord_custom_signnow_document",results[0].getId(),"custrecord_signnow_document",true);
			fileName = fileName.substring(0,fileName.length - 4) + "-signed.pdf";				
			
			var pdfFile = nlapiCreateFile(fileName,"PDF",rawPDF);
			pdfFile.setFolder("7671491");
			var pdfFileId = nlapiSubmitFile(pdfFile);
			
			//Update fields on custom record
			nlapiSubmitField("customrecord_custom_signnow_document",results[0].getId(),["custrecord_signnow_status","custrecord_signnow_document"],["3",pdfFileId]);
			
			var recordType = docConfig.getFieldValue("custrecord_doc_field_id_record_type");
			var recordField = docConfig.getFieldValue("custrecord_field_record_to_map");
			
			if(recordType=="transaction")
			{
				nlapiLogExecution("debug","Transaction Number",results[0].getText(recordField));
				
				switch(results[0].getText(recordField).substring(0,3))
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
				nlapiSubmitField(recordType,results[0].getValue(recordField),fieldsToUpdate,dataToUpdate);
		}
	}
	
	var script = "<script>window.opener.location.reload(); this.close();</script>";
	
	response.write(script);
}
