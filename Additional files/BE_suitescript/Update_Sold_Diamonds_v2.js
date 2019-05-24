function Update_Sold_Diamonds(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			//Check over items for loose diamonds
			var order = nlapiGetNewRecord();
			
			var prefVendor = null;
			var location = null;
			
			//Capture preferred vendor of ring
			for(var x=0; x < order.getLineItemCount("item"); x++)
			{
				var item = order.getLineItemValue("item","item",x+1);
				var name = order.getLineItemText("item","item",x+1);
				var category = nlapiLookupField("item",item,"custitem20");
				if(category=="2" || name.substring(0,3)=="BE1" || name.substring(0,3)=="BE5")
				{
					prefVendor = order.getLineItemValue("item","povendor",x+1);
					nlapiLogExecution("debug","Pref Vendor",prefVendor);
					break;
				}
			}
			
			//Determine location from preferred vendor
			if(prefVendor!=null)
			{
				switch(prefVendor)
				{
					case "153": //GM Casting House
						location = "1"; //BE Fulfillment-CH
						break;
					case "7773": //Unique New York
						location = "6"; //BE Fulfillment-NY
						break;
					case "442500": //Miracleworks
						location = "9"; //BE Fulfillment-MW
						break;
				}
				
				//If International Vendor (vendor record) is checked, then default location to SF
				if(nlapiLookupField("vendor",prefVendor,"custentityinternational_vendor")=="T")
					location = "2";
			}
			
			nlapiLogExecution("debug","Location",location);
			
			//If layaway order, default location to SF
			if(order.getFieldValue("custbody111")=="T")
				location = "2";
				
			//Hari Krishna and Monarch items should always default to SF
			if(prefVendor=="28712" || prefVendor=="236761")
				location = "2";
				
			nlapiLogExecution("debug","Location",location);
				
			//Check for associated payments
			var deposits = false;
			
			var filters = [];
			filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
			filters.push(new nlobjSearchFilter("salesorder",null,"is",nlapiGetRecordId()));
			var results = nlapiSearchRecord("customerdeposit",null,filters);
			if(results)
				deposits = true;
				
			//Update all loose diamond items to this location
			for(var x=0; x < order.getLineItemCount("item"); x++)
			{
				//Check for associated payments
				var deposits = false;
				
				var filters = [];
				filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
				filters.push(new nlobjSearchFilter("salesorder",null,"is",nlapiGetRecordId()));
				var results = nlapiSearchRecord("customerdeposit",null,filters);
				if(results)
					deposits = true;
				
				var item = order.getLineItemValue("item","item",x+1);
				var name = order.getLineItemText("item","item",x+1);
				var category = nlapiLookupField("item",item,"custitem20");
				
				//Check if Loose Diamond AND Location is not already SF
				if(category=="7" && order.getLineItemValue("item","location",x+1)!="2" || item=="676020")
				{
					//If SO has not payments/deposits AND stock number ends in AY or Y then location = SF
					if(!deposits && name.charAt(name.length-1)=="Y" && item!="676020")
						location = "2";
				}
			}
			
			nlapiLogExecution("debug","Location",location);
			
			for(var x=0; x < order.getLineItemCount("item"); x++)
			{
				nlapiLogExecution("debug","Item #",order.getLineItemText("item","item",x+1));
				
				//Get item ID, location, and qty available from line
				var item = order.getLineItemValue("item","item",x+1);
				var available = order.getLineItemValue("item","quantityavailable",x+1);
				if(available==null || available=="")
					available = 0;
				
				//Get Category and Status (Item) fields from inventory item record
				var item_obj = nlapiLookupField("item",item,["custitem20","custitem97"]);
				
				if(item_obj.custitem20=="7" && item_obj.custitem97!="1")
				{
					//Update item record to status = Sold and set Sold Date to today
					var itemRec = nlapiLoadRecord("inventoryitem",item);
					itemRec.setFieldValue("custitem97","1");
					itemRec.setFieldValue("custitem_diamond_sold_date",nlapiDateToString(new Date()));
					nlapiSubmitRecord(itemRec,true,true);
					
					//Check if diamond is available in San Francisco
					if(location=="2" && parseFloat(available) > 0)
					{
						nlapiLogExecution("debug","Diamond is available in SF");
						
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
								custom_diamond.setFieldValue("custrecord_diamond_customer_name",order.getFieldValue("entity"));
								custom_diamond.setFieldValue("custrecord_diamond_so_order_number",nlapiGetRecordId());
								custom_diamond.setFieldValue("custrecord_diamond_inventory_location",location);
								custom_diamond.setFieldValue("custrecord_diamond_eta",order.getFieldValue("custbody146"));
								custom_diamond.setFieldValue("custrecord_diamond_sales_rep",order.getFieldValue("salesrep"));
								nlapiSubmitRecord(custom_diamond,true,true);
							}
						}
						else
						{
							nlapiLogExecution("debug","Item DOES NOT exists on another open sales order AND is available in SF");
							
							//Change sales order Diamond Confirmed New to "Yes"
							nlapiSubmitField("salesorder",nlapiGetRecordId(),"custbody132","1");
							
							return true;
						}
					}
					else
					{
						//Diamond IS NOT in SF or IS NOT available > 0 -- Create custom diamond page
						
						//Check for duplicate custom diamond page, if none exists, create one
						var filters = [];
						filters.push(new nlobjSearchFilter("custrecord_be_diamond_stock_number",null,"is",item));
						filters.push(new nlobjSearchFilter("custrecord_diamond_so_order_number",null,"is",nlapiGetRecordId()));
						var results = nlapiSearchRecord("customrecord_custom_diamond",null,filters);
						if(results)
						{
							nlapiLogExecution("debug","Custom diamond record already exists for this sales order.");
						}
						else
						{
							//Create custom diamond record
							nlapiLogExecution("debug","Creating new custom diamond record.");
							var custom_diamond = nlapiCreateRecord("customrecord_custom_diamond");
							custom_diamond.setFieldValue("custrecord_custom_diamond_request_type","1");
							custom_diamond.setFieldValue("custrecord_diamond_status","1");
							custom_diamond.setFieldValue("custrecord_be_diamond_stock_number",item);
							custom_diamond.setFieldValue("custrecord_diamond_customer_name",order.getFieldValue("entity"));
							custom_diamond.setFieldValue("custrecord_diamond_so_order_number",nlapiGetRecordId());
							custom_diamond.setFieldValue("custrecord_diamond_inventory_location",location);
							custom_diamond.setFieldValue("custrecord_diamond_eta",order.getFieldValue("custbody146"));
							custom_diamond.setFieldValue("custrecord_diamond_sales_rep",order.getFieldValue("salesrep"));
							nlapiSubmitRecord(custom_diamond,true,true);
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
