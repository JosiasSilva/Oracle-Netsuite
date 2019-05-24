function UPC_Randomizer_SS()
{
	var filters = [];
	filters.push(new nlobjSearchFilter("isinactive",null,"is","F"));
	filters.push(new nlobjSearchFilter("custitem_upc_randomizer_run",null,"is","F"));
	//filters.push(new nlobjSearchFilter("upccode",null,"isempty"));
	filters.push(new nlobjSearchFilter("created",null,"on","today"));
	filters.push(new nlobjSearchFilter("type",null,"is","InvtPart"));
	var results = nlapiSearchRecord("item",null,filters);
	if(results)
	{
		var nextUPC = nlapiLookupField("customrecord_upc_randomizer","1","custrecord_upc_randomizer_code");
		var hexValue = nextUPC;
		
		for(var x=0; x < results.length; x++)
		{
			try
			{
				nlapiSubmitField(results[x].getRecordType(),results[x].getId(),["upccode","custitem_upc_randomizer_run"],[hexValue,"T"]);
			
				var decimalValue = parseInt(hexValue,16);
				decimalValue++;
				
				hexValue = decimalValue.toString(16);
			}
			catch(err)
			{
				nlapiLogExecution("error","Error Updating UPC Code","Item ID: " + results[x].getId() + "\n\nDetails: " + err.message);
			}
		}
		
		nlapiSubmitField("customrecord_upc_randomizer","1","custrecord_upc_randomizer_code",hexValue);
	}
}
