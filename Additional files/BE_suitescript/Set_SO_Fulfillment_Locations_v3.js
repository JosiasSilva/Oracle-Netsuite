function Set_SO_Fulfillment_Locations()
{
	//Get orders to fulfill
	var filters = [];
	filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
	filters.push(new nlobjSearchFilter("status",null,"is","SalesOrd:B"));
	filters.push(new nlobjSearchFilter("custbody110",null,"on","today")); //Date To Ship = Today
	if(nlapiGetContext().getSetting("SCRIPT","custscript_test_mode_only_locations")=="T")
		filters.push(new nlobjSearchFilter("custbody_test_order",null,"is","T"));
	if(nlapiGetContext().getSetting("SCRIPT","custscript_location_order_ids")!=null && nlapiGetContext().getSetting("SCRIPT","custscript_location_order_ids")!='')
	{
		var order_ids = nlapiGetContext().getSetting("SCRIPT","custscript_location_order_ids");
		if(order_ids.indexOf(",")!=-1)
		{
			order_ids = order_ids.split(",");
			filters.push(new nlobjSearchFilter("internalid",null,"anyof",order_ids));
		}
		else
		{
			filters.push(new nlobjSearchFilter("internalid",null,"is",order_ids));
		}
	}
	
	var cols = [];
	cols.push(new nlobjSearchColumn("shipmethod"));
	cols.push(new nlobjSearchColumn("tranid"));
	cols.push(new nlobjSearchColumn("custbody39"));
	cols.push(new nlobjSearchColumn("custbody194"));
	cols.push(new nlobjSearchColumn("custbody6"));
	cols.push(new nlobjSearchColumn("custbody_drop_ship_vendor"));
	var results = nlapiSearchRecord("salesorder",null,filters,cols);
	if(results)
	{
		var today = new Date();
		var todayStr = nlapiDateToString(today,"date");
		
		nlapiLogExecution("debug","# Orders",results.length)
		for(var x=0; x < results.length; x++)
		{
			nlapiLogExecution("debug","Order #" + x,"Order #: " + results[x].getValue("tranid"));
			
			//Verify no fulfillments on sales order
			var filters1 = [];
			filters1.push(new nlobjSearchFilter("createdfrom",null,"is",results[x].getId()));
			filters1.push(new nlobjSearchFilter("mainline",null,"is","T"));
			var results1 = nlapiSearchRecord("itemfulfillment",null,filters1);
			if(results1)
			{
				nlapiLogExecution("debug","Order has fulfillments tie do it. Skipping over...");
				continue;
			}
			
			if(results[x].getValue("custbody194")=="2" || results[x].getValue("custbody194")=="3")
			{
				//DD on a Specific Date OR DD after a Specific Date
				var increment = 1;
				if(today.getDay()=="5")
					increment = 3;
				else if(today.getDay()=="6")
					increment = 2;
				
				//Calculate two business days from today
				var twoBusinessDays;
				switch(today.getDay())
				{
					case 0: //Sunday
					case 1: //Monday
					case 2: //Tuesday
					case 3: //Wednesday
						twoBusinessDays = nlapiAddDays(today,2);
						break;
					case 4: //Thursday
					case 5: //Friday
						twoBusinessDays = nlapiAddDays(today,4);
						break;
					case 6: //Sunday
						twoBusinessDays = nlapiAddDays(today,3);
						break;
				}
				
				twoBusinessDays = nlapiDateToString(twoBusinessDays,"date");
				
				//If Drop Ship Materisl Sent To Vendor Is Not Empty AND Delivery Date = 2 Business Days Out (Added 5-31-2016)
				if(results[x].getValue("custbody39")!=null && results[x].getValue("custbody39")!="" && results[x].getValue("custbody6")==twoBusinessDays)
				{
					//Allow fulfillment to be created
				}
				else if(nlapiDateToString(nlapiAddDays(today,increment),"date")!=results[x].getValue("custbody6"))
				{
					nlapiLogExecution("debug","Delivery Date is not next day for 'DD on a Specific Date' order","DD: " + results[x].getValue("custbody6"));
					continue;
				}
			}
			
			var dsFlag = "No";
			if(results[x].getValue("custbody39")!=null && results[x].getValue("custbody39")!="")
				dsFlag = "Yes";
				
			var location = "0";
			nlapiLogExecution("debug","Drop Ship Vendor",results[x].getValue("custbody_drop_ship_vendor"));
			
			var dropShipVendor = results[x].getValue("custbody_drop_ship_vendor");
			if(dropShipVendor!=null && dropShipVendor!="")
			{
				location = nlapiLookupField("vendor",dropShipVendor,"custentity138");
				
				nlapiLogExecution("debug","Drop Ship Vendor: " + dropShipVendor,"Location: " + location);
			}
			
			Set_Locations(results[x].getId(),location);
		}
	}
}

function Set_Locations(orderId,location)
{
	var orderRec = nlapiLoadRecord("salesorder",orderId);
	
	for(var x=0; x < orderRec.getLineItemCount("item"); x++)
	{
		var itemType = orderRec.getLineItemValue("item","itemtype",x+1);
		if(itemType=="InvtPart" || itemType=="Assembly" || itemType=="NonInvtPart" || itemType=="OthCharge")
		{
			if(orderRec.getLineItemValue("item","quantitybackordered",x+1) > 0 && isDropShipItem(orderRec.getLineItemValue("item","custcol_category",x+1)))
			{
				var filters = [];
				filters.push(new nlobjSearchFilter("locationquantityonhand",null,"greaterthan","0"));
				filters.push(new nlobjSearchFilter("internalid",null,"is",orderRec.getLineItemValue("item","item",x+1)));
				var cols = [];
				cols.push(new nlobjSearchColumn("inventorylocation"));
				var results = nlapiSearchRecord("item",null,filters,cols);
				if(results)
				{
					orderRec.setLineItemValue("item","location",x+1,results[0].getValue("inventorylocation"));
				}
			}
			else
			{
				orderRec.setLineItemValue("item","location",x+1,location);
			}
		}
	}
	
	nlapiSubmitRecord(orderRec,true,true);
}

function isDropShipItem(cat){
	//Finished Jewelry (Earrings, Pendant, FJ, Bracelets), Antique, Preset Engagement Ring, Preset Matched Set, Certed Preset Engagement Ring, Uncerted Preset Engagement Ring
	if(cat=='4' || cat=='5' || cat=='9' || cat=='34' || cat=='24' || cat=='32' || cat=='33' || cat=='35' || cat=='36')
		return true;
	else
		return false;
}
