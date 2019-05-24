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
		if(type=="create" || type=="edit" || type=="specialorder")
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
				
				
				var ddChanged = false;
				if(nlapiGetOldRecord().getFieldValue("custbody6")!=delivery_date)
					ddChanged = true;
					
				var dd_rush_reason_changed = false;
				if(nlapiGetOldRecord().getFieldValue("custbody251")!=dd_rush_reason)
					dd_rush_reason_changed = true;
				
				
				var so_important_notes_changed = false;
				if(nlapiGetOldRecord().getFieldValue("custbody58")!=so_important_notes)
					so_important_notes_changed = true;
				
				
				
				
				var pos = [];
				for(var x=0; x < order.getLineItemCount("item"); x++)
				{
					if(order.getLineItemValue("item","poid",x+1)!=null && order.getLineItemValue("item","poid",x+1)!="")
						pos.push(order.getLineItemValue("item","poid",x+1));
				}
				
				for(var x=0; x < pos.length; x++)
				{
					//if(dd_rush_reason_changed)
					if(ddChanged==true || so_important_notes_changed==true)
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
						nlapiSubmitRecord(poRec,true,true);

												//Added by ajay 01June 2016						
						var pushtoportal = nlapiLookupField("purchaseorder",pos[x],"custbody_pushtoportal");
						nlapiLogExecution("debug","Push to PO is : ",pushtoportal);
						var pushrevisedpo = nlapiLookupField("purchaseorder",pos[x],"custbody_pushrevisedpo");
						nlapiLogExecution("debug","Revised PO is : ",pushrevisedpo);
						if(pushtoportal == 'T' && pushrevisedpo == 'F')
						{                            
							PushPOToPortal(pos[x]);
						}
						else if(pushrevisedpo == 'T')
						{
							PushPORevisedDataNSToPortal(pos[x]);
						}
						//Ended by ajay
					}
					else
					{
						if(ddChanged)
							nlapiSubmitField("purchaseorder",pos[x],["custbody172","custbody103","custbody6","custbody82","custbody58"],[custom_gem_status,gemstone_status,delivery_date,delivery_date_firm,so_important_notes]);
						else
							nlapiSubmitField("purchaseorder",pos[x],["custbody172","custbody103","custbody82","custbody58"],[custom_gem_status,gemstone_status,delivery_date_firm,so_important_notes]);
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
				
				nlapiLogExecution("debug","Vendor Type",vendor_type);
				nlapiLogExecution("debug","Location",location);
				
				var ddChanged = false;
				if(type=="create")
				{
					ddChanged = true;
				}
				else
				{
					nlapiLogExecution("debug","Old Delivery Date",nlapiGetOldRecord().getFieldValue("custbody6"));
					if(nlapiGetOldRecord().getFieldValue("custbody6")!=delivery_date)
						ddChanged = true;
				}
				
				var dd_rush_reason_changed = false;
				if(type=="create")
				{
					dd_rush_reason_changed = true;
				}	
				else
				{
					if(nlapiGetOldRecord().getFieldValue("custbody251")!=dd_rush_reason)
						dd_rush_reason_changed = true;
				}
				
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
						nlapiSubmitRecord(soRec,true,true);
					}
					else
					{
						if(ddChanged)
							nlapiSubmitField("salesorder",order,["custbody172","custbody103","custbody6","custbody82","custbody58"],[custom_gem_status,gemstone_status,delivery_date,delivery_date_firm,so_important_notes]);
						else
							nlapiSubmitField("salesorder",order,["custbody172","custbody103","custbody82","custbody58"],[custom_gem_status,gemstone_status,delivery_date_firm,so_important_notes]);	
					}
					
					//Find related PO's and update Gemstone Status and Date Needed in SF fields
					
					//Determine if PO is Production PO
					var isProdPO = false;
					var isGemPO = false;
					
					if(nlapiLookupField("vendor",vendor,"custentity4")=="4")
					{
						isProdPO = true;
						isGemPO = false;
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
								if(nlapiLookupField("vendor",results[x].getValue("mainname","purchaseorder","group"),"custentity4")=="4")
								{
									isProdVendor = true;
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
										nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),["custbody103","custbody6","custbody82","custbody58","custbody251"],[gemstone_status,delivery_date,delivery_date_firm,so_important_notes,dd_rush_reason]);
									else
										nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),["custbody103","custbody82","custbody58","custbody251"],[gemstone_status,delivery_date_firm,so_important_notes,dd_rush_reason]);
								}
							}
							else
							{
								if(ddChanged)
									nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),["custbody103","custbody6","custbody82","custbody58","custbody251"],[gemstone_status,delivery_date,delivery_date_firm,so_important_notes,dd_rush_reason]);
								else
									nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),["custbody103","custbody82","custbody58","custbody251"],[gemstone_status,delivery_date_firm,so_important_notes,dd_rush_reason]);
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
				
				if(custom_gem_status!=null && custom_gem_status!="")
				{
					var order = nlapiLookupField("purchaseorder",recid,"createdfrom");
					if(order!=null && order!="")
					{
						nlapiSubmitField("salesorder",order,"custbody172",custom_gem_status);
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
					var isProdPO = false;
					var isGemPO = false;
					
					if(nlapiLookupField("vendor",vendor,"custentity4")=="4")
					{
						isProdPO = true;
						isGemPO = false;
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
								if(nlapiLookupField("vendor",results[x].getValue("mainname","purchaseorder","group"),"custentity4")=="4")
								{
									isProdVendor = true;
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


//Push PO To Portal
function PushPOToPortal(poId)
{    
	try
	{            
            nlapiLogExecution('debug','PO Initiated to push on portal for POId :'+poId , poId);			
           
			if((poId!='' && poId!=null))
			{               
				var POObj = nlapiLoadRecord("purchaseorder",poId);
				
				var PoStatus = nlapiLookupField("purchaseorder",poId,'custbody_portal_status'); 
				nlapiLogExecution("debug","portal status is :"+PoStatus);
				var PortalStatus;
				if(PoStatus == null || String(PoStatus).length == 0)
				{					
					PortalStatus = '[]';
					nlapiLogExecution("debug","Portal status value is :",PortalStatus);
				}					
				else
					PortalStatus = '[' +  PoStatus + ']';
			
			    var transid=POObj.getFieldValue('tranid') ;
			    var custbody_ship_date1 = POObj.getFieldValue('custbody_po_ship_date'); //NEW NS DATE FIELD TBD
			    if(custbody_ship_date1 == '' || custbody_ship_date1 == null) // added by ajay(ship date)
			    {				   
				   custbody_ship_date1 = nlapiDateToString(new Date());
			    }
                else
				{
				   custbody_ship_date1=POObj.getDateTimeValue('custbody_po_ship_date');
			    }
			 
			    var custbody146=POObj.getFieldValue('custbody146');// Diamond ETA   
			    if(custbody146=='' || custbody146==null)
			    {				   
				   custbody146=null;
			    }
			    var custbody39= POObj.getFieldValue('custbody39')  ;   // DROP SHIP MATERIALS SENT TO VENDOR
			    if(custbody39=='' || custbody39==null)
			    {
				   custbody39='F';
			    }
			    else
			    {
					custbody39='T';
			    }
			    var custbody116=POObj.getFieldValue('custbody116'); // CAD OR WAX DUE DATE
			    if(custbody116=='' || custbody116==null)
			    {				   
				   custbody116=null;
			    }
			    var custbody209 = POObj.getFieldValue('custbody209');  //  Date shippend from vendor
			    if(custbody209=='' || custbody209==null)
			    {				   
				   custbody209=null;
			    }
			    var custbody6=POObj.getFieldValue('custbody6'); // DELIVERY DATE
                if(custbody6 == '' || custbody6 == null)
			    {
				   custbody6 = nlapiDateToString(new Date());
			    }
			    var custbody129 = POObj.getFieldValue('custbody129'); //   TO BE WATCHED
			    var custbody58=POObj.getFieldValue('custbody58'); //  Important Notes/ SO Notes
			    if(custbody58=='' || custbody58==null)
			    {
				   custbody58="";
			    }
                           
                var custbody41 =  POObj.getFieldValue('custbody41'); //  DESIGN APPROVAL STATUS
			    var custbody_tracking = POObj.getFieldValue('custbody_tracking'); //TRACKING
			    var custbody_comments = POObj.getFieldValue('custbody_comments'); //COMMENTS			   
                          
                var certificate_status = POObj.getFieldValue('custbodycertificate_status'); // CERTIFICATE STATUS
			    if(certificate_status=='' || certificate_status==null)
			    {
				   certificate_status=null;
			    }
			    //Added new code by ajay 23Sept 2016
			    var cad_file_name = POObj.getFieldValue('custbody_internal_cad_file_name');
			    if(cad_file_name == null || cad_file_name == '')
			    {
					cad_file_name = null;
			    }
                         //Added new code by ajay 23Sept 2016
		        var approved_to_grow_confirmation = POObj.getFieldValue('custbody_grow_confirmation'); //Approved to grow confirmation
		        if(approved_to_grow_confirmation == '' || approved_to_grow_confirmation == null) 
		        {				   
			        approved_to_grow_confirmation = null;
		        }
		        //Ended by ajay

			    var VendorId = POObj.getFieldValue('entity');
                var itemCount  = POObj.getLineItemCount("item");
                var IteArray = new Array();
			    var CategoryId ;
                for ( var i = 1 ; i<= itemCount  ; i++)
                {
					var itemType = POObj.getLineItemValue("item","itemtype",i);
					var isLooseDiamond='F';
					if(itemType == "InvtPart")
					{
						var invItemId = POObj.getLineItemValue("item","item",i);
						CategoryId =  nlapiLookupField("inventoryitem",invItemId,"custitem20");
						if(CategoryId=='7')
						{
							isLooseDiamond='T';
						}					
					} 
					var item = POObj.getLineItemValue("item","item",i);
					var item_name = POObj.getLineItemValue("item","item_display",i);
									var vendorCode = POObj.getLineItemValue("item","vendorname",i);
					var itemlink = POObj.getLineItemValue("item","custcolitem_link_display",i);
					if(itemlink=='' || itemlink==null)
					{
						itemlink=""; // not accepting null
					}
					var itemDesc=POObj.getLineItemValue("item","description",i);
					if(itemDesc=='' || itemDesc==null)
					{
						itemDesc=""; // not accepting null
					}
					var itemNotes=POObj.getLineItemValue("item","custcol5",i);
									
					if(itemNotes=='' || itemNotes==null)
					{
						itemNotes="";
					}
									var certificate_included = POObj.getLineItemValue("item","custcol28",i);
					if(certificate_included =='' || certificate_included ==null)
					{
						certificate_included = null;
					}
					var itemInsVal=POObj.getLineItemValue("item","custcol_full_insurance_value",i);
					if(itemInsVal=='' || itemInsVal==null)
					{
						itemInsVal=0;
					}
					var dt_sentFrom_sf=POObj.getLineItemValue("item","custcol18",i);
					if(dt_sentFrom_sf == '' || dt_sentFrom_sf == null)// Added by ajay
					{						
						dt_sentFrom_sf = null;
					}
								   var ObjItem = {
								"item_id" :parseInt(item), 
								"item" : (vendorCode !='' && vendorCode != null) ? vendorCode : item_name,
								"description" : itemDesc,
								"notes" : itemNotes,
								"insurance_value" : itemInsVal,
								"itemlink" : itemlink ,
								"date_sent_from_sf" : dt_sentFrom_sf, 
								"loose_diamond" : isLooseDiamond,
								"certificate_included" : certificate_included
								};
					IteArray.push(ObjItem);
                }
                var objJSON = 
                  {
					"po_id" : poId,
					"portal_status":PortalStatus, 
					"transaction_id" :transid,
					"items" :IteArray,
					"ship_date": custbody_ship_date1, 
					"diamond_eta" : custbody146,
					"drop_ship" : custbody39,
					"cad_due_date" : custbody116, 
					"date_shipped_from_vendor" : custbody209, 
					"delivery_date" : custbody6, 
					"to_be_watched" : custbody129, 
					"so_notes" : custbody58,					
					"pro_vendor" :  parseInt(VendorId),
					"wait_cad" : custbody41,
                                        "certificate_status" : certificate_status,
                                        "approved_to_grow_confirmation" : approved_to_grow_confirmation,
					"internal_cad_file_name" : cad_file_name
                }; 
            }
			//Setting up URL of CDP             			
			var url = "https://partner.brilliantearth.com/api/production/po/";
			   
			//Setting up Headers 
			var headers = new Array(); 
			headers['http'] = '1.1';    
			headers['Accept'] = 'application/json';       			
			headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';
			headers['Content-Type'] = 'application/json'; 
			headers['User-Agent-x'] = 'SuiteScript-Call';
			 
			//Stringifying JSON
			var myJSONText = JSON.stringify(objJSON, replacer); 
			nlapiLogExecution('debug','PO Response Body as NS Input:', myJSONText);					   
			var response = nlapiRequestURL(url, myJSONText, headers); 
			nlapiLogExecution('debug','PO Response Body as Portal Output:', response.body);
			//Below is being used to put a breakpoint in the debugger	
								
			if(response.code==200)
			{                                                                                            
				var responsebody = JSON.parse(response.getBody());
				var portalStatus = responsebody["portal_status"];				
				nlapiLogExecution("debug", "PO successfully pushed to Portal.");			
				try
				{
                                       /*------------------------Added new code by Yagya 24 Aug 16-------------------------------*/
					var portalStatusArr=[];
					var approvedToGrow = POObj.getFieldValue("custbody_grow_confirmation");
					if(approvedToGrow != null && approvedToGrow != "")
					{
						for(var h=0; h<portalStatus.length;h++)
						{
							if(portalStatus[h]!='11')
							{
								portalStatusArr.push(portalStatus[h]);
							}
						}
						nlapiLogExecution("debug","approvedToGrow : "+approvedToGrow); 
						nlapiLogExecution("debug","Set PORTAL STATUS without approved to grow is : "+poId,JSON.stringify(portalStatusArr));
						nlapiSubmitField('purchaseorder',poId,['custbody_portal_status','custbody_pushtoportal'],[portalStatusArr,'T']); 
					}
					else
					{
						nlapiLogExecution("debug","Set PORTAL STATUS : "+poId,JSON.stringify(portalStatus));
						nlapiSubmitField('purchaseorder',poId,['custbody_portal_status','custbody_pushtoportal'],[portalStatus,'T']);   
					}					
					/*------------------------End new code by Yagya 24 Aug 16-------------------------------*/  
							
				}
                catch(err){
                }						
			}
			else
			{                                          
                nlapiLogExecution("debug","Portal response is : ",response.body);		
			}// end check of response.code
	}
	catch(err)
	{             
	    nlapiLogExecution("debug","Error occur during CDPID Push from NS to portal is : ",err.message);             
	}
}

function PushPORevisedDataNSToPortal(poId)
{    
	try
	{           
             nlapiLogExecution('debug','PO Initiated to push on portal for POId :'+poId , poId);			
           
			if((poId!='' && poId!=null))
			{                                
				var POObj = nlapiLoadRecord("purchaseorder",poId);				
                                 var PoStatus = nlapiLookupField("purchaseorder",poId,'custbody_portal_status'); 
				 var PortalStatus='';
				if(PoStatus == null || String(PoStatus).length == 0){					
                                           PortalStatus = '[]';
				}					
				else
					PortalStatus = '[' +  PoStatus + ']';
			
			   var transid=POObj.getFieldValue('tranid') ;
			   var custbody_ship_date1 = POObj.getFieldValue('custbody_po_ship_date'); //NEW NS DATE FIELD TBD
			   if(custbody_ship_date1 == '' || custbody_ship_date1 == null) // added by ajay(ship date)
			   {				   
				   custbody_ship_date1 = nlapiDateToString(new Date());
			   }			 
			   var custbody146=POObj.getFieldValue('custbody146');// Diamond ETA   
			   if(custbody146=='' || custbody146==null)
			   {				   
				   custbody146=null;
			   }
			   var custbody39= POObj.getFieldValue('custbody39')  ;   // DROP SHIP MATERIALS SENT TO VENDOR
			   if(custbody39=='' || custbody39==null)
			   {
				   custbody39='F';
			   }
                           else
                           {
                                   custbody39='T';
                           }
			   var custbody116=POObj.getFieldValue('custbody116'); // CAD OR WAX DUE DATE
			   if(custbody116=='' || custbody116==null)
			   {				   
				   custbody116=null;
			   }
			   var custbody209 = POObj.getFieldValue('custbody209');  //  Date shippend from vendor
			   if(custbody209=='' || custbody209==null)
			   {				   
				   custbody209=null;
			   }
			   var custbody6=POObj.getFieldValue('custbody6'); // DELIVERY DATE
                           if(custbody6 == '' || custbody6 == null)
			   {
				   custbody6 = nlapiDateToString(new Date());
			   }
			   var custbody129 = POObj.getFieldValue('custbody129'); //   TO BE WATCHED
			   var custbody58=POObj.getFieldValue('custbody58'); //  Important Notes/ SO Notes
			   if(custbody58=='' || custbody58==null)
			   {
				   custbody58="";
			   }
                           
                           var custbody41 =  POObj.getFieldValue('custbody41'); //  DESIGN APPROVAL STATUS
			   var custbody_tracking = POObj.getFieldValue('custbody_tracking'); //TRACKING
			   var custbody_comments = POObj.getFieldValue('custbody_comments'); //COMMENTS			   
                           
                           var certificate_status = POObj.getFieldValue('custbodycertificate_status'); // CERTIFICATE STATUS
			   if(certificate_status=='' || certificate_status==null)
			   {
				   certificate_status=null;
			   }
			   //Added new code by ajay 23Sept 2016
			   var cad_file_name = POObj.getFieldValue('custbody_internal_cad_file_name');
			   if(cad_file_name == null || cad_file_name == '')
			   {
					cad_file_name = null;
			   }
                       //Added new code by ajay 23Sept 2016
		       var approved_to_grow_confirmation = POObj.getFieldValue('custbody_grow_confirmation'); //Approved to grow confirmation
		       if(approved_to_grow_confirmation == '' || approved_to_grow_confirmation == null) 
		       {				   
			        approved_to_grow_confirmation = null;
		       }
		       //Ended by ajay

			   var VendorId = POObj.getFieldValue('entity');
               var itemCount  = POObj.getLineItemCount("item");
               var IteArray = new Array();
			   var CategoryId ;
              for ( var i = 1 ; i<= itemCount  ; i++)
              {
				var itemType = POObj.getLineItemValue("item","itemtype",i);
				var isLooseDiamond='F';
				if(itemType == "InvtPart")
				{
					var invItemId = POObj.getLineItemValue("item","item",i);
					CategoryId =  nlapiLookupField("inventoryitem",invItemId,"custitem20");
					if(CategoryId=='7')
					{
						isLooseDiamond='T';
					}
					
				} 
				var item = POObj.getLineItemValue("item","item",i);
                                var item_name = POObj.getLineItemValue("item","item_display",i);
                                var vendorCode = POObj.getLineItemValue("item","vendorname",i);
				var itemlink = POObj.getLineItemValue("item","custcolitem_link_display",i);
				if(itemlink=='' || itemlink==null)
				{
					itemlink=""; // not accepting null
				}
				var itemDesc=POObj.getLineItemValue("item","description",i);
				if(itemDesc=='' || itemDesc==null)
				{
					itemDesc=""; // not accepting null
				}
				var itemNotes=POObj.getLineItemValue("item","custcol5",i);
                                nlapiLogExecution("debug","item notes is : ",itemNotes);
				if(itemNotes=='' || itemNotes==null)
				{
					itemNotes="";
				}
                                var certificate_included = POObj.getLineItemValue("item","custcol28",i);
				if(certificate_included =='' || certificate_included ==null)
				{
					certificate_included = null;
				}
				var itemInsVal=POObj.getLineItemValue("item","custcol_full_insurance_value",i);
				if(itemInsVal=='' || itemInsVal==null)
				{
					itemInsVal=0;
				}
				var dt_sentFrom_sf=POObj.getLineItemValue("item","custcol18",i);
				if(dt_sentFrom_sf == '' || dt_sentFrom_sf == null)// Added by ajay
				{					
					dt_sentFrom_sf = null;
				}
                               var ObjItem = {
							"item_id" :parseInt(item), 
							"item" : (vendorCode !='' && vendorCode != null) ? vendorCode : item_name,
                            "description" : itemDesc,
                            "notes" : itemNotes,
                            "insurance_value" : itemInsVal,
                            "itemlink" : itemlink ,
                            "date_sent_from_sf" : dt_sentFrom_sf, 
     			    "loose_diamond" : isLooseDiamond,
                            "certificate_included" : certificate_included
                            };
                IteArray.push(ObjItem);
              }
              var objJSON = 
                  {
					"po_id" : poId,
					"portal_status":PortalStatus, 
					"transaction_id" :transid,
					"items" :IteArray,
					"ship_date": custbody_ship_date1, 
					"diamond_eta" : custbody146,
					"drop_ship" : custbody39,
					"cad_due_date" : custbody116, 
					"date_shipped_from_vendor" : custbody209, 
					"delivery_date" : custbody6, 
					"to_be_watched" : custbody129, 
					"so_notes" : custbody58,					
					"pro_vendor" :  parseInt(VendorId),
					"wait_cad" : custbody41,
                                        "certificate_status" : certificate_status,
                                        "approved_to_grow_confirmation" : approved_to_grow_confirmation,
					"internal_cad_file_name" : cad_file_name
                  }; 
             }
					//Setting up URL of CDP             					
					var url = "https://partner.brilliantearth.com/api/production/revised-po/";    
					   
					//Setting up Headers 
					var headers = new Array(); 
					headers['http'] = '1.1';    
					headers['Accept'] = 'application/json';       					
					headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';
					headers['Content-Type'] = 'application/json'; 
					headers['User-Agent-x'] = 'SuiteScript-Call';
					 
					//Stringifying JSON
					var myJSONText = JSON.stringify(objJSON, replacer); 
					nlapiLogExecution('debug','PO Response Body as NS Input:', myJSONText);					   
					var response = nlapiRequestURL(url, myJSONText, headers); 
					//nlapiLogExecution('debug','PO Response Body as Portal Output:', response.body);
					//Below is being used to put a breakpoint in the debugger					  
					if(response.code==200)
					{
						
						var responsebody = JSON.parse(response.getBody());
						var portalStatus = responsebody["portal_status"];  
											
						nlapiLogExecution("debug","response PORTAL STATUS : "+poId,JSON.stringify(portalStatus));						
						nlapiLogExecution("debug","Revised PO successfully pushed to Portal.");
						try
						{							

							var portalStatusArr=[];
							var approvedToGrow = POObj.getFieldValue("custbody_grow_confirmation");
							if(approvedToGrow != null && approvedToGrow != "")
							{
								for(var h=0; h<portalStatus.length;h++)
								{
									if(portalStatus[h]!='11')
									{
										portalStatusArr.push(portalStatus[h]);
									}
								}
								nlapiLogExecution("debug","approvedToGrow : "+approvedToGrow); 
								nlapiLogExecution("debug","Set PORTAL STATUS without approved to grow is : "+poId,JSON.stringify(portalStatusArr));
								nlapiSubmitField('purchaseorder',poId,['custbody_portal_status','custbody_pushtoportal'],[portalStatusArr,'T']); 
							}
							else
							{
								nlapiLogExecution("debug","Set PORTAL STATUS : "+poId,JSON.stringify(portalStatus));
								nlapiSubmitField('purchaseorder',poId,['custbody_portal_status','custbody_pushtoportal'],[portalStatus,'T']);   
							}					
						}
						catch(err)
						{}
					}
					else
					{   					      
                                              
                                              nlapiLogExecution("debug",response.body);		
					}// end check of response.code
	}
	catch(err)
	{          
	  nlapiLogExecution("debug","Error occur during PO ID Push from NS to portal is : ",err.message);          
	}
}

function replacer(key, value)
{
	if (typeof value == "number" && !isFinite(value))
	{
		return String(value);
	}
	return value;
}

