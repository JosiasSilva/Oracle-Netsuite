nlapiLogExecution("audit","FLOStart",new Date().getTime());
var UNIQUE_NY = "7773";

function Update_PD_Vendor_UNY(rec_type,rec_id)
{
	try
	{
		var record = nlapiLoadRecord(rec_type,rec_id);

		for(var x=0; x < record.getLineItemCount("itemvendor"); x++)
		{
			if(record.getLineItemValue("itemvendor","vendor",x+1)==UNIQUE_NY)
			{
				record.setLineItemValue("itemvendor","preferredvendor",x+1,"T");
				break;
			}
		}
		
		nlapiSubmitRecord(record,true,true);
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating PD Pref Vendor","Details: " + err.message);
		return true;
	}
}
