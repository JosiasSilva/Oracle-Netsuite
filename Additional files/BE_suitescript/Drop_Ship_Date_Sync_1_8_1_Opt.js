function Drop_Ship_Date_Sync(type)
{
	if(type=="create" || type=="edit" || type=="xedit" || type=="specialorder")
	{
		try
		{
			var context = nlapiGetContext();
			var contextType = context.getExecutionContext();
			if(contextType!="userinterface" && contextType!="userevent")
			{
				nlapiLogExecution("audit","Stopping script execution. Not triggered by UI.","Context: " + contextType);
				return true;
			}
			
			var recid = nlapiGetRecordId();
			var rectype = nlapiGetRecordType();
			var record = nlapiGetNewRecord();
			
			nlapiLogExecution("debug","Type",type);
			
			if((type=="create" || type=="specialorder") && rectype=="purchaseorder" && record.getFieldValue("custbody_linked_to_post_sale_order")!="T")
			{
				//On creation of a NEW PO, set the value to the SO value
				var salesorder = record.getFieldValue("createdfrom");
				if(salesorder!=null && salesorder!="")
				{
					var so_custbody39 = nlapiLookupField("salesorder",salesorder,"custbody39");
					var po_custbody39 = record.getFieldValue("custbody39");
					var shipdate = "";
					
					var fields = [];
					var data = [];
					
					if(record.getFieldValue("custbody59")!=null && record.getFieldValue("custbody59")!="")
					{
						shipdate = minus_workDay(1,nlapiStringToDate(record.getFieldValue("custbody59")));
						fields.push("custbody_po_ship_date");
						data.push(nlapiDateToString(shipdate,"date"));
					}
					else
					{
						shipdate = minus_workDay(1,nlapiStringToDate(record.getFieldValue("custbody6")));
						fields.push("custbody_po_ship_date");
						data.push(nlapiDateToString(shipdate,"date"));
					}
					
					if(so_custbody39!=null && so_custbody39!="")
					{
						fields.push("custbody39");
						data.push(so_custbody39);
						//nlapiSubmitField("purchaseorder",recid,"custbody39",so_custbody39);
					}
					
					if(fields.length > 0 && data.length > 0)
					{
						nlapiSubmitField("purchaseorder",recid,fields,data);
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
						if(soRec.getFieldValue("custbody39")==null || soRec.getFieldValue("custbody39")=="")
							soRec.setFieldValue("custbody39",po_custbody39);
						nlapiSubmitRecord(soRec,true,true);
					}
				}
			}
			else if(type=="edit")
			{
				var oldValue = checkNull(nlapiGetOldRecord().getFieldValue("custbody39"));
				var newValue = checkNull(nlapiLookupField(rectype,recid,"custbody39"));
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
						cols.push(new nlobjSearchColumn("custbody6"));
						var results = nlapiSearchRecord("salesorder",null,filters,cols);
						if(results)
						{
							for(var x=0; x < results.length; x++)
							{
								if(results[x].getValue("custbody6")!=null && results[x].getValue("custbody6")!="")
								{
									if(nlapiGetOldRecord().getFieldValue("custbody_po_ship_date")!=nlapiGetNewRecord().getFieldValue("custbody_po_ship_date"))
										var shipdate = record.getFieldValue("custbody_po_ship_date");
									else
										var shipdate = minus_workDay(1,nlapiStringToDate(results[x].getValue("custbody6")));
									nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),["custbody39","custbody_po_ship_date"],[newValue,nlapiDateToString(shipdate,"date")]);
								}
								else
								{
									nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody39",newValue);	
								}
								//nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody39",newValue);
							}
						}
					}
				}
				else
				{
					var skipDropShipUpdate = false;
					
					if(newValue==null || newValue=="")
					{
						//Ensure the PO is from a production vendor if pushing back blank value
						//Production vendor = USNY, CH, Miracleworks, Trung, Harout
						var vendor = nlapiLookupField(rectype,recid,"entity");
						if(vendor!="7773" && vendor!="153" && vendor!="442500" && vendor!="46063" && vendor!="1223843")
						{
							nlapiLogExecution("error","Not syncing back Drop Ship field (blank). Not production vendor.");
							//return true;
							skipDropShipUpdate = true;
						}
					}
					
					//Update Sales Order
					var salesorder = record.getFieldValue("createdfrom");
					if(salesorder!=null && salesorder!="" && skipDropShipUpdate===false)
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
					
					//Update PO for Ship Date
					if(oldValue!=newValue)
					{
						if(newValue!=null && newValue!="")
						{
							if(nlapiGetOldRecord().getFieldValue("custbody_po_ship_date") != record.getFieldValue("custbody_po_ship_date"))
							{
								var shipdate = record.getFieldValue("custbody_po_ship_date");
								shipdate = add_workDay(1,nlapiStringToDate(record.getFieldValue("custbody_po_ship_date")));
								nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody59",nlapiDateToString(shipdate,"date"));
							}
							else
							{
								var shipdate = minus_workDay(1,nlapiStringToDate(record.getFieldValue("custbody39")));
								nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody_po_ship_date",nlapiDateToString(shipdate,"date"));
							}
						}
						else
						{
							nlapiLogExecution("debug","Updating Ship Date based off custbody59",record.getFieldValue("custbody59"));
							
							if(record.getFieldValue("custbody59")!=null && record.getFieldValue("custbody59")!="")
							{
								if(nlapiGetOldRecord().getFieldValue("custbody_po_ship_date")!=nlapiGetNewRecord().getFieldValue("custbody_po_ship_date"))
								{
									var shipdate = record.getFieldValue("custbody_po_ship_date");
									shipdate = add_workDay(1,nlapiStringToDate(record.getFieldValue("custbody_po_ship_date")));
									nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody59",nlapiDateToString(shipdate,"date"));
								}
								else
								{
									var shipdate = minus_workDay(1,nlapiStringToDate(record.getFieldValue("custbody59")));
									nlapiLogExecution("debug","New Ship Date",shipdate.toString());
									nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody_po_ship_date",nlapiDateToString(shipdate,"date"));
								}	
							}
						}
					}
					else if(checkNull(nlapiGetOldRecord().getFieldValue("custbody59"))!=checkNull(record.getFieldValue("custbody59")) && (newValue==null || newValue==""))
					{
						nlapiLogExecution("debug","custbody59 Was Changed - Updating Ship Date","custbody59: " + record.getFieldValue("custbody59"));
						
						if(record.getFieldValue("custbody59")!=null && record.getFieldValue("custbody59")!="")
						{
							if(nlapiGetOldRecord().getFieldValue("custbody_po_ship_date")!=nlapiGetNewRecord().getFieldValue("custbody_po_ship_date"))
								var shipdate = record.getFieldValue("custbody_po_ship_date");
							else
								var shipdate = minus_workDay(1,nlapiStringToDate(record.getFieldValue("custbody59")));
							
							nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody_po_ship_date",nlapiDateToString(shipdate,"date"));	
						}
					}
					else if(checkNull(nlapiGetOldRecord().getFieldValue("custbody6"))!=checkNull(record.getFieldValue("custbody6")))
					{
						nlapiLogExecution("debug","Delivery Date Was Changed - Updating Ship Date","Delivery Date: " + record.getFieldValue("custbody6"));
						
						if(record.getFieldValue("custbody39")!=null && record.getFieldValue("custbody39")!="")
						{
							if(nlapiGetOldRecord().getFieldValue("custbody_po_ship_date")!=nlapiGetNewRecord().getFieldValue("custbody_po_ship_date"))
								var shipdate = record.getFieldValue("custbody_po_ship_date");
							else
								var shipdate = minus_workDay(1,nlapiStringToDate(record.getFieldValue("custbody39")));
							
							nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody_po_ship_date",nlapiDateToString(shipdate,"date"));	
						}
					}
					else if(checkNull(nlapiGetOldRecord().getFieldValue("custbody_po_ship_date"))!=checkNull(record.getFieldValue("custbody_po_ship_date")))
					{
						nlapiLogExecution("debug","Ship Date Was Changed - Updating Date Needed In SF","Ship Date: " + record.getFieldValue("custbody_po_ship_date"));
						
						if(record.getFieldValue("custbody_po_ship_date")!=null && record.getFieldValue("custbody_po_ship_date")!="")
						{
							var dateNeededInSF = add_workDay(1,nlapiStringToDate(record.getFieldValue("custbody_po_ship_date")));
							
							nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody59",nlapiDateToString(dateNeededInSF,"date"));	
						}
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
					cols.push(new nlobjSearchColumn("custbody6"));
					var results = nlapiSearchRecord("salesorder",null,filters,cols);
					if(results)
					{
						for(var x=0; x < results.length; x++)
						{
							if(results[x].getValue("custbody6")!=null && results[x].getValue("custbody6")!="")
							{
								var shipdate = minus_workDay(1,nlapiStringToDate(results[x].getValue("custbody6")));
								nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),["custbody39","custbody_po_ship_date"],[dropShipDate,nlapiDateToString(shipdate,"date")]);
							}
							else
							{
								nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody39",dropShipDate);	
							}
							//nlapiSubmitField("purchaseorder",results[x].getValue("purchaseorder"),"custbody39",dropShipDate);
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

function minus_workDay(days, day) {
    for (var i = 1; i <= days; i++) {
        var day = nlapiAddDays(min_nearest_business_day(day), -1);
    }
    return day;
}

function add_workDay(days, day) {
    for (var i = 1; i <= days; i++) {
        day = nearest_business_day(nlapiAddDays(day, 1));
    }
    return day;
}

function nearest_business_day(day) {
    var weekday = day.getDay();

    if (weekday == 6 || weekday == 0 || is_holiday(day)) {
        return nearest_business_day(nlapiAddDays(day, 1));
    } else {
        return day;
    }
}

function min_nearest_business_day(day) {
    var weekday = day.getDay();
    //nlapiLogExecution('DEBUG', 'weekendeee ',weekday);
    if (weekday == 1) {
        //nlapiLogExecution('DEBUG', 'weekend ',1);
        return min_nearest_business_day(nlapiAddDays(day, -1));
    } else if (weekday == 0) {
        //nlapiLogExecution('DEBUG', 'weekend ',0);
        return min_nearest_business_day(nlapiAddDays(day, -1));
    } else if (is_holiday(day)) {
        //nlapiLogExecution('DEBUG', 'Is holiday ',7);
        return min_nearest_business_day(nlapiAddDays(day, -1));
    } else {
        return day;
    }

}

//holiday
function is_holiday(day) {
    var holiday = [];
    holiday.push("1/1/2013", "5/27/2013", "7/4/2013", "9/2/2013", "11/28/2013", "12/25/2013", "1/1/2014", "5/26/2014", "7/4/2014", "9/1/2014", "11/27/2014", "12/25/2014", "1/1/2015");
    day = nlapiDateToString(day);
    for (var i = 0; i < holiday.length; i++) {
        if (day == holiday[i]) {
            //nlapiLogExecution('DEBUG', 'holiday ',i);
            return true;
        }
    }
    return false;
}

function checkNull(value) {
	if(value==null)
		return "";
	else
		return value;
}
