nlapiLogExecution("audit","FLOStart",new Date().getTime());
/*
 * Last Payment Date
 * 
 * Type: User Event
 * Execution: After Submit
 * 
 * Record(s): Customer Payment
 */

function lastPaymentDate(type)
{
	if(type=="create")
	{
		try
		{
			var paymentID = nlapiGetRecordId();
			var paymentDate = nlapiGetNewRecord().getFieldValue("trandate");
			
			var filters = [];
			var cols = [];
			
			filters.push(new nlobjSearchFilter("internalid",null,"is",paymentID));
			filters.push(new nlobjSearchFilter("appliedtotransaction",null,"noneof","@NONE@"));
			filters.push(new nlobjSearchFilter("createdfrom","appliedtotransaction","noneof","@NONE@"));
			
			cols.push(new nlobjSearchColumn("createdfrom","appliedtotransaction","group"));
			
			var results = nlapiSearchRecord("customerpayment",null,filters,cols);
			if(results!=null)
			{
				for(var x=0; x < results.length; x++)
				{
					if(nlapiLookupField("salesorder",results[x].getId(),"customform")=="135")
						nlapiSubmitField("salesorder",results[x].getValue("createdfrom","appliedtotransaction","group"),"custbody115",paymentDate);
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Last Payment Date","Details: " + err.message);
			return true;
		}
	}
}
