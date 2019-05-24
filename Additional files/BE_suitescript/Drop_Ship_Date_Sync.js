function Drop_Ship_Date_Sync(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var recid = nlapiGetRecordId();
			var rectype = nlapiGetRecordType();
			
			if(type=="create" && rectype=="purchaseorder")
			{
				var salesorder = nlapiGetNewRecord().getFieldValue("createdfrom");
				if(salesorder!=null && salesorder!="")
				{
					var custbody39 = nlapiLookupField("salesorder",salesorder,"custbody39");
					nlapiSubmitField("purchaseorder",recid,"custbody39",custbody39);
				}
			}
			else if(type=="edit")
			{
				var oldValue = nlapiGetOldRecord().getFieldValue("custbody39");
				var newValue = nlapiGetNewRecord().getFieldValue("custbody39");
				
				if(oldValue!=newValue)
				{
					if(rectype=="salesorder")
					{
						var filters = [];
						filters.push(new nlobjSearchFilter("internalid",null,"is",recid));
						filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
						var cols = [];
						cols.push(new nlobjSearchColumn("purchaseorder"));
						cols.push(new nlobjSearchColumn("custbody39"));
						var results = nlapiSearchRecord("salesorder",null,filters,cols);
						if(results)
						{
							for(var x=0; x < results.length; x++)
							{
								nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody39",newValue);
							}
						}
					}
					else
					{
						//Update Sales Order
						var salesorder = nlapiGetNewRecord().getFieldValue("createdfrom");
						if(salesorder!=null && salesorder!="")
						{
							nlapiSubmitField("salesorder",salesorder,"custbody39",newValue);
						}
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Syncing field custbody39","Details: " + err.message);
			return true;
		}
	}
}
