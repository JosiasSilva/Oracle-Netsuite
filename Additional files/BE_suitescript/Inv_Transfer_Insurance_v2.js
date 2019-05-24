nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Inv_Transfer_Insurance(type)
{
	if((type=="create" || type=="edit") && nlapiGetContext().getExecutionContext()=="userinterface")
	{
		try
		{
			var transfer = nlapiGetNewRecord();
			
			var items = [];
			var itemIds = [];
			
			for(var x=0; x < transfer.getLineItemCount("inventory"); x++)
			{
				items.push({
					id : transfer.getLineItemValue("inventory","item",x+1),
					units : transfer.getLineItemValue("inventory","units",x+1),
					qty : transfer.getLineItemValue("inventory","adjustqtyby",x+1),
					avg_cost : "",
					ct_wt_piece : "",
					category : "",
					baseprice : ""
				});
				
				itemIds.push(transfer.getLineItemValue("inventory","item",x+1));
			}
			
			nlapiLogExecution("debug","Items JSON (Pre-Search)",JSON.stringify(items));
			
			var filters = [];
			filters.push(new nlobjSearchFilter("internalid",null,"anyof",itemIds));
			var cols = [];
			cols.push(new nlobjSearchColumn("averagecost"));
			cols.push(new nlobjSearchColumn("baseprice"));
			cols.push(new nlobjSearchColumn("custitemcarat_weight_per_piece"));
			cols.push(new nlobjSearchColumn("custitem20"));
			var results = nlapiSearchRecord("item",null,filters,cols);
			if(results)
			{
				for(var x=0; x < results.length; x++)
				{
					for(var i=0; i < items.length; i++)
					{
						if(items[i].id == results[x].getId())
						{
							items[i].avg_cost = results[x].getValue("averagecost");
							items[i].ct_wt_piece = results[x].getValue("custitemcarat_weight_per_piece");
							items[i].category = results[x].getValue("custitem20");
							items[i].baseprice = results[x].getValue("baseprice");
							break;
						}
					}
				}
			}
			
			nlapiLogExecution("debug","Items JSON (Post-Search)",JSON.stringify(items));
			
			var total_insurance = 0.00;
			for(var x=0; x < items.length; x++)
			{
				nlapiLogExecution("debug","Calculating Insurance for Item " + items[x].id);
				
				if(items[x].units==null || items[x].units=="" || items[x].units!="1")
				{
					nlapiLogExecution("debug","Units Empty OR Not Ct Wt Carrot","Adding Value: " + ((items[x].avg_cost * 0.8) * items[x].qty));
					
					total_insurance += ((items[x].avg_cost * 0.8) * items[x].qty);
				}
				else if(items[x].ct_wt_piece!=null && items[x].ct_wt_piece!="" && (items[x].category=="1" || items[x].category=="23" || items[x].category=="30") && items[x].units=="1")
				{
					nlapiLogExecution("debug","Units==Ct Wt Carrot","Adding Value: " + (((items[x].avg_cost / items[x].ct_wt_piece) * 0.8) * items[x].qty));
					
					total_insurance += (((items[x].avg_cost / items[x].ct_wt_piece) * 0.8) * items[x].qty);
				}
				else
				{
					nlapiLogExecution("debug","Using Average Cost","Adding Value: " + ((items[x].avg_cost * 0.8) * items[x].qty));
					
					total_insurance += ((items[x].avg_cost * 0.8) * items[x].qty);
				}
				
				nlapiLogExecution("debug","Insurance Total (Running)",total_insurance);
			}
			
			nlapiSetFieldValue("custbody_insurance_total",nlapiFormatCurrency(total_insurance),true,true);
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Calculating Transfer Insurance","Details: " + err.message);
		}
	}
}
