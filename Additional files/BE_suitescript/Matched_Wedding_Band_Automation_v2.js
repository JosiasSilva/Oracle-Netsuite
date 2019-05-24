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
					cols.push(new nlobjSearchColumn("item"));
					cols.push(new nlobjSearchColumn("memo"));
					cols.push(new nlobjSearchColumn("custcol_full_insurance_value"));
					cols.push(new nlobjSearchColumn("custbody87"));
					var results = nlapiSearchRecord("salesorder",null,filters,cols);
					if(results)
					{
						originalNumber = results[0].getValue("tranid");
						
						var erItem = results[0].getValue("item");
						var erItemDesc = results[0].getValue("memo");
						var erInsurance = results[0].getValue("custcol_full_insurance_value");
						
						for(var x=1; x < results.length; x++)
						{
							//Check to see if a resize order, if so, use that description
							if(results[x].getValue("custbody87")=="2")
							{
								erItemDesc = results[x].getValue("memo");
							}
							//Check to see if is an exchange, if so, use that sales order # + description
							else if(results[x].getValue("custbody87")=="4")
							{
								originalNumber = results[x].getValue("tranid");
								erItem = results[x].getValue("item");
								erItemDesc = results[x].getValue("memo");
								erInsurance = results[x].getValue("custcol_full_insurance_value");
							}
						}
						
						//Add ER Item to Order as Customer Item
						nlapiSelectNewLineItem("item");
						nlapiSetCurrentLineItemValue("item","item","66394",true,true);
						nlapiSetCurrentLineItemValue("item","description",erItemDesc,true,true);
						nlapiSetCurrentLineItemValue("item","price","-1",true,true);
						nlapiSetCurrentLineItemValue("item","rate","0.00",true,true);
						nlapiSetCurrentLineItemValue("item","custcol_full_insurance_value",erInsurance,true,true);
						nlapiCommitLineItem("item");
						
						//Check for gemstone details
						var filters1 = [];
						filters1.push(new nlobjSearchFilter("internalid",null,"is",results[0].getId()));
						filters1.push(new nlobjSearchFilter("mainline",null,"is","F"));
						filters1.push(new nlobjSearchFilter("custitem20","item","anyof",["7","8"]));
						var cols1 = [];
						cols1.push(new nlobjSearchColumn("item"));
						cols1.push(new nlobjSearchColumn("memo"));
						cols1.push(new nlobjSearchColumn("custcol_full_insurance_value"));
						var results1 = nlapiSearchRecord("salesorder",null,filters1,cols1);
						if(results1)
						{
							var gemItem = results1[0].getValue("item");
							var gemItemDesc = results1[0].getValue("memo");
							var gemInsurance = results1[0].getValue("custcol_full_insurance_value");
							
							//Add Gem Item to Order as Customer Item
							nlapiSelectNewLineItem("item");
							nlapiSetCurrentLineItemValue("item","item","66394",true,true);
							nlapiSetCurrentLineItemValue("item","description",gemItemDesc,true,true);
							nlapiSetCurrentLineItemValue("item","price","-1",true,true);
							nlapiSetCurrentLineItemValue("item","rate","0.00",true,true);
							nlapiSetCurrentLineItemValue("item","custcol_full_insurance_value",gemInsurance,true,true);
							nlapiCommitLineItem("item");
						}
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
