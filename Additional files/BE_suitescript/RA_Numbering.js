nlapiLogExecution("audit","FLOStart",new Date().getTime());
function RA_Numbering(type)
{
	if(type=="create" || type=="copy")
	{
		try
		{
			var createdfrom = nlapiGetFieldValue("createdfrom");
			if(createdfrom!=null && createdfrom!="")
			{
				var tranid = nlapiLookupField("salesorder",createdfrom,"tranid") + "RT";
				nlapiSetFieldValue("tranid",tranid,true,true);
			}
		}
		catch(err)
		{
			
		}
	}
}
