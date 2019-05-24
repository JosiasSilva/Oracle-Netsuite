nlapiLogExecution("audit","FLOStart",new Date().getTime());
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
							PushRevisedPOToPortal(pos[x],"585");
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


// Added by Rahul Panchal as per PP-167 on dated 29/09/2016
function PushMessageNSToPortal(msgId,poId)
{
	try
	{
		var vendorId=nlapiLookupField("purchaseorder",poId,"entity");
		var vendorEmail= nlapiLookupField("vendor",vendorId,"email"); 
	         
		var pomsgArrField = ["author","authoremail","message","messagedate","recipientemail","subject"];
		var pomsgVal = nlapiLookupField("message",msgId,pomsgArrField);		   	
		var author=pomsgVal.author;
		var authorEmail=pomsgVal.authoremail;
	    var message=pomsgVal.message;
	    var date_created=pomsgVal.messagedate;     
	    var recipient_email11=pomsgVal.recipientemail;
	    var recipient_email=vendorEmail;		  
	    var author_email= authorEmail;
	    var message_subject=pomsgVal.subject;		   
	    var message_id=msgId;		  
	    var dateTimeArr='',dateStr='',timeStr='';
		
		if(date_created!='' && date_created!=null)
		{
			dateTimeArr=date_created.split(' ');
			dateStr=dateFormatYMD(dateTimeArr[0]);
			timeStr=dateTimeArr[1]+':'+'00';
		}
			
		date_created = dateStr+' '+timeStr;
		
		nlapiLogExecution("debug","date time Value : ", date_created);  
        nlapiLogExecution("debug","time Value : ", timeStr);  
				
		if(author!='' && author!=null &&  author_email!='' &&  author_email!=null && recipient_email!='' && recipient_email !=null && date_created!='' &&  message_subject!='' &&  message_id!='' && message_id!=null  && message!='')
		{			
			 //Setting up URL of PO             			 
			 var url = "https://partner.brilliantearth.com/api/production/message/";  // for Production  
			 //var url = "https://testportal.brilliantearth.com/api/production/message/";  // for test portal
			
			//Setting up Headers 
			var headers = new Array(); 
			headers['http'] = '1.1';    
			headers['Accept'] = 'application/json';       
			headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; // for Production
			//headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542';  // for sandbox
			headers['Content-Type'] = 'application/json'; 
			headers['User-Agent-x'] = 'SuiteScript-Call';  
			   
			//Setting up Datainput
			var jsonobj = {"author": author_email, 
				 "message": message,
				 "date_created": date_created,
				 "author_email": author_email,
				 "recipient_email": recipient_email,
				 "message_subject": message_subject,
				 "message_id": message_id,
				 "purchase_order": poId
			}
					
			//Stringifying JSON
			var myJSONText = JSON.stringify(jsonobj, replacer); 
			var response = nlapiRequestURL(url, myJSONText, headers);    
			//Below is being used to put a breakpoint in the debugger  
			
			if(response.code=='200')
			{				
			    nlapiLogExecution('debug','PO Communication Successfully Pushed to Portal for poId :'+poId+',msgId :'+msgId, poId);
				var responsebody = JSON.parse(response.getBody());
				var portalStatus = responsebody["portal_status"];
				nlapiSubmitField('purchaseorder',poId,'custbody_portal_status',portalStatus);
			}
			else
			{						
				nlapiLogExecution('debug','PO Communication detail does not exists to push on portal for poId :'+poId, response.getBody());
			} 			 
		}// end check
	}
	catch (e)
	{
		nlapiLogExecution("debug","Error occur during PoId Push from NS to portal",e.message); 
	}
}

function dateFormatYMD(strDate)
{
  var YYYYMMDD='';
  var strArr='';
  if(strDate!='')
  {
    strArr=strDate.split('/');
    var mm=strArr[0];
    if(mm.length=='1') mm='0'+mm;
    var dd=strArr[1];
    if(dd.length=='1') dd='0'+dd;
    var yyyy=strArr[2];
    YYYYMMDD=yyyy+'-'+mm+'-'+dd;
  }
  return YYYYMMDD;
}

function replacer(key, value)
{
	if (typeof value == "number" && !isFinite(value))
	{
		return String(value);
	}
	return value;
}
