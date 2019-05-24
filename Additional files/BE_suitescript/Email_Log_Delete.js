function Email_Log_Delete(rec_type,rec_id)
{
	try
	{
		nlapiDeleteRecord("customrecord_incoming_email_log",rec_id);
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Deleting Email Log Record ID " + rec_id,"Details: " + err.message);
	}
}
