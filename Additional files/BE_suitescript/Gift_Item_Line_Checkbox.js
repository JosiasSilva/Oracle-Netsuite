nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Gift_Item_Line_Checkbox(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var order = nlapiGetNewRecord();
			
			for(var x=0; x < order.getLineItemCount("item"); x++)
			{
				var category = order.getLineItemValue("item","custcol_category",x+1);
				var amount = order.getLineItemValue("item","amount",x+1);
				
				if(amount==0.00 && (category=="4" || category=="5" || category=="9" || category=="34"))
				{
					nlapiSetLineItemValue("item","custcol_gift_item",x+1,"T");
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Marking Gift Checkbox","Details: " + err.message);
		}
	}
}
