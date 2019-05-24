function Drop_Ship_Email_Confirmation_Status(type)
{
	if(type=="create")
	{
		try
		{
			var receipt = nlapiGetNewRecord();
			var po = receipt.getFieldValue("createdfrom");
			
			var receiptItems = [];
			for(var x=0; x < receipt.getLineItemCount("item"); x++)
			{
				receiptItems.push(receipt.getLineItemValue("item","item",x+1));
			}
			
			//Get sales order from PO
			var so = nlapiLookupField("purchaseorder",po,"createdfrom");
			var vendor = nlapiLookupField("purchaseorder",po,"entity");
			var typeOfContact = nlapiLookupField("vendor",vendor,"custentity4");
			var poDropShip = nlapiLookupField("purchaseorder",po,"custbody39");
			
			if(poDropShip==null || poDropShip=="")
			{
				nlapiLogExecution("error","PO is not Drop Ship","Script will exit.");
				return true;
			}
			
			if(typeOfContact!="6")
			{
				nlapiLogExecution("debug","Vendor Type of Contact != Production Vendor/Jeweler","Script will exit.");
				return true;
			}
			
			var filters = [];
			filters.push(new nlobjSearchFilter("anylineitem",null,"anyof",receiptItems));
			filters.push(new nlobjSearchFilter("createdfrom",null,"is",so));
			filters.push(new nlobjSearchFilter("custbody39",null,"isnotempty"));
			filters.push(new nlobjSearchFilter("custbody_pickup_location",null,"noneof","1"));
			filters.push(new nlobjSearchFilter("appliedtotransaction",null,"noneof","@NONE@"));
			filters.push(new nlobjSearchFilter("type","appliedtotransaction","is","SalesOrd"));
			filters.push(new nlobjSearchFilter("taxline",null,"is","F"));
			filters.push(new nlobjSearchFilter("shipping",null,"is","F"));
			filters.push(new nlobjSearchFilter("cogs",null,"is","F"));
			filters.push(new nlobjSearchFilter("type","item","noneof",["NonInvtPart","Service"]));
			var cols = [];
			cols.push(new nlobjSearchColumn("internalid",null,"group"));
			cols.push(new nlobjSearchColumn("custbody_pickup_location",null,"group"));
			var results = nlapiSearchRecord("itemfulfillment",null,filters,cols);
			if(results)
			{
				for(var x=0; x < results.length; x++)
				{
					if(results[x].getValue("custbody_pickup_location",null,"group")!=null && results[x].getValue("custbody_pickup_location",null,"group")!="")
					{
						nlapiSubmitField("itemfulfillment",results[x].getValue("internalid",null,"group"),"custbody89","7"); //In Transit
					}
					else
					{
						nlapiSubmitField("itemfulfillment",results[x].getValue("internalid",null,"group"),"custbody89","1"); //To Be Emailed
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Transferring Satellite PU","Details: " + err.message);
		}
	}
}
