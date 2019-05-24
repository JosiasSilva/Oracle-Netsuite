function UK_VAT_Columns(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var order = nlapiGetNewRecord();
			
			if(order.getFieldValue("currency")=="2") //GBP orders only
			{
				var totalPrice = 0;
				var totalVAT = 0;
				var totalDuty = 0;
				
				for(var x=0; x < order.getLineItemCount("item"); x++)
				{
					var amount = order.getLineItemValue("item","amount",x+1);
					nlapiLogExecution("debug","Line # " + (x+1),"Amount: " + amount);
					
					var itemPrice = amount * 0.8130081301;
					var vatAmount = amount * 0.1666666667;
					var dutyAmount = amount * 0.0203252033;
					
					totalPrice += itemPrice;
					totalVAT += vatAmount;
					totalDuty += dutyAmount;
					
					nlapiLogExecution("debug","Line # " + (x+1),"Item Price: " + itemPrice);
					nlapiLogExecution("debug","Line # " + (x+1),"VAT Amount: " + vatAmount);
					nlapiLogExecution("debug","Line # " + (x+1),"Duty Amount: " + dutyAmount);
					
					nlapiSelectLineItem("item",x+1);
					nlapiSetCurrentLineItemValue("item","custcol_item_price",nlapiFormatCurrency(itemPrice));
					nlapiSetCurrentLineItemValue("item","custcol_vat_amount",nlapiFormatCurrency(vatAmount));
					nlapiSetCurrentLineItemValue("item","custcol_duty_amount",nlapiFormatCurrency(dutyAmount));
					nlapiCommitLineItem("item");
				}
				
				nlapiLogExecution("debug","Total Item Price",totalPrice);
				nlapiLogExecution("debug","Total VAT Amount",totalVAT);
				nlapiLogExecution("debug","Total Duty Amount",totalDuty);
				
				nlapiSetFieldValue("custbody_total_item_price",nlapiFormatCurrency(totalPrice,true,true));
				nlapiSetFieldValue("custbody_total_vat_amount",nlapiFormatCurrency(totalVAT,true,true));
				nlapiSetFieldValue("custbody_total_duty_amount",nlapiFormatCurrency(totalDuty,true,true));
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Updating UK Column Values","Details: " + err.message);
		}
	}
}
