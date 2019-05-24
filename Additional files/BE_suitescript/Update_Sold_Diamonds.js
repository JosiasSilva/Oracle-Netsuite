function Update_Sold_Diamonds(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			//Check over items for loose diamonds
			var order = nlapiGetNewRecord();
			for(var x=0; x < order.getLineItemCount("item"); x++)
			{
				//Get item ID, location, and qty available from line
				var item = order.getLineItemValue("item","item",x+1);
				var location = order.getLineItemValue("item","location",x+1);
				var available = order.getLineItemValue("item","quantityavailable",x+1);
				if(available==null || available=="")
					available = 0;
				
				//Get Category and Status (Item) fields from inventory item record
				var item_obj = nlapiLookupField("item",item,["custitem20","custitem97"]);
				
				if(item_obj.category=="7" && item_obj.custitem97!="1")
				{
					//Update item record to status = Sold
					nlapiSubmitField("inventoryitem",item,"custitem97","1");
					
					//Check if diamond is available in San Francisco
					if(location=="2" && parseFloat(available) > 0)
					{
						//Check if diamond is on another open sales order
						var filters = [];
						filters.push(new nlobjSearchFilter("item",null,"is",item));
						filters.push(new nlobjSearchFilter("status",null,"anyof",["SalesOrd:A","SalesOrd:B","SalesOrd:D","SalesOrd:E"]));
						filters.push(new nlobjSearchFilter("internalid",null,"noneof",nlapiGetRecordId()));
						var results = nlapiSearchRecord("salesorder",null,filters);
						if(results)
						{
							nlapiLogExecution("debug","Item exists on another open sales order");
							
							//Check for duplicate custom diamond page, if none exists, create one
							var filters = [];
							filters.push(new nlobjSearchFilter("custrecord_be_diamond_stock_number",null,"is",item));
							filters.push(new nlobjSearchFilter("custrecord_diamond_so_order_number",null,"is",nlapiGetRecordId()));
							var results = nlapiSearchRecord("customrecord_custom_diamond",null,filters);
							if(results)
							{
								nlapiLogExecution("debug","Custom diamond record already exists for this sales order.");
								return true;
							}
							else
							{
								//Create custom diamond record
								var custom_diamond = nlapiCreateRecord("customrecord_custom_diamond");
								custom_diamond.setFieldValue("custrecord_custom_diamond_request_type","1");
								custom_diamond.setFieldValue("custrecord_diamond_status","1");
								custom_diamond.setFieldValue("custrecord_be_diamond_stock_number",item);
								custom_diamond.setFieldValue("custrecord_diamond_so_order_number",nlapiGetRecordId());
								custom_diamond.setFieldValue("custrecord_diamond_inventory_location",location);
								nlapiSubmitRecord(custom_diamond,true,true);
							}
						}
						else
						{
							nlapiLogExecution("debug","Item DOES NOT exists on another open sales order");
							
							//Change sales order Diamond Confirmed New to "Yes"
							nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody132","1");
							
							return true;
						}
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Updating Sold Diamonds (Record " + nlapiGetRecordId() + ").","Details: " + err.message);
			return true;
		}
	}
}
