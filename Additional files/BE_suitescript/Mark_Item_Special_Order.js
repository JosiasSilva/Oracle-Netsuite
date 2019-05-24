nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Mark_Item_Special_Order(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var category = nlapiGetFieldValue("custitem20");
			var custitem97 = nlapiGetFieldValue("custitem97");
			
			if(category!="7")
				return true;
			
			if(type=="create")
			{
				if(custitem97=="1" || custitem97=="7" || custitem97=="8" || custitem97=="" || custitem97==null)
				{
					nlapiSetFieldValue("isspecialorderitem","T");
				}
			}
			else if(type=="edit")
			{
				if(custitem97=="1" || custitem97=="7" || custitem97=="8" || custitem97=="" || custitem97==null)
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("item",null,"is",nlapiGetRecordId()));
					var results = nlapiSearchRecord("purchaseorder",null,filters);
					if(!results)
					{
						nlapiSetFieldValue("isspecialorderitem","T");
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Special Order Flag","Details: " + err.message);
			return true;
		}
	}
}
