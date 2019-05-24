nlapiLogExecution("audit","FLOStart",new Date().getTime());
function updateResize(rec_type,rec_id)
{
	try
	{
		nlapiSubmitField("salesorder",rec_id,"custbody87","2");
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating Order","Details: " + err.message);
		return true;
	}
}
