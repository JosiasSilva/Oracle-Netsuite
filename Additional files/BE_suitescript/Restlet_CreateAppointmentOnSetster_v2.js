var DATA_CENTER_URL = "";

function getAllAppointment(){

var a = {"User-Agent-x": "SuiteScript-Call"};
nlapiRequestURL('https://webservices.na3.netsuite.com/wsdl/v1_2_0/netsuite.wsdl', null, a, handleResponse);
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

function getDataCenterURL()
{
	var environment = nlapiGetContext().getEnvironment();
	
	var filters = [];
	filters.push(new nlobjSearchFilter("name",null,"is",environment));
	var cols = [];
	cols.push(new nlobjSearchColumn("custrecord_data_center_url"));
	var results = nlapiSearchRecord("customrecord_data_center_url",null,filters,cols);
	if(results)
		DATA_CENTER_URL = results[0].getValue("custrecord_data_center_url");
}