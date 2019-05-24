nlapiLogExecution("audit","FLOStart",new Date().getTime());
function SetPTO_Supervisor(type)
{
	try
	{
		if(type == "create" || type == "edit")
		{
            nlapiLogExecution("debug","Event type is :", type);		
			var ptoId = nlapiGetRecordId();
			var empId = nlapiLookupField("customrecord_pto",ptoId,"custrecord_pto_employee");
			var ptoSupervisorVal = nlapiLookupField("employee",empId,"custentity109");
			if(ptoSupervisorVal != null)
			{
				var ptoArr = ptoSupervisorVal.split(',');
				nlapiLogExecution("debug","PTO Supervisor field value is : ",ptoArr);
				nlapiSubmitField("customrecord_pto",ptoId,"custrecord_pto_other_supervisor",ptoArr);
				nlapiLogExecution("debug","Successfully submited PTO Supervisor field with selected employee");
			}
		}		
	}
	catch(e)
	{
		nlapiLogExecution("debug","Error raised on PTO supervisor field submission is : ",e.message);
	}
}