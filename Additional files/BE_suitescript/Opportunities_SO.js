nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Connection_Opportunity_PI(type)
{
	try
	{
		if(nlapiGetFieldValue("entity")!=null && nlapiGetFieldValue("entity")!="")
		{
			//Search for open opportunities for that customer
			var filters = [];
			filters.push(new nlobjSearchFilter("entity",null,"is",nlapiGetFieldValue("entity")));
			//filters.push(new nlobjSearchFilter("status",null,"anyof",["A","B"]));
			filters.push(new nlobjSearchFilter("entitystatus",null,"anyof",[7,6,11,8,9,17,15]));
			var results = nlapiSearchRecord("opportunity",null,filters);
			if(results)
			{
				//Set opportunity field on sales order to open opportunity
				if(results.length==1)
					nlapiSetFieldValue("opportunity",results[0].getId());
			}
		}
	}
	catch(e){ }
}

function Connection_Opportunity_SO(type,name)
{
	if(name=="entity")
	{
		try
		{
			if(nlapiGetFieldValue("entity")!=null && nlapiGetFieldValue("entity")!="")
			{
				//Search for open opportunities for that customer
				var filters = [];
				filters.push(new nlobjSearchFilter("entity",null,"is",nlapiGetFieldValue("entity")));
				//filters.push(new nlobjSearchFilter("status",null,"anyof",["A","B"]));
				filters.push(new nlobjSearchFilter("entitystatus",null,"anyof",[7,6,11,8,9,17,15]));
				var results = nlapiSearchRecord("opportunity",null,filters);
				if(results)
				{
					//Set opportunity field on sales order to open opportunity
					if(results.length==1)
						nlapiSetFieldValue("opportunity",results[0].getId());
				}
			}
		}
		catch(e){ }
	}
}

function Connection_Opportunity_SO_AS(type)
{
	try
	{
		if(type=="create")
		{
			var context = nlapiGetContext();
			if(context.getExecutionContext()!="userinterface")
			{
				//Search for open opportunities for that customer
				var filters = [];
				filters.push(new nlobjSearchFilter("entity",null,"is",nlapiGetNewRecord().getFieldValue("entity")));
				//filters.push(new nlobjSearchFilter("status",null,"anyof",["A","B"]));
				filters.push(new nlobjSearchFilter("entitystatus",null,"anyof",[7,6,11,8,9,17,15]));
				var results = nlapiSearchRecord("opportunity",null,filters);
				if(results)
				{
					//Set opportunity field on sales order to open opportunity
					if(results.length==1)
					{
						var order = nlapiLoadRecord("salesorder",nlapiGetRecordId());
						order.setFieldValue("opportunity",results[0].getId());
						nlapiSubmitRecord(order,true,true);
					}
				}
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Setting Opportunity Field","Details: " + err.message);
		return true;
	}
}
