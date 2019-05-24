nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Mark_RMA_Gift_Category_SS()
{
	var orders = [];
	
	var results = nlapiSearchRecord("returnauthorization","customsearch4607");
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			var itemCat = results[x].getValue("custitem20","item");
			var field = null;
			
			if(itemCat==results[x].getValue("custbody_category1"))
				field = "custbody_category1";
			else if(itemCat==results[x].getValue("custbody_category2"))
				field = "custbody_category2";
			else if(itemCat==results[x].getValue("custbody_category3"))
				field = "custbody_category3";
			else if(itemCat==results[x].getValue("custbody_category4"))
				field = "custbody_category4";
			else if(itemCat==results[x].getValue("custbody_category5"))
				field = "custbody_category5";
			else if(itemCat==results[x].getValue("custbody_category6"))
				field = "custbody_category6";
			
			if(field!=null)
			{
				var found = false;
				
				for(var i=0; i < orders.length; i++)
				{
					if(orders[i].id == results[x].getId())
					{
						orders[i].fields.push(field);
						found = true;
						break;
					}
				}
				
				if(found == false)
				{
					orders.push({
						id : results[x].getId(),
						fields : [field]
					});
				}
			}
		}	
	}
	
	for(var x=0; x < orders.length; x++)
	{
		var data = [];
		for(var i=0; i < orders[x].fields.length; i++)
			data.push("37");
		
		//Flag order as being updated for gift category
		orders[x].fields.push("custbody_gift_script");
		data.push("T");
		
		nlapiSubmitField("returnauthorization",orders[x].id,orders[x].fields,data);
	}
}
