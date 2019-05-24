function Diamond_ETA_Field(type)
{
	try
	{
		var record_type = nlapiGetRecordType();
		nlapiLogExecution("debug","Record Type",record_type);
		nlapiLogExecution("debug","Event Type",type);
		if(type=="create" || type=="specialorder")
		{
			if(record_type=="purchaseorder")
			{
				var vendor = nlapiGetNewRecord().getFieldValue("entity");
				var vendor_category = nlapiLookupField("vendor",vendor,"custentity4");
				if(vendor_category=="1" || vendor_category=="5")
				{
					var sales_order = nlapiGetNewRecord().getFieldValue("createdfrom");
					if(sales_order!=null && sales_order!="")
					{
						var diamond_eta = nlapiLookupField("salesorder",sales_order,"custbody146");
						if(diamond_eta!=null && diamond_eta!="")
						{
							nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody59",diamond_eta);
						}
						else if((diamond_eta==null || diamond_eta=="") && (nlapiGetNewRecord().getFieldValue("custbody59")!=null && nlapiGetNewRecord().getFieldValue("custbody59")!=""))
						{
							nlapiSubmitField("salesorder",sales_order,"custbody146",nlapiGetNewRecord().getFieldValue("custbody59"));
						}
					}
				}
			}
		}
		else if(type=="edit")
		{
			if(record_type=="purchaseorder")
			{
				var vendor = nlapiGetNewRecord().getFieldValue("entity");
				var vendor_category = nlapiLookupField("vendor",vendor,"custentity4");
				if(vendor_category=="1" || vendor_category=="5")
				{
					var old_diamond_eta = nlapiGetOldRecord().getFieldValue("custbody59");
					var new_diamond_eta = nlapiGetNewRecord().getFieldValue("custbody59");
					if(old_diamond_eta!=new_diamond_eta)
					{
						var sales_order = nlapiGetNewRecord().getFieldValue("createdfrom");
						if(sales_order!=null && sales_order!="")
						{
							nlapiSubmitField("salesorder",sales_order,"custbody146",nlapiGetNewRecord().getFieldValue("custbody59"));
						}
					}
				}
			}
			else if(record_type=="salesorder")
			{
				var old_diamond_eta = nlapiGetOldRecord().getFieldValue("custbody146");
				var new_diamond_eta = nlapiGetNewRecord().getFieldValue("custbody146");
				
				if(old_diamond_eta!=new_diamond_eta && new_diamond_eta!=null && new_diamond_eta!="")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("internalid",null,"is",nlapiGetRecordId()));
					filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
					filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
					var cols = [];
					cols.push(new nlobjSearchColumn("purchaseorder"));
					cols.push(new nlobjSearchColumn("mainname","purchaseorder"));
					cols.push(new nlobjSearchColumn("custbody146"));
					var results = nlapiSearchRecord("salesorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							var vendor = results[x].getValue("mainname","purchaseorder");
							var vendor_category = nlapiLookupField("vendor",vendor,"custentity4");
							if(vendor_category=="1" || vendor_category=="5")
							{
								nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody59",new_diamond_eta);
							}
						}
					}
				}
			}
		}
		else if(type=="approve")
		{
			if(record_type=="salesorder")
			{
				var filters = [];
				filters.push(new nlobjSearchFilter("internalid",null,"is",nlapiGetRecordId()));
				filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
				filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
				var cols = [];
				cols.push(new nlobjSearchColumn("purchaseorder"));
				cols.push(new nlobjSearchColumn("mainname","purchaseorder"));
				cols.push(new nlobjSearchColumn("custbody146"));
				var results = nlapiSearchRecord("salesorder",null,filters,cols);
				if(results && new_diamond_eta!=null && new_diamond_eta!="")
				{
					for(var x=0; x < results.length; x++)
					{
						var vendor = results[x].getValue("mainname","purchaseorder");
						var vendor_category = nlapiLookupField("vendor",vendor,"custentity4");
						if(vendor_category=="1" || vendor_category=="5")
						{
							nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody59",new_diamond_eta);
						}
					}
				}
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Updating Dimaond ETA Field","Details: " + err.message);
		return true;
	}
}
