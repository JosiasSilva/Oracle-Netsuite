nlapiLogExecution("audit","FLOStart",new Date().getTime());
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
		
		//return true;
		
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
		item.cost_18kw_pref = calcPreferredVendor(parseFloat(item.cost_18kw_ch),parseFloat(item.cost_18kw_usny),parseFloat(item.cost_18kw_sasha),parseFloat(item.cost_18kw_endless),parseFloat(item.cost_18kw_benchmark),parseFloat(item.cost_18kw_mw),parseFloat(item.cost_18kw_gf),parseFloat(item.cost_18kw_overnight));
		item.cost_18ky_pref = calcPreferredVendor(parseFloat(item.cost_18ky_ch),parseFloat(item.cost_18ky_usny),parseFloat(item.cost_18ky_sasha),parseFloat(item.cost_18ky_endless),parseFloat(item.cost_18ky_benchmark),parseFloat(item.cost_18ky_mw),parseFloat(item.cost_18ky_gf),parseFloat(item.cost_18ky_overnight));
		item.cost_platinum_pref = calcPreferredVendor(parseFloat(item.cost_platinum_ch),parseFloat(item.cost_platinum_usny),parseFloat(item.cost_platinum_sasha),parseFloat(item.cost_platinum_endless),parseFloat(item.cost_platinum_benchmark),parseFloat(item.cost_platinum_mw),parseFloat(item.cost_platinum_gf),parseFloat(item.cost_platinum_overnight));
		item.cost_14k_pref = calcPreferredVendor(parseFloat(item.cost_14k_ch),parseFloat(item.cost_14k_usny),parseFloat(item.cost_14k_sasha),parseFloat(item.cost_14k_endless),parseFloat(item.cost_14k_benchmark),parseFloat(item.cost_14k_mw),parseFloat(item.cost_14k_gf),parseFloat(item.cost_14k_overnight));
		item.cost_14kr_pref = calcPreferredVendor(parseFloat(item.cost_14kr_ch),parseFloat(item.cost_14kr_usny),parseFloat(item.cost_14kr_sasha),parseFloat(item.cost_14kr_endless),parseFloat(item.cost_14kr_benchmark),parseFloat(item.cost_14kr_mw),parseFloat(item.cost_14kr_gf),parseFloat(item.cost_14kr_overnight));
		item.cost_palladium_pref = calcPreferredVendor(parseFloat(item.cost_palladium_ch),parseFloat(item.cost_palladium_usny),parseFloat(item.cost_palladium_sasha),parseFloat(item.cost_palladium_endless),parseFloat(item.cost_palladium_benchmark),parseFloat(item.cost_palladium_mw),parseFloat(item.cost_palladium_gf),parseFloat(item.cost_palladium_overnight));
		
		//Determine which columns (metal types) to update
		//CH
		var metalTypes = [];
		if(item.cost_18kw_ch!=null && item.cost_18kw_ch!="")
			metalTypes.push(1);
		if(item.cost_18ky_ch!=null && item.cost_18ky_ch!="")
			metalTypes.push(2);
		if(item.cost_platinum_ch!=null && item.cost_platinum_ch!="")
			metalTypes.push(3);
		if(item.cost_14k_ch!=null && item.cost_14k_ch!="")
		{
			metalTypes.push(5); //14KW
			metalTypes.push(6); //14KY
		}
		if(item.cost_14kr_ch!=null && item.cost_14kr_ch!="")
			metalTypes.push(7);
		if(item.cost_palladium_ch!=null && item.cost_palladium_ch!="")
			metalTypes.push(4);
			
		//USNY
		if(item.cost_18kw_usny!=null && item.cost_18kw_usny!="")
			metalTypes.push(1);
		if(item.cost_18ky_usny!=null && item.cost_18ky_usny!="")
			metalTypes.push(2);
		if(item.cost_platinum_usny!=null && item.cost_platinum_usny!="")
			metalTypes.push(3);
		if(item.cost_14k_usny!=null && item.cost_14k_usny!="")
		{
			metalTypes.push(5); //14KW
			metalTypes.push(6); //14KY
		}
		if(item.cost_14kr_usny!=null && item.cost_14kr_usny!="")
			metalTypes.push(7);
		if(item.cost_palladium_usny!=null && item.cost_palladium_usny!="")
			metalTypes.push(4);
		
		//SASHA
		if(item.cost_18kw_sasha!=null && item.cost_18kw_sasha!="")
			metalTypes.push(1);
		if(item.cost_18ky_sasha!=null && item.cost_18ky_sasha!="")
			metalTypes.push(2);
		if(item.cost_platinum_sasha!=null && item.cost_platinum_sasha!="")
			metalTypes.push(3);
		if(item.cost_14k_sasha!=null && item.cost_14k_sasha!="")
		{
			metalTypes.push(5); //14KW
			metalTypes.push(6); //14KY
		}
		if(item.cost_14kr_sasha!=null && item.cost_14kr_sasha!="")
			metalTypes.push(7);
		if(item.cost_palladium_sasha!=null && item.cost_palladium_sasha!="")
			metalTypes.push(4);
		
		//ENDLESS
		if(item.cost_18kw_endless!=null && item.cost_18kw_endless!="")
			metalTypes.push(1);
		if(item.cost_18ky_endless!=null && item.cost_18ky_endless!="")
			metalTypes.push(2);
		if(item.cost_platinum_endless!=null && item.cost_platinum_endless!="")
			metalTypes.push(3);
		if(item.cost_14k_endless!=null && item.cost_14k_endless!="")
		{
			metalTypes.push(5); //14KW
			metalTypes.push(6); //14KY
		}
		if(item.cost_14kr_endless!=null && item.cost_14kr_endless!="")
			metalTypes.push(7);
		if(item.cost_palladium_endless!=null && item.cost_palladium_endless!="")
			metalTypes.push(4);
		
		//BENCHMARK
		if(item.cost_18kw_benchmark!=null && item.cost_18kw_benchmark!="")
			metalTypes.push(1);
		if(item.cost_18ky_benchmark!=null && item.cost_18ky_benchmark!="")
			metalTypes.push(2);
		if(item.cost_platinum_benchmark!=null && item.cost_platinum_benchmark!="")
			metalTypes.push(3);
		if(item.cost_14k_benchmark!=null && item.cost_14k_benchmark!="")
		{
			metalTypes.push(5); //14KW
			metalTypes.push(6); //14KY
		}
		if(item.cost_14kr_benchmark!=null && item.cost_14kr_benchmark!="")
			metalTypes.push(7);
		if(item.cost_palladium_benchmark!=null && item.cost_palladium_benchmark!="")
			metalTypes.push(4);
			
		//MIRACLEWORKS
		if(item.cost_18kw_mw!=null && item.cost_18kw_mw!="")
			metalTypes.push(1);
		if(item.cost_18ky_mw!=null && item.cost_18ky_mw!="")
			metalTypes.push(2);
		if(item.cost_platinum_mw!=null && item.cost_platinum_mw!="")
			metalTypes.push(3);
		if(item.cost_14k_mw!=null && item.cost_14k_mw!="")
		{
			metalTypes.push(5); //14KW
			metalTypes.push(6); //14KY
		}
		if(item.cost_14kr_mw!=null && item.cost_14kr_mw!="")
			metalTypes.push(7);
		if(item.cost_palladium_mw!=null && item.cost_palladium_mw!="")
			metalTypes.push(4);
		
		//GUILD AND FACET
		if(item.cost_18kw_gf!=null && item.cost_18kw_gf!="")
			metalTypes.push(1);
		if(item.cost_18ky_gf!=null && item.cost_18ky_gf!="")
			metalTypes.push(2);
		if(item.cost_platinum_gf!=null && item.cost_platinum_gf!="")
			metalTypes.push(3);
		if(item.cost_14k_gf!=null && item.cost_14k_gf!="")
		{
			metalTypes.push(5); //14KW
			metalTypes.push(6); //14KY
		}
		if(item.cost_14kr_gf!=null && item.cost_14kr_gf!="")
			metalTypes.push(7);
		if(item.cost_palladium_gf!=null && item.cost_palladium_gf!="")
			metalTypes.push(4);
		
		//OVERNIGHT
		if(item.cost_18kw_overnight!=null && item.cost_18kw_overnight!="")
			metalTypes.push(1);
		if(item.cost_18ky_overnight!=null && item.cost_18ky_overnight!="")
			metalTypes.push(2);
		if(item.cost_platinum_overnight!=null && item.cost_platinum_overnight!="")
			metalTypes.push(3);
		if(item.cost_14k_overnight!=null && item.cost_14k_overnight!="")
		{
			metalTypes.push(5); //14KW
			metalTypes.push(6); //14KY
		}
		if(item.cost_14kr_overnight!=null && item.cost_14kr_overnight!="")
			metalTypes.push(7);
		if(item.cost_palladium_overnight!=null && item.cost_palladium_overnight!="")
			metalTypes.push(4);
		
		
			
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
		if(item.cost_18kw_sasha_cad!=null && item.cost_18kw_sasha_cad!="")
			metalTypes.push(1);
		if(item.cost_18ky_sasha_cad!=null && item.cost_18ky_sasha_cad!="")
			metalTypes.push(2);
		if(item.cost_platinum_sasha_cad!=null && item.cost_platinum_sasha_cad!="")
			metalTypes.push(3);
		if(item.cost_18kw_endless_cad!=null && item.cost_18kw_endless_cad!="")
			metalTypes.push(1);
		if(item.cost_18ky_endless_cad!=null && item.cost_18ky_endless_cad!="")
			metalTypes.push(2);
		if(item.cost_platinum_endless_cad!=null && item.cost_platinum_endless_cad!="")
			metalTypes.push(3);
		if(item.cost_18kw_benchmark_cad!=null && item.cost_18kw_benchmark_cad!="")
			metalTypes.push(1);
		if(item.cost_18ky_benchmark_cad!=null && item.cost_18ky_benchmark_cad!="")
			metalTypes.push(2);
		if(item.cost_platinum_benchmark_cad!=null && item.cost_platinum_benchmark_cad!="")
			metalTypes.push(3);
		if(item.cost_14k_ch_cad!=null && item.cost_14k_ch_cad!="")
		{
			metalTypes.push(5);
			metalTypes.push(6);	
		}
		if(item.cost_14k_usny_cad!=null && item.cost_14k_usny_cad!="")
		{
			metalTypes.push(5);
			metalTypes.push(6);	
		}
		if(item.cost_14k_sasha_cad!=null && item.cost_14k_sasha_cad!="")
		{
			metalTypes.push(5);
			metalTypes.push(6);	
		}
		if(item.cost_14k_endless_cad!=null && item.cost_14k_endless_cad!="")
		{
			metalTypes.push(5);
			metalTypes.push(6);	
		}
		if(item.cost_14k_benchmark_cad!=null && item.cost_14k_benchmark_cad!="")
		{
			metalTypes.push(5);
			metalTypes.push(6);	
		}
		if(item.cost_14k_mw_cad!=null && item.cost_14k_mw_cad!="")
		{
			metalTypes.push(5);
			metalTypes.push(6);	
		}
		if(item.cost_14k_gf_cad!=null && item.cost_14k_gf_cad!="")
		{
			metalTypes.push(5);
			metalTypes.push(6);	
		}
		if(item.cost_14k_overnight_cad!=null && item.cost_14k_overnight_cad!="")
		{
			metalTypes.push(5);
			metalTypes.push(6);	
		}
		
		if(item.cost_14kr_ch_cad!=null && item.cost_14kr_ch_cad!="")
			metalTypes.push(7);
		if(item.cost_14kr_usny_cad!=null && item.cost_14kr_usny_cad!="")
			metalTypes.push(7);
		if(item.cost_14kr_sasha_cad!=null && item.cost_14kr_sasha_cad!="")
			metalTypes.push(7);
		if(item.cost_14kr_endless_cad!=null && item.cost_14kr_endless_cad!="")
			metalTypes.push(7);
		if(item.cost_14kr_benchmark_cad!=null && item.cost_14kr_benchmark_cad!="")
			metalTypes.push(7);
		if(item.cost_14kr_mw_cad!=null && item.cost_14kr_mw_cad!="")
			metalTypes.push(7);
		if(item.cost_14kr_gf_cad!=null && item.cost_14kr_gf_cad!="")
			metalTypes.push(7);
		if(item.cost_14kr_overnight_cad!=null && item.cost_14kr_overnight_cad!="")
			metalTypes.push(7);
		
		if(item.cost_palladium_ch_cad!=null && item.cost_palladium_ch_cad!="")
			metalTypes.push(4);
		if(item.cost_palladium_usny_cad!=null && item.cost_palladium_usny_cad!="")
			metalTypes.push(4);
		if(item.cost_palladium_sasha_cad!=null && item.cost_palladium_sasha_cad!="")
			metalTypes.push(4);
		if(item.cost_palladium_endless_cad!=null && item.cost_palladium_endless_cad!="")
			metalTypes.push(4);
		if(item.cost_palladium_benchmark_cad!=null && item.cost_palladium_benchmark_cad!="")
			metalTypes.push(4);
		if(item.cost_palladium_mw_cad!=null && item.cost_palladium_mw_cad!="")
			metalTypes.push(4);
		if(item.cost_palladium_gf_cad!=null && item.cost_palladium_gf_cad!="")
			metalTypes.push(4);
		if(item.cost_palladium_overnight_cad!=null && item.cost_palladium_overnight_cad!="")
			metalTypes.push(4);
			
		if(item.cost_18kw_mw_cad!=null && item.cost_18kw_mw_cad!="")
			metalTypes.push(1);
		if(item.cost_18ky_mw_cad!=null && item.cost_18ky_mw_cad!="")
			metalTypes.push(2);
		if(item.cost_platinum_mw_cad!=null && item.cost_platinum_mw_cad!="")
			metalTypes.push(3);
			
		if(item.cost_18kw_gf_cad!=null && item.cost_18kw_gf_cad!="")
			metalTypes.push(1);
		if(item.cost_18ky_gf_cad!=null && item.cost_18ky_gf_cad!="")
			metalTypes.push(2);
		if(item.cost_platinum_gf_cad!=null && item.cost_platinum_gf_cad!="")
			metalTypes.push(3);
			
		if(item.cost_18kw_overnight_cad!=null && item.cost_18kw_overnight_cad!="")
			metalTypes.push(1);
		if(item.cost_18ky_overnight_cad!=null && item.cost_18ky_overnight_cad!="")
			metalTypes.push(2);
		if(item.cost_platinum_overnight_cad!=null && item.cost_platinum_overnight_cad!="")
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
					if(item.cost_18kw_sasha!=null && item.cost_18kw_sasha!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="1587345")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18kw_sasha);
								if(item.cost_18kw_pref == "sasha")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18kw_sasha);		
								}
							}
						}
					}
					if(item.cost_18kw_endless!=null && item.cost_18kw_endless!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="2388331")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18kw_endless);
								if(item.cost_18kw_pref == "endless")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18kw_endless);		
								}
							}
						}
					}
					if(item.cost_18kw_benchmark!=null && item.cost_18kw_benchmark!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="6621")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18kw_benchmark);
								if(item.cost_18kw_pref == "benchmark")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18kw_benchmark);		
								}
							}
						}
					}
					if(item.cost_18kw_mw!=null && item.cost_18kw_mw!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="442500")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18kw_mw);
								if(item.cost_18kw_pref == "miracleworks")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18kw_mw);		
								}
							}
						}
					}
					if(item.cost_18kw_gf!=null && item.cost_18kw_gf!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="5181551")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18kw_gf);
								if(item.cost_18kw_pref == "guildfacet")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18kw_gf);		
								}
							}
						}
					}
					if(item.cost_18kw_overnight!=null && item.cost_18kw_overnight!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18kw_overnight);
								if(item.cost_18kw_pref == "overnight")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18kw_overnight);		
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
					if(item.cost_18ky_sasha!=null && item.cost_18ky_sasha!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="1587345")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18ky_sasha);
								if(item.cost_18ky_pref == "sasha")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18ky_sasha);		
								}
							}
						}
					}
					if(item.cost_18ky_endless!=null && item.cost_18ky_endless!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="2388331")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18ky_endless);
								if(item.cost_18ky_pref == "endless")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18ky_endless);		
								}
							}
						}
					}
					if(item.cost_18ky_benchmark!=null && item.cost_18ky_benchmark!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="6621")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18ky_benchmark);
								if(item.cost_18ky_pref == "benchmark")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18ky_benchmark);		
								}
							}
						}
					}
					if(item.cost_18ky_mw!=null && item.cost_18ky_mw!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="442500")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18ky_mw);
								if(item.cost_18ky_pref == "miracleworks")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18ky_mw);		
								}
							}
						}
					}
					if(item.cost_18ky_gf!=null && item.cost_18ky_gf!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="5181551")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18ky_gf);
								if(item.cost_18ky_pref == "guildfacet")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18ky_gf);		
								}
							}
						}
					}
					if(item.cost_18ky_overnight!=null && item.cost_18ky_overnight!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_18ky_overnight);
								if(item.cost_18ky_pref == "overnight")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_18ky_overnight);		
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
					if(item.cost_platinum_sasha!=null && item.cost_platinum_sasha!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="1587345")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_platinum_sasha);
								if(item.cost_platinum_pref == "sasha")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_platinum_sasha);		
								}
							}
						}
					}
					if(item.cost_platinum_endless!=null && item.cost_platinum_endless!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="2388331")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_platinum_endless);
								if(item.cost_platinum_pref == "endless")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_platinum_endless);		
								}
							}
						}
					}
					if(item.cost_platinum_benchmark!=null && item.cost_platinum_benchmark!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="6621")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_platinum_benchmark);
								if(item.cost_platinum_pref == "benchmark")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_platinum_benchmark);		
								}
							}
						}
					}
					if(item.cost_platinum_mw!=null && item.cost_platinum_mw!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="442500")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_platinum_mw);
								if(item.cost_platinum_pref == "miracleworks")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_platinum_mw);		
								}
							}
						}
					}
					if(item.cost_platinum_gf!=null && item.cost_platinum_gf!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="5181551")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_platinum_gf);
								if(item.cost_platinum_pref == "guildfacet")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_platinum_gf);		
								}
							}
						}
					}
					if(item.cost_platinum_overnight!=null && item.cost_platinum_overnight!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_platinum_overnight);
								if(item.cost_platinum_pref == "overnight")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_platinum_overnight);		
								}
							}
						}
					}
				}
				else if(results[x].getValue("custitem1")=="5" || results[x].getValue("custitem1")=="6")
				{
					if(item.cost_14k_ch!=null && item.cost_14k_ch!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="153")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14k_ch);
								if(item.cost_14k_pref == "CH")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14k_ch);	
								}
							}
						}
					}
					if(item.cost_14k_usny!=null && item.cost_14k_usny!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="7773")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14k_usny);
								if(item.cost_14k_pref == "USNY")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14k_usny);	
								}
							}
						}
					}
					if(item.cost_14k_sasha!=null && item.cost_14k_sasha!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="1587345")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14k_sasha);
								if(item.cost_14k_pref == "sasha")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14k_sasha);		
								}
							}
						}
					}
					if(item.cost_14k_endless!=null && item.cost_14k_endless!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="2388331")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14k_endless);
								if(item.cost_14k_pref == "endless")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14k_endless);		
								}
							}
						}
					}
					if(item.cost_14k_benchmark!=null && item.cost_14k_benchmark!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="6621")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14k_benchmark);
								if(item.cost_14k_pref == "benchmark")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14k_benchmark);		
								}
							}
						}
					}
					if(item.cost_14k_mw!=null && item.cost_14k_mw!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="442500")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14k_mw);
								if(item.cost_14k_pref == "miracleworks")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14k_mw);		
								}
							}
						}
					}
					if(item.cost_14k_gf!=null && item.cost_14k_gf!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="5181551")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14k_gf);
								if(item.cost_14k_pref == "guildfacet")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14k_gf);		
								}
							}
						}
					}
					if(item.cost_14k_overnight!=null && item.cost_14k_overnight!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14k_overnight);
								if(item.cost_14k_pref == "overnight")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14k_overnight);		
								}
							}
						}
					}
				}
				else if(results[x].getValue("custitem1")=="7")
				{
					if(item.cost_14kr_ch!=null && item.cost_14kr_ch!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="153")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14kr_ch);
								if(item.cost_14kr_pref == "CH")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14kr_ch);	
								}
							}
						}
					}
					if(item.cost_14kr_usny!=null && item.cost_14kr_usny!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="7773")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14kr_usny);
								if(item.cost_14kr_pref == "USNY")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14kr_usny);	
								}
							}
						}
					}
					if(item.cost_14kr_sasha!=null && item.cost_14kr_sasha!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="1587345")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14kr_sasha);
								if(item.cost_14kr_pref == "sasha")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14kr_sasha);		
								}
							}
						}
					}
					if(item.cost_14kr_endless!=null && item.cost_14kr_endless!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="2388331")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14kr_endless);
								if(item.cost_14kr_pref == "endless")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14kr_endless);		
								}
							}
						}
					}
					if(item.cost_14kr_benchmark!=null && item.cost_14kr_benchmark!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="6621")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14kr_benchmark);
								if(item.cost_14kr_pref == "benchmark")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14kr_benchmark);		
								}
							}
						}
					}
					if(item.cost_14kr_mw!=null && item.cost_14kr_mw!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="442500")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14kr_mw);
								if(item.cost_14kr_pref == "miracleworks")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14kr_mw);		
								}
							}
						}
					}
					if(item.cost_14kr_gf!=null && item.cost_14kr_gf!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="5181551")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14kr_gf);
								if(item.cost_14kr_pref == "guildfacet")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14kr_gf);		
								}
							}
						}
					}
					if(item.cost_14kr_overnight!=null && item.cost_14kr_overnight!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_14kr_overnight);
								if(item.cost_14kr_pref == "overnight")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_14kr_overnight);		
								}
							}
						}
					}
				}
				else if(results[x].getValue("custitem1")=="4")
				{
					if(item.cost_palladium_ch!=null && item.cost_palladium_ch!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="153")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_palladium_ch);
								if(item.cost_palladium_pref == "CH")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_palladium_ch);	
								}
							}
						}
					}
					if(item.cost_palladium_usny!=null && item.cost_palladium_usny!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="7773")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_palladium_usny);
								if(item.cost_palladium_pref == "USNY")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_palladium_usny);	
								}
							}
						}
					}
					if(item.cost_palladium_sasha!=null && item.cost_palladium_sasha!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="1587345")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_palladium_sasha);
								if(item.cost_palladium_pref == "sasha")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_palladium_sasha);		
								}
							}
						}
					}
					if(item.cost_palladium_endless!=null && item.cost_palladium_endless!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="2388331")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_palladium_endless);
								if(item.cost_palladium_pref == "endless")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_palladium_endless);		
								}
							}
						}
					}
					if(item.cost_palladium_benchmark!=null && item.cost_palladium_benchmark!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="6621")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_palladium_benchmark);
								if(item.cost_palladium_pref == "benchmark")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_palladium_benchmark);		
								}
							}
						}
					}
					if(item.cost_palladium_mw!=null && item.cost_palladium_mw!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="442500")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_palladium_mw);
								if(item.cost_palladium_pref == "miracleworks")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_palladium_mw);		
								}
							}
						}
					}
					if(item.cost_palladium_gf!=null && item.cost_palladium_gf!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="5181551")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_palladium_gf);
								if(item.cost_palladium_pref == "guildfacet")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_palladium_gf);		
								}
							}
						}
					}
					if(item.cost_palladium_overnight!=null && item.cost_palladium_overnight!="")
					{
						for(var i=0; i < itemRec.getLineItemCount("itemvendor"); i++)
						{
							if(itemRec.getLineItemValue("itemvendor","vendor",i+1)=="")
							{
								itemRec.setLineItemValue("itemvendor","purchaseprice",i+1,item.cost_palladium_overnight);
								if(item.cost_palladium_pref == "overnight")
								{
									itemRec.setLineItemValue("itemvendor","preferredvendor",i+1,"T");
									itemRec.setFieldValue("cost",item.cost_palladium_overnight);		
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
					
				if(item.cost_14k_ch!=null && item.cost_14k_ch!="")
					itemRec.setFieldValue("custitem_cost_14k_ch",item.cost_14k_ch);
				else
					itemRec.setFieldValue("custitem_cost_14k_ch","");
					
				if(item.cost_14kr_ch!=null && item.cost_14kr_ch!="")
					itemRec.setFieldValue("custitem_cost_14kr_ch",item.cost_14kr_ch);
				else
					itemRec.setFieldValue("custitem_cost_14kr_ch","");
					
				if(item.cost_palladium_ch!=null && item.cost_palladium_ch!="")
					itemRec.setFieldValue("custitem_cost_palladium_ch",item.cost_palladium_ch);
				else
					itemRec.setFieldValue("custitem_cost_palladium_ch","");
				
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
					
				if(item.cost_14k_usny!=null && item.cost_14k_usny!="")
					itemRec.setFieldValue("custitem_cost_14k_usny",item.cost_14k_usny);
				else
					itemRec.setFieldValue("custitem_cost_14k_usny","");
					
				if(item.cost_14kr_usny!=null && item.cost_14kr_usny!="")
					itemRec.setFieldValue("custitem_cost_14kr_usny",item.cost_14kr_usny);
				else
					itemRec.setFieldValue("custitem_cost_14kr_usny","");
					
				if(item.cost_palladium_usny!=null && item.cost_palladium_usny!="")
					itemRec.setFieldValue("custitem_cost_palladium_usny",item.cost_palladium_usny);
				else
					itemRec.setFieldValue("custitem_cost_palladium_usny","");
					
				if(item.cost_18kw_sasha!=null && item.cost_18kw_sasha!="")
					itemRec.setFieldValue("custitem_cost_18kw_sasha",item.cost_18kw_sasha);
				else
					itemRec.setFieldValue("custitem_cost_18kw_sasha","");
				
				if(item.cost_18ky_sasha!=null && item.cost_18ky_sasha!="")
					itemRec.setFieldValue("custitem_cost_18ky_sasha",item.cost_18ky_sasha);
				else
					itemRec.setFieldValue("custitem_cost_18ky_sasha","");
				
				if(item.cost_platinum_sasha!=null && item.cost_platinum_sasha!="")
					itemRec.setFieldValue("custitem_cost_platinum_sasha",item.cost_platinum_sasha);
				else
					itemRec.setFieldValue("custitem_cost_platinum_sasha","");
					
				if(item.cost_14k_sasha!=null && item.cost_14k_sasha!="")
					itemRec.setFieldValue("custitem_cost_14k_sasha",item.cost_14k_sasha);
				else
					itemRec.setFieldValue("custitem_cost_14k_sasha","");
					
				if(item.cost_14kr_sasha!=null && item.cost_14kr_sasha!="")
					itemRec.setFieldValue("custitem_cost_14kr_sasha",item.cost_14kr_sasha);
				else
					itemRec.setFieldValue("custitem_cost_14kr_sasha","");
					
				if(item.cost_palladium_sasha!=null && item.cost_palladium_sasha!="")
					itemRec.setFieldValue("custitem_cost_palladium_sasha",item.cost_palladium_sasha);
				else
					itemRec.setFieldValue("custitem_cost_palladium_sasha","");
					
				if(item.cost_18kw_endless!=null && item.cost_18kw_endless!="")
					itemRec.setFieldValue("custitem_cost_18kw_endless",item.cost_18kw_endless);
				else
					itemRec.setFieldValue("custitem_cost_18kw_endless","");
				
				if(item.cost_18ky_endless!=null && item.cost_18ky_endless!="")
					itemRec.setFieldValue("custitem_cost_18ky_endless",item.cost_18ky_endless);
				else
					itemRec.setFieldValue("custitem_cost_18ky_endless","");
				
				if(item.cost_platinum_endless!=null && item.cost_platinum_endless!="")
					itemRec.setFieldValue("custitem_cost_platinum_endless",item.cost_platinum_endless);
				else
					itemRec.setFieldValue("custitem_cost_platinum_endless","");
					
				if(item.cost_14k_endless!=null && item.cost_14k_endless!="")
					itemRec.setFieldValue("custitem_cost_14k_endless",item.cost_14k_endless);
				else
					itemRec.setFieldValue("custitem_cost_14k_endless","");
					
				if(item.cost_14kr_endless!=null && item.cost_14kr_endless!="")
					itemRec.setFieldValue("custitem_cost_14kr_endless",item.cost_14kr_endless);
				else
					itemRec.setFieldValue("custitem_cost_14kr_endless","");
					
				if(item.cost_palladium_endless!=null && item.cost_palladium_endless!="")
					itemRec.setFieldValue("custitem_cost_palladium_endless",item.cost_palladium_endless);
				else
					itemRec.setFieldValue("custitem_cost_palladium_endless","");
					
				if(item.cost_18kw_benchmark!=null && item.cost_18kw_benchmark!="")
					itemRec.setFieldValue("custitem_cost_18kw_benchmark",item.cost_18kw_benchmark);
				else
					itemRec.setFieldValue("custitem_cost_18kw_benchmark","");
				
				if(item.cost_18ky_benchmark!=null && item.cost_18ky_benchmark!="")
					itemRec.setFieldValue("custitem_cost_18ky_benchmark",item.cost_18ky_benchmark);
				else
					itemRec.setFieldValue("custitem_cost_18ky_benchmark","");
				
				if(item.cost_platinum_benchmark!=null && item.cost_platinum_benchmark!="")
					itemRec.setFieldValue("custitem_cost_platinum_benchmark",item.cost_platinum_benchmark);
				else
					itemRec.setFieldValue("custitem_cost_platinum_benchmark","");
					
				if(item.cost_14k_benchmark!=null && item.cost_14k_benchmark!="")
					itemRec.setFieldValue("custitem_cost_14k_benchmark",item.cost_14k_benchmark);
				else
					itemRec.setFieldValue("custitem_cost_14k_benchmark","");
					
				if(item.cost_14kr_benchmark!=null && item.cost_14kr_benchmark!="")
					itemRec.setFieldValue("custitem_cost_14kr_benchmark",item.cost_14kr_benchmark);
				else
					itemRec.setFieldValue("custitem_cost_14kr_benchmark","");
					
				if(item.cost_palladium_benchmark!=null && item.cost_palladium_benchmark!="")
					itemRec.setFieldValue("custitem_cost_palladium_benchmark",item.cost_palladium_benchmark);
				else
					itemRec.setFieldValue("custitem_cost_palladium_benchmark","");
					
				if(item.cost_18kw_mw!=null && item.cost_18kw_mw!="")
					itemRec.setFieldValue("custitem_cost_18kw_miracleworks",item.cost_18kw_mw);
				else
					itemRec.setFieldValue("custitem_cost_18kw_miracleworks","");
				
				if(item.cost_18ky_mw!=null && item.cost_18ky_mw!="")
					itemRec.setFieldValue("custitem_cost_18ky_miracleworks",item.cost_18ky_mw);
				else
					itemRec.setFieldValue("custitem_cost_18ky_miracleworks","");
				
				if(item.cost_platinum_mw!=null && item.cost_platinum_mw!="")
					itemRec.setFieldValue("custitem_cost_platinum_miracleworks",item.cost_platinum_mw);
				else
					itemRec.setFieldValue("custitem_cost_platinum_miracleworks","");
					
				if(item.cost_14k_mw!=null && item.cost_14k_mw!="")
					itemRec.setFieldValue("custitem_cost_14k_miracleworks",item.cost_14k_mw);
				else
					itemRec.setFieldValue("custitem_cost_14k_miracleworks","");
					
				if(item.cost_14kr_mw!=null && item.cost_14kr_mw!="")
					itemRec.setFieldValue("custitem_cost_14kr_miracleworks",item.cost_14kr_mw);
				else
					itemRec.setFieldValue("custitem_cost_14kr_miracleworks","");
					
				if(item.cost_palladium_mw!=null && item.cost_palladium_mw!="")
					itemRec.setFieldValue("custitem_cost_palladium_miracleworks",item.cost_palladium_mw);
				else
					itemRec.setFieldValue("custitem_cost_palladium_miracleworks","");
					
				if(item.cost_18kw_gf!=null && item.cost_18kw_gf!="")
					itemRec.setFieldValue("custitem_cost_18kw_guildfacet",item.cost_18kw_gf);
				else
					itemRec.setFieldValue("custitem_cost_18kw_guildfacet","");
				
				if(item.cost_18ky_gf!=null && item.cost_18ky_gf!="")
					itemRec.setFieldValue("custitem_cost_18ky_guildfacet",item.cost_18ky_gf);
				else
					itemRec.setFieldValue("custitem_cost_18ky_guildfacet","");
				
				if(item.cost_platinum_gf!=null && item.cost_platinum_gf!="")
					itemRec.setFieldValue("custitem_cost_platinum_guildfacet",item.cost_platinum_gf);
				else
					itemRec.setFieldValue("custitem_cost_platinum_guildfacet","");
					
				if(item.cost_14k_gf!=null && item.cost_14k_gf!="")
					itemRec.setFieldValue("custitem_cost_14k_guildfacet",item.cost_14k_gf);
				else
					itemRec.setFieldValue("custitem_cost_14k_guildfacet","");
					
				if(item.cost_14kr_gf!=null && item.cost_14kr_gf!="")
					itemRec.setFieldValue("custitem_cost_14kr_guildfacet",item.cost_14kr_gf);
				else
					itemRec.setFieldValue("custitem_cost_14kr_guildfacet","");
					
				if(item.cost_palladium_gf!=null && item.cost_palladium_gf!="")
					itemRec.setFieldValue("custitem_cost_palladium_guildfacet",item.cost_palladium_gf);
				else
					itemRec.setFieldValue("custitem_cost_palladium_guildfacet","");
					
				if(item.cost_18kw_overnight!=null && item.cost_18kw_overnight!="")
					itemRec.setFieldValue("custitem_cost_18kw_overnight",item.cost_18kw_overnight);
				else
					itemRec.setFieldValue("custitem_cost_18kw_overnight","");
				
				if(item.cost_18ky_overnight!=null && item.cost_18ky_overnight!="")
					itemRec.setFieldValue("custitem_cost_18ky_overnight",item.cost_18ky_overnight);
				else
					itemRec.setFieldValue("custitem_cost_18ky_overnight","");
				
				if(item.cost_platinum_overnight!=null && item.cost_platinum_overnight!="")
					itemRec.setFieldValue("custitem_cost_platinum_overnight",item.cost_platinum_overnight);
				else
					itemRec.setFieldValue("custitem_cost_platinum_overnight","");
					
				if(item.cost_14k_overnight!=null && item.cost_14k_overnight!="")
					itemRec.setFieldValue("custitem_cost_14k_overnight",item.cost_14k_overnight);
				else
					itemRec.setFieldValue("custitem_cost_14k_overnight","");
					
				if(item.cost_14kr_overnight!=null && item.cost_14kr_overnight!="")
					itemRec.setFieldValue("custitem_cost_14kr_overnight",item.cost_14kr_overnight);
				else
					itemRec.setFieldValue("custitem_cost_14kr_overnight","");
					
				if(item.cost_palladium_overnight!=null && item.cost_palladium_overnight!="")
					itemRec.setFieldValue("custitem_cost_palladium_overnight",item.cost_palladium_overnight);
				else
					itemRec.setFieldValue("custitem_cost_palladium_overnight","");
				
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
					
				if(item.cost_14k_ch_cad!=null && item.cost_14k_ch_cad!="")
					itemRec.setFieldValue("custitem_cost_14k_ch_cad",item.cost_14k_ch_cad);
				else
					itemRec.setFieldValue("custitem_cost_14k_ch_cad","");
					
				if(item.cost_14kr_ch_cad!=null && item.cost_14kr_ch_cad!="")
					itemRec.setFieldValue("custitem_cost_14kr_ch_cad",item.cost_14kr_ch_cad);
				else
					itemRec.setFieldValue("custitem_cost_14kr_ch_cad","");
					
				if(item.cost_palladium_ch_cad!=null && item.cost_palladium_ch_cad!="")
					itemRec.setFieldValue("custitem_cost_palladium_ch_cad",item.cost_palladium_ch_cad);
				else
					itemRec.setFieldValue("custitem_cost_palladium_ch_cad","");
				
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
					
				if(item.cost_14k_usny_cad!=null && item.cost_14k_usny_cad!="")
					itemRec.setFieldValue("custitem_cost_14k_usny_cad",item.cost_14k_usny_cad);
				else
					itemRec.setFieldValue("custitem_cost_14k_usny_cad","");
					
				if(item.cost_14kr_usny_cad!=null && item.cost_14kr_usny_cad!="")
					itemRec.setFieldValue("custitem_cost_14kr_usny_cad",item.cost_14kr_usny_cad);
				else
					itemRec.setFieldValue("custitem_cost_14kr_usny_cad","");
					
				if(item.cost_palladium_usny_cad!=null && item.cost_palladium_usny_cad!="")
					itemRec.setFieldValue("custitem_cost_palladium_usny_cad",item.cost_palladium_usny_cad);
				else
					itemRec.setFieldValue("custitem_cost_palladium_usny_cad","");
					
				if(item.cost_18kw_sasha_cad!=null && item.cost_18kw_sasha_cad!="")
					itemRec.setFieldValue("custitem_cost_18kw_sasha_cad",item.cost_18kw_sasha_cad);
				else
					itemRec.setFieldValue("custitem_cost_18kw_sasha_cad","");
				
				if(item.cost_18ky_sasha_cad!=null && item.cost_18ky_sasha_cad!="")
					itemRec.setFieldValue("custitem_cost_18ky_sasha_cad",item.cost_18ky_sasha_cad);
				else
					itemRec.setFieldValue("custitem_cost_18ky_sasha_cad","");
				
				if(item.cost_platinum_sasha_cad!=null && item.cost_platinum_sasha_cad!="")
					itemRec.setFieldValue("custitem_cost_platinum_sasha_cad",item.cost_platinum_sasha_cad);
				else
					itemRec.setFieldValue("custitem_cost_platinum_sasha_cad","");
					
				if(item.cost_14k_sasha_cad!=null && item.cost_14k_sasha_cad!="")
					itemRec.setFieldValue("custitem_cost_14k_sasha_cad",item.cost_14k_sasha_cad);
				else
					itemRec.setFieldValue("custitem_cost_14k_sasha_cad","");
					
				if(item.cost_14kr_sasha_cad!=null && item.cost_14kr_sasha_cad!="")
					itemRec.setFieldValue("custitem_cost_14kr_sasha_cad",item.cost_14kr_sasha_cad);
				else
					itemRec.setFieldValue("custitem_cost_14kr_sasha_cad","");
					
				if(item.cost_palladium_sasha_cad!=null && item.cost_palladium_sasha_cad!="")
					itemRec.setFieldValue("custitem_cost_palladium_sasha_cad",item.cost_palladium_sasha_cad);
				else
					itemRec.setFieldValue("custitem_cost_palladium_sasha_cad","");
					
				if(item.cost_18kw_endless_cad!=null && item.cost_18kw_endless_cad!="")
					itemRec.setFieldValue("custitem_cost_18kw_endless_cad",item.cost_18kw_endless_cad);
				else
					itemRec.setFieldValue("custitem_cost_18kw_endless_cad","");
				
				if(item.cost_18ky_endless_cad!=null && item.cost_18ky_endless_cad!="")
					itemRec.setFieldValue("custitem_cost_18ky_endless_cad",item.cost_18ky_endless_cad);
				else
					itemRec.setFieldValue("custitem_cost_18ky_endless_cad","");
				
				if(item.cost_platinum_endless_cad!=null && item.cost_platinum_endless_cad!="")
					itemRec.setFieldValue("custitem_cost_platinum_endless_cad",item.cost_platinum_endless_cad);
				else
					itemRec.setFieldValue("custitem_cost_platinum_endless_cad","");
					
				if(item.cost_14k_endless_cad!=null && item.cost_14k_endless_cad!="")
					itemRec.setFieldValue("custitem_cost_14k_endless_cad",item.cost_14k_endless_cad);
				else
					itemRec.setFieldValue("custitem_cost_14k_endless_cad","");
					
				if(item.cost_14kr_endless_cad!=null && item.cost_14kr_endless_cad!="")
					itemRec.setFieldValue("custitem_cost_14kr_endless_cad",item.cost_14kr_endless_cad);
				else
					itemRec.setFieldValue("custitem_cost_14kr_endless_cad","");
					
				if(item.cost_palladium_endless_cad!=null && item.cost_palladium_endless_cad!="")
					itemRec.setFieldValue("custitem_cost_palladium_endless_cad",item.cost_palladium_endless_cad);
				else
					itemRec.setFieldValue("custitem_cost_palladium_endless_cad","");
					
				if(item.cost_18kw_benchmark_cad!=null && item.cost_18kw_benchmark_cad!="")
					itemRec.setFieldValue("custitem_cost_18kw_benchmark_cad",item.cost_18kw_benchmark_cad);
				else
					itemRec.setFieldValue("custitem_cost_18kw_benchmark_cad","");
				
				if(item.cost_18ky_benchmark_cad!=null && item.cost_18ky_benchmark_cad!="")
					itemRec.setFieldValue("custitem_cost_18ky_benchmark_cad",item.cost_18ky_benchmark_cad);
				else
					itemRec.setFieldValue("custitem_cost_18ky_benchmark_cad","");
				
				if(item.cost_platinum_benchmark_cad!=null && item.cost_platinum_benchmark_cad!="")
					itemRec.setFieldValue("custitem_cost_platinum_benchmark_cad",item.cost_platinum_benchmark_cad);
				else
					itemRec.setFieldValue("custitem_cost_platinum_benchmark_cad","");
					
				if(item.cost_14k_benchmark_cad!=null && item.cost_14k_benchmark_cad!="")
					itemRec.setFieldValue("custitem_cost_14k_benchmark_cad",item.cost_14k_benchmark_cad);
				else
					itemRec.setFieldValue("custitem_cost_14k_benchmark_cad","");
					
				if(item.cost_14kr_benchmark_cad!=null && item.cost_14kr_benchmark_cad!="")
					itemRec.setFieldValue("custitem_cost_14kr_benchmark_cad",item.cost_14kr_benchmark_cad);
				else
					itemRec.setFieldValue("custitem_cost_14kr_benchmark_cad","");
					
				if(item.cost_palladium_benchmark_cad!=null && item.cost_palladium_benchmark_cad!="")
					itemRec.setFieldValue("custitem_cost_palladium_benchmark_cad",item.cost_palladium_benchmark_cad);
				else
					itemRec.setFieldValue("custitem_cost_palladium_benchmark_cad","");
					
				if(item.cost_18kw_mw_cad!=null && item.cost_18kw_mw_cad!="")
					itemRec.setFieldValue("custitem_cost_18kw_miracleworks_cad",item.cost_18kw_mw_cad);
				else
					itemRec.setFieldValue("custitem_cost_18kw_miracleworks_cad","");
				
				if(item.cost_18ky_mw_cad!=null && item.cost_18ky_mw_cad!="")
					itemRec.setFieldValue("custitem_cost_18ky_miracleworks_cad",item.cost_18ky_mw_cad);
				else
					itemRec.setFieldValue("custitem_cost_18ky_miracleworks_cad","");
				
				if(item.cost_platinum_mw_cad!=null && item.cost_platinum_mw_cad!="")
					itemRec.setFieldValue("custitem_cost_platinum_miracleworks_cad",item.cost_platinum_mw_cad);
				else
					itemRec.setFieldValue("custitem_cost_platinum_miracleworks_cad","");
					
				if(item.cost_14k_mw_cad!=null && item.cost_14k_mw_cad!="")
					itemRec.setFieldValue("custitem_cost_14k_miracleworks_cad",item.cost_14k_mw_cad);
				else
					itemRec.setFieldValue("custitem_cost_14k_miracleworks_cad","");
					
				if(item.cost_14kr_mw_cad!=null && item.cost_14kr_mw_cad!="")
					itemRec.setFieldValue("custitem_cost_14kr_miracleworks_cad",item.cost_14kr_mw_cad);
				else
					itemRec.setFieldValue("custitem_cost_14kr_miracleworks_cad","");
					
				if(item.cost_palladium_mw_cad!=null && item.cost_palladium_mw_cad!="")
					itemRec.setFieldValue("custitem_cost_palladium_mw_cad",item.cost_palladium_mw_cad);
				else
					itemRec.setFieldValue("custitem_cost_palladium_mw_cad","");
					
				if(item.cost_18kw_gf_cad!=null && item.cost_18kw_gf_cad!="")
					itemRec.setFieldValue("custitem_cost_18kw_guildfacet_cad",item.cost_18kw_gf_cad);
				else
					itemRec.setFieldValue("custitem_cost_18kw_guildfacet_cad","");
				
				if(item.cost_18ky_gf_cad!=null && item.cost_18ky_gf_cad!="")
					itemRec.setFieldValue("custitem_cost_18ky_guildfacet_cad",item.cost_18ky_gf_cad);
				else
					itemRec.setFieldValue("custitem_cost_18ky_guildfacet_cad","");
				
				if(item.cost_platinum_gf_cad!=null && item.cost_platinum_gf_cad!="")
					itemRec.setFieldValue("custitem_cost_platinum_guildfacet_cad",item.cost_platinum_gf_cad);
				else
					itemRec.setFieldValue("custitem_cost_platinum_guildfacet_cad","");
					
				if(item.cost_14k_gf_cad!=null && item.cost_14k_gf_cad!="")
					itemRec.setFieldValue("custitem_cost_14k_guildfacet_cad",item.cost_14k_gf_cad);
				else
					itemRec.setFieldValue("custitem_cost_14k_guildfacet_cad","");
					
				if(item.cost_14kr_gf_cad!=null && item.cost_14kr_gf_cad!="")
					itemRec.setFieldValue("custitem_cost_14kr_guildfacet_cad",item.cost_14kr_gf_cad);
				else
					itemRec.setFieldValue("custitem_cost_14kr_guildfacet_cad","");
					
				if(item.cost_palladium_gf_cad!=null && item.cost_palladium_gf_cad!="")
					itemRec.setFieldValue("custitem_cost_palladium_guildfacet_cad",item.cost_palladium_gf_cad);
				else
					itemRec.setFieldValue("custitem_cost_palladium_guildfacet_cad","");
					
				if(item.cost_18kw_overnight_cad!=null && item.cost_18kw_overnight_cad!="")
					itemRec.setFieldValue("custitem_cost_18kw_overnight_cad",item.cost_18kw_overnight_cad);
				else
					itemRec.setFieldValue("custitem_cost_18kw_overnight_cad","");
				
				if(item.cost_18ky_overnight_cad!=null && item.cost_18ky_overnight_cad!="")
					itemRec.setFieldValue("custitem_cost_18ky_overnight_cad",item.cost_18ky_overnight_cad);
				else
					itemRec.setFieldValue("custitem_cost_18ky_overnight_cad","");
				
				if(item.cost_platinum_overnight_cad!=null && item.cost_platinum_overnight_cad!="")
					itemRec.setFieldValue("custitem_cost_platinum_overnight_cad",item.cost_platinum_overnight_cad);
				else
					itemRec.setFieldValue("custitem_cost_platinum_overnight_cad","");
					
				if(item.cost_14k_overnight_cad!=null && item.cost_14k_overnight_cad!="")
					itemRec.setFieldValue("custitem_cost_14k_overnight_cad",item.cost_14k_overnight_cad);
				else
					itemRec.setFieldValue("custitem_cost_14k_overnight_cad","");
					
				if(item.cost_14kr_overnight_cad!=null && item.cost_14kr_overnight_cad!="")
					itemRec.setFieldValue("custitem_cost_14kr_overnight_cad",item.cost_14kr_overnight_cad);
				else
					itemRec.setFieldValue("custitem_cost_14kr_overnight_cad","");
					
				if(item.cost_palladium_overnight_cad!=null && item.cost_palladium_overnight_cad!="")
					itemRec.setFieldValue("custitem_cost_palladium_overnight_cad",item.cost_palladium_overnight_cad);
				else
					itemRec.setFieldValue("custitem_cost_palladium_overnight_cad","");
				
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
				
			if(item.cost_14k_ch!=null && item.cost_14k_ch!="")
				parentItem.setFieldValue("custitem_cost_14k_ch",item.cost_14k_ch);
			else
				parentItem.setFieldValue("custitem_cost_14k_ch","");
				
			if(item.cost_14kr_ch!=null && item.cost_14kr_ch!="")
				parentItem.setFieldValue("custitem_cost_14kr_ch",item.cost_14kr_ch);
			else
				parentItem.setFieldValue("custitem_cost_14kr_ch","");
				
			if(item.cost_palladium_ch!=null && item.cost_palladium_ch!="")
				parentItem.setFieldValue("custitem_cost_palladium_ch",item.cost_palladium_ch);
			else
				parentItem.setFieldValue("custitem_cost_palladium_ch","");
			
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
				
			if(item.cost_14k_usny!=null && item.cost_14k_usny!="")
				parentItem.setFieldValue("custitem_cost_14k_usny",item.cost_14k_usny);
			else
				parentItem.setFieldValue("custitem_cost_14k_usny","");
				
			if(item.cost_14kr_usny!=null && item.cost_14kr_usny!="")
				parentItem.setFieldValue("custitem_cost_14kr_usny",item.cost_14kr_usny);
			else
				parentItem.setFieldValue("custitem_cost_14kr_usny","");
				
			if(item.cost_palladium_usny!=null && item.cost_palladium_usny!="")
				parentItem.setFieldValue("custitem_cost_palladium_usny",item.cost_palladium_usny);
			else
				parentItem.setFieldValue("custitem_cost_palladium_usny","");
				
			if(item.cost_18kw_sasha!=null && item.cost_18kw_sasha!="")
				parentItem.setFieldValue("custitem_cost_18kw_sasha",item.cost_18kw_sasha);
			else
				parentItem.setFieldValue("custitem_cost_18kw_sasha","");
			
			if(item.cost_18ky_sasha!=null && item.cost_18ky_sasha!="")
				parentItem.setFieldValue("custitem_cost_18ky_sasha",item.cost_18ky_sasha);
			else
				parentItem.setFieldValue("custitem_cost_18ky_sasha","");
			
			if(item.cost_platinum_sasha!=null && item.cost_platinum_sasha!="")
				parentItem.setFieldValue("custitem_cost_platinum_sasha",item.cost_platinum_sasha);
			else
				parentItem.setFieldValue("custitem_cost_platinum_sasha","");
				
			if(item.cost_14k_sasha!=null && item.cost_14k_sasha!="")
				parentItem.setFieldValue("custitem_cost_14k_sasha",item.cost_14k_sasha);
			else
				parentItem.setFieldValue("custitem_cost_14k_sasha","");
				
			if(item.cost_14kr_sasha!=null && item.cost_14kr_sasha!="")
				parentItem.setFieldValue("custitem_cost_14kr_sasha",item.cost_14kr_sasha);
			else
				parentItem.setFieldValue("custitem_cost_14kr_sasha","");
				
			if(item.cost_palladium_sasha!=null && item.cost_palladium_sasha!="")
				parentItem.setFieldValue("custitem_cost_palladium_sasha",item.cost_palladium_sasha);
			else
				parentItem.setFieldValue("custitem_cost_palladium_sasha","");
				
			if(item.cost_18kw_endless!=null && item.cost_18kw_endless!="")
				parentItem.setFieldValue("custitem_cost_18kw_endless",item.cost_18kw_endless);
			else
				parentItem.setFieldValue("custitem_cost_18kw_endless","");
			
			if(item.cost_18ky_endless!=null && item.cost_18ky_endless!="")
				parentItem.setFieldValue("custitem_cost_18ky_endless",item.cost_18ky_endless);
			else
				parentItem.setFieldValue("custitem_cost_18ky_endless","");
			
			if(item.cost_platinum_endless!=null && item.cost_platinum_endless!="")
				parentItem.setFieldValue("custitem_cost_platinum_endless",item.cost_platinum_endless);
			else
				parentItem.setFieldValue("custitem_cost_platinum_endless","");
				
			if(item.cost_14k_endless!=null && item.cost_14k_endless!="")
				parentItem.setFieldValue("custitem_cost_14k_endless",item.cost_14k_endless);
			else
				parentItem.setFieldValue("custitem_cost_14k_endless","");
				
			if(item.cost_14kr_endless!=null && item.cost_14kr_endless!="")
				parentItem.setFieldValue("custitem_cost_14kr_endless",item.cost_14kr_endless);
			else
				parentItem.setFieldValue("custitem_cost_14kr_endless","");
				
			if(item.cost_palladium_endless!=null && item.cost_palladium_endless!="")
				parentItem.setFieldValue("custitem_cost_palladium_endless",item.cost_palladium_endless);
			else
				parentItem.setFieldValue("custitem_cost_palladium_endless","");
				
			if(item.cost_18kw_benchmark!=null && item.cost_18kw_benchmark!="")
				parentItem.setFieldValue("custitem_cost_18kw_benchmark",item.cost_18kw_benchmark);
			else
				parentItem.setFieldValue("custitem_cost_18kw_benchmark","");
			
			if(item.cost_18ky_benchmark!=null && item.cost_18ky_benchmark!="")
				parentItem.setFieldValue("custitem_cost_18ky_benchmark",item.cost_18ky_benchmark);
			else
				parentItem.setFieldValue("custitem_cost_18ky_benchmark","");
			
			if(item.cost_platinum_benchmark!=null && item.cost_platinum_benchmark!="")
				parentItem.setFieldValue("custitem_cost_platinum_benchmark",item.cost_platinum_benchmark);
			else
				parentItem.setFieldValue("custitem_cost_platinum_benchmark","");
				
			if(item.cost_14k_benchmark!=null && item.cost_14k_benchmark!="")
				parentItem.setFieldValue("custitem_cost_14k_benchmark",item.cost_14k_benchmark);
			else
				parentItem.setFieldValue("custitem_cost_14k_benchmark","");
				
			if(item.cost_14kr_benchmark!=null && item.cost_14kr_benchmark!="")
				parentItem.setFieldValue("custitem_cost_14kr_benchmark",item.cost_14kr_benchmark);
			else
				parentItem.setFieldValue("custitem_cost_14kr_benchmark","");
				
			if(item.cost_palladium_benchmark!=null && item.cost_palladium_benchmark!="")
				parentItem.setFieldValue("custitem_cost_palladium_benchmark",item.cost_palladium_benchmark);
			else
				parentItem.setFieldValue("custitem_cost_palladium_benchmark","");
				
			if(item.cost_18kw_mw!=null && item.cost_18kw_mw!="")
				parentItem.setFieldValue("custitem_cost_18kw_miracleworks",item.cost_18kw_mw);
			else
				parentItem.setFieldValue("custitem_cost_18kw_miracleworks","");
			
			if(item.cost_18ky_mw!=null && item.cost_18ky_mw!="")
				parentItem.setFieldValue("custitem_cost_18ky_miracleworks",item.cost_18ky_mw);
			else
				parentItem.setFieldValue("custitem_cost_18ky_miracleworks","");
			
			if(item.cost_platinum_mw!=null && item.cost_platinum_mw!="")
				parentItem.setFieldValue("custitem_cost_platinum_miracleworks",item.cost_platinum_mw);
			else
				parentItem.setFieldValue("custitem_cost_platinum_miracleworks","");
				
			if(item.cost_14k_mw!=null && item.cost_14k_mw!="")
				parentItem.setFieldValue("custitem_cost_14k_miracleworks",item.cost_14k_mw);
			else
				parentItem.setFieldValue("custitem_cost_14k_miracleworks","");
				
			if(item.cost_14kr_mw!=null && item.cost_14kr_mw!="")
				parentItem.setFieldValue("custitem_cost_14kr_miracleworks",item.cost_14kr_mw);
			else
				parentItem.setFieldValue("custitem_cost_14kr_miracleworks","");
				
			if(item.cost_palladium_mw!=null && item.cost_palladium_mw!="")
				parentItem.setFieldValue("custitem_cost_palladium_miracleworks",item.cost_palladium_mw);
			else
				parentItem.setFieldValue("custitem_cost_palladium_miracleworks","");
				
			if(item.cost_18kw_gf!=null && item.cost_18kw_gf!="")
				parentItem.setFieldValue("custitem_cost_18kw_guildfacet",item.cost_18kw_gf);
			else
				parentItem.setFieldValue("custitem_cost_18kw_guildfacet","");
			
			if(item.cost_18ky_gf!=null && item.cost_18ky_gf!="")
				parentItem.setFieldValue("custitem_cost_18ky_guildfacet",item.cost_18ky_gf);
			else
				parentItem.setFieldValue("custitem_cost_18ky_guildfacet","");
			
			if(item.cost_platinum_gf!=null && item.cost_platinum_gf!="")
				parentItem.setFieldValue("custitem_cost_platinum_guildfacet",item.cost_platinum_gf);
			else
				parentItem.setFieldValue("custitem_cost_platinum_guildfacet","");
				
			if(item.cost_14k_gf!=null && item.cost_14k_gf!="")
				parentItem.setFieldValue("custitem_cost_14k_guildfacet",item.cost_14k_gf);
			else
				parentItem.setFieldValue("custitem_cost_14k_guildfacet","");
				
			if(item.cost_14kr_gf!=null && item.cost_14kr_gf!="")
				parentItem.setFieldValue("custitem_cost_14kr_guildfacet",item.cost_14kr_gf);
			else
				parentItem.setFieldValue("custitem_cost_14kr_guildfacet","");
				
			if(item.cost_palladium_gf!=null && item.cost_palladium_gf!="")
				parentItem.setFieldValue("custitem_cost_palladium_guildfacet",item.cost_palladium_gf);
			else
				parentItem.setFieldValue("custitem_cost_palladium_guildfacet","");
				
			if(item.cost_18kw_overnight!=null && item.cost_18kw_overnight!="")
				parentItem.setFieldValue("custitem_cost_18kw_overnight",item.cost_18kw_overnight);
			else
				parentItem.setFieldValue("custitem_cost_18kw_overnight","");
			
			if(item.cost_18ky_overnight!=null && item.cost_18ky_overnight!="")
				parentItem.setFieldValue("custitem_cost_18ky_overnight",item.cost_18ky_overnight);
			else
				parentItem.setFieldValue("custitem_cost_18ky_overnight","");
			
			if(item.cost_platinum_overnight!=null && item.cost_platinum_overnight!="")
				parentItem.setFieldValue("custitem_cost_platinum_overnight",item.cost_platinum_overnight);
			else
				parentItem.setFieldValue("custitem_cost_platinum_overnight","");
				
			if(item.cost_14k_overnight!=null && item.cost_14k_overnight!="")
				parentItem.setFieldValue("custitem_cost_14k_overnight",item.cost_14k_overnight);
			else
				parentItem.setFieldValue("custitem_cost_14k_overnight","");
				
			if(item.cost_14kr_overnight!=null && item.cost_14kr_overnight!="")
				parentItem.setFieldValue("custitem_cost_14kr_overnight",item.cost_14kr_overnight);
			else
				parentItem.setFieldValue("custitem_cost_14kr_overnight","");
				
			if(item.cost_palladium_overnight!=null && item.cost_palladium_overnight!="")
				parentItem.setFieldValue("custitem_cost_palladium_overnight",item.cost_palladium_overnight);
			else
				parentItem.setFieldValue("custitem_cost_palladium_overnight","");
			
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
				
			if(item.cost_14k_ch_cad!=null && item.cost_14k_ch_cad!="")
				parentItem.setFieldValue("custitem_cost_14k_ch_cad",item.cost_14k_ch_cad);
			else
				parentItem.setFieldValue("custitem_cost_14k_ch_cad","");
				
			if(item.cost_14kr_ch_cad!=null && item.cost_14kr_ch_cad!="")
				parentItem.setFieldValue("custitem_cost_14kr_ch_cad",item.cost_14kr_ch_cad);
			else
				parentItem.setFieldValue("custitem_cost_14kr_ch_cad","");
				
			if(item.cost_palladium_ch_cad!=null && item.cost_palladium_ch_cad!="")
				parentItem.setFieldValue("custitem_cost_palladium_ch_cad",item.cost_palladium_ch_cad);
			else
				parentItem.setFieldValue("custitem_cost_palladium_ch_cad","");
			
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
				
			if(item.cost_14k_usny_cad!=null && item.cost_14k_usny_cad!="")
				parentItem.setFieldValue("custitem_cost_14k_usny_cad",item.cost_14k_usny_cad);
			else
				parentItem.setFieldValue("custitem_cost_14k_usny_cad","");
				
			if(item.cost_14kr_usny_cad!=null && item.cost_14kr_usny_cad!="")
				parentItem.setFieldValue("custitem_cost_14kr_usny_cad",item.cost_14kr_usny_cad);
			else
				parentItem.setFieldValue("custitem_cost_14kr_usny_cad","");
				
			if(item.cost_palladium_usny_cad!=null && item.cost_palladium_usny_cad!="")
				parentItem.setFieldValue("custitem_cost_palladium_usny_cad",item.cost_palladium_usny_cad);
			else
				parentItem.setFieldValue("custitem_cost_palladium_usny_cad","");
				
			if(item.cost_18kw_sasha_cad!=null && item.cost_18kw_sasha_cad!="")
				parentItem.setFieldValue("custitem_cost_18kw_sasha_cad",item.cost_18kw_sasha_cad);
			else
				parentItem.setFieldValue("custitem_cost_18kw_sasha_cad","");
			
			if(item.cost_18ky_sasha_cad!=null && item.cost_18ky_sasha_cad!="")
				parentItem.setFieldValue("custitem_cost_18ky_sasha_cad",item.cost_18ky_sasha_cad);
			else
				parentItem.setFieldValue("custitem_cost_18ky_sasha_cad","");
			
			if(item.cost_platinum_sasha_cad!=null && item.cost_platinum_sasha_cad!="")
				parentItem.setFieldValue("custitem_cost_platinum_sasha_cad",item.cost_platinum_sasha_cad);
			else
				parentItem.setFieldValue("custitem_cost_platinum_sasha_cad","");
				
			if(item.cost_14k_sasha_cad!=null && item.cost_14k_sasha_cad!="")
				parentItem.setFieldValue("custitem_cost_14k_sasha_cad",item.cost_14k_sasha_cad);
			else
				parentItem.setFieldValue("custitem_cost_14k_sasha_cad","");
				
			if(item.cost_14kr_sasha_cad!=null && item.cost_14kr_sasha_cad!="")
				parentItem.setFieldValue("custitem_cost_14kr_sasha_cad",item.cost_14kr_sasha_cad);
			else
				parentItem.setFieldValue("custitem_cost_14kr_sasha_cad","");
				
			if(item.cost_palladium_sasha_cad!=null && item.cost_palladium_sasha_cad!="")
				parentItem.setFieldValue("custitem_cost_palladium_sasha_cad",item.cost_palladium_sasha_cad);
			else
				parentItem.setFieldValue("custitem_cost_palladium_sasha_cad","");
				
			if(item.cost_18kw_endless_cad!=null && item.cost_18kw_endless_cad!="")
				parentItem.setFieldValue("custitem_cost_18kw_endless_cad",item.cost_18kw_endless_cad);
			else
				parentItem.setFieldValue("custitem_cost_18kw_endless_cad","");
			
			if(item.cost_18ky_endless_cad!=null && item.cost_18ky_endless_cad!="")
				parentItem.setFieldValue("custitem_cost_18ky_endless_cad",item.cost_18ky_endless_cad);
			else
				parentItem.setFieldValue("custitem_cost_18ky_endless_cad","");
			
			if(item.cost_platinum_endless_cad!=null && item.cost_platinum_endless_cad!="")
				parentItem.setFieldValue("custitem_cost_platinum_endless_cad",item.cost_platinum_endless_cad);
			else
				parentItem.setFieldValue("custitem_cost_platinum_endless_cad","");
				
			if(item.cost_14k_endless_cad!=null && item.cost_14k_endless_cad!="")
				parentItem.setFieldValue("custitem_cost_14k_endless_cad",item.cost_14k_endless_cad);
			else
				parentItem.setFieldValue("custitem_cost_14k_endless_cad","");
				
			if(item.cost_14kr_endless_cad!=null && item.cost_14kr_endless_cad!="")
				parentItem.setFieldValue("custitem_cost_14kr_endless_cad",item.cost_14kr_endless_cad);
			else
				parentItem.setFieldValue("custitem_cost_14kr_endless_cad","");
				
			if(item.cost_palladium_endless_cad!=null && item.cost_palladium_endless_cad!="")
				parentItem.setFieldValue("custitem_cost_palladium_endless_cad",item.cost_palladium_endless_cad);
			else
				parentItem.setFieldValue("custitem_cost_palladium_endless_cad","");
				
			if(item.cost_18kw_benchmark_cad!=null && item.cost_18kw_benchmark_cad!="")
				parentItem.setFieldValue("custitem_cost_18kw_benchmark_cad",item.cost_18kw_benchmark_cad);
			else
				parentItem.setFieldValue("custitem_cost_18kw_benchmark_cad","");
			
			if(item.cost_18ky_benchmark_cad!=null && item.cost_18ky_benchmark_cad!="")
				parentItem.setFieldValue("custitem_cost_18ky_benchmark_cad",item.cost_18ky_benchmark_cad);
			else
				parentItem.setFieldValue("custitem_cost_18ky_benchmark_cad","");
			
			if(item.cost_platinum_benchmark_cad!=null && item.cost_platinum_benchmark_cad!="")
				parentItem.setFieldValue("custitem_cost_platinum_benchmark_cad",item.cost_platinum_benchmark_cad);
			else
				parentItem.setFieldValue("custitem_cost_platinum_benchmark_cad","");
				
			if(item.cost_14k_benchmark_cad!=null && item.cost_14k_benchmark_cad!="")
				parentItem.setFieldValue("custitem_cost_14k_benchmark_cad",item.cost_14k_benchmark_cad);
			else
				parentItem.setFieldValue("custitem_cost_14k_benchmark_cad","");
				
			if(item.cost_14kr_benchmark_cad!=null && item.cost_14kr_benchmark_cad!="")
				parentItem.setFieldValue("custitem_cost_14kr_benchmark_cad",item.cost_14kr_benchmark_cad);
			else
				parentItem.setFieldValue("custitem_cost_14kr_benchmark_cad","");
				
			if(item.cost_palladium_benchmark_cad!=null && item.cost_palladium_benchmark_cad!="")
				parentItem.setFieldValue("custitem_cost_palladium_benchmark_cad",item.cost_palladium_benchmark_cad);
			else
				parentItem.setFieldValue("custitem_cost_palladium_benchmark_cad","");
				
			if(item.cost_18kw_mw_cad!=null && item.cost_18kw_mw_cad!="")
				parentItem.setFieldValue("custitem_cost_18kw_miracleworks_cad",item.cost_18kw_mw_cad);
			else
				parentItem.setFieldValue("custitem_cost_18kw_miracleworks_cad","");
			
			if(item.cost_18ky_mw_cad!=null && item.cost_18ky_mw_cad!="")
				parentItem.setFieldValue("custitem_cost_18ky_miracleworks_cad",item.cost_18ky_mw_cad);
			else
				parentItem.setFieldValue("custitem_cost_18ky_miracleworks_cad","");
			
			if(item.cost_platinum_mw_cad!=null && item.cost_platinum_mw_cad!="")
				parentItem.setFieldValue("custitem_cost_platinum_miracleworks_cad",item.cost_platinum_mw_cad);
			else
				parentItem.setFieldValue("custitem_cost_platinum_miracleworks_cad","");
				
			if(item.cost_14k_mw_cad!=null && item.cost_14k_mw_cad!="")
				parentItem.setFieldValue("custitem_cost_14k_miracleworks_cad",item.cost_14k_mw_cad);
			else
				parentItem.setFieldValue("custitem_cost_14k_miracleworks_cad","");
				
			if(item.cost_14kr_mw_cad!=null && item.cost_14kr_mw_cad!="")
				parentItem.setFieldValue("custitem_cost_14kr_miracleworks_cad",item.cost_14kr_mw_cad);
			else
				parentItem.setFieldValue("custitem_cost_14kr_miracleworks_cad","");
				
			if(item.cost_palladium_mw_cad!=null && item.cost_palladium_mw_cad!="")
				parentItem.setFieldValue("custitem_cost_palladium_mw_cad",item.cost_palladium_mw_cad);
			else
				parentItem.setFieldValue("custitem_cost_palladium_mw_cad","");
				
			if(item.cost_18kw_gf_cad!=null && item.cost_18kw_gf_cad!="")
				parentItem.setFieldValue("custitem_cost_18kw_guildfacet_cad",item.cost_18kw_gf_cad);
			else
				parentItem.setFieldValue("custitem_cost_18kw_guildfacet_cad","");
			
			if(item.cost_18ky_gf_cad!=null && item.cost_18ky_gf_cad!="")
				parentItem.setFieldValue("custitem_cost_18ky_guildfacet_cad",item.cost_18ky_gf_cad);
			else
				parentItem.setFieldValue("custitem_cost_18ky_guildfacet_cad","");
			
			if(item.cost_platinum_gf_cad!=null && item.cost_platinum_gf_cad!="")
				parentItem.setFieldValue("custitem_cost_platinum_guildfacet_cad",item.cost_platinum_gf_cad);
			else
				parentItem.setFieldValue("custitem_cost_platinum_guildfacet_cad","");
				
			if(item.cost_14k_gf_cad!=null && item.cost_14k_gf_cad!="")
				parentItem.setFieldValue("custitem_cost_14k_guildfacet_cad",item.cost_14k_gf_cad);
			else
				parentItem.setFieldValue("custitem_cost_14k_guildfacet_cad","");
				
			if(item.cost_14kr_gf_cad!=null && item.cost_14kr_gf_cad!="")
				parentItem.setFieldValue("custitem_cost_14kr_guildfacet_cad",item.cost_14kr_gf_cad);
			else
				parentItem.setFieldValue("custitem_cost_14kr_guildfacet_cad","");
				
			if(item.cost_palladium_gf_cad!=null && item.cost_palladium_gf_cad!="")
				parentItem.setFieldValue("custitem_cost_palladium_guildfacet_cad",item.cost_palladium_gf_cad);
			else
				parentItem.setFieldValue("custitem_cost_palladium_guildfacet_cad","");
				
			if(item.cost_18kw_overnight_cad!=null && item.cost_18kw_overnight_cad!="")
				parentItem.setFieldValue("custitem_cost_18kw_overnight_cad",item.cost_18kw_overnight_cad);
			else
				parentItem.setFieldValue("custitem_cost_18kw_overnight_cad","");
			
			if(item.cost_18ky_overnight_cad!=null && item.cost_18ky_overnight_cad!="")
				parentItem.setFieldValue("custitem_cost_18ky_overnight_cad",item.cost_18ky_overnight_cad);
			else
				parentItem.setFieldValue("custitem_cost_18ky_overnight_cad","");
			
			if(item.cost_platinum_overnight_cad!=null && item.cost_platinum_overnight_cad!="")
				parentItem.setFieldValue("custitem_cost_platinum_overnight_cad",item.cost_platinum_overnight_cad);
			else
				parentItem.setFieldValue("custitem_cost_platinum_overnight_cad","");
				
			if(item.cost_14k_overnight_cad!=null && item.cost_14k_overnight_cad!="")
				parentItem.setFieldValue("custitem_cost_14k_overnight_cad",item.cost_14k_overnight_cad);
			else
				parentItem.setFieldValue("custitem_cost_14k_overnight_cad","");
				
			if(item.cost_14kr_overnight_cad!=null && item.cost_14kr_overnight_cad!="")
				parentItem.setFieldValue("custitem_cost_14kr_overnight_cad",item.cost_14kr_overnight_cad);
			else
				parentItem.setFieldValue("custitem_cost_14kr_overnight_cad","");
				
			if(item.cost_palladium_overnight_cad!=null && item.cost_palladium_overnight_cad!="")
				parentItem.setFieldValue("custitem_cost_palladium_overnight_cad",item.cost_palladium_overnight_cad);
			else
				parentItem.setFieldValue("custitem_cost_palladium_overnight_cad","");
				
			nlapiSubmitRecord(parentItem,false,true);
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating Parent Record","Details: " + err.message);
		return true;
	}
}

function calcPreferredVendor(ch,usny,sasha,endless,benchmark,miracleworks,guildfacet,overnight)
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
	
	if(sasha!=null && sasha!="" && sasha!=0)
	{
		if(lowest==null || lowest=="" || lowest==0)
		{
			prefVendor = "sasha";
			lowest = sasha;
		}
		else
		{
			if(parseFloat(sasha) < parseFloat(lowest))
			{
				prefVendor = "sasha";
				lowest = sasha;
			}	
		}
	}
	
	if(endless!=null && endless!="" && endless!=0)
	{
		if(lowest==null || lowest=="" || lowest==0)
		{
			prefVendor = "endless";
			lowest = sasha;
		}
		else
		{
			if(parseFloat(endless) < parseFloat(lowest))
			{
				prefVendor = "endless";
				lowest = sasha;
			}	
		}
	}
	
	if(benchmark!=null && benchmark!="" && benchmark!=0)
	{
		if(lowest==null || lowest=="" || lowest==0)
		{
			prefVendor = "benchmark";
			lowest = benchmark;
		}
		else
		{
			if(parseFloat(benchmark) < parseFloat(lowest))
			{
				prefVendor = "benchmark";
				lowest = benchmark;
			}	
		}
	}
	
	if(miracleworks!=null && miracleworks!="" && miracleworks!=0)
	{
		if(lowest==null || lowest=="" || lowest==0)
		{
			prefVendor = "miracleworks";
			lowest = miracleworks;
		}
		else
		{
			if(parseFloat(miracleworks) < parseFloat(lowest))
			{
				prefVendor = "miracleworks";
				lowest = miracleworks;
			}	
		}
	}
	
	if(guildfacet!=null && guildfacet!="" && guildfacet!=0)
	{
		if(lowest==null || lowest=="" || lowest==0)
		{
			prefVendor = "guildfacet";
			lowest = guildfacet;
		}
		else
		{
			if(parseFloat(guildfacet) < parseFloat(lowest))
			{
				prefVendor = "guildfacet";
				lowest = guildfacet;
			}	
		}
	}
	
	if(overnight!=null && overnight!="" && overnight!=0)
	{
		if(lowest==null || lowest=="" || lowest==0)
		{
			prefVendor = "overnight";
			lowest = overnight;
		}
		else
		{
			if(parseFloat(overnight) < parseFloat(lowest))
			{
				prefVendor = "overnight";
				lowest = overnight;
			}	
		}
	}
	
	return prefVendor;
}
