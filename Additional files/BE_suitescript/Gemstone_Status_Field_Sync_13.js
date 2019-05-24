/*
 * Sync Gemstone Status Fields Between SO and PO
 * 
 * Type: User Event
 * Execution: After Submit (edit and xedit)
 * 
 * Summary: Syncs the Custom Gem Status (custbody172) and Gemstone Status (custbody103) between the SO and PO as edits are made.
 * 
 * Change Log:
 *  - 11/10/2014: Initial script deployment
 *  - 11/26/2014: Add Delivery Date and Delivery Date Firm fields to sync
 *  - 01/27/2015: Add SO Important Notes sync
 *  - 03/13/2015: Add field DD Rush Reason (custbody251) to sync
 */
function Gemstone_Status_Field_Sync(type)
{
	var recid = nlapiGetRecordId();
	var rectype = nlapiGetRecordType();
	
	try
	{
		if(type=="edit" || type=="specialorder")
		{
			if(rectype=="salesorder")
			{
				var order = nlapiGetNewRecord();
				var custom_gem_status = order.getFieldValue("custbody172");
				var gemstone_status = order.getFieldValue("custbody103");
				var delivery_date = order.getFieldValue("custbody6");
				var delivery_date_firm = order.getFieldValue("custbody82");
				var so_important_notes = order.getFieldValue("custbody58");
				var dd_rush_reason = order.getFieldValues("custbody251");
				var pickup_at_be = order.getFieldValues("custbody53");
				var pickup_location = order.getFieldValues("custbody_pickup_location");
				
				var ddChanged = false;
				if(nlapiGetOldRecord().getFieldValue("custbody6")!=delivery_date)
					ddChanged = true;
					
				var dd_rush_reason_changed = false;
				if(nlapiGetOldRecord().getFieldValue("custbody251")!=dd_rush_reason)
					dd_rush_reason_changed = true;
				
				var pos = [];
				for(var x=0; x < order.getLineItemCount("item"); x++)
				{
					if(order.getLineItemValue("item","poid",x+1)!=null && order.getLineItemValue("item","poid",x+1)!="")
						pos.push(order.getLineItemValue("item","poid",x+1));
				}
				
				for(var x=0; x < pos.length; x++)
				{
					if(dd_rush_reason_changed)
					{
						//Since DD Push Reason is multi-select, we need to load record and use nlapiSetFieldValues
						var poRec = nlapiLoadRecord("purchaseorder",pos[x]);
						poRec.setFieldValue("custbody172",custom_gem_status);
						poRec.setFieldValue("custbody103",gemstone_status);
						poRec.setFieldValue("custbody82",delivery_date_firm);
						poRec.setFieldValue("custbody58",so_important_notes);
						poRec.setFieldValues("custbody251",dd_rush_reason);
						if(ddChanged)
							poRec.setFieldValue("custbody6",delivery_date);
						poRec.setFieldValues("custbody53",pickup_at_be);
						poRec.setFieldValues("custbody_pickup_location",pickup_location);
						nlapiSubmitRecord(poRec,true,true);
					}
					else
					{
						if(ddChanged)
							nlapiSubmitField("purchaseorder",pos[x],["custbody172","custbody103","custbody6","custbody82","custbody58","custbody53","custbody_pickup_location"],[custom_gem_status,gemstone_status,delivery_date,delivery_date_firm,so_important_notes,pickup_at_be,pickup_location]);
						else
							nlapiSubmitField("purchaseorder",pos[x],["custbody172","custbody103","custbody82","custbody58","custbody53","custbody_pickup_location"],[custom_gem_status,gemstone_status,delivery_date_firm,so_important_notes,pickup_at_be,pickup_location]);
					}
					
				}
			}
			else if(rectype=="purchaseorder")
			{
				var po = nlapiGetNewRecord();
				var custom_gem_status = po.getFieldValue("custbody172");
				var gemstone_status = po.getFieldValue("custbody103");
				var date_needed_in_sf = po.getFieldValue("custbody59");
				var delivery_date = po.getFieldValue("custbody6");
				var delivery_date_firm = po.getFieldValue("custbody82");
				var vendor = po.getFieldValue("entity");
				var vendor_type = nlapiLookupField("vendor",vendor,"custentity4");
				//var location = po.getFieldValue("location");
				var location = po.getLineItemValue("item","location","1");
				var so_important_notes = po.getFieldValue("custbody58");
				var po_status = po.getFieldValue("status");
				var dd_rush_reason = po.getFieldValues("custbody251");
				var pickup_at_be = po.getFieldValues("custbody53");
				var pickup_location = po.getFieldValues("custbody_pickup_location");
				
				nlapiLogExecution("debug","Vendor Type",vendor_type);
				nlapiLogExecution("debug","Location",location);
				
				var ddChanged = false;
				nlapiLogExecution("debug","Old Delivery Date",nlapiGetOldRecord().getFieldValue("custbody6"));
				if(nlapiGetOldRecord().getFieldValue("custbody6")!=delivery_date)
					ddChanged = true;
					
				var dd_rush_reason_changed = false;
				if(nlapiGetOldRecord().getFieldValue("custbody251")!=dd_rush_reason)
					dd_rush_reason_changed = true;
				
				var order = po.getFieldValue("createdfrom");
				if(order!=null && order!="")
				{
					if(dd_rush_reason_changed)
					{
						//Since DD Push Reason is multi-select, we need to load record and use nlapiSetFieldValues
						var soRec = nlapiLoadRecord("salesorder",order);
						soRec.setFieldValue("custbody172",custom_gem_status);
						soRec.setFieldValue("custbody103",gemstone_status);
						soRec.setFieldValue("custbody82",delivery_date_firm);
						soRec.setFieldValue("custbody58",so_important_notes);
						soRec.setFieldValues("custbody251",dd_rush_reason);
						if(ddChanged)
							soRec.setFieldValue("custbody6",delivery_date);
						soRec.setFieldValues("custbody53",pickup_at_be);
						soRec.setFieldValues("custbody_pickup_location",pickup_location);
						nlapiSubmitRecord(soRec,true,true);
					}
					else
					{
						if(ddChanged)
							nlapiSubmitField("salesorder",order,["custbody172","custbody103","custbody6","custbody82","custbody58","custbody53","custbody_pickup_location"],[custom_gem_status,gemstone_status,delivery_date,delivery_date_firm,so_important_notes,pickup_at_be,pickup_location]);
						else
							nlapiSubmitField("salesorder",order,["custbody172","custbody103","custbody82","custbody58","custbody53","custbody_pickup_location"],[custom_gem_status,gemstone_status,delivery_date_firm,so_important_notes,pickup_at_be,pickup_location]);	
					}
					
					//Find related PO's and update Gemstone Status and Date Needed in SF fields
					
					//Determine if PO is Production PO
					var prod_vendors = nlapiGetContext().getSetting("SCRIPT","custscript_prod_vendors");
					prod_vendors = prod_vendors.split(",");
					
					var isProdPO = false;
					var isGemPO = false;
					for(var i=0; i < prod_vendors.length; i++)
					{
						if(prod_vendors[i]==vendor)
						{
							isProdPO = true;
							isGemPO = false;
							break;
						}
					}
					
					if(isProdPO==false)
						isGemPO = true;
						
					nlapiLogExecution("debug","Is Production PO?",isProdPO);
					nlapiLogExecution("debug","Is Gem PO?",isGemPO);
					
					var filters = [];
					filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof",nlapiGetRecordId()));
					filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
					filters.push(new nlobjSearchFilter("internalid",null,"is",order));
					var cols = [];
					cols.push(new nlobjSearchColumn("purchaseorder",null,"group"));
					cols.push(new nlobjSearchColumn("mainname","purchaseorder","group"));
					var results = nlapiSearchRecord("salesorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiLogExecution("debug","PO Internal ID",results[x].getValue("purchaseorder",null,"group"));
							
							if(isGemPO && location=="2")
							{
								nlapiLogExecution("debug","This PO Is a Gem PO with Location=SF.");
								//If a gemstone/diamond vendor AND inventory is in San Francisco
								//Sync Date needed in SF to Date sent from SF on production PO
								var isProdVendor = false;
								for(var i=0; i < prod_vendors.length; i++)
								{
									if(prod_vendors[i]==results[x].getValue("mainname","purchaseorder","group"))
									{
										isProdVendor = true;
										break;
									}
								}
								nlapiLogExecution("debug","PO Internal ID "+results[x].getValue("purchaseorder",null,"group"),"Is Production PO? " + isProdVendor);
								if(isProdVendor)
								{
									//Check if Gem PO has been received
									var isReceived = false;
									if(po_status=="PurchOrd:D" || po_status=="PurchOrd:E" || po_status=="PurchOrd:F" || po_status=="PurchOrd:G")
										isReceived = true;
									
									var receiptDate = "";
									
									if(isReceived)
									{
										var filters = [];
										filters.push(new nlobjSearchFilter("createdfrom",null,"is",nlapiGetRecordId()));
										filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
										var cols = [];
										cols.push(new nlobjSearchColumn("trandate"));
										var results = nlapiSearchRecord("itemreceipt",null,filters,cols);
										if(results)
											receiptDate = results[0].getValue("trandate");
									}
									
									//Production PO
									var updatePO = true;
									var poRec = nlapiLoadRecord("purchaseorder",results[x].getValue("purchaseorder",null,"group"));
									poRec.setFieldValue("custbody103",gemstone_status);
									poRec.setFieldValue("custbody6",delivery_date);
									poRec.setFieldValue("custbody82",delivery_date_firm);
									for(var i=0; i < poRec.getLineItemCount("item"); i++)
									{
										if(isReceived)
											poRec.setLineItemValue("item","custcol18",i+1,receiptDate);
										else
											poRec.setLineItemValue("item","custcol18",i+1,date_needed_in_sf);
											
										if(poRec.getLineItemValue("item","custcol_category",i+1)=="3")
										{
											//If PO has item = Setting with No Large Center Stone then exclude from update
											nlapiLogExecution("debug","Setting with No Large Center Stone Item Found!");
											updatePO = false;
											break;
										}
									}
									if(updatePO)
										nlapiSubmitRecord(poRec,true,true);
								}
								else
								{
									if(ddChanged)
										nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),["custbody103","custbody6","custbody82","custbody58","custbody251","custbody53","custbody_pickup_location"],[gemstone_status,delivery_date,delivery_date_firm,so_important_notes,dd_rush_reason,pickup_at_be,pickup_location]);
									else
										nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),["custbody103","custbody82","custbody58","custbody251","custbody53","custbody_pickup_location"],[gemstone_status,delivery_date_firm,so_important_notes,dd_rush_reason,pickup_at_be,pickup_location]);
								}
							}
							else
							{
								if(ddChanged)
									nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),["custbody103","custbody6","custbody82","custbody58","custbody251","custbody53","custbody_pickup_location"],[gemstone_status,delivery_date,delivery_date_firm,so_important_notes,dd_rush_reason,pickup_at_be,pickup_location]);
								else
									nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),["custbody103","custbody82","custbody58","custbody251","custbody53","custbody_pickup_location"],[gemstone_status,delivery_date_firm,so_important_notes,dd_rush_reason,pickup_at_be,pickup_location]);
							}
						}
					}
				}
			}
		}
		else if(type=="xedit")
		{
			if(rectype=="salesorder")
			{
				var order = nlapiGetNewRecord();
				var custom_gem_status = order.getFieldValue("custbody172");
				var gemstone_status = order.getFieldValue("custbody103");
				var delivery_date = order.getFieldValue("custbody6");
				var delivery_date_firm = order.getFieldValue("custbody82");
				var so_important_notes = order.getFieldValue("custbody58");
				var dd_rush_reason = order.getFieldValues("custbody251");
				var pickup_at_be = order.getFieldValues("custbody53");
				var pickup_location = order.getFieldValues("custbody_pickup_location");
				
				if(custom_gem_status!=null && custom_gem_status!="")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("createdfrom",null,"is",recid));
					filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
					var cols = [];
					cols.push(new nlobjSearchColumn("internalid",null,"group"));
					var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiSubmitField("purchaseorder",results[x].getValue("internalid",null,"group"),"custbody172",custom_gem_status);
						}
					}
				}
				else if(gemstone_status!=null && gemstone_status!="")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("createdfrom",null,"is",recid));
					filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
					var cols = [];
					cols.push(new nlobjSearchColumn("internalid",null,"group"));
					var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiSubmitField("purchaseorder",results[x].getValue("internalid",null,"group"),"custbody103",gemstone_status);
						}
					}
				}
				else if(delivery_date!=null && delivery_date!="")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("createdfrom",null,"is",recid));
					filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
					var cols = [];
					cols.push(new nlobjSearchColumn("internalid",null,"group"));
					var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiSubmitField("purchaseorder",results[x].getValue("internalid",null,"group"),"custbody6",delivery_date);
						}
					}
				}
				else if(delivery_date_firm!=null && delivery_date_firm!="")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("createdfrom",null,"is",recid));
					filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
					var cols = [];
					cols.push(new nlobjSearchColumn("internalid",null,"group"));
					var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiSubmitField("purchaseorder",results[x].getValue("internalid",null,"group"),"custbody82",delivery_date_firm);
						}
					}
				}
				else if(so_important_notes!=null && so_important_notes!="")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("createdfrom",null,"is",recid));
					filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
					var cols = [];
					cols.push(new nlobjSearchColumn("internalid",null,"group"));
					var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiSubmitField("purchaseorder",results[x].getValue("internalid",null,"group"),"custbody58",so_important_notes);
						}
					}
				}
				else if(pickup_at_be!=null && pickup_at_be!="")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("createdfrom",null,"is",recid));
					filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
					var cols = [];
					cols.push(new nlobjSearchColumn("internalid",null,"group"));
					var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiSubmitField("purchaseorder",results[x].getValue("internalid",null,"group"),"custbody53",pickup_at_be);
						}
					}
				}
				else if(pickup_location!=null && pickup_location!="")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("createdfrom",null,"is",recid));
					filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
					var cols = [];
					cols.push(new nlobjSearchColumn("internalid",null,"group"));
					var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiSubmitField("purchaseorder",results[x].getValue("internalid",null,"group"),"custbody_pickup_location",pickup_location);
						}
					}
				}
			}
			else if(rectype=="purchaseorder")
			{
				var po = nlapiGetNewRecord();
				var custom_gem_status = po.getFieldValue("custbody172");
				var gemstone_status = po.getFieldValue("custbody103");
				var date_needed_in_sf = po.getFieldValue("custbody59");
				var delivery_date = po.getFieldValue("custbody6");
				var delivery_date_firm = po.getFieldValue("custbody82");
				var so_important_notes = po.getFieldValue("custbody58");
				var dd_rush_reason = po.getFieldValue("custbody251");
				var pickup_at_be = po.getFieldValues("custbody53");
				var pickup_location = po.getFieldValues("custbody_pickup_location");
				
				if(custom_gem_status!=null && custom_gem_status!="")
				{
					var order = nlapiLookupField("purchaseorder",recid,"createdfrom");
					if(order!=null && order!="")
					{
						nlapiSubmitField("salesorder",order,"custbody172",custom_gem_status);
					}
				}
				else if(pickup_at_be!=null && pickup_at_be!="")
				{
					var order = nlapiLookupField("purchaseorder",recid,"createdfrom");
					if(order!=null && order!="")
					{
						nlapiSubmitField("salesorder",order,"custbody53",pickup_at_be);
					}
				}
				else if(pickup_location!=null && pickup_location!="")
				{
					var order = nlapiLookupField("purchaseorder",recid,"createdfrom");
					if(order!=null && order!="")
					{
						nlapiSubmitField("salesorder",order,"custbody_pickup_location",pickup_location);
					}
				}
				else if(gemstone_status!=null && gemstone_status!="")
				{
					var order = nlapiLookupField("purchaseorder",recid,"createdfrom");
					if(order!=null && order!="")
					{
						nlapiSubmitField("salesorder",order,"custbody103",gemstone_status);
						
						//Find related PO's and update Gemstone Status and field
						var filters = [];
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof",nlapiGetRecordId()));
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
						filters.push(new nlobjSearchFilter("internalid",null,"is",order));
						var cols = [];
						cols.push(new nlobjSearchColumn("purchaseorder",null,"group"));
						var results = nlapiSearchRecord("salesorder",null,filters,cols);
						if(results)
						{
							for(var x=0; x < results.length; x++)
							{
								nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),"custbody103",gemstone_status);
							}
						}
					}
				}
				else if(date_needed_in_sf!=null && date_needed_in_sf!="")
				{
					var thisPO = nlapiLoadRecord("purchaseorder",nlapiGetRecordId());
					var vendor = thisPO.getFieldValue("entity");
					var location = thisPO.getLineItemValue("item","location","1");
					var order = thisPO.getFieldValue("createdfrom");
					
					//Determine if PO is Production PO
					var prod_vendors = nlapiGetContext().getSetting("SCRIPT","custscript_prod_vendors");
					prod_vendors = prod_vendors.split(",");
					
					var isProdPO = false;
					var isGemPO = false;
					for(var i=0; i < prod_vendors.length; i++)
					{
						if(prod_vendors[i]==vendor)
						{
							isProdPO = true;
							isGemPO = false;
							break;
						}
					}
					
					if(isProdPO==false)
						isGemPO = true;
						
					nlapiLogExecution("debug","Is Production PO?",isProdPO);
					nlapiLogExecution("debug","Is Gem PO?",isGemPO);
					
					var filters = [];
					filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof",nlapiGetRecordId()));
					filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
					filters.push(new nlobjSearchFilter("internalid",null,"is",order));
					var cols = [];
					cols.push(new nlobjSearchColumn("purchaseorder",null,"group"));
					cols.push(new nlobjSearchColumn("mainname","purchaseorder","group"));
					var results = nlapiSearchRecord("salesorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiLogExecution("debug","PO Internal ID",results[x].getValue("purchaseorder",null,"group"));
							
							if(isGemPO && location=="2")
							{
								nlapiLogExecution("debug","This PO Is a Gem PO with Location=SF.");
								//If a gemstone/diamond vendor AND inventory is in San Francisco
								//Sync Date needed in SF to Date sent from SF on production PO
								var isProdVendor = false;
								for(var i=0; i < prod_vendors.length; i++)
								{
									if(prod_vendors[i]==results[x].getValue("mainname","purchaseorder","group"))
									{
										isProdVendor = true;
										break;
									}
								}
								nlapiLogExecution("debug","PO Internal ID "+results[x].getValue("purchaseorder",null,"group"),"Is Production PO? " + isProdVendor);
								if(isProdVendor)
								{
									//Check if Gem PO has been received
									var isReceived = false;
									if(po_status=="PurchOrd:D" || po_status=="PurchOrd:E" || po_status=="PurchOrd:F" || po_status=="PurchOrd:G")
										isReceived = true;
									
									var receiptDate = "";
									
									if(isReceived)
									{
										var filters = [];
										filters.push(new nlobjSearchFilter("createdfrom",null,"is",nlapiGetRecordId()));
										filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
										var cols = [];
										cols.push(new nlobjSearchColumn("trandate"));
										var results = nlapiSearchRecord("itemreceipt",null,filters,cols);
										if(results)
											receiptDate = results[0].getValue("trandate");
									}
									
									//Production PO
									var updatePO = true;
									var poRec = nlapiLoadRecord("purchaseorder",results[x].getValue("purchaseorder",null,"group"));
									poRec.setFieldValue("custbody103",gemstone_status);
									poRec.setFieldValue("custbody6",delivery_date);
									poRec.setFieldValue("custbody82",delivery_date_firm);
									for(var i=0; i < poRec.getLineItemCount("item"); i++)
									{
										if(isReceived)
											poRec.setLineItemValue("item","custcol18",i+1,receiptDate);
										else
											poRec.setLineItemValue("item","custcol18",i+1,date_needed_in_sf);
											
										if(poRec.getLineItemValue("item","custcol_category",i+1)=="3")
										{
											//If PO has item = Setting with No Large Center Stone then exclude from update
											nlapiLogExecution("debug","Setting with No Large Center Stone Item Found!");
											updatePO = false;
											break;
										}
									}
									if(updatePO)
										nlapiSubmitRecord(poRec,true,true);
								}
							}
						}
					}
				}
				else if(delivery_date!=null && delivery_date!="")
				{
					var order = nlapiLookupField("purchaseorder",recid,"createdfrom");
					if(order!=null && order!="")
					{
						nlapiSubmitField("salesorder",order,"custbody6",delivery_date);
						
						//Find related PO's and update Date Needed in SF field
						var filters = [];
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof",nlapiGetRecordId()));
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
						filters.push(new nlobjSearchFilter("internalid",null,"is",order));
						var cols = [];
						cols.push(new nlobjSearchColumn("purchaseorder",null,"group"));
						var results = nlapiSearchRecord("salesorder",null,filters,cols);
						if(results)
						{
							for(var x=0; x < results.length; x++)
							{
								nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),"custbody6",delivery_date);
							}
						}
					}
				}
				else if(delivery_date_firm!=null && delivery_date_firm!="")
				{
					var order = nlapiLookupField("purchaseorder",recid,"createdfrom");
					if(order!=null && order!="")
					{
						nlapiSubmitField("salesorder",order,"custbody82",delivery_date_firm);
						
						//Find related PO's and update Date Needed in SF field
						var filters = [];
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof",nlapiGetRecordId()));
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
						filters.push(new nlobjSearchFilter("internalid",null,"is",order));
						var cols = [];
						cols.push(new nlobjSearchColumn("purchaseorder",null,"group"));
						var results = nlapiSearchRecord("salesorder",null,filters,cols);
						if(results)
						{
							for(var x=0; x < results.length; x++)
							{
								nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),"custbody82",delivery_date_firm);
							}
						}
					}
				}
				else if(so_important_notes!=null && so_important_notes!="")
				{
					var order = nlapiLookupField("purchaseorder",recid,"createdfrom");
					if(order!=null && order!="")
					{
						nlapiSubmitField("salesorder",order,"custbody58",so_important_notes);
						
						//Find related PO's and update Date Needed in SF field
						var filters = [];
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof",nlapiGetRecordId()));
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
						filters.push(new nlobjSearchFilter("internalid",null,"is",order));
						var cols = [];
						cols.push(new nlobjSearchColumn("purchaseorder",null,"group"));
						var results = nlapiSearchRecord("salesorder",null,filters,cols);
						if(results)
						{
							for(var x=0; x < results.length; x++)
							{
								nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),"custbody58",so_important_notes);
							}
						}
					}
				}
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Syncing Gemstone Status Fields","Details: " + err.message);
		return true;
	}
}
