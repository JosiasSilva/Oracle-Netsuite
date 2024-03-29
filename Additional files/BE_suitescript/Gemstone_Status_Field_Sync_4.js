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
 */
function Gemstone_Status_Field_Sync(type)
{
	var recid = nlapiGetRecordId();
	var rectype = nlapiGetRecordType();
	
	try
	{
		if(type=="edit")
		{
			if(rectype=="salesorder")
			{
				var order = nlapiGetNewRecord();
				var custom_gem_status = order.getFieldValue("custbody172");
				var gemstone_status = order.getFieldValue("custbody103");
				var delivery_date = order.getFieldValue("custbody6");
				var delivery_date_firm = order.getFieldValue("custbody82");
				var so_important_notes = order.getFieldValue("custbody58");
				
				var pos = [];
				for(var x=0; x < order.getLineItemCount("item"); x++)
				{
					if(order.getLineItemValue("item","poid",x+1)!=null && order.getLineItemValue("item","poid",x+1)!="")
						pos.push(order.getLineItemValue("item","poid",x+1));
				}
				
				for(var x=0; x < pos.length; x++)
				{
					nlapiSubmitField("purchaseorder",pos[x],["custbody172","custbody103","custbody6","custbody82","custbody58"],[custom_gem_status,gemstone_status,delivery_date,delivery_date_firm,so_important_notes]);
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
				var location = po.getFieldValue("location");
				var so_important_notes = order.getFieldValue("custbody58");
				
				var order = po.getFieldValue("createdfrom");
				if(order!=null && order!="")
				{
					nlapiSubmitField("salesorder",order,["custbody172","custbody103","custbody6","custbody82","custbody58"],[custom_gem_status,gemstone_status,delivery_date,delivery_date_firm,so_important_notes]);
					
					//Find related PO's and update Gemstone Status and Date Needed in SF fields
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
							if((vendor_type=="1" || vendor_type=="5") && location=="2")
							{
								//If a gemstone/diamond vendor AND inventory is in San Francisco
								//Sync Date needed in SF to Date sent from SF on production PO
								var po_vendor_type = nlapiLookupField("vendor",results[x].getValue("mainname","purchaseorder","group"),"custentity4");
								if(po_vendor_type=="6")
								{
									//Production PO
									var poRec = nlapiLoadRecord("purchaseorder",results[x].getValue("purchaseorder",null,"group"));
									poRec.setFieldValue("custbody103",gemstone_status);
									poRec.setFieldValue("custbody6",delivery_date);
									poRec.setFieldValue("custbody82",delivery_date_firm);
									for(var i=0; i < poRec.getLineItemCount("item"); i++)
									{
										poRec.setLineItemValue("item","custcol18",i+1,date_needed_in_sf);
									}
									nlapiSubmitRecord(poRec,true,true);
								}
								else
								{
									nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),["custbody103","custbody6","custbody82"],[gemstone_status,delivery_date,delivery_date_firm]);
								}
							}
							else
							{
								nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder",null,"group"),["custbody103","custbody6","custbody82"],[gemstone_status,delivery_date,delivery_date_firm]);
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
				var so_important_notes = order.getFieldValue("custbody58");
				
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
					var order = nlapiLookupField("purchaseorder",recid,["createdfrom","location","vendor.custentity4"]);
					if(order.createdfrom!=null && order.createdfrom!="" && order.location=="2" && (order["vendor.custentity4"]=="1" || order["vendor.custentity4"]=="5"))
					{
						//Find related PO's and update Date sent from SF on Production PO
						var filters = [];
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof",nlapiGetRecordId()));
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
						filters.push(new nlobjSearchFilter("internalid",null,"is",order.createdfrom));
						var cols = [];
						cols.push(new nlobjSearchColumn("purchaseorder",null,"group"));
						cols.push(new nlobjSearchColumn("mainname","purchaseorder","group"));
						var results = nlapiSearchRecord("salesorder",null,filters,cols);
						if(results)
						{
							for(var x=0; x < results.length; x++)
							{
								var po_vendor_type = nlapiLookupField("vendor",results[x].getValue("mainname","purchaseorder","group"),"custentity4");
								if(po_vendor_type=="6")
								{
									//Production PO
									var poRec = nlapiLoadRecord("purchaseorder",results[x].getValue("purchaseorder",null,"group"));
									for(var i=0; i < poRec.getLineItemCount("item"); i++)
									{
										poRec.setLineItemValue("item","custcol18",i+1,date_needed_in_sf);
									}
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
