var scriptId = "2133";
//function Diamond_Portal_Logic_Rewrite(cdpId,type,scriptId) 
function Diamond_Portal_Logic_Rewrite(cdpId,type,recordType) 
{
  try 
  {
    if (type == 'create' || type == 'edit' || type == 'xedit') 
    {
      nlapiLogExecution("DEBUG","cdp id " , cdpId);
      nlapiLogExecution("DEBUG","recordType" , recordType);
      if(cdpId) 
      {
        //if(scriptId == "874")
        //{
        var new_obj = nlapiGetNewRecord();
        var old_obj = nlapiGetOldRecord();
        if(recordType == "customrecord_custom_diamond" )
        {
          nlapiLogExecution("DEBUG","Information" ,"Calculate % paid for custom diamond");
          Cal_Percentage_Paid(cdpId);
        }
        if(new_obj !=null &&  new_obj!='' && old_obj!='' &&  old_obj!=null)
        {
          var new_item_status = new_obj.getFieldValue('custrecord_item_status');
          var old_item_status = old_obj.getFieldValue('custrecord_item_status');
          var new_action_needed = new_obj.getFieldValue('custrecord_action_needed');
          var old_action_needed = old_obj.getFieldValue('custrecord_action_needed');

          nlapiLogExecution("DEBUG","Old Item Status Info","Old Item Status is : "+old_item_status);
          nlapiLogExecution("DEBUG","New Item Status Info","New Item Status is : "+new_item_status);

          nlapiLogExecution("DEBUG","Old Action Needed Info","Old Action Needed is : "+old_action_needed);
          nlapiLogExecution("DEBUG","New Action Needed Info","New Action Needed is : "+new_action_needed);
        }
        //var old_percent_paid = old_obj.getFieldValue('custrecord_custom_diamond_percent_paid');
        //var new_percent_paid = new_obj.getFieldValue('custrecord_custom_diamond_percent_paid');
        //if(new_percent_paid!='' && new_percent_paid!=null)
        //{
        //   new_percent_paid=new_percent_paid.split('%')[0];
        //}


        // nlapiLogExecution("DEBUG","Old Percentage Info","Old Percentage is : "+old_percent_paid);
        //nlapiLogExecution("DEBUG","New Percentage Info","New Percentage is : "+new_percent_paid);
        // }
        var cdp_obj = nlapiLoadRecord('customrecord_custom_diamond', cdpId);
        var item_status = cdp_obj.getFieldValue('custrecord_item_status');
        nlapiLogExecution("debug","item_status(test)",item_status);
        var diamond_status = cdp_obj.getFieldValue('custrecord_diamond_status');
        var action_needed = cdp_obj.getFieldValue('custrecord_action_needed');
        var override_mapping_logic = cdp_obj.getFieldValue('custrecordoverride_mapping_logic');
        var request_type = cdp_obj.getFieldValue('custrecord_custom_diamond_request_type');
        var percent_paid = cdp_obj.getFieldValue('custrecord_custom_diamond_percent_paid');
        /*if(scriptId == "889")
        {
          var old_item_status= 0;
          var old_action_needed= 0;
          old_item_status = item_status;
          var new_item_status = nlapiGetFieldValue("custrecord_item_status"); 
          nlapiLogExecution("DEBUG","Old Item Status Info scriptId #889","Old Item Status is : "+old_item_status);
          nlapiLogExecution("DEBUG","New Item Status Info scriptId #889","New Item Status is : "+new_item_status);

          old_action_needed = action_needed;
          var new_action_needed = nlapiGetFieldValue("custrecord_action_needed");
          nlapiLogExecution("DEBUG","Old Action Needed Info scriptId #889","Old Action Needed is : "+old_action_needed);
          nlapiLogExecution("DEBUG","New Action Needed Info scriptId #889","New Action Needed is : "+new_action_needed);
        }*/
        if(percent_paid!='' && percent_paid!=null)
        {
          percent_paid=percent_paid.split('%')[0];
        }
        nlapiLogExecution("DEBUG","Paid Percentage Info","Paid Percentage is : "+percent_paid);
        var so_id = cdp_obj.getFieldValue('custrecord_diamond_so_order_number');
        nlapiLogExecution("debug","so id",so_id);
        var po_id = cdp_obj.getFieldValue('custrecord_diamond_po_number');
        nlapiLogExecution("debug","po id",po_id);
        var so_status = '';
        var po_status ='';
        nlapiLogExecution("DEBUG","step 1",cdpId);
        if(so_id)
        { 
          so_status = nlapiLookupField('salesorder', so_id, 'status');
          nlapiLogExecution("DEBUG","step 2",cdpId);
        }
        if(po_id)
        {
          po_status = nlapiLookupField('purchaseorder',po_id,'status');
          nlapiLogExecution("DEBUG","step 3",cdpId);
        }
        nlapiLogExecution("DEBUG","Purchase Order Status",po_status);
        nlapiLogExecution("DEBUG","Sales Order Status",so_status);
        var cs_status = cdp_obj.getFieldValue('custrecord_custom_diamond_cs_status');
        nlapiLogExecution("debug","cs_status(test)",cs_status);
        //var new_cs_status = '';
        var item_id = cdp_obj.getFieldValue('custrecord_be_diamond_stock_number');
        var item_obj = nlapiLoadRecord('inventoryitem', item_id);
        var new_bill_date = item_obj.getFieldValue('custitem108');
        var portal_request_type = cdp_obj.getFieldValue('custrecord165');
        nlapiLogExecution("DEBUG","Portal Request Type(initially)",portal_request_type);

        if(new_obj !=null &&  new_obj!='' && old_obj!='' &&  old_obj!=null)
        {
          var new_portal_request_type = new_obj.getFieldValue('custrecord165');
          var old_portal_request_type = old_obj.getFieldValue('custrecord165');
          nlapiLogExecution("DEBUG","Old Portal Request Type Info","Old Portal Request Type is : "+old_portal_request_type);
          nlapiLogExecution("DEBUG","New Portal Request Type Info","New Portal Request Type is : "+new_portal_request_type);
        }


        //var portal_request_type='';
        //var new_portal_request_type ='';
        //if(portal_request_type_tmp !='' || portal_request_type_tmp != null)
        //portal_request_type = portal_request_type_tmp;
        ///*************** Start Rules that Apply to All CDP’s points *******************

        if(override_mapping_logic != 'T')			// for point 5
        {
          nlapiLogExecution("DEBUG","step 4",cdpId);
          if (new_item_status == 6)				// for point 1
          {
            diamond_status = 5;					//	Cancelled
            item_status = 6;					//	Cancelled
            action_needed = "";
            nlapiLogExecution("DEBUG","step 5",cdpId);
          } else if (new_item_status == 8) 		// for point 2
          {
            diamond_status = 2;					//	'Requested-Pending';
            item_status = 8;					//	'EC Unknown';
            action_needed = 2;					//	'Confirmation Needed';
            nlapiLogExecution("DEBUG","step 6",cdpId);
          } else if (new_item_status == 3)		// for point 3
          {
            diamond_status = 4;					//	'Not Eye-Clean';
            item_status = 3;					//	'Not Eye-Clean';
            action_needed = "";
            nlapiLogExecution("DEBUG","step 7",cdpId);
          } else if (new_item_status == 7)		// for point 4
          {
            diamond_status = 3;					//	'Not Available';
            item_status = 7;					//	'Not Available';
            action_needed = "";
            nlapiLogExecution("DEBUG","step 8",cdpId);
          }
        }
        //*************** End Rules that Apply to All CDP’s points *******************/
        var action_needed_arr = [];
        var be_diamond_stock_number = cdp_obj.getFieldText('custrecord_be_diamond_stock_number');
        var check_diamond_group = be_diamond_stock_number.replace(/[0-9]/g, '');
        var group='';
        /*************** Start First Step points *******************/
        if(type == 'create')
        {
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
                break;
              }
            }
            if (check_diamond_group == 'B' && qnty_on_hand > 0 )// for point b
            {
              nlapiLogExecution("DEBUG","step 11",cdpId);
              if(certificate_status == 5)
              {
                group = 'A';
                nlapiLogExecution("DEBUG","step 12",cdpId);
              }
              else
              {
                group = 'B';
                nlapiLogExecution("DEBUG","step 13",cdpId);
              }
            }
          }
        }

        nlapiLogExecution("DEBUG","Check Diamond Group",check_diamond_group);
        nlapiLogExecution("DEBUG","Diamond Group",group);

        /********************** Start Group A Diamonds points *******************/
        //var new_bill_date = item_obj.getFieldValue('custitem108');
        if (group == 'A') 
        {
          nlapiLogExecution("DEBUG","step 14",cdpId);
          /*
 Group A Diamonds
1.	WHEN CDP Request Type = ANY(‘Sold’, ’Replacement (customer switch)’) AND Diamond Status  != ‘Cancelled’ AND % Paid > 20 AND new Sales Order Status = ‘Pending Fulfillment’ AND diamond New Bill Date {custitem108} IS NULL THEN 
 a.	Portal Request Type = Sold
 b.	Item Status = Confirmed
 c.	Action Needed = Ready to Invoice, Certificate Required

 2.	WHEN CDP Request Type = ANY(‘Sold’, ’Replacement (customer switch)’) AND Diamond Status  != ‘Cancelled’ AND % Paid > 20 AND new Sales Order Status = ‘Pending Fulfillment’ AND diamond New Bill Date {custitem108} NOT NULL THEN 
 a.	Portal Request Type = Sold
 b.	Item Status = Confirmed
 c.	Action Needed = Certificate Required
*/
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
                //action_needed_arr.push(2);	
                // action_needed_arr.push(4);	
              }
              nlapiLogExecution("DEBUG","step 16",cdpId);
            }
            /*
3.	WHEN CDP Request Type = ‘Replacement (diamond unavailable)’ AND % Paid > 20 AND Diamond Status != ‘Cancelled’ AND CS Status = ‘Options accepted by customer’ AND Sales Order Status changes to ‘Pending Fulfillment’ AND diamond New Bill Date {custitem108} IS NULL THEN 
 a.	Portal Request Type = Sold
 b.	Item Status = Confirmed
 c.	Action Needed = Ready to Invoice, Certificate Required
4.	WHEN CDP Request Type = ‘Replacement (diamond unavailable)’ AND % Paid > 20 AND Diamond Status != ‘Cancelled’ AND CS Status = ‘Options accepted by customer’ AND Sales Order Status changes to ‘Pending Fulfillment’ AND diamond New Bill Date {custitem108} IS NOT NULL THEN 
 a.	Portal Request Type = Sold
 b.	Item Status = Confirmed
 c.	Action Needed = Certificate Required
*/
            else if( request_type == 7 && cs_status == 4 )
            {
              portal_request_type = 3; 		//	Sold
              item_status = 2; 				//	Confirmed
              if (new_bill_date != null && new_bill_date != '') // for point 4
              {
                // action_needed_arr.push(2);	//	Certificate Required
                action_needed =14 ;	//	Certificate Required
              } 
              else 							// for point 3
              {
                action_needed ="4,14";//	Ready to Invoice, Certificate Required
                //action_needed_arr.push(2);	
                //action_needed_arr.push(4);	//	Ready to Invoice, Certificate Required
              }
              nlapiLogExecution("DEBUG","step 17",cdpId);
            }
          }
          else 
          {
            nlapiLogExecution('debug', 'Do not push to portal Group A Diamonds');
            return;
          }
        }
        /********************** End Group A Diamonds points *********************/

        /********************** Start Group B Diamonds points *******************/
        else if (group == 'B') 
        {
          nlapiLogExecution("DEBUG","step 18",cdpId);
          /*
Group B Diamonds
 1.	WHEN CDP Request Type = ANY(‘Sold’, ’Replacement (customer switch)’) AND Diamond Status != ‘Cancelled’ AND new Sales Order Status = ‘Billed’ AND diamond New Bill Date {custitem108} IS NULL THEN 
a.	Portal Request Type = Sold
b.	Item Status = Confirmed
c.	Action Needed = Ready to Invoice

 2.	WHEN CDP Request Type = ‘Replacement (diamond unavailable)’ AND % Paid > 20 AND Diamond Status != ‘Cancelled’ AND CS Status = ‘Options accepted by customer’ AND Sales Order Status changes to ‘Pending Fulfillment’ AND diamond New Bill Date {custitem108} IS NULL THEN 
 a.	Portal Request Type = Sold
b.	Item Status = Confirmed
c.	Action Needed = Ready to Invoice
 */
          //fullyBilled
          if ( (request_type == 1 || request_type == 8) && diamond_status != 5 && so_status == 'fullyBilled' && (new_bill_date == null || new_bill_date == '')) // for point 1
          {
            portal_request_type = 3;		//	Sold
            item_status = 2;				//	Confirmed
            //action_needed_arr.push(4);		//	Ready to Invoice,
            action_needed = 4 ;	//	Ready to Invoice
            nlapiLogExecution("DEBUG","step 19",cdpId);
          } 
          else if (request_type == 7 && percent_paid > 20 && diamond_status != 5 && cs_status == 4 && so_status == 'pendingFulfillment' && new_bill_date != null && new_bill_date != '') // for point 2
          {
            portal_request_type = 3;		//	Sold
            item_status = 2;				//	Confirmed
            //action_needed_arr.push(4);	//	Ready to Invoice,
            action_needed =4;	//	Ready to Invoice
            nlapiLogExecution("DEBUG","step 20",cdpId);
          } 
          else								// for point 3
          {
            nlapiLogExecution('debug', 'Do not push to portal for Group B Diamonds');
            return ;
          }
        }
        /********************** End Group B Diamonds points ******************************************/

        /********************** Start Neither Group A or Group B Diamonds points *******************/
        else 
        {
          nlapiLogExecution("DEBUG","step 21",cdpId);
          if(request_type ==1)
          {
            nlapiLogExecution("DEBUG","step 22",cdpId);
            if (percent_paid < 20)				// for point 2
            {
              if (new_item_status == 2)		// for point 2
              {
                diamond_status = 9; 		//	On Hold - Customer Payment Pending
                portal_request_type = 2;	//	Hold
                item_status = 2;			//	Confirmed
                action_needed = '';		// 	null
                nlapiLogExecution("DEBUG","step 23",cdpId);
              }
              else							// for point 1
              {						
                //action_needed_arr.push(2);	 
                action_needed = 2 ;   // confirmation needed
                portal_request_type = 2;	//	Hold
                item_status = 1; 			//	Not Confirmed
                diamond_status = '';		// 	null
                nlapiLogExecution("DEBUG","step 24",cdpId);
              }
            } 
            else if (percent_paid > 20) 
            {
              nlapiLogExecution("DEBUG","step 25",cdpId);
              if (new_item_status == 2) 			// for point 7
              {
                diamond_status = 1;			//	Confirmed
                portal_request_type = 3;	//	Sold
                item_status = 2;			//	Confirmed
                action_needed ="3,4";//	 Ready to Ship, Ready to Invoice
                //action_needed_arr.push(3);
                //action_needed_arr.push(4);	//	 Ready to Ship, Ready to Invoice
                nlapiLogExecution("DEBUG","step 26",cdpId);
              }
              /*
8.	WHEN Portal Request Type = Sold AND old Item Status = ‘Confirmed’ AND new Action Needed contains ‘Shipped’ AND new Action Needed does not contain ‘Invoiced’ THEN
a.	Diamond Status = Confirmed
b.	Portal Request Type = Sold
c.	Item Status = Confirmed
d.	Action Needed = Ready to Invoice,shipped
*/
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12) == -1) //for point no. 8			
              {
                nlapiLogExecution("DEBUG","step 28",cdpId);
                diamond_status = 1; 			 //	  Confirmed
                portal_request_type = 3; 		 //	  Sold	
                item_status = 2; 				 //	  Confirmed
                //action_needed_arr.push(4);	     //   Ready to Invoice
                //action_needed_arr.push(11);	     //    shipped
                action_needed = "4,11";//   Ready to Invoice , shipped

              } 
              /*
 9.WHEN Portal Request Type = Sold AND old Item Status = ‘Confirmed’ AND new Action Needed does not contain ‘Shipped’ AND new Action Needed contains ‘Invoiced’ THEN
a.	Diamond Status = Confirmed
b.	Portal Request Type = Sold
c.	Item Status = Confirmed
d.	Action Needed = Ready to Ship,Invoiced
*/
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) == -1 && new_action_needed.indexOf(12) != -1) //for point no. 9
              {
                nlapiLogExecution("DEBUG","step 29",cdpId);
                diamond_status = 1; 			                  //	Confirmed
                portal_request_type = 3; 	 	                 //	Sold	
                item_status = 2; 				                //	Confirmed
                // action_needed_arr.push(3);	               //  Ready to Ship
                //action_needed_arr.push(12);	              //  Invoiced
                action_needed = "3,12";   //   Ready to Ship , Invoiced
              } 
              /*
                        10.	WHEN Portal Request Type = Sold AND old Item Status = ‘Confirmed’ AND new Action Needed contains ‘Shipped’and ‘Invoiced’ THEN
							a.	Diamond Status = Confirmed
							b.	Portal Request Type = Sold
							c.	Item Status = Confirmed
							d.	Action Needed = Shipped, Invoiced
					*/
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12) != -1) //for point no.10
              {
                nlapiLogExecution("DEBUG","step 30",cdpId);
                diamond_status = 1; 				  //Confirmed
                portal_request_type = 3; 			 //Sold	
                item_status = 2; 	                //Confirmed
                //action_needed_arr.push(11);	       //Shipped
                //action_needed_arr.push(12);	      //Invoiced
                action_needed = "11,12";   //   Shipped , Invoiced
              }
              else // for point 6
              {
                diamond_status = '';		// 	null
                portal_request_type = 3;	//	Sold
                item_status = 1;			//	Not Confirmed
                action_needed = 2 ; //	 Confirmation Needed
                //action_needed_arr.push(2);	//	Confirmation Needed
                nlapiLogExecution("DEBUG","step 27",cdpId);
              }
            }
          }
          /********************** End Neither Group A or Group B Diamonds points *****************************/

          /********************** Start CDP Request Type = Replacement (customer switch) *********************/
          else if (request_type == 8)
          {
            nlapiLogExecution("DEBUG","step 31",cdpId);
            if (percent_paid < 20) 
            {
              if(new_item_status == 2 )
              {
                diamond_status = 9; 			//	On Hold - Customer Payment Pending
                portal_request_type = 2; 		//	Hold	
                item_status = 2; 				//	Confirmed
                action_needed = ''		//	Confirmation Needed
                nlapiLogExecution("DEBUG","step 32",cdpId);
                var chk_diamond_on_cdp_with_so = checkDiamondOnCDPWithSO(so_id,item_id);
                if(chk_diamond_on_cdp_with_so == false)
                  item_status = 6; // for canceled
              }
              else
              {
                diamond_status = '';  			//	Null
                portal_request_type = 2; 		//	Hold	
                item_status = 1; 				//	 Not Confirmed
                //action_needed_arr.push(2);		//	Confirmation Needed
                action_needed =  2 ;      //   Confirmation Needed
                nlapiLogExecution("DEBUG","step 33",cdpId);
              }
            }
            else if(percent_paid > 20) 
            {
              if(new_item_status == 2 )
              {
                diamond_status = 1; 			//	Confirmed
                portal_request_type = 3; 		//	Sold	
                item_status = 2; 				//	Confirmed
                //action_needed_arr.push(3);
                // action_needed_arr.push(4);	//	 Ready to Ship, Ready to Invoice
                action_needed = "3,4";   //  Ready to Ship, Ready to Invoice
                nlapiLogExecution("DEBUG","step 34",cdpId);
              }
              else if(portal_request_type = 3 && old_item_status == 2)
              {
                /*
 9.WHEN Portal Request Type = Sold AND old Item Status = ‘Confirmed’ AND new Action Needed contains ‘Shipped’and ‘Invoiced’ THEN
 a.	Diamond Status = Confirmed
 b.	Portal Request Type = Sold
 c.	Item Status = confirmed
 d.	Action Needed = shipped,invoiced
*/
                if(new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12) != -1 )
                {
                  diamond_status = 1; 			//	Confirmed
                  portal_request_type = 3; 		//	Sold	
                  item_status = 2; 	            //Confirmed
                  //action_needed_arr.push(11);
                  //action_needed_arr.push(12);		//	Shipped, Invoiced
                  action_needed = "11,12";  //	Shipped, Invoiced
                  nlapiLogExecution("DEBUG","step 36",cdpId);
                }
                /*
7.	WHEN Portal Request Type = Sold AND old Item Status = ‘Confirmed’ AND new Action Needed contains ‘Shipped’ AND new Action Needed does not contain ‘Invoiced’ THEN
a.	Diamond Status = Confirmed
b.	Portal Request Type = Sold
c.	Item Status = Confirmed
d.	Action Needed = Ready to Invoice,shipped
*/
                else if(new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12) == -1 )
                {
                  diamond_status = 1; 			//	Confirmed
                  portal_request_type = 3; 		//	Sold	
                  item_status = 2; 	            // Confirmed
                  action_needed = "11,4";//  Shipped,	Ready to Invoice
                  nlapiLogExecution("DEBUG","step 37",cdpId);
                }
                /*
8.	WHEN Portal Request Type = Sold AND old Item Status = ‘Confirmed’ AND new Action Needed does not contain ‘Shipped’ AND new Action Needed contains ‘Invoiced’ THEN
a.	Diamond Status = Confirmed
b.	Portal Request Type = Sold
c.	Item Status = Confirmed
d.	Action Needed = Ready to Ship,invoiced
*/
                else  if(new_action_needed.indexOf(11) == -1 && new_action_needed.indexOf(12) != -1 )
                {
                  diamond_status = 1; 			//	Confirmed
                  portal_request_type = 3; 		//	Sold	
                  item_status = 2; 	            // Confirmed
                  action_needed = "12,3"; //	Shipped, Ready to Invoice
                  nlapiLogExecution("DEBUG","step 38",cdpId);
                }
              }
              else
              {
                diamond_status = '';  			//	Null
                portal_request_type = 3; 		//	Sold	
                item_status = 1; 				//	 Not Confirmed
                //action_needed_arr.push(2);		//	Confirmation Needed
                action_needed = "2";   //  Confirmation Needed
                nlapiLogExecution("DEBUG","step 35",cdpId);
              }
            }
          }
          /********************** End CDP Request Type = Replacement (customer switch) ***************************/ 

          /********************** Start CDP Request Type = Replacement (diamond unavailable) *********************/
          else if (request_type == 7) 
          {
            if (percent_paid < 20) 				//	for point 1
            {
              //var item_status_3_days_ago = GetItemStatus(cdp_id);//cdp_obj.getFieldValue('date_created');
              /*
2.	WHEN % Paid < 20 AND new Item Status = ‘Confirmed’ AND CS Status != ‘Options accepted by customer’ THEN
a.	Diamond Status = On Hold Pending Customer Decision
b.	Portal Request Type = Hold
c.	Item Status = Confirmed
d.	Action Needed = NULL
*/
              if ( new_item_status == 2 && cs_status != 4) //for point 2
              {
                diamond_status = 7; 			//	On Hold Pending Customer Decision
                portal_request_type = 2; 		//	Hold	
                item_status = 2; 				// Confirmed
                action_needed = ''; 			//	null
                nlapiLogExecution("DEBUG","step 39",cdpId);
              } 
              /*
3.	WHEN % Paid < 20 AND new Item Status = ‘Confirmed’ AND CS Status = ‘Options accepted by customer’ THEN
a.	Diamond Status = On Hold - Customer Payment Pending
b.	Portal Request Type = Hold
c.	Item Status = Confirmed
d.	Action Needed = NULL
*/
              else if ( new_item_status == 2 && cs_status == 4) //for point 3
              {
                diamond_status = 7; 			//	On Hold Pending Customer Decision
                portal_request_type = 2; 		//	Hold	
                item_status = 2; 				//	Confirmed
                action_needed = ''; 			//	null
                nlapiLogExecution("DEBUG","step 40",cdpId);
              } 

              /*else if ( new_item_status == 2 && item_status_3_days_ago ) //for point 4
						{
							diamond_status = ''; 			//	null
							portal_request_type = 2; 		//	Hold	
							item_status = 1; 				//	Not Confirmed
							action_needed = 2; 				//	Confirmation Needed
						}*/
              /*
1.	WHEN % Paid < 20 THEN 
a.	Diamond Status = NULL
b.	Portal Request Type = Hold
c.	Item Status = Not Confirmed
d.	Action Needed = Confirmation Needed
*/
              else
              {
                diamond_status = ''; 			//	null
                portal_request_type = 2; 		//	Hold	
                item_status = 1; 				//	Not Confirmed
                action_needed = 2;   //	Confirmation Needed
                nlapiLogExecution("DEBUG","step 41",cdpId);
              }
            }
            else if (percent_paid > 20)
            {
              /*
 6.	WHEN % Paid > 20 AND Portal Request Type = Hold and Item Status = ‘Not Confirmed’ AND new CS Status = ‘Options accepted by customer’ THEN
a.	Diamond Status = NULL
b.	Portal Request Type = Sold
c.	Item Status = Not Confirmed
d.	Action Needed = Confirmation Needed 
*/
              if(portal_request_type == 2 && item_status == 1 && cs_status == 4)  //for point 6
              {
                diamond_status = ''; 			//	null
                portal_request_type = 3; 		//	Sold	
                item_status = 1; 				//	Not Confirmed
                action_needed = 2;  //	Confirmation Needed			
                nlapiLogExecution("DEBUG","step 44",cdpId);
              } 
              /*
7.WHEN % Paid > 20 AND Portal Request Type = Hold and Item Status = ‘Confirmed’ AND new CS Status = ‘Options accepted by customer’ THEN
 a.    Diamond Status = Confirmed
 b.	Portal Request Type = Sold
 c.	Item Status = Confirmed
 d.	Action Needed = Ready to Ship, Ready to Invoice
*/
              else if ( portal_request_type == 2 && item_status == 2 && cs_status == 4)//for point 7
              {
                diamond_status = 1; 				//	Confirmed
                portal_request_type = 3; 			//	Sold	
                item_status = 2;					// Confirmed
                action_needed ="3,4";;//Ready to ship,Ready to invoice			
                nlapiLogExecution("DEBUG","step 45",cdpId);
              } 
              /*
8. WHEN % Paid > 20 AND new Item Status = ‘Confirmed’ AND CS Status = ‘Options accepted by customer’ THEN
a.	Diamond Status = Confirmed
b.	Portal Request Type = Sold
c.	Item Status = Confirmed 
d.	Action Needed = Ready to Ship, Ready to Invoice
*/
              else if (new_item_status == 2 && cs_status == 4) //for point 8
              {
                diamond_status = 1; 				  //	Confirmed
                portal_request_type = 3; 			  //	Sold	
                item_status = 2; 					  // Confirmed
                action_needed = "3,4"; //Ready to ship,Ready to invoice	
                nlapiLogExecution("DEBUG","step 46",cdpId);
              } 

              /*
9.	WHEN Portal Request Type = Sold AND old Item Status = ‘Confirmed’ AND new Action Needed contains ‘Shipped’ AND new Action Needed does not contain ‘Invoiced’ THEN
a.	Diamond Status = Confirmed
b.	Portal Request Type = Sold
c.	Item Status = Confirmed
d.	Action Needed = Ready to Invoice,shipped
*/
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12)== -1) // for point 9
              {
                diamond_status = 1; 				//	Confirmed
                portal_request_type = 3; 			//	Sold	
                item_status = 2;					// shipped not available
                action_needed = "4,11"; 	//	Ready to invoice,shipped
                nlapiLogExecution("DEBUG","step 47",cdpId);
              } 
              /*
10.	WHEN Portal Request Type = Sold AND old Item Status = ‘Confirmed’ AND new Action Needed does not contain ‘Shipped’ AND new Action Needed contains ‘Invoiced’ THEN
a.	Diamond Status = Confirmed
b.	Portal Request Type = Sold
c.	Item Status = Confirmed
d.	Action Needed = Ready to Ship,invoiced
*/
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) == -1 && new_action_needed.indexOf(12)!= -1) // for point 10
              {
                diamond_status = 1; 				//	Confirmed
                portal_request_type = 3; 			//	Sold	
                item_status = 2; 					//	invoiced not available
                action_needed = "3,11"; 	//	Ready to ship ,invoiced
                nlapiLogExecution("DEBUG","step 48",cdpId);
              } 
              /*
11.WHEN Portal Request Type = Sold AND old Item Status = ‘Confirmed’ AND new Action Needed contains ‘Shipped’and ‘Invoiced’ THEN
a.	Diamond Status = Confirmed
b.	Portal Request Type = Sold
c.	Item Status = confirmed
d.	Action Needed = Shipped, Invoiced
*/
              else if (portal_request_type == 3 && old_item_status == 2 && new_action_needed.indexOf(11) != -1 && new_action_needed.indexOf(12)!= -1) //for point 11
              {
                diamond_status = 1; 				//	Confirmed
                portal_request_type = 3; 			//	Sold	
                item_status = 2; 					//	invoiced  and shipped not available
                action_needed = "11,12";  //	shipped,invoiced
                nlapiLogExecution("DEBUG","step 49",cdpId);
              }
              /*
5.	WHEN new % Paid > 20 AND Item Status = ‘Confirmed’ AND CS Status != ‘Options accepted by customer’ THEN
a.	Diamond Status = On Hold Pending Customer Decision
b.	Portal Request Type = Hold
c.	Item Status = Confirmed
d.	Action Needed = NULL
*/
              else
              {
                if(item_status == 2 && cs_status != 4 ) //for point 5
                {
                  diamond_status = 7; 			//	On Hold Pending Customer Decision
                  portal_request_type = 2; 		//	Hold	
                  item_status = 2; 				// Confirmed
                  action_needed = ''; 			//	null
                  nlapiLogExecution("DEBUG","step 43",cdpId);
                } 
                /* else  if(item_status == 2 && cs_status == 4 )
                {
                  //diamond_status = 7; 			//	On Hold Pending Customer Decision
                  portal_request_type = 2; 		//	Hold	
                  item_status = 2; 				// Confirmed
                  action_needed = 3; 			//	ready to ship
                  nlapiLogExecution("DEBUG","step 043");
                }*/
              }
            }
          }
          /********************** End CDP Request Type = Replacement (diamond unavailable) *********************/

          /********************** Start CDP Request Type = Hold  *********************************************/
          /*
1.WHEN CDP Request Type = Hold THEN
a.	Diamond Status = NULL
b.	Portal Request Type = Hold
c.	Item Status = Not Confirmed
d.	Action Needed = Confirmation Needed
*/
          else if (request_type == 6) 				//for point 1
          {
            diamond_status = ''; 					//	null
            portal_request_type = 2; 				//	Hold	
            item_status = 1;						//	not confirmed
            action_needed =  2 ;						//	confirmation needed
            nlapiLogExecution("DEBUG","step 50",cdpId);
          }
          /********************** End CDP Request Type = Hold  *********************/

          /********************** Start CDP Request Type = Memo  *******************/
          /*
1.	WHEN CDP Request Type = Memo THEN
a.	Diamond Status = NULL
b.	Portal Request Type = Memo
c.	Item Status = Not Confirmed
d.	Action Needed = Confirmation Needed
*/
          else if (request_type == 9) 						//	for point 1
          {
            diamond_status = '';					//	null
            portal_request_type = 4;				//	Memo	
            item_status = 1;						//	not confirmed
            action_needed = 2;						//	confirmation needed
            nlapiLogExecution("DEBUG","step 51",cdpId);
          }
          /*
2.	WHEN CDP Request Type = Memo AND new Item Status = ‘Confirmed’ THEN
a.	Diamond Status = Confirmed
b.	Portal Request Type = Memo
c.	Item Status = Confirmed
d.	Action Needed = Ready to Ship
i.	If diamond is received at BE and Action Needed = Ready to Ship, change to ‘Shipped’
*/
          else if (request_type == 9 && new_item_status == 2)
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
          /********************** End CDP Request Type = Memo  ***************************************/

          /********************** Start CDP Request Type = Appointment Request   *********************/
          /*
1.	WHEN CDP Request Type = Appointment Request THEN
a.	Diamond Status = NULL
b.	Portal Request Type = Memo
c.	Item Status = Not Confirmed
d.	Action Needed = Confirmation Needed
*/
          else if (request_type == 2) {
            diamond_status = '';					//	Null
            portal_request_type = 4; 				//	Memo
            item_status = 1; 						//	not confirmed
            action_needed =  2 ; 			//	confirmation needed
            nlapiLogExecution("DEBUG","step 53",cdpId);
          }
          /*
2.	WHEN CDP Request Type = Appointment Request AND new Item Status = ‘Confirmed’ THEN
a.	Diamond Status = Confirmed
b.	Portal Request Type = Memo
c.	Item Status = Confirmed
d.	Action Needed = Ready to Ship
i.	If diamond is received at BE and Action Needed = Ready to Ship, change to ‘Shipped’
*/
          else if (request_type == 2 && new_item_status == 2) 
          {
            diamond_status = 1; 					//	Confirmed
            portal_request_type = 4; 				//	Memo	
            item_status = 2; 						//	confirmed
            action_needed = "["+ 3 +"]";		    //Ready to ship
            if((po_status =="pendingBilling" || po_status =="fullyBilled") && action_needed==3) 
            {
              action_needed = 11; // shipped
              nlapiLogExecution("DEBUG","step 54",cdpId);
            }
            nlapiLogExecution("DEBUG","step 55",cdpId);
          }
          /********************** End CDP Request Type = Appointment Request   ******************/

          /********************** Start CDP Request Type = Cert Request    *********************/
          /*
1.	WHEN CDP Request Type = Cert Request THEN
a.	Diamond Status = NULL
b.	Portal Request Type = Cert Request
c.	Item Status = Not Confirmed
d.	Action Needed = Confirmation Needed
*/
          else if (request_type == 3) {
            diamond_status = '';					//	Null
            portal_request_type = 7;				//	Cert request	
            item_status = 1; 						//	not confirmed
            action_needed =  2 ; 			//	confirmation needed
            nlapiLogExecution("DEBUG","step 56",cdpId);
          } 
          /*
2.	WHEN CDP Request Type = Cert Request AND new Item Status = ‘Confirmed’ THEN
a.	Diamond Status = Confirmed
b.	Portal Request Type = Cert Request
c.	Item Status = Confirmed
d.	Action Needed = None
*/
          else if (request_type == 3 && new_item_status == 2)
          {
            diamond_status = 1; 					//	Confirmed
            portal_request_type = 7; 				//	Cert request
            item_status = 2;						//	confirmed
            action_needed =  6 ; 			//	none
            nlapiLogExecution("DEBUG","step 57",cdpId);
          }
          /********************** End CDP Request Type = Cert Request    *******************************/

          /********************** Start CDP Request Type = Photography Request     *********************/
          /*
1.	WHEN CDP Request Type = Photography Request THEN
a.	Diamond Status = NULL
b.	Portal Request Type = Image Request
c.	Item Status = Not Confirmed
d.	Action Needed = Confirmation Needed
*/
          else if (request_type == 4) {
            diamond_status = ''; 					//	Null
            portal_request_type = 6; 				//	Image Request	
            item_status = 1; 						//	not confirmed
            action_needed =  2 ; 			//	confirmation needed
            nlapiLogExecution("DEBUG","step 58",cdpId);
          } 
          /*
2.	WHEN CDP Request Type = Photography Request AND new Item Status = ‘Confirmed’ THEN
a.	Diamond Status = Confirmed
b.	Portal Request Type = Image Request
c.	Item Status = Confirmed
d.	Action Needed = None
*/
          else if (request_type == 4 && new_item_status == 2) 
          {
            diamond_status = 1;						//	Confirmed
            portal_request_type = 6; 				//	Image request	
            item_status = 2; 						//	confirmed
            action_needed = 6 ; 			//	none
            nlapiLogExecution("DEBUG","step 59",cdpId);
          }
          /********************** End CDP Request Type = Photography Request     *********************************/

          /********************** Start CDP Request Type = Check availability/eye-clean      *********************/
          /*
1.	WHEN CDP Request Type = Checking Available/Eye-Clean THEN
a.	Diamond Status = NULL
b.	Portal Request Type = Checking Available/Eye-Clean
c.	Item Status = Not Confirmed
d.	Action Needed = Confirmation Needed
*/
          else if (request_type == 5) {
            diamond_status = ''; 					//	Null
            portal_request_type = 5; 				//	Check availability/eye-clean	
            item_status = 1;						//	not confirmed
            action_needed =  2 ;			//	confirmation needed
            nlapiLogExecution("DEBUG","step 60",cdpId);
          } 
          /*
2. WHEN CDP Request Type = Checking Available/Eye-Clean AND new Item Status = ‘Confirmed’ THEN
a.	Diamond Status = Confirmed
b.	Portal Request Type = Checking Available/Eye-Clean
c.	Item Status = Confirmed
d.	Action Needed = None
*/
          else if (request_type == 5 && new_item_status == 2) {
            diamond_status = 1; 					//	Confirmed
            portal_request_type = 5; 				//	Check availability/eye-clean	
            item_status = 2; 						// confirmed
            action_needed = 6 ; 			//	none
            nlapiLogExecution("DEBUG","step 61",cdpId);
          }
        }
        /********************** End CDP Request Type = Check availability/eye-clean      *********************/

        var balanceObj = nlapiLookupField("customrecord_custom_diamond",cdpId,["custrecord_custom_diamond_true_balance","custrecord_custom_diamond_deposit_balanc","custrecord_website_balance"]);
        var trueBal = balanceObj.custrecord_custom_diamond_true_balance;
        nlapiLogExecution("DEBUG","True Bal",trueBal);
        var depositBal = balanceObj.custrecord_custom_diamond_deposit_balanc;
        nlapiLogExecution("DEBUG","Deposit Bal",depositBal);
        var websiteBal = balanceObj.custrecord_website_balance;
        nlapiLogExecution("DEBUG","Website Bal",websiteBal);

        var vendor_id = cdp_obj.getFieldValue('custrecord_custom_diamond_vendor');
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

        /*var action_needed_1 ='';
        if(type == "edit")
        {
          var itemId = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_be_diamond_stock_number");
          var certificate_included = nlapiLookupField("InventoryItem",itemId,"custitemcertificate_included");
          nlapiLogExecution("DEBUG","Certificate included",certificate_included);
          if(certificate_included==1)
          {
            // action_needed = nlapiLookupField("customrecord_custom_diamond",cdpId,"custrecord_action_needed");
            nlapiLogExecution("DEBUG","action_needed(1)",action_needed);
            if(action_needed !='' && action_needed!=null)
            {
              //if(action_needed.indexOf(14) != -1)
              //{
              action_needed =action_needed.toString().split(',');
              for(var f=0; f<action_needed.length; f++)
              {
                if(action_needed.length==1)
                {
                  if(action_needed[f]==14)
                    action_needed ='';
                  continue;
                } 
                else
                { 
                  if(action_needed[f]==14)
                    continue;
                }
                if(action_needed_1 =='')
                  action_needed_1 += action_needed[f] ;
                else
                  action_needed_1 += ","+action_needed[f];
              }
              //}
            }
          }
        }
        if(action_needed_1!= '')
        {
          action_needed = "["+ action_needed_1 +"]";
        }
        else*/
        action_needed = "["+ action_needed +"]";
        nlapiLogExecution("DEBUG","Action Needed (1)",action_needed);
        nlapiLogExecution("DEBUG","Portal Request Type (1)",portal_request_type);
        /*if(portal_request_type_tmp == '' || portal_request_type_tmp==null)
        {
          new_portal_request_type = portal_request_type ;
          nlapiLogExecution("DEBUG","test 00001");
        }
        else
        {
          new_portal_request_type = portal_request_type_tmp;
          nlapiLogExecution("DEBUG","test 00002");
        }*/

        if(new_portal_request_type != null && new_portal_request_type !='')
        {
          nlapiLogExecution("DEBUG","test 00002");
          if(new_portal_request_type==3)
            portal_request_type = new_portal_request_type;
          nlapiLogExecution("DEBUG","New Portal Request Type (1)",portal_request_type);
        }
        nlapiLogExecution("DEBUG","step 62",cdpId);
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
          "date_expected_at_be" : date_expected_at_be
        };
        // var url = "https://testportal.brilliantearth.com/api/cdp/";
        var url = "https://partner.brilliantearth.com/api/cdp/";   
        var headers = new Array(); 
        headers['http'] = '1.1';    
        headers['Accept'] = 'application/json';   
        //headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542';
        headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';
        headers['Content-Type'] = 'application/json'; 
        headers['User-Agent-x'] = 'SuiteScript-Call';


        var myJSONText = JSON.stringify(jsonobj, replacer); 
        nlapiLogExecution('debug','CDP Response Body:', myJSONText);
        var response = nlapiRequestURL(url, myJSONText, headers); 
        nlapiLogExecution('debug','CDP Response Body Output :', response.getBody());
        nlapiLogExecution('debug','CDP Response Code :', response.getCode());
        if(response.code=='200')
        {
          //new added by ajay 08April 2017
          var responsebody = JSON.parse(response.getBody()) ;
          action_needed = responsebody["action_needed"];
          nlapiLogExecution("debug","Portal Action Needed value is :",action_needed);
          if(responsebody["on_vendor_portal"] == true)
          {
            on_vendor_portal = "T";
          }
          else if(responsebody["on_vendor_portal"] == false)
          {
            on_vendor_portal = "F";
          }
          //portal_request_type = responsebody["portal_request_type"];

          cdp_obj.setFieldValue('custrecord_portal_response',JSON.stringify(responsebody));
          cdp_obj.setFieldValue('custrecord237',myJSONText);
          cdp_obj.setFieldValue('custrecord238',scriptId);
          cdp_obj.setFieldValue('custrecord241',nlapiGetContext().getExecutionContext());
          cdp_obj.setFieldValue('custrecord_on_vendor_portal',on_vendor_portal);
          cdp_obj.setFieldValue('custrecord_action_needed',action_needed);
          cdp_obj.setFieldValue('custrecord_diamond_status',diamond_status);
          //cdp_obj.setFieldValue('custrecord165',new_portal_request_type);
          cdp_obj.setFieldValue('custrecord165',portal_request_type);
          cdp_obj.setFieldValue('custrecord_custom_diamond_true_balance',trueBal);
          cdp_obj.setFieldValue('custrecord_custom_diamond_deposit_balanc',depositBal);
          cdp_obj.setFieldValue('custrecord_website_balance',websiteBal);
          cdp_obj.setFieldValue('custrecord_item_status',item_status);
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
    /*************** End First Step points *******************/
    nlapiLogExecution('debug', 'CDP Successfully Completed #' + cdpId, 'type : ' + type);
  }

  catch (ex) {
    nlapiLogExecution('debug', 'Error on Page', ex);
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
      var itemArr = ["custitem20","custitem5","custitem27","custitem7","custitem19","custitem28","custitem25","cost","custitem46","location","custitem30",
                     "lastpurchaseprice","custitem45","custitem37","custitem31","custitem32","custitem18", "custitem198"];
      var itemArrVal = nlapiLookupField("inventoryitem",itemId,itemArr);
      if(itemArrVal.custitem18 == ""){ itemArrVal.custitem18 = null; }	  
      var itemCost='';
      var cost ='0';
      cost = itemArrVal.cost;
      if(cost =='' || cost== null)
        cost='0';
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
        var url = "https://partner.brilliantearth.com/api/item/";     
        var headers = new Array(); 
        headers['http'] = '1.1';    
        headers['Accept'] = 'application/json';       				  
        //headers['Authorization']= 'Token db9a136f31d2261b7f626bdd76ee7ffb44b00542'; //Test Portal
        headers['Authorization']= 'token d499ecd8233123cacd3c5868939fe167b7bf0837';// Live Portal
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
                       "cost":cost,
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