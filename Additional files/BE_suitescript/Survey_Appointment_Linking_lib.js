function survey_appointment_linking(apptmtId)
{
	try
	{
		nlapiLogExecution('debug', 'apptmtId Received in survey_appointment_linking: ', apptmtId);
		var loadedapptmt = nlapiLoadRecord('calendarevent', apptmtId);
		var customer_rec_id = loadedapptmt.getFieldValue('company');
		var survey_search = nlapiSearchRecord("customrecord848", null, [["custrecord_added_to_appt", "is", "F"], "AND", ["custrecord_customer", "is", customer_rec_id]], [new nlobjSearchColumn("id").setSort(false)]);
		nlapiLogExecution('debug', 'customer_rec_id: ', customer_rec_id);
		if(survey_search && survey_search.length != 0)
		{
			nlapiLogExecution('debug', 'Entered if: ');
			var survey_id_arr = [];
			var survey_id;
			for(var c = 0; c < survey_search.length; c++)
			{
				nlapiLogExecution('debug', 'Entered for: ');
				survey_id = survey_search[c].getValue('id', null, null);
				nlapiLogExecution('debug', 'survey_id: ', survey_id);
				survey_id_arr.push(survey_id);
			}
			nlapiLogExecution('debug', 'survey_id_arr: ', JSON.stringify(survey_id_arr));
			if(survey_id_arr && survey_id_arr.length != 0)
			{
				nlapiLogExecution('debug', 'Entered if: ');
				loadedapptmt.setFieldValue('custevent_survey', survey_id_arr);
				var saved_appointment = nlapiSubmitRecord(loadedapptmt, true, true);
			}
		}
	}
	catch(ex)
	{
		nlapiLogExecution('Debug', 'Exception Occured in survey_appointment_linking() for apptmtId: ' + apptmtId, ex.message);
	}
}