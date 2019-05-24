function SO_Diamond_Inventory_Location(type)
{
	if(type=="create")
	{
		try
		{
			var orderId = nlapiGetRecordId();
			var order = nlapiLoadRecord("salesorder",orderId);
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
					break;
				}
			}
			
			nlapiLogExecution("debug","Pref Vendor",prefVendor);
			
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
			}
			
			//If layaway order, default location to SF
			if(order.getFieldValue("custbody111")=="T")
			{
				nlapiLogExecution("debug","Layaway Order")
				location = "2";
			}
			
			if(location!=null)
			{
				var save = false;
				
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
					
					var place_of_sale = order.getFieldValue("class");
					var payment_plan = order.getFieldValue("custbody147");
					
					if(place_of_sale=="5" || place_of_sale=="11" || place_of_sale=="10")
						deposits = true;
					if(payment_plan=="1")
						deposits = true;
					
					//Check if Loose Diamond AND Location is not already SF
					if(category=="7" && order.getLineItemValue("item","location",x+1)!="2")
					{
						var diamond_vendor = order.getLineItemValue("item","povendor",x+1);
						
						//If International Vendor (vendor record) is checked, then default location to SF
						if(nlapiLookupField("vendor",diamond_vendor,"custentityinternational_vendor")=="T")
						{
							nlapiLogExecution("debug","Is International Vendor...");
							location = "2";
						}
						
						//Hari Krishna and Monarch items should always default to SF
						if(diamond_vendor=="28712" || diamond_vendor=="236761")
						{
							nlapiLogExecution("debug","Hari Krishna or Monarch item - defualt to SF");
							location = "2";
						}
						
						//If SO has not payments/deposits AND stock number ends in AY or Y then location = SF
						if(!deposits && name.charAt(name.length-1)=="Y")
							order.setLineItemValue("item","location",x+1,"2");
						else
							order.setLineItemValue("item","location",x+1,location);
						
						save = true;
					}
				}
				
				if(save)
					nlapiSubmitRecord(order,true,true);
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Diamond Location on SO# " + nlapiGetNewRecord().getFieldValue("tranid"),"Details: " + err.message);
			return true;
		}
		
	}
}
