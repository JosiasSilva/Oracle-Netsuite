/*
	Script Type: User Event
	Event: After Submit
	Units: 40
	Created On: 12/29/2010
	Description: Set locations of melee items on sales order to Purchase Order location.
*/


function Melee_Inv_Location(type)
{
	if(type=="create" || type=="specialorder")
	{
		try{
			//Get Purchase Order Internal ID
			var internalid = nlapiGetRecordId()
		}
		catch(err){
			nlapiLogExecution("error", "Melee Inv Loc Error", "Error retrieving Purchase Order Internal ID. Details: " + err.message)
			return true
		}
		
		try{
			//Execute Purchase Order search to find line items and item side stones
			var PO_Item
			
			var filter = new nlobjSearchFilter("internalid", null, "is", internalid)
			var results = nlapiSearchRecord("transaction", "customsearch_melee_inventory_locations", filter)
			if(results!=null)
			{
				PO_Item = new Array()
				for(var x=0; x < results.length; x++)
				{
					PO_Item[x] = new Array()
					PO_Item[x]["vendor"] = results[x].getValue("mainname") //Main Line Name - Vendor Internal ID
					PO_Item[x]["item"] = results[x].getValue("item")
					PO_Item[x]["line"] = results[x].getValue("line")
					PO_Item[x]["sales_order"] = results[x].getValue("appliedtotransaction")
					PO_Item[x]["sales_order_item"] = results[x].getValue("item", "appliedtotransaction")
					PO_Item[x]["sales_order_line"] = results[x].getValue("line", "appliedtotransaction")
					
					//Get values for side stones (melee)
					PO_Item[x]["item_subitem_1"] = results[x].getValue("custitem9", "item")
					PO_Item[x]["item_subitem_2"] = results[x].getValue("custitem11", "item")
					PO_Item[x]["item_subitem_3"] = results[x].getValue("custitem13", "item")
					PO_Item[x]["item_subitem_4"] = results[x].getValue("custitem94", "item")
					PO_Item[x]["item_subitem_5"] = results[x].getValue("custitem_sub_item_5", "item")
					PO_Item[x]["item_subitem_6"] = results[x].getValue("custitem_sub_item_6", "item")
					PO_Item[x]["item_subitem_7"] = results[x].getValue("custitem_sub_item_7", "item")
					PO_Item[x]["item_quantity_1"] = results[x].getValue("custitem8", "item")
					PO_Item[x]["item_quantity_2"] = results[x].getValue("custitem10", "item")
					PO_Item[x]["item_quantity_3"] = results[x].getValue("custitem12", "item")
					PO_Item[x]["item_quantity_4"] = results[x].getValue("custitem95", "item")
					PO_Item[x]["item_quantity_5"] = results[x].getValue("custitem_quantity_5", "item")
					PO_Item[x]["item_quantity_6"] = results[x].getValue("custitem_quantity_6", "item")
					PO_Item[x]["item_quantity_7"] = results[x].getValue("custitem_quantity_7", "item")
				}	
			}
			else
			{
				//If no corresponding PO is found then exit out of the script
				return true;
			}
		}
		catch(err){
			nlapiLogExecution("error", "Melee Inv Loc Error", "Error retrieving Purchase Order information from saved search customsearch_melee_inventory_locations. Details: " + err.message)
			return true
		}
		
		try{
			if(PO_Item!=null)
			{
				//Determine Vendor Location To Assign To Line Items
				var location = null
				//nlapiLogExecution("error", "DEBUG", "Vendor ID: " + PO_Item[0]["vendor"])
				switch(PO_Item[0]["vendor"].toString())
				{
					case "153":
						location = 1; //BE Fulfillment-CH
						break;
					case "7773":
						location = 6; //BE Fulfillment-NY
						break;
					case "442500":
						location = 9; //BE Fulfillment-MW
						break;
					default:
						location = 2; //San Francisco
						break;
				}
					
				//Load associated Sales Order
				var order = nlapiLoadRecord("salesorder", PO_Item[0]["sales_order"])
				
				//Loop through each of the line items on the Purchase Order
				for(var i=0; i < PO_Item.length; i++)
				{
					//Side Stone 1
					if(IsEmpty(PO_Item[i]["item_subitem_1"])!="" && IsEmpty(PO_Item[i]["item_quantity_1"])!="")
					{
						for(var x=1; x <= order.getLineItemCount("item"); x++)
						{
							if(order.getLineItemValue("item", "item", x) == PO_Item[i]["item_subitem_1"] && order.getLineItemValue("item", "quantity", x) == PO_Item[i]["item_quantity_1"])
							{
								switch(PO_Item[i]["item_subitem_1"])
								{
									case "1888": //D3.5PRFGSI
									case "1883": //D3.0RDFGSI1
									case "1885": //D3.5RDFGSI1
									case "1886": //D3.8RDFGSI
									case "3252": //D4.0RDGHSI
									case "15052": //D4.2RDFGSI
									case "19115": //D4x2TBFGSI1
									case "17149": //EMCO3.5EM3
									case "3256": //SBAU4.0RD3
									case "29389": //SBSL4.0RD2
									case "30689": //SBSL4.0PC3
										//Set location of side stone line item to San Francisco
										order.setLineItemValue("item", "location", x, 2)
										break;
									default:
										//Set location of side stone line item to Purchase Order location
										order.setLineItemValue("item", "location", x, location)
										break;
								}
							}
						}
					}
					
					//Side Stone 2
					if(IsEmpty(PO_Item[i]["item_subitem_2"])!="" && IsEmpty(PO_Item[i]["item_quantity_2"])!="")
					{
						for(var x=1; x <= order.getLineItemCount("item"); x++)
						{
							if(order.getLineItemValue("item", "item", x) == PO_Item[i]["item_subitem_2"] && order.getLineItemValue("item", "quantity", x) == PO_Item[i]["item_quantity_2"])
							{
								switch(PO_Item[i]["item_subitem_2"])
								{
									case "1888": //D3.5PRFGSI
									case "1883": //D3.0RDFGSI1
									case "1885": //D3.5RDFGSI1
									case "1886": //D3.8RDFGSI
									case "3252": //D4.0RDGHSI
									case "15052": //D4.2RDFGSI
									case "19115": //D4x2TBFGSI1
									case "17149": //EMCO3.5EM3
									case "3256": //SBAU4.0RD3
									case "29389": //SBSL4.0RD2
									case "30689": //SBSL4.0PC3
										//Set location of side stone line item to San Francisco
										order.setLineItemValue("item", "location", x, 2)
										break;
									default:
										//Set location of side stone line item to Purchase Order location
										order.setLineItemValue("item", "location", x, location)
										break;
								}
							}
						}
					}
					
					//Side Stone 3
					if(IsEmpty(PO_Item[i]["item_subitem_3"])!="" && IsEmpty(PO_Item[i]["item_quantity_3"])!="")
					{
						for(var x=1; x <= order.getLineItemCount("item"); x++)
						{
							if(order.getLineItemValue("item", "item", x) == PO_Item[i]["item_subitem_3"] && order.getLineItemValue("item", "quantity", x) == PO_Item[i]["item_quantity_3"])
							{
								switch(PO_Item[i]["item_subitem_3"])
								{
									case "1888": //D3.5PRFGSI
									case "1883": //D3.0RDFGSI1
									case "1885": //D3.5RDFGSI1
									case "1886": //D3.8RDFGSI
									case "3252": //D4.0RDGHSI
									case "15052": //D4.2RDFGSI
									case "19115": //D4x2TBFGSI1
									case "17149": //EMCO3.5EM3
									case "3256": //SBAU4.0RD3
									case "29389": //SBSL4.0RD2
									case "30689": //SBSL4.0PC3
										//Set location of side stone line item to San Francisco
										order.setLineItemValue("item", "location", x, 2)
										break;
									default:
										//Set location of side stone line item to Purchase Order location
										order.setLineItemValue("item", "location", x, location)
										break;
								}
							}
						}
					}
					
					//Side Stone 4
					if(IsEmpty(PO_Item[i]["item_subitem_4"])!="" && IsEmpty(PO_Item[i]["item_quantity_4"])!="")
					{
						for(var x=1; x <= order.getLineItemCount("item"); x++)
						{
							if(order.getLineItemValue("item", "item", x) == PO_Item[i]["item_subitem_4"] && order.getLineItemValue("item", "quantity", x) == PO_Item[i]["item_quantity_4"])
							{
								switch(PO_Item[i]["item_subitem_4"])
								{
									case "1888": //D3.5PRFGSI
									case "1883": //D3.0RDFGSI1
									case "1885": //D3.5RDFGSI1
									case "1886": //D3.8RDFGSI
									case "3252": //D4.0RDGHSI
									case "15052": //D4.2RDFGSI
									case "19115": //D4x2TBFGSI1
									case "17149": //EMCO3.5EM3
									case "3256": //SBAU4.0RD3
									case "29389": //SBSL4.0RD2
									case "30689": //SBSL4.0PC3
										//Set location of side stone line item to San Francisco
										order.setLineItemValue("item", "location", x, 2)
										break;
									default:
										//Set location of side stone line item to Purchase Order location
										order.setLineItemValue("item", "location", x, location)
										break;
								}
							}
						}
					}
					
					nlapiLogExecution("debug","Sub Item 5: " + PO_Item[i]["item_subitem_5"],"Quantity 5: " + PO_Item[i]["item_quantity_5"]);
					
					//Side Stone 5
					if(IsEmpty(PO_Item[i]["item_subitem_5"])!="" && IsEmpty(PO_Item[i]["item_quantity_5"])!="")
					{
						for(var x=1; x <= order.getLineItemCount("item"); x++)
						{
							if(order.getLineItemValue("item", "item", x) == PO_Item[i]["item_subitem_5"] && order.getLineItemValue("item", "quantity", x) == PO_Item[i]["item_quantity_5"])
							{
								nlapiLogExecution("debug","Match found for sub-item 5");
								
								switch(PO_Item[i]["item_subitem_5"])
								{
									case "1888": //D3.5PRFGSI
									case "1883": //D3.0RDFGSI1
									case "1885": //D3.5RDFGSI1
									case "1886": //D3.8RDFGSI
									case "3252": //D4.0RDGHSI
									case "15052": //D4.2RDFGSI
									case "19115": //D4x2TBFGSI1
									case "17149": //EMCO3.5EM3
									case "3256": //SBAU4.0RD3
									case "29389": //SBSL4.0RD2
									case "30689": //SBSL4.0PC3
										//Set location of side stone line item to San Francisco
										order.setLineItemValue("item", "location", x, 2)
										break;
									default:
										//Set location of side stone line item to Purchase Order location
										order.setLineItemValue("item", "location", x, location)
										break;
								}
							}
						}
					}
					
					nlapiLogExecution("debug","Sub Item 6: " + PO_Item[i]["item_subitem_6"],"Quantity 6: " + PO_Item[i]["item_quantity_6"]);
					
					//Side Stone 6
					if(IsEmpty(PO_Item[i]["item_subitem_6"])!="" && IsEmpty(PO_Item[i]["item_quantity_6"])!="")
					{
						for(var x=1; x <= order.getLineItemCount("item"); x++)
						{
							if(order.getLineItemValue("item", "item", x) == PO_Item[i]["item_subitem_6"] && order.getLineItemValue("item", "quantity", x) == PO_Item[i]["item_quantity_6"])
							{
								nlapiLogExecution("debug","Match found for sub-item 6");
								
								switch(PO_Item[i]["item_subitem_6"])
								{
									case "1888": //D3.5PRFGSI
									case "1883": //D3.0RDFGSI1
									case "1885": //D3.5RDFGSI1
									case "1886": //D3.8RDFGSI
									case "3252": //D4.0RDGHSI
									case "15052": //D4.2RDFGSI
									case "19115": //D4x2TBFGSI1
									case "17149": //EMCO3.5EM3
									case "3256": //SBAU4.0RD3
									case "29389": //SBSL4.0RD2
									case "30689": //SBSL4.0PC3
										//Set location of side stone line item to San Francisco
										order.setLineItemValue("item", "location", x, 2)
										break;
									default:
										//Set location of side stone line item to Purchase Order location
										order.setLineItemValue("item", "location", x, location)
										break;
								}
							}
						}
					}
					
					nlapiLogExecution("debug","Sub Item 7: " + PO_Item[i]["item_subitem_7"],"Quantity 7: " + PO_Item[i]["item_quantity_7"]);
					
					//Side Stone 7
					if(IsEmpty(PO_Item[i]["item_subitem_7"])!="" && IsEmpty(PO_Item[i]["item_quantity_7"])!="")
					{
						for(var x=1; x <= order.getLineItemCount("item"); x++)
						{
							if(order.getLineItemValue("item", "item", x) == PO_Item[i]["item_subitem_7"] && order.getLineItemValue("item", "quantity", x) == PO_Item[i]["item_quantity_7"])
							{
								nlapiLogExecution("debug","Match found for sub-item 7");
								
								switch(PO_Item[i]["item_subitem_7"])
								{
									case "1888": //D3.5PRFGSI
									case "1883": //D3.0RDFGSI1
									case "1885": //D3.5RDFGSI1
									case "1886": //D3.8RDFGSI
									case "3252": //D4.0RDGHSI
									case "15052": //D4.2RDFGSI
									case "19115": //D4x2TBFGSI1
									case "17149": //EMCO3.5EM3
									case "3256": //SBAU4.0RD3
									case "29389": //SBSL4.0RD2
									case "30689": //SBSL4.0PC3
										//Set location of side stone line item to San Francisco
										order.setLineItemValue("item", "location", x, 2)
										break;
									default:
										//Set location of side stone line item to Purchase Order location
										order.setLineItemValue("item", "location", x, location)
										break;
								}
							}
						}
					}	
				}
				
				//Save sales order
				nlapiSubmitRecord(order, false, true)
			}
		}
		catch(err){
			nlapiLogExecution("error", "Melee Inv Loc Error", "Error setting location for sidestones for an item on Purchase Order Internal ID " + internalid + ". Details: " + err.message)
			return true
		}
	}
}

var comittedMeleeLocation = 3 //Committed Melee

function meleeWithoutPO(type)
{
	if(type=="approve")
	{
		try
		{
			var order = nlapiLoadRecord("salesorder",nlapiGetRecordId())
			
			for(var x=0; x < order.getLineItemCount("item"); x++)
			{
				nlapiLogExecution("debug","PO #",order.getLineItemValue("item","createdpo",x+1))
				nlapiLogExecution("debug","Item Type",order.getLineItemValue("item","itemtype",x+1))
				if(order.getLineItemValue("item","createdpo",x+1)=="" || order.getLineItemValue("item","createdpo",x+1)==null)
				{
					if(order.getLineItemValue("item","itemtype",x+1)=="InvtPart")
					{
						order.setLineItemValue("item","location",x+1,comittedMeleeLocation)
					}
				}
			}
			
			nlapiSubmitRecord(order,false,true)
		}
		catch(err)
		{
			nlapiLogExecution("error","Committed Melee Location Error", "Error setting location for comitted melee (no PO). Details: " + err.message)
			return true
		}
	}
}

//Check value for empty/null and if empty/null return ""
function IsEmpty(value)
{
	if(value==null)
		return ""
	else
		return value
}
