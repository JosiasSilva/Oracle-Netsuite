//var scriptId = "2133";
function Diamond_Portal_Logic_Rewrite(cdpId,type,recordType) 
{
  try 
  {
    nlapiLogExecution("DEBUG","type" , type);
    if (type == 'create' || type == 'edit' || type == 'xedit') 
    {
      nlapiLogExecution("DEBUG","cdp id " , cdpId);
      nlapiLogExecution("DEBUG","recordType" , recordType);
      if(cdpId)
      {
        var temp_new_paid =0; var temp_old_paid =0;var new_paid =0;
        var temp_old_paid = nlapiLookupField("customrecord_custom_diamond",cdpId,'custrecord_custom_diamond_percent_paid');
        nlapiLogExecution("DEBUG","Temp Old Percentage Paid Info with %",temp_old_paid + " having cdp id " + cdpId);
        if(recordType == "customrecord_custom_diamond" )
        {
          nlapiLogExecution("DEBUG","Information % Paid" ,"Calculate % paid for custom diamond having cdp is :"+ cdpId);
          Cal_Percentage_Paid(cdpId);
        }
        var temp_new_paid = nlapiLookupField("customrecord_custom_diamond",cdpId,'custrecord_custom_diamond_percent_paid');
        nlapiLogExecution("DEBUG","Temp New Percentage Paid Info with %",temp_new_paid + " having cdp id " + cdpId);
        //% Paid
        if(temp_new_paid!='' && temp_new_paid!=null)
        {
          temp_new_paid=temp_new_paid.split('%')[0];
          nlapiLogExecution("DEBUG","Temp New Percentage Paid Info without %",temp_new_paid +" having cdp id " + cdpId);
        }
        if(temp_old_paid!='' && temp_old_paid!=null)
        {
          temp_old_paid=temp_old_paid.split('%')[0];
          nlapiLogExecution("DEBUG","Temp Old Percentage Paid Info without %",temp_old_paid +" having cdp id " + cdpId);
        }
        if(temp_new_paid != temp_old_paid)
          new_paid = temp_new_paid;
        nlapiLogExecution("DEBUG","New Percentage Paid Info",new_paid +" having cdp id " + cdpId);

        var cdp_obj = nlapiLoadRecord('customrecord_custom_diamond', cdpId);

        //Start Here
        var recOldCdp = nlapiGetOldRecord();
        var recNewCdp = nlapiGetNewRecord();
        var recOldCdpFields = recOldCdp.getAllFields();
        var recNewCdpFields = recNewCdp.getAllFields();
        var recOldCdp_item_status ='';
        var recNewCdp_item_status ='';
        var recOldCdp_diamond_status ='';
        var recNewCdp_diamond_status ='';
        var rec_Cdp_item_status_bol_val = false;
        var rec_Cdp_diamond_status_bol_val = false;
        // loop through the returned fields
        // Old Item Status
        for (var i = 0; i < recOldCdpFields.length; i++)
        {
          if (recOldCdpFields[i] == 'custrecord_item_status')
          {
            recOldCdp_item_status = recOldCdp.getFieldValue('custrecord_item_status');
            break;
          }
        }
        nlapiLogExecution("DEBUG","Item Status(Old)",recOldCdp_item_status +" having cdp id " + cdpId);
        // Old Diamond Status
        for (var i = 0; i < recOldCdpFields.length; i++)
        {
          if(recOldCdpFields[i] == 'custrecord_diamond_status')
          {
            recOldCdp_diamond_status = recOldCdp.getFieldValue('custrecord_diamond_status');
            break;
          }
        }
        nlapiLogExecution("DEBUG","Diamond Status(Old)",recOldCdp_diamond_status +" having cdp id " + cdpId);
        // loop through the returned fields
        // New Item Status
        for (var i = 0; i < recNewCdpFields.length; i++)
        {
          if (recNewCdpFields[i] == 'custrecord_item_status')
          {
            recNewCdp_item_status =  recNewCdp.getFieldValue('custrecord_item_status');
            break;
          }
        }
        nlapiLogExecution("DEBUG","Item Status(New)",recNewCdp_item_status +" having cdp id " + cdpId);
        //New Diamond Status
        for (var i = 0; i < recNewCdpFields.length; i++)
        {
          if (recNewCdpFields[i] == 'custrecord_diamond_status')
          {
            recNewCdp_diamond_status =  recNewCdp.getFieldValue('custrecord_diamond_status');
            break;
          }
        }
        nlapiLogExecution("DEBUG","Diamond Status(New)",recNewCdp_diamond_status +" having cdp id " + cdpId);

        if(recNewCdp_item_status !='' && recNewCdp_item_status !=null)
        {
          if(recOldCdp_item_status != recNewCdp_item_status)
          {
            rec_Cdp_item_status_bol_val= true;
          }
        }
        if(recNewCdp_diamond_status !='' && recNewCdp_diamond_status!=null)
        {
          if(recOldCdp_diamond_status != recNewCdp_diamond_status)
          {
            rec_Cdp_diamond_status_bol_val= true;
          }
        }
        nlapiLogExecution("DEBUG","Item Status(bol val)",rec_Cdp_item_status_bol_val +" having cdp id " + cdpId);
        nlapiLogExecution("DEBUG","Diamond Status(bo val)",rec_Cdp_diamond_status_bol_val +" having cdp id " + cdpId);
        //End Here

        var item_status = cdp_obj.getFieldValue('custrecord_item_status');
        nlapiLogExecution("debug","Item Status(Test)",item_status);
        var new_item_status =''; var old_item_status=''; var new_action_needed =''; var old_action_needed='';
        var temp_new_item_status ='';
        var temp_old_item_status ='';
        var temp_new_action_needed =''; var temp_old_action_needed ='';
        //variables declaration for diamond status
        var new_diamond_status =''; var old_diamond_status = '';
        var temp_new_diamond_status ='';
        var temp_old_diamond_status ='';
        //variables declaration for cs status
        var new_cs_status =''; var old_cs_status = '';
        var temp_new_cs_status ='';
        var temp_old_cs_status ='';
        //Item Status
        var sys_note_date='';
        var item_status_old_new_value = get_old_new_value_of_item_status(cdpId,temp_old_item_status,temp_new_item_status);
        nlapiLogExecution("DEBUG","Item Status old & new value without Json(Temp) Info from system notes",item_status_old_new_value +" having cdp id " + cdpId);
        nlapiLogExecution("DEBUG","Item Status old & new value Json(Temp) Info from system notes",JSON.stringify(item_status_old_new_value) +" having cdp id " + cdpId);
        temp_old_item_status = item_status_old_new_value[0];
        temp_new_item_status = item_status_old_new_value[1];
        sys_note_date= item_status_old_new_value[2];
        nlapiLogExecution("DEBUG","Old Item Status (Temp) Info from system notes","Old Item Status is : " + temp_old_item_status + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","New Item Status (Temp) Info from system notes","New Item Status is : " + temp_new_item_status + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","System note date for item status Info","System note date for New Item Status is : " + sys_note_date + " having cdp " + cdpId);
        if(temp_new_item_status  != temp_old_item_status)
        {
          new_item_status = temp_new_item_status;
          old_item_status = temp_old_item_status;
          nlapiLogExecution("DEBUG","New Item Status Info from system notes","New Item Status is : " + new_item_status + " having cdp " + cdpId);
          nlapiLogExecution("DEBUG","Old Item Status Info from system notes","Old Item Status is : " + old_item_status + " having cdp " + cdpId);
        }
        // Action Needed
        var sys_note_date_action_needed='';
        var action_needed_old_new_value = get_old_new_value_of_action_needed(cdpId,temp_old_action_needed,temp_new_action_needed);
        nlapiLogExecution("DEBUG","Action Needed value JSON(Temp) Info from system notes",JSON.stringify(action_needed_old_new_value) +" having cdp id" + cdpId);
        temp_old_action_needed =action_needed_old_new_value[0];
        temp_new_action_needed = action_needed_old_new_value[1];
        sys_note_date_action_needed= action_needed_old_new_value[2];
        nlapiLogExecution("DEBUG","Old Action Needed (Temp) Info from system notes","Old  Action Needed is : " + temp_old_action_needed + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","New  Action Needed (Temp) Info from system notes","New  Action Needed is : " + temp_new_action_needed + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","System note date for  Action Needed Info from system notes","System note date for  Action Needed is : " + sys_note_date_action_needed + " having cdp " + cdpId);
        if(temp_new_action_needed  != temp_old_action_needed)
        {
          new_action_needed = temp_new_action_needed;
          old_action_needed = temp_old_action_needed;
          nlapiLogExecution("DEBUG","New Action Needed Info from system notes","New Action Needed is : " + new_action_needed + " having cdp " + cdpId);
          nlapiLogExecution("DEBUG","Old Action Needed Info from system notes","Old Action Needed is : " + old_action_needed + " having cdp " + cdpId);
        }
        // % Paid
        if(temp_new_paid == temp_old_paid)
        {
          //new_paid = 0;
        }
        // Diamond Status
        var sys_note_date_diamond_status='';
        var diamond_status_old_new_value = get_old_new_value_of_diamond_status(cdpId,temp_old_diamond_status,temp_new_diamond_status);
        nlapiLogExecution("DEBUG","Diamond Status old & new value without Json (Temp) Info from system notes",diamond_status_old_new_value +" having cdp id " + cdpId);
        nlapiLogExecution("DEBUG","Diamond Status old & new value Json  (Temp) Info from system notes",JSON.stringify(diamond_status_old_new_value) +" having cdp id " + cdpId);
        temp_old_diamond_status = diamond_status_old_new_value[0];
        temp_new_diamond_status = diamond_status_old_new_value[1];
        sys_note_date_diamond_status = diamond_status_old_new_value[2];
        nlapiLogExecution("DEBUG","Old Diamond Status (Temp) Info from system notes","Old Diamond Status is : " + temp_old_diamond_status + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","New Diamond Status (Temp) Info from system notes","New Diamond Status is : " + temp_new_diamond_status + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","System note date for diamond status Info","System note date for New Diamond Status is : " + sys_note_date_diamond_status + " having cdp " + cdpId);
        if(temp_new_diamond_status  != temp_old_diamond_status)
        {
          new_diamond_status = temp_new_diamond_status;
          old_diamond_status = temp_old_diamond_status;
          nlapiLogExecution("DEBUG","New Diamond Status Info from system notes","New Diamond Status is : " + new_diamond_status + " having cdp " + cdpId);
          nlapiLogExecution("DEBUG","Old Diamond Status Info from system notes","Old Diamond Status is : " + old_diamond_status + " having cdp " + cdpId);
        }
        // CS Status
        var sys_note_date_cs_status='';
        var cs_status_old_new_value = get_old_new_value_of_cs_status(cdpId,temp_old_cs_status,temp_new_cs_status);
        nlapiLogExecution("DEBUG","CS Status old & new value without Json (Temp) Info from system notes",cs_status_old_new_value +" having cdp id " + cdpId);
        nlapiLogExecution("DEBUG","CS Status old & new value Json  (Temp) Info from system notes",JSON.stringify(cs_status_old_new_value) +" having cdp id " + cdpId);
        temp_old_cs_status = cs_status_old_new_value[0];
        temp_new_cs_status = cs_status_old_new_value[1];
        sys_note_date_cs_status = cs_status_old_new_value[2];
        nlapiLogExecution("DEBUG","Old CS Status (Temp) Info from system notes","Old CS Status is : " + temp_old_cs_status + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","New CS Status (Temp) Info from system notes","New CS Status is : " + temp_new_cs_status + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","System note date for CS status Info","System note date for New CS Status is : " + sys_note_date_cs_status + " having cdp " + cdpId);
        if(temp_new_cs_status  != temp_old_cs_status)
        {
          new_cs_status = temp_new_cs_status;
          old_cs_status = temp_old_cs_status;
          nlapiLogExecution("DEBUG","New CS Status Info from system notes","New CS Status is : " + new_cs_status + " having cdp " + cdpId);
          nlapiLogExecution("DEBUG","Old CS Status Info from system notes","Old CS Status is : " + old_cs_status + " having cdp " + cdpId);
        }
        var pla =cdp_obj.getFieldValue("custrecord_cdp_pla");
        nlapiLogExecution('debug','PLA diamond value(T/F):', pla + " having cdp " + cdpId);
        if(pla == 'T')
          return;
        var vendor_id=cdp_obj.getFieldValue('custrecord_custom_diamond_vendor');
        nlapiLogExecution("debug","Vendor Id is : "+vendor_id," for cdp "+ cdpId);
        if(vendor_id == null || vendor_id == "")
          return ;
        if(vendor_id!=null && vendor_id!='')
          var date_on_portal = nlapiLookupField("vendor",vendor_id,"custentity_date_on_portal");
        if(date_on_portal == null || date_on_portal == "")
          return ;
        var diamond_status = cdp_obj.getFieldValue('custrecord_diamond_status');
        nlapiLogExecution("DEBUG","Diamond Status",diamond_status + " having cdp" + cdpId);
        var action_needed = cdp_obj.getFieldValue('custrecord_action_needed');
        if(action_needed !=null)
          action_needed = action_needed.replace(/\u0005/g,',');
        nlapiLogExecution("DEBUG","Action Needed after replacing unicode",action_needed + " having cdp" + cdpId);
        var override_mapping_logic = cdp_obj.getFieldValue('custrecordoverride_mapping_logic');
        var request_type = cdp_obj.getFieldValue('custrecord_custom_diamond_request_type');
        var percent_paid = cdp_obj.getFieldValue('custrecord_custom_diamond_percent_paid');
        var group_a = cdp_obj.getFieldValue('custrecord_cdp_group_a');//group A
        var group_b = cdp_obj.getFieldValue('custrecord_cdp_group_b'); //group B
        if(percent_paid!='' && percent_paid!=null)
        {
          percent_paid=percent_paid.split('%')[0];
        }
        nlapiLogExecution("DEBUG","Paid Percentage Info","Paid Percentage is : "+percent_paid + " having cdp" + cdpId);

        var so_id = cdp_obj.getFieldValue('custrecord_diamond_so_order_number');
        nlapiLogExecution("debug","so id",so_id + " having cdp " + cdpId);
        var po_id = cdp_obj.getFieldValue('custrecord_diamond_po_number');
        nlapiLogExecution("debug","po id",po_id + " having cdp " + cdpId);
        var so_status = '';
        var po_status ='';
        nlapiLogExecution("DEBUG","Step 1",cdpId);
        if(so_id)
        { 
          so_status = nlapiLookupField('salesorder', so_id, 'status');
          nlapiLogExecution("DEBUG","Step 2",cdpId);
        }
        if(po_id)
        {
          po_status = nlapiLookupField('purchaseorder',po_id,'status');
          nlapiLogExecution("DEBUG","Step 3",cdpId);
        }
        nlapiLogExecution("DEBUG","Purchase Order Status",po_status + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","Sales Order Status",so_status + " having cdp " + cdpId);
        var cs_status = cdp_obj.getFieldValue('custrecord_custom_diamond_cs_status');
        nlapiLogExecution("debug","CS Status(Test)",cs_status + " having cdp " + cdpId);
        var item_id = cdp_obj.getFieldValue('custrecord_be_diamond_stock_number');
        var item_obj = nlapiLoadRecord('inventoryitem', item_id);
        var new_bill_date = item_obj.getFieldValue('custitem108');
        var portal_request_type = cdp_obj.getFieldValue('custrecord165');
        nlapiLogExecution("DEBUG","Portal Request Type(initially)",portal_request_type + " having cdp " + cdpId);

        var be_diamond_stock_number = cdp_obj.getFieldText('custrecord_be_diamond_stock_number');
        var check_diamond_group = be_diamond_stock_number.substring(be_diamond_stock_number.length-1,be_diamond_stock_number.length);
        var group='';
        if (check_diamond_group =='B') 
        {
          var certificate_included = item_obj.getFieldValue('custitemcertificate_included');// added new logic
          var item_location = item_obj.getLineItemCount("locations");
          var qnty_on_hand = 0;
          for (var i = 1; i < item_location; i++) 
          {
            qnty_on_hand = item_obj.getLineItemValue("locations", "quantityonhand", i);
            if(qnty_on_hand && qnty_on_hand > 0) 
            {
              nlapiLogExecution("DEBUG","Quantity on Hand",qnty_on_hand + " having cdp " + cdpId);
              break;
            }
          }
          if (check_diamond_group == 'B' && qnty_on_hand > 0 )// for point b
          {
            nlapiLogExecution("DEBUG","Step 4",cdpId);
            if(certificate_included == 2) // added new logic as per new req doc pt 2
            {
              group = 'A';
              nlapiLogExecution("DEBUG","Step 5",cdpId);
            }
            else 
            {
              group = 'B';
              nlapiLogExecution("DEBUG","Step 6",cdpId);
            }
          }
        }
        nlapiLogExecution("DEBUG","Check Diamond Group",check_diamond_group + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","Diamond Group",group + " having cdp " + cdpId);
        if(type == "create")
        {
          if(group == 'A') 
          {
            nlapiSubmitField("customrecord_custom_diamond",cdpId,"custrecord_cdp_group_a","T");
            nlapiLogExecution("DEBUG","CDP marked group ",group + " on creation having cdp " + cdpId);
          }
          else if(group == 'B')
          {
            nlapiSubmitField("customrecord_custom_diamond",cdpId,"custrecord_cdp_group_b","T");
            nlapiLogExecution("DEBUG","CDP marked group ",group + " on creation having cdp " + cdpId);
          }
        }
        /* Start Group A Diamonds points */
        if(override_mapping_logic=='F')
        {
          if (group == 'A' || group_a== 'T') 
          {
            group = 'A';
            nlapiLogExecution("DEBUG","Diamond Group A from checkbox on cdp(2)",group + " having cdp " + cdpId);
            nlapiLogExecution("DEBUG","Step 7",cdpId);
            //Diamond Status  = ‘Confirmed’ AND % Paid > 20 AND new Sales Order Status = ‘Pending Fulfillment’
            if(percent_paid > 20 && diamond_status == 1 && so_status == 'pendingFulfillment') // added new logic for pt 2
            {
              nlapiLogExecution("DEBUG","Step 8",cdpId);
              //CDP Request Type = ANY(‘Sold’, ’Replacement (customer switch)’) 
              if((request_type == 1 || request_type == 8))
              {
                portal_request_type = 3;//Sold
                item_status = 2;//Confirmed
                //diamond New Bill Date {custitem108} NOT NULL 
                if (new_bill_date != '')//for point 2
                {
                  action_needed = 14 ;//Certificate Required
                  nlapiLogExecution("DEBUG","Step 9",cdpId);
                } 
                //diamond New Bill Date {custitem108} IS NULL 
                else // for point 1
                {
                  action_needed ="4,14";//Ready to Invoice, Certificate Required renamed on portal ship physical certificate
                  nlapiLogExecution("DEBUG","Step 10",cdpId);
                }
                nlapiLogExecution("DEBUG","Step 11",cdpId);
              }
              //Request Type = ‘Replacement (diamond unavailable)’ & CS Status = ‘Options accepted by customer’ 
              else if( request_type == 7 && cs_status == 4 )
              {
                nlapiLogExecution("DEBUG","Step 12",cdpId);
                portal_request_type = 3; //	Sold
                item_status = 2;//Confirmed
                //diamond New Bill Date {custitem108} IS NOT NULL 
                if (new_bill_date != null && new_bill_date != '')// for point 4
                {
                  action_needed =14 ;//Certificate Required
                  nlapiLogExecution("DEBUG","Step 13",cdpId);
                } 
                //diamond New Bill Date {custitem108} IS NULL 
                else //for point 3
                {
                  action_needed ="4,14";//Ready to Invoice, Certificate Required
                  nlapiLogExecution("DEBUG","Step 14",cdpId);
                }
              }
            }
            else 
            {
              nlapiLogExecution("DEBUG","Vendor on Portal for Diamond Group A",cdp_obj.getFieldValue('custrecord_on_vendor_portal') + " having cdp" + cdpId);
              if(cdp_obj.getFieldValue('custrecord_on_vendor_portal') == 'T')
              {
                nlapiLogExecution('debug', 'Do not push to portal Group A Diamonds');
                return;
              }
            }
          }
          /* End Group A Diamonds points */
          /* Start Group B Diamonds points */
          else if (group == 'B' || group_b =='T') 
          {
            group = 'B';
            nlapiLogExecution("DEBUG","Diamond Group B from checkbox on cdp(3)",group + " having cdp" + cdpId);
            nlapiLogExecution("DEBUG","Step 15",cdpId);
            //fullyBilled
            // as per new req diamond status changed from 5 to 1
            //CDP Request Type = ANY(‘Sold’, ’Replacement (customer switch)’) AND Diamond Status = ‘Confirmed’ AND new Sales Order Status = ‘Billed’ AND diamond New Bill Date {custitem108} IS NULL 
            if ( (request_type == 1 || request_type == 8) && diamond_status == 1 && so_status == 'fullyBilled' && (new_bill_date == null || new_bill_date == '')) // for point 1
            {
              portal_request_type = 3;//Sold
              item_status = 2;//Confirmed
              action_needed = 4 ;//Ready to Invoice
              nlapiLogExecution("DEBUG","Step 16",cdpId);
            } 
            // as per new req diamond status changed from 5 to 1 , removed % paid>20 and changed sales order satus from pending Fulfillment to fully Billed
            //2.	WHEN CDP Request Type = ‘Replacement (diamond unavailable)’ AND % Paid > 20 AND Diamond Status = ‘Confirmed’ AND CS Status = ‘Options accepted by customer’ AND Sales Order Status = ‘Billed’ AND diamond New Bill Date {custitem108} IS NULL THEN 
            else if (request_type == 7 && diamond_status == 1 && cs_status == 4 && so_status == 'fullyBilled' && (new_bill_date == null || new_bill_date == '')) // for point 2
            {
              portal_request_type = 3;//Sold
              item_status = 2;//Confirmed
              action_needed =4;	//Ready to Invoice
              nlapiLogExecution("DEBUG","Step 17",cdpId);
            }
            else// for point 3
            {
              nlapiLogExecution("DEBUG","Vendor on Portal for Diamond Group B",cdp_obj.getFieldValue('custrecord_on_vendor_portal') + " having cdp" + cdpId);
              if(cdp_obj.getFieldValue('custrecord_on_vendor_portal') == 'T')
              {
                nlapiLogExecution('debug', 'Do not push to portal for Group B Diamonds');
                return ;
              }
            }
          }
          /* End Group B Diamonds points */
          /* Start Neither Group A or Group B Diamonds points */
          else 
          {
            nlapiLogExecution("DEBUG","Step 18",cdpId);
            //CDP Request Type = Sold, Replacement (Customer Switch)
            if(request_type ==1 || request_type == 8)
            {
              nlapiLogExecution("DEBUG","Step 19",cdpId);
              var noOfDays = GetItemStatus(cdpId);
              nlapiLogExecution("DEBUG","Step 20 for request type 1 or 8 No of days for Item Status having cdp id : " + cdpId, noOfDays);
              if (percent_paid < 20)// for point 2
              {
                if (new_item_status == 2)// for point 2
                {
                  diamond_status = 9;//On Hold - Customer Payment Pending
                  portal_request_type = 2;//Hold
                  item_status = 2;//Confirmed
                  action_needed = '';//null
                  nlapiLogExecution("DEBUG","Step 21",cdpId);
                }
                //Additions to DP logic
                else if(new_diamond_status == 9)
                {
                  diamond_status = 9;//On Hold - Customer Payment Pending
                  portal_request_type = 2;//Hold
                  item_status = 2;//Confirmed
                  action_needed = '';//null
                  nlapiLogExecution("DEBUG","Step 21 A",cdpId);
                }
                else // for point 1
                {						 
                  action_needed = 2 ;// confirmation needed
                  portal_request_type = 2;//Hold
                  item_status = 1; //Not Confirmed
                  diamond_status = '';//null
                  nlapiLogExecution("DEBUG","Step 22",cdpId);
                }
              }
              // On Hold – Customer Payment Pending = 9
              // confirmed = 2
              //6.	WHEN Diamond Status = ‘On Hold – Customer Payment Pending’ AND Item Status = Confirmed AND new % Paid >= 20
              else if(new_paid>=20 && diamond_status == 9 && item_status == 2) // for point 6
              {
                // for point 6(new req.)
                diamond_status = 9;//On Hold – Customer Payment Pending
                portal_request_type = 3;//Sold
                item_status = 2;// Confirmed
                action_needed ="3,4";//Ready to Ship, Ready to Invoice
                nlapiLogExecution("DEBUG","Step 23",cdpId);
              }
              //7.	WHEN Portal Request Type = ‘Sold’ AND Action Needed = ‘Ready to Ship, Ready to Invoice’ AND Item Status = ‘Confirmed’ AND new Diamond Status = ‘Confirmed’
              else if(portal_request_type == 3 && action_needed.indexOf(3) != -1 &&  action_needed.indexOf(4) != -1 && item_status ==2 && new_diamond_status==1)// for point 7
              {
                diamond_status = 1;//Confirmed
                portal_request_type = 3;//Sold
                item_status = 2;//Confirmed
                action_needed ="3,4";//Ready to Ship, Ready to Invoice
                nlapiLogExecution("DEBUG","Step 24",cdpId);
              }
              //8.	WHEN new % Paid >= 20 AND Portal Request Type = ‘Hold’ AND date Item Status changed to ‘Confirmed’ > 3 days ago 
              else if(new_paid>=20 && portal_request_type==2 && noOfDays>3) // for point 8
              {
                // for point 8(new req.)
                diamond_status = 9;//On Hold – Customer Payment Pending
                portal_request_type = 3;//Sold
                item_status = 1;//Not Confirmed
                action_needed ="";//
                nlapiLogExecution("DEBUG","Step 25",cdpId);
              }
              //9.	WHEN new % Paid >= 20 AND Portal Request Type = ‘Hold’ AND date Item Status changed to ‘Confirmed’ <= 3 days ago 
              else if(new_paid>=20 && portal_request_type==2 && noOfDays<=3) // for point 9
              {
                // for point 9(new req.)
                diamond_status = 9;//On Hold – Customer Payment Pending
                portal_request_type = 3;//Sold
                item_status = 2;//Confirmed
                action_needed ="";//
                nlapiLogExecution("DEBUG","Step 26",cdpId);
              }
              //10.	WHEN % Paid >= 20 AND Portal Request Type = Sold AND new Item Status = ‘Confirmed
              else if (percent_paid >= 20 && portal_request_type == 3) // for point 10 new req.
              {
                //AND new Item Status = ‘Confirmed
                if(new_item_status == 2)
                {
                  diamond_status = 1;//Confirmed
                  portal_request_type = 3;//Sold
                  item_status = 2;//Confirmed
                  action_needed ="3,4";//Ready to Ship, Ready to Invoice
                  nlapiLogExecution("DEBUG","step 27",cdpId);
                }
                //Additions to DP logic
                //AND new Diamond Status = ‘Confirmed
                else if(new_diamond_status == 1)
                {
                  diamond_status = 1;//Confirmed
                  portal_request_type = 3;//Sold
                  item_status = 2;//Confirmed
                  action_needed ="3,4";//Ready to Ship, Ready to Invoice
                  nlapiLogExecution("DEBUG","step 27 (I)",cdpId);
                }
              }
              //Shipped = 11 ,Invoiced = 12
              //READY TO SHIP LOGIC
              //1.	WHEN Portal Request Type = Sold AND old Item Status = ‘Confirmed’ AND new Action Needed contains ‘Shipped’ AND new Action Needed does not contain ‘Invoiced’ 
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12) == -1) //for point no. 1			
              {
                nlapiLogExecution("DEBUG","Step 28",cdpId);
                diamond_status = 1;//Confirmed
                portal_request_type = 3;//Sold	
                item_status = 2;//Confirmed
                action_needed = "4,11";//Ready to Invoice , shipped
              } 
              //2.	WHEN Portal Request Type = Sold AND old Item Status = ‘Confirmed’ AND new Action Needed does not contain ‘Shipped’ AND new Action Needed contains ‘Invoiced’ 
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) == -1 && new_action_needed.indexOf(12) != -1) //for point no.2
              {
                nlapiLogExecution("DEBUG","Step 29",cdpId);
                diamond_status = 1;//Confirmed
                portal_request_type = 3;//Sold	
                item_status = 2; //Confirmed
                action_needed = "3,12";//Ready to Ship , Invoiced
              }
              //3.	WHEN Portal Request Type = Sold AND old Item Status = ‘Confirmed’ AND new Action Needed contains ‘Shipped’ and ‘Invoiced’ 
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12) != -1) //for point no.3
              {
                nlapiLogExecution("DEBUG","Step 30",cdpId);
                diamond_status = 1;//Confirmed
                portal_request_type = 3;//Sold	
                item_status = 2;//Confirmed
                action_needed = "11,12";//Shipped , Invoiced
              }
              else if (percent_paid >= 20)// added new logic during QA as per Eric new req on 28 AUG 2018
              {
                diamond_status = '';//null
                portal_request_type = 3;//Sold
                item_status = 1;//Not Confirmed
                action_needed = 2;//Confirmation Needed
                nlapiLogExecution("DEBUG","Step 30 A",cdpId);
              }
            }
            /* End CDP Request Type = Sold, Replacement (Customer Switch) */
            /* Start CDP Request Type = Replacement (diamond unavailable)*/
            else if (request_type == 7) 
            {
              var noOfDays = GetItemStatus(cdpId);
              nlapiLogExecution("DEBUG","Step 31 for request type 7 No of days for Item Status having cdp id : " + cdpId, noOfDays);
              if(percent_paid < 20)
              {
                //4.WHEN % Paid < 20 AND new Item Status = ‘Confirmed’ AND CS Status = ‘Options accepted by customer’ 
                if(new_item_status == 2 && cs_status == 4) // for point 4
                {
                  diamond_status = 7;//On Hold Pending Customer Decision
                  portal_request_type = 2;//Hold	
                  item_status = 2;//Confirmed
                  action_needed = '';//null
                  nlapiLogExecution("DEBUG","Step 32",cdpId);
                }
                //5. WHEN % Paid < 20 AND new Diamond Status = ‘On Hold – Customer Payment Pending’ AND CS Status = ‘Options accepted by customer’
                else if(new_diamond_status == 9 && cs_status == 4) // for point 5
                {
                  diamond_status = 9;//On Hold - Customer Payment Pending
                  portal_request_type = 2;//Hold	
                  item_status = 2;//Confirmed
                  action_needed = '';//null
                  nlapiLogExecution("DEBUG","Step 36",cdpId);
                }
                else // for point 1
                {
                  diamond_status = '';//null
                  portal_request_type = 2;//Hold	
                  item_status = 1;//Not Confirmed
                  action_needed = 2;//Confirmation Needed
                  nlapiLogExecution("DEBUG","Step 33",cdpId);
                }
              }
              //new Item Status = ‘Confirmed’ AND CS Status != ‘Options accepted by customer’
              else if (new_item_status == 2 && cs_status != 4) // for point 2
              {
                diamond_status = 7; //On Hold Pending Customer Decision
                portal_request_type = 2;//Hold	
                item_status = 2;//Confirmed
                action_needed = '';//null
                nlapiLogExecution("DEBUG","Step 34",cdpId);
              }
              //new Diamond Status = ‘On Hold Pending Customer Decision’ AND CS Status != ‘Options accepted by customer’ 
              else if(new_diamond_status == 7 && cs_status != 4) // for point 3
              {
                diamond_status = 7; //On Hold Pending Customer Decision
                portal_request_type = 2;//	Hold	
                item_status = 2;// Confirmed
                action_needed = ''; //	null
                nlapiLogExecution("DEBUG","Step 35",cdpId);
              }
              //5.	WHEN % Paid < 20 AND new Diamond Status = ‘On Hold – Customer Payment Pending’ AND CS Status = ‘Options accepted by customer’
              /*else if(percent_paid < 20 && new_diamond_status== 9 && cs_status == 4) // for point 5
              {
                diamond_status = 9;//On Hold - Customer Payment Pending
                portal_request_type = 2;//Hold	
                item_status = 2;//Confirmed
                action_needed = '';//null
                nlapiLogExecution("DEBUG","Step 36",cdpId);
              }*/
              //8.	WHEN % Paid >= 20 AND Portal Request Type = Hold and Item Status = ‘Confirmed’ AND new CS Status = ‘Options accepted by customer’ AND date Item Status changed to ‘Confirmed’ > 3 days ago
              else if(percent_paid >= 20 && portal_request_type == 2 && item_status == 2 && new_cs_status == 4 && noOfDays>3) // for point 8
              {
                diamond_status =7;// On Hold Pending Customer Decision
                portal_request_type = 2;//Hold	
                item_status = 1;// not Confirmed
                action_needed = 2;//Confirmation Needed
                nlapiLogExecution("DEBUG","Step 37",cdpId);
              }
              //9.	WHEN % Paid >= 20 AND Portal Request Type = Hold and Item Status = ‘Confirmed’ AND new CS Status = ‘Options accepted by customer’ AND date Item Status changed to ‘Confirmed’ <= 3 days ago
              else if(percent_paid >= 20 && portal_request_type == 2 && item_status == 2 && new_cs_status == 4 && noOfDays<=3) // for point 9
              {
                diamond_status =7;// On Hold Pending Customer Decision
                portal_request_type = 3;//Sold	
                item_status = 2;//Confirmed
                action_needed = "3,4";//Ready to ship,Ready to invoice
                nlapiLogExecution("DEBUG","Step 38",cdpId);
              }
              //11.	WHEN % Paid > 20 AND new Item Status = ‘Confirmed’ AND CS Status = ‘Options accepted by customer’ 
              else if (percent_paid > 20 && cs_status == 4)// for point 11
              {
                //AND new Item Status = ‘Confirmed’
                if(new_item_status == 2)
                {
                  diamond_status = 1;//Confirmed
                  portal_request_type = 3;//Sold	
                  item_status = 2;//Confirmed
                  action_needed = "3,4";//Ready to ship,Ready to invoice	
                  nlapiLogExecution("DEBUG","Step 39",cdpId);
                }
                //Additions to DP logic
                //AND new Diamond Status = ‘Confirmed’ 
                else if(new_diamond_status == 1)
                {
                  diamond_status = 1;//Confirmed
                  portal_request_type = 3;//Sold	
                  item_status = 2;//Confirmed
                  action_needed = "3,4";//Ready to ship,Ready to invoice	
                  nlapiLogExecution("DEBUG","Step 39 A",cdpId);
                }
              }
              //Shipped = 11, Invoiced =12
              //12.	READY TO SHIP LOGIC 
              //1.	WHEN Portal Request Type = Sold AND old Item Status = ‘Confirmed’ AND new Action Needed contains ‘Shipped’ AND new Action Needed does not contain ‘Invoiced’ 
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12)== -1) // for point 1
              {
                diamond_status = 1; //	Confirmed
                portal_request_type = 3; //	Sold	
                item_status = 2;// shipped not available
                action_needed = "4,11";//	Ready to invoice,shipped
                nlapiLogExecution("DEBUG","Step 40",cdpId);
              }
              //2.	WHEN Portal Request Type = Sold AND old Item Status = ‘Confirmed’ AND new Action Needed does not contain ‘Shipped’ AND new Action Needed contains ‘Invoiced’ 
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) == -1 && new_action_needed.indexOf(12)!= -1) // for point 2
              {
                diamond_status = 1;//Confirmed
                portal_request_type = 3; //Sold	
                item_status = 2; //invoiced not available
                action_needed = "3,11";//Ready to ship ,invoiced
                nlapiLogExecution("DEBUG","Step 41",cdpId);
              }
              //3.	WHEN Portal Request Type = Sold AND old Item Status = ‘Confirmed’ AND new Action Needed contains ‘Shipped’ and ‘Invoiced’ 
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12)!= -1) //for point 3
              {
                diamond_status = 1;//Confirmed
                portal_request_type = 3;//Sold	
                item_status = 2;//invoiced  and shipped not available
                action_needed = "11,12";//shipped,invoiced
                nlapiLogExecution("DEBUG","Step 42",cdpId);
              }
            }
            /* End CDP Request Type = Replacement (diamond unavailable) */
            /* Start CDP Request Type = Hold */
            else if (request_type == 6) 				
            {
              if(new_item_status == 2)//for point 2 as per new req.
              {
                diamond_status = 7;//On Hold Pending Customer Decision
                portal_request_type = 2;//Hold	
                item_status = 2;//confirmed
                action_needed = '' ;//None
                nlapiLogExecution("DEBUG","Step 43",cdpId);
              }
              //Additions to DP logic
              else if(new_diamond_status == 7)
              {
                diamond_status = 7;//On Hold Pending Customer Decision
                portal_request_type = 2;//Hold	
                item_status = 2;//confirmed
                action_needed = '' ;//None
                nlapiLogExecution("DEBUG","Step 43 A",cdpId);
              }
              else //for point 1
              {
                diamond_status = ''; //null
                portal_request_type = 2;//Hold	
                item_status = 1;//not confirmed
                action_needed =  2 ;//confirmation needed
                nlapiLogExecution("DEBUG","Step 44",cdpId);
              }
            }
            /* End CDP Request Type = Hold */

            /* Start CDP Request Type = Memo, Appointment Request */
            else if (request_type == 9 || request_type == 2) 						
            {
              if (new_item_status == 2)//for point 2
              {
                diamond_status = 1;//Confirmed
                portal_request_type = 4;//Memo	
                item_status = 2;//Confirmed
                action_needed = 3;//Ready to ship
                //i.If diamond is received at BE and Action Needed = Ready to Ship, change to ‘Shipped’
                if((po_status =="pendingBilling" || po_status =="fullyBilled") && action_needed == 3) 
                {
                  action_needed = 11;//shipped
                  nlapiLogExecution("DEBUG","Step 45",cdpId);
                }
                nlapiLogExecution("DEBUG","Step 46",cdpId);
              }
              //Additions to DP logic
              else if(new_diamond_status == 1)
              {
                diamond_status = 1;//Confirmed
                portal_request_type = 4;//Memo	
                item_status = 2;//Confirmed
                action_needed = 3;//Ready to ship
                //i.If diamond is received at BE and Action Needed = Ready to Ship, change to ‘Shipped’
                if((po_status =="pendingBilling" || po_status =="fullyBilled") && action_needed == 3) 
                {
                  action_needed = 11;//shipped
                  nlapiLogExecution("DEBUG","Step 45 A",cdpId);
                }
                nlapiLogExecution("DEBUG","Step 46 A",cdpId);
              }
              else//for point 1
              {
                diamond_status = '';//null
                portal_request_type = 4;//Memo	
                item_status = 1;//Not Confirmed
                action_needed = 2;//Confirmation Needed
                nlapiLogExecution("DEBUG","Step 47",cdpId);
              }
            }
            /* End CDP Request Type = Memo */
            /* Start CDP Request Type = Cert Request */
            else if (request_type == 3)
            {
              if (new_item_status == 2)
              {
                diamond_status = 1;//Confirmed
                portal_request_type = 7;//Cert request
                item_status = 2;//confirmed
                action_needed =  6 ;//	none
                nlapiLogExecution("DEBUG","Step 48",cdpId);
              }
              //Additions to DP logic
              else if(new_diamond_status == 1)
              {
                diamond_status = 1;//Confirmed
                portal_request_type = 7;//Cert request
                item_status = 2;//confirmed
                action_needed =  6 ;//	none
                nlapiLogExecution("DEBUG","Step 48 A",cdpId);
              }
              else
              {
                diamond_status =''; //Null
                portal_request_type = 7; //Cert request	
                item_status = 1; //Not confirmed
                action_needed = 2; //Confirmation needed
                nlapiLogExecution("DEBUG","Step 49",cdpId);
              }
            } 
            /* End CDP Request Type = Cert Request */
            /* Start CDP Request Type = Photography Request */
            else if (request_type == 4) 
            {
              if (new_item_status == 2) 
              {
                diamond_status = 1;	//Confirmed
                portal_request_type = 6;//Image request	
                item_status = 2;//confirmed
                action_needed = 6 ; //none
                nlapiLogExecution("DEBUG","Step 50",cdpId);
              }
              //Additions to DP logic
              else if(new_diamond_status == 1)
              {
                diamond_status = 1;	//Confirmed
                portal_request_type = 6;//Image request	
                item_status = 2;//confirmed
                action_needed = 6 ; //none
                nlapiLogExecution("DEBUG","Step 50 A",cdpId);
              }
              else
              {
                diamond_status = ''; //	Null
                portal_request_type = 6; //	Image Request	
                item_status = 1; //Not confirmed
                action_needed = 2 ; //Confirmation needed
                nlapiLogExecution("DEBUG","Step 51",cdpId);
              }
            } 
            /* End CDP Request Type = Photography Request */
            /* Start CDP Request Type = Check availability/eye-clean */
            else if (request_type == 5)
            {
              if(new_item_status == 2) 
              {
                diamond_status = 1; //Confirmed
                portal_request_type = 5;//Check availability/eye-clean	
                item_status = 2;//confirmed
                action_needed = 6 ;//none
                nlapiLogExecution("DEBUG","Step 52",cdpId);
              }
              //Additions to DP logic
              else if(new_diamond_status == 1)
              {
                diamond_status = 1; //Confirmed
                portal_request_type = 5;//Check availability/eye-clean	
                item_status = 2;//confirmed
                action_needed = 6 ;//none
                nlapiLogExecution("DEBUG","Step 52 A",cdpId);
              }
              else
              {
                diamond_status = ''; //	Null
                portal_request_type = 5;//Check availability/eye-clean	
                item_status = 1;//not confirmed
                action_needed =  2 ;//confirmation needed
                nlapiLogExecution("DEBUG","Step 53",cdpId);
              }
            }
            /* End CDP Request Type = Check availability/eye-clean  */
            // logic for the 'Rules that Apply to All CDP's' section
            if(rec_Cdp_item_status_bol_val == true)
            {
              //1.WHEN new Item Status = ‘Cancelled’
              // For New Item Status
              if(new_item_status == 6)// for point 1
              {
                diamond_status = 5;//Cancelled
                item_status = 6;//Cancelled
                action_needed = "";
                nlapiLogExecution("DEBUG","Step 54 A",cdpId);
              } 
              //2.WHEN new Item Status = ‘EC Unknown’ 
              else if(new_item_status == 8)// for point 2
              {
                diamond_status = 2;//	'Requested-Pending';
                item_status = 8;//'EC Unknown';
                action_needed = 2;//'Confirmation Needed';
                nlapiLogExecution("DEBUG","Step 55 A",cdpId);
              } 
              //3.WHEN new Item Status = ‘Not Eye-Clean’ 
              else if(new_item_status == 3)// for point 3
              {
                diamond_status = 4;//'Not Eye-Clean';
                item_status = 3;//'Not Eye-Clean';
                action_needed = "";
                nlapiLogExecution("DEBUG","Step 56 A",cdpId);
              } 
              //4.WHEN new Item Status = ‘Not Available’ 
              else if(new_item_status == 7)// for point 4
              {
                //if(new_diamond_status == 6)//‘Not Available-Replacement Confirmed’
                //  diamond_status = 6;
                // else
                diamond_status = 3;//'Not Available';
                item_status = 7;//'Not Available';
                action_needed = "";
                nlapiLogExecution("DEBUG","Step 57 A",cdpId);
              }
            }
            // For New Diamond Status
            else if(rec_Cdp_diamond_status_bol_val == true)
            {
              //5.WHEN new Diamond Status = ‘Cancelled’ 
              if(new_diamond_status == 5)// for point 5
              {
                diamond_status = 5;//'Cancelled';
                item_status = 6;//'Cancelled';
                action_needed = "";
                nlapiLogExecution("DEBUG","Step 58 A",cdpId);
              }
              //6.WHEN new Diamond Status = ‘Not Eye-Clean’ 
              else if (new_diamond_status == 4)// for point 6
              {
                diamond_status = 4;//'Not eye clean';
                item_status = 3;//'Not eye clean';
                action_needed = "";
                nlapiLogExecution("DEBUG","Step 59 A",cdpId);
              }
              //7.WHEN new Diamond Status = ‘Not available’ 
              else if (new_diamond_status == 3)// new point as per Eric new req. on 7 sep 2018
              {
                diamond_status = 3;//'Not available';
                item_status = 7;//'Not available';
                action_needed = "";
                nlapiLogExecution("DEBUG","Step 59 B",cdpId);
              }

              //8.WHEN new Diamond Status = ‘Not Available-Replacement Confirmed’ 
              else if (new_diamond_status == 6)//new point as per Eric new req. on 7 sep 2018
              {
                diamond_status = 6;//'Not Available-Replacement Confirmed';
                item_status = 7;//'Not available';
                action_needed = "";
                nlapiLogExecution("DEBUG","Step 59 C",cdpId);
              }
              else if(new_diamond_status == 1)
              {
                if(new_item_status == 2)
                {
                  diamond_status = 1;//'Confirmed';
                  item_status = 2 //Confirmed
                  nlapiLogExecution("DEBUG","Step 59 D",cdpId);
                }
              }
            }
            else
            {
              //1.WHEN new Item Status = ‘Cancelled’
              // For New Item Status
              if(new_item_status == 6)// for point 1
              {
                diamond_status = 5;//Cancelled
                item_status = 6;//Cancelled
                action_needed = "";
                nlapiLogExecution("DEBUG","Step 54",cdpId);
              } 
              //2.WHEN new Item Status = ‘EC Unknown’ 
              else if(new_item_status == 8)// for point 2
              {
                diamond_status = 2;//	'Requested-Pending';
                item_status = 8;//'EC Unknown';
                action_needed = 2;//'Confirmation Needed';
                nlapiLogExecution("DEBUG","Step 55",cdpId);
              } 
              //3.WHEN new Item Status = ‘Not Eye-Clean’ 
              else if(new_item_status == 3)// for point 3
              {
                diamond_status = 4;//'Not Eye-Clean';
                item_status = 3;//'Not Eye-Clean';
                action_needed = "";
                nlapiLogExecution("DEBUG","Step 56",cdpId);
              } 
              //4.WHEN new Item Status = ‘Not Available’ 
              else if(new_item_status == 7)// for point 4
              {
                if(new_diamond_status == 6)//‘Not Available-Replacement Confirmed’
                  diamond_status = 6;
                else
                  diamond_status = 3;//'Not Available';
                item_status = 7;//'Not Available';
                action_needed = "";
                nlapiLogExecution("DEBUG","Step 57",cdpId);
              }
              // For New Diamond Status
              //5.WHEN new Diamond Status = ‘Cancelled’ 
              else if(new_diamond_status == 5)// for point 5
              {
                diamond_status = 5;//'Cancelled';
                item_status = 6;//'Cancelled';
                action_needed = "";
                nlapiLogExecution("DEBUG","Step 58",cdpId);
              }
              //6.WHEN new Diamond Status = ‘Not Eye-Clean’ 
              else if (new_diamond_status == 4)// for point 6
              {
                diamond_status = 4;//'Not eye clean';
                item_status = 3;//'Not eye clean';
                action_needed = "";
                nlapiLogExecution("DEBUG","Step 59 E",cdpId);
              }
              //7.WHEN new Diamond Status = ‘Not available’ 
              else if (new_diamond_status == 3)// new point as per Eric new req. on 7 sep 2018
              {
                diamond_status = 3;//'Not available';
                item_status = 7;//'Not available';
                action_needed = "";
                nlapiLogExecution("DEBUG","Step 59 F",cdpId);
              }
              //8.WHEN new Diamond Status = ‘Not Available-Replacement Confirmed’ 
              else if (new_diamond_status == 6)//new point as per Eric new req. on 7 sep 2018
              {
                diamond_status = 6;//'Not Available-Replacement Confirmed';
                item_status = 7;//'Not available';
                action_needed = "";
                nlapiLogExecution("DEBUG","Step 59 G",cdpId);
              }
              //9.WHEN new Diamond Status = ‘Confirmed’ 
              //added as per Eric new req users should be able to go in and manually change the Diamond Status to Confirmed on 6 sep 2018
              else if(new_diamond_status == 1)
              {
                if(new_item_status == 2)
                {
                  diamond_status = 1;//'Confirmed';
                  item_status = 2 //Confirmed
                  nlapiLogExecution("DEBUG","Step 59 H",cdpId);
                }
              }
            }
          } // End of else part & End Neither Group A or Group B Diamonds points
        }// End Override Mapping Logic

        var balanceObj = nlapiLookupField("customrecord_custom_diamond",cdpId,["custrecord_custom_diamond_true_balance","custrecord_custom_diamond_deposit_balanc","custrecord_website_balance"]);
        var trueBal = balanceObj.custrecord_custom_diamond_true_balance;
        nlapiLogExecution("DEBUG","True Bal",trueBal);
        var depositBal = balanceObj.custrecord_custom_diamond_deposit_balanc;
        nlapiLogExecution("DEBUG","Deposit Bal",depositBal);
        var websiteBal = balanceObj.custrecord_website_balance;
        nlapiLogExecution("DEBUG","Website Bal",websiteBal);
        var on_vendor_portal = cdp_obj.getFieldValue('custrecord_on_vendor_portal');
        var Delivery_location= cdp_obj.getFieldValue('custrecord_diamond_inventory_location');
        var gr_notes = cdp_obj.getFieldValue('custrecord_custom_diamond_gr_notes'); 
        var cs_notes = cdp_obj.getFieldValue('custrecord_custom_diamond_cs_notes'); 
        var diamond_notes = cdp_obj.getFieldValue('custrecord_custom_diamond_notes'); 
        if(vendor_id!=null && vendor_id!='')
          var paymentTerms= nlapiLookupField('vendor',vendor_id,'terms');
        var date_expected_at_be  = cdp_obj.getFieldValue('custrecord_date_expected_at_be');
        if(date_expected_at_be == "")
        {
          date_expected_at_be = null;
        }
        var delivery_date = '';
        var dd_firm = "";
        var poId = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_diamond_po_number");  
        if(poId != null && poId != "")
        {
          var poObj = nlapiLookupField("purchaseorder",poId,["custbody6","custbody82"]);
          delivery_date = poObj.custbody6;
          if(delivery_date == '')
          {
            delivery_date = null;
          }
          dd_firm = poObj.custbody82;
        }
        // DP-454 START HERE
        var portal_cost = 0;
        var portalCost = cdp_obj.getFieldValue('custrecord_portal_cost');
        nlapiLogExecution("DEBUG","Portal Cost (In NS) ", portalCost + " having cdp " + cdpId);
        if(portalCost != null && portalCost !='')
          portal_cost = portalCost;
        // END HERE
        var get_action_needed_with_inv_ship_ready_to_ship_ready_to_inv = false;
        var remove_cn_from_inv_ship_ready_to_ship_ready_to_inv = false;
        var  ac_needed  = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_action_needed");
        nlapiLogExecution("DEBUG","Check Action Needed for having Confirmation Needed(2)",ac_needed + " having cdp " + cdpId);
        // if Action Needed contains Shipped, Invoiced, Ready to Invoice, or Ready to Ship then it cannot revert to Confirmation 
        if(ac_needed !=null && ac_needed!='')
        {
          ac_needed = ac_needed.split(',');
          for(var c=0; c<ac_needed.length; c++)
          {
            if(ac_needed[c]== 11 || ac_needed[c] ==12 || ac_needed[c]==3 || ac_needed[c]==4)
            {
              get_action_needed_with_inv_ship_ready_to_ship_ready_to_inv  = true;
            }
            else if(ac_needed[c]== 2)
            {
              remove_cn_from_inv_ship_ready_to_ship_ready_to_inv = true;
            }
          }
        }
        if(get_action_needed_with_inv_ship_ready_to_ship_ready_to_inv == true)
        {
          if(remove_cn_from_inv_ship_ready_to_ship_ready_to_inv == true)
          {
            for(var c=0; c<ac_needed.length; c++)
            {
              if(ac_needed[c] == 2)
                ac_needed.splice(c,1);
            }
            action_needed = "["+ ac_needed +"]";
            nlapiLogExecution("DEBUG","Action Needed (1)",action_needed + " having cdp " + cdpId );
            nlapiLogExecution("DEBUG","Step 60",cdpId);
          }
          else
          {
            action_needed = "["+ ac_needed +"]";
            nlapiLogExecution("DEBUG","Action Needed (2)",action_needed + " having cdp " + cdpId);
            nlapiLogExecution("DEBUG","Step 61",cdpId);
          }
        }
        else
        {
          action_needed = "["+ action_needed +"]";
          nlapiLogExecution("DEBUG","Action Needed (3)",action_needed + " having cdp " + cdpId);
          nlapiLogExecution("DEBUG","Step 62",cdpId);
        }
        nlapiLogExecution("DEBUG","Action Needed (4)",action_needed + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","Portal Request Type Test(1)",portal_request_type + " having cdp" + cdpId);
        // if Portal request type contains sold  then it cannot revert to hold 
        if(cdp_obj.getFieldValue('custrecord165')!='' && cdp_obj.getFieldValue('custrecord165')!=null)
        {
          if(cdp_obj.getFieldValue('custrecord165')==3)
          {
            portal_request_type = cdp_obj.getFieldValue('custrecord165');
            nlapiLogExecution("DEBUG","Portal Request Type Test(2)",portal_request_type + " having cdp " + cdpId);
            nlapiLogExecution("DEBUG","Step 63",cdpId);
            //added below logic as per Eric req
            //If Portal Request Type = Sold AND Item Status = Confirmed, then it should not be changed into 'Not Confirmed' except by the user marking 'Override Mapping Logic'
            /*if(cdp_obj.getFieldValue('custrecord_item_status')!=null && cdp_obj.getFieldValue('custrecord_item_status')!='')
            {
              if(cdp_obj.getFieldValue('custrecord_item_status')==2)
              {
                item_status = cdp_obj.getFieldValue('custrecord_item_status');
                nlapiLogExecution("DEBUG","Item Status Test(2)",item_status + " having cdp " + cdpId);
                nlapiLogExecution("DEBUG","Step 63 A",cdpId);
                //Added new logic If Portal Request Type = Sold AND Item Status = Confirmed, then Diamond status should not be changed into NULL except by the user marking 'Override Mapping Logic' on Eric's feedback
                diamond_status = cdp_obj.getFieldValue('custrecord_diamond_status');
                nlapiLogExecution("DEBUG","Diamond Status Test(1)",diamond_status + " having cdp " + cdpId);
                nlapiLogExecution("DEBUG","Step 63 B",cdpId);
              }// End of if part for Item Status
            }*/// End of if part for Item Status checking null or blank
          }// End of if part for Portal Request Type
        }// End of if part for Portal Request Type checking null or blank
        // if diamond status contains On Hold - Customer Payment Pending then it cannot revert.
        nlapiLogExecution("DEBUG","Step 65",cdpId);
        var jsonobj = {
          "cdp_id"						: 	cdpId, 
          "vendor_id"					: 	vendor_id,
          "portal_request_type"			: 	portal_request_type,
          "action_needed"				:	action_needed,
          "item_status"					:	item_status,
          "on_vendor_portal"			:	on_vendor_portal,
          "manual_override"				:	override_mapping_logic,
          "payment_terms"				:	paymentTerms,
          "cdp_request_type"			:	request_type,
          "Delivery Location" 			: 	Delivery_location,
          "gr_notes" 					: 	gr_notes,
          "cs_notes" 					: 	cs_notes,
          "diamond_notes" 				: 	diamond_notes,
          "diamond_status"     	 		:   diamond_status,
          "date_expected_at_be"	 		:   date_expected_at_be,
          "delivery_date"       		:   delivery_date ==''? null : delivery_date,
          "dd_firm"             		:   dd_firm,
          "group"               		:   group,
          "percent_paid"        		:   percent_paid,
          "portal_cost"                :    portal_cost
        };
        //var url = "https://testportal.brilliantearth.com/api/cdp/";  //test portal
        var url = "https://partner.brilliantearth.com/api/cdp/";    // Live portal
        var headers = new Array();
        headers['http'] = '1.1';
        headers['Accept'] = 'application/json';   
        // headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542';  // test portal token
        headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';     // live portal token
        headers['Content-Type'] = 'application/json'; 
        headers['User-Agent-x'] = 'SuiteScript-Call';
        var myJSONText = JSON.stringify(jsonobj, replacer); 
        nlapiLogExecution('debug','CDP Response Body:', myJSONText);
        var response = nlapiRequestURL(url, myJSONText, headers); 
        nlapiLogExecution('debug','CDP Response Body Output :', response.getBody());
        nlapiLogExecution('debug','CDP Response Code :', response.getCode());
        if(response.getCode()== 200)
        {
          var responsebody = JSON.parse(response.getBody()) ;
          var portal_action_needed = responsebody["action_needed"];
          nlapiLogExecution("debug","Portal Action Needed value is JSON Data :",JSON.stringify(portal_action_needed));
          nlapiLogExecution("debug","Portal Action Needed value is :",portal_action_needed);
          //start here
          var get_action_needed_with_inv_ship_ready_to_ship_ready_to_inv_1 = false;
          var remove_cn_from_inv_ship_ready_to_ship_ready_to_inv_1 = false;
          var ac_needed  = portal_action_needed;
          nlapiLogExecution("DEBUG","Check for Portal Action Needed for having Confirmation Needed(2)",ac_needed + " having cdp " + cdpId);
          // if Action Needed contains Shipped, Invoiced, Ready to Invoice, or Ready to Ship then it cannot revert to Confirmation 
          if(ac_needed !=null && ac_needed!='')
          {
            ac_needed = ac_needed.toString().split(',');
            for(var c=0; c<ac_needed.length; c++)
            {
              if(ac_needed[c]== 11 || ac_needed[c] ==12 || ac_needed[c]==3 || ac_needed[c]==4)
              {
                get_action_needed_with_inv_ship_ready_to_ship_ready_to_inv_1  = true;
              }
              else if(ac_needed[c]== 2)
              {
                remove_cn_from_inv_ship_ready_to_ship_ready_to_inv_1 = true;
              }
            }
          }
          if(get_action_needed_with_inv_ship_ready_to_ship_ready_to_inv_1 == true)
          {
            if(remove_cn_from_inv_ship_ready_to_ship_ready_to_inv_1 == true)
            {
              for(var c=0; c<ac_needed.length; c++)
              {
                if(ac_needed[c] == 2)
                  ac_needed.splice(c,1);
              }
              portal_action_needed = ac_needed ;
              nlapiLogExecution("DEBUG","Portal Action Needed (1)",portal_action_needed + " having cdp " + cdpId );
              nlapiLogExecution("DEBUG","Step 66",cdpId);
            }
            else
            {
              portal_action_needed =  ac_needed ;
              nlapiLogExecution("DEBUG","Portal Action Needed (2)",portal_action_needed + " having cdp " + cdpId);
              nlapiLogExecution("DEBUG","Step 67",cdpId);
            }
          }
          nlapiLogExecution("DEBUG","Portal Action Needed (3)",portal_action_needed + " having cdp " + cdpId);
          //end here
          if(responsebody["on_vendor_portal"] == true)
          {
            on_vendor_portal = "T";
          }
          else if(responsebody["on_vendor_portal"] == false)
          {
            on_vendor_portal = "F";
          }
          cdp_obj.setFieldValue('custrecord_portal_response',JSON.stringify(responsebody));
          cdp_obj.setFieldValue('custrecord237',myJSONText);
          cdp_obj.setFieldValue('custrecord238',"874");
          cdp_obj.setFieldValue('custrecord241',nlapiGetContext().getExecutionContext());
          cdp_obj.setFieldValue('custrecord_on_vendor_portal',on_vendor_portal);
          cdp_obj.setFieldValue('custrecord_action_needed',portal_action_needed);
          cdp_obj.setFieldValue('custrecord_diamond_status',diamond_status);
          cdp_obj.setFieldValue('custrecord165',portal_request_type);
          cdp_obj.setFieldValue('custrecord_custom_diamond_true_balance',trueBal);
          cdp_obj.setFieldValue('custrecord_custom_diamond_deposit_balanc',depositBal);
          cdp_obj.setFieldValue('custrecord_website_balance',websiteBal);
          cdp_obj.setFieldValue('custrecord_item_status',item_status);
          // START DP-454
          portal_cost = responsebody["portal_cost"];
          nlapiLogExecution("DEBUG","Portal Cost (From Portal)", portal_cost + " having cdp " + cdpId);
          if(portal_cost !=null && portal_cost!='')
            cdp_obj.setFieldValue('custrecord_portal_cost',portal_cost);
          // END HERE
          var cdpId = nlapiSubmitRecord(cdp_obj,true,true);
          nlapiLogExecution('debug','NS CDP record has been pushed successfully on Portal for CDP Id :', cdpId );
          if(cdpId!='' && cdpId!=null)
          {
            var response = PushNSCdpItemDataToPortal(cdpId); // call to push SO Items after pushed cdpid
            if(response.code == '200')
            {
              nlapiLogExecution('debug','Successfully Pushed CDP Items to Portal for CdpId :', cdpId );
            }
            else
            {
              nlapiLogExecution('debug','CDP Item sync error for CdpId:'+cdpId, response.body ); 
            }// end check of result code
          }// end check of cdpId
        }
      }
    }
    nlapiLogExecution('debug', 'CDP Successfully Completed #' + cdpId, 'type : ' + type);
  }
  catch (ex) {
    nlapiLogExecution('debug', 'Error on Page', ex);
  }
}
function GetItemStatus(cdpId)
{
  //var flag = false;
  try
  {
    var filter = [];
    filter.push(new nlobjSearchFilter('internalid',null,'anyof',cdpId));
    var result = nlapiSearchRecord(null,'customsearch_3_days_ago_system_notes',filter); //7867
    if(result && result.length>0)
    {
      //flag = true;
      var noOfDays = result[0].getValue('date','systemNotes');
    }
  }
  catch(ec)
  {
    nlapiLogExecution('error','Error in getting 3 days ago item status #'+cdpId,ec.message);
  }
  return noOfDays;
}
function replacer(key, value)
{
  if (typeof value == "number" && !isFinite(value))
  {
    return String(value);
  }
  return value;
}

function PushNSCdpItemDataToPortal(cdpId)
{
  try
  {   
    var cdpArrField = ["custrecord_be_diamond_stock_number","custrecord_vendor_stock_number","custrecord165","custrecord_on_vendor_portal","custrecord_action_needed","custrecord_item_status","custrecord_custom_diamond_vendor","custrecord_diamond_inventory_location"];
    var cdpVal = nlapiLookupField("customrecord_custom_diamond",cdpId,cdpArrField);
    var beStockNoId = cdpVal.custrecord_be_diamond_stock_number; //get Id
    var beStockNo=nlapiLookupField('customrecord_custom_diamond',cdpId,'custrecord_be_diamond_stock_number',true)//get value 
    var vendorStockNo = cdpVal.custrecord_vendor_stock_number;
    var vendorId=cdpVal.custrecord_custom_diamond_vendor;
    var itemDelvLocation=cdpVal.custrecord_diamond_inventory_location;   
    if((cdpId!='' && cdpId!=null) && (beStockNoId!='' && beStockNoId!=null) && (vendorStockNo !='' && vendorStockNo !=null))
    {

      var itemId = beStockNoId;
      var itemArr = ["custitem20","custitem5","custitem27","custitem7","custitem19","custitem28","custitem25","vendorcost","custitem46","location","custitem30",
                     "lastpurchaseprice","custitem45","custitem37","custitem31","custitem32","custitem18", "custitem198"];
      var itemArrVal = nlapiLookupField("inventoryitem",itemId,itemArr);
      if(itemArrVal.custitem18 == ""){ itemArrVal.custitem18 = null; }
      var itemCost='';
      if(itemDelvLocation == null || itemDelvLocation =='')
      {
        itemDelvLocation=null;
      }
      //rap_price=itemArrVal.lastpurchaseprice;

      var rap_price='0',percent_rap=0;
      rap_price=itemArrVal.lastpurchaseprice; 
      percent_rap=itemArrVal.custitem45;
      if(rap_price=='' || rap_price==null)
      { 
        rap_price='0';
      }
      if(percent_rap=='' || percent_rap==null)
      {
        percent_rap='0';
      }
      //   if(itemArrVal.custitem20 == 7)   // condition for loose diamond inventory item
      if(itemArrVal.custitem20 == 7 ||(itemArrVal.custitem20=='18' &&  itemArrVal.custitem198=='T'))   //PANKAJ  TASK NO:-DP-336
      {  
        //Setting up URL of CDP
        //var url = "https://testportal.brilliantearth.com/api/item/";     
        //var url = "https://testportal.brilliantearth.com/api/item/"; // Test portal api
        var url = "https://partner.brilliantearth.com/api/item/";   // Live Portal api
        var headers = new Array(); 
        headers['http'] = '1.1';    
        headers['Accept'] = 'application/json';
        //headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //Test Portal
        headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; // Token Live Portal
        headers['Content-Type'] = 'application/json'; 
        headers['User-Agent-x'] = 'SuiteScript-Call';
        var cut_data=itemArrVal.custitem28;
        if(!cut_data){cut_data=null;}
        //Setting up Datainput
        var jsonobj = {"cdp_id": cdpId, 
                       "stock_no": vendorStockNo,
                       "be_stock_no": beStockNo,
                       "vendor_stock_no": vendorStockNo,
                       "shape":itemArrVal.custitem5,
                       "color":itemArrVal.custitem7,
                       "carat":itemArrVal.custitem27,
                       "clarity":itemArrVal.custitem19,
                       "cut":cut_data,
                       "cost":itemArrVal.vendorcost,
                       "lab":itemArrVal.custitem25,
                       "certificate_no":itemArrVal.custitem46,
                       "delivery_location":itemDelvLocation,
                       "measurements":itemArrVal.custitem30,
                       "rap_price":rap_price,
                       "percent_rap":percent_rap,
                       "fluor":itemArrVal.custitem37,
                       "girdle":itemArrVal.custitem31,
                       "cutlet":itemArrVal.custitem32,
                       "origin":itemArrVal.custitem18,
                       "item_id" : itemId
                      }

        //Stringifying JSON
        var myJSONText = JSON.stringify(jsonobj, replacer); 
        nlapiLogExecution('debug','CDP Item Response Body:', myJSONText);
        var response = nlapiRequestURL(url, myJSONText, headers);  
        //nlapiLogExecution('debug','Response Body:', response.getBody());
        //Below is being used to put a breakpoint in the debugger
        return response;
      }// end check
    }//end check of cdpId
  }
  catch(err)
  {
    nlapiLogExecution("debug","Error occur during CDPID's Items Push from NS to portal.",err.message); 
  }
}

function checkDiamondOnCDPWithSO(so_id,item_id)
{
  if((so_id!='' && so_id!=null) && (item_id!='' && item_id!=null))
  {
    var chk_diamond = true;
    var so_data = nlapiLoadRecord("salesorder",so_id);
    for(var so=0; so<so_data.getLineItemCount('item');so++)
    {
      var item_id_on_so = so_data.getLineItemValue('item','item',so+1);
      var itemtype = so_data.getLineItemValue('item','itemtype',so+1);
      if(itemtype == "InvtPart")
      {
        var item_category = nlapiLookupField("inventoryitem",item_id_on_so,"custitem20");
        if(item_category==7)
        {
          if(item_id_on_so !=item_id)
          {
            chk_diamond = false;
            break;
          }
        }
      }
    }
    nlapiLogExecution("Debug","Check Diamond on CDP with Sales Order",chk_diamond)
    return chk_diamond;
  }
}
function Cal_Percentage_Paid(cdpId)
{
  nlapiLogExecution('Debug',"cdpid in Cal_Percentage_Paid() fun",cdpId);
  var  soId=nlapiLookupField('customrecord_custom_diamond',cdpId,'custrecord_diamond_so_order_number');
  var  custId=nlapiLookupField('customrecord_custom_diamond',cdpId,'custrecord_diamond_customer_name');
  nlapiLogExecution('Debug',"Sales Order id",soId);
  nlapiLogExecution('Debug',"Customer Id",custId);
  if(soId == null || soId =='')
  {
    nlapiLogExecution('Debug',"so id","Sales Order Id does not exists on CDP page during Save.");
    return ;
  }
  if(custId == null || custId =='')
  {
    nlapiLogExecution('Debug',"cust Id","Customer Id does not exists on CDP page during Save.");
    return ;
  }
  if((soId != null && soId !='') && (custId !=null && custId !=''))
  {
    var websiteBal =  nlapiLookupField('customrecord_custom_diamond',cdpId,'custrecord_website_balance');
    if(websiteBal==''|| websiteBal==null)
      websiteBal = 0;
    nlapiLogExecution('Debug',"website bal",websiteBal);
    var trueObj=getTrueBalObj(soId,custId);
    var total= trueObj.total;
    nlapiLogExecution('Debug',"so total",total);
    var deposit = nlapiLookupField('customrecord_custom_diamond',cdpId,'custrecord_custom_diamond_deposit_balanc');
    nlapiLogExecution('Debug',"deposit",deposit);
    if(total != 0)
    {
      var perCdp= (total-websiteBal)/total * 100;
      nlapiLogExecution('Debug',"per % Cdp",perCdp);
      nlapiSubmitField('customrecord_custom_diamond',cdpId,["custrecord_website_balance","custrecord_custom_diamond_percent_paid","custrecord_custom_diamond_deposit_balanc"],[websiteBal,parseFloat(perCdp).toFixed(2),deposit]);
    }
  }
}
function getTrueBalObj(orderId,customerId)
{
  var returnObj={
    total : null,
    payments : null,
    depositTotal : null,
    refunds : null,
    credit : null,
    credit2 : null,
    deposit2 : null,
    balance : null
  }

  var payments = 0.00;
  var deposit_total = 0.00;
  var refunds = 0.00;
  var total = 0.00;

  //CUSTOMER PAYMENTS
  var filters = [];
  filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
  filters.push(new nlobjSearchFilter("createdfrom","appliedtotransaction","is",orderId));
  var cols = [];
  cols.push(new nlobjSearchColumn("appliedtoforeignamount",null,"sum"));
  var results = nlapiSearchRecord("customerpayment",null,filters,cols);
  if(results)
    payments = results[0].getValue("appliedtoforeignamount",null,"sum");

  if(payments==null || payments=="")
    payments = 0.00;

  nlapiLogExecution("debug","Customer Payments",payments);

  //CUSTOMER REFUNDS
  var deposits = [];
  var filters = [];
  filters.push(new nlobjSearchFilter("salesorder",null,"is",orderId));
  filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
  var cols = [];
  cols.push(new nlobjSearchColumn("fxamount"));
  var results = nlapiSearchRecord("customerdeposit",null,filters,cols);
  if(results)
  {
    for(var x=0; x < results.length; x++)
    {
      deposits.push(results[x].getId());
      deposit_total += parseFloat(results[x].getValue("fxamount"));
    }
  }

  if(deposits.length > 0)
  {
    var deposit_ids = [];
    var filters = [];
    filters.push(new nlobjSearchFilter("internalid",null,"anyof",deposits));
    filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
    filters.push(new nlobjSearchFilter("type","applyingtransaction","is","DepAppl"));
    var cols = [];
    cols.push(new nlobjSearchColumn("applyingtransaction"));
    var results = nlapiSearchRecord("customerdeposit",null,filters,cols);
    if(results)
    {
      for(var x=0; x < results.length; x++)
        deposit_ids.push(results[x].getValue("applyingtransaction"));
    }

    nlapiLogExecution("debug","Deposit Application ID's",deposit_ids.toString());

    if(deposit_ids.length > 0)
    {
      var filters = [];
      filters.push(new nlobjSearchFilter("mainline",null,"is","F"));
      filters.push(new nlobjSearchFilter("applyingtransaction",null,"anyof",deposit_ids));
      var cols = [];
      cols.push(new nlobjSearchColumn("applyingforeignamount",null,"sum"));
      var results = nlapiSearchRecord("customerrefund",null,filters,cols);
      if(results)
        refunds = results[0].getValue("applyingforeignamount",null,"sum");
      if(refunds==null || refunds=="")
        refunds = 0.00;
    }
  }

  nlapiLogExecution("debug","Customer Refunds",refunds);

  //OPEN CREDIT MEMOS
  var credit = 0.00;
  var filters = [];
  filters.push(new nlobjSearchFilter("custrecord_credit_memo_link_parent",null,"is",orderId));
  var cols = [];
  cols.push(new nlobjSearchColumn("custrecord_credit_memo_link_amount",null,"sum"));
  var results = nlapiSearchRecord("customrecord_credit_memo_link",null,filters,cols);
  if(results)
    credit = results[0].getValue("custrecord_credit_memo_link_amount",null,"sum");

  if(credit==null || credit=="")
    credit = 0.00;

  nlapiLogExecution("debug","Credit Memos (Open)",credit);

  //APPLIED CREDIT MEMOS
  var credit2 = 0.00;
  var filters = [];
  filters.push(new nlobjSearchFilter("entity",null,"is",customerId));
  filters.push(new nlobjSearchFilter("createdfrom","appliedtotransaction","is",orderId));
  filters.push(new nlobjSearchFilter("type","appliedtotransaction","is","CustInvc"));
  filters.push(new nlobjSearchFilter("status",null,"is","CustCred:B"));
  var cols = [];
  cols.push(new nlobjSearchColumn("appliedtoforeignamount",null,"sum"));
  var results = nlapiSearchRecord("creditmemo",null,filters,cols);
  if(results)
    credit2 = results[0].getValue("appliedtoforeignamount",null,"sum");

  if(credit2==null || credit2=="")
    credit2 = 0.00;

  nlapiLogExecution("debug","Credit Memos (Fully Applied)",credit2);

  //DEPOSITS WITH SALES ORDER LINK
  var deposit2 = 0.00;
  var filters = [];
  filters.push(new nlobjSearchFilter("entity",null,"is",customerId));
  filters.push(new nlobjSearchFilter("createdfrom","appliedtotransaction","is",orderId));
  filters.push(new nlobjSearchFilter("type","appliedtotransaction","is","CustInvc"));
  filters.push(new nlobjSearchFilter("salesorder","createdfrom","is","@NONE@"));
  var cols = [];
  cols.push(new nlobjSearchColumn("appliedtoforeignamount",null,"sum"));
  var results = nlapiSearchRecord("depositapplication",null,filters,cols);
  if(results)
    deposit2 = results[0].getValue("appliedtoforeignamount",null,"sum");

  if(deposit2==null || deposit2=="")
    deposit2 = 0.00;

  nlapiLogExecution("debug","Deposits Not Linked to SO",deposit2);
  var currency = nlapiLookupField("salesorder",orderId,"currency");
  /*
     * USA                  1
     * Canadian Dollar      3
     * Australian Dollar    5
     */
  if(currency=="3" || currency=="5")
  {
    total = nlapiLookupField("salesorder",orderId,"fxamount");
  }
  else if(currency=="1")
  {
    total = nlapiLookupField("salesorder",orderId,"total");
  }
  nlapiLogExecution("debug","Total",total);
  nlapiLogExecution("debug","Total:"+total+", payments:"+payments+",depositTotal:"+deposit_total+",refunds:"+refunds+",credit:"+credit+",credit2:"+credit2+",deposit2:"+deposit2,orderId);

  var TrueBalAdjustAmount = nlapiLookupField('salesorder',orderId,'custbody_website_truebalance_adj_amt'); 
  nlapiLogExecution('debug','True Bal AdjustAmount 1',TrueBalAdjustAmount);

  var TrueBalWriteOffAmt =  nlapiLookupField('salesorder',orderId,'custbody_write_off_adjust_amt'); 
  nlapiLogExecution('debug','True Bal WriteOff Amt 1',TrueBalWriteOffAmt);

  if(TrueBalAdjustAmount=='' || TrueBalAdjustAmount==null)
  {
    TrueBalAdjustAmount=0;
  }
  if(TrueBalWriteOffAmt=='' || TrueBalWriteOffAmt==null)
  {
    TrueBalWriteOffAmt=0;
  }

  var balance = parseFloat(total) + parseFloat(TrueBalAdjustAmount)+ parseFloat(TrueBalWriteOffAmt) - parseFloat(payments) - parseFloat(deposit_total) + parseFloat(refunds) + parseFloat(credit) - parseFloat(credit2) - parseFloat(deposit2);

  nlapiLogExecution("debug","Balance",balance);
  returnObj.total=total;
  returnObj.payments=payments;
  returnObj.depositTotal=deposit_total;
  returnObj.refunds=refunds;
  returnObj.credit=credit;
  returnObj.credit2=credit2;
  returnObj.deposit2=deposit2;
  returnObj.balance=balance;

  return returnObj;
}