nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Update_Sold_Diamonds(type)
{
  if(type=="create")
  {
    try
    {
      //Added by ajay 10April 2017
      var context = nlapiGetContext();
      var contextType = context.getExecutionContext();
      var recordType = nlapiGetRecordType();
      if(contextType!="userinterface" && contextType!="userevent" && contextType!="suitelet")
      {
        //nlapiLogExecution("debug","Stopping script execution. Not triggered by UI.","Context: " + contextType);
        return true;
      }
      //Ended by ajay 10April 2017

      //Check over items for loose diamonds
      var order = nlapiLoadRecord("salesorder",nlapiGetRecordId());

      for(var x=0; x < order.getLineItemCount("item"); x++)
      {
        var cdp = null;
        var custom_diamond = null;

        try
        {
          nlapiLogExecution("debug", "Item #", order.getLineItemText("item", "item", x + 1));

          //Get item ID, location, and qty available from line
          var item = order.getLineItemValue("item", "item", x + 1);
          var available = order.getLineItemValue("item", "quantityavailable", x + 1);
          var committed = order.getLineItemValue("item", "quantitycommitted", x + 1);
          var location = order.getLineItemValue("item", "location", x + 1);
          var rate = order.getLineItemValue("item", "rate", x + 1);
          if (available == null || available == "") 
            available = 0;
          if (committed == null || committed == "") 
            committed = 0;

          //Get Category and Status (Item) fields from inventory item record
          var item_obj = nlapiLookupField("item", item, ["custitem20", "custitem97", "quantityavailable", "custitemcertificate_included", "custitem198","quantityonhand"]);

          if(item_obj.custitem20 == "7" || (item_obj.custitem20 == "18" && item_obj.custitem198 == "T"))
          {
            var logId = Create_CDP_Log("Sales order creation",order.getFieldValue("entity"),item,nlapiGetRecordId());

            //Check if existing CDP was created in last five minutes
            var filters = [];
            var createdFormula = new nlobjSearchFilter("formulanumeric", null, "greaterthan", "-5");
            createdFormula.setFormula("({created} - {today}) * 24 * 60");
            filters.push(createdFormula);
            filters.push(new nlobjSearchFilter("custrecord_be_diamond_stock_number", null, "is", item));
            var results = nlapiSearchRecord("customrecord_custom_diamond", null, filters);
            if(results)
            {
              nlapiLogExecution("debug", "CDP " + results[0].getId() + " was created in the past 5 minutes. Not creating a dup...");
              //continue;
              cdp = nlapiLoadRecord("customrecord_custom_diamond", results[0].getId());
            }

            //Update item record to status = Sold and set Sold Date to today
            var itemRec = nlapiLoadRecord("inventoryitem", item);
            itemRec.setFieldValue("custitem97", "1");
            itemRec.setFieldValue("custitem_diamond_sold_date", nlapiDateToString(new Date()));

            //Check for PO's for diamond. If none exist, set item as special order item.
            var filters = [];
            filters.push(new nlobjSearchFilter("item", null, "is", item));
            var results = nlapiSearchRecord("purchaseorder", null, filters);
            if(!results)
            {
              itemRec.setFieldValue("isspecialorderitem", "T");
            }

            nlapiSubmitRecord(itemRec, true, true);

            //Check on transit quantity
            var transit = 0.00;
            var filters = [];
            filters.push(new nlobjSearchFilter("locationquantityintransit", null, "greaterthan", "0.00"));
            filters.push(new nlobjSearchFilter("internalid", null, "is", item));
            var results = nlapiSearchRecord("item", null, filters);
            if(results)
            {
              transit = 1;
            }

            //Check if diamond is available in San Francisco
            if(location == "2" && (parseFloat(available) > 0 || parseFloat(committed) > 0 || parseFloat(transit) > 0))
            {
              nlapiLogExecution("debug", "Diamond is available in SF");

              //Create custom diamond record

              //Do not create CDP for "Custom Diamond" inventory item
              if (item == "19785") 
                return true;

              if (cdp != null) 
                custom_diamond = cdp;
              else 
                custom_diamond = nlapiCreateRecord("customrecord_custom_diamond");

              custom_diamond.setFieldValue("custrecord_custom_diamond_request_type", "1");
              //custom_diamond.setFieldValue("custrecord_diamond_status","1");
              custom_diamond.setFieldValue("custrecord_be_diamond_stock_number", item);
              custom_diamond.setFieldValue("custrecord_diamond_customer_name", order.getFieldValue("entity"));
              custom_diamond.setFieldValue("custrecord_diamond_so_order_number", nlapiGetRecordId());
              custom_diamond.setFieldValue("custrecord_diamond_inventory_location", location);
              custom_diamond.setFieldValue("custrecord_diamond_eta", order.getFieldValue("custbody146"));
              custom_diamond.setFieldValue("custrecord_diamond_sales_rep", order.getFieldValue("salesrep"));


              custom_diamond.setFieldValue("custrecord_diamond_email_status", "1");
              custom_diamond.setFieldValue("custrecord_custom_diamond_price", rate);
              custom_diamond.setFieldValue("custrecord_custom_diamond_currency", order.getFieldValue("currency"));
              var pla = nlapiLookupField("item", item, "custitem_pla");
              nlapiLogExecution("debug","PLA diamonds T/F:(Test 1 From Sales Order)",pla);
              if(pla=="T")
              {
                custom_diamond.setFieldValue("custrecord_cdp_pla",pla);
                custom_diamond.setFieldValue("custrecord_diamond_status",3);	 
              }
              else
                custom_diamond.setFieldValue("custrecord_cdp_pla",pla);

              if(item_obj.custitemcertificate_included == "2" || item_obj.custitemcertificate_included == '' || item_obj.custitemcertificate_included == null) 
                custom_diamond.setFieldValue("custrecord_cdp_group_a", "T");
              else if(item_obj.custitemcertificate_included == "1")
              {
                custom_diamond.setFieldValue("custrecord_diamond_email_status", "2"); //Email Status = Emailed
                custom_diamond.setFieldValue("custrecord_cdp_group_b", "T"); //Mark Group B
                custom_diamond.setFieldValue("custrecord_diamond_status", "1"); //Diamond Status = Confirmed
                custom_diamond.setFieldValue("custrecord_diamond_confirmed", "1"); //Diamond Confirmed = Yes
                custom_diamond.setFieldValue("custrecord_diamond_email_status", "5"); //Email Status = Batch Email
                nlapiSubmitField("salesorder", nlapiGetRecordId(), "custbody132", "1");
              }
              //Check vendor record for 'Block automated emails' checkbox
              var vendor = nlapiLookupField("item", item, "vendor");
              if(vendor != null && vendor != "")
              {
                var blockEmails = nlapiLookupField("vendor", vendor, "custentityblock_automated_emails");
                if (blockEmails == "T") 
                  custom_diamond.setFieldValue("custrecord_diamond_email_status", "3");
              }
              //Set Email Status to Order on Website if vendor is Hari Krishna or Monarch or Kiran or Kapu India or Laxmi or JB or Blue Star
              if(vendor == "28712" || vendor == "236761" || vendor == "2325705" || vendor == "2550863" || vendor == "2551373" || vendor == "3132473" || vendor == "3432901" || vendor == "3192228" || vendor == "4215082")
              {
                custom_diamond.setFieldValue("custrecord_diamond_email_status", "4");
              }
              //Override Email Status to Manual if CDP parent item starts with "Y"
              var itemNum = order.getLineItemText("item", "item", x + 1);
              if(itemNum != null && itemNum != "" && itemNum.charAt(0) == "Y")
              {
                custom_diamond.setFieldValue("custrecord_diamond_email_status", "3"); //Set Email Status to Manual Email
              }
              var cdpId = nlapiSubmitRecord(custom_diamond, true, true);
              nlapiLogExecution("debug", "New Created CDP id is : ", cdpId +" having PLA diamond value(T/F) is : "+ pla + " in if part");
              //Update item record with new price
              if(order.getFieldValue("currency") == "1")
              {
                var itemMaster = nlapiLoadRecord("inventoryitem", item);
                var priceCount = itemMaster.getLineItemCount('price');
                if(priceCount)
                {
                  for(var i = 1; i <= priceCount; i++)
                  {
                    var curr_cur = itemMaster.getLineItemValue('price', 'currency', i);
                    if(curr_cur == '1')
                    {
                      itemMaster.selectLineItem('price', i);
                      itemMaster.setCurrentLineItemMatrixValue('price', 'price', 1, rate);
                      itemMaster.commitLineItem('price');
                      break;
                    }
                  }
                }
                nlapiSubmitRecord(itemMaster, true, true);
              }
              var filters = [];
              filters.push(new nlobjSearchFilter("item", null, "is", item));
              var results = nlapiSearchRecord("purchaseorder", null, filters);
              if(!results)
              {
                nlapiSubmitField("inventoryitem", item, "isspecialorderitem", "T");
              }
            }
            else
            {
              //Diamond IS NOT in SF or IS NOT available > 0 -- Create custom diamond page

              //Create custom diamond record
              nlapiLogExecution("debug", "Creating new custom diamond record.");

              //Do not create CDP for "Custom Diamond" inventory item
              if(item == "19785") 
                return true;

              if(cdp != null) 
                custom_diamond = cdp;
              else 
                custom_diamond = nlapiCreateRecord("customrecord_custom_diamond");
              custom_diamond.setFieldValue("custrecord_custom_diamond_request_type", "1");
              //custom_diamond.setFieldValue("custrecord_diamond_status","1");
              custom_diamond.setFieldValue("custrecord_be_diamond_stock_number", item);
              custom_diamond.setFieldValue("custrecord_diamond_customer_name", order.getFieldValue("entity"));
              custom_diamond.setFieldValue("custrecord_diamond_so_order_number", nlapiGetRecordId());
              custom_diamond.setFieldValue("custrecord_diamond_inventory_location", location);
              custom_diamond.setFieldValue("custrecord_diamond_eta", order.getFieldValue("custbody146"));
              custom_diamond.setFieldValue("custrecord_diamond_sales_rep", order.getFieldValue("salesrep"));

              custom_diamond.setFieldValue("custrecord_diamond_email_status", "1");
              custom_diamond.setFieldValue("custrecord_custom_diamond_price", rate);
              custom_diamond.setFieldValue("custrecord_custom_diamond_currency", order.getFieldValue("currency"));
              //custom_diamond.setFieldValue("custrecord_cdp_pla", nlapiLookupField("item", item, "custitem_pla"));
              var pla = nlapiLookupField("item", item, "custitem_pla");
              nlapiLogExecution("debug","PLA diamonds T/F:(Test 1 From Sales Order in else part)",pla);
              if(pla=="T")
              {
                custom_diamond.setFieldValue("custrecord_cdp_pla",pla);
                custom_diamond.setFieldValue("custrecord_diamond_status",3);	 
              }
              else
                custom_diamond.setFieldValue("custrecord_cdp_pla",pla);
              nlapiLogExecution("debug","Quantity on Hand",item_obj.quantityonhand);
              nlapiLogExecution("debug","Available Quantity",item_obj.quantityavailable);
              nlapiLogExecution("debug","Committed",committed);
              nlapiLogExecution("debug","Transit",transit);
              if(parseInt(item_obj.quantityavailable) > 0 || parseInt(item_obj.quantityonhand) > 0 ||  parseInt(committed) > 0 || parseFloat(transit) > 0)
              {
                if (item_obj.custitemcertificate_included == "2" || item_obj.custitemcertificate_included == '' || item_obj.custitemcertificate_included == null) 
                  custom_diamond.setFieldValue("custrecord_cdp_group_a", "T");
                else if(item_obj.custitemcertificate_included == "1")
                {
                  custom_diamond.setFieldValue("custrecord_diamond_email_status", "2"); //Email Status = Emailed
                  custom_diamond.setFieldValue("custrecord_cdp_group_b", "T"); //Mark Group B
                  custom_diamond.setFieldValue("custrecord_diamond_status", "1"); //Diamond Status = Confirmed
                  custom_diamond.setFieldValue("custrecord_diamond_confirmed", "1"); //Diamond Confirmed = Yes
                  custom_diamond.setFieldValue("custrecord_diamond_email_status", "5"); //Email Status = Batch Email
                  nlapiSubmitField("salesorder", nlapiGetRecordId(), "custbody132", "1");
                }
              }

              //Check vendor record for 'Block automated emails' checkbox
              var vendor = nlapiLookupField("item", item, "vendor");
              if(vendor != null && vendor != "")
              {
                var blockEmails = nlapiLookupField("vendor", vendor, "custentityblock_automated_emails");
                if (blockEmails == "T") 
                  custom_diamond.setFieldValue("custrecord_diamond_email_status", "3");
              }

              //Set Email Status to Order on Website if vendor is Hari Krishna or Monarch or Kiran or Kapu India or Laxmi or JB or Blue Star
              if(vendor == "28712" || vendor == "236761" || vendor == "2325705" || vendor == "2550863" || vendor == "2551373" || vendor == "3132473" || vendor == "3432901" || vendor == "3192228" || vendor == "4215082")
              {
                custom_diamond.setFieldValue("custrecord_diamond_email_status", "4");
              }

              //Override Email Status to Manual if CDP parent item starts with "Y"
              var itemNum = order.getLineItemText("item", "item", x + 1);
              if(itemNum != null && itemNum != "" && itemNum.charAt(0) == "Y")
              {
                custom_diamond.setFieldValue("custrecord_diamond_email_status", "3"); //Set Email Status to Manual Email
              }

              //nlapiSubmitRecord(custom_diamond,true,true);
              var cdpId = nlapiSubmitRecord(custom_diamond, true, true);
              nlapiLogExecution("debug", "New Created CDP id is : ", cdpId +" having PLA diamond value(T/F) is : "+ pla + " in else part ");
              //Write CDP created or updated to log
              Update_CDP_Log(logId,cdpId);
              if(pla == "F")
                //PushCDPRecordToPortal(cdpId, type);
                Diamond_Portal_Logic_Rewrite_Push_To_Portal_For_Percent_Paid(cdpId,type,recordType,"886");

              //Update item record with new price
              if(order.getFieldValue("currency") == "1")
              {
                var itemMaster = nlapiLoadRecord("inventoryitem", item);
                var priceCount = itemMaster.getLineItemCount('price');
                if(priceCount)
                {
                  for(var i = 1; i <= priceCount; i++)
                  {
                    var curr_cur = itemMaster.getLineItemValue('price', 'currency', i);
                    if(curr_cur == '1')
                    {
                      itemMaster.selectLineItem('price', i);
                      itemMaster.setCurrentLineItemMatrixValue('price', 'price', 1, rate);
                      itemMaster.commitLineItem('price');
                      break;
                    }
                  }
                }
                nlapiSubmitRecord(itemMaster, true, true);
              }
              var filters = [];
              filters.push(new nlobjSearchFilter("item", null, "is", item));
              var results = nlapiSearchRecord("purchaseorder", null, filters);
              if(!results)
              {
                nlapiSubmitField("inventoryitem", item, "isspecialorderitem", "T");
              }
            }
          }
        }
        catch(e1)
        {
          nlapiLogExecution("error", "Error Updating Sold Diamonds (Record " + nlapiGetRecordId() + ").", "Details: " + e1.message);

          if(e1.message!=null && e1.message.indexOf("custrecord_diamond_sales_rep")!=-1)
          {
            custom_diamond.setFieldValue("custrecord_diamond_sales_rep","");
            nlapiSubmitRecord(custom_diamond,true,true);
          }
          else
          {
            try {
              var errorRec = nlapiCreateRecord("customrecord_cdp_error_log");
              errorRec.setFieldValue("custrecord_cdp_error_log_sales_order", nlapiGetRecordId());
              errorRec.setFieldValue("custrecord_cdp_error_log_message", e1.message);
              errorRec.setFieldValue("custrecord_cdp_error_log_script", "Update Sold Diamonds");
              nlapiSubmitRecord(errorRec, true, true);
            } 
            catch (e) {
              nlapiLogExecution("error", "Error Creating CDP Error Log", "Details: " + e.message);
            }
          }
        }
      }
    }
    catch(err)
    {
      nlapiLogExecution("error","Error Updating Sold Diamonds (Record " + nlapiGetRecordId() + ").","Details: " + err.message);			
      return true;
    }
  }
}
//Function that push created cdp to portal
function PushCDPRecordToPortal(cdpId,type)
{
  try
  {
    var scriptId = "886";
    nlapiLogExecution('debug','CDP Initiated to push on portal for cdpId:'+cdpId , cdpId );
    var soId = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_diamond_so_order_number");		
    var assetAcct='';
    var soStatus = null;   
    if(soId !='' && soId != null)
    {
      soStatus = nlapiLookupField("salesorder",soId,"status");
      var soObj = nlapiLoadRecord("salesorder",soId);
      var itemCount = soObj.getLineItemCount("item");
      for(var j=1; j<= itemCount; j++)
      {
        var itemType = soObj.getLineItemValue("item","itemtype",j);
        if(itemType == "InvtPart")
        {
          var invItemId=soObj.getLineItemValue("item","item",j);	
          if(nlapiLookupField("inventoryitem",invItemId,"custitem20") == 7)
          {
            assetAcct = nlapiLookupField("inventoryitem",soObj.getLineItemValue("item","item",j),"assetaccount");
            break;
          }
        }// end check of itemType   
      }// end of loop
    }// end check of soId   

    CallCDPToPortal(cdpId,assetAcct,soStatus,type,scriptId); //Added new library file scripts
  }
  catch(err)
  {
    nlapiLogExecution("debug","Error occur during CDPID Push from NS to portal",err.message); 
  }
}


