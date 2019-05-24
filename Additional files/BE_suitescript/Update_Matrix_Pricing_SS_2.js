var usage;
var start_line,sub_index,csvJSON,user;

function updateMatrixPricing()
{
	try
	{
		//Retrieve script parameter - csv json
		csvJSON = nlapiGetContext().getSetting("SCRIPT","custscript_csv_json");
		start_line = nlapiGetContext().getSetting("SCRIPT","custscriptcsv_current_line");
		sub_index = nlapiGetContext().getSetting("SCRIPT","custscript_sub_index");
		user = nlapiGetContext().getSetting("SCRIPT","custscript_csv_pricing_update_user");
		
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
			nlapiLogExecution("debug","Updating CSV Line " + x);
			usage = nlapiGetContext().getRemainingUsage();
			if(usage < 45)
			{
				var params = [];
				params["custscript_csv_json"] = csvJSON;
				params["custscriptcsv_current_line"] = x;
				params["custscript_sub_index"] = sub_index;
				params["custscript_csv_pricing_update_user"] = user;
				nlapiScheduleScript("customscript_csv_update_matrix_pricing",null,params);
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
					
				sub_index = 0;	
			}
		}
		
		nlapiSendEmail(user,user,"Pricing CSV Upload Complete","Your CSV pricing upload has completed.");
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating Children","Details: " + err.message);
		nlapiSendEmail(user,user,"Pricing CSV Upload Error","Your CSV pricing upload has terminated due to errors.");
		return true;
	}
}

function updateItemPricing(itemObj,startAt,currentLine)
{
	try
	{
		//Get item object
		var item = itemObj;
		
		//Determine which columns (metal types) to update
		var metalTypes = [];
		if(item.price_18kw!=null && item.price_18kw!="")
			metalTypes.push(1);
		if(item.price_18ky!=null && item.price_18ky!="")
			metalTypes.push(2);
		if(item.price_platinum!=null && item.price_platinum!="")
			metalTypes.push(3);
		if(item.price_palladium!=null && item.price_palladium!="")
			metalTypes.push(4);
		if(item.price_14kr!=null && item.price_14kr!="")
			metalTypes.push(7);
		
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
				switch(results[x].getValue("custitem1"))
				{
					case "1":
						itemRec.setLineItemValue("price","price_1_",1,item.price_18kw);
						break;
					case "2":
						itemRec.setLineItemValue("price","price_1_",1,item.price_18ky);
						break;
					case "3":
						itemRec.setLineItemValue("price","price_1_",1,item.price_platinum);
						break;
					case "4":
						itemRec.setLineItemValue("price","price_1_",1,item.price_palladium);
						break;
					case "7":
						itemRec.setLineItemValue("price","price_1_",1,item.price_14kr);
						break;
				}
				nlapiSubmitRecord(itemRec,true,true); //10 UNITS
				
				usage = nlapiGetContext().getRemainingUsage();
				if(x+1<results.length && usage < 45)
				{
					//Reschedule Script no more usage remaining
					var params = [];
					params["custscript_csv_json"] = csvJSON;
					params["custscriptcsv_current_line"] = currentLine;
					params["custscript_sub_index"] = searchid+1;
					params["custscript_csv_pricing_update_user"] = user;
					nlapiScheduleScript("customscript_csv_update_matrix_pricing",null,params);
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
