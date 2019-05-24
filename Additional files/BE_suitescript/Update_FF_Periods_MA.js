nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Update_FF_Periods(rec_type, rec_id)
{
	try
	{
		var fulfillment = nlapiLoadRecord(rec_type,rec_id);
		var ffDate = fulfillment.getFieldValue("trandate");
		ffDate = nlapiStringToDate(ffDate);
		var ffMonth = ffDate.getMonth();
		
		switch(ffMonth)
		{
			case 0:
				fulfillment.setFieldValue("postingperiod","127");
				break;
			case 1:
				fulfillment.setFieldValue("postingperiod","128");
				break;
			case 11:
				fulfillment.setFieldValue("postingperiod","123");
				break;
		}
		
		nlapiSubmitRecord(fulfillment,true,true);
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Changing Period","Transaction: " + rec_id + ". Details: " + err.message);
		return true;
	}
}
