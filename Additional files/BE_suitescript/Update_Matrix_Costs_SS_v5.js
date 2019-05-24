var usage;
var start_line,sub_index,csvJSON,user,filename,exclude14k;

function updateMatrixPricing()
{
	try
	{
		//Retrieve script parameter - csv json
		csvJSON = nlapiGetContext().getSetting("SCRIPT","custscript_csv_cost_json");
		start_line = nlapiGetContext().getSetting("SCRIPT","custscriptcsv_current_line_cost");
		sub_index = nlapiGetContext().getSetting("SCRIPT","custscript_sub_index_cost");
		user = nlapiGetContext().getSetting("SCRIPT","custscript_csv_cost_update_user");
		filename = nlapiGetContext().getSetting("SCRIPT","custscript_csv_filename");
		exclude14k = nlapiGetContext().getSetting("SCRIPT","custscript_exclude_14k");
		
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
				params["custscript_csv_cost_json"] = csvJSON;
				params["custscriptcsv_current_line_cost"] = x;
				params["custscript_sub_index_cost"] = sub_index;
				params["custscript_csv_cost_update_user"] = user;
				params["custscript_csv_filename"] = filename;
				params["custscript_exclude_14k"] = exclude14k;
				nlapiScheduleScript("customscript_csv_update_matrix_costs",null,params);
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
		
		var items14K = [];
		for(var x=0; x < items.length; x++)
		{
			if(items[x].item=="" || items[x].item==null)
				continue;
			else
				items14K.push(items[x].item);
		}
		
		//Run scheduled script to update 14K items
		if(exclude14k!="T")
		{
			var params = [];
			params["custscript_14k_items"] = items14K.join(",");
			nlapiScheduleScript("customscript276",null,params);
		}
		
		nlapiSendEmail(user,user,"Cost CSV Upload Complete","Your CSV cost upload (" + filename + ") has completed.");
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating Children","Details: " + err.message);
		nlapiSendEmail(user,user,"Cost CSV Upload Error","Your CSV cost upload (" + filename + ") has terminated due to errors.");
		return true;
	}
}

function updateItemPricing(itemObj,startAt,currentLine)
{
	try
	{
		//Get item object
		var item = itemObj;
		
		//Determine preferred vendors
		item.cost_18kw_pref = calcPreferredVendor(parseFloat(item.cost_18kw_ch),parseFloat(item.cost_18kw_usny),parseFloat(item.cost_18kw_tessler));
		item.cost_18ky_pref = calcPreferredVendor(parseFloat(item.cost_18ky_ch),parseFloat(item.cost_18ky_usny),parseFloat(item.cost_18ky_tessler));
		item.cost_platinum_pref = calcPreferredVendor(parseFloat(item.cost_platinum_ch),parseFloat(item.cost_platinum_usny),parseFloat(item.cost_platinum_tessler));
		
		//Determine which columns (metal types) to update
		var metalTypes = [];
		if(item.cost_18kw_ch!=null && item.cost_18kw_ch!="")
			metalTypes.push(1);
		if(item.cost_18ky_ch!=null && item.cost_18ky_ch!="")
			metalTypes.push(2);
		if(item.cost_platinum_ch!=null && item.cost_platinum_ch!="")
			metalTypes.push(3);
		if(item.cost_18kw_usny!=null && item.cost_18kw_usny!="")
			metalTypes.push(1);
		if(item.cost_18ky_usny!=null && item.cost_18ky_usny!="")
			metalTypes.push(2);
		if(item.cost_platinum_usny!=null && item.cost_platinum_usny!="")
			metalTypes.push(3);
		if(item.cost_18kw_tessler!=null && item.cost_18kw_tessler!="")
			metalTypes.push(1);
		if(item.cost_18ky_tessler!=null && item.cost_18ky_tessler!="")
			metalTypes.push(2);
		if(item.cost_platinum_tessler!=null && item.cost_platinum_tessler!="")
			metalTypes.push(3);
			
		//CAD Metal Types
		if(item.cost_18kw_ch_cad!=null && item.cost_18kw_ch_cad!="")
			metalTypes.push(1);
		if(item.cost_18ky_ch_cad!=null && item.cost_18ky_ch_cad!="")
			metalTypes.push(2);
		if(item.cost_platinum_ch_cad!=null && item.cost_platinum_ch_cad!="")
			metalTypes.push(3);
		if(item.cost_18kw_usny_cad!=null && item.cost_18kw_usny_cad!="")
			metalTypes.push(1);
		if(item.cost_18ky_usny_cad!=null && item.cost_18ky_usny_cad!="")
			metalTypes.push(2);
		if(item.cost_platinum_usny_cad!=null && item.cost_platinum_usny_cad!="")
			metalTypes.push(3);
		if(item.cost_18kw_tessler_cad!=null && item.cost_18kw_tessler_cad!="")
			metalTypes.push(1);
		if(item.cost_18ky_tessler_cad!=null && item.cost_18ky_tessler_cad!="")
			metalTypes.push(2);
		if(item.cost_platinum_tessler_cad!=null && item.cost_platinum_tessler_cad!="")
			metalTypes.push(3);
			
		nlapiLogExecution("debug","Metal Types",metalTypes.toString());
		
		//Get Sub-items
		var filters = [];
		filters.push(new nlobjSearchFilter("itemid","parent","is",item.item));
		filters.push(new nlobjSearchFilter("custitem1",null,"anyof",metalTypes)); 
		var cols = [];
		var internalIDSort = new nlobjSearchColumn("internalid");
		internalIDSort.setSort();
		cols.push(internalIDSort);
		cols.push(new nlobjSearchColumn("itemid"));
		cols.push(new nlobjSearchColumn("custitem1"));
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
				nlapiLogExecution("debug","Updating Item #" + itemRec.getFieldValue("itemid"));
				
				if(results[x].getValue("custitem1")=="1")
				{
					if(item.cost_18kw_ch!=null && item.cost_18kw_ch!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="153")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18kw_ch);
								if(item.cost_18kw_pref == "CH")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18kw_ch);	
								}
							}
						}
					}
					if(item.cost_18kw_usny!=null && item.cost_18kw_usny!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="7773")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18kw_usny);
								if(item.cost_18kw_pref == "USNY")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18kw_usny);		
								}
							}
						}
					}
					if(item.cost_18kw_tessler!=null && item.cost_18kw_tessler!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="2754226")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18kw_tessler);
								if(item.cost_18kw_pref == "TESSLER")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18kw_tessler);		
								}
							}
						}
					}
				}
				else if(results[x].getValue("custitem1")=="2")
				{
					if(item.cost_18ky_ch!=null && item.cost_18ky_ch!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="153")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18ky_ch);
								if(item.cost_18ky_pref == "CH")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18ky_ch);	
								}
							}
						}
					}
					if(item.cost_18ky_usny!=null && item.cost_18ky_usny!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="7773")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18ky_usny);
								if(item.cost_18ky_pref == "USNY")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18ky_usny);
								}
							}
						}
					}
					if(item.cost_18ky_tessler!=null && item.cost_18ky_tessler!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="2754226")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18ky_tessler);
								if(item.cost_18ky_pref == "TESSLER")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18ky_tessler);		
								}
							}
						}
					}
				}
				else if(results[x].getValue("custitem1")=="3")
				{
					if(item.cost_platinum_ch!=null && item.cost_platinum_ch!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="153")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_platinum_ch);
								if(item.cost_platinum_pref == "CH")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_platinum_ch);	
								}
							}
						}
					}
					if(item.cost_platinum_usny!=null && item.cost_platinum_usny!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="7773")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_platinum_usny);
								if(item.cost_platinum_pref == "USNY")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_platinum_usny);	
								}
							}
						}
					}
					if(item.cost_platinum_tessler!=null && item.cost_platinum_tessler!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="2754226")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_platinum_tessler);
								if(item.cost_platinum_pref == "TESSLER")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_platinum_tessler);		
								}
							}
						}
					}
				}
				
				
				if(item.cost_18kw_ch!=null && item.cost_18kw_ch!="")
					itemRec.setFieldValue("custitem_cost_18kw_ch",item.cost_18kw_ch);
				else
					itemRec.setFieldValue("custitem_cost_18kw_ch","");
				
				if(item.cost_18ky_ch!=null && item.cost_18ky_ch!="")
					itemRec.setFieldValue("custitem_cost_18ky_ch",item.cost_18ky_ch);
				else
					itemRec.setFieldValue("custitem_cost_18ky_ch","");
				
				if(item.cost_platinum_ch!=null && item.cost_platinum_ch!="")
					itemRec.setFieldValue("custitem_cost_platinum_ch",item.cost_platinum_ch);
				else
					itemRec.setFieldValue("custitem_cost_platinum_ch","");
				
				if(item.cost_18kw_usny!=null && item.cost_18kw_usny!="")
					itemRec.setFieldValue("custitem_cost_18kw_usny",item.cost_18kw_usny);
				else
					itemRec.setFieldValue("custitem_cost_18kw_usny","");
				
				if(item.cost_18ky_usny!=null && item.cost_18ky_usny!="")
					itemRec.setFieldValue("custitem_cost_18ky_usny",item.cost_18ky_usny);
				else
					itemRec.setFieldValue("custitem_cost_18ky_usny","");
				
				if(item.cost_platinum_usny!=null && item.cost_platinum_usny!="")
					itemRec.setFieldValue("custitem_cost_platinum_usny",item.cost_platinum_usny);
				else
					itemRec.setFieldValue("custitem_cost_platinum_usny","");
					
				if(item.cost_18kw_tessler!=null && item.cost_18kw_tessler!="")
					itemRec.setFieldValue("custitem_cost_18kw_tessler",item.cost_18kw_tessler);
				else
					itemRec.setFieldValue("custitem_cost_18kw_tessler","");
				
				if(item.cost_18ky_tessler!=null && item.cost_18ky_tessler!="")
					itemRec.setFieldValue("custitem_cost_18ky_tessler",item.cost_18ky_tessler);
				else
					itemRec.setFieldValue("custitem_cost_18ky_tessler","");
				
				if(item.cost_platinum_tessler!=null && item.cost_platinum_tessler!="")
					itemRec.setFieldValue("custitem_cost_platinum_tessler",item.cost_platinum_tessler);
				else
					itemRec.setFieldValue("custitem_cost_platinum_tessler","");
				
				//Added New - CAD Fields
				if(item.cost_18kw_ch_cad!=null && item.cost_18kw_ch_cad!="")
					itemRec.setFieldValue("custitem_cost_for_18kw_ch_cad",item.cost_18kw_ch_cad);
				else
					itemRec.setFieldValue("custitem_cost_for_18kw_ch_cad","");
				
				if(item.cost_18ky_ch_cad!=null && item.cost_18ky_ch_cad!="")
					itemRec.setFieldValue("custitem_cost_for_18ky_ch_cad",item.cost_18ky_ch_cad);
				else
					itemRec.setFieldValue("custitem_cost_for_18ky_ch_cad","");
				
				if(item.cost_platinum_ch_cad!=null && item.cost_platinum_ch_cad!="")
					itemRec.setFieldValue("custitem_cost_for_plat_ch_cad",item.cost_platinum_ch_cad);
				else
					itemRec.setFieldValue("custitem_cost_for_plat_ch_cad","");
				
				if(item.cost_18kw_usny_cad!=null && item.cost_18kw_usny_cad!="")
					itemRec.setFieldValue("custitem_cost_for_18kw_usny_cad",item.cost_18kw_usny_cad);
				else
					itemRec.setFieldValue("custitem_cost_for_18kw_usny_cad","");
				
				if(item.cost_18ky_usny_cad!=null && item.cost_18ky_usny_cad!="")
					itemRec.setFieldValue("custitem_cost_for_18ky_usny_cad",item.cost_18ky_usny_cad);
				else
					itemRec.setFieldValue("custitem_cost_for_18ky_usny_cad","");
				
				if(item.cost_platinum_usny_cad!=null && item.cost_platinum_usny_cad!="")
					itemRec.setFieldValue("custitem_cost_for_plat_usny_cad",item.cost_platinum_usny_cad);
				else
					itemRec.setFieldValue("custitem_cost_for_plat_usny_cad","");
					
				if(item.cost_18kw_tessler_cad!=null && item.cost_18kw_tessler_cad!="")
					itemRec.setFieldValue("custitem_cost_18kw_tessler_cad",item.cost_18kw_tessler_cad);
				else
					itemRec.setFieldValue("custitem_cost_18kw_tessler_cad","");
				
				if(item.cost_18ky_tessler_cad!=null && item.cost_18ky_tessler_cad!="")
					itemRec.setFieldValue("custitem_cost_18ky_tessler_cad",item.cost_18ky_tessler_cad);
				else
					itemRec.setFieldValue("custitem_cost_18ky_tessler_cad","");
				
				if(item.cost_platinum_tessler_cad!=null && item.cost_platinum_tessler_cad!="")
					itemRec.setFieldValue("custitem_cost_platinum_tessler_cad",item.cost_platinum_tessler_cad);
				else
					itemRec.setFieldValue("custitem_cost_platinum_tessler_cad","");
				
				nlapiSubmitRecord(itemRec,true,true); //10 UNITS
				
				usage = nlapiGetContext().getRemainingUsage();
				if(x+1<results.length && usage < 45)
				{
					//Reschedule Script no more usage remaining
					var params = [];
					params["custscript_csv_cost_json"] = csvJSON;
					params["custscriptcsv_current_line_cost"] = currentLine;
					params["custscript_sub_index_cost"] = searchid+1;
					params["custscript_csv_cost_update_user"] = user;
					params["custscript_csv_filename"] = filename;
					params["custscript_exclude_14k"] = exclude14k;
					nlapiScheduleScript("customscript_csv_update_matrix_costs",null,params);
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
			
			if(item.cost_18kw_ch!=null && item.cost_18kw_ch!="")
				parentItem.setFieldValue("custitem_cost_18kw_ch",item.cost_18kw_ch);
			else
				parentItem.setFieldValue("custitem_cost_18kw_ch","");
			
			if(item.cost_18ky_ch!=null && item.cost_18ky_ch!="")
				parentItem.setFieldValue("custitem_cost_18ky_ch",item.cost_18ky_ch);
			else
				parentItem.setFieldValue("custitem_cost_18ky_ch","");
			
			if(item.cost_platinum_ch!=null && item.cost_platinum_ch!="")
				parentItem.setFieldValue("custitem_cost_platinum_ch",item.cost_platinum_ch);
			else
				parentItem.setFieldValue("custitem_cost_platinum_ch","");
			
			if(item.cost_18kw_usny!=null && item.cost_18kw_usny!="")
				parentItem.setFieldValue("custitem_cost_18kw_usny",item.cost_18kw_usny);
			else
				parentItem.setFieldValue("custitem_cost_18kw_usny","");
			
			if(item.cost_18ky_usny!=null && item.cost_18ky_usny!="")
				parentItem.setFieldValue("custitem_cost_18ky_usny",item.cost_18ky_usny);
			else
				parentItem.setFieldValue("custitem_cost_18ky_usny","");
			
			if(item.cost_platinum_usny!=null && item.cost_platinum_usny!="")
				parentItem.setFieldValue("custitem_cost_platinum_usny",item.cost_platinum_usny);
			else
				parentItem.setFieldValue("custitem_cost_platinum_usny","");
				
			//Added New - CAD Fields
			if(item.cost_18kw_ch_cad!=null && item.cost_18kw_ch_cad!="")
				parentItem.setFieldValue("custitem_cost_for_18kw_ch_cad",item.cost_18kw_ch_cad);
			else
				parentItem.setFieldValue("custitem_cost_for_18kw_ch_cad","");
			
			if(item.cost_18ky_ch_cad!=null && item.cost_18ky_ch_cad!="")
				parentItem.setFieldValue("custitem_cost_for_18ky_ch_cad",item.cost_18ky_ch_cad);
			else
				parentItem.setFieldValue("custitem_cost_for_18ky_ch_cad","");
			
			if(item.cost_platinum_ch_cad!=null && item.cost_platinum_ch_cad!="")
				parentItem.setFieldValue("custitem_cost_for_plat_ch_cad",item.cost_platinum_ch_cad);
			else
				parentItem.setFieldValue("custitem_cost_for_plat_ch_cad","");
			
			if(item.cost_18kw_usny_cad!=null && item.cost_18kw_usny_cad!="")
				parentItem.setFieldValue("custitem_cost_for_18kw_usny_cad",item.cost_18kw_usny_cad);
			else
				parentItem.setFieldValue("custitem_cost_for_18kw_usny_cad","");
			
			if(item.cost_18ky_usny_cad!=null && item.cost_18ky_usny_cad!="")
				parentItem.setFieldValue("custitem_cost_for_18ky_usny_cad",item.cost_18ky_usny_cad);
			else
				parentItem.setFieldValue("custitem_cost_for_18ky_usny_cad","");
			
			if(item.cost_platinum_usny_cad!=null && item.cost_platinum_usny_cad!="")
				parentItem.setFieldValue("custitem_cost_for_plat_usny_cad",item.cost_platinum_usny_cad);
			else
				parentItem.setFieldValue("custitem_cost_for_plat_usny_cad","");
				
			nlapiSubmitRecord(parentItem,false,true);
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating Parent Record","Details: " + err.message);
		return true;
	}
}

function calcPreferredVendor(ch,usny,tessler)
{
	var prefVendor = "CH";
	var lowest = ch;
	
	if(ch==null || ch=="" || ch==0)
	{
		prefVendor = "USNY";
		lowest = usny;
	}	
	else
	{
		if(usny!=null && usny!="" && usny!=0)
		{
			if(parseFloat(usny) < parseFloat(ch))
			{
				prefVendor = "USNY";
				lowest = usny;
			}	
		}
	}
	
	if(tessler!=null && tessler!="" && tessler!=0)
	{
		if(lowest==null || lowest=="" || lowest==0)
		{
			prefVendor = "TESSLER";
			lowest = tessler;
		}
		else
		{
			if(parseFloat(tessler) < parseFloat(lowest))
			{
				prefVendor = "TESSLER";
				lowest = tessler;
			}	
		}
	}
	
	return prefVendor;
}
