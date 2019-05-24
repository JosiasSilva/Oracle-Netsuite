/*
 * 03-27-2015: Add logic for setting all diamonds to SF if Place of Sale = Appointment: Bank Wire, Phone: Bank Wire, Website: Bank Wire, or
 *   Website: Telephone Order
 */
function Diamond_Rerouting_SO(type)
{
	if(type=="create")
	{
		try
		{
			var order = nlapiGetNewRecord();
			var place_of_sale = order.getFieldValue("class");
			
			for(var x=0; x < order.getLineItemCount("item"); x++)
			{
				var category = order.getLineItemValue("item","custcol_category",x+1);
				if(category=="7")
				{
					var name = order.getLineItemText("item","item",x+1);
					var vendor = order.getLineItemValue("item","povendor",x+1);
					if(name.charAt(name.length-1)=="Y" || name.charAt(name.length-1)=="A")
					{
						nlapiLogExecution("debug","Name ends in A or Y");
						
						//Find Production Vendor
						var prodVendor = null;
						for(var i=0; i < order.getLineItemCount("item"); i++)
						{
							var item = order.getLineItemValue("item","item",i+1);
							var ringname = order.getLineItemText("item","item",i+1);
							var category = order.getLineItemValue("item","custcol_category",i+1);
							
							if((category=="2" || ringname.substring(0,3)=="BE1" || ringname.substring(0,3)=="BE5") && prodVendor==null)
							{
								prodVendor = order.getLineItemValue("item","povendor",i+1);
								break;
							}
						}
						
						nlapiLogExecution("debug","Production Vendor",prodVendor);
						
						//Compare against production vendors in script parameters
						var paramVendors = nlapiGetContext().getSetting("SCRIPT","custscript_dr_pv");
						nlapiLogExecution("debug","paramVendors",paramVendors);
						paramVendors = paramVendors.split(",");
						
						var vendorMatch = false;
						for(var i=0; i < paramVendors.length; i++)
						{
							nlapiLogExecution("debug","paramVendors["+i+"]",paramVendors[i]);
							if(paramVendors[i]==prodVendor)
							{
								vendorMatch = true;
								nlapiLogExecution("debug","Vendor Match Found!");
								break;
							}
						}
						
						if(!vendorMatch)
						{
							nlapiLogExecution("debug","Production vendor match not found. Defaulting to San Francisco.");
							nlapiSelectLineItem("item",x+1);
							nlapiSetCurrentLineItemValue("item","location","2");
							nlapiCommitLineItem("item");
							
							//Update Item Record
							nlapiSubmitField("inventoryitem",item,"preferredlocation","2");
							
							//Update CDP Record(s)
							var filters = [];
							filters.push(new nlobjSearchFilter("custrecord_be_diamond_stock_number",null,"is",item));
							var results = nlapiSearchRecord("customrecord_custom_diamond",null,filters);
							if(results)
							{
								for(var i=0; i < results.length; i++)
									nlapiSubmitField("customrecord_custom_diamond",results[i].getId(),"custrecord_diamond_inventory_location","2");
							}
							
							continue;
							//return true;
						}
						
						var location;
						
						//Determine if AY stone or Drop Ship Eligible A stone vendors
						var isDropShip = nlapiLookupField("vendor",vendor,"custentity_can_drop_ship");
						nlapiLogExecution("debug","isDropShip",isDropShip);
						
						if((name.charAt(name.length-1)=="A" && isDropShip=="T") || (name.charAt(name.length-1)=="Y" && name.charAt(name.length-2)=="A"))
						{
							//Set inventory location to production vendor
							nlapiLogExecution("debug","Setting Location to Production Vendor...");
							
							switch(prodVendor.toString())
							{
								case "153": //GM Casting House
									location = "1"; //BE Fulfillment-CH
									break;
								case "7773": //Unique New York
									location = "6"; //BE Fulfillment-NY
									break;
							}
							
						}
						else if(name.charAt(name.length-1)=="Y" || (name.charAt(name.length-1)=="A" && isDropShip=="F"))
						{
							//Set inventory location to San Francisco
							nlapiLogExecution("debug","Setting Location to San Francisco...");
							location = "2";
						}
						else
						{
							//Set inventory location to San Francisco
							nlapiLogExecution("debug","Setting Location to San Francisco...");
							location = "2";
						}
						
						switch(place_of_sale)
						{
							case "6": //Website : Bank Wire
							case "57": //Appointment : Bank Wire
							case "9": //Phone : Bank Wire
							case "7": //Website : Telephone Order
								nlapiLogExecution("debug","Setting Location to San Francisco because of Place of Sale");
								location = "2";
								break;
						}
						
						nlapiLogExecution("debug","Location",location);
						
						nlapiSelectLineItem("item",x+1);
						nlapiSetCurrentLineItemValue("item","location",location);
						nlapiCommitLineItem("item");
						
						//Update Item Record
						nlapiSubmitField("inventoryitem",item,"preferredlocation",location);
						
						//Update CDP Record(s)
						var filters = [];
						filters.push(new nlobjSearchFilter("custrecord_be_diamond_stock_number",null,"is",item));
						var results = nlapiSearchRecord("customrecord_custom_diamond",null,filters);
						if(results)
						{
							for(var i=0; i < results.length; i++)
								nlapiSubmitField("customrecord_custom_diamond",results[i].getId(),"custrecord_diamond_inventory_location",location);
						}
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Diamond Routing/Location Fields","Details: " + err.message);
			return true;
		}
	}
}
