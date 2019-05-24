nlapiLogExecution("audit","FLOStart",new Date().getTime());
function fieldChange(type,name)
{
  if( name=='custbodyinvoice_date')
	{
		var formType=nlapiGetFieldValue('customform');
		if(formType=='239')
		{
			var invoice_date=nlapiGetFieldValue('custbodyinvoice_date');
			var date= nlapiStringToDate (invoice_date);
			var month=date.getMonth()+1;
			var year=date.getFullYear();
			var posting_period_value;
			if(month==7 && year==2017)
			{
				posting_period_value=207;
			}
			else if(month==8 && year==2017)
			{
				posting_period_value=208;
			}
			else if(month==9 && year==2017)
			{
				posting_period_value=209;
			}
			else if(month==10 && year==2017)
			{
				posting_period_value=211;
			}
			else if(month==10 && year==2017)
			{
				posting_period_value=211;
			}
			else if(month==11 && year==2017)
			{
				posting_period_value=212;
			}
			else if(month==13 && year==2017)
			{
				posting_period_value=213;
			}
			else if(month<7 && year==2017)
			{
				posting_period_value=207;
			}
			
			if(posting_period_value)
			{
			  nlapiSetFieldValue('custbody_invoice_approval_period',posting_period_value,true,true)
			}
		}
	}
   return true;
}

