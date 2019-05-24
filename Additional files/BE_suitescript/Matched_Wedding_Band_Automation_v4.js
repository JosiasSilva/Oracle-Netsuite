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
				var amount = parseFloat(order.getLineItemValue("item","amount",x+1));
				var line_insurance = amount * 0.8;
				
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
						
						nlapiLogExecution("debug","ER Item",erItem);
						nlapiLogExecution("debug","ER Desc",erItemDesc);
						nlapiLogExecution("debug","ER Insurance",erInsurance);
						
						for(var e=1; e < results.length; e++)
						{
							//Check to see if a resize order, if so, use that description
							if(results[e].getValue("custbody87")=="2")
							{
								erItemDesc = results[e].getValue("memo");
							}
							//Check to see if is an exchange, if so, use that sales order # + description
							else if(results[e].getValue("custbody87")=="4")
							{
								originalNumber = results[e].getValue("tranid");
								erItem = results[e].getValue("item");
								erItemDesc = results[e].getValue("memo");
								erInsurance = results[e].getValue("custcol_full_insurance_value");
							}
						}
						
						if(erInsurance==null || erInsurance=="")
							erInsurance = 0.00;
						
						var gemItemDesc = "";
						var gemItemCert = "";
						
						//Check for gemstone details
						var filters1 = [];
						filters1.push(new nlobjSearchFilter("internalid",null,"is",results[0].getId()));
						filters1.push(new nlobjSearchFilter("mainline",null,"is","F"));
						filters1.push(new nlobjSearchFilter("custitem20","item","anyof",["7","8"]));
						var cols1 = [];
						cols1.push(new nlobjSearchColumn("item"));
						cols1.push(new nlobjSearchColumn("memo"));
						cols1.push(new nlobjSearchColumn("custcol_full_insurance_value"));
						cols1.push(new nlobjSearchColumn("custcol16"));
						var results1 = nlapiSearchRecord("salesorder",null,filters1,cols1);
						if(results1)
						{
							var gemItem = results1[0].getValue("item");
							gemItemDesc = results1[0].getValue("memo");
							gemItemCert = results1[0].getValue("custcol16");
							var gemInsurance = results1[0].getValue("custcol_full_insurance_value");
							if(gemInsurance==null || gemInsurance=="")
								gemInsurance = 0.00;
								
							nlapiLogExecution("debug","Gem Item",gemItem);
							nlapiLogExecution("debug","Gem Desc",gemItemDesc);
							nlapiLogExecution("debug","Gem Insurance",gemInsurance);
							
							//Add Gem Insurance $ To Line
							var currentInsurance = order.getLineItemValue("item","custcol_full_insurance_value",x+1);
							nlapiSetLineItemValue("item","custcol_full_insurance_value",x+1,parseFloat(gemInsurance)+line_insurance);
						}
						
						if(gemItemCert!=null && gemItemCert!="")
							gemItemCert = "\n\nCert#\n"+gemItemCart;
						else
							gemItemCert = "";
						
						//Add ER Item to Order as Customer Item
						nlapiSelectNewLineItem("item");
						nlapiSetCurrentLineItemValue("item","item","66394",true,true);
						nlapiSetCurrentLineItemValue("item","description",erItemDesc,true,true);
						nlapiSetCurrentLineItemValue("item","price","-1",true,true);
						nlapiSetCurrentLineItemValue("item","rate","0.00",true,true);
						nlapiSetCurrentLineItemValue("item","custcol_full_insurance_value",erInsurance,true,true);
						nlapiSetCurrentLineItemValue("item","custcol5",gemItemDesc+gemItemCert,true,true);
						nlapiCommitLineItem("item");
					
						//Append with "WB"
						if(originalNumber!="" && originalNumber!=null)
							nlapiSetFieldValue("tranid",originalNumber+"WB");
						
						nlapiLogExecution("debug","Finished setting tranid");
						
						//Recalc Full Insurance Value
						var insurance = 0.00;
						for(var i=0; i < order.getLineItemCount("item"); i++)
						{
							if(order.getLineItemValue("item","custcol_full_insurance_value",i+1)!=null && order.getLineItemValue("item","custcol_full_insurance_value",i+1)!="")
							{
								insurance += parseFloat(order.getLineItemValue("item","custcol_full_insurance_value",i+1));
							}						
						}
						nlapiLogExecution("debug","Order Level Insurance",insurance);
						nlapiSetFieldValue("custbody_full_insurance_amount",insurance);
						
						//Set Type of Order = Matched Wedding Band
						nlapiSetFieldValue("custbody87","5");
						
						nlapiLogExecution("debug","Finished setting Type of Order");
						
						//Set Status on Repairs/Resizes = Pending RX
						nlapiSetFieldValue("custbody142","11");
						
						//Set Return Shipping Label Status = Label Needed (except when pickup)
						if(order.getFieldValue("custbody53")!="T")
							nlapiSetFieldValue("custbody138","1");
						
						nlapiLogExecution("debug","Finished setting Status on Repairs/Resizes");
					}
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
