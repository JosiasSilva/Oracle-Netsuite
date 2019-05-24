function highlight_GE_Receipt(type,form)
{
	if(type=="edit" || type=="view")
	{
		try
		{
			var orderID = nlapiGetRecordId();
			
			//Verify GE$ Receipt field is not 'GE$ Receipt Received'
			if(nlapiGetNewRecord().getFieldValue("custbody128")=="2")
				return true;
			
			//Verify payment method of customer payment is 'GE Money Financing'	
			var filters = [];
			filters.push(new nlobjSearchFilter("createdfrom","appliedtotransaction","is",orderID));
			//filters.push(new nlobjSearchFilter("paymentmethod",null,"is","15"));
			//filters.push(new nlobjSearchFilter("formulatext",null,"is","GE Money Financing").setFormula("{paymentmethod}"))
			//var cols = [new nlobjSearchColumn("paymentmethod")];
			
			var results = nlapiSearchRecord("customerpayment",null,filters);
			if(results!=null)
			{
				//nlapiLogExecution("debug","Payment Method",results[0].getValue("paymentmethod"));
				
				for(var x=0; x < results.length; x++)
				{
					if(nlapiLoadRecord("customerpayment",results[x].getId()).getFieldValue("paymentmethod")=="15")
					{
						//Highlight GE$ Receipt field
						var	field = form.addField("custpage_highlight_ge_receipt","inlinehtml","Highlight GE Receipt");
						field.setDefaultValue("<script type='text/javascript'>document.getElementById('custbody128_fs_lbl').parentNode.parentNode.style.backgroundColor='yellow';</script>");
						break;	
					}	
				}
			}
			else
			{
				nlapiLogExecution("debug","No paying transaction found")
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Script Error","Error highlighting GE$ Receipt field on Sales Order ID " + orderID + ". Details: " + err.message);
			return true;
		}
	}
}
