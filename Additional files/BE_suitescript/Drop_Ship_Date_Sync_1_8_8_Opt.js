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
					
					if(record.getFieldValue("custbody59")!=null && record.getFieldValue("custbody59")!="" && (record.getFieldValue("custbody39")==null || record.getFieldValue("custbody39")==""))
					{
						shipdate = minus_workDay(1,nlapiStringToDate(record.getFieldValue("custbody59")));
						fields.push("custbody_po_ship_date");
						data.push(nlapiDateToString(shipdate,"date"));
					}
					else
					{
						//For drop ships, update to Ship Date to be one business day behind the Customer Delivery Date
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
					
					var filters = [];
					filters.push(new nlobjSearchFilter("createdfrom",null,"is",record.getFieldValue("createdfrom")));
					filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
					filters.push(new nlobjSearchFilter("internalid",null,"noneof",nlapiGetRecordId()));
					var cols = [];
					cols.push(new nlobjSearchColumn("custbody39"));
					var results = nlapiSearchRecord("purchaseorder",null,filters,cols);
					if(results)
					{
						var allEmpty = true;
						for(var x=0; x < results.length; x++)
						{
							if(results[x].getValue("custbody39")!=null && results[x].getValue("custbody39")!="")
							{
								allEmpty = false;
								break;
							}
						}
						
						if(allEmpty==true)
							skipDropShipUpdate = false;
						else
							skipDropShipUpdate = true;
					}
					else
					{
						//No other purchase orders found, OK to update
						skipDropShipUpdate = false;
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
								if(skipDropShipUpdate===false)
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
										nlapiLogExecution("debug","Removing Vendor",newVendors[z]);
										newVendors.splice(z,1);
										z--;
									}
								}	
							}
							
							if(newVendors.length == 0)
								soRec.setFieldValue("custbody_drop_ship_vendor","");
							else
								soRec.setFieldValues("custbody_drop_ship_vendor",newVendors);
							
							if(skipDropShipUpdate===false)
							{
								if(newVendors.length == 0)
									soRec.setFieldValue("custbody39","");
								else
									soRec.setFieldValue("custbody39",newValue);
							}	
						}
					}
					
					nlapiSubmitRecord(soRec,true,true);
				}
					
				//Update PO for Ship Date
				if(oldValue!=newValue)
				{					
					if(newValue!=null && newValue!="")
					{                       
						//if(nlapiGetOldRecord().getFieldValue("custbody_po_ship_date") != record.getFieldValue("custbody_po_ship_date"))
						if(checkNull(nlapiGetOldRecord().getFieldValue("custbody_po_ship_date"))!=checkNull(record.getFieldValue("custbody_po_ship_date")))
						{
							var shipdate = record.getFieldValue("custbody_po_ship_date");
							shipdate = add_workDay(1,nlapiStringToDate(record.getFieldValue("custbody_po_ship_date")));
							nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody59",nlapiDateToString(shipdate,"date"));
						}
						else
						{					                                 
							var shipdate = minus_workDay(1,nlapiStringToDate(record.getFieldValue("custbody6")));
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
                    //Push To PO on Portal - Added by Ajay 13Oct 2016
					var poId = nlapiGetRecordId();
					var pushtoportal = nlapiLookupField("purchaseorder",poId,"custbody_pushtoportal");
					nlapiLogExecution("debug","Push to PO is : ",pushtoportal);
					var pushrevisedpo = nlapiLookupField("purchaseorder",poId,"custbody_pushrevisedpo");
					nlapiLogExecution("debug","Revised PO is : ",pushrevisedpo);
					
					if(pushtoportal == 'T' && pushrevisedpo == 'F')
					{                            
						PushPOToPortal(poId);
					}
					else if(pushrevisedpo == 'T')
					{
						PushPORevisedDataNSToPortal(poId);
					}
					//Ended by Ajay
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
                                                    
                                                    //Push To PO on Portal - Added by Ajay 18July 2016
						var poId = nlapiGetRecordId();
						var pushtoportal = nlapiLookupField("purchaseorder",poId,"custbody_pushtoportal");
						nlapiLogExecution("debug","Push to PO is : ",pushtoportal);
						var pushrevisedpo = nlapiLookupField("purchaseorder",poId,"custbody_pushrevisedpo");
						nlapiLogExecution("debug","Revised PO is : ",pushrevisedpo);
						
						if(pushtoportal == 'T' && pushrevisedpo == 'F')
						{                            
							PushPOToPortal(poId);
						}
						else if(pushrevisedpo == 'T')
						{
							PushPORevisedDataNSToPortal(poId);
						}
						//Ended by Ajay
					}
				}
				else if(checkNull(nlapiGetOldRecord().getFieldValue("custbody6"))!=checkNull(record.getFieldValue("custbody6")))
				{
					nlapiLogExecution("debug","Delivery Date Was Changed - Updating Ship Date","Delivery Date: " + record.getFieldValue("custbody6"));
			//------------------My Account Info Check on PO Delivery date updated - Added By Rahul Panchal on 22-07-2016------------------------------		
					var poId = nlapiGetRecordId();
					nlapiLogExecution("debug","purchase Order Id is",+poId,poId);
					if(poId!='' || poId!=null)
					{
						MyAccInfo_upd_PO_date_Chng(poId);
					}
			//------------------ended By Rahul Panchal on 22-07-2016------------------------------		
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
			else if(type=="xedit")
			{
				nlapiLogExecution("debug","Running Xedit Routine...");
				
				//Get Drop Ship Materials sent to Vendor field value
				var dropShipDate = nlapiLookupField(rectype,recid,"custbody39");

				nlapiLogExecution("debug","Old Date Needed in SF Value",nlapiGetOldRecord().getFieldValue("custbody59"));
				nlapiLogExecution("debug","NEW Date Needed in SF Value",nlapiGetNewRecord().getFieldValue("custbody59"));
				
				//Only update if Drop Ship Materials field is changed in inline edit mode
				if(nlapiGetOldRecord().getFieldValue("custbody39")!=nlapiGetNewRecord().getFieldValue("custbody39") && nlapiGetNewRecord().getFieldValue("custbody39")!=null)
				{
					nlapiLogExecution("debug","Drop Ship Date Changed via Inline Edit");
					nlapiLogExecution("debug","Old Drop Ship Date Value",nlapiGetOldRecord().getFieldValue("custbody39"));
					nlapiLogExecution("debug","NEW Drop Ship Date Value",nlapiGetNewRecord().getFieldValue("custbody39"));
					
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
				else if(nlapiGetOldRecord().getFieldValue("custbody59")!=nlapiGetNewRecord().getFieldValue("custbody59") && nlapiGetNewRecord().getFieldValue("custbody59")!=null)
				{
					nlapiLogExecution("debug","Date Needed in SF Changed via Inline Edit");
					//Handles changes to Date Needed in SF, Update Ship Date
					if(nlapiLookupField("purchaseorder",nlapiGetRecordId(),"custbody_linked_to_post_sale_order")!="T")
					{
						var shipDate = minus_workDay(1,nlapiStringToDate(nlapiGetNewRecord().getFieldValue("custbody59")));
						nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody_po_ship_date",nlapiDateToString(shipDate,"date"));
                                                    
						//Push To PO on Portal - Added by Ajay 18July 2016
						var poId = nlapiGetRecordId();
						var pushtoportal = nlapiLookupField("purchaseorder",poId,"custbody_pushtoportal");
						nlapiLogExecution("debug","Push to PO is : ",pushtoportal);
						var pushrevisedpo = nlapiLookupField("purchaseorder",poId,"custbody_pushrevisedpo");
						nlapiLogExecution("debug","Revised PO is : ",pushrevisedpo);
						
						if(pushtoportal == 'T' && pushrevisedpo == 'F')
						{                            
							PushPOToPortal(poId);
						}
						else if(pushrevisedpo == 'T')
						{
							PushPORevisedDataNSToPortal(poId);
						}
						//Ended by Ajay
					}
				}
				else if(nlapiGetOldRecord().getFieldValue("custbody_po_ship_date")!=nlapiGetNewRecord().getFieldValue("custbody_po_ship_date") && nlapiGetNewRecord().getFieldValue("custbody_po_ship_date")!=null)
				{
					nlapiLogExecution("debug","Ship Date Changed via Inline Edit");
					//Handles changes to Ship Date, Update Date Needed in SF
					if(nlapiLookupField("purchaseorder",nlapiGetRecordId(),"custbody_linked_to_post_sale_order")!="T")
					{
						var dateNeedInSF = add_workDay(1,nlapiStringToDate(nlapiGetNewRecord().getFieldValue("custbody_po_ship_date")));
						nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody59",nlapiDateToString(dateNeedInSF,"date"));
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
              
                //Added new code by ajay 13Oct 2016
			    var cad_file_name = POObj.getFieldValue('custbody_internal_cad_file_name');
			    if(cad_file_name == null || cad_file_name == '')
			    {
			        cad_file_name = null;
			    }                
			    var approved_to_grow_confirmation = POObj.getFieldValue('custbody_grow_confirmation'); //Approved to grow confirmation
		        if(approved_to_grow_confirmation == '' || approved_to_grow_confirmation == null) 
		        {				   
					approved_to_grow_confirmation = null;
		        }			    
                var onVendorPortal = POObj.getFieldValue('custbody_on_vendor_portal');
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
                    "on_vendor_portal" : onVendorPortal,
                    "approved_to_grow_confirmation" : approved_to_grow_confirmation,
					"internal_cad_file_name" : cad_file_name
                }; 
            }
			//Setting up URL of CDP             			
			var url = "https://partner.brilliantearth.com/api/production/po/";
		        //var url = "https://testportal.brilliantearth.com/api/production/po/";  //for sandbox
		    
			   
			//Setting up Headers 
			var headers = new Array(); 
			headers['http'] = '1.1';    
			headers['Accept'] = 'application/json';       			
			headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';
		        //headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //for sandbox
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
                    nlapiSubmitField('purchaseorder',poId,['custbody_portal_status','custbody_pushtoportal'],[portalStatus,'T']);    
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
              
               //Added new code by ajay 13Oct 2016
			    var cad_file_name = POObj.getFieldValue('custbody_internal_cad_file_name');
			    if(cad_file_name == null || cad_file_name == '')
			    {
			        cad_file_name = null;
			    }                
			    var approved_to_grow_confirmation = POObj.getFieldValue('custbody_grow_confirmation'); //Approved to grow confirmation
		        if(approved_to_grow_confirmation == '' || approved_to_grow_confirmation == null) 
		        {				   
					approved_to_grow_confirmation = null;
		        }			    
                var onVendorPortal = POObj.getFieldValue('custbody_on_vendor_portal');
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
                    "on_vendor_portal" : onVendorPortal,
                    "approved_to_grow_confirmation" : approved_to_grow_confirmation,
					"internal_cad_file_name" : cad_file_name
                  }; 
            }
			//Setting up URL of CDP             					
			var url = "https://partner.brilliantearth.com/api/production/revised-po/";
		        //var url = "https://testportal.brilliantearth.com/api/production/revised-po/"; //for sandbox
			   
			//Setting up Headers 
			var headers = new Array(); 
			headers['http'] = '1.1';    
			headers['Accept'] = 'application/json';       					
			headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';
		        //headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //for sandbox
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
				nlapiLogExecution("debug","Revised PO successfully pushed to Portal.");
				try
				{                                                    
					nlapiSubmitField('purchaseorder',poId,['custbody_portal_status','custbody_pushrevisedpo'],[portalStatus,'T']);                                                   
				}
				catch(err){
				}
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
//------------------Added By Rahul Panchal on 22-07-2016------------------------------

function MyAccInfo_upd_PO_date_Chng(poId)
{
   try
	{
		 if(poId!='' || poId!=null)
		 {
			  var poObj=nlapiLoadRecord('purchaseorder',poId);
			  var soId=poObj.getFieldValue('createdfrom');
			  if(soId!='' || soId!=null)
			  {
			  	nlapiLogExecution("debug","sales Order Id is:",+soId,soId);
			    var soObj=nlapiLoadRecord('salesorder',soId);
				var soStatus=soObj.getFieldValue("status");
				var orderType=soObj.getFieldValue("custbody87");
				var MyAccount_WebInfo=soObj.getFieldValue("custbody_my_account_info_on_web");
				if((orderType==1 || orderType==5) && soStatus!="Pending Approval")
				{
				  var po_deldate=poObj.getFieldValue('custbody6');
				  if(po_deldate!='' || po_deldate!=null)
				    {			 
					   MyAccount_WebInfo="T";
				  	   nlapiSubmitField("salesorder",soId,"custbody_my_account_info_on_web",MyAccount_WebInfo);							
				       nlapiLogExecution("debug","Current value of My Account Web Information is :",MyAccount_WebInfo);
					   nlapiLogExecution("debug","Delivery date changed successfully :",poId);
				    }
				  else
					 {
					  nlapiLogExecution("debug","Delivery date not changed successfully :",poId);
					 }
				}
				else
				{
				  nlapiLogExecution("debug","sales Order condition not matched ",soId);
				}
			  }
			  else
			  {
			    nlapiLogExecution("debug","PO not created from SO",soId);
			  }
		}
	}
	catch(err)
	{
	  nlapiLogExecution("debug","error occuring in PO",poId);
	}
  
}

