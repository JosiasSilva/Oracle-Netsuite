nlapiLogExecution("audit","FLOStart",new Date().getTime());
function updateWeight(rec_type, rec_id)
{
	nlapiSubmitField(rec_type,rec_id,"weight",1,false)
}
