nlapiLogExecution("audit","FLOStart",new Date().getTime());

var DATA_CENTER_URL = "";

function EmailReturnAuthorization(type, form) {
	var id = nlapiGetRecordId();
	var salesrepId = getSalesrepId(id);
	var rawPaymentMethod = getPaymentMethod(id);
	var emailRecipient = getEmailRecipient(id);
	var script = "";
	if (!salesrepId) {
		script = "alert('The SalesRepEmail is empty!');";
	} else if (!emailRecipient) {
		script = "alert('The EmailRecipient is empty!');";
	} else if (!rawPaymentMethod) {
		script = "alert('The PaymentMethod is empty!');";
	} else {
		
		getDataCenterURL();
		
		script = "window.open('" + DATA_CENTER_URL + "/app/site/hosting/scriptlet.nl?script=570&deploy=1&rtnauthid="
				+ id
				+ "','new','height=200,width=400,top=200,left=300,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')";
	}

	form.addButton('custpage_EmailReturnAuthorization',
			'Email Return Authorization', script);

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
