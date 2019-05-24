nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Last_Diamond_Email()
{
	var results = nlapiSearchRecord("customrecord_custom_diamond","customsearch1388");
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			try
			{
				var timestamp = results[x].getValue("messagedate","messages","max");
				nlapiSubmitField("customrecord_custom_diamond",results[x].getValue("internalid",null,"group"),"custrecord_diamond_last_vendor_email",timestamp);
			}
			catch(err)
			{
				nlapiLogExecution("error","Error Updating Last Vendor Email Time","Details: " + err.message);
			}
		}
	}
}
