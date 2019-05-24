nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Receive_Diamond_PO(type)
{
	try
	{
		if(type=="create" || type=="edit" || type=="xedit")
		{
			var diamondRcvd = nlapiGetNewRecord().getFieldValue("custbody208");
			if(diamondRcvd!=null && diamondRcvd!="")
			{
				//var sales_order = nlapiGetNewRecord().getFieldValue("createdfrom");
				var sales_order = nlapiLookupField("purchaseorder",nlapiGetRecordId(),"createdfrom");
				if(sales_order!=null && sales_order!="")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("internalid",null,"is",sales_order));
					filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
					filters.push(new nlobjSearchFilter("custitem20","item","is","7")); //Category=Loose Diamond
					filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
					filters.push(new nlobjSearchFilter("status","purchaseorder","is","PurchOrd:B"));
					var cols = [];
					cols.push(new nlobjSearchColumn("purchaseorder"));
					var results = nlapiSearchRecord("salesorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							//Change location on PO line item
							var poRec = nlapiLoadRecord("purchaseorder",results[x].getValue("purchaseorder"));
							//var vendor = nlapiGetNewRecord().getFieldValue("entity");
							var vendor = nlapiLookupField("purchaseorder",nlapiGetRecordId(),"entity");
							for(var i = 0; i < poRec.getLineItemCount("item"); i++)
							{
								if(vendor=="7773")
									poRec.setLineItemValue("item","location",i+1,"6"); //Unique New York = BE Fulfillment-NY
								else if(vendor=="153")
									poRec.setLineItemValue("item","location",i+1,"1"); //GM Casting House = BE Fulfillment-CH
							}
							nlapiSubmitRecord(poRec,true,true);
							
							//Receive purchase order
							var receipt = nlapiTransformRecord("purchaseorder",results[x].getValue("purchaseorder"),"itemreceipt");
							for(var i=0; i < receipt.getLineItemCount("item"); i++)
							{
								receipt.setLineItemValue("item","itemreceive",i+1,"T");
								if(vendor=="7773")
									receipt.setLineItemValue("item","location",i+1,"6"); //Unique New York = BE Fulfillment-NY
								else if(vendor=="153")
									receipt.setLineItemValue("item","location",i+1,"1"); //GM Casting House = BE Fulfillment-CH
							}
							nlapiSubmitRecord(receipt,true,true);
						}
					}
				}
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Receiving Diamond PO","Details: " + err.message);
		return true;
	}
}
