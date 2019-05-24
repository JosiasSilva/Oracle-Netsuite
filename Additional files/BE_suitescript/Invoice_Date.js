function Invoice_Date(type)
{
	if(type=="create")
	{
		try
		{
			var invoice = nlapiGetNewRecord();
			var invoiceDate = invoice.getFieldValue("trandate");
			var salesOrder = invoice.getFieldValue("createdfrom");
			if(salesOrder!=null && salesOrder!="")
			{
				nlapiSubmitField("salesorder",salesOrder,"custbody_invoice_date",invoiceDate);
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Adding Invoice Date To SO","Details: " + err.message);
			return true;
		}
	}
}
