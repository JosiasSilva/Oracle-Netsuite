function Molds_UE_AS(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var item = nlapiGetNewRecord().getFieldValue("custrecord_mold_item");
			var parent = nlapiLookupField("item",item,"parent");
			if(parent==null || parent=="")
				parent = item;
				
			var items = [];
			items.push(parent);
			
			var filters = [];
			filters.push(new nlobjSearchFilter("parent",null,"is",parent));
			filters.push(new nlobjSearchFilter("matrixchild",null,"is","T"));
			var results = nlapiSearchRecord("item",null,filters);
			if(results)
			{
				for(var x=0; x < results.length; x++)
					items.push(results[x].getId());
			}
			
			var moldRecord = nlapiLoadRecord(nlapiGetRecordType(),nlapiGetRecordId());
			moldRecord.setFieldValues("custrecord_mold_item",items);
			nlapiSubmitRecord(moldRecord,true,true);			
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Assigning Mold Items","Details: " + err.message);
			return true;
		}
	}
}
