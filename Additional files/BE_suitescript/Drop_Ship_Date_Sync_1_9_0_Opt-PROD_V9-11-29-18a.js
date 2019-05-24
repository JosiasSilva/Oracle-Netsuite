nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Drop_Ship_Date_Sync(type)
{
  if(type=="create" || type=="edit" || type=="xedit" || type=="specialorder")
  {
    try
    {
      var context = nlapiGetContext();
      var contextType = context.getExecutionContext();
      //if(contextType!="userinterface" && contextType!="userevent")
      if(contextType!="userinterface" && contextType!="userevent" && contextType !="scheduled" && contextType != "workflow" && contextType != "suitelet")
      {
        nlapiLogExecution("audit","Stopping script execution. Not triggered by UI.","Context: " + contextType);
        return true;
      }

      var recid = nlapiGetRecordId();
      var rectype = nlapiGetRecordType();
      var record = nlapiGetNewRecord();

      nlapiLogExecution("debug","Type",type);

      /* *****Added by Sandeep on 14 Jan 2017 - NS - 549 ****** */
      /* ******Pick up at BE and Pickup Location ***** */
      if(rectype=='salesorder')
      {
        var oldValuePickUpAtBE=checkNull(nlapiGetOldRecord().getFieldValue("custbody53"));
        var newValuePickUpAtBE=checkNull(nlapiLookupField(rectype,recid,"custbody53"));
        var oldValuePickUpLocation=checkNull(nlapiGetOldRecord().getFieldValue("custbody_pickup_location"));
        var newValuePickUpLocation=checkNull(nlapiLookupField(rectype,recid,"custbody_pickup_location"));

        if(oldValuePickUpAtBE!=newValuePickUpAtBE || oldValuePickUpLocation!=newValuePickUpLocation)
        {
          var purchaseorder=nlapiSearchRecord('purchaseorder',null,[new nlobjSearchFilter("createdfrom",null,"is",recid),new nlobjSearchFilter('mainline',null,"is",'T')],[new nlobjSearchColumn('custbody53'),new nlobjSearchColumn('custbody_pickup_location')]);

          if(purchaseorder)
          {
            for(var i=0;i<purchaseorder.length;i++)
            {
              nlapiSubmitField("purchaseorder",purchaseorder[i].getId(),"custbody53",newValuePickUpAtBE);
              nlapiSubmitField("purchaseorder",purchaseorder[i].getId(),"custbody_pickup_location",newValuePickUpLocation);
            }
          }
        }

        nlapiLogExecution("DEBUG","PICK UP AT BE","Old - "+oldValuePickUpLocation+", New -"+newValuePickUpLocation );
      }
      /* ***********************************End Pick up at BE and Pickup Location********************************** */




      if((type=="create" || type=="specialorder") && rectype=="purchaseorder" && (record.getFieldValue("custbody_linked_to_post_sale_order")!="T" || record.getFieldValue("custbody_exchange_po")=="T"))
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
            //Added By Rahul Panchal as per NS-974
            shipdate=nlapiDateToString(shipdate,"date");
            shipdate=chk_holiday(shipdate);
            shipdate=businessDay_date(shipdate); 
            // Ended	
            fields.push("custbody_po_ship_date");
            data.push(nlapiDateToString(shipdate,"date"));
          }
          else
          {
            //For drop ships, update to Ship Date to be one business day behind the Customer Delivery Date
            shipdate = minus_workDay(1,nlapiStringToDate(record.getFieldValue("custbody6")));
            //Added By Rahul Panchal as per NS-974
            shipdate=nlapiDateToString(shipdate,"date");
            shipdate=chk_holiday(shipdate);
            shipdate=businessDay_date(shipdate); 
            // Ended
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
            var vendor = nlapiGetNewRecord().getFieldValue("entity");
            var typeOfContact = nlapiLookupField("vendor",vendor,"custentity4");
            nlapiLogExecution("debug","Type of Contact: " + typeOfContact);

            if(typeOfContact=="6")
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
        else
        {
          //No sales order tied to purchase order. Still update ship date. (NS-385)
          var fields = [];
          var data = [];

          if(record.getFieldValue("custbody59")!=null && record.getFieldValue("custbody59")!="" && (record.getFieldValue("custbody39")==null || record.getFieldValue("custbody39")==""))
          {
            shipdate = minus_workDay(1,nlapiStringToDate(record.getFieldValue("custbody59")));
            //Added By Rahul Panchal as per NS-974
            shipdate=nlapiDateToString(shipdate,"date");
            shipdate=chk_holiday(shipdate);
            shipdate=businessDay_date(shipdate); 
            // Ended
            fields.push("custbody_po_ship_date");
            data.push(nlapiDateToString(shipdate,"date"));
          }
          else
          {
            //For drop ships, update to Ship Date to be one business day behind the Customer Delivery Date
            shipdate = minus_workDay(1,nlapiStringToDate(record.getFieldValue("custbody6")));
            //Added By Rahul Panchal as per NS-974
            shipdate=nlapiDateToString(shipdate,"date");
            shipdate=chk_holiday(shipdate);
            shipdate=businessDay_date(shipdate); 
            // Ended
            fields.push("custbody_po_ship_date");
            data.push(nlapiDateToString(shipdate,"date"));
          }

          if(fields.length > 0 && data.length > 0)
          {
            nlapiSubmitField("purchaseorder",recid,fields,data);
          }
        }
      }
      else if(type=="edit")
      {
        var dc = 0; //added by ajay 20April 2017
        var oldValue = checkNull(nlapiGetOldRecord().getFieldValue("custbody39"));
        var newValue = checkNull(nlapiLookupField(rectype,recid,"custbody39"));
        var vendors = record.getFieldValues("custbody_drop_ship_vendor");

        var skipDropShipUpdate = false;

        if(newValue==null || newValue=="")
        {
          //Ensure the PO is from a production vendor if pushing back blank value
          //Production vendor = USNY, CH, Miracleworks, Trung, Harout
          var vendor = nlapiLookupField(rectype,recid,"entity");
          var typeOfContact = nlapiLookupField("vendor",vendor,"custentity4");
          nlapiLogExecution("debug","Type of Contact: " + typeOfContact);

          if(typeOfContact!="6")
          {
            nlapiLogExecution("error","Not syncing back Drop Ship field (blank). Not production vendor.");
            //return true;
            skipDropShipUpdate = true;
          }

          if(record.getFieldValue("createdfrom")!=null && record.getFieldValue("createdfrom")!="")
          {
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
          //Added by ajay 20April 2017
          var itemCount = soRec.getLineItemCount("item");
          for(var m=1; m<=itemCount; m++)
          {
            var po = soRec.getLineItemValue("item","createdpo",m);
            if(po !=null && po !="")
            {
              var dropship = nlapiLookupField("purchaseorder",po,"custbody39");
              if(dropship !=null && dropship !="")
              {
                dc = 1;
              }
            }
          }
          //Ended by ajay 20April 2017

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
                //added by ajay 20April 2017
                if(dc == 0)
                {
                  soRec.setFieldValue("custbody39",newValue);
                }
                //Ended by ajay 20April 2017
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
            if(checkNull(nlapiGetOldRecord().getFieldValue("custbody_po_ship_date"))!=checkNull(record.getFieldValue("custbody_po_ship_date")))
            {
              var shipdate = record.getFieldValue("custbody_po_ship_date");
              shipdate = add_workDay(1,nlapiStringToDate(record.getFieldValue("custbody_po_ship_date")));
              nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody59",nlapiDateToString(shipdate,"date"));
            }
            else if(record.getFieldValue("custbody6")!=null && record.getFieldValue("custbody6")!="")
            {
              var shipdate = minus_workDay(1,nlapiStringToDate(record.getFieldValue("custbody6")));
              //Added By Rahul Panchal as per NS-974
              shipdate=nlapiDateToString(shipdate,"date");
              shipdate=chk_holiday(shipdate);
              shipdate=businessDay_date(shipdate); 
              // Ended
              nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody_po_ship_date",nlapiDateToString(shipdate,"date"));
            }
          }
          else
          {
            nlapiLogExecution("debug","Updating Ship Date based off custbody59",record.getFieldValue("custbody59"));

            if(record.getFieldValue("custbody59")!=null && record.getFieldValue("custbody59")!="")
            {
              //nlapiLogExecution("debug","old ship date is :",record.getFieldValue("custbody_po_ship_date"));
              //nlapiLogExecution("debug","new ship date is :",nlapiGetNewRecord().getFieldValue("custbody_po_ship_date"));
              if(checkNull(record.getFieldValue("custbody_po_ship_date"))!=checkNull(nlapiGetNewRecord().getFieldValue("custbody_po_ship_date")))
              {
                nlapiLogExecution("debug","ship date changed");
                var shipdate = record.getFieldValue("custbody_po_ship_date");
                shipdate = add_workDay(1,nlapiStringToDate(record.getFieldValue("custbody_po_ship_date")));
                nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody59",nlapiDateToString(shipdate,"date"));
              }
              else
              {
                var shipdate = minus_workDay(1,nlapiStringToDate(record.getFieldValue("custbody59")));
                //Added By Rahul Panchal as per NS-974
                shipdate=nlapiDateToString(shipdate,"date");
                shipdate=chk_holiday(shipdate);
                shipdate=businessDay_date(shipdate); 
                // Ended
                nlapiLogExecution("debug","New Ship Date",shipdate.toString());
                nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody_po_ship_date",nlapiDateToString(shipdate,"date"));
              }
            }
          }
          //PushOnPortal(); //Added by ajay 09Dec 2016
        }
        else if(checkNull(nlapiGetOldRecord().getFieldValue("custbody59"))!=checkNull(record.getFieldValue("custbody59")) && (newValue==null || newValue==""))
        {
          nlapiLogExecution("debug","custbody59 Was Changed - Updating Ship Date","custbody59: " + record.getFieldValue("custbody59"));

          if(record.getFieldValue("custbody59")!=null && record.getFieldValue("custbody59")!="")
          {
            if(checkNull(nlapiGetOldRecord().getFieldValue("custbody_po_ship_date"))!=checkNull(nlapiGetNewRecord().getFieldValue("custbody_po_ship_date")))
              var shipdate = nlapiStringToDate(record.getFieldValue("custbody_po_ship_date"));
            else
              var shipdate = minus_workDay(1,nlapiStringToDate(record.getFieldValue("custbody59")));
            //Added By Rahul Panchal as per NS-974
            shipdate=nlapiDateToString(shipdate,"date");
            shipdate=chk_holiday(shipdate);
            shipdate=businessDay_date(shipdate); 
            // Ended

            nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody_po_ship_date",nlapiDateToString(shipdate,"date"));	

            //PushOnPortal(); //Added by ajay 09Dec 2016
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
            if(checkNull(nlapiGetOldRecord().getFieldValue("custbody_po_ship_date"))!=checkNull(nlapiGetNewRecord().getFieldValue("custbody_po_ship_date")))
              var shipdate = record.getFieldValue("custbody_po_ship_date");
            else
              var shipdate = minus_workDay(1,nlapiStringToDate(record.getFieldValue("custbody6")));
            //Added By Rahul Panchal as per NS-974
            shipdate=nlapiDateToString(shipdate,"date");
            shipdate=chk_holiday(shipdate);
            shipdate=businessDay_date(shipdate); 
            // Ended

            nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody_po_ship_date",nlapiDateToString(shipdate,"date"));

            //PushOnPortal(); //Added by ajay 09Dec 2016
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
        if(newValue!=null && newValue!="")
        {
          nlapiLogExecution("debug","Test ajay3");
          nlapiSubmitField("purchaseorder",nlapiGetRecordId(),["custbody_po_ship_date","custbody59"],[nlapiGetFieldValue("custbody59"),nlapiGetFieldValue("custbody59")]);
          PushOnPortal(); //Added by ajay 06May 2017
        }
        else
        {
          PushOnPortal(); //Added by ajay 09May 2017
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
        if(checkNull(nlapiGetOldRecord().getFieldValue("custbody39"))!=checkNull(nlapiGetNewRecord().getFieldValue("custbody39")) && nlapiGetNewRecord().getFieldValue("custbody39")!=null)
        {
          nlapiLogExecution("debug","Drop Ship Date Changed via Inline Edit");
          nlapiLogExecution("debug","Old Drop Ship Date Value",nlapiGetOldRecord().getFieldValue("custbody39"));
          nlapiLogExecution("debug","NEW Drop Ship Date Value",nlapiGetNewRecord().getFieldValue("custbody39"));

          if(dropShipDate==null || dropShipDate=="")
          {
            //Ensure the PO is from a production vendor if pushing back blank value
            //Production vendor = USNY, CH, Miracleworks, Trung, Harout
            var vendor = nlapiLookupField(rectype,recid,"entity");
            var typeOfContact = nlapiLookupField("vendor",vendor,"custentity4");
            nlapiLogExecution("debug","Type of Contact: " + typeOfContact);

            if(tpyeOfContact!="6")
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
        else if(checkNull(nlapiGetOldRecord().getFieldValue("custbody59"))!=checkNull(nlapiGetNewRecord().getFieldValue("custbody59")) && nlapiGetNewRecord().getFieldValue("custbody59")!=null)
        {
          nlapiLogExecution("debug","Date Needed in SF Changed via Inline Edit");
          //Handles changes to Date Needed in SF, Update Ship Date
          if(nlapiLookupField("purchaseorder",nlapiGetRecordId(),"custbody_linked_to_post_sale_order")!="T" || nlapiLookupField("purchaseorder",nlapiGetRecordId(),"custbody_exchange_po")=="T")
          {
            var shipDate = minus_workDay(1,nlapiStringToDate(nlapiGetNewRecord().getFieldValue("custbody59")));
            //Added By Rahul Panchal as per NS-974
            shipdate=nlapiDateToString(shipdate,"date");
            shipdate=chk_holiday(shipdate);
            shipdate=businessDay_date(shipdate); 
            // Ended
            nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody_po_ship_date",nlapiDateToString(shipDate,"date"));

            PushOnPortal(); //Added by ajay 09Dec 2016
          }
        }
        else if(checkNull(nlapiGetOldRecord().getFieldValue("custbody_po_ship_date"))!=checkNull(nlapiGetNewRecord().getFieldValue("custbody_po_ship_date")) && nlapiGetNewRecord().getFieldValue("custbody_po_ship_date")!=null)
        {
          nlapiLogExecution("debug","Ship Date Changed via Inline Edit");
          //Handles changes to Ship Date, Update Date Needed in SF
          if(nlapiLookupField("purchaseorder",nlapiGetRecordId(),"custbody_linked_to_post_sale_order")!="T" || nlapiLookupField("purchaseorder",nlapiGetRecordId(),"custbody_exchange_po")=="T")
          {
            var dateNeedInSF = add_workDay(1,nlapiStringToDate(nlapiGetNewRecord().getFieldValue("custbody_po_ship_date")));
            nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody59",nlapiDateToString(dateNeedInSF,"date"));
          }
        }
        /******************************************Start Added By Yagya Kumar Nag for PP-293 new task 26/10/2017 ***************/
        else if(rectype=='purchaseorder')
        {
          var old_shipping_label = nlapiGetOldRecord().getFieldValue("custbody_fedex_shipping_label");
          var new_shipping_label = nlapiGetNewRecord().getFieldValue("custbody_fedex_shipping_label");
          if(old_shipping_label != new_shipping_label)
          {						
            nlapiLogExecution("debug","push fedex_shipping_label file to portal");
            PushOnPortal();
          }
        }
        /******************************************End Added By Yagya Kumar Nag for PP-293 new task 26/10/2017 ***************/				

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


//Push PO to Portal function 09Dec By Ajay
function PushOnPortal()
{
  var obj = new Object(); 
  var poId = nlapiGetRecordId();
  var pushtoportal = nlapiLookupField("purchaseorder",poId,"custbody_pushtoportal");
  nlapiLogExecution("debug","Push to PO is : ",pushtoportal);
  var pushrevisedpo = nlapiLookupField("purchaseorder",poId,"custbody_pushrevisedpo");
  nlapiLogExecution("debug","Revised PO is : ",pushrevisedpo);

  if(pushtoportal == 'T' && pushrevisedpo == 'F')
  {                            
    obj = PushPOToPortal(poId,"161");
  }
  else if(pushrevisedpo == 'T')
  {
    obj = PushRevisedPOToPortal(poId,"161");
  }	
}
//Ended by Ajay

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

// Added By Rahul Panchal as Per NS-974 on dated 22/11/2017

function chk_holiday(ship_date){
  var new_ship_date1='';
  var  secrh_holiday=  nlapiSearchRecord('customrecordholiday_table_child',null,new nlobjSearchFilter ('custrecord_holiday_date' ,null, 'on' ,ship_date ));
  if(secrh_holiday){
    ship_date=nlapiStringToDate(ship_date);
    var new_ship_date1= nlapiAddDays(ship_date, -1);
  }
  else{
    new_ship_date1=ship_date;
    new_ship_date1=nlapiStringToDate(new_ship_date1);
  }
  return new_ship_date1;
}

function businessDay_date(nextBusinessDay){
  var next_date='';
  var day = nextBusinessDay.getDay();
  if(day=='0' || day=='6'){
    switch(nextBusinessDay.getDay())
    {
      case 0:
        nextBusinessDay = nlapiAddDays(nextBusinessDay,-2);
        break;			
      case 6: 
        nextBusinessDay = nlapiAddDays(nextBusinessDay,-1);
        break; 		
    }
  }
  next_date = nextBusinessDay; //nlapiDateToString(nextBusinessDay,"date");
  return next_date;	
}
