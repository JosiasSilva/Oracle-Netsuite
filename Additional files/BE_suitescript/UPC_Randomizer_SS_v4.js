function UPC_Randomizer_SS()
{
	var today = new Date();
	var yesterday = nlapiAddDays(today,-1);
	
	today = nlapiDateToString(today,"date");
	yesterday = nlapiDateToString(yesterday,"date");
	
	var filters = [];
	filters.push(new nlobjSearchFilter("isinactive",null,"is","F"));
	filters.push(new nlobjSearchFilter("custitem_upc_randomizer_run",null,"is","F"));
	//filters.push(new nlobjSearchFilter("upccode",null,"isempty"));
	//filters.push(new nlobjSearchFilter("created",null,"on","today"));
	filters.push(new nlobjSearchFilter("created",null,"within",yesterday,today));
	filters.push(new nlobjSearchFilter("type",null,"is",["InvtPart","Assembly"]));
	var results = nlapiSearchRecord("item",null,filters);
	if(results)
	{
		var nextUPC = nlapiLookupField("customrecord_upc_randomizer","1","custrecord_upc_randomizer_code");
		var hexValue = nextUPC;
		hexValue = hexValue.toUpperCase();
		
		for(var x=0; x < results.length; x++)
		{
			try
			{
				nlapiSubmitField(results[x].getRecordType(),results[x].getId(),["upccode","custitem_upc_randomizer_run"],[hexValue,"T"]);
			
				var decimalValue = parseInt(hexValue,16);
				decimalValue++;
				
				hexValue = decimalValue.toString(16);
				hexValue = hexValue.toUpperCase();
			}
			catch(err)
			{
				nlapiLogExecution("error","Error Updating UPC Code","Item ID: " + results[x].getId() + "\n\nDetails: " + err.message);
			}
		}
		
		nlapiSubmitField("customrecord_upc_randomizer","1","custrecord_upc_randomizer_code",hexValue);
	}
}
