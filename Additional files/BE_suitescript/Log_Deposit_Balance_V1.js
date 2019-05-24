nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Log_Deposit_Balance(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var deposit = nlapiGetNewRecord();
			var order = deposit.getFieldValue("salesorder");
			if(order!=null && order!="")
			{
				var filters = [];
				filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
				filters.push(new nlobjSearchFilter("salesorder",null,"is",order));
				var cols = [];
				cols.push(new nlobjSearchColumn("fxamount",null,"sum"));
				var results = nlapiSearchRecord("customerdeposit",null,filters,cols);
				if(results)
				{
					var deposit_total = results[0].getValue("fxamount",null,"sum");
					
					var sales_order = nlapiLoadRecord("salesorder",order);
					sales_order.setFieldValue("custbody_so_deposit_total",deposit_total);
					
					var order_total = sales_order.getFieldValue("total");
					var balance = parseFloat(order_total) - parseFloat(deposit_total);
					
					sales_order.setFieldValue("custbody_so_balance",balance);
					
					nlapiSubmitRecord(sales_order,true,true);
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Updating Deposit Balance","Details: " + err.message);
			return true;
		}
	}
}

function Log_Deposit_Balance_Delete(type)
{
	if(type=="delete")
	{
		try
		{
			var deposit = nlapiGetRecordId();
			var order = nlapiGetFieldValue("salesorder");
			if(order!=null && order!="")
			{
				var filters = [];
				filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
				filters.push(new nlobjSearchFilter("salesorder",null,"is",order));
				filters.push(new nlobjSearchFilter("internalid",null,"noneof",deposit));
				var cols = [];
				cols.push(new nlobjSearchColumn("fxamount",null,"sum"));
				var results = nlapiSearchRecord("customerdeposit",null,filters,cols);
				if(results)
				{
					var deposit_total = results[0].getValue("fxamount",null,"sum");
					
					var sales_order = nlapiLoadRecord("salesorder",order);
					sales_order.setFieldValue("custbody_so_deposit_total",deposit_total);
					
					var order_total = sales_order.getFieldValue("total");
					var balance = parseFloat(order_total) - parseFloat(deposit_total);
					
					sales_order.setFieldValue("custbody_so_balance",balance);
					
					nlapiSubmitRecord(sales_order,true,true);
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Updating Deposit Balance","Details: " + err.message);
			return true;
		}
	}
}

function Update_SO_Balance(type)
{
	//Added by ajay 10April 2017
	var context = nlapiGetContext();
	var contextType = context.getExecutionContext();
	if(contextType!="userinterface" && contextType!="userevent")
	{
		nlapiLogExecution("debug","Stopping script execution. Not triggered by UI.","Context: " + contextType);
		return true;
	}
	//Ended by ajay 10April 2017
	
	nlapiLogExecution("debug","Type",type);
	
	if(type=="create" || type=="edit")
	{
		try
		{
			var orderId = nlapiGetRecordId();
			nlapiLogExecution("debug","Sales Order ID",orderId);
			
			var filters = [];
			filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
			filters.push(new nlobjSearchFilter("salesorder",null,"is",orderId));

			var cols = [];
			cols.push(new nlobjSearchColumn("fxamount",null,"sum"));
			
			nlapiLogExecution("debug","Filters and columns set");
			
			var results = nlapiSearchRecord("customerdeposit",null,filters,cols);
			
			nlapiLogExecution("debug","Search completed");
			
			if(results)
			{
				nlapiLogExecution("debug","Search Results Found");
				
				var deposit_total = results[0].getValue("fxamount",null,"sum");
				if(deposit_total==null || deposit_total=="")
					deposit_total = 0.00;
				
				var sales_order = nlapiLoadRecord("salesorder",orderId);
				sales_order.setFieldValue("custbody_so_deposit_total",deposit_total);
				
				var order_total = sales_order.getFieldValue("total");
				var balance = parseFloat(order_total) - parseFloat(deposit_total);
				
				sales_order.setFieldValue("custbody_so_balance",balance);
				
				nlapiSubmitRecord(sales_order,true,true);
			}
			else
			{
				nlapiLogExecution("debug","No deposits found.");
				
				var sales_order = nlapiLoadRecord("salesorder",orderId);
				sales_order.setFieldValue("custbody_so_deposit_total",0.00);
				sales_order.setFieldValue("custbody_so_balance",sales_order.getFieldValue("total"));
				nlapiSubmitRecord(sales_order,true,true);
			}
			
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Updating SO Balance Fields","Details: " + err.message);
			return true;
		}
	}
}
