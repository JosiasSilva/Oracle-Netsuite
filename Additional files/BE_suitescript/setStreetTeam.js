nlapiLogExecution("audit","FLOStart",new Date().getTime());
function setStreetTeam(type)
{
	try	
	{
		if(type=="create" || type=="edit")
		{
			if(nlapiGetNewRecord().getFieldValue("custbody106")=="T")
			{
				if(nlapiLookupField("customer",nlapiGetNewRecord().getFieldValue("entity"),"custentity41")!="T")
					nlapiSubmitField("customer",nlapiGetNewRecord().getFieldValue("entity"),"custentity41","T");
			}
			if(nlapiLookupField("customer",nlapiGetNewRecord().getFieldValue("entity"),"custentity41")=="T" && nlapiGetNewRecord().getFieldValue("custbody106")!="T")
			{
				nlapiSubmitField(nlapiGetRecordType,nlapiGetRecordId(),"custbody106","T");
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Syncing Street Team/Influencer Field","Details: " + err.message);
		return true;
	}
}
