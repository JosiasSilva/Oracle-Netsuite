function SignNow_Auth()
{
	var headers = new Object();
	
	var configId = nlapiGetContext().getSetting("SCRIPT","custscript_signnow_config");
	
	if(configId!=null && configId!="")
	{
		var config = nlapiLoadRecord("customrecord_signnow_token",configId);
		
		var encoded_credentials = nlapiEncrypt(config.getFieldValue("custrecord_signnow_client_id")+":"+config.getFieldValue("custrecord_signnow_client_secret"),"base64");
		nlapiLogExecution("debug","Encoded Credentials",encoded_credentials);
		
		headers["Authorization"] = "Basic " + encoded_credentials;
		headers["Accept"] = "application/json";
		headers["Content-Type"] = "application/x-www-form-urlencoded";
		
		var body = "username=" + config.getFieldValue("custrecord_signnow_api_username");
			body+= "&password=" + escape(config.getFieldValue("custrecord_signnow_api_password"));
			body+= "&grant_type=password";
			
		var url = config.getFieldValue("custrecord_signnow_api_url_base") + "/oauth2/token";
			
		var cResp = nlapiRequestURL(url,body,headers);
		
		nlapiLogExecution("debug","Response Code",cResp.getCode());
		nlapiLogExecution("debug","Response Body",cResp.getBody());
		
		if(cResp.getCode()=="200")
		{
			var tokenResp = JSON.parse(cResp.getBody());
			
			var access_token = tokenResp.access_token;
			var refresh_token = tokenResp.refresh_token;
			
			config.setFieldValue("custrecord_access_token",access_token);
			config.setFieldValue("custrecord_refresh_token",refresh_token);
			
			nlapiSubmitRecord(config,true,true);
		}
	}
}
