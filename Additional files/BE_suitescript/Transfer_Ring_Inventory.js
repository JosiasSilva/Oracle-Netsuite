nlapiLogExecution("audit","FLOStart",new Date().getTime());
//var From_Location = 1 //BE Fulfillment-CH
var From_Location = 6 //BE Fulfillment-NY
var To_Location = 2 //San Francisco

function Transfer_Ring_Inventory(type)
{
	if(type=="create")
	{
		try{
			//Get Rings Available At Location
			var rings
			
			var filter = new nlobjSearchFilter("inventorylocation", null, "is", From_Location)
			
			var results = nlapiSearchRecord("item", "customsearch382", filter)
			if(results!=null)
			{
				rings = new Array()
				for(var x=0; x < results.length; x++)
				{
					rings[x] = new Array()
					rings[x]["item"] = results[x].getId()
					rings[x]["availableqty"] = results[x].getValue("locationquantityavailable")
				}
			}
			else
			{
				return
			}
		}
		catch(err){
			nlapiLogExecution("error", "Transfer Ring Inventory Error", "Error getting rings on hand at location. Details: " + err.message)
			return
		}
		
		try{
			//Set Body Fields on Transfer Order
			nlapiSetFieldValue("location", From_Location)
			nlapiSetFieldValue("transferlocation", To_Location)
			nlapiSetFieldValue("memo", "Transfer of ring inventory to San Francisco.")
		}
		catch(err){
			nlapiLogExecution("error", "Transfer Ring Inventory Error", "Error setting body fields on Transfer Orders. Details: " + err.message)
			return
		}
		
		try{
			//Set Transfer Order Line Items
			if(rings!=null)
			{
				for(var x=0; x < rings.length; x++)
				{
					nlapiSelectNewLineItem("item")
					nlapiSetCurrentLineItemValue("item", "item", rings[x]["item"])
					nlapiSetCurrentLineItemValue("item", "quantity", rings[x]["availableqty"])
					nlapiCommitLineItem("item")
				}
			}
		}
		catch(err){
			nlapiLogExecution("error", "Transfer Ring Inventory Error", "Error setting Transfer Order line items. Details: " + err.message)
			return
		}
	}
}
