nlapiLogExecution("audit","FLOStart",new Date().getTime());
var usage;
var start_line,sub_index,csvJSON,user;

function updateItemBillingFields()
{
	try
	{
		//Retrieve script parameter - csv json
		csvJSON = nlapiGetContext().getSetting("SCRIPT","custscript_csv_item_fields_json");
		start_line = nlapiGetContext().getSetting("SCRIPT","custscriptcsv_current_line_item");
		user = nlapiGetContext().getSetting("SCRIPT","custscript_csv_item_fields_user");
		sub_index = nlapiGetContext().getSetting("SCRIPT","custscript_sub_index_item_flds");
		
		nlapiLogExecution("debug","Start Line",start_line);
		nlapiLogExecution("debug","Sub Index",sub_index);
		
		nlapiLogExecution("debug","CSV JSON",csvJSON);
		
		if(csvJSON==null || csvJSON=="")
			return true;
			
		if(start_line==null || start_line=="")
			start_line=0;
			
		if(sub_index==null || sub_index=="")
			sub_index=0;
			
		var items = JSON.parse(csvJSON);
		nlapiLogExecution("debug","# Lines",items.length);
		for(var x=start_line; x < items.length; x++)
		{
			if(items[x].item=="" || items[x].item==null)
				continue;
			
			nlapiLogExecution("debug","Updating CSV Line " + x);
			usage = nlapiGetContext().getRemainingUsage();
			if(usage < 45)
			{
				var params = [];
				params["custscript_csv_item_fields_json"] = csvJSON;
				params["custscriptcsv_current_line_item"] = x;
				params["custscript_csv_item_fields_user"] = user;
				params["custscript_sub_index_item_flds"] = sub_index;
				nlapiScheduleScript("customscript_csv_update_item_fields",null,params);
				nlapiLogExecution("debug","Restarting Script: Out of Usage Units","Units: " + usage);
				return true;	
			}
			else
			{
				var updateReturn = updateItemPricing(items[x],sub_index,x);
				nlapiLogExecution("debug","Update Fx Return",updateReturn);
				if(updateReturn==="stop")
				{
					nlapiLogExecution("debug","Exit Script");
					return true;	
				}
				
				updateParentItem(items[x]); // 20 Units
					
				sub_index = 0;	
			}
		}
		
		nlapiSendEmail(user,user,"Cost CSV Upload Complete","Your CSV cost upload has completed.");
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating Children","Details: " + err.message);
		nlapiSendEmail(user,user,"Cost CSV Upload Error","Your CSV cost upload has terminated due to errors.");
		return true;
	}
}

function updateItemPricing(itemObj,startAt,currentLine)
{
	try
	{
		//Get item object
		var item = itemObj;
		
		//Get Sub-items
		var filters = [];
		filters.push(new nlobjSearchFilter("itemid","parent","is",item.item));
		var cols = [];
		var internalIDSort = new nlobjSearchColumn("internalid");
		internalIDSort.setSort();
		cols.push(internalIDSort);
		cols.push(new nlobjSearchColumn("itemid"));
		cols.push(new nlobjSearchColumn("parent"));
		var search = nlapiCreateSearch("item",filters,cols);
		var resultSet = search.runSearch();
		var searchid = parseInt(startAt);
		nlapiLogExecution("debug","Search ID",searchid);
		do{
			var results = resultSet.getResults(searchid,searchid+1000);
			for(var x=0; x < results.length; x++)
			{
				var itemRec = nlapiLoadRecord("inventoryitem",results[x].getId()); //5 UNITS
				itemRec.setFieldValue("custitem_pricing_category",item.pricing_category_ch);
				itemRec.setFieldValue("custitem_setting_melee",item.setting_melee_ch);
				itemRec.setFieldValue("custitem_center_setting",item.center_setting_ch);
				itemRec.setFieldValue("custitem_polish",item.polish_ch);
				itemRec.setFieldValue("custitem_admin",item.admin_ch);
				itemRec.setFieldValue("custitem_milgrain",item.milgrain_ch);
				itemRec.setFieldValue("custitem_sizing_labor",item.sizing_labor_ch);
				itemRec.setFieldValue("custitem_miscellaneous",item.miscellaneous_ch);
				
				itemRec.setFieldValue("custitem_pricing_category_usny",item.pricing_category_usny);
				itemRec.setFieldValue("custitem_setting_melee_usny",item.setting_melee_usny);
				itemRec.setFieldValue("custitem_center_setting_usny",item.center_setting_usny);
				itemRec.setFieldValue("custitem_polish_usny",item.polish_usny);
				itemRec.setFieldValue("custitem_admin_usny",item.admin_usny);
				itemRec.setFieldValue("custitem_milgrain_usny",item.milgrain_usny);
				itemRec.setFieldValue("custitem_sizing_labor_usny",item.sizing_labor_usny);
				itemRec.setFieldValue("custitem_miscellaneous_usny",item.miscellaneous_usny);		
				
				var fixedCost = 0.00;
				if(item.setting_melee_ch!=null && item.setting_melee_ch!="")
					fixedCost += parseFloat(item.setting_melee_ch);
				if(item.center_setting_ch!=null && item.center_setting_ch!="")
					fixedCost += parseFloat(item.center_setting_ch);
				if(item.polish_ch!=null && item.polish_ch!="")
					fixedCost += parseFloat(item.polish_ch);
				if(item.admin_ch!=null && item.admin_ch!="")
					fixedCost += parseFloat(item.admin_ch);
				if(item.milgrain_ch!=null && item.milgrain_ch!="")
					fixedCost += parseFloat(item.milgrain_ch);
				if(item.sizing_labor_ch!=null && item.sizing_labor_ch!="")
					fixedCost += parseFloat(item.sizing_labor_ch);
				if(item.miscellaneous_ch!=null && item.miscellaneous_ch!="")
					fixedCost += parseFloat(item.miscellaneous_ch);
					
				itemRec.setFieldValue("custitem_fixed_cost",fixedCost);
				
				var fixedCostUSNY = 0.00;
				if(item.setting_melee_usny!=null && item.setting_melee_usny!="")
					fixedCostUSNY += parseFloat(item.setting_melee_usny);
				if(item.center_setting_usny!=null && item.center_setting_usny!="")
					fixedCostUSNY += parseFloat(item.center_setting_usny);
				if(item.polish_usny!=null && item.polish_usny!="")
					fixedCostUSNY += parseFloat(item.polish_usny);
				if(item.admin_usny!=null && item.admin_usny!="")
					fixedCostUSNY += parseFloat(item.admin_usny);
				if(item.milgrain_usny!=null && item.milgrain_usny!="")
					fixedCostUSNY += parseFloat(item.milgrain_usny);
				if(item.sizing_labor_usny!=null && item.sizing_labor_usny!="")
					fixedCostUSNY += parseFloat(item.sizing_labor_usny);
				if(item.miscellaneous_usny!=null && item.miscellaneous_usny!="")
					fixedCostUSNY += parseFloat(item.miscellaneous_usny);
					
				itemRec.setFieldValue("custitem_fixed_cost_usny",fixedCostUSNY);
							
				nlapiSubmitRecord(itemRec,true,true); //10 UNITS
				
				usage = nlapiGetContext().getRemainingUsage();
				if(x+1<results.length && usage < 45)
				{
					//Reschedule Script no more usage remaining
					var params = [];
					params["custscript_csv_item_fields_json"] = csvJSON;
					params["custscriptcsv_current_line_item"] = currentLine;
					params["custscript_sub_index_item_flds"] = searchid+1;
					params["custscript_csv_item_fields_user"] = user;
					nlapiScheduleScript("customscript_csv_update_item_fields",null,params);
					nlapiLogExecution("debug","Restarting Script: Out of Usage Units","Units: " + usage);
					return "stop";
				}
				
				searchid++;
			}
		}while(results.length >= 1000);
		
		return "continue";
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating Children","Details: " + err.message);
		nlapiSendEmail(user,user,"Pricing CSV Upload Error","Your CSV pricing upload has terminated due to errors.");
		return "stop";
	}
}

function updateParentItem(itemObj)
{
	try
	{
		//Get item object
		var item = itemObj;
		
		var filters = [];
		filters.push(new nlobjSearchFilter("itemid","parent","is",item.item));
		var cols = [];
		cols.push(new nlobjSearchColumn("parent"));
		var results = nlapiSearchRecord("item",null,filters,cols);
		if(results)
		{
			var parent = results[0].getValue("parent");
			var parentItem = nlapiLoadRecord("inventoryitem",parent);
			parentItem.setFieldValue("custitem_pricing_category",item.pricing_category_ch);
			parentItem.setFieldValue("custitem_setting_melee",item.setting_melee_ch);
			parentItem.setFieldValue("custitem_center_setting",item.center_setting_ch);
			parentItem.setFieldValue("custitem_polish",item.polish_ch);
			parentItem.setFieldValue("custitem_admin",item.admin_ch);
			parentItem.setFieldValue("custitem_milgrain",item.milgrain_ch);
			parentItem.setFieldValue("custitem_sizing_labor",item.sizing_labor_ch);
			parentItem.setFieldValue("custitem_miscellaneous",item.miscellaneous_ch);
			
			parentItem.setFieldValue("custitem_pricing_category_usny",item.pricing_category_usny);
			parentItem.setFieldValue("custitem_setting_melee_usny",item.setting_melee_usny);
			parentItem.setFieldValue("custitem_center_setting_usny",item.center_setting_usny);
			parentItem.setFieldValue("custitem_polish_usny",item.polish_usny);
			parentItem.setFieldValue("custitem_admin_usny",item.admin_usny);
			parentItem.setFieldValue("custitem_milgrain_usny",item.milgrain_usny);
			parentItem.setFieldValue("custitem_sizing_labor_usny",item.sizing_labor_usny);
			parentItem.setFieldValue("custitem_miscellaneous_usny",item.miscellaneous_usny);		
			
			var fixedCost = 0.00;
			if(item.setting_melee_ch!=null && item.setting_melee_ch!="")
				fixedCost += parseFloat(item.setting_melee_ch);
			if(item.center_setting_ch!=null && item.center_setting_ch!="")
				fixedCost += parseFloat(item.center_setting_ch);
			if(item.polish_ch!=null && item.polish_ch!="")
				fixedCost += parseFloat(item.polish_ch);
			if(item.admin_ch!=null && item.admin_ch!="")
				fixedCost += parseFloat(item.admin_ch);
			if(item.milgrain_ch!=null && item.milgrain_ch!="")
				fixedCost += parseFloat(item.milgrain_ch);
			if(item.sizing_labor_ch!=null && item.sizing_labor_ch!="")
				fixedCost += parseFloat(item.sizing_labor_ch);
			if(item.miscellaneous_ch!=null && item.miscellaneous_ch!="")
				fixedCost += parseFloat(item.miscellaneous_ch);
				
			parentItem.setFieldValue("custitem_fixed_cost",fixedCost);	
			
			var fixedCostUSNY = 0.00;
			if(item.setting_melee_usny!=null && item.setting_melee_usny!="")
				fixedCostUSNY += parseFloat(item.setting_melee_usny);
			if(item.center_setting_usny!=null && item.center_setting_usny!="")
				fixedCostUSNY += parseFloat(item.center_setting_usny);
			if(item.polish_usny!=null && item.polish_usny!="")
				fixedCostUSNY += parseFloat(item.polish_usny);
			if(item.admin_usny!=null && item.admin_usny!="")
				fixedCostUSNY += parseFloat(item.admin_usny);
			if(item.milgrain_usny!=null && item.milgrain_usny!="")
				fixedCostUSNY += parseFloat(item.milgrain_usny);
			if(item.sizing_labor_usny!=null && item.sizing_labor_usny!="")
				fixedCostUSNY += parseFloat(item.sizing_labor_usny);
			if(item.miscellaneous_usny!=null && item.miscellaneous_usny!="")
				fixedCostUSNY += parseFloat(item.miscellaneous_usny);
				
			parentItem.setFieldValue("custitem_fixed_cost_usny",fixedCostUSNY);
				
			nlapiSubmitRecord(parentItem,false,true);
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating Parent Record","Details: " + err.message);
		return true;
	}
}
