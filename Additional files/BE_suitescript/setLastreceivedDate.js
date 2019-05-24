nlapiLogExecution("audit","FLOStart",new Date().getTime());
//Name: Set Last Received Date
//Type: User Event
//Event: After Submit (Create & Edit)
//Usage: 20 + 10 Per Line Item (Max 98 Line Items)
//Last Modified: 10/29/2010 8:34AM EST

//NOTE: NEED TO DEFINE SPECIFIC ITEM TYPE FOR NLAPISUBMITFIELD FUNCTION

//DEVELOPMENT ACCOUNT
var item_received_date_field = "custitem_last_received_date"

//PRODUCTION ACCOUNT
//var item_received_date_field = "custitem_last_received_date"

function setLastReceivedDate(type)
{
	if(type=="create" || type=="edit"){
		try
		{
			//Get item receipt record ID and load record
			var receiptID = nlapiGetRecordId()
			var receipt = nlapiLoadRecord("itemreceipt", receiptID)
		}
		catch(err)
		{
			nlapiLogExecution("error", "Error Occurred", "An error occurred while loading item receipt record. Details: " + err)
		}
		
		try
		{
			//Get date of item receipt
			var receipt_date = receipt.getFieldValue("trandate")
			var line_item_count = receipt.getLineItemCount("item")
		
			//Loop through line items to retrieve item IDs
			var items = new Array()
			for(var i=0; i < line_item_count; i++)
			{
				items.push(receipt.getLineItemValue("item", "item", i+1))
			}
		}
		catch(err)
		{
			nlapiLogExecution("error", "Error Occurred", "An error occurred while retrieving line item IDs on item receipt ID: " + receiptID + ". Details: " + err)
		}
		
		try
		{
			//GET ITEM DATA
			var filters = new Array()
			filters[0] = new nlobjSearchFilter("internalid", null, "anyof", items)
			
			var cols = new Array()
			cols[0] = new nlobjSearchColumn("internalid")
			cols[1] = new nlobjSearchColumn("type")
			cols[2] = new nlobjSearchColumn("custitem38")
			
			var itemData = new Array()
			var results = nlapiSearchRecord("item", null, filters, cols)
			if(results!=null)
			{
				for(var j=0; j < results.length; j++)
				{
					itemData[j] = new Array()
					itemData[j]["internalid"] = results[j].getId()
					itemData[j]["type"] = results[j].getRecordType()
					itemData[j]["last_received"] = results[j].getValue("custitem38")
				}	
			}
			else
			{
				//Exit out of script if no results found
				return;
			}
		}
		catch(err)
		{
			nlapiLogExecution("debug", "Debug Log", "An error occurred while getting item data from saved search.")
		}
		
		try
		{
			//Set field for last received date on item records. First compare against current date if available
			if(itemData!=null)
			{
				nlapiLogExecution("debug", "DEBUG", "Item Data Is Not Empty")
				for(var x=0; x < itemData.length; x++)
				{
					nlapiLogExecution("debug", "DEBUG", "Checking itemData array index " + x)
					nlapiLogExecution("debug", "DEBUG", "Internal ID" + itemData[x]["internalid"])
					nlapiLogExecution("debug", "DEBUG", "Type " +  itemData[x]["type"])
					if(itemData[x]["type"]=="inventoryitem" && ((itemData[x]["last_receved"]=="" || itemData[x]["last_receved"]==null) || (nlapiStringToDate(itemData[x]["last_receved"]) < nlapiStringToDate(receipt_date))))
						nlapiSubmitField(itemData[x]["type"], itemData[x]["internalid"], "custitem38", receipt_date) 
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error", "Error Occurred", "An error occurred while setting last received date on items. Details: " + err)
		}
	}
}