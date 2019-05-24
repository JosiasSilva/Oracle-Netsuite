var scriptId = "2133";
function Diamond_Portal_Logic_Rewrite_Push_To_Portal_For_Percent_Paid(cdpId,type,recordType) 
{
  try 
  {
    nlapiLogExecution("DEBUG","type" , type);
    if (type == 'create' || type == 'edit' || type == 'xedit') 
    {
      nlapiLogExecution("DEBUG","Cdp Id " , cdpId);
      nlapiLogExecution("DEBUG","Record Type" , recordType);
      if(cdpId)
      {
        var cdp_obj = nlapiLoadRecord('customrecord_custom_diamond', cdpId);
        var pla =cdp_obj.getFieldValue("custrecord_cdp_pla");
        nlapiLogExecution('DEBUG','PLA diamond value(T/F):', pla + " having cdp" + cdpId);
        if(pla == 'T')
          return;
        var vendor_id=cdp_obj.getFieldValue('custrecord_custom_diamond_vendor');
        nlapiLogExecution("DEBUG","Vendor Id is : "+vendor_id," having cdp"+ cdpId);
        if(vendor_id == null || vendor_id == "")
          return ;
        if(vendor_id!=null && vendor_id!='')
          var date_on_portal = nlapiLookupField("vendor",vendor_id,"custentity_date_on_portal");
        nlapiLogExecution("DEBUG","Date on Portal is : "+date_on_portal," having cdp"+ cdpId);
        if(date_on_portal == null || date_on_portal == "")
          return ;
        // Item Status
        var d = new Date();
        var todayDate = nlapiDateToString(d);
        var old_item_status =''; var new_item_status =''; var temp_new_item_status =''; var temp_old_item_status ='';
        var sys_note_date='';
        var item_status = cdp_obj.getFieldValue('custrecord_item_status');
        var item_status_old_new_value = get_old_new_value_of_item_status(cdpId,temp_old_item_status,temp_new_item_status);
        nlapiLogExecution("DEBUG","Item Status old & new value without Json  (Temp) Info",item_status_old_new_value);
        nlapiLogExecution("DEBUG","Item Status old & new value Json  (Temp) Info",JSON.stringify(item_status_old_new_value));
        temp_old_item_status =item_status_old_new_value[0];
        temp_new_item_status = item_status_old_new_value[1];
        sys_note_date= item_status_old_new_value[2];
        nlapiLogExecution("DEBUG","Old Item Status (Temp) Info","Old Item Status is : " + temp_old_item_status + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","New Item Status (Temp) Info","New Item Status is : " + temp_new_item_status + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","System note date for item status Info","System note date for New Item Status is : " + sys_note_date + " having cdp " + cdpId);
        if(temp_new_item_status  != temp_old_item_status)
        {
          new_item_status = temp_new_item_status;
          old_item_status = temp_old_item_status;
          nlapiLogExecution("DEBUG","New Item Status Info","New Item Status is : " + new_item_status + " having cdp " + cdpId);
          nlapiLogExecution("DEBUG","Old Item Status Info","Old Item Status is : " + old_item_status + " having cdp " + cdpId);
        }
        // End Item Status

        // Action Needed
        var sys_note_date_action_needed ='';
        var new_action_needed =''; var old_action_needed='';
        var temp_new_action_needed =''; var temp_old_action_needed ='';
        var action_needed_old_new_value = get_old_new_value_of_action_needed(cdpId,temp_old_action_needed,temp_new_action_needed);
        nlapiLogExecution("DEBUG","Action Needed value JSON(Temp) Info from system notes",JSON.stringify(action_needed_old_new_value));
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

        // End Action Needed
        var diamond_status = cdp_obj.getFieldValue('custrecord_diamond_status');
        var action_needed = cdp_obj.getFieldValue('custrecord_action_needed');
        action_needed = action_needed.replace(/\u0005/g,',');
        nlapiLogExecution("DEBUG","Action Needed after replacing unicode",action_needed);
        var override_mapping_logic = cdp_obj.getFieldValue('custrecordoverride_mapping_logic');
        var request_type = cdp_obj.getFieldValue('custrecord_custom_diamond_request_type');
        var percent_paid = cdp_obj.getFieldValue('custrecord_custom_diamond_percent_paid');
        var group_a = cdp_obj.getFieldValue('custrecord_cdp_group_a');//group A
        var group_b = cdp_obj.getFieldValue('custrecord_cdp_group_b'); //group B
        if(percent_paid!='' && percent_paid!=null)
        {
          percent_paid=percent_paid.split('%')[0];
        }
        nlapiLogExecution("DEBUG","Paid Percentage Info","Paid Percentage is : " + percent_paid + " having cdp " + cdpId);
        var so_id = cdp_obj.getFieldValue('custrecord_diamond_so_order_number');
        nlapiLogExecution("DEBUG","Sales Order Id", so_id + " having cdp " + cdpId);
        if(recordType =="customerrefund")
        {
          if(so_id!=null && so_id!='')
            nlapiSubmitField("salesorder",so_id,"custbody_new_per_paid","F");
        }
        var new_per_paid_checkbox ='';
        if(so_id!=null && so_id!='')
          new_per_paid_checkbox = nlapiLookupField("salesorder",so_id,"custbody_new_per_paid");
        nlapiLogExecution("DEBUG","New per paid checkbox", new_per_paid_checkbox + " having cdp " + cdpId);
        if(new_per_paid_checkbox == null || new_per_paid_checkbox =='')
          new_per_paid_checkbox ='F';
        var temp_old_paid =0;
        var temp_new_paid =0;
        var new_paid =0;
        var sys_note_date_per_page='';
        var per_paid_old_new =  get_old_new_value_of_per_paid(cdpId,temp_old_paid,temp_new_paid);
        temp_old_paid = per_paid_old_new[0];
        temp_new_paid = per_paid_old_new[1];
        sys_date_note_per_page= per_paid_old_new[2];
        nlapiLogExecution("DEBUG","Old Per Paid (Temp) Info","Old Per Paid is : " + temp_old_paid + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","New Per Paid (Temp) Info","New Per Paid  is : " + temp_new_paid + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","System notes date for Per Paid (Temp) Info"," System notes date for New Per Paid  is : " + sys_note_date_per_page + " having cdp " + cdpId);
        if(recordType == "customerdeposit" || recordType =="customerrefund")
        {
          if(new_per_paid_checkbox=='F')
          {
            if(temp_new_paid != temp_old_paid)
              new_paid = temp_new_paid;
            nlapiLogExecution("DEBUG","New % Paid  Info","New % Paid is : " + new_paid + " having cdp " + cdpId);
            nlapiSubmitField("salesorder",so_id,"custbody_new_per_paid","T");
          }
        }
        var po_id = cdp_obj.getFieldValue('custrecord_diamond_po_number');
        nlapiLogExecution("DEBUG","Purchase Order Id",po_id + " having cdp " + cdpId);
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
        nlapiLogExecution("DEBUG","CS Status(Test)",cs_status + " having cdp " + cdpId);
        var item_id = cdp_obj.getFieldValue('custrecord_be_diamond_stock_number');
        var item_obj = nlapiLoadRecord('inventoryitem', item_id);
        var new_bill_date = item_obj.getFieldValue('custitem108');
        var portal_request_type = cdp_obj.getFieldValue('custrecord165');
        var be_diamond_stock_number = cdp_obj.getFieldText('custrecord_be_diamond_stock_number');
        var check_diamond_group = be_diamond_stock_number.substring(be_diamond_stock_number.length-1,be_diamond_stock_number.length);
        var group='';
        /*************** Start First Step points *******************/
        nlapiLogExecution("DEBUG","step 9",cdpId);
        if (check_diamond_group =='B') 
        {
          nlapiLogExecution("DEBUG","step 10",cdpId);
          var certificate_status = item_obj.getFieldValue('custitemcertificate_status');
          var item_location = item_obj.getLineItemCount("locations");
          var qnty_on_hand = 0;
          for (var i = 1; i < item_location; i++) 
          {
            qnty_on_hand = item_obj.getLineItemValue("locations", "quantityonhand", i);
            if (qnty_on_hand && qnty_on_hand > 0) 
            {
              nlapiLogExecution("DEBUG","Quantity on Hand",qnty_on_hand + " having cdp " + cdpId);
              break;
            }
          }
          if (check_diamond_group == 'B' && qnty_on_hand > 0 )// for point b
          {
            nlapiLogExecution("DEBUG","Step 11",cdpId);
            if(certificate_status == 5)
            {
              group = 'A';
              nlapiLogExecution("DEBUG","Step 12",cdpId);
            }
            else
            {
              group = 'B';
              nlapiLogExecution("DEBUG","Step 13",cdpId);
            }
          }
        }
        nlapiLogExecution("DEBUG","Check Diamond Group",check_diamond_group + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","Diamond Group",group + " having cdp " + cdpId);
        /********************** Start Group A Diamonds points *******************/
        if(override_mapping_logic=='F')
        {
          if (group == 'A' || group_a == 'T') 
          {
            nlapiLogExecution("DEBUG","step 14",cdpId);
            if(percent_paid > 20 && diamond_status != 5 && so_status == 'pendingFulfillment')
            {
              nlapiLogExecution("DEBUG","step 15",cdpId);
              if((request_type == 1 || request_type == 8))
              {
                portal_request_type = 3;		//	Sold
                item_status = 2;				//	Confirmed
                if (new_bill_date != '')		// for point 2
                {
                  action_needed = 14 ;	//	Certificate Required
                } 
                else 							// for point 1
                {
                  action_needed ="4,14";//	Ready to Invoice, Certificate Required
                }
                nlapiLogExecution("DEBUG","Step 16",cdpId);
              }
              else if( request_type == 7 && cs_status == 4 )
              {
                portal_request_type = 3; 		//	Sold
                item_status = 2; 				//	Confirmed
                if (new_bill_date != null && new_bill_date != '') // for point 4
                {
                  action_needed =14 ;	//	Certificate Required
                } 
                else 							// for point 3
                {
                  action_needed ="4,14";//	Ready to Invoice, Certificate Required
                }
                nlapiLogExecution("DEBUG","Step 17",cdpId);
              }
            }
            else 
            {
              nlapiLogExecution('DEBUG', 'Do not push to portal Group A Diamonds');
              return;
            }
          }
          /********************** End Group A Diamonds points *********************/
          /********************** Start Group B Diamonds points *******************/
          else if (group == 'B' || group_b == 'T') 
          {
            nlapiLogExecution("DEBUG","Step 18",cdpId);
            //fullyBilled
            if ( (request_type == 1 || request_type == 8) && diamond_status != 5 && so_status == 'fullyBilled' && (new_bill_date == null || new_bill_date == '')) // for point 1
            {
              portal_request_type = 3;		//	Sold
              item_status = 2;				//	Confirmed
              action_needed = 4 ;	//	Ready to Invoice
              nlapiLogExecution("DEBUG","Step 19",cdpId);
            } 
            else if (request_type == 7 && percent_paid > 20 && diamond_status != 5 && cs_status == 4 && so_status == 'pendingFulfillment' && new_bill_date != null && new_bill_date != '') // for point 2
            {
              portal_request_type = 3;		//	Sold
              item_status = 2;				//	Confirmed
              action_needed =4;	//	Ready to Invoice
              nlapiLogExecution("DEBUG","Step 20",cdpId);
            }
            else								// for point 3
            {
              nlapiLogExecution('DEBUG', 'Do not push to portal for Group B Diamonds');
              return ;
            }
          }
          /********************** End Group B Diamonds points ******************************************/
          /********************** Start Neither Group A or Group B Diamonds points *******************/
          else 
          {
            nlapiLogExecution("DEBUG","Step 21",cdpId);
            if(request_type ==1)
            {
              nlapiLogExecution("DEBUG","Step 22",cdpId);
              if (percent_paid < 20)				// for point 2
              {
                if (new_item_status == 2)		// for point 2
                {
                  diamond_status = 9; 		//	On Hold - Customer Payment Pending
                  portal_request_type = 2;	//	Hold
                  item_status = 2;			//	Confirmed
                  action_needed = '';		// 	null
                  nlapiLogExecution("DEBUG","Step 23",cdpId);
                }
                else							// for point 1
                {						
                  action_needed = 2 ;   // confirmation needed
                  portal_request_type = 2;	//	Hold
                  item_status = 1; 			//	Not Confirmed
                  diamond_status = '';		// 	null
                  nlapiLogExecution("DEBUG","Step 24",cdpId);
                }
              }
              else if(new_paid >20)
              {
                // for point 6
                diamond_status = '';		// 	null
                portal_request_type = 3;	//	Sold
                item_status = 1;			//	Not Confirmed
                action_needed = 2 ; //	 Confirmation Needed
                nlapiLogExecution("DEBUG","New Paid Step 25",cdpId);
              }
              else if (percent_paid > 20) 
              {
                nlapiLogExecution("DEBUG","Step 25",cdpId);
                if (new_item_status == 2) 			// for point 7
                {
                  diamond_status = 1;			//	Confirmed
                  portal_request_type = 3;	//	Sold
                  item_status = 2;			//	Confirmed
                  action_needed ="3,4";//	 Ready to Ship, Ready to Invoice
                  nlapiLogExecution("DEBUG","Step 26",cdpId);
                }
              }
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12) == -1) //for point no. 8			
              {
                nlapiLogExecution("DEBUG","Step 28",cdpId);
                diamond_status = 1; 			 //	  Confirmed
                portal_request_type = 3; 		 //	  Sold	
                item_status = 2; 				 //	  Confirmed
                action_needed = "4,11";//   Ready to Invoice , shipped
              } 
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) == -1 && new_action_needed.indexOf(12) != -1) //for point no. 9
              {
                nlapiLogExecution("DEBUG","Step 29",cdpId);
                diamond_status = 1; 			                  //	Confirmed
                portal_request_type = 3; 	 	                 //	Sold	
                item_status = 2; 				                //	Confirmed
                action_needed = "3,12";   //   Ready to Ship , Invoiced
              }
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12) != -1) //for point no.10
              {
                nlapiLogExecution("DEBUG","Step 30",cdpId);
                diamond_status = 1; 				  //Confirmed
                portal_request_type = 3; 			 //Sold	
                item_status = 2; 	                //Confirmed
                action_needed = "11,12";   //   Shipped , Invoiced
              }
            }
            /********************** End Neither Group A or Group B Diamonds points *****************************/
            /********************** Start CDP Request Type = Replacement (customer switch) *********************/
            else if (request_type == 8)
            {
              nlapiLogExecution("DEBUG","Step 31",cdpId);
              if (percent_paid < 20) 
              {
                if(new_item_status == 2 )
                {
                  diamond_status = 9; 			//	On Hold - Customer Payment Pending
                  portal_request_type = 2; 		//	Hold	
                  item_status = 2; 				//	Confirmed
                  action_needed = ''		//	Confirmation Needed
                  nlapiLogExecution("DEBUG","Step 32",cdpId);
                  var chk_diamond_on_cdp_with_so = checkDiamondOnCDPWithSO(so_id,item_id);
                  if(chk_diamond_on_cdp_with_so == false)
                    item_status = 6; // for canceled
                }
                else
                {
                  diamond_status = '';  			//	Null
                  portal_request_type = 2; 		//	Hold	
                  item_status = 1; 				//	 Not Confirmed
                  action_needed =  2 ;      //   Confirmation Needed
                  nlapiLogExecution("DEBUG","Step 33",cdpId);
                }
              }
              else if(new_paid>20)
              {
                diamond_status = '';  			//	Null
                portal_request_type = 3; 		//	Sold	
                item_status = 1; 				//	 Not Confirmed
                action_needed = "2";   //  Confirmation Needed
                nlapiLogExecution("DEBUG","New Paid Step 35",cdpId);
              }
              else if(percent_paid > 20) 
              {
                if(new_item_status == 2 )
                {
                  diamond_status = 1; 			//	Confirmed
                  portal_request_type = 3; 		//	Sold	
                  item_status = 2; 				//	Confirmed
                  action_needed = "3,4";   //  Ready to Ship, Ready to Invoice
                  nlapiLogExecution("DEBUG","Step 34",cdpId);
                }
              }
              else if(portal_request_type = 3 && old_item_status == 2)
              {
                if(new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12) != -1 )
                {
                  diamond_status = 1; 			//	Confirmed
                  portal_request_type = 3; 		//	Sold	
                  item_status = 2; 	            //Confirmed
                  action_needed = "11,12";  //	Shipped, Invoiced
                  nlapiLogExecution("DEBUG","Step 36",cdpId);
                }
                else if(new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12) == -1 )
                {
                  diamond_status = 1; 			//	Confirmed
                  portal_request_type = 3; 		//	Sold	
                  item_status = 2; 	            // Confirmed
                  action_needed = "11,4";//  Shipped,	Ready to Invoice
                  nlapiLogExecution("DEBUG","Step 37",cdpId);
                }
                else  if(new_action_needed.indexOf(11) == -1 && new_action_needed.indexOf(12) != -1 )
                {
                  diamond_status = 1; 			//	Confirmed
                  portal_request_type = 3; 		//	Sold	
                  item_status = 2; 	            // Confirmed
                  action_needed = "12,3"; //	Shipped, Ready to Invoice
                  nlapiLogExecution("DEBUG","Step 38",cdpId);
                }
              }
            }
            /********************** End CDP Request Type = Replacement (customer switch) ***************************/ 
            /********************** Start CDP Request Type = Replacement (diamond unavailable) *********************/
            else if (request_type == 7) 
            {
              if (percent_paid < 20) 				//	for point 1
              {
                if (new_item_status == 2 && cs_status != 4) //for point 2
                {
                  diamond_status = 7; 			//	On Hold Pending Customer Decision
                  portal_request_type = 2; 		//	Hold	
                  item_status = 2; 				// Confirmed
                  action_needed = ''; 			//	null
                  nlapiLogExecution("DEBUG","Step 39",cdpId);
                } 
                else if (new_item_status == 2 && cs_status == 4) //for point 3
                {
                  diamond_status = 7; 			//	On Hold Pending Customer Decision
                  portal_request_type = 2; 		//	Hold	
                  item_status = 2; 				//	Confirmed
                  action_needed = ''; 			//	null
                  nlapiLogExecution("DEBUG","Step 40",cdpId);
                }
                else
                {
                  diamond_status = ''; 			//	null
                  portal_request_type = 2; 		//	Hold	
                  item_status = 1; 				//	Not Confirmed
                  action_needed = 2;   //	Confirmation Needed
                  nlapiLogExecution("DEBUG","Step 41",cdpId);
                }
              }
              else if(new_paid>20)
              {
                if(item_status == 2 && cs_status != 4 ) //for point 5
                {
                  diamond_status = 7; 			//	On Hold Pending Customer Decision
                  portal_request_type = 2; 		//	Hold	
                  item_status = 2; 				// Confirmed
                  action_needed = ''; 			//	null
                  nlapiLogExecution("DEBUG","New Paid Step 43",cdpId);
                }
              }
              else if (percent_paid > 20)
              {
                if(portal_request_type == 2 && item_status == 1 && cs_status == 4)  //for point 6
                {
                  diamond_status = ''; 			//	null
                  portal_request_type = 3; 		//	Sold	
                  item_status = 1; 				//	Not Confirmed
                  action_needed = 2;  //	Confirmation Needed			
                  nlapiLogExecution("DEBUG","Step 44",cdpId);
                }
                else if ( portal_request_type == 2 && item_status == 2 && cs_status == 4)//for point 7
                {
                  diamond_status = 1; 				//	Confirmed
                  portal_request_type = 3; 			//	Sold	
                  item_status = 2;					// Confirmed
                  action_needed ="3,4";;//Ready to ship,Ready to invoice			
                  nlapiLogExecution("DEBUG","Step 45",cdpId);
                } 
                else if (new_item_status == 2 && cs_status == 4) //for point 8
                {
                  diamond_status = 1; 				  //	Confirmed
                  portal_request_type = 3; 			  //	Sold	
                  item_status = 2; 					  // Confirmed
                  action_needed = "3,4"; //Ready to ship,Ready to invoice	
                  nlapiLogExecution("DEBUG","Step 46",cdpId);
                }
              }
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12)== -1) // for point 9
              {
                diamond_status = 1; 				//	Confirmed
                portal_request_type = 3; 			//	Sold	
                item_status = 2;					// shipped not available
                action_needed = "4,11"; 	//	Ready to invoice,shipped
                nlapiLogExecution("DEBUG","Step 47",cdpId);
              }
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) == -1 && new_action_needed.indexOf(12)!= -1) // for point 10
              {
                diamond_status = 1; 				//	Confirmed
                portal_request_type = 3; 			//	Sold	
                item_status = 2; 					//	invoiced not available
                action_needed = "3,11"; 	//	Ready to ship ,invoiced
                nlapiLogExecution("DEBUG","Step 48",cdpId);
              }
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12)!= -1) //for point 11
              {
                diamond_status = 1; 				//	Confirmed
                portal_request_type = 3; 			//	Sold	
                item_status = 2; 					//	invoiced  and shipped not available
                action_needed = "11,12";  //	shipped,invoiced
                nlapiLogExecution("DEBUG","Step 49",cdpId);
              }
            }
            /********************** End CDP Request Type = Replacement (diamond unavailable) *********************/
            /********************** Start CDP Request Type = Hold  *********************************************/
            else if (request_type == 6) 				//for point 1
            {
              diamond_status = ''; 					//	null
              portal_request_type = 2; 				//	Hold	
              item_status = 1;						//	not confirmed
              action_needed =  2 ;						//	confirmation needed
              nlapiLogExecution("DEBUG","Step 50",cdpId);
            }
            /********************** End CDP Request Type = Hold  *********************/
            /********************** Start CDP Request Type = Memo  *******************/
            else if (request_type == 9) 						//	for point 1
            {
              if (new_item_status == 2)
              {
                diamond_status = 1;						//	confirmed
                portal_request_type = 4;				//	Memo	
                item_status = 2;						//	confirmed
                action_needed = 3; 				//	Ready to ship
                if((po_status =="pendingBilling" || po_status =="fullyBilled") && action_needed == 3) 
                {
                  action_needed = 11 ; // shipped
                  nlapiLogExecution("DEBUG","step 52",cdpId);
                }
              }
              else
              {
                diamond_status = '';					//	null
                portal_request_type = 4;				//	Memo	
                item_status = 1;						//	not confirmed
                action_needed = 2;						//	confirmation needed
                nlapiLogExecution("DEBUG","step 51",cdpId);
              }
            }
            /********************** End CDP Request Type = Memo  ***************************************/
            /********************** Start CDP Request Type = Appointment Request   *********************/
            else if (request_type == 2)
            {
              if(new_item_status == 2) 
              {
                diamond_status = 1; 					//	Confirmed
                portal_request_type = 4; 				//	Memo	
                item_status = 2; 						//	confirmed
                action_needed =  3 ;		    //Ready to ship
                if((po_status =="pendingBilling" || po_status =="fullyBilled") && action_needed==3) 
                {
                  action_needed = 11; // shipped
                  nlapiLogExecution("DEBUG","step 54",cdpId);
                }
                nlapiLogExecution("DEBUG","step 55",cdpId);
              }
              else
              {
                diamond_status = '';					//	Null
                portal_request_type = 4; 				//	Memo
                item_status = 1; 						//	not confirmed
                action_needed =  2 ; 			//	confirmation needed
                nlapiLogExecution("DEBUG","step 53",cdpId);
              }
            }
            /********************** End CDP Request Type = Appointment Request   ******************/
            /********************** Start CDP Request Type = Cert Request    *********************/
            else if (request_type == 3) 
            {
              if (new_item_status == 2)
              {
                diamond_status = 1; 					//	Confirmed
                portal_request_type = 7; 				//	Cert request
                item_status = 2;						//	confirmed
                action_needed =  6 ; 			//	none
                nlapiLogExecution("DEBUG","step 57",cdpId);
              }
              else
              {
                diamond_status = '';					//	Null
                portal_request_type = 7;				//	Cert request	
                item_status = 1; 						//	not confirmed
                action_needed =  2 ; 			//	confirmation needed
                nlapiLogExecution("DEBUG","step 56",cdpId);
              }
            } 
            /********************** End CDP Request Type = Cert Request    *******************************/
            /********************** Start CDP Request Type = Photography Request     *********************/
            else if (request_type == 4) 
            {
              if (new_item_status == 2) 
              {
                diamond_status = 1;						//	Confirmed
                portal_request_type = 6; 				//	Image request	
                item_status = 2; 						//	confirmed
                action_needed = 6 ; 			//	none
                nlapiLogExecution("DEBUG","step 59",cdpId);
              }
              else
              {
                diamond_status = ''; 					//	Null
                portal_request_type = 6; 				//	Image Request	
                item_status = 1; 						//	not confirmed
                action_needed =  2 ; 			//	confirmation needed
                nlapiLogExecution("DEBUG","step 58",cdpId);
              }
            } 
            /********************** End CDP Request Type = Photography Request     *********************************/
            /********************** Start CDP Request Type = Check availability/eye-clean      *********************/
            else if (request_type == 5)
            {
              if(new_item_status == 2) 
              {
                diamond_status = 1; 					//	Confirmed
                portal_request_type = 5; 				//	Check availability/eye-clean	
                item_status = 2; 						// confirmed
                action_needed = 6 ; 			//	none
                nlapiLogExecution("DEBUG","step 61",cdpId);
              }
              else
              {
                diamond_status = ''; 					//	Null
                portal_request_type = 5; 				//	Check availability/eye-clean	
                item_status = 1;						//	not confirmed
                action_needed =  2 ;			//	confirmation needed
                nlapiLogExecution("DEBUG","step 60",cdpId);
              }
            }
            if (new_item_status == 6)				// for point 1
            {
              diamond_status = 5;					//	Cancelled
              item_status = 6;					//	Cancelled
              action_needed = "";
              nlapiLogExecution("DEBUG","Step 5",cdpId);
            } else if (new_item_status == 8) 		// for point 2
            {
              diamond_status = 2;					//	'Requested-Pending';
              item_status = 8;					//	'EC Unknown';
              action_needed = 2;					//	'Confirmation Needed';
              nlapiLogExecution("DEBUG","Step 6",cdpId);
            } else if (new_item_status == 3)		// for point 3
            {
              diamond_status = 4;					//	'Not Eye-Clean';
              item_status = 3;					//	'Not Eye-Clean';
              action_needed = "";
              nlapiLogExecution("DEBUG","Step 7",cdpId);
            } else if (new_item_status == 7)		// for point 4
            {
              diamond_status = 3;					//	'Not Available';
              item_status = 7;					//	'Not Available';
              action_needed = "";
              nlapiLogExecution("DEBUG","Step 8",cdpId);
            }
          }
        }// End Override Mapping Logic
        /********************** End CDP Request Type = Check availability/eye-clean      *********************/
        var balanceObj = nlapiLookupField("customrecord_custom_diamond",cdpId,["custrecord_custom_diamond_true_balance","custrecord_custom_diamond_deposit_balanc","custrecord_website_balance"]);
        var trueBal = balanceObj.custrecord_custom_diamond_true_balance;
        nlapiLogExecution("DEBUG","True Bal",trueBal + " having cdp " + cdpId);
        var depositBal = balanceObj.custrecord_custom_diamond_deposit_balanc;
        nlapiLogExecution("DEBUG","Deposit Bal",depositBal + " having cdp " + cdpId);
        var websiteBal = balanceObj.custrecord_website_balance;
        nlapiLogExecution("DEBUG","Website Bal",websiteBal + " having cdp " + cdpId);
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
        var get_action_needed_with_inv_ship_ready_to_ship_ready_to_inv = false;
        var remove_cn_from_inv_ship_ready_to_ship_ready_to_inv = false;
        var  ac_needed  = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_action_needed");
        nlapiLogExecution("DEBUG","Check Action Needed for having Confirmation Needed(2)",ac_needed + " having cdp " + cdpId);
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
            nlapiLogExecution("DEBUG","Action Needed (1)",action_needed + " having cdp " + cdpId);
          }
          else
          {
            action_needed = "["+ ac_needed +"]";
            nlapiLogExecution("DEBUG","Action Needed (2)",action_needed + " having cdp " + cdpId);
          }
        }
        else
        {
          action_needed = "["+ action_needed +"]";
          nlapiLogExecution("DEBUG","Action Needed (3)",action_needed + " having cdp " + cdpId);
        }
        nlapiLogExecution("DEBUG","Action Needed (4)",action_needed + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","Portal Request Type for new logic(Test 1)",portal_request_type + " having cdp " + cdpId);
        if(cdp_obj.getFieldValue('custrecord165')!='' && cdp_obj.getFieldValue('custrecord165')!=null)
        {
          if(cdp_obj.getFieldValue('custrecord165')==3)
          {
            portal_request_type = cdp_obj.getFieldValue('custrecord165');
            nlapiLogExecution("DEBUG","Portal Request Type Test(2)",portal_request_type + " having cdp " + cdpId);
          }
        }
        if(recordType != "customerdeposit" && recordType !="customerrefund")
        {
          if(cdp_obj.getFieldValue('custrecord_diamond_status') !='' && cdp_obj.getFieldValue('custrecord_diamond_status') !=null)
          {
            if(cdp_obj.getFieldValue('custrecord_diamond_status') == 9)
            {
              diamond_status = cdp_obj.getFieldValue('custrecord_diamond_status');
              nlapiLogExecution("DEBUG","Diamond Status Test(1)",diamond_status + " having cdp " + cdpId);
            }
          }
        }
        nlapiLogExecution("DEBUG","Step 62",cdpId);
        var jsonobj = {
          "cdp_id"				: 	cdpId, 
          "vendor_id"			: 	vendor_id,
          "portal_request_type"	: 	portal_request_type,     
          "action_needed"		:	action_needed,
          "item_status"			:	item_status,
          "on_vendor_portal"	:	on_vendor_portal,
          "manual_override"		:	override_mapping_logic,
          "payment_terms"		:	paymentTerms,
          "cdp_request_type"	:	request_type,
          "Delivery Location" 	: 	Delivery_location,
          "gr_notes" 			: 	gr_notes,
          "cs_notes" 			: 	cs_notes,
          "diamond_notes" 		: 	diamond_notes,
          "diamond_status"      :   diamond_status,
          "date_expected_at_be" :   date_expected_at_be,
          "delivery_date"       :   delivery_date ==''? null : delivery_date,
          "dd_firm"             :   dd_firm
        };
        // var url = "https://testportal.brilliantearth.com/api/cdp/"; // Test Portal Url
        var url = "https://partner.brilliantearth.com/api/cdp/"; // Live Portal Url
        var headers = new Array(); 
        headers['http'] = '1.1';    
        headers['Accept'] = 'application/json';   
        //headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542';//Test Portal
        headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; // Live Portal
        headers['Content-Type'] = 'application/json'; 
        headers['User-Agent-x'] = 'SuiteScript-Call';
        var myJSONText = JSON.stringify(jsonobj, replacer); 
        nlapiLogExecution('DEBUG','CDP Response Body(New Logic):', myJSONText + " having cdp " + cdpId);
        var response = nlapiRequestURL(url, myJSONText, headers); 
        nlapiLogExecution('DEBUG','CDP Response Body Output(New Logic) :', response.getBody() + " having cdp " + cdpId);
        nlapiLogExecution('DEBUG','CDP Response Code(New Logic) :', response.getCode() + " having cdp " + cdpId);
        if(response.code=='200')
        {
          var responsebody = JSON.parse(response.getBody()) ;
          var portal_action_needed = responsebody["action_needed"];
          nlapiLogExecution("DEBUG","Portal Action Needed value (JSON Format) :",JSON.stringify(portal_action_needed) + " having cdp " + cdpId);
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
          cdp_obj.setFieldValue('custrecord238',scriptId);
          cdp_obj.setFieldValue('custrecord241',nlapiGetContext().getExecutionContext());
          cdp_obj.setFieldValue('custrecord_on_vendor_portal',on_vendor_portal);
          cdp_obj.setFieldValue('custrecord_action_needed',portal_action_needed);
          cdp_obj.setFieldValue('custrecord_diamond_status',diamond_status);
          cdp_obj.setFieldValue('custrecord165',portal_request_type);
          cdp_obj.setFieldValue('custrecord_custom_diamond_true_balance',trueBal);
          cdp_obj.setFieldValue('custrecord_custom_diamond_deposit_balanc',depositBal);
          cdp_obj.setFieldValue('custrecord_website_balance',websiteBal);
          cdp_obj.setFieldValue('custrecord_item_status',item_status);
          var cdpId = nlapiSubmitRecord(cdp_obj,true,true);
          nlapiLogExecution('DEBUG','NS CDP record has been pushed successfully on Portal for CDP Id(New Logic) :', cdpId );
          if(cdpId!='' && cdpId!=null)
          {
            var response = PushNSCdpItemDataToPortal(cdpId); // call to push SO Items after pushed cdpid
            if(response.code == '200')
            {
              nlapiLogExecution('DEBUG','Successfully Pushed CDP Items to Portal for CdpId(New Logic) :', cdpId );	                                   
            }                                                                
            else
            {                                             		                        
              nlapiLogExecution('DEBUG','CDP Item sync error for CdpId(New Logic):'+cdpId, response.body ); 
            }// end check of result code
          }// end check of cdpId
        }						
      }
    }
    /*************** End First Step points *******************/
    nlapiLogExecution('DEBUG', 'CDP Successfully Completed(New Logic) #' + cdpId, 'type : ' + type);
  }
  catch (ex) {
    nlapiLogExecution('DEBUG', 'Error on Page', ex);
  }
}


function GetItemStatus(cdpId)
{
  var flag = false;
  try
  {
    var filter = [];
    filter.push(new nlobjSearchFilter('internalid',null,'anyof',cdpId));
    var result = nlapiSearchRecord(null,'customsearch_3_days_ago_system_notes',filter); //7867
    if(result && result.length>0)
    {
      flag = true;
    }
  }
  catch(ec)
  {
    nlapiLogExecution('error','Error in getting 3 days ago item status #'+cdpId,ec);
  }
  return flag;
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
        //var url = "http://testportal.brilliantearth.com/api/item/";     
        var url = "https://partner.brilliantearth.com/api/item/";     
        var headers = new Array(); 
        headers['http'] = '1.1';    
        headers['Accept'] = 'application/json';       				  
        //headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //Test Portal
        headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837'; // Live Portal		
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
                       "origin":itemArrVal.custitem18
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