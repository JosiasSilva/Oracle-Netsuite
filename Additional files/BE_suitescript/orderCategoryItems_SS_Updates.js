nlapiLogExecution("audit","FLOStart",new Date().getTime());
function setOrderCategoryItems()
{
	try
	{
		//Search For Approved Orders without Categories
		var orders = new Array()
		
		var results = nlapiSearchRecord("transaction","customsearch_sales_order_categories_upda")
		if(results!=null)
		{
			nlapiLogExecution("debug","Orders Returned",results.length)
			for(var x=0; x < 1; x++)
			{
				nlapiLogExecution("debug","Order ID(" + x + ")",results[x].getId())
				orders[x] = results[x].getId()
			}
		}
		else
		{
			nlapiLogExecution("error","No Search Results Found","No orders found without categories.")
			return true
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Category Mass Update","Error getting sales order to update. Details: " + err.message)
		return true
	}
	
	try
	{
		for(var i=0; i < orders.length; i++)
		{
			var filters = new Array()
			filters[0] = new nlobjSearchFilter("internalid",null,"anyof",orders[i])
			filters[1] = new nlobjSearchFilter("mainline",null,"is","F")
			filters[2] = new nlobjSearchFilter("taxline",null,"is","F")
			filters[3] = new nlobjSearchFilter("shipping",null,"is","F")
			filters[4] = new nlobjSearchFilter("status",null,"noneof",["SalesOrd:A","SalesOrd:C","SalesOrd:H"])
			filters[5] = new nlobjSearchFilter("custitem20","item","noneof","@NONE")
			
			
			var columns = new Array()
			columns[0] = new nlobjSearchColumn("item")
			columns[1] = new nlobjSearchColumn("amount")
			columns[1].setSort(true) //Make sort order highest to lowest
			columns[2] = new nlobjSearchColumn("custitem20","item")
			
			var results = nlapiSearchRecord("salesorder",null,filters,columns)
			nlapiLogExecution("debug","Search Results",results.length)
			if(results!=null)
			{
				var fields = new Array()
				var fieldData = new Array()
				
				for(var x=0; x < results.length; x++)
				{
					if(results[x].getValue("custitem20","item")==null || results[x].getValue("custitem20","item")=="")
					{
						nlapiLogExecution("debug","Script Position","Continuing because no category found on item.")
						continue	
					}
					
					switch(x)
					{
						case 0:
							fields.push("custbody_category1")
							//fieldData.push(results[x].getValue("custitem20","item"))
							//nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody_category1",results[x].getValue("custitem20","item"))
							break
						case 1:
							fields.push("custbody_category2")
							//fieldData.push(results[x].getValue("custitem20","item"))
							//nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody_category2",results[x].getValue("custitem20","item"))
							break
						case 2:
							fields.push("custbody_category3")
							//fieldData.push(results[x].getValue("custitem20","item"))
							//nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody_category3",results[x].getValue("custitem20","item"))
							break
						case 3:
							fields.push("custbody_category4")
							//fieldData.push(results[x].getValue("custitem20","item"))
							//nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody_category4",results[x].getValue("custitem20","item"))
							break
						case 4:
							fields.push("custbody_category5")
							//fieldData.push(results[x].getValue("custitem20","item"))
							//nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody_category5",results[x].getValue("custitem20","item"))
							break
						case 5:
							fields.push("custbody_category6")
							//fieldData.push(results[x].getValue("custitem20","item"))
							//nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody_category6",results[x].getValue("custitem20","item"))
							break
					}
					fieldData.push(results[x].getValue("custitem20","item"))
				}
			nlapiSubmitField("salesorder",orders[i],fields,fieldData,false)
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","SO Category Script Error","Error setting top categories on sales order. Details: " + err.message)
		return true
	}
}
