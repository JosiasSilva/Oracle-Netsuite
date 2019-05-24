nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Setster_Auth()
{
	//Get email and auth token
	var authDetails = nlapiLookupField("customrecord_setster_authentication","1",["custrecord_setster_auth_email","custrecord_setster_auth_token"]);
	
	var url = "https://www.setster.com/api/v2/account/authenticate?email=" + authDetails.custrecord_setster_auth_email + "&token=" + authDetails.custrecord_setster_auth_token;
	
	var curl = nlapiRequestURL(url,null,null,"POST");
	
	var session_token = null;
	
	if(curl.getCode()=="200")
	{
		var body = curl.getBody();
		
		if(body!=null && body!="")
		{
			body = JSON.parse(body);
			
			session_token = body.data.session_token;
			
			nlapiSubmitField("customrecord_setster_authentication","1","custrecord_setster_auth_session_token",session_token);
		}
	}
	
	return session_token;
}

function Get_Setster_Token_SS()
{
	var newToken = Setster_Auth();
}
