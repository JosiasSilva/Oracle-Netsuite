function Update_Sold_Diamonds(type)
{
	if(type=="create")
	{
		try
		{
			//Check over items for loose diamonds
			var order = nlapiLoadRecord("salesorder",nlapiGetRecordId());
			
			for(var x=0; x < order.getLineItemCount("item"); x++)
			{
				nlapiLogExecution("debug","Item #",order.getLineItemText("item","item",x+1));
				
				//Get item ID, location, and qty available from line
				var item = order.getLineItemValue("item","item",x+1);
				var available = order.getLineItemValue("item","quantityavailable",x+1);
				var location = order.getLineItemValue("item","location",x+1);
				if(available==null || available=="")
					available = 0;
				
				//Get Category and Status (Item) fields from inventory item record
				var item_obj = nlapiLookupField("item",item,["custitem20","custitem97","quantityavailable","custitemcertificate_included"]);
				
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
								//custom_diamond.setFieldValue("custrecord_diamond_status","1");
								custom_diamond.setFieldValue("custrecord_be_diamond_stock_number",item);
								custom_diamond.setFieldValue("custrecord_diamond_customer_name",order.getFieldValue("entity"));
								custom_diamond.setFieldValue("custrecord_diamond_so_order_number",nlapiGetRecordId());
								custom_diamond.setFieldValue("custrecord_diamond_inventory_location",location);
								custom_diamond.setFieldValue("custrecord_diamond_eta",order.getFieldValue("custbody146"));
								custom_diamond.setFieldValue("custrecord_diamond_sales_rep",order.getFieldValue("salesrep"));
								custom_diamond.setFieldValue("custrecord_diamond_email_status","1");
								
								if(item_obj.custitemcertificate_included=="2")
									custom_diamond.setFieldValue("custrecord_cdp_group_a","T");
								else if(item_obj.custitemcertificate_included=="1")
								{
									custom_diamond.setFieldValue("custrecord_diamond_email_status","2"); //Email Status = Emailed
									custom_diamond.setFieldValue("custrecord_cdp_group_b","T"); //Mark Group B
									custom_diamond.setFieldValue("custrecord_diamond_status","1"); //Diamond Status = Confirmed
									custom_diamond.setFieldValue("custrecord_diamond_confirmed","1"); //Diamond Confirmed = Yes
									custom_diamond.setFieldValue("custrecord_diamond_email_status","5"); //Email Status = Batch Email
								}
								
								
								//Check vendor record for 'Block automated emails' checkbox
								var vendor = nlapiLookupField("item",item,"vendor");
								if(vendor!=null && vendor!="")
								{
									var blockEmails = nlapiLookupField("vendor",vendor,"custentityblock_automated_emails");			
									if(blockEmails=="T")
										custom_diamond.setFieldValue("custrecord_diamond_email_status","3");
								}
								
								//Set Email Status to Order on Website if vendor is Hari Krishna or Monarch
								if(vendor=="28712" || vendor=="236761")
								{
									custom_diamond.setFieldValue("custrecord_diamond_email_status","4");
								}
				
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
							//custom_diamond.setFieldValue("custrecord_diamond_status","1");
							custom_diamond.setFieldValue("custrecord_be_diamond_stock_number",item);
							custom_diamond.setFieldValue("custrecord_diamond_customer_name",order.getFieldValue("entity"));
							custom_diamond.setFieldValue("custrecord_diamond_so_order_number",nlapiGetRecordId());
							custom_diamond.setFieldValue("custrecord_diamond_inventory_location",location);
							custom_diamond.setFieldValue("custrecord_diamond_eta",order.getFieldValue("custbody146"));
							custom_diamond.setFieldValue("custrecord_diamond_sales_rep",order.getFieldValue("salesrep"));
							custom_diamond.setFieldValue("custrecord_diamond_email_status","1");
							
							if(parseInt(item_obj.quantityavailable) > 0)
							{
								if(item_obj.custitemcertificate_included=="2")
									custom_diamond.setFieldValue("custrecord_cdp_group_a","T");
								else if(item_obj.custitemcertificate_included=="1")
								{
									custom_diamond.setFieldValue("custrecord_diamond_email_status","2"); //Email Status = Emailed
									custom_diamond.setFieldValue("custrecord_cdp_group_b","T"); //Mark Group B
									custom_diamond.setFieldValue("custrecord_diamond_status","1"); //Diamond Status = Confirmed
									custom_diamond.setFieldValue("custrecord_diamond_confirmed","1"); //Diamond Confirmed = Yes
									custom_diamond.setFieldValue("custrecord_diamond_email_status","5"); //Email Status = Batch Email
								}
							}
							
							//Check vendor record for 'Block automated emails' checkbox
							var vendor = nlapiLookupField("item",item,"vendor");
							if(vendor!=null && vendor!="")
							{
								var blockEmails = nlapiLookupField("vendor",vendor,"custentityblock_automated_emails");			
								if(blockEmails=="T")
									custom_diamond.setFieldValue("custrecord_diamond_email_status","3");
							}
							
							//Set Email Status to Order on Website if vendor is Hari Krishna or Monarch
							if(vendor=="28712" || vendor=="236761")
							{
								custom_diamond.setFieldValue("custrecord_diamond_email_status","4");
							}
								
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
