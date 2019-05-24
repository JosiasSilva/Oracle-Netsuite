function Update_IF_Posting(type)
{
	if(type=="create")
	{
		try
		{
			var fulfillment = nlapiLoadRecord("itemfulfillment",nlapiGetRecordId());
			var sales_order = fulfillment.getFieldValue("createdfrom");
			var so_date = ""
			if(sales_order!=null && sales_order!="")
			{
				so_date = nlapiLookupField("salesorder",sales_order,"trandate");
			}
			
			if(so_date!=""  && so_date!=null)
				so_date = nlapiStringToDate(so_date);
			else
				return true
				
			var ifDate = nlapiStringToDate(fulfillment.getFieldValue("trandate"));
			var ifYear = ifDate.getFullYear();
			var soYear = so_date.getFullYear();
			
			if(currentYear != ifYear)
				return true;
				
			var month = so_date.getMonth();
			var year = so_date.getFullYear();
			
			var posting_period = "";
			switch(month)
			{
				case 0:
					posting_period += "Jan " + year;
					break;
				case 1:
					posting_period += "Feb " + year;
					break;
				case 2:
					posting_period += "Mar " + year;
					break;
				case 3:
					posting_period += "Apr " + year;
					break;
				case 4:
					posting_period += "May " + year;
					break;
				case 5:
					posting_period += "Jun " + year;
					break;
				case 6:
					posting_period += "Jul " + year;
					break;
				case 7:
					posting_period += "Aug " + year;
					break;
				case 8:
					posting_period += "Sep " + year;
					break;
				case 9:
					posting_period += "Oct " + year;
					break;
				case 10:
					posting_period += "Nov " + year;
					break;
				case 11:
					posting_period += "Dec " + year;
					break;
			}
			
			fulfillment.setFieldText("postingperiod",posting_period)
			nlapiSubmitRecord(fulfillment,false,true);
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Updating IF Posting Period","Error syncing posting period on item fulfillment ID " + nlapiGetRecordId() + ". Details: " + err.message)
			return true
		}
	}
}
