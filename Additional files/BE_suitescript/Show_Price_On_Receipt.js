nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Show_Price_On_Receipt(type)
{
	try
	{
		if(type=="create" || type=="edit")
		{
			var recordID = nlapiGetRecordId();
			var show_price_on_receipt = nlapiGetNewRecord().getFieldValue("custbody97");
			if(type=="create" && show_price_on_receipt!="T")
			{
				var order = nlapiLoadRecord("salesorder",recordID);
				order.setFieldValue("customform","130");
				nlapiSubmitRecord(order,true,true);
			}
			else if(type=="edit" && show_price_on_receipt!="T" && nlapiGetNewRecord().getFieldValue("customfor")!="130")
			{
				var order = nlapiLoadRecord("salesorder",recordID);
				order.setFieldValue("customform","130");
				nlapiSubmitRecord(order,true,true);
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Switching Forms","Details: " + err.message);
		return true;
	}
}