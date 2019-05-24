nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Script Author : Ajay kumar (ajay@inoday.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitelet
 * Script Name   : GenerateItemReceiptOfPO.js
 * Created Date  : Sept 16, 2016
 * Last Modified Date : Sept 16, 2016
 * Comments : Script will create Button 'Generate Item Receipt of PO' and on submit it created item receipt of PO......
 * Script URL : /app/common/scripting/script.nl?id=1066
 * Button URL : /app/site/hosting/scriptlet.nl?script=1066&deploy=1
 * Save Search URL : /app/common/search/searchresults.nl?searchid=4961
 */

//Suitelet that call Schedule Script
function GenerateItemReceipt(request, response)
{
	var form = nlapiCreateForm('Create Item Receipt of POs for Gem Design');		
	if ( request.getMethod() == 'GET' )
	{		
		form.addSubmitButton("Create Item Receipt");			
		response.writePage( form );
	}
	else if(request.getMethod() == 'POST')
	{
                var params = new Array();
                params['custscript_savedsearch_id9'] = 4961; //saved search id
		var result = nlapiScheduleScript('customscript1067', 'customdeploy1',params);  // 1067 is internal id of the scheduled script that you wish to reschedule and 1 is deployment id
		nlapiLogExecution("debug","Result is :",result);
		var formSavedLabel = null;
		if(result == 'QUEUED')
		{
			formSavedLabel = form.addField('custpage_form_saved', 'inlinehtml');
			formSavedLabel.setDefaultValue("<html><body><span style=\"font-size:30px;color:green;\">Item Receipt creation of related POs is in processing.Please wait and check execution status of schedule script id #1046.</span></body></html>");
			response.writePage(form);
		}
		else if(result == 'INQUEUE')
		{
			formSavedLabel = form.addField('custpage_form_saved', 'inlinehtml');
			formSavedLabel.setDefaultValue("<html><body><span style=\"font-size:30px;color:green;\">Schedule scriipt is inqueue for generating item receipt of related POs.Please wait and check execution status of scheduled script id #1046.</span></body></html>");
			response.writePage(form);
		}
    }
}
