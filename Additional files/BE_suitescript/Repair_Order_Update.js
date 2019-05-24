nlapiLogExecution("audit","FLOStart",new Date().getTime());
function updateRepair(rec_type,rec_id)
{
	try
	{
		nlapiSubmitField("salesorder",rec_id,"custbody87","3");
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating Order","Details: " + err.message);
		return true;
	}
}
