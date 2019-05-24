function UK_VAT_Columns(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var order = nlapiGetNewRecord();
			
			if(order.getFieldValue("shipcountry")=="GB") //GBP orders only
			{
				var totalPrice = 0;
				var totalVAT = 0;
				var totalDuty = 0;
				
				if(order.getFieldValue("total")==0.00)
				{
					nlapiLogExecution("debug","$0 order. Script will not run.");
					return true;
				}
				
				for(var x=0; x < order.getLineItemCount("item"); x++)
				{
					var itemPrice = order.getLineItemValue("item","custcol_item_price",x+1);
					var quantity = order.getLineItemValue("item","quantity",x+1);
					var rate = order.getLineItemValue("item","rate",x+1);
					var amount = order.getLineItemValue("item","amount",x+1);
					
					if(amount==0.00)
						continue;
					
					//If value is entered into unit price and/or amount then clear item price column/value
					if((rate!=null && rate!="") || (amount!=null && amount!=""))
					{
						itemPrice = null;
					}
					else if((itemPrice!=null && itemPrice!=""))
					{
						rate = null;
						amount = null;
					}
					
					if(itemPrice!=null && itemPrice!="" && itemPrice!=0)
					{
						nlapiLogExecution("debug","Line # " + (x+1),"Item Price: " + itemPrice);
						
						var rate = itemPrice / 0.8130081301;
						var amount = rate * quantity;
						
						itemPrice = itemPrice * quantity;
						
						var vatAmount = amount * 0.1666666667;
						var dutyAmount = amount * 0.0203252033;
						
						totalPrice += itemPrice;
						totalVAT += vatAmount;
						totalDuty += dutyAmount;
						
						nlapiLogExecution("debug","Line # " + (x+1),"Rate: " + rate);
						nlapiLogExecution("debug","Line # " + (x+1),"Amount: " + amount);
						nlapiLogExecution("debug","Line # " + (x+1),"VAT Amount: " + vatAmount);
						nlapiLogExecution("debug","Line # " + (x+1),"Duty Amount: " + dutyAmount);
						
						nlapiSelectLineItem("item",x+1);
						var qb = nlapiGetCurrentLineItemValue("item","quantitybackordered");
						if(qb!=null && qb!="")
							nlapiSetCurrentLineItemValue("item","quantitybackordered",qb.toFixed(5));
						nlapiSetCurrentLineItemValue("item","rate",nlapiFormatCurrency(rate));
						nlapiSetCurrentLineItemValue("item","amount",nlapiFormatCurrency(amount));
						nlapiSetCurrentLineItemValue("item","custcol_item_price",nlapiFormatCurrency(itemPrice));
						nlapiSetCurrentLineItemValue("item","custcol_vat_amount",nlapiFormatCurrency(vatAmount));
						nlapiSetCurrentLineItemValue("item","custcol_duty_amount",nlapiFormatCurrency(dutyAmount));
						nlapiCommitLineItem("item");
					}
					else
					{
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
						var qb = nlapiGetCurrentLineItemValue("item","quantitybackordered");
						if(qb!=null && qb!="")
							nlapiSetCurrentLineItemValue("item","quantitybackordered",qb.toFixed(5));
						nlapiSetCurrentLineItemValue("item","custcol_item_price",nlapiFormatCurrency(itemPrice));
						nlapiSetCurrentLineItemValue("item","custcol_vat_amount",nlapiFormatCurrency(vatAmount));
						nlapiSetCurrentLineItemValue("item","custcol_duty_amount",nlapiFormatCurrency(dutyAmount));
						nlapiCommitLineItem("item");
					}
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
