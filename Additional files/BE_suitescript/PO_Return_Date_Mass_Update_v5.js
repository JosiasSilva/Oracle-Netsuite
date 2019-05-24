function PO_Return_Date_MA(rec_type,rec_id)
{
	try
	{
		var fulfillmentId = rec_id;
	
		var ifDate = "";
		
		var items = [];
		
		var filters = [];
		filters.push(new nlobjSearchFilter("internalid",null,"is",fulfillmentId));
		filters.push(new nlobjSearchFilter("cogs",null,"is","F"));
		filters.push(new nlobjSearchFilter("shipping",null,"is","F"));
		filters.push(new nlobjSearchFilter("taxline",null,"is","F"));
		filters.push(new nlobjSearchFilter("item",null,"noneof","@NONE@"));
		//filters.push(new nlobjSearchFilter("custbody_po_return_date_updated",null,"is","F"));
		var cols = [];
		cols.push(new nlobjSearchColumn("item"));
		cols.push(new nlobjSearchColumn("trandate"));
		cols.push(new nlobjSearchColumn("amount"));
		cols.push(new nlobjSearchColumn("createdfrom","createdfrom"));
		cols.push(new nlobjSearchColumn("trandate","createdfrom")); //VRA Date
		var results = nlapiSearchRecord("itemfulfillment",null,filters,cols);
		if(results)
		{
			ifDate = results[0].getValue("trandate");
			
			for(var x=0; x < results.length; x++)
			{
				items.push({
					item: results[x].getValue("item"),
					po : results[x].getValue("createdfrom","createdfrom"),
					amount : (results[x].getValue("amount") * -1),
					vra_date : results[x].getValue("trandate","createdfrom")
				});
			}
		}
		
		nlapiLogExecution("debug","Items",JSON.stringify(items));
		
		for(var x=0; x < items.length; x++)
		{
			var multiItem = false;
			
			nlapiLogExecution("debug","Working on Item: " + items[x].item);
			
			if(items[x].po!=null && items[x].po!="")
			{
				var filters = [];
				filters.push(new nlobjSearchFilter("item",null,"is",items[x].item));
				filters.push(new nlobjSearchFilter("amount",null,"equalto",items[x].amount));
				if(items[x].po!=null && items[x].po!="")
					filters.push(new nlobjSearchFilter("internalid",null,"is",items[x].po));
				filters.push(new nlobjSearchFilter("trandate",null,"before",items[x].vra_date));
				var cols = [];
				cols.push(new nlobjSearchColumn("trandate").setSort(true));
				cols.push(new nlobjSearchColumn("tranid"));
				cols.push(new nlobjSearchColumn("line"));
				cols.push(new nlobjSearchColumn("custcol37"));
				var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
				if(results)
				{
					nlapiLogExecution("debug","Loading PO Record: " + results[0].getValue("tranid"));
					
					if(results.length > 1)
					{
						multiItem = true;
						nlapiLogExecution("debug","Multi Item: " + multiItem);
						
						for(var i=0; i < results.length; i++)
						{
							if(results[i].getValue("custcol37")=="T")
							{
								nlapiLogExecution("debug","poRec establish in IF in loop.","Results index: " + i);
								
								var poRec = nlapiLoadRecord("purchaseorder",results[i].getId());
								break;
							}
						}
					}
					else
					{
						nlapiLogExecution("debug","poRec established in ELSE clause...");
						
						var poRec = nlapiLoadRecord("purchaseorder",results[0].getId());
					}
					
					var save = false;
					
					for(var i=0; i < poRec.getLineItemCount("item"); i++)
					{
						nlapiLogExecution("debug","PO Line: " + poRec.getLineItemValue("item","line",i+1),"Search Line: "+results[0].getValue("line"));
						
						if(/*poRec.getLineItemValue("item","line",i+1)==results[0].getValue("line") &&*/poRec.getLineItemValue("item","item",i+1)==items[x].item)
						{
							if(multiItem==true)
							{
								if(poRec.getLineItemValue("item","custcol37",i+1)=="F")
								{
									nlapiLogExecution("debug","Item is not marked for return...");
									continue;
								}
							}
							
							
							nlapiLogExecution("debug","Item Quantity Billed",poRec.getLineItemValue("item","quantitybilled",i+1));
							
							if(poRec.getLineItemValue("item","quantitybilled",i+1) <= 0)
								poRec.setLineItemValue("item","isclosed",i+1,"T");
							poRec.setLineItemValue("item","custcolreturn_date",i+1,ifDate);
							
							save = true;
							break;
						}
					}
					
					if(save)
					{
						nlapiLogExecution("debug","Saving PO...");
						nlapiSubmitRecord(poRec,true,true);
					}
				}
				else
				{
					var multiItem = false;
					
					var filters1 = [];
					filters1.push(new nlobjSearchFilter("item",null,"is",items[x].item));
					filters1.push(new nlobjSearchFilter("amount",null,"equalto",items[x].amount));
					filters1.push(new nlobjSearchFilter("trandate",null,"before",items[x].vra_date));
					var cols1 = [];
					cols1.push(new nlobjSearchColumn("trandate").setSort(true));
					cols1.push(new nlobjSearchColumn("tranid"));
					cols1.push(new nlobjSearchColumn("line"));
					cols1.push(new nlobjSearchColumn("custcol37"));
					var results1 = nlapiSearchRecord("purchaseorder",null,filters1,cols1);
					if(results1)
					{
						nlapiLogExecution("debug","Loading PO Record: " + results1[0].getValue("tranid"));
					
						if(results1.length > 1)
						{
							multiItem = true;
							nlapiLogExecution("debug","Multi Item: " + multiItem);
							
							for(var i=0; i < results1.length; i++)
							{
								if(results1[i].getValue("custcol37")=="T")
								{
									nlapiLogExecution("debug","poRec establish in IF in loop.","Results index: " + i);
									
									var poRec = nlapiLoadRecord("purchaseorder",results1[i].getId());
									break;
								}
							}
						}
						else
						{
							nlapiLogExecution("debug","poRec established in ELSE clause...");
							
							var poRec = nlapiLoadRecord("purchaseorder",results1[0].getId());
						}
						
						var save = false;
						
						for(var i=0; i < poRec.getLineItemCount("item"); i++)
						{
							nlapiLogExecution("debug","PO Line: " + poRec.getLineItemValue("item","line",i+1),"Search Line: "+results1[0].getValue("line"));
							
							if(/*poRec.getLineItemValue("item","line",i+1)==results1[0].getValue("line") &&*/poRec.getLineItemValue("item","item",i+1)==items[x].item)
							{
								if(multiItem==true)
								{
									if(poRec.getLineItemValue("item","custcol37",i+1)=="F")
									{
										nlapiLogExecution("debug","Item is not marked for return...");
										continue;
									}
								}
								
								nlapiLogExecution("debug","Item Quantity Billed",poRec.getLineItemValue("item","quantitybilled",i+1));
								
								if(poRec.getLineItemValue("item","quantitybilled",i+1) <= 0)
									poRec.setLineItemValue("item","isclosed",i+1,"T");
								poRec.setLineItemValue("item","custcolreturn_date",i+1,ifDate);
								
								save = true;
								break;
							}
						}
						
						if(save)
						{
							nlapiLogExecution("debug","Saving PO...");
							nlapiSubmitRecord(poRec,true,true);
						}
					}
				}
			}
			else
			{
				
			}
		}
		
		nlapiSubmitField("itemfulfillment",rec_id,"custbody_po_return_date_updated","T");
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Handling IF " + rec_id,"Details: " + err.message);
	}
	
}
