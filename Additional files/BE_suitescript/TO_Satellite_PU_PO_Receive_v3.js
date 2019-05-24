nlapiLogExecution("audit","FLOStart",new Date().getTime());
function TO_Satellite_PU_Receive(type)
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
			var poDropShip = nlapiLookupField("purchaseorder",po,"custbody39");
			
			if(poDropShip==null || poDropShip=="")
			{
				nlapiLogExecution("error","PO is not Drop Ship","Script will exit.");
				return true;
			}
			
			var filters = [];
			filters.push(new nlobjSearchFilter("anylineitem",null,"anyof",receiptItems));
			filters.push(new nlobjSearchFilter("createdfrom",null,"is",so));
			filters.push(new nlobjSearchFilter("custbody39",null,"isnotempty"));
			filters.push(new nlobjSearchFilter("custbody53",null,"is","T"));
			filters.push(new nlobjSearchFilter("custbody_pickup_location",null,"noneof","1"));
			filters.push(new nlobjSearchFilter("appliedtotransaction",null,"noneof","@NONE@"));
			filters.push(new nlobjSearchFilter("type","appliedtotransaction","is","SalesOrd"));
			//filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
			filters.push(new nlobjSearchFilter("taxline",null,"is","F"));
			filters.push(new nlobjSearchFilter("shipping",null,"is","F"));
			filters.push(new nlobjSearchFilter("cogs",null,"is","F"));
			filters.push(new nlobjSearchFilter("type","item","noneof",["NonInvtPart","Service"]));
			var cols = [];
			cols.push(new nlobjSearchColumn("mainname"));
			cols.push(new nlobjSearchColumn("item"));
			cols.push(new nlobjSearchColumn("custitem20","item"));
			cols.push(new nlobjSearchColumn("quantityuom"));
			cols.push(new nlobjSearchColumn("memo"));
			cols.push(new nlobjSearchColumn("location"));
			cols.push(new nlobjSearchColumn("custbody_pickup_location"));
			cols.push(new nlobjSearchColumn("createdfrom"));
			cols.push(new nlobjSearchColumn("custcol_full_insurance_value","appliedtotransaction"));
			var results = nlapiSearchRecord("itemfulfillment",null,filters,cols);
			if(results)
			{
				nlapiLogExecution("debug","# Results","Details: " + results.length);
				
				var transferOrder = nlapiCreateRecord("transferorder");
				transferOrder.setFieldValue("memo","Satellite Pick-Up Transfer Order");
				
				nlapiLogExecution("debug","Vendor: " + vendor);
				
				var filters2 = [];
				filters2.push(new nlobjSearchFilter("custrecord_drop_ship_vendor_link",null,"is",vendor));
				var results2 = nlapiSearchRecord("location",null,filters2);
				if(results2)
				{
					transferOrder.setFieldValue("location",results2[0].getId());
					nlapiLogExecution("debug","FROM Location: " + results2[0].getId());
				}
				
				var filters1 = [];
				filters1.push(new nlobjSearchFilter("custrecord_pick_up_location_link",null,"is",results[0].getValue("custbody_pickup_location")));
				var results1 = nlapiSearchRecord("location",null,filters1);
				if(results1)
				{
					transferOrder.setFieldValue("transferlocation",results1[0].getId());
					nlapiLogExecution("debug","TO Location: " + results1[0].getId());
				}
				
				var totalInsurance = 0.00;
				
				for(var x=0; x < results.length; x++)
				{
					transferOrder.selectNewLineItem("item");
					transferOrder.setCurrentLineItemValue("item","item",results[x].getValue("item"));
					transferOrder.setCurrentLineItemValue("item","quantity",results[x].getValue("quantityuom"));
					transferOrder.setCurrentLineItemValue("item","custcol_full_insurance_value",results[x].getValue("custcol_full_insurance_value","appliedtotransaction"));
					transferOrder.setCurrentLineItemValue("item","custcol38",results[x].getValue("createdfrom"));
					transferOrder.setCurrentLineItemValue("item","custcol_linked_item_fulfillment",results[x].getId());
					transferOrder.commitLineItem("item");
					
					if(results[x].getValue("custcol_full_insurance_value","appliedtotransaction")!=null && results[x].getValue("custcol_full_insurance_value","appliedtotransaction")!="")
					{
						//Verify not a gemstone so can include in the total
						var category = results[x].getValue("custitem20","item");
						if(category!="7" && category!="8" && category!="14" && category!="15" && category!="18" && category!="20" && category!="21" && category!="31")
							totalInsurance += parseFloat(results[x].getValue("custcol_full_insurance_value","appliedtotransaction"));
					}
					
					nlapiLogExecution("debug","Finished Adding Item #" + (x+1));
				}
				
				transferOrder.setFieldValue("custbody_insurance_total",totalInsurance);
				
				var toId = nlapiSubmitRecord(transferOrder,true,true);
				
				//Auto fulfill transfer order to Shipped and Completed
				var fulfillment = nlapiTransformRecord("transferorder",toId,"itemfulfillment",{recordmode:"dynamic"});
				fulfillment.setFieldValue("shipstatus","C");
				var fulfillmentId = nlapiSubmitRecord(fulfillment,true,true);
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Transferring Satellite PU","Details: " + err.message);
		}
	}
}
