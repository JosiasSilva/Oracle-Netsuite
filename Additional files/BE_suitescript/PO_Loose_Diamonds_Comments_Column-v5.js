/*
 * Script Type: User Event
 * Event: After Submit
 * Record: Purchase Order
 * 
 * Units: 90
 * 
 * Created On: March 30, 2011
 * Created By: Travis Buffington - NetSuite/IT Consultant
 * 
 * Description: Sets Comments column on PO line item for corresponding Loose Diamond/Sapphire item on 
 *    Sales Order. Item on PO must be category Setting with large center stone for script to execute.
 *    Script will execute on creation of a PO directly or via special order event type.
 */

function setPOCommentsCol(type)
{
	if(type=="create" || type=="specialorder")
	{
		nlapiLogExecution("debug", "Begin Script", "PO Loose Diamonds script has started.")
		try
		{
			//Get Purchase Order ID
			var purchaseOrder = nlapiGetRecordId()
			
			//Get Sales Order ID (if present)
			var poLookup  = new Array()
			poLookup.push("createdfrom")
			poLookup.push("mainname")
			
			var poFields = nlapiLookupField("purchaseorder", purchaseOrder, poLookup)
			var salesOrder = poFields["createdfrom"]
			var vendorID = poFields["mainname"]
			
			//Check to see if PO is to GM Casting House Inc (153) or Unique New York (7773) or Miracleworks (442500)
			if(vendorID!=153 && vendorID!=7773 && vendorID!=442500)
				return true
			
			nlapiLogExecution("debug", "Sales Order ID", salesOrder)
			
			//Exit script if no Sales Order is tied to the PO
			if(salesOrder==null || salesOrder=="")
				return true
		}
		catch(err)
		{
			nlapiLogExecution("error", "PO Loose Diamonds Comments Script Error", "Error while retrieving purchase order and sales order IDs. Details: " + err.message)
			return true
		}
		
		try
		{
			//Search PO for Item with category Setting with large center stone
			var hasDiamond = false
			var poLineID = null
			var soLineID = null
			
			var filters = new Array()
			filters[0] = new nlobjSearchFilter("internalid", null, "is", purchaseOrder)
			filters[1] = new nlobjSearchFilter("mainline", null, "is", "F")
			
			var cols = new Array()
			cols[0] = new nlobjSearchColumn("item") //Item Internal ID
			cols[1] = new nlobjSearchColumn("custitem20", "item") //Category (custom)
			cols[2] = new nlobjSearchColumn("line") //Line ID of Line Item
			//cols[3] = new nlobjSearchColumn("line", "createdfrom") //Line ID of Line Item on Sales Order
			
			var results = nlapiSearchRecord("purchaseorder", null, filters, cols)
			if(results!=null)
			{
				for(var x=0; x < results.length; x++)
				{
					//Check to see if Category = Setting with large center stone (ID=2)
					if(results[x].getValue("custitem20", "item")=="2" && results[x].getText("item")!="Custom Engagement Ring" && results[x].getText("item")!="Custom Wedding Ring")
					{
						hasDiamond = true
						poLineID = results[x].getValue("line")
						soLineItem = results[x].getValue("item")
						nlapiLogExecution("debug", "Sales Order Line ID", soLineID)
					}
				}
			}
			else
			{
				//No results = no line items
				//Exit script
				nlapiLogExecution("debug", "Exit Script", "Exitting script because PO search results found.")
				return true
			}
			
			if(hasDiamond==false)
			{
				//If the PO doesn't have a item with category Setting with large center stone then exit the script
				nlapiLogExecution("debug", "Exit Script", "Exitting script because no there is no diamond.")
				return true
			}
		}
		catch(err)
		{
			nlapiLogExecution("error", "PO Loose Diamonds Comments Script Error", "Error determining whether PO contains an item with category Setting with large center stone. Details: " + err.message)
			return true
		}
		
		try
		{
			//Search Sales Order for item Loose Diamond/Sapphire and collect information
			var filters = new Array()
			filters[0] = new nlobjSearchFilter("internalid", null, "is", salesOrder)
			filters[1] = new nlobjSearchFilter("mainline", null, "is", "F")
			//Filter Item Category = Loose Diamond (7) OR Loose Sapphire (8)
			filters[2] = new nlobjSearchFilter("custitem20", "item", "anyof", [7,8])
			filters[3] = new nlobjSearchFilter("ispreferredvendor", "item", "is", "T")
			
			var cols = new Array()
			cols[0] = new nlobjSearchColumn("vendorcost", "item") //Purchase Price
			cols[1] = new nlobjSearchColumn("vendor", "item") //Vendor (currently pulls from item's preferred vendor)
			cols[2] = new nlobjSearchColumn("custitem30", "item") //Measurement
			cols[3] = new nlobjSearchColumn("purchasedescription", "item") //Purchase Description
			cols[4] = new nlobjSearchColumn("custcol16") //Certificate Number
			cols[5] = new nlobjSearchColumn("custitem20", "item") //Item: Category
			cols[6] = new nlobjSearchColumn("item")
			//cols[5] = new nlobjSearchColumn("") //Date Rx By
			
			
			var results = nlapiSearchRecord("salesorder", null, filters, cols)
			if(results!=null)
			{
				//SO PO RATE FIELD POPULATED **AFTER PO IS CREATED**
				var purchasePrice = results[0].getValue("vendorcost", "item")
				var vendor = results[0].getText("vendor", "item")
				var measurement = results[0].getValue("custitem30", "item")
				if(measurement!="" && measurement!=null)
					measurement += "mm"
				var purchaseDescription = results[0].getValue("purchasedescription", "item")
				var certificateNumber = results[0].getValue("custcol16")
				var itemCategory = results[0].getValue("custitem20", "item")
				var itemNameText = results[0].getText("item")
				//var dateRxBy = results[0].getValue("")
			}
			else
			{
				//No item with category Loose Diamond/Loose Sapphire is on the SO then exit the script
				nlapiLogExecution("debug", "Exit Script", "Exitting script because no SO search results.")
				return true
			}
		}
		catch(err)
		{
			nlapiLogExecution("error", "PO Loose Diamonds Comments Script Error", "Error collecting SO information from item where category is Loose Diamond/Sapphire. Details: " + err.message)
			return true
		}
		
		try
		{
			//Build string to put in Comments column
			var commentsStr = ""
			if(itemCategory==7) 
			{
				//Diamonds
				commentsStr += "Set with:\n"
				commentsStr += "- Dia stock # " + purchaseDescription + "\n\n"
				commentsStr += "- Insurance value: $" + purchasePrice + "\n\n"
				commentsStr += "- Cert # " + certificateNumber + "\n\n"
				commentsStr += "Arriving from " + vendor + "\n"
			}
			else if(itemCategory==8)
			{
				//Sapphires and other gems
				commentsStr += "Set with:\n"
				commentsStr += "- Stock # " + itemNameText + "\n"
				commentsStr += "- Description " + purchaseDescription + "\n"
				commentsStr += "- Insurance value: $" + purchasePrice + "\n"
				
				//Calculate next business day
				var currentDate = new Date()
				var nextBusinessDay = new Date()
				switch(currentDate.getDay())
				{
					case 0:
					case 1:
					case 2:
					case 3:
					case 4:
						//Sunday - Thursday
						nextBusinessDay.setDate(currentDate.getDate()+1);
						break;
					case 5:
						//Friday
						nextBusinessDay.setDate(currentDate.getDate()+3);
						break;
					case 6:
						//Saturday
						nextBusinessDay.setDate(currentDate.getDate()+2);
						break;
				}				
				commentsStr += "Arriving from SF on " + (nextBusinessDay.getMonth()+1) + "/" + nextBusinessDay.getDate() + "/" + nextBusinessDay.getFullYear() + "\n"
			}
		}
		catch(err)
		{
			nlapiLogExecution("error", "PO Loose Diamonds Comments Script Error", "Error creating Comments column string. Details: " + err.message)
			return true
		}
		
		try
		{
			//Set Comments Field on Purchase Order and Sales Order
			var currentComments = ""
			
			//PURCHASE ORDER
			var poRec = nlapiLoadRecord("purchaseorder", purchaseOrder)
			for(var x=0; x < poRec.getLineItemCount("item"); x++)
			{
				if(poRec.getLineItemValue("item", "line", x+1)==poLineID)
				{
					currentComments = poRec.getLineItemValue("item","custcol5",x+1)
					if(currentComments!="" && currentComments!=null)
						commentsStr = currentComments + "\n\n" + commentsStr
					poRec.setLineItemValue("item", "custcol5", x+1, commentsStr)
					nlapiSubmitRecord(poRec, false, true)
					break
				}
			}
			
			var currentComments = ""
			//SALES ORDER
			var soRec = nlapiLoadRecord("salesorder", salesOrder)
			for(var x=0; x < soRec.getLineItemCount("item"); x++)
			{
				if(soRec.getLineItemValue("item", "item", x+1)==soLineItem)
				{
					currentComments = soRec.getLineItemValue("item","custcol5",x+1)
					if(currentComments!="" && currentComments!=null)
						commentsStr = currentComments + "\n\n" + commentsStr
					soRec.setLineItemValue("item", "custcol5", x+1, commentsStr)
					nlapiSubmitRecord(soRec, false, true)
					break
				}
			}
			
		}
		catch(err)
		{
			nlapiLogExecution("error", "PO Loose Diamonds Comments Script Error", "Error setting Comments column on Sales Order and Purchase Order. Details: " + err.message)
			return true
		}
	}
}
