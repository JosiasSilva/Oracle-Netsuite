nlapiLogExecution("audit","FLOStart",new Date().getTime());
function PO_Set_ToBeWatched(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var po = nlapiGetRecordId();
			var so = nlapiGetNewRecord().getFieldValue("createdfrom");
			
			if(so!=null && so!="")
			{	
				var results = nlapiSearchRecord("customer","customsearch707",new nlobjSearchFilter("internalid","transaction","is",so));
				if(results)
				{
					nlapiSubmitField("purchaseorder",po,"custbody129","T");
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting PO To Be Watched","Details: " + err.message);
			return true;
		}
	}
}
