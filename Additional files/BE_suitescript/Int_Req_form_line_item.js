nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Irf_line_item_client(type,name,line)
{
 	try
	{
		if(type=="recmachcustrecord_irf_items" && name=="custrecord_irf_item")
		{
          
			var item = nlapiGetCurrentLineItemValue("recmachcustrecord_irf_items","custrecord_irf_item");
			var filters=[];
			filters.push(new nlobjSearchFilter("internalid",null,"is",item));
			filters.push(new nlobjSearchFilter("inventorylocation",null,"is",["2"]));
			var cols=[];
			cols.push(new nlobjSearchColumn("locationquantityavailable"));
			cols.push(new nlobjSearchColumn("inventorylocation"));
			var results = nlapiSearchRecord("item",null,filters,cols);
			if(results)
			{
				var sfQuantity = 0.00;
				for(var x=0; x < results.length; x++)
				{
					if(results[x].getValue("inventorylocation")=="2" )
					{
						if(results[x].getValue("locationquantityavailable")!=null && results[x].getValue("locationquantityavailable")!="")
						{
							sfQuantity = results[x].getValue("locationquantityavailable");
							nlapiLogExecution("debug","Quanity availabe in SF",sfQuantity);
						}
					}
				}
				if(sfQuantity==null || sfQuantity=="")
					sfQuantity = 0.00;
					nlapiSetCurrentLineItemValue("recmachcustrecord_irf_items","custrecord_irf_qty_sf",sfQuantity);
			}
			else
			{
				nlapiSetCurrentLineItemValue("recmachcustrecord_irf_items","custrecord_irf_qty_sf",0.00);
			}			
		}
	}
	catch(err)
	{
		
	}
}