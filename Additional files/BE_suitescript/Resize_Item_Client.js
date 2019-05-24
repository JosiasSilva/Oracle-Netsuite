nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Resize_Item_Client(type,name)
{
	if(type=="item" && name=="item")
	{
		try
		{
			alert("Running...");
			
			var item = nlapiGetCurrentLineItemValue("item","item");
			if(item=="1093360")
			{
				//Find ring item to grab description information
				for(var x=0; x < nlapiGetLineItemCount("item"); x++)
				{
					var category = nlapiLookupField("item",nlapiGetLineItemValue("item","item",x+1),"custitem20");
					if(category=="2" || category=="3" || category=="24")
					{
						var description = nlapiGetLineItemValue("item","description",x+1);
						nlapiSetCurrentLineItemValue("item","description",description+", to Size ",true,true);
						break;
					}
				}
			}
		}catch(e){ }
	}
}
