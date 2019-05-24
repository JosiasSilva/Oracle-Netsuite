nlapiLogExecution("audit","FLOStart",new Date().getTime());
//Suitelet that call Schedule Script
function GenerateItemReceipt(request, response)
{
	var form = nlapiCreateForm('Create Item Receipt of POs for Guild and Facet');		
	if ( request.getMethod() == 'GET' )
	{		
		form.addSubmitButton("Create Item Receipt");			
		response.writePage( form );
	}
	else if(request.getMethod() == 'POST')
	{
                 var params = new Array();
                 params['custscript_savedsearch_id_guild_facet'] = 5248;
		var result = nlapiScheduleScript('customscript_schedule_guild_facet', 'customdeploy_schedule_guild_facet',params);  // 1120 is internal id of the scheduled script that you wish to reschedule and 1 is deployment id
		nlapiLogExecution("debug","Result is :",result);
		var formSavedLabel = null;
		if(result == 'QUEUED')
		{
			formSavedLabel = form.addField('custpage_form_saved', 'inlinehtml');
			formSavedLabel.setDefaultValue("<html><body><span style=\"font-size:30px;color:green;\">Item Receipt creation of related POs is in processing.Please wait and check execution status of schedule script id #1120.</span></body></html>");
			response.writePage(form);
		}
		else if(result == 'INQUEUE')
		{
			formSavedLabel = form.addField('custpage_form_saved', 'inlinehtml');
			formSavedLabel.setDefaultValue("<html><body><span style=\"font-size:30px;color:green;\">Schedule scriipt is inqueue for generating item receipt of related POs.Please wait and check execution status of scheduled script id #1120.</span></body></html>");
			response.writePage(form);
		}
    }
}
