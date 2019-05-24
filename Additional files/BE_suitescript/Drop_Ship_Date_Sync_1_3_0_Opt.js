function Drop_Ship_Date_Sync(type)
{
	if(type=="create" || type=="edit" || type=="xedit")
	{
		try
		{
			var context = nlapiGetContext();
			var contextType = context.getExecutionContext();
			if(contextType!="userinterface")
			{
				nlapiLogExecution("audit","Stopping script execution. Not triggered by UI.");
				return true;
			}
			
			var recid = nlapiGetRecordId();
			var rectype = nlapiGetRecordType();
			var record = nlapiGetNewRecord();
			
			if(type=="create" && rectype=="purchaseorder")
			{
				//On creation of a NEW PO, set the value to the SO value
				var salesorder = record.getFieldValue("createdfrom");
				if(salesorder!=null && salesorder!="")
				{
					var so_custbody39 = nlapiLookupField("salesorder",salesorder,"custbody39");
					var po_custbody39 = record.getFieldValue("custbody39");
					
					if(so_custbody39!=null && so_custbody39!="")
					{
						nlapiSubmitField("purchaseorder",recid,"custbody39",so_custbody39);
					}
					
					if(po_custbody39!=null && po_custbody39!="")
					{
						var soRec = nlapiLoadRecord("salesorder",salesorder);
						var vendors = soRec.getFieldValues("custbody_drop_ship_vendor");
						if(vendors==null || vendors=="" || vendors.length == 0)
						{
							soRec.setFieldValue("custbody_drop_ship_vendor",nlapiGetNewRecord().getFieldValue("entity"));
						}
						else
						{
							var newVendors = [];
							for(var z=0; z < vendors.length; z++)
								newVendors.push(vendors[z]);
							
							newVendors.push(nlapiGetNewRecord().getFieldValue("entity"));
							soRec.setFieldValues("custbody_drop_ship_vendor",newVendors);
						}
						nlapiSubmitRecord(soRec,true,true);
					}
				}
			}
			else if(type=="edit")
			{
				var oldValue = nlapiGetOldRecord().getFieldValue("custbody39");
				var newValue = nlapiLookupField(rectype,recid,"custbody39");
				var vendors = record.getFieldValues("custbody_drop_ship_vendor");
				
				if(rectype=="salesorder")
				{
					if(oldValue!=newValue)
					{
						var filters = [];
						filters.push(new nlobjSearchFilter("internalid",null,"is",recid));
						filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
						filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
						if(newValue!=null && newValue!="")
							filters.push(new nlobjSearchFilter("entity","purchaseorder","anyof",vendors));
						var cols = [];
						cols.push(new nlobjSearchColumn("purchaseorder"));
						cols.push(new nlobjSearchColumn("custbody39"));
						var results = nlapiSearchRecord("salesorder",null,filters,cols);
						if(results)
						{
							for(var x=0; x < results.length; x++)
							{
								nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody39",newValue);
							}
						}
					}
				}
				else
				{
					if(newValue==null || newValue=="")
					{
						//Ensure the PO is from a production vendor if pushing back blank value
						//Production vendor = USNY, CH, Miracleworks, Trung, Harout
						var vendor = nlapiLookupField(rectype,recid,"entity");
						if(vendor!="7773" && vendor!="153" && vendor!="442500" && vendor!="46063" && vendor!="1223843")
						{
							nlapiLogExecution("error","Not syncing back Drop Ship field (blank). Not production vendor.");
							return true;
						}
					}
					
					//Update Sales Order
					var salesorder = record.getFieldValue("createdfrom");
					if(salesorder!=null && salesorder!="")
					{
						var soRec = nlapiLoadRecord("salesorder",salesorder);
						
						//Only update if value is actually changed
						nlapiLogExecution("debug","Old Value: " + oldValue,"New Value: " + newValue);
						
						if(oldValue!=newValue)
						{
							var vendors = soRec.getFieldValues("custbody_drop_ship_vendor");
						
							if(vendors==null || vendors=="" || vendors.length == 0)
							{
								if(newValue!=null && newValue!="")
								{
									soRec.setFieldValue("custbody_drop_ship_vendor",nlapiGetNewRecord().getFieldValue("entity"));
									soRec.setFieldValue("custbody39",newValue);
								}
							}
							else
							{
								var newVendors = [];
								for(var z=0; z < vendors.length; z++)
									newVendors.push(vendors[z]);
								
								newVendors.push(nlapiGetNewRecord().getFieldValue("entity"));
								
								if(newValue==null || newValue=="")
								{
									for(var z=0; z < newVendors.length; z++)
									{
										if(newVendors[z] == nlapiGetNewRecord().getFieldValue("entity"))
										{
											newVendors.splice(z,1);
											z--;
										}
									}	
								}
								
								if(newVendors.length == 0)
									soRec.setFieldValue("custbody_drop_ship_vendor","");
								else
									soRec.setFieldValues("custbody_drop_ship_vendor",newVendors);
									
								if(newVendors.length == 0)
									soRec.setFieldValue("custbody39","");
								else
									soRec.setFieldValue("custbody39",newValue);
							}
						}
						
						nlapiSubmitRecord(soRec,true,true);
					}
				}
			}
			else if(type=="xedit")
			{
				nlapiLogExecution("debug","Running Xedit Routine...");
				
				//Get Drop Ship Materials sent to Vendor field value
				var dropShipDate = nlapiLookupField(rectype,recid,"custbody39");
				
				//Update Sales Order if edited from PO, Update PO if edited from SO
				if(rectype=="salesorder")
				{
					var filters = [];
					filters.push(new nlobjSearchFilter("internalid",null,"is",recid));
					filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
					filters.push(new nlobjSearchFilter("purchaseorder",null,"noneof","@NONE@"));
					var cols = [];
					cols.push(new nlobjSearchColumn("purchaseorder"));
					cols.push(new nlobjSearchColumn("custbody39"));
					var results = nlapiSearchRecord("salesorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody39",dropShipDate);
						}
					}
				}
				else
				{
					if(dropShipDate==null || dropShipDate=="")
					{
						//Ensure the PO is from a production vendor if pushing back blank value
						//Production vendor = USNY, CH, Miracleworks, Trung, Harout
						var vendor = nlapiLookupField(rectype,recid,"entity");
						if(vendor!="7773" && vendor!="153" && vendor!="442500" && vendor!="46063" && vendor!="1223843")
						{
							nlapiLogExecution("error","Not syncing back Drop Ship field (blank). Not production vendor.");
							return true;
						}
					}
					
					//Update Sales Order
					var salesorder = nlapiLookupField("purchaseorder",recid,"createdfrom");
					if(salesorder!=null && salesorder!="")
					{
						nlapiSubmitField("salesorder",salesorder,"custbody39",dropShipDate);
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Syncing field custbody39","Details: " + err.message);
			return true;
		}
	}
}
