nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Set_GE_Receipt_Value(type)
{
	if(type=="create")
	{
		
		try
		{
			var order = nlapiGetNewRecord();
			
			if(order.getFieldValue("custbody128")!="2" && order.findLineItemValue("item","item","1587992")!=-1)
			{
				nlapiSetFieldValue("custbody128","3"); //Set to GE$ Receipt Needed
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting GE$ Receipt Field","Details: " + err.message);
			return true;
		}
	}
}
