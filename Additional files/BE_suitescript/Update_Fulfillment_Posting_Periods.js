nlapiLogExecution("audit","FLOStart",new Date().getTime());
function massUpdate_Update_IF_Posting(rec_type, rec_id)
{
	var fulfillment = nlapiLoadRecord(rec_type,rec_id);
	var sales_order = fulfillment.getFieldValue("createdfrom");
	var so_date = ""
	if(sales_order!=null && sales_order!="")
	{
		so_date = nlapiLookupField("salesorder",sales_order,"trandate");
	}
	
	if(so_date!="")
		so_date = nlapiStringToDate(so_date);
		
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
	
	//fulfillment.setFieldText("postingperiod",posting_period)
	//nlapiSubmitRecord(fulfillment,false,true);
	
	var postingID
	switch(posting_period)
	{
		case "Jan 2011":
			postingID = 91;
			break;
		case "Feb 2011":
			postingID = 92;
			break;
		case "Mar 2011":
			postingID = 93;
			break;
		case "Apr 2011":
			postingID = 95;
			break;
		case "May 2011":
			postingID = 96;
			break;
		case "Jun 2011":
			postingID = 97;
			break;
		case "Jul 2011":
			postingID = 99;
			break;
		case "Aug 2011":
			postingID = 100;
			break;
		case "Sep 2011":
			postingID = 101;
			break;
		case "Oct 2011":
			postingID = 103;
			break;
		case "Nov 2011":
			postingID = 104;
			break;
		case "Dec 2011":
			postingID = 105;
			break;
	}
	
	nlapiSubmitField(rec_type,rec_id,"postingperiod",postingID);
}
