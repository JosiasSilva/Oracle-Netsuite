nlapiLogExecution("audit","FLOStart",new Date().getTime());
function TO_Satellite_PU_SS()
{
	var transfers = [];
	
	var filters = [];
	
	var locationFilter = nlapiGetContext().getSetting("SCRIPT","custscript_to_pu_loc_filter");
	if(locationFilter!=null && locationFilter!="")
		filters.push(new nlobjSearchFilter("custbody_pickup_location",null,"is",locationFilter));
	
	if(filters!=null && filters.length > 0)
		var results = nlapiSearchRecord("transaction","customsearch_non_drop_ship_pu_transfers",filters);
	else
		var results = nlapiSearchRecord("transaction","customsearch_non_drop_ship_pu_transfers");
	if(results)
	{
		for(var x=0; x < results.length; x++)
		{
			var found = false;
			
			for(var i=0; i < transfers.length; i++)
			{
				if(transfers[i].to_location == results[x].getValue("custbody_pickup_location"))
				{
					transfers[i].lines.push({
						item : results[x].getValue("item"),
						quantity : results[x].getValue("quantityuom"),
						sales_order : results[x].getValue("createdfrom"),
						item_fulfillment : results[x].getId(),
						insurance : results[x].getValue("custcol_full_insurance_value","appliedtotransaction"),
						category : results[x].getValue("custitem20","item")
					});
					
					found = true;
					break;
				}
			}
			
			if(!found)
			{
				transfers.push({
					to_location : results[x].getValue("custbody_pickup_location"),
					lines : [{
						item : results[x].getValue("item"),
						quantity : results[x].getValue("quantityuom"),
						sales_order : results[x].getValue("createdfrom"),
						item_fulfillment : results[x].getId(),
						insurance : results[x].getValue("custcol_full_insurance_value","appliedtotransaction"),
						category : results[x].getValue("custitem20","item")
					}]
				});
			}	
		}
		
		nlapiLogExecution("debug","Transfers JSON",JSON.stringify(transfers));
		
		for(var x=0; x < transfers.length; x++)
		{
			var transferOrder = nlapiCreateRecord("transferorder");
			transferOrder.setFieldValue("location","2");
			transferOrder.setFieldValue("memo","Satellite Pick-Up Transfer Order");
			
			var puLocation = transfers[x].to_location;
			
			var filters1 = [];
			filters1.push(new nlobjSearchFilter("custrecord_pick_up_location_link",null,"is",puLocation));
			var results1 = nlapiSearchRecord("location",null,filters1);
			if(results1)
			{
				transferOrder.setFieldValue("transferlocation",results1[0].getId());
			}
			
			var insurance = 0.00;
			
			for(var i=0; i < transfers[x].lines.length; i++)
			{
				transferOrder.selectNewLineItem("item");
				transferOrder.setCurrentLineItemValue("item","item",transfers[x].lines[i].item);
				transferOrder.setCurrentLineItemValue("item","quantity",transfers[x].lines[i].quantity);
				transferOrder.setCurrentLineItemValue("item","custcol38",transfers[x].lines[i].sales_order);
				transferOrder.setCurrentLineItemValue("item","custcol_linked_item_fulfillment",transfers[x].lines[i].item_fulfillment);
				transferOrder.setCurrentLineItemValue("item","custcol_full_insurance_value",transfers[x].lines[i].insurance);
				transferOrder.commitLineItem("item");
				
				if(transfers[x].lines[i].insurance!=null && transfers[x].lines[i].insurance!='')
				{
					var category = transfers[x].lines[i].category;
					if(category!="7" && category!="8" && category!="14" && category!="15" && category!="18" && category!="20" && category!="21" && category!="31")
						insurance += parseFloat(transfers[x].lines[i].insurance);
				}
					
			}
			
			transferOrder.setFieldValue("custbody_insurance_total",insurance);
			
			var toId = nlapiSubmitRecord(transferOrder,true,true);
			
			//Auto fulfill transfer order to Shipped and Completed
			var fulfillment = nlapiTransformRecord("transferorder",toId,"itemfulfillment");
			fulfillment.setFieldValue("shipstatus","C");
			var fulfillmentId = nlapiSubmitRecord(fulfillment,true,true);
		}
	}
}
