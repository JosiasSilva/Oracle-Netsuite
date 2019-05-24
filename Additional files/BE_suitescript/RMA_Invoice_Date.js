nlapiLogExecution("audit","FLOStart",new Date().getTime());
function RMA_Invoice_Date(type)
{
	if(type=="create")
	{
		try
		{
			//Add invoice date to RMA
			var rma = nlapiGetNewRecord();
			var created_from = rma.getFieldValue("createdfrom");
			
			var filters = [];
			filters.push(new nlobjSearchFilter("createdfrom",null,"is",created_from));
			filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
			var cols = [];
			cols.push(new nlobjSearchColumn("trandate"));
			var results = nlapiSearchRecord("invoice",null,filters,cols);
			if(results)
			{
				nlapiSetFieldValue("custbody_invoice_date",results[0].getValue("trandate"));
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Invoice Date","Details: " + err.message);
			return tue;
		}
	}
}
