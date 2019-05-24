function Matched_Wedding_Band_Automation(type)
{
	if(type=="create")
	{
		try
		{
			var order = nlapiGetNewRecord();
			
			//Get list of wedding band parent items from script parameter
			var bands = nlapiGetContext().getSetting("SCRIPT","custscript_wedding_bands");
			bands = bands.split(",");
			
			for(var x=0; x < order.getLineItemCount("item"); x++)
			{
				nlapiLogExecution("debug","Going through line #" + x);
				
				var item = order.getLineItemText("item","item",x+1);
				var parent = item.substring(0,item.indexOf(":")-1);
				
				if(bands.indexOf(parent)!=-1)
				{
					nlapiLogExecution("debug","Wedding Band Found on Order...")
					
					var originalNumber = "";
					
					//Find previous engagement ring order #
					var filters = [];
					filters.push(new nlobjSearchFilter("entity",null,"is",order.getFieldValue("entity")));
					filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
					filters.push(new nlobjSearchFilter("custitem20","item","is","2"));
					var cols = [];
					cols.push(new nlobjSearchColumn("trandate").setSort());
					cols.push(new nlobjSearchColumn("tranid"));
					var results = nlapiSearchRecord("salesorder",null,filters,cols);
					if(results)
					{
						originalNumber = results[0].getValue("tranid");
					}
					
					//Append with "WB"
					if(originalNumber!="" && originalNumber!=null)
						nlapiSetFieldValue("tranid",originalNumber+"WB");
					
					nlapiLogExecution("debug","Finished setting tranid");
					
					//Set Type of Order = Matched Wedding Band
					nlapiSetFieldValue("custbody87","5");
					
					nlapiLogExecution("debug","Finished setting Type of Order");
					
					//Set Status on Repairs/Resizes = Pending RX
					nlapiSetFieldValue("custbody142","11");
					
					nlapiLogExecution("debug","Finished setting Status on Repairs/Resizes");
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Matching WB Values","Details: " + err.message);
			return true;
		}
	}
}
