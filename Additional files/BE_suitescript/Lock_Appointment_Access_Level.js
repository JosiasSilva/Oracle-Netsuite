nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Lock_Appt_Access_Level(type,form)
{
	try
	{
		if(type=="create" || type=="edit" || type=="copy")
		{
			var user = nlapiGetUser();
			if(user!="18918" && user!="20186")
			{
				//Lock field for all users other than Rachel Flaata
				var field = form.getField("accesslevel");
				field.setDisplayType("hidden");
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Locking Field","Details: " + err.message);
		return true;
	}
}
