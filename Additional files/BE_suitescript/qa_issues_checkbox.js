nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Customer_QA_Checkbox(type)
{
	if(type=="view" || type=="edit")
	{
		try
		{
			var customer = nlapiGetRecordId();
			var filters = [];
			filters.push(new nlobjSearchFilter("entity","custrecord3","is",customer));
			var results = nlapiSearchRecord("customrecord32",null,filters);
			if(results)
			{
				nlapiSetFieldValue("custentity_qa_issues","T");
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Checking QA Box","Details: " + err.message);
			return true;
		}
	}
}
