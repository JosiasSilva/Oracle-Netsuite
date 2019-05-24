nlapiLogExecution("audit","FLOStart",new Date().getTime());
function getAllAppointment(){
var a = {"User-Agent-x": "SuiteScript-Call"};
nlapiRequestURL('https://webservices.netsuite.com/wsdl/v1_2_0/netsuite.wsdl', null, a, handleResponse);
function handleResponse(response)
{
	var headers = response.getAllHeaders();
	var output = 'Code: '+response.getCode()+'\n';
	output += 'Headers:\n';
	for (var i in headers)
		output += i + ': '+headers[i]+'\n';
		output += '\n\nBody:\n\n';
		output += response.getBody();
		alert( output );
}
}
