nlapiLogExecution("audit","FLOStart",new Date().getTime());
function updateTaxable(rec_type, rec_id)
{
	nlapiSubmitField(rec_type,rec_id,"istaxable","T",false)
	//var item = nlapiLoadRecord(rec_type,rec_id)
	//item.setFieldValue("istaxable","T")
	//nlapiSubmitRecord(item,false,true)
}