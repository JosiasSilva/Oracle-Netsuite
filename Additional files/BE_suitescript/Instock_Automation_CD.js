nlapiLogExecution("audit","FLOStart",new Date().getTime());
var SORec = null;
var itemSize;
var instock = false;

function Instock_Automation_CD(type)
{
	if(type=="create")
	{
		try
		{
			var deposit = nlapiGetNewRecord();
			var order = deposit.getFieldValue("salesorder");
			
			if(order!=null && order!="")
			{
				var orderFields = nlapiLookupField("salesorder",order,["custbody_in_stock_automation_order","total"]);
				if(orderFields.custbody_in_stock_automation_order==null || orderFields.custbody_in_stock_automation_order=="" || orderFields.custbody_in_stock_automation_order=="F")
				{
					var deposits = 0.00;
	
					var filters = [];
					filters.push(new nlobjSearchFilter("salesorder",null,"is",order));
					var cols = [];
					cols.push(new nlobjSearchColumn("amount",null,"sum"));
					var results = nlapiSearchRecord("customerdeposit",null,filters,cols);
					if(results)
					{
						deposits = results[0].getValue("amount",null,"sum");
						if(deposits==null || deposits=="")
							deposits = 0.00;
						else
							deposits = parseFloat(deposits);
					}
					
					if(deposits < parseFloat(orderFields.total) * 0.50)
						return false;
						
					var SO_Id = order;
					var SO_Type = "salesorder";
					var SO = nlapiLoadRecord("salesorder",order);
					var backstockFound = false;
					
					// item sublist
					var itemCount = SO.getLineItemCount("item");
					nlapiLogExecution('DEBUG', 'itemCount:', itemCount);
					
					for (var i = 1; i <= itemCount; i++)
					{
						// Get Description and Item Internal ID
						var description = SO.getLineItemValue('item', 'description', i);
						var itemType = SO.getLineItemValue('item', 'itemtype', i);
						var itemId = SO.getLineItemValue('item', 'item', i);
						
						if(itemType!="InvtPart")
							continue;
		
						var invertoryLocation = SO.getLineItemText('item','location', i);
						// nlapiLogExecution('DEBUG','invertoryLocation:',invertoryLocation);
						
						// Description contains ETERNITY
						if(containEternity(description) && getSameSizeItem(itemId))
						{
							//nlapiLogExecution('DEBUG', 'description:', description);
							//addFieldUnderWOPB();
						}
						else if(invertoryLocation == "San Francisco")
						{
							var category = SO.getLineItemText('item','custcol_category', i);
							nlapiLogExecution('DEBUG', 'category:', category);
							if(category == "Setting with large center stone"|| category == "Ring with no large center stone")
							{
								var stockDetails = getItemSize(itemId);
								
								if(stockDetails.inStockAvailable==true && instockCriteria(SO)==true)
								{
									instock = true;
									
									if(SORec==null)
										SORec = SO;
									
									SORec.setFieldValue("custbody_in_stock_automation_order","T");
									
									//Modify original line
									SORec.selectLineItem("item",i);
									SORec.setCurrentLineItemValue("item","item",SORec.getFieldValue("custbody_pot_backstock_ring_match_item"));
									var newDescription = SORec.getCurrentLineItemValue("item","description"); 
									SORec.setCurrentLineItemValue("item","description",description);
									SORec.setCurrentLineItemValue("item","createpo","");
									SORec.setCurrentLineItemValue("item","location",stockDetails.inStockLocation);
									SORec.setCurrentLineItemValue("item","custcol5","Using in stock ring size " + stockDetails.inStockSize);
									SORec.commitLineItem("item");
									
									//Add resize ring line
									SORec.selectNewLineItem("item");
									SORec.setCurrentLineItemValue("item","item","1093360");
									SORec.setCurrentLineItemValue("item","description","");
									SORec.setCurrentLineItemValue("item","rate","0.00");
									SORec.setCurrentLineItemValue("item","amount","0.00");
									SORec.setCurrentLineItemValue("item","custcol5","Resize " + stockDetails.inStockDesc + " to size of " + itemSize);
									SORec.setCurrentLineItemValue("item","custcol_in_stock_item",stockDetails.inStockItem);
									
									switch(stockDetails.inStockLocation)
									{
										case "1": //BE Fulfillment-CH
											SORec.setCurrentLineItemValue("item","povendor","153");
											break;
										case "11": //BE Fulfillment-HR
											SORec.setCurrentLineItemValue("item","povendor","1223843");
											break;
										case "12": //BE Fulfillment-JC
											SORec.setCurrentLineItemValue("item","povendor","2125730");
											break;
										case "9": //BE Fulfillment-MW
											SORec.setCurrentLineItemValue("item","povendor","442500");
											break;
										case "6": //BE Fulfillment-NY
											SORec.setCurrentLineItemValue("item","povendor","7773");
											break;
										case "8": //BE Fulfillment-TD
											SORec.setCurrentLineItemValue("item","povendor","46063");
											break;
									}
									SORec.setCurrentLineItemValue("item","createpo","SpecOrd");
									SORec.commitLineItem("item");
									
									//Remove Melee Items
									for(var x=0; x < SORec.getLineItemCount("item"); x++)
									{
										if(SORec.getLineItemValue("item","custcol_category",x+1)=="1" || SORec.getLineItemValue("item","custcol_category",x+1)=="23" || SORec.getLineItemValue("item","custcol_category",x+1)=="30")
										{
											SORec.removeLineItem("item",x+1);
											x--;
										}
									}
									
									//SORec.setFieldValue("orderstatus","B"); //Automatically approve sales order
									nlapiLogExecution("debug","Setting orderstatus to 'B'");
								}
							}
						}
					}
					
					//New In Stock Automation Logic
					nlapiLogExecution("debug","inStockFound",stockDetails.inStockAvailable);
					
					if(SORec!=null)
					{
						var soID = nlapiSubmitRecord(SORec,true,true);
						
						if(instock==true)
						{
							var order = nlapiLoadRecord("salesorder",soID);
							order.setFieldValue("orderstatus","B");
							soID = nlapiSubmitRecord(order,true,true);
						}
						
						//Handle PO
						var filters = [];
						filters.push(new nlobjSearchFilter("internalid",null,"is",soID));
						filters.push(new nlobjSearchFilter("item",null,"is","1093360"));
						filters.push(new nlobjSearchFilter("custbody_in_stock_automation_order",null,"is","T"));
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
						var cols = [];
						cols.push(new nlobjSearchColumn("purchaseorder"));
						cols.push(new nlobjSearchColumn("custcol5"));
						var results = nlapiSearchRecord("salesorder",null,filters,cols);
						if(results)
						{
							var po = nlapiLoadRecord("purchaseorder",results[0].getValue("purchaseorder"));
		
							//custbody59 equal {today} + 4 business days
							var today = new Date();
							switch(today.getDay())
							{
								case 0: //Sunday
								case 1: //Monday
									po.setFieldValue("custbody59",nlapiDateToString(nlapiAddDays(today,4),"date"));
									break;
								case 2: //Tuesday
								case 3: //Wednesday
								case 4: //Thursday
								case 5: //Friday
									po.setFieldValue("custbody59",nlapiDateToString(nlapiAddDays(today,6),"date"));
									break;
								case 6: //Saturday
									po.setFieldValue("custbody59",nlapiDateToString(nlapiAddDays(today,5),"date"));
									break;
							}
							
							var poDescription = results[0].getValue("custcol5").substring(7,results[0].getValue("custcol5").indexOf(",") + 1);
							poDescription += " Resize to ";
							poDescription += results[0].getValue("custcol5").substr(results[0].getValue("custcol5").lastIndexOf(" "));
							
							//po.setLineItemValue("item","description","1",results[0].getValue("custcol5"));
							po.setLineItemValue("item","description","1",poDescription);
							po.setLineItemValue("item","custcol5","1",poDescription);
							
							//Set Resize Ring description to comments from SO line item
							var soRec = nlapiLoadRecord("salesorder",soID);
		
							for(var x=0; x < soRec.getLineItemCount("item"); x++)
							{
								if(soRec.getLineItemValue("item","item",x+1) == po.getLineItemValue("item","custcol_in_stock_item","1"));
								{
									po.setLineItemValue("item","custcol_full_insurance_value","1",soRec.getLineItemValue("item","custcol_full_insurance_value",x+1));
									break;
								}
							}
							
							nlapiSubmitRecord(po,true,true);
							
						}
					}
					
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Running In Stock Automation","Details: " + err.message);
		}
	}
}

function getQuantityAvailable(item) {
	
	var filters = [];
	filters.push(new nlobjSearchFilter("internalid",null,"is",item));
	filters.push(new nlobjSearchFilter("inventorylocation",null,"is","2")); //San Francisco
	filters.push(new nlobjSearchFilter("locationquantityavailable",null,"greaterthan","0"));
	var results = nlapiSearchRecord("item",null,filters);
	if(results)
	{
		//if results, there is stock, return true
		return true;
	}
	else
	{
		return false;
	}
}

function get_size(item) {
	var size = nlapiLookupField('item',item,'custitem2',true);
	return size;
}

function containEternity(description) {
	var regex = /ETERNITY/i;
	return regex.test(description);
}

function getItemSize(item) {
	var rtnObj = {
		backStockAvailable : false,
		inStockAvailable : false,
		backStockItem : null,
		inStockItem : null,
		inStockLocation : null,
		inStockDesc : "",
		inStockSize : ""
	};
	
	var n = 0;
	var arr = [];
	var f = 0;
	var nameSize = [];
	var name_size = [];
	
	var item_flds_txt = nlapiLookupField('item',item,['custitem2','parent'],true);
	
	itemSize = parseFloat(item_flds_txt.custitem2);
	nlapiLogExecution('DEBUG', 'itemSize:', itemSize);
	
	var name = nlapiLookupField('item',item,'itemid');
	var regex = /^(.*?-S)(\d+)$/;
	var sname = name.replace(regex, "$1");
	nlapiLogExecution('DEBUG', 'sname:', sname);
	
	var parentItems = item_flds_txt.parent;
	nlapiLogExecution('DEBUG', 'parentItems:', parentItems);
	
	var filter = [];
	filter.push(new nlobjSearchFilter("itemid", null, "is", parentItems));
	var cols = [];
	cols.push(new nlobjSearchColumn("custitem2"));
	var result = nlapiSearchRecord("inventoryitem", null, filter, cols);
	if (result) {
		for (var i = 0; i < result.length; i++) {
			var id = result[0].getId();
			var type = result[0].getRecordType();
			var size = [];
			size = result[0].getText('custitem2');
			for (var k = 0; k < size.length; k++) {
				// nlapiLogExecution('DEBUG','size:',size[k]);
				if (parseFloat(size[k]) >= (itemSize - 1.5) && parseFloat(size[k]) <= (itemSize + 1.5)) {
					// nlapiLogExecution('DEBUG','itemSize:',itemSize);
					arr[f++] = size[k];
					// nlapiLogExecution('DEBUG','arr:',arr[f++]);
				}
			}
		}
	}
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].indexOf(".") != -1) {
			var name = arr[i].split(".");
			nameSize[n++] = name[0] + name[1];
			// nlapiLogExecution('DEBUG','nameSize:',nameSize[n++]);
		} else {
			nameSize[n++] = arr[i];
			// nlapiLogExecution('DEBUG','nameSize:',nameSize[n++]);
		}
	}
	for (var x = 0; x < nameSize.length; x++) {
		name_size[x] = sname + nameSize[x];
		// nlapiLogExecution('DEBUG','name_size:',name_size[x]);
	}
	for (var m = 0; m < name_size.length; m++) {
		var filter1 = [];
		filter1.push(new nlobjSearchFilter("itemid", null, "is", name_size[m]));
		filter1.push(new nlobjSearchFilter("inventorylocation", null, "is", "2"));
		filter1.push(new nlobjSearchFilter("locationquantityavailable", null, "greaterthan", 0));
		var result1 = nlapiSearchRecord("inventoryitem", null, filter1);
		if (result1) {
			for (var x = 0; x < result1.length; x++) {
				var id = result1[x].getId();
					nlapiLogExecution('DEBUG', 'id:', id);
					//addFieldUnderWOPB();
					//displayItem(id);
					
					rtnObj.backStockAvailable = true;
					rtnObj.backStockItem = id;
				break;
			}
			
			break;
		}
	}
	
	for (var m = 0; m < name_size.length; m++) {
		var filter1 = [];
		filter1.push(new nlobjSearchFilter("itemid", null, "is", name_size[m]));
		//filter1.push(new nlobjSearchFilter("inventorylocation", null, "noneof", ["2","7","13","4","3","10"]));
		filter1.push(new nlobjSearchFilter("namenohierarchy", "inventorylocation", "startswith", "BE Fulfillment"));
		filter1.push(new nlobjSearchFilter("locationquantityavailable", null, "greaterthan", 0));
		var filterExp = [
			["itemid","is",name_size[m]],
			"AND",
			["inventorylocation.namenohierarchy","startswith","BE Fulfillment"],
			"AND",
			["locationquantityavailable","greaterthan","0"],
			"AND",
			[
				["itemid","startswith","BE2PD25R25-18KW"],
				"OR",
				["itemid","startswith","BE2PD25R25-PT"],
				"OR",
				["itemid","startswith","BE210-18KW"],
				"OR",
				["itemid","startswith","BE210-PT"],
				"OR",
				["itemid","startswith","BE266-18KW"],
				"OR",
				["itemid","startswith","BE266-PT"]
			]
		];
		var cols1 = [];
		cols1.push(new nlobjSearchColumn("inventorylocation"));
		cols1.push(new nlobjSearchColumn("description"));
		cols1.push(new nlobjSearchColumn("custitem2"));
		var result1 = nlapiSearchRecord("inventoryitem", null, filterExp, cols1);
		if (result1) {
			for (var x = 0; x < result1.length; x++) {
				var id = result1[x].getId();
					nlapiLogExecution('DEBUG', 'id:', id);
					
					rtnObj.inStockAvailable = true;
					rtnObj.inStockItem = id;
					rtnObj.inStockLocation = result1[x].getValue("inventorylocation");
					rtnObj.inStockDesc = result1[x].getValue("description");
					rtnObj.inStockSize = result1[x].getText("custitem2");
				break;
			}
			
			break;
		}
	}
	
	return rtnObj;
}
function addFieldUnderWOPB() {
	if(SORec==null)
		SORec = nlapiLoadRecord("salesorder",nlapiGetRecordId());
	SORec.setFieldValue("custbody_pot_backstock_ring_match","T");
}
function getSameSizeItem(item) {
	return getQuantityAvailable(item);
}
function displayItem(id) {
	if(SORec==null)
		SORec = nlapiLoadRecord("salesorder",nlapiGetRecordId());
	SORec.setFieldValue("custbody_pot_backstock_ring_match_item",id);
}

function instockCriteria(order) {
	//Status = Pending Approval
	nlapiLogExecution("debug","Status",order.getFieldValue("orderstatus"));
	if(order.getFieldValue("orderstatus")!="A")
		return false;
	
	//Type of Order = New Order
	//nlapiLogExecution("debug","Type of Order",order.getFieldValue("custbody87"));
	//if(order.getFieldValue("custbody87")!="1")
	//	return false;
	nlapiLogExecution("debug","Order #",order.getFieldValue("tranid"));
	if(/[a-zA-z]/.test(order.getFieldValue("tranid")))
	{
		return false;
	}
	
	//Place of Sales != Telephone Order, Bank Wire, or Decline
	nlapiLogExecution("debug","Place of Sale",order.getFieldValue("class"));
	//if(order.getFieldValue("class")=="7" || order.getFieldValue("class")=="6" || order.getFieldValue("class")=="14")
	//	return false;

	//custbody152 is empty
	nlapiLogExecution("debug","custbody152",order.getFieldValue("custbody152"));
	if(order.getFieldValue("custbody152")!=null && order.getFieldValue("custbody152")!="")
		return false;
	
	//Order does not contain an engagement ring
	for(var x=0; x < order.getLineItemCount("item"); x++)
	{
		if(order.getLineItemValue("item","custcol_category",x+1)=="2")
		{
			nlapiLogExecution("debug","Item Category == Engagement Ring",order.getLineItemValue("item","custcol_category",x+1));
			return false;
		}
	}
	
	//custbody228 is none of Yellow Gold, Fraud
	var custbody228 = order.getFieldValues("custbody228");
	nlapiLogExecution("debug","custbody228",custbody228);
	if(custbody228!=null && custbody228!="")
	{
		for(var x=0; x < custbody228.length; x++)
		{
			if(custbody228[x]=="1" || custbody228[x]=="4")
				return false;
		}
	}
	
	nlapiLogExecution("debug","In Stock Check Should Return TRUE...");
	return true;
}
