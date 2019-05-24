nlapiLogExecution("audit","FLOStart",new Date().getTime());
/** 
 * Script Author : amlesh.singh@inoday.com (amlesh.singh@inoday.com)
 * Author Desig. : Lead Developer, Inoday Consultancy Service Pvt. Ltd.
 * Script Type   : Suitelet
 * Script Name   : pushDeleteCDPRecordToPortal.js
 * Created Date  : December 30, 2015
 * Last Modified Date : December 30, 2015
 * Comments : Script will push  deleted NS CDP Record to web portal link "https://partner.brilliantearth.com/api/cdp/"
 * URL: /app/common/scripting/script.nl?id=816&whence=
 * Production URL: /app/common/scripting/script.nl?id=833&whence=
 */
function pushDeleteCDPRecordToPortal(type)
{
    if(type == "delete")
    {
		try
		{
			var cdpId = nlapiGetRecordId(); 
			//var url = "https://partner.brilliantearth.com/api/cdp/delete-"+cdpId+"/";
			var url = "https://testportal.brilliantearth.com/api/cdp/delete-"+cdpId+"/";    
   
			var headers = new Array(); 
			headers['HTTP'] = "1.1";    
			headers['Accept'] = "application/json";       
			headers['Authorization']= "Token db9a136f31d2261b7f626bdd76ee7ffb44b00542";
			headers['Content-Type'] = "application/json"; 
			headers['User-Agent-x'] = "SuiteScript-Call";

 
			var jsonobj = {"cdp_id": parseInt(cdpId)} ;  
			//var myJSONText = JSON.stringify(jsonobj, replacer); 
			var response = nlapiRequestURL(url, null, headers,"DELETE");    
			//Below is being used to put a breakpoint in the debugger
			if(response.code=='200')
			{
				nlapiLogExecution('debug','Successfully deleted CDPID:'+cdpId+' from  Portal');
			}
		}
		catch(err)
		{
			  nlapiLogExecution("debug","Error occur during  : ",err.message); 
		}
	}
}

function replacer(key, value)
{
   if (typeof value == "number" && !isFinite(value))
   {
        return String(value);
   }
   return value;
}