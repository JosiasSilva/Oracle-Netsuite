nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Set_Sales_Order_Number(type)
{
	if(type=="create" && nlapiGetContext().getExecutionContext()=="userinterface")
	{
		try
		{
			//Get next number in line
			var next_number = nlapiLookupField("customrecord_sales_order_number",1,"custrecord_sales_order_next_number");
			var today = new Date();
			var year = today.getFullYear();
			year = year.toString();
			nlapiSetFieldValue("tranid",year+""+next_number);
			
			//Increment number
			next_number = parseInt(next_number);
			next_number++;
			
			//Save back to custom record
			nlapiSubmitField("customrecord_sales_order_number",1,"custrecord_sales_order_next_number",next_number.toString());
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting SO #","Details: " + err.message);
			return true;
		}
	}
}
