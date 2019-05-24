function Owned_Paid_Sold_SO_SS()
{
	var testOrder = nlapiGetContext().getSetting("SCRIPT","custscript_ops_so_ss_orderid");
	
	var filters = null;
	
	if(testOrder!=null && testOrder!="")
	{
		filters = [];
		filters.push(new nlobjSearchFilter("internalid",null,"is",testOrder));
	}
	
	var results = nlapiSearchRecord("salesorder","customsearch_owp_orders_to_update",filters);
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			try
			{
				checkGovernance();
				
				Update_Owned_Paid_Sold_SO(results[x].getValue("internalid",null,"group"));
			}
			catch(err)
			{
				nlapiLogExecution("error","Error Updating Owned, Paided, Sold on SO " + results[x].getValue("internalid",null,"group"),"Details: " + err.message);
			}
		}
	}
}

function Update_Owned_Paid_Sold_SO(orderId)
{
	var order = nlapiLoadRecord("salesorder",orderId);
	nlapiLogExecution("debug","Loaded sales order " + orderId);
	
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",orderId));
	filters.push(new nlobjSearchFilter("custitemmemovsowned","item","noneof","@NONE@"));
	filters.push(new nlobjSearchFilter("custcol_owned_vs_memo",null,"anyof","@NONE@"));
	var cols = [];
	cols.push(new nlobjSearchColumn("item"));
	cols.push(new nlobjSearchColumn("line"));
	cols.push(new nlobjSearchColumn("custitemmemovsowned","item"));
	cols.push(new nlobjSearchColumn("custitemsoldvsnotsold","item"));
	cols.push(new nlobjSearchColumn("custitempaidvsnotpaid","item"));
	var results = nlapiSearchRecord("salesorder",null,filters,cols);
	if(results)
	{
		nlapiLogExecution("debug","# Results: " + results.length);
		
		for(var x=0; x < results.length; x++)
		{
			for(var i=0; i < order.getLineItemCount("item"); i++)
			{
				if(results[x].getValue("line")==order.getLineItemValue("item","line",i+1))
				{
					order.setLineItemValue("item","custcol_owned_vs_memo",i+1,results[x].getValue("custitemmemovsowned","item"));
					order.setLineItemValue("item","custcol_sold_vs_not_sold",i+1,results[x].getValue("custitemsoldvsnotsold","item"));
					order.setLineItemValue("item","custcol_paid_vs_not_paid",i+1,results[x].getValue("custitempaidvsnotpaid","item"));
					break;
				}
			}			
		}
		
		nlapiSubmitRecord(order,true,true);
	}
}

function checkGovernance()
{
	var context = nlapiGetContext();
	if(context.getRemainingUsage() < 400)
	{
 		var state = nlapiYieldScript();
		if(state.status == 'FAILURE')
     	{
      		nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = "+state.reason + " / Size = "+ state.size);
   			throw "Failed to yield script";
  		} 
  		else if(state.status == 'RESUME')
  		{
   			nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
  		}
  		// state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
 	}
}