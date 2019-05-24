nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Create_Mold(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var po = nlapiGetNewRecord();
			for(var x=0; x <po.getLineItemCount("item"); x++)
			{
				if(po.getLineItemValue("item","custcol13",x+1)=="T" && (po.getLineItemValue("item","custcol17",x+1)!=null && nlapiGetLineItemValue("item","custcol17",x+1)!=null) && (nlapiGetLineItemValue("item","custcol_mold_new",x+1)==null || nlapiGetLineItemValue("item","custcol_mold_new",x+1)==null))
				{
					var mold_name = po.getLineItemValue("item","custcol17",x+1);
					var item = po.getLineItemValue("item","item",x+1);
					var parent = nlapiLookupField("item",item,"parent");
					if(parent==null || parent=="")
						parent = item;
					var vendor = po.getFieldValue("entity");
					
					var filters = [];
					filters.push(new nlobjSearchFilter("name",null,"is",mold_name));
					filters.push(new nlobjSearchFilter("custrecord_mold_vendor",null,"is",vendor));
					filters.push(new nlobjSearchFilter("custrecord_mold_item",null,"is",parent));
					var results = nlapiSearchRecord("customrecord_mold",null,filters);
					if(results)
					{
						var moldID = results[0].getId();
						//nlapiSetLineItemValue("item","custcol_mold_new",x+1,moldID);
					}
					else
					{
						var moldRecord = nlapiCreateRecord("customrecord_mold");
						moldRecord.setFieldValue("name",mold_name);
						moldRecord.setFieldValue("custrecord_mold_vendor",vendor);
						moldRecord.setFieldValue("custrecord_mold_item",parent);
						moldRecord.setFieldValue("custrecord_mold_purchase_order",nlapiGetRecordId());
						var moldID = nlapiSubmitRecord(moldRecord,true,true);
						//nlapiSetLineItemValue("item","custcol_mold_new",x+1,moldID);
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Creating Mold Record","Details: " + err.message);
			return true;
		}
	}
}

function Molds_PO_BL(type,form)
{
	if(type=="view" || type=="edit" || type=="create")
	{
		try
		{
			if(nlapiGetContext().getExecutionContext()!="userinterface")
				return true;
				
			for(var x=0; x < nlapiGetLineItemCount("item"); x++)
			{
				var molds = [];
				var item = nlapiGetLineItemValue("item","item",x+1);
				var vendor = nlapiGetFieldValue("entity");
				
				var parent = nlapiLookupField("item",item,"parent");
				if(parent==null || parent=="")
					continue;
				
				nlapiLogExecution("debug","PO Vendor",vendor);
				
				var filters = [];
				filters.push(new nlobjSearchFilter("custrecord_mold_item",null,"is",parent));
				filters.push(new nlobjSearchFilter("custrecord_mold_vendor",null,"is",vendor));
				var cols = [];
				cols.push(new nlobjSearchColumn("name"));
				var results = nlapiSearchRecord("customrecord_mold",null,filters,cols);
				if(results)
				{
					for(var i=0; i < results.length; i++)
					{
						molds.push(results[i].getValue("name"));
					}
					nlapiLogExecution("debug","Molds",molds.join("\n"));
					nlapiSetLineItemValue("item","custcol_molds_so",x+1,molds.join("\n"));
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Showing Molds On PO","Details: " + err.message);
			return true;
		}
	}
}
