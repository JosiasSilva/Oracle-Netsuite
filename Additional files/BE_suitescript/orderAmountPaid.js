nlapiLogExecution("audit","FLOStart",new Date().getTime());
function findAmountPaid(order)
{	
	try
	{
		if(order==null || order=="")
		return null;
	
		var filters = [];
		filters.push(new nlobjSearchFilter("createdfrom",null,"is",order))
		filters.push(new nlobjSearchFilter("mainline",null,"is","T"))
		
		var cols = [];
		cols.push(new nlobjSearchColumn("amountpaid"));
		
		var amtPaid = 0.00;
		
		var results = nlapiSearchRecord("invoice",null,filters,cols)
		if(results)
		{
			for(var x=0; x < results.length; x++)
			{
				amtPaid += parseFloat(results[x].getValue("amountpaid"));
			}
		}
		else
		{
			return null;
		}
		
		return amtPaid;	
	}
	catch(err)
	{
		nlapiLogExecution("error","Order Paid Calc Error","Error calculating amount paid on order ID " + order + ". Details: " + err.message);
		return null;
	}
}

function amountPaid_MA(rec_type,rec_id)
{
	try
	{
		var amountPaid = findAmountPaid(rec_id);
		if(amountPaid!=null && amountPaid!="")
			nlapiSubmitField("salesorder",rec_id,"custbody_so_amount_paid",amountPaid);
	}
	catch(err)
	{
		nlapiLogExecution("error","Amount Paid Mass Update Error","Details: " + err.message);
		return true;
	}
}

function setAmountPaid_UE(type)
{
	if(type=="create")
	{
		if(nlapiGetRecordType()=="CustInvc")
		{
			//Invoice Handling
			try
			{
				var invoice = nlapiGetRecordId();
				var salesorder = nlapiLookupField("invoice",invoice,"createdfrom");
				if(salesorder!=null && salesorder!="")
				{
					var amountPaid = findAmountPaid(salesorder);
					if(amountPaid!=null && amountPaid!="")
						nlapiSubmitField("salesorder",salesorder,"custbody_so_amount_paid",amountPaid);
				}
			}
			catch(err)
			{
				nlapiLogExecution("error","SO Amount Paid (Invoice) Error","Error while updating paid on sales order related to invoice ID " + invoice + ". Details: " + err.message);
				return true;
			}
		}
		if(nlapiGetRecordType()=="CustPymt")
		{
			//Customer Payment Handling
			try
			{
				var payment = nlapiGetRecordId();
				
				var filters = [];
				filters.push(new nlobjSearchFilter("internalid",null,"is",payment));
				
				var cols = [];
				cols.push(new nlobjSearchColumn("appliedtotransaction",null,"group"));
				
				var results = nlapiSearchRecord("customerpayment",null,filters,cols);
				if(results)
				{
					for(var x=0; x < results.length; x++)
					{
						var salesorder = nlapiLookupField("invoice",results[x].getValue("appliedtotransaction",null,"group"),"createdfrom");
						if(salesorder!=null && salesorder!="")
						{
							var amountPaid = findAmountPaid(salesorder);
							if(amountPaid!=null && amountPaid!="")
								nlapiSubmitField("salesorder",salesorder,"custbody_so_amount_paid",amountPaid);
						}
					}
				}
			}
			catch(err)
			{
				nlapiLogExecution("error","SO Amount Paid (Payment) Error","Error calculating amount paid for all sales orders related to customer payment ID " + payment + ". Details: " + err.message);
				return true;
			}
		}
	}
}
