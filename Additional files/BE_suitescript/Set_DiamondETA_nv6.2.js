nlapiLogExecution("audit","FLOStart",new Date().getTime());
function SetDiamondETA(type)
{
  try
  {
    var log_type = "debug"; 
    nlapiLogExecution("debug","Event Type is :",type);       
    if(type == "create" || type == "edit" || type == "xedit")
    {
      var Id = nlapiGetRecordId();
      var cdpId = Id;
      //var diamondETA = new Date();   
      var diamondETA = '';  
      nlapiLogExecution("debug","CDP Id is :",nlapiGetRecordId());
      // START HERE Added new logic as per DP-478
      //Item Status variables declaration
      var old_item_status =''; var new_item_status =''; var temp_new_item_status =''; var temp_old_item_status ='';
      var sys_note_date='';

      //Action Needed variables declaration
      var sys_note_date_action_needed ='';
      var new_action_needed =''; var old_action_needed='';
      var temp_new_action_needed =''; var temp_old_action_needed ='';

      var item_status_old_new_value = get_old_new_value_of_item_status(cdpId,temp_old_item_status,temp_new_item_status);
      nlapiLogExecution("DEBUG","Item Status old & new value without Json (Temp) Info Diamond ETA",item_status_old_new_value);
      nlapiLogExecution("DEBUG","Item Status old & new value Json  (Temp) Info Diamond ETA",JSON.stringify(item_status_old_new_value));
      temp_old_item_status =item_status_old_new_value[0];
      temp_new_item_status = item_status_old_new_value[1];
      sys_note_date= item_status_old_new_value[2];
      nlapiLogExecution("DEBUG","Old Item Status (Temp) Info Diamond ETA","Old Item Status for Diamond ETA is : " + temp_old_item_status + " having cdp " + cdpId);
      nlapiLogExecution("DEBUG","New Item Status (Temp) Info Diamond ETA","New Item Status for Diamond ETA is : " + temp_new_item_status + " having cdp " + cdpId);
      nlapiLogExecution("DEBUG","System note date for item status Info Diamond ETA","System note date for New Item Status Diamond ETA is : " + sys_note_date + " having cdp " + cdpId);
      if(temp_new_item_status  != temp_old_item_status)
      {
        new_item_status = temp_new_item_status;
        old_item_status = temp_old_item_status;
        nlapiLogExecution("DEBUG","New Item Status Info Diamond ETA","New Item Status for Diamond ETA is : " + new_item_status + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","Old Item Status Info Diamond ETA","Old Item Status for Diamond ETA is : " + old_item_status + " having cdp " + cdpId);
      }
      // End Item Status

      // Action Needed
      var sys_note_date_action_needed ='';
      var new_action_needed =''; var old_action_needed='';
      var temp_new_action_needed =''; var temp_old_action_needed ='';
      var action_needed_old_new_value = get_old_new_value_of_action_needed(cdpId,temp_old_action_needed,temp_new_action_needed);
      nlapiLogExecution("DEBUG","Action Needed value JSON(Temp) Info from system notes Diamond ETA",JSON.stringify(action_needed_old_new_value));
      temp_old_action_needed =action_needed_old_new_value[0];
      temp_new_action_needed = action_needed_old_new_value[1];
      sys_note_date_action_needed= action_needed_old_new_value[2];
      nlapiLogExecution("DEBUG","Old Action Needed (Temp) Info from system notes Diamond ETA","Old Action Needed for Diamond ETA is : " + temp_old_action_needed + " having cdp " + cdpId);
      nlapiLogExecution("DEBUG","New  Action Needed (Temp) Info from system notes Diamond ETA","New  Action Needed for Diamond ETA is : " + temp_new_action_needed + " having cdp " + cdpId);
      nlapiLogExecution("DEBUG","System note date for  Action Needed Info from system notes Diamond ETA","System note date for Action Needed for Diamond ETA is : " + sys_note_date_action_needed + " having cdp " + cdpId);
      if(temp_new_action_needed  != temp_old_action_needed)
      {
        new_action_needed = temp_new_action_needed;
        old_action_needed = temp_old_action_needed;
        nlapiLogExecution("DEBUG","New Action Needed Info from system notes Diamond ETA","New Action Needed for Diamond ETA is : " + new_action_needed + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","Old Action Needed Info from system notes Diamond ETA","Old Action Needed for Diamond ETA is : " + old_action_needed + " having cdp " + cdpId);
      }

      // End Action Needed
      // Diamond Status 
      //variables declaration for diamond status
      var new_diamond_status =''; var old_diamond_status = '';
      var temp_new_diamond_status ='';
      var temp_old_diamond_status ='';
      var sys_note_date_diamond_status='';

      var diamond_status_old_new_value = get_old_new_value_of_diamond_status(cdpId,temp_old_diamond_status,temp_new_diamond_status);
      nlapiLogExecution("DEBUG","Diamond Status old & new value without Json (Temp) Info from system notes Diamond ETA",diamond_status_old_new_value);
      nlapiLogExecution("DEBUG","Diamond Status old & new value Json  (Temp) Info from system notes Diamond ETA",JSON.stringify(diamond_status_old_new_value));
      temp_old_diamond_status = diamond_status_old_new_value[0];
      temp_new_diamond_status = diamond_status_old_new_value[1];
      sys_note_date_diamond_status= diamond_status_old_new_value[2];
      nlapiLogExecution("DEBUG","Old Diamond Status (Temp) Info from system notes Diamond ETA","Old Diamond Status for Diamond ETA is : " + temp_old_diamond_status + " having cdp " + cdpId);
      nlapiLogExecution("DEBUG","New Diamond Status (Temp) Info from system notes Diamond ETA","New Diamond Status for Diamond ETA is : " + temp_new_diamond_status + " having cdp " + cdpId);
      nlapiLogExecution("DEBUG","System note date for diamond status Info Diamond ETA","System note date for New Diamond Status for Diamond ETA is : " + sys_note_date_diamond_status + " having cdp " + cdpId);
      if(temp_new_diamond_status  != temp_old_diamond_status)
      {
        new_diamond_status = temp_new_diamond_status;
        old_diamond_status = temp_old_diamond_status;
        nlapiLogExecution("DEBUG","New Diamond Status Info from system notes Diamond ETA","New Diamond Status is : " + new_diamond_status + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","Old Diamond Status Info from system notes Diamond ETA","Old Diamond Status is : " + old_diamond_status + " having cdp " + cdpId);
      }    
      // END here Diamond Status  

      // Portal Request Type
      // Portal Request Type variables declaration for diamond status
      var new_portal_request_type =''; var old_portal_request_type = '';
      var temp_new_portal_request_type ='';
      var temp_old_portal_request_type ='';

      var sys_note_date_portal_request_type='';
      var portal_request_type_old_new_value = get_old_new_value_of_portal_request_type(cdpId,temp_old_portal_request_type,temp_new_portal_request_type);
      nlapiLogExecution("DEBUG","Portal Request Type old & new value without Json (Temp) Info from system notes Diamond ETA",portal_request_type_old_new_value);
      nlapiLogExecution("DEBUG","Portal Request Type old & new value Json (Temp) Info from system notes Diamond ETA",JSON.stringify(portal_request_type_old_new_value));
      temp_old_portal_request_type = portal_request_type_old_new_value[0];
      temp_new_portal_request_type = portal_request_type_old_new_value[1];
      sys_note_date_portal_request_type = portal_request_type_old_new_value[2];
      nlapiLogExecution("DEBUG","Old Portal Request Type (Temp) Info from system notes Diamond ETA","Old Portal Request Type for Diamond ETA is : " + temp_old_portal_request_type + " having cdp " + cdpId);
      nlapiLogExecution("DEBUG","New Portal Request Type (Temp) Info from system notes Diamond ETA","New Portal Request Type for Diamond ETA is : " + temp_new_portal_request_type + " having cdp " + cdpId);
      nlapiLogExecution("DEBUG","System note date for Portal Request Type Info Diamond ETA","System note date for Portal Request Type for Diamond ETA is : " + sys_note_date_portal_request_type + " having cdp " + cdpId);
      if(temp_new_portal_request_type  != temp_old_portal_request_type)
      {
        new_portal_request_type = temp_new_portal_request_type;
        old_portal_request_type = temp_old_portal_request_type;
        nlapiLogExecution("DEBUG","New Portal Request Type Info from system notes Diamond ETA","New Portal Request Type for Diamond ETA is : " + new_portal_request_type + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","Old Portal Request Type Info from system notes Diamond ETA","Old Portal Request Type for Diamond ETA is : " + old_portal_request_type + " having cdp " + cdpId);
      }       
      // END Here Portal request Type
      //START HERE DIAMOND ETA
      var temp_old_diamond_eta =''; var temp_new_diamond_eta='';
      var sys_note_date_diamond_eta =''; var old_diamond_eta=''; var new_diamond_eta='';
      var diamond_eta_old_new_value = get_old_new_value_of_diamond_eta(cdpId,temp_old_diamond_eta,temp_new_diamond_eta);
      nlapiLogExecution("DEBUG","Diamond ETA old & new value without Json (Temp) Info from system notes",diamond_eta_old_new_value);
      nlapiLogExecution("DEBUG","Diamond ETA old & new value Json (Temp) Info from system notes",JSON.stringify(diamond_eta_old_new_value));
      temp_old_diamond_eta = diamond_eta_old_new_value[0];
      temp_new_diamond_eta = diamond_eta_old_new_value[1];
      sys_note_date_diamond_eta = diamond_eta_old_new_value[2];
      nlapiLogExecution("DEBUG","Old Diamond ETA (Temp) Info from system notes","Old Diamond ETA is : " + temp_old_diamond_eta + " having cdp " + cdpId);
      nlapiLogExecution("DEBUG","New  Diamond ETA (Temp) Info from system notes","New Diamond ETA is : " + temp_new_diamond_eta + " having cdp " + cdpId);
      nlapiLogExecution("DEBUG","System note date for Portal Request Type Info Diamond ETA","System note date for Portal Request Type for Diamond ETA is : " + sys_note_date_diamond_eta + " having cdp " + cdpId);
      if(temp_old_diamond_eta  != temp_new_diamond_eta)
      {
        old_diamond_eta = temp_old_diamond_eta;
        new_diamond_eta = temp_new_diamond_eta;
        nlapiLogExecution("DEBUG","Old Diamond ETA Info from system notes ","Old Diamond ETA is : " + old_diamond_eta + " having cdp " + cdpId);
        nlapiLogExecution("DEBUG","New Diamond ETA Info from system notes ","New Diamond ETA is : " + new_diamond_eta + " having cdp " + cdpId); 
      }       
      // END HERE DIAMOND ETA
      nlapiLogExecution(log_type,"Old Diamond Eta :",old_diamond_eta);
      nlapiLogExecution(log_type,"New Diamond Eta :",new_diamond_eta);
      var cdpArrField = ["custrecord_diamond_eta","custrecord_custom_diamond_request_type","custrecord_diamond_status","custrecord_item_status","custrecord165","custrecord_action_needed"];
      var cdpFieldVal = nlapiLookupField("customrecord_custom_diamond",Id,cdpArrField);
      var diamond_Eta = cdpFieldVal.custrecord_diamond_eta;		
      nlapiLogExecution("debug","Diamond Eta :",diamond_Eta);		
      var requestType = cdpFieldVal.custrecord_custom_diamond_request_type;
      nlapiLogExecution("debug","Request type is :",requestType);
      var diamondStatus = cdpFieldVal.custrecord_diamond_status;
      nlapiLogExecution("debug","Diamond Status is :",diamondStatus);
      var portalReqType = cdpFieldVal.custrecord165;
      nlapiLogExecution("debug","Portal Request Type is :",portalReqType);
      var itemStatus = cdpFieldVal.custrecord_item_status;
      var diamondStockNo = nlapiLookupField("customrecord_custom_diamond",Id,"custrecord_be_diamond_stock_number",true);

      //Start Here NS-1387 Change Trigger for Set Diamond ETA Inline Script
      var actionNeeded = cdpFieldVal.custrecord_action_needed;
      nlapiLogExecution('Debug', 'Action Needed Value', actionNeeded);
      var arr_actionNeeded ='';
      var actionNeededBolVal = false;
      if(actionNeeded != null && actionNeeded != '')
      {
        arr_actionNeeded = actionNeeded.split(',');
      }
      for(var acNeededIndex =0 ; acNeededIndex<arr_actionNeeded.length; acNeededIndex++)
      {
        if(arr_actionNeeded[acNeededIndex] == '3')
        {
          actionNeededBolVal = true;
        }
      }
      nlapiLogExecution("debug","Action Needed Boolean Value is :", actionNeededBolVal);
      // END HERE
      if(old_diamond_eta == new_diamond_eta)
      {                  
        if(new_portal_request_type == 3 || new_portal_request_type == 4 || portalReqType == 3 || portalReqType == 4)			
        {				
          //DP-471
          if( (old_diamond_status != 1 && (new_diamond_status == 1 || diamondStatus == 1 ) && (new_portal_request_type ==3 || new_portal_request_type ==4 || portalReqType == 3 || portalReqType == 4)) || (old_item_status != 2 && new_item_status == 2 && itemStatus == 2  && old_diamond_status != new_diamond_status && (new_portal_request_type == 3 || new_portal_request_type==4 || portalReqType == 3 || portalReqType == 4)))		
          {
            if(actionNeededBolVal == true)
            {
              var vendorId = nlapiLookupField("customrecord_custom_diamond",nlapiGetRecordId(),"custrecord_custom_diamond_vendor");
              var vendorArr = ['custentitydia_eta_daily_deadline','custentitydia_eta_business_days','custentityvendor_ship_days']; // for production
              if(vendorId != '')
              {
                var vendorFields = nlapiLookupField("vendor",vendorId,vendorArr);				
                var deadLine = vendorFields.custentitydia_eta_daily_deadline;
                var businessDays = vendorFields.custentitydia_eta_business_days;
                var shipDays = vendorFields.custentityvendor_ship_days; // for production

                var currentDate = new Date();
                var day = currentDate.getDay();
                var hours = currentDate.getHours();
                var mins = currentDate.getMinutes();
                hours = parseFloat(hours + mins/100).toFixed(2);

                nlapiLogExecution(log_type,"current date :",currentDate);
                nlapiLogExecution(log_type,"current time :",hours);

                var shipDaysArr = new Array();
                var count = 0; var newDay = "";
                var weekday = new Array(7);
                weekday[0]=  "Sunday";
                weekday[1] = "Monday";
                weekday[2] = "Tuesday";
                weekday[3] = "Wednesday";
                weekday[4] = "Thursday";
                weekday[5] = "Friday";
                weekday[6] = "Saturday";
                if(businessDays != '')
                {
                  if(deadLine != null)
                  {
                    var deadLineTime = deadLine.split(' ')[0];								
                    var deadLineTimeNo = parseFloat(parseFloat(deadLineTime.split(':')[0])+parseFloat(deadLineTime.split(':')[1]/100)).toFixed(2);
                    var deadLineSpecific = deadLine.split(' ')[1];
                    nlapiLogExecution("debug","DIA ETA DAILY DEADLINE Time having am/pm: ", deadLineTime + ' ' +deadLineSpecific );
                    //START HERE NS-1557
                    var exclude_time_24_format_arr= ['12.00','12.01','12.02','12.03','12.04','12.05','12.06','12.07','12.08','12.09','12.10','12.11','12.12',
                                                     '12.13','12.14','12.15','12.16','12.17','12.18','12.19','12.20','12.21','12.22',
                                                     '12.23','12.24','12.25','12.26','12.27','12.28','12.29','12.30','12.31','12.32',
                                                     '12.33','12.34','12.35','12.36','12.37','12.38','12.39','12.40','12.41','12.42',
                                                     '12.43','12.44','12.45','12.46','12.47','12.48','12.49','12.50','12.51','12.52',
                                                     '12.53','12.54','12.55','12.56','12.57','12.58','12.59'];
                    var exclude_time_24_format_bool_val = false;
                    nlapiLogExecution("debug","Exclude Time(24 Format) Index Value:",exclude_time_24_format_arr.indexOf(deadLineTimeNo));
                    if(exclude_time_24_format_arr.indexOf(deadLineTimeNo) != -1)
                      exclude_time_24_format_bool_val = true;
                    nlapiLogExecution("debug","Exclude Time (24 Format) Boolean Value:",exclude_time_24_format_bool_val );
                    // END HERE

                    if(deadLineSpecific == "pm" && exclude_time_24_format_bool_val == false)
                    {
                      deadLineTimeNo = (12 + parseFloat(deadLineTimeNo)).toFixed(2); 
                    }
                    nlapiLogExecution(log_type,"deadLineTime :",deadLineTimeNo);
                    if(parseFloat(hours) <= parseFloat(deadLineTimeNo) || deadLineTimeNo == '')
                    {						
                      if(shipDays != null)
                      {
                        shipDaysArr = shipDays.split(',');
                        for(var i = 0; i < shipDaysArr.length; i++)
                        {
                          count = count + 1;								
                        }
                        if(count == 1 && (shipDaysArr[0] == 1 || shipDaysArr[0] == ''))  // N/A condition
                        {
                          nlapiLogExecution(log_type,"Step 1 having cdp id:",Id + " Vendor Ship Days Arr "+ shipDaysArr);
                          diamondETA = GetDiamondETA(day,businessDays,currentDate,shipDaysArr,Id,weekday);	
                          diamondETA = new Date(diamondETA); 
                          nlapiLogExecution(log_type,"Step 2 having cdp id:",Id + " diamond ETA " + diamondETA);
                        }
                        else if(count >= 1 && shipDaysArr[0] != 1)
                        {
                          nlapiLogExecution(log_type,"Step 3 having cdp id:",Id + " Vendor Ship Days Arr "+ shipDaysArr);
                          diamondETA = DiamondETADate(shipDaysArr,day,businessDays,currentDate,count,hours,deadLineTimeNo,Id,weekday);
                          diamondETA = new Date(diamondETA); 
                          nlapiLogExecution(log_type,"Step 4 having cdp id:",Id +" diamond ETA " + diamondETA);
                        }                            
                      }                                                               												
                    } 
                    else if(parseFloat(hours) > parseFloat(deadLineTimeNo))
                    {
                      if(shipDays != null)
                      {
                        shipDaysArr = shipDays.split(',');
                        for(var i = 0; i < shipDaysArr.length; i++)
                        {
                          count = count + 1;								
                        }
                        if(count == 1 && (shipDaysArr[0] == 1 || shipDaysArr[0] == ''))  // N/A condition
                        {
                          nlapiLogExecution(log_type,"Step 5 having cdp id:",Id + " Vendor Ship Days Arr "+ shipDaysArr);
                          diamondETA = GetDiamondETA(day,businessDays,currentDate,shipDaysArr,Id,weekday);
                          diamondETA = new Date(diamondETA);  
                          nlapiLogExecution(log_type,"Step 6 having cdp id:",Id +" diamond ETA " + diamondETA);
                        }
                        else if(count >= 1 && shipDaysArr[0] != 1)
                        {
                          nlapiLogExecution(log_type,"Step 7 having cdp id:",Id + " Vendor Ship Days Arr "+ shipDaysArr);
                          diamondETA = DiamondETADate(shipDaysArr,day,businessDays,currentDate,count,hours,deadLineTimeNo,Id,weekday);	
                          diamondETA = new Date(diamondETA);  
                          nlapiLogExecution(log_type,"Step 8 having cdp id:",Id +" diamond ETA " + diamondETA);
                        } 
                        if((count == 1 && (shipDaysArr[0] == 1 || shipDaysArr[0] == '')) || (count == 5 && shipDaysArr[0] != 1))
                        {
                          // diamondETA = new Date(diamondETA);  
                          newDay = diamondETA.getDay();
                          if(day != 0 || day != 6) 
                          {									
                            if(newDay <= 4)
                            {
                              nlapiLogExecution(log_type,"Step 9 having cdp id:",Id);
                              diamondETA = nlapiAddDays(diamondETA,1);
                              diamondETA = ignoreWeekends(diamondETA,weekday,Id);
                              nlapiLogExecution(log_type,"Step 9A having cdp id: ",Id);
                              diamondETA = new Date(diamondETA);  
                              nlapiLogExecution(log_type,"Step 10 having cdp id:",Id);
                            }
                            else
                            {
                              nlapiLogExecution(log_type,"Step 11 having cdp id:",Id);
                              diamondETA = nlapiAddDays(diamondETA,3);
                              diamondETA = ignoreWeekends(diamondETA,weekday,Id);
                              nlapiLogExecution(log_type,"Step 11A having cdp id: ",Id);
                              diamondETA = new Date(diamondETA);  
                              nlapiLogExecution(log_type,"Step 12 having cdp id:",Id);
                            }									
                          }
                        }
                      }// End if part having Ship days is not null						
                    }// End of Else part hours > deadlinetime
                    nlapiLogExecution(log_type,"Step 12A having cdp id:",Id + " Final Diamond ETA "+ diamondETA);
                    nlapiSubmitField("customrecord_custom_diamond",Id,"custrecord_diamond_eta",nlapiDateToString(diamondETA));								
                    nlapiLogExecution(log_type,"Diamond ETA Field has been set with calculated data.", nlapiDateToString(diamondETA));
                  }
                }
                else 
                {
                  nlapiLogExecution(log_type,"Dia ETA BusinessDays Field on Vendor page is an empty.");
                }								
              }//End of if condition for Vendor
            }// END of If condition for Action Needed
          } // End of if condition for Diamond Status and Portal Request Type                              
        } // End Request Type
      } // End diamond_Eta condition
      else
      {
        if(type != "xedit")
        {
          nlapiLogExecution(log_type,"Step 14 having cdp id:",Id);
          //nlapiSubmitField(nlapiGetRecordType(),Id,"custrecord_diamond_eta",new_diamond_eta);
          //nlapiLogExecution(log_type,"Diamond ETA Field has been updated with manual data.", new_diamond_eta);
          if(old_diamond_eta !='' && old_diamond_eta !=null)
          {
            // DP-459 Diamond ETA Bug
            if(new_diamond_eta !='' && new_diamond_eta !=null)
            {
              nlapiSubmitField(nlapiGetRecordType(),Id,"custrecord_diamond_eta",new_diamond_eta);
              nlapiLogExecution(log_type,"Diamond ETA Field has been updated with manual data.", new_diamond_eta);
            }// end if part of new diamond eta
          }// end if part of old diamond eta
        }//end if part of type is not equal xedit
      }//end of else part
    }// End Event Type
  }
  catch(err)
  {
    nlapiLogExecution("debug","Error Occur during inline edit CDP is : ",err.message);
  }
}

function DiamondETADate(shipDaysArr,day,businessDays,currentDate,count,hours,deadLineTimeNo,Id,weekday)
{
  var diamondETA = new Date();
  var newDay = 0; var diffDay = 0;
  if(count == 5) // for all condition
  {
    nlapiLogExecution("Debug","Step 15 having cdp id:",Id);
    diamondETA = GetDiamondETA(day,businessDays,currentDate,shipDaysArr,Id,weekday);
    nlapiLogExecution("Debug","Step 16 having cdp id:",Id);
  }
  else if(count > 1 && count <= 4)
  {
    //code here 
    if(count == 2)
    {
      if(day == shipDaysArr[0]-1)
      {
        if(parseFloat(hours) <= parseFloat(deadLineTimeNo))
        {
          nlapiLogExecution("Debug","Step 17 having cdp id:",Id);
          newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();	
          nlapiLogExecution("Debug","Step 18 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day),shipDaysArr,Id,weekday);	
          nlapiLogExecution("Debug","Step 19 having cdp id:",Id);
        }
        else if(parseFloat(hours) > parseFloat(deadLineTimeNo))
        {
          nlapiLogExecution("Debug","Step 20 having cdp id:",Id);
          newDay = shipDaysArr[1]-1;		
          nlapiLogExecution("Debug","Step 21 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day),shipDaysArr,Id,weekday);	
          nlapiLogExecution("Debug","Step 22 having cdp id:",Id);
        }
      }
      else if(day < shipDaysArr[0]-1)
      {
        nlapiLogExecution("Debug","Step 23 having cdp id:",Id);
        newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();	
        nlapiLogExecution("Debug","Step 24 having cdp id:",Id +" and new day" + newDay);
        diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day),shipDaysArr,Id,weekday);	
        nlapiLogExecution("Debug","Step 25 having cdp id:",Id);
      }
      else if(shipDaysArr[0]-1 < day && day <= shipDaysArr[1]-1)
      {
        if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[1]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[1]-1))
        {
          nlapiLogExecution("Debug","Step 26 having cdp id:",Id);
          newDay = nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day).getDay();	
          nlapiLogExecution("Debug","Step 27 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day),shipDaysArr,Id,weekday);	
          nlapiLogExecution("Debug","Step 28 having cdp id:",Id);
        }
        else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[1]-1)
        {
          nlapiLogExecution("Debug","Step 29 having cdp id:",Id);
          newDay = shipDaysArr[0]-1;
          nlapiLogExecution("Debug","Step 30 having cdp id:",Id +" and new day" + newDay);
          diffDay = 7 - (shipDaysArr[1] - shipDaysArr[0]);	
          nlapiLogExecution("Debug","Step 31 having cdp id:",Id +" and diff Day" + diffDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,diffDay),shipDaysArr,Id,weekday);
          nlapiLogExecution("Debug","Step 32 having cdp id:",Id);
        }
      }
      else if(shipDaysArr[1]-1 < day)
      {
        nlapiLogExecution("Debug","Step 33 having cdp id:",Id);
        newDay = nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day).getDay();		
        nlapiLogExecution("Debug","Step 34 having cdp id:",Id +" and new day" + newDay);
        diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day),shipDaysArr,Id,weekday);	
        nlapiLogExecution("Debug","Step 35 having cdp id:",Id);
      }									
    }
    else if(count == 3)
    {
      if(day == shipDaysArr[0]-1)
      {
        if(parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day == shipDaysArr[0]-1)
        {
          nlapiLogExecution("Debug","Step 36 having cdp id:",Id);
          newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();		
          nlapiLogExecution("Debug","Step 37 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day),shipDaysArr,Id,weekday);		
          nlapiLogExecution("Debug","Step 38 having cdp id:",Id);
        }
        else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[0]-1)
        {
          nlapiLogExecution("Debug","Step 39 having cdp id:",Id);
          newDay = shipDaysArr[1]-1;		
          nlapiLogExecution("Debug","Step 40 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day),shipDaysArr,Id,weekday);	
          nlapiLogExecution("Debug","Step 41 having cdp id:",Id);
        }
      }
      else if(day < shipDaysArr[0]-1)
      {
        nlapiLogExecution("Debug","Step 42 having cdp id:",Id);
        newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();	
        nlapiLogExecution("Debug","Step 43 having cdp id:",Id +" and new day" + newDay);
        diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day),shipDaysArr,Id,weekday);	
        nlapiLogExecution("Debug","Step 44 having cdp id:",Id);
      }
      else if(shipDaysArr[0]-1 < day && day <= shipDaysArr[1]-1)
      {
        if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[1]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[1]-1))
        {
          nlapiLogExecution("Debug","Step 45 having cdp id:",Id);
          newDay = nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day).getDay();			
          nlapiLogExecution("Debug","Step 46 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day),shipDaysArr,Id,weekday);	
          nlapiLogExecution("Debug","Step 47 having cdp id:",Id);
        }
        else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[1]-1)
        {
          nlapiLogExecution("Debug","Step 48 having cdp id:",Id);
          newDay = shipDaysArr[2]-1;
          nlapiLogExecution("Debug","Step 49 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day),shipDaysArr,Id,weekday);	
          nlapiLogExecution("Debug","Step 50 having cdp id:",Id);
        }
      }
      else if(shipDaysArr[1]-1 < day && day <= shipDaysArr[2]-1)
      {
        if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[2]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[2]-1))
        {
          nlapiLogExecution("Debug","Step 51 having cdp id:",Id);
          newDay = nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day).getDay();	
          nlapiLogExecution("Debug","Step 52 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day),shipDaysArr,Id,weekday);	
          nlapiLogExecution("Debug","Step 53 having cdp id:",Id);
        }
        else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[2]-1)
        {
          nlapiLogExecution("Debug","Step 54 having cdp id:",Id);
          newDay = shipDaysArr[0]-1;
          nlapiLogExecution("Debug","Step 55 having cdp id:",Id +" and new day" + newDay);
          diffDay = 7 - (shipDaysArr[2] - shipDaysArr[0]);	
          nlapiLogExecution("Debug","Step 56 having cdp id:",Id +" and diff Day" + diffDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,diffDay),shipDaysArr,Id,weekday);	
          nlapiLogExecution("Debug","Step 57 having cdp id:",Id);
        }				
      }									
      else if(shipDaysArr[2]-1 < day)
      {
        nlapiLogExecution("Debug","Step 58 having cdp id:",Id);
        newDay = nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day).getDay();		
        nlapiLogExecution("Debug","Step 59 having cdp id:",Id +" and new day" + newDay);
        diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day),shipDaysArr,Id,weekday);	
        nlapiLogExecution("Debug","Step 60 having cdp id:",Id);
      }
    }
    else if(count == 4)
    {
      if(day == shipDaysArr[0]-1)
      {
        if(parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day == shipDaysArr[0]-1)
        {
          nlapiLogExecution("Debug","Step 61 having cdp id:",Id);
          newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();	
          nlapiLogExecution("Debug","Step 62 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day),shipDaysArr,Id,weekday);	
          nlapiLogExecution("Debug","Step 63 having cdp id:",Id);
        }
        else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[0]-1)
        {
          nlapiLogExecution("Debug","Step 64 having cdp id:",Id);
          newDay = shipDaysArr[1]-1;	
          nlapiLogExecution("Debug","Step 65 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day),shipDaysArr,Id,weekday);		
          nlapiLogExecution("Debug","Step 66 having cdp id:",Id);
        }				
      }
      else if(day < shipDaysArr[0]-1)
      {
        nlapiLogExecution("Debug","Step 67 having cdp id:",Id);
        newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();		
        nlapiLogExecution("Debug","Step 68 having cdp id:",Id +" and new day" + newDay);
        diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day),shipDaysArr,Id,weekday);	
        nlapiLogExecution("Debug","Step 69 having cdp id:",Id);
      }
      else if(shipDaysArr[0]-1 < day && day <= shipDaysArr[1]-1)
      {
        if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[1]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[1]-1))
        {
          nlapiLogExecution("Debug","Step 70 having cdp id:",Id);
          newDay = nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day).getDay();	
          nlapiLogExecution("Debug","Step 71 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day),shipDaysArr,Id,weekday);	
          nlapiLogExecution("Debug","Step 72 having cdp id:",Id);
        }
        else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[1]-1)
        {
          nlapiLogExecution("Debug","Step 73 having cdp id:",Id);
          newDay = shipDaysArr[2]-1;
          nlapiLogExecution("Debug","Step 74 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day),shipDaysArr,Id,weekday);	
          nlapiLogExecution("Debug","Step 75 having cdp id:",Id);
        }				
      }
      else if(shipDaysArr[1]-1 < day && day <= shipDaysArr[2]-1)
      {
        if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[2]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[2]-1))
        {
          nlapiLogExecution("Debug","Step 76 having cdp id:",Id);
          newDay = nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day).getDay();		
          nlapiLogExecution("Debug","Step 77 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day),shipDaysArr,Id,weekday);	
          nlapiLogExecution("Debug","Step 78 having cdp id:",Id);
        }
        else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[2]-1)
        {
          nlapiLogExecution("Debug","Step 79 having cdp id:",Id);
          newDay = shipDaysArr[3]-1;
          nlapiLogExecution("Debug","Step 80 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[3]-1)-day),shipDaysArr,Id,weekday);
          nlapiLogExecution("Debug","Step 81 having cdp id:",Id);
        }				
      }
      else if(shipDaysArr[2]-1 < day && day <= shipDaysArr[3]-1)									
      {
        if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[3]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[3]-1))
        {
          nlapiLogExecution("Debug","Step 82 having cdp id:",Id);
          newDay = nlapiAddDays(currentDate,(shipDaysArr[3]-1)-day).getDay();		
          nlapiLogExecution("Debug","Step 83 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[3]-1)-day),shipDaysArr,Id,weekday);	
          nlapiLogExecution("Debug","Step 84 having cdp id:",Id);
        }
        else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[3]-1)
        {
          nlapiLogExecution("Debug","Step 85 having cdp id:",Id);
          newDay = shipDaysArr[0]-1;
          nlapiLogExecution("Debug","Step 86 having cdp id:",Id +" and new day" + newDay);
          diffDay = 7 - (shipDaysArr[3] - shipDaysArr[0]);	
          nlapiLogExecution("Debug","Step 87 having cdp id:",Id +" and diff Day" + diffDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,diffDay),shipDaysArr,Id,weekday);	
          nlapiLogExecution("Debug","Step 88 having cdp id:",Id);
        }				
      }
      else if(shipDaysArr[3]-1 < day)
      {
        nlapiLogExecution("Debug","Step 89 having cdp id:",Id);
        newDay = nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day).getDay();	
        nlapiLogExecution("Debug","Step 90 having cdp id:",Id +" and new day" + newDay);
        diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day),shipDaysArr,Id,weekday);	
        nlapiLogExecution("Debug","Step 91 having cdp id:",Id);
      }
    }								
  }
  else if(count == 1 && shipDaysArr[0] != 1)
  {
    //code here 
    switch(shipDaysArr[0]-1)
    {								    
      case 1:
        if(day == (shipDaysArr[0]-1))
        {                    
          if(parseFloat(hours) <= parseFloat(deadLineTimeNo))
          {
            nlapiLogExecution("Debug","Step 92 having cdp id:",Id);
            newDay = nlapiAddDays(currentDate,1-day).getDay();
            nlapiLogExecution("Debug","Step 93 having cdp id:",Id +" and new day" + newDay);
            diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,1-day),shipDaysArr,Id,weekday);
            nlapiLogExecution("Debug","Step 94 having cdp id:",Id);
          }
          else if(parseFloat(hours) > parseFloat(deadLineTimeNo))
          {
            nlapiLogExecution("Debug","Step 95 having cdp id:",Id);
            newDay = nlapiAddDays(currentDate,8-day).getDay();	
            nlapiLogExecution("Debug","Step 96 having cdp id:",Id +" and new day" + newDay);
            diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,8-day),shipDaysArr,Id,weekday);
            nlapiLogExecution("Debug","Step 97 having cdp id:",Id);
          }					
        }
        else if(day > (shipDaysArr[0]-1))
        {
          nlapiLogExecution("Debug","Step 98 having cdp id:",Id);
          newDay = nlapiAddDays(currentDate,8-day).getDay();
          nlapiLogExecution("Debug","Step 99 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,8-day),shipDaysArr,Id,weekday);
          nlapiLogExecution("Debug","Step 100 having cdp id:",Id);
        }
        break;
      case 2:
        if(day <= (shipDaysArr[0]-1))
        {                    
          if((parseFloat(hours) <= parseFloat(deadLineTimeNo) && day <= shipDaysArr[0]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[0]-1))
          {
            nlapiLogExecution("Debug","Step 101 having cdp id:",Id);
            newDay = nlapiAddDays(currentDate,2-day).getDay();
            nlapiLogExecution("Debug","Step 102 having cdp id:",Id +" and new day" + newDay);
            diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,2-day),shipDaysArr,Id,weekday);
            nlapiLogExecution("Debug","Step 103 having cdp id:",Id);
          }
          else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[0]-1)
          {
            nlapiLogExecution("Debug","Step 104 having cdp id:",Id); 
            newDay = nlapiAddDays(currentDate,9-day).getDay();	
            nlapiLogExecution("Debug","Step 105 having cdp id:",Id +" and new day" + newDay);
            diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,9-day),shipDaysArr,Id,weekday);
            nlapiLogExecution("Debug","Step 106 having cdp id:",Id);
          }										
        }
        else if(day > (shipDaysArr[0]-1))
        {
          nlapiLogExecution("Debug","Step 107 having cdp id:",Id);
          newDay = nlapiAddDays(currentDate,9-day).getDay();
          nlapiLogExecution("Debug","Step 108 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,9-day),shipDaysArr,Id,weekday);
          nlapiLogExecution("Debug","Step 109 having cdp id:",Id);
        }
        break;
      case 3:
        if(day <= (shipDaysArr[0]-1))
        {
          if((parseFloat(hours) <= parseFloat(deadLineTimeNo) && day <= shipDaysArr[0]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[0]-1))
          {
            nlapiLogExecution("Debug","Step 110 having cdp id:",Id);
            newDay = nlapiAddDays(currentDate,3-day).getDay();		
            nlapiLogExecution("Debug","Step 111 having cdp id:",Id +" and new day" + newDay);
            diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,3-day),shipDaysArr,Id,weekday);
            nlapiLogExecution("Debug","Step 112 having cdp id:",Id);
          }
          else if(parseFloat(hours) > parseFloat(deadLineTimeNo)  && day == shipDaysArr[0]-1)
          {
            nlapiLogExecution("Debug","Step 113 having cdp id:",Id);
            newDay = nlapiAddDays(currentDate,10-day).getDay();		
            nlapiLogExecution("Debug","Step 114 having cdp id:",Id +" and new day" + newDay);
            diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,10-day),shipDaysArr,Id,weekday);
            nlapiLogExecution("Debug","Step 115 having cdp id:",Id);
          }					
        }
        else if(day > (shipDaysArr[0]-1))
        {
          nlapiLogExecution("Debug","Step 116 having cdp id:",Id);
          newDay = nlapiAddDays(currentDate,10-day).getDay();	
          nlapiLogExecution("Debug","Step 117 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,10-day),shipDaysArr,Id,weekday);
          nlapiLogExecution("Debug","Step 118 having cdp id:",Id);
        }
        break;
      case 4:
        if(day <= (shipDaysArr[0]-1))
        {
          if((parseFloat(hours) <= parseFloat(deadLineTimeNo) && day <= shipDaysArr[0]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[0]-1))
          {
            nlapiLogExecution("Debug","Step 119 having cdp id:",Id);
            newDay = nlapiAddDays(currentDate,4-day).getDay();			
            nlapiLogExecution("Debug","Step 120 having cdp id:",Id +" and new day" + newDay);
            diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,4-day),shipDaysArr,Id,weekday);
            nlapiLogExecution("Debug","Step 121 having cdp id:",Id);
          }
          else if(parseFloat(hours) > parseFloat(deadLineTimeNo)  && day == shipDaysArr[0]-1)
          {
            nlapiLogExecution("Debug","Step 122 having cdp id:",Id);
            newDay = nlapiAddDays(currentDate,11-day).getDay();	
            nlapiLogExecution("Debug","Step 123 having cdp id:",Id +" and new day" + newDay);
            diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,11-day),shipDaysArr,Id,weekday);
            nlapiLogExecution("Debug","Step 124 having cdp id:",Id);
          }					
        }
        else if(day > (shipDaysArr[0]-1))
        {
          nlapiLogExecution("Debug","Step 125 having cdp id:",Id);
          newDay = nlapiAddDays(currentDate,11-day).getDay();
          nlapiLogExecution("Debug","Step 126 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,11-day),shipDaysArr,Id,weekday);
          nlapiLogExecution("Debug","Step 127 having cdp id:",Id);
        }
        break;
      case 5:
        if(day <= (shipDaysArr[0]-1))
        {				
          if((parseFloat(hours) <= parseFloat(deadLineTimeNo) && day <= shipDaysArr[0]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[0]-1))
          {
            nlapiLogExecution("Debug","Step 128 having cdp id:",Id);
            newDay = nlapiAddDays(currentDate,5-day).getDay();	
            nlapiLogExecution("Debug","Step 129 having cdp id:",Id +" and new day" + newDay);
            diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,5-day),shipDaysArr,Id,weekday);
            nlapiLogExecution("Debug","Step 130 having cdp id:",Id);
          }
          else if(parseFloat(hours) > parseFloat(deadLineTimeNo)  && day == shipDaysArr[0]-1)
          {
            nlapiLogExecution("Debug","Step 131 having cdp id:",Id);
            newDay = nlapiAddDays(currentDate,12-day).getDay();	
            nlapiLogExecution("Debug","Step 132 having cdp id:",Id +" and new day" + newDay);
            diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,12-day),shipDaysArr,Id,weekday);
            nlapiLogExecution("Debug","Step 133 having cdp id:",Id);
          }					
        }
        else if(day > (shipDaysArr[0]-1))
        {
          nlapiLogExecution("Debug","Step 134 having cdp id:",Id);
          newDay = nlapiAddDays(currentDate,12-day).getDay();
          nlapiLogExecution("Debug","Step 135 having cdp id:",Id +" and new day" + newDay);
          diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,12-day),shipDaysArr,Id,weekday);
          nlapiLogExecution("Debug","Step 136 having cdp id:",Id);
        }
        break;
      default:
        break;
    }                                								
  }
  return diamondETA;
}			

function GetDiamondETA(day,businessDays,currentDate,shipDaysArr,Id,weekday)
{
  /* var weekday = new Array(7);
  weekday[0]=  "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";*/
  businessDays = parseInt(businessDays); //Added by ajay 16Nov 2016
  var newDate = new Date();
  if(businessDays > 0 && businessDays <= 5)
  {
    switch(day)
    {
      case 1:
        if(businessDays == 1)
        {
          nlapiLogExecution("Debug","Step 137 having cdp id:",Id);
          newDate = forbusinessDays_1(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 138 having cdp id:",Id);
        }
        else if(businessDays == 2)
        {
          nlapiLogExecution("Debug","Step 139 having cdp id:",Id);
          newDate=  forbusinessDays_2(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 140 having cdp id:",Id);
        }
        else if(businessDays == 3)
        {
          nlapiLogExecution("Debug","Step 141 having cdp id:",Id);
          newDate = forbusinessDays_3(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 142 having cdp id:",Id);
        }
        else if(businessDays == 4)
        {
          nlapiLogExecution("Debug","Step 143 having cdp id:",Id);
          newDate=  forbusinessDays_4(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 144 having cdp id:",Id);
        }
        else if(businessDays == 5)
        {
          nlapiLogExecution("Debug","Step 145 having cdp id:",Id);
          newDate= forbusinessDays_5(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 146 having cdp id:",Id);
        }
        break;
      case 2:													
        if(businessDays == 1)
        {
          nlapiLogExecution("Debug","Step 147 having cdp id:",Id);
          newDate = forbusinessDays_1(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 148 having cdp id:",Id);
        }
        else if(businessDays == 2)
        {
          nlapiLogExecution("Debug","Step 149 having cdp id:",Id);
          newDate=  forbusinessDays_2(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 150 having cdp id:",Id);
        }
        else if(businessDays == 3)
        {
          nlapiLogExecution("Debug","Step 151 having cdp id:",Id);
          newDate = forbusinessDays_3(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 152 having cdp id:",Id);
        }
        else if(businessDays == 4)
        {
          nlapiLogExecution("Debug","Step 153 having cdp id:",Id);
          newDate=  forbusinessDays_4(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 154 having cdp id:",Id);
        }
        else if(businessDays == 5)
        {
          nlapiLogExecution("Debug","Step 155 having cdp id:",Id);
          newDate= forbusinessDays_5(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 156 having cdp id:",Id);
        }
        break;
      case 3:													
        if(businessDays == 1)
        {
          nlapiLogExecution("Debug","Step 157 having cdp id:",Id);
          newDate = forbusinessDays_1(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 158 having cdp id:",Id);
        }
        else if(businessDays == 2)
        {
          nlapiLogExecution("Debug","Step 159 having cdp id:",Id);
          newDate=  forbusinessDays_2(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 160 having cdp id:",Id);
        }
        else if(businessDays == 3)
        {
          nlapiLogExecution("Debug","Step 161 having cdp id:",Id);
          newDate = forbusinessDays_3(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 162 having cdp id:",Id);
        }
        else if(businessDays == 4)
        {
          nlapiLogExecution("Debug","Step 163 having cdp id:",Id);
          newDate=  forbusinessDays_4(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 164 having cdp id:",Id);
        }
        else if(businessDays == 5)
        {
          nlapiLogExecution("Debug","Step 165 having cdp id:",Id);
          newDate= forbusinessDays_5(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 166 having cdp id:",Id);
        }
        break;
      case 4:													
        if(businessDays == 1)
        {
          nlapiLogExecution("Debug","Step 167 having cdp id:",Id);
          newDate = forbusinessDays_1(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 168 having cdp id:",Id);
        }
        else if(businessDays == 2)
        {
          nlapiLogExecution("Debug","Step 169 having cdp id:",Id);
          newDate=  forbusinessDays_2(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 170 having cdp id:",Id);
        }
        else if(businessDays == 3)
        {
          nlapiLogExecution("Debug","Step 171 having cdp id:",Id);
          newDate = forbusinessDays_3(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 172 having cdp id:",Id);
        }
        else if(businessDays == 4)
        {
          nlapiLogExecution("Debug","Step 173 having cdp id:",Id);
          newDate=  forbusinessDays_4(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 174 having cdp id:",Id);
        }
        else if(businessDays == 5)
        {
          nlapiLogExecution("Debug","Step 175 having cdp id:",Id);
          newDate= forbusinessDays_5(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 176 having cdp id:",Id);
        }
        break;
      case 5:													
        if(businessDays == 1)
        {
          nlapiLogExecution("Debug","Step 177 having cdp id:",Id);
          newDate = forbusinessDays_1(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 178 having cdp id:",Id);
        }
        else if(businessDays == 2)
        {
          nlapiLogExecution("Debug","Step 179 having cdp id:",Id);
          newDate=  forbusinessDays_2(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 180 having cdp id:",Id);
        }
        else if(businessDays == 3)
        {
          nlapiLogExecution("Debug","Step 181 having cdp id:",Id);
          newDate = forbusinessDays_3(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 182 having cdp id:",Id);
        }
        else if(businessDays == 4)
        {
          nlapiLogExecution("Debug","Step 183 having cdp id:",Id);
          newDate=  forbusinessDays_4(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 184 having cdp id:",Id);
        }
        else if(businessDays == 5)
        {
          nlapiLogExecution("Debug","Step 185 having cdp id:",Id);
          newDate= forbusinessDays_5(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 186 having cdp id:",Id);
        }
        break;
      case 6:													
        if(businessDays == 1)
        {
          nlapiLogExecution("Debug","Step 187 having cdp id:",Id);
          newDate = forbusinessDays_1(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 188 having cdp id:",Id);
        }
        else if(businessDays == 2)
        {
          nlapiLogExecution("Debug","Step 189 having cdp id:",Id);
          newDate=  forbusinessDays_2(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 190 having cdp id:",Id);
        }
        else if(businessDays == 3)
        {
          nlapiLogExecution("Debug","Step 191 having cdp id:",Id);
          newDate = forbusinessDays_3(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 192 having cdp id:",Id);
        }
        else if(businessDays == 4)
        {
          nlapiLogExecution("Debug","Step 193 having cdp id:",Id);
          newDate=  forbusinessDays_4(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 194 having cdp id:",Id);
        }
        else if(businessDays == 5)
        {
          nlapiLogExecution("Debug","Step 195 having cdp id:",Id);
          newDate= forbusinessDays_5(businessDays,weekday,currentDate,shipDaysArr,Id);		
          nlapiLogExecution("Debug","Step 196 having cdp id:",Id);
        }
        break;
      case 0:													
        if(businessDays == 1)
        {
          nlapiLogExecution("Debug","Step 197 having cdp id:",Id);
          newDate = forbusinessDays_1(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 198 having cdp id:",Id);
        }
        else if(businessDays == 2)
        {
          nlapiLogExecution("Debug","Step 199 having cdp id:",Id);
          newDate=  forbusinessDays_2(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 200 having cdp id:",Id);
        }
        else if(businessDays == 3)
        {
          nlapiLogExecution("Debug","Step 201 having cdp id:",Id);
          newDate = forbusinessDays_3(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 202 having cdp id:",Id);
        }
        else if(businessDays == 4)
        {
          nlapiLogExecution("Debug","Step 203 having cdp id:",Id);
          newDate=  forbusinessDays_4(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 204 having cdp id:",Id);
        }
        else if(businessDays == 5)
        {
          nlapiLogExecution("Debug","Step 205 having cdp id:",Id);
          newDate= forbusinessDays_5(businessDays,weekday,currentDate,shipDaysArr,Id);		
          nlapiLogExecution("Debug","Step 206 having cdp id:",Id);
        }
        break;					
    }
  }
  else if(businessDays > 5 && businessDays <= 10)
  {
    switch(day)
    {
      case 1:
        if(businessDays == 6)
        {
          nlapiLogExecution("Debug","Step 207 having cdp id:",Id);
          newDate = forbusinessDays_6(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 208 having cdp id:",Id);
        }
        else if(businessDays == 7)
        {
          nlapiLogExecution("Debug","Step 209 having cdp id:",Id);
          newDate=  forbusinessDays_7(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 210 having cdp id:",Id);
        }
        else if(businessDays == 8)
        {
          nlapiLogExecution("Debug","Step 211 having cdp id:",Id);
          newDate = forbusinessDays_8(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 212 having cdp id:",Id);
        }
        else if(businessDays == 9)
        {
          nlapiLogExecution("Debug","Step 213 having cdp id:",Id);
          newDate=  forbusinessDays_9(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 214 having cdp id:",Id);
        }
        else if(businessDays == 10)
        {
          nlapiLogExecution("Debug","Step 215 having cdp id:",Id);
          newDate= forbusinessDays_10(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 216 having cdp id:",Id);
        }
        break;
      case 2:													
        if(businessDays == 6)
        {
          nlapiLogExecution("Debug","Step 217 having cdp id:",Id);
          newDate = forbusinessDays_6(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 218 having cdp id:",Id);
        }
        else if(businessDays == 7)
        {
          nlapiLogExecution("Debug","Step 219 having cdp id:",Id);
          newDate=  forbusinessDays_7(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 220 having cdp id:",Id);
        }
        else if(businessDays == 8)
        {
          nlapiLogExecution("Debug","Step 221 having cdp id:",Id);
          newDate = forbusinessDays_8(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 222 having cdp id:",Id);
        }
        else if(businessDays == 9)
        {
          nlapiLogExecution("Debug","Step 223 having cdp id:",Id);
          newDate=  forbusinessDays_9(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 224 having cdp id:",Id);
        }
        else if(businessDays == 10)
        {
          nlapiLogExecution("Debug","Step 225 having cdp id:",Id);
          newDate= forbusinessDays_10(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 226 having cdp id:",Id);
        }
        break;
      case 3:													
        if(businessDays == 6)
        {
          nlapiLogExecution("Debug","Step 227 having cdp id:",Id);
          newDate = forbusinessDays_6(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 228 having cdp id:",Id);
        }
        else if(businessDays == 7)
        {
          nlapiLogExecution("Debug","Step 229 having cdp id:",Id);
          newDate=  forbusinessDays_7(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 230 having cdp id:",Id);
        }
        else if(businessDays == 8)
        {
          nlapiLogExecution("Debug","Step 231 having cdp id:",Id);
          newDate = forbusinessDays_8(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 232 having cdp id:",Id);
        }
        else if(businessDays == 9)
        {
          nlapiLogExecution("Debug","Step 233 having cdp id:",Id);
          newDate=  forbusinessDays_9(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 234 having cdp id:",Id);
        }
        else if(businessDays == 10)
        {
          nlapiLogExecution("Debug","Step 235 having cdp id:",Id);
          newDate= forbusinessDays_10(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 236 having cdp id:",Id);
        }
        break;
      case 4:													
        if(businessDays == 6)
        {
          nlapiLogExecution("Debug","Step 237 having cdp id:",Id);
          newDate = forbusinessDays_6(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 238 having cdp id:",Id);
        }
        else if(businessDays == 7)
        {
          nlapiLogExecution("Debug","Step 239 having cdp id:",Id);
          newDate=  forbusinessDays_7(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 240 having cdp id:",Id);
        }
        else if(businessDays == 8)
        {
          nlapiLogExecution("Debug","Step 241 having cdp id:",Id);
          newDate = forbusinessDays_8(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 242 having cdp id:",Id);
        }
        else if(businessDays == 9)
        {
          nlapiLogExecution("Debug","Step 243 having cdp id:",Id);
          newDate=  forbusinessDays_9(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 244 having cdp id:",Id);
        }
        else if(businessDays == 10)
        {
          nlapiLogExecution("Debug","Step 245 having cdp id:",Id);
          newDate= forbusinessDays_10(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 246 having cdp id:",Id);
        }
        break;
      case 5:													
        if(businessDays == 6)
        {
          nlapiLogExecution("Debug","Step 247 having cdp id:",Id);
          newDate = forbusinessDays_6(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 248 having cdp id:",Id);
        }
        else if(businessDays == 7)
        {
          nlapiLogExecution("Debug","Step 249 having cdp id:",Id);
          newDate=  forbusinessDays_7(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 250 having cdp id:",Id);
        }
        else if(businessDays == 8)
        {
          nlapiLogExecution("Debug","Step 251 having cdp id:",Id);
          newDate = forbusinessDays_8(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 252 having cdp id:",Id);
        }
        else if(businessDays == 9)
        {
          nlapiLogExecution("Debug","Step 253 having cdp id:",Id);
          newDate=  forbusinessDays_9(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 254 having cdp id:",Id);
        }
        else if(businessDays == 10)
        {
          nlapiLogExecution("Debug","Step 255 having cdp id:",Id);
          newDate= forbusinessDays_10(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 256 having cdp id:",Id);
        }
        break;
      case 6:													
        if(businessDays == 6)
        {
          nlapiLogExecution("Debug","Step 257 having cdp id:",Id);
          newDate = forbusinessDays_6(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 258 having cdp id:",Id);
        }
        else if(businessDays == 7)
        {
          nlapiLogExecution("Debug","Step 259 having cdp id:",Id);
          newDate=  forbusinessDays_7(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 260 having cdp id:",Id);
        }
        else if(businessDays == 8)
        {
          nlapiLogExecution("Debug","Step 261 having cdp id:",Id);
          newDate = forbusinessDays_8(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 262 having cdp id:",Id);
        }
        else if(businessDays == 9)
        {
          nlapiLogExecution("Debug","Step 263 having cdp id:",Id);
          newDate=  forbusinessDays_9(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 264 having cdp id:",Id);
        }
        else if(businessDays == 10)
        {
          nlapiLogExecution("Debug","Step 265 having cdp id:",Id);
          newDate= forbusinessDays_10(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 266 having cdp id:",Id);
        }
        break;
      case 0:													
        if(businessDays == 6)
        {
          nlapiLogExecution("Debug","Step 267 having cdp id:",Id);
          newDate = forbusinessDays_6(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 268 having cdp id:",Id);
        }
        else if(businessDays == 7)
        {
          nlapiLogExecution("Debug","Step 269 having cdp id:",Id);
          newDate=  forbusinessDays_7(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 270 having cdp id:",Id);
        }
        else if(businessDays == 8)
        {
          nlapiLogExecution("Debug","Step 271 having cdp id:",Id);
          newDate = forbusinessDays_8(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 272 having cdp id:",Id);
        }
        else if(businessDays == 9)
        {
          nlapiLogExecution("Debug","Step 273 having cdp id:",Id);
          newDate=  forbusinessDays_9(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 274 having cdp id:",Id);
        }
        else if(businessDays == 10)
        {
          nlapiLogExecution("Debug","Step 275 having cdp id:",Id);
          newDate= forbusinessDays_10(businessDays,weekday,currentDate,shipDaysArr,Id);	
          nlapiLogExecution("Debug","Step 276 having cdp id:",Id);
        }
        break;					
    }
  }
  else if(businessDays > 10 && businessDays <= 15)
  {
    switch(day)
    {
      case 1:
        if(businessDays == 11)
        {
          nlapiLogExecution("Debug","Step 277 having cdp id:",Id);
          newDate = forbusinessDays_11(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 278 having cdp id:",Id);
        }
        else if(businessDays == 12)
        {
          nlapiLogExecution("Debug","Step 279 having cdp id:",Id);
          newDate=  forbusinessDays_12(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 280 having cdp id:",Id);
        }
        else if(businessDays == 13)
        {
          nlapiLogExecution("Debug","Step 281 having cdp id:",Id);
          newDate = forbusinessDays_13(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 282 having cdp id:",Id);
        }
        else if(businessDays == 14)
        {
          nlapiLogExecution("Debug","Step 283 having cdp id:",Id);
          newDate=  forbusinessDays_14(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 284 having cdp id:",Id);
        }
        else if(businessDays == 15)
        {
          nlapiLogExecution("Debug","Step 285 having cdp id:",Id);
          newDate= forbusinessDays_15(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 286 having cdp id:",Id);
        }
        break;
      case 2:													
        if(businessDays == 11)
        {
          nlapiLogExecution("Debug","Step 287 having cdp id:",Id);
          newDate = forbusinessDays_11(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 288 having cdp id:",Id);
        }
        else if(businessDays == 12)
        {
          nlapiLogExecution("Debug","Step 289 having cdp id:",Id);
          newDate=  forbusinessDays_12(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 290 having cdp id:",Id);
        }
        else if(businessDays == 13)
        {
          nlapiLogExecution("Debug","Step 291 having cdp id:",Id);
          newDate = forbusinessDays_13(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 292 having cdp id:",Id);
        }
        else if(businessDays == 14)
        {
          nlapiLogExecution("Debug","Step 293 having cdp id:",Id);
          newDate=  forbusinessDays_14(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 294 having cdp id:",Id);
        }
        else if(businessDays == 15)
        {
          nlapiLogExecution("Debug","Step 295 having cdp id:",Id);
          newDate= forbusinessDays_15(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 296 having cdp id:",Id);
        }
        break;
      case 3:													
        if(businessDays == 11)
        {
          nlapiLogExecution("Debug","Step 297 having cdp id:",Id);
          newDate = forbusinessDays_11(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 298 having cdp id:",Id);
        }
        else if(businessDays == 12)
        {
          nlapiLogExecution("Debug","Step 299 having cdp id:",Id);
          newDate=  forbusinessDays_12(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 300 having cdp id:",Id);
        }
        else if(businessDays == 13)
        {
          nlapiLogExecution("Debug","Step 301 having cdp id:",Id);
          newDate = forbusinessDays_13(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 302 having cdp id:",Id);
        }
        else if(businessDays == 14)
        {
          nlapiLogExecution("Debug","Step 303 having cdp id:",Id);
          newDate=  forbusinessDays_14(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 304 having cdp id:",Id);
        }
        else if(businessDays == 15)
        {
          nlapiLogExecution("Debug","Step 305 having cdp id:",Id);
          newDate= forbusinessDays_15(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 306 having cdp id:",Id);
        }
        break;
      case 4:													
        if(businessDays == 11)
        {
          nlapiLogExecution("Debug","Step 307 having cdp id:",Id);
          newDate = forbusinessDays_11(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 308 having cdp id:",Id);
        }
        else if(businessDays == 12)
        {
          nlapiLogExecution("Debug","Step 309 having cdp id:",Id);
          newDate=  forbusinessDays_12(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 310 having cdp id:",Id);
        }
        else if(businessDays == 13)
        {
          nlapiLogExecution("Debug","Step 311 having cdp id:",Id);
          newDate = forbusinessDays_13(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 312 having cdp id:",Id);
        }
        else if(businessDays == 14)
        {
          nlapiLogExecution("Debug","Step 313 having cdp id:",Id);
          newDate=  forbusinessDays_14(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 314 having cdp id:",Id);
        }
        else if(businessDays == 15)
        {
          nlapiLogExecution("Debug","Step 315 having cdp id:",Id);
          newDate= forbusinessDays_15(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 316 having cdp id:",Id);
        }
        break;
      case 5:													
        if(businessDays == 11)
        {
          nlapiLogExecution("Debug","Step 317 having cdp id:",Id);
          newDate = forbusinessDays_11(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 318 having cdp id:",Id);
        }
        else if(businessDays == 12)
        {
          nlapiLogExecution("Debug","Step 319 having cdp id:",Id);
          newDate=  forbusinessDays_12(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 320 having cdp id:",Id);
        }
        else if(businessDays == 13)
        {
          nlapiLogExecution("Debug","Step 321 having cdp id:",Id);
          newDate = forbusinessDays_13(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 322 having cdp id:",Id);
        }
        else if(businessDays == 14)
        {
          nlapiLogExecution("Debug","Step 323 having cdp id:",Id);
          newDate=  forbusinessDays_14(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 324 having cdp id:",Id);
        }
        else if(businessDays == 15)
        {
          nlapiLogExecution("Debug","Step 325 having cdp id:",Id);
          newDate= forbusinessDays_15(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 326 having cdp id:",Id);
        }
        break;
      case 6:													
        if(businessDays == 11)
        {
          nlapiLogExecution("Debug","Step 327 having cdp id:",Id);
          newDate = forbusinessDays_11(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 328 having cdp id:",Id);
        }
        else if(businessDays == 12)
        {
          nlapiLogExecution("Debug","Step 329 having cdp id:",Id);
          newDate=  forbusinessDays_12(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 330 having cdp id:",Id);
        }
        else if(businessDays == 13)
        {
          nlapiLogExecution("Debug","Step 331 having cdp id:",Id);
          newDate = forbusinessDays_13(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 332 having cdp id:",Id);
        }
        else if(businessDays == 14)
        {
          nlapiLogExecution("Debug","Step 333 having cdp id:",Id);
          newDate=  forbusinessDays_14(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 334 having cdp id:",Id);
        }
        else if(businessDays == 15)
        {
          nlapiLogExecution("Debug","Step 335 having cdp id:",Id);
          newDate= forbusinessDays_15(businessDays,weekday,currentDate,shipDaysArr,Id);	
          nlapiLogExecution("Debug","Step 336 having cdp id:",Id);
        }
        break;
      case 0:													
        if(businessDays == 11)
        {
          nlapiLogExecution("Debug","Step 337 having cdp id:",Id);
          newDate = forbusinessDays_11(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 338 having cdp id:",Id);
        }
        else if(businessDays == 12)
        {
          nlapiLogExecution("Debug","Step 339 having cdp id:",Id);
          newDate=  forbusinessDays_12(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 340 having cdp id:",Id);
        }
        else if(businessDays == 13)
        {
          nlapiLogExecution("Debug","Step 341 having cdp id:",Id);
          newDate = forbusinessDays_13(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 342 having cdp id:",Id);
        }
        else if(businessDays == 14)
        {
          nlapiLogExecution("Debug","Step 343 having cdp id:",Id);
          newDate=  forbusinessDays_14(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 344 having cdp id:",Id);
        }
        else if(businessDays == 15)
        {
          nlapiLogExecution("Debug","Step 345 having cdp id:",Id);
          newDate= forbusinessDays_15(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 346 having cdp id:",Id);
        }
        break;					

    }
  }
  else if(businessDays > 15 && businessDays <= 20)
  {
    switch(day)
    {
      case 1:
        if(businessDays == 16)
        {
          nlapiLogExecution("Debug","Step 347 having cdp id:",Id);
          newDate = forbusinessDays_16(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 348 having cdp id:",Id);
        }
        else if(businessDays == 17)
        {
          nlapiLogExecution("Debug","Step 349 having cdp id:",Id);
          newDate=  forbusinessDays_17(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 350 having cdp id:",Id);
        }
        else if(businessDays == 18)
        {
          nlapiLogExecution("Debug","Step 351 having cdp id:",Id);
          newDate = forbusinessDays_18(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 352 having cdp id:",Id);
        }
        else if(businessDays == 19)
        {
          nlapiLogExecution("Debug","Step 353 having cdp id:",Id);
          newDate=  forbusinessDays_19(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 354 having cdp id:",Id);
        }
        else if(businessDays == 20)
        {
          nlapiLogExecution("Debug","Step 355 having cdp id:",Id);
          newDate= forbusinessDays_20(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 356 having cdp id:",Id);
        }
        break;
      case 2:													
        if(businessDays == 16)
        {
          nlapiLogExecution("Debug","Step 357 having cdp id:",Id);
          newDate = forbusinessDays_16(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 358 having cdp id:",Id);
        }
        else if(businessDays == 17)
        {
          nlapiLogExecution("Debug","Step 359 having cdp id:",Id);
          newDate=  forbusinessDays_17(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 360 having cdp id:",Id);
        }
        else if(businessDays == 18)
        {
          nlapiLogExecution("Debug","Step 361 having cdp id:",Id);
          newDate = forbusinessDays_18(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 362 having cdp id:",Id);
        }
        else if(businessDays == 19)
        {
          nlapiLogExecution("Debug","Step 363 having cdp id:",Id);
          newDate=  forbusinessDays_19(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 364 having cdp id:",Id);
        }
        else if(businessDays == 20)
        {
          nlapiLogExecution("Debug","Step 365 having cdp id:",Id);
          newDate= forbusinessDays_20(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 366 having cdp id:",Id);
        }
        break;
      case 3:													
        if(businessDays == 16)
        {
          nlapiLogExecution("Debug","Step 367 having cdp id:",Id);
          newDate = forbusinessDays_16(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 368 having cdp id:",Id);
        }
        else if(businessDays == 17)
        {
          nlapiLogExecution("Debug","Step 369 having cdp id:",Id);
          newDate=  forbusinessDays_17(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 370 having cdp id:",Id);
        }
        else if(businessDays == 18)
        {
          nlapiLogExecution("Debug","Step 371 having cdp id:",Id);
          newDate = forbusinessDays_18(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 372 having cdp id:",Id);
        }
        else if(businessDays == 19)
        {
          nlapiLogExecution("Debug","Step 373 having cdp id:",Id);
          newDate=  forbusinessDays_19(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 374 having cdp id:",Id);
        }
        else if(businessDays == 20)
        {
          nlapiLogExecution("Debug","Step 375 having cdp id:",Id);
          newDate= forbusinessDays_20(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 376 having cdp id:",Id);
        }
        break;
      case 4:													
        if(businessDays == 16)
        {
          nlapiLogExecution("Debug","Step 377 having cdp id:",Id);
          newDate = forbusinessDays_16(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 378 having cdp id:",Id);
        }
        else if(businessDays == 17)
        {
          nlapiLogExecution("Debug","Step 379 having cdp id:",Id);
          newDate=  forbusinessDays_17(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 380 having cdp id:",Id);
        }
        else if(businessDays == 18)
        {
          nlapiLogExecution("Debug","Step 381 having cdp id:",Id);
          newDate = forbusinessDays_18(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 382 having cdp id:",Id);
        }
        else if(businessDays == 19)
        {
          nlapiLogExecution("Debug","Step 383 having cdp id:",Id);
          newDate=  forbusinessDays_19(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 384 having cdp id:",Id);
        }
        else if(businessDays == 20)
        {
          nlapiLogExecution("Debug","Step 385 having cdp id:",Id);
          newDate= forbusinessDays_20(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 386 having cdp id:",Id);
        }
        break;
      case 5:													
        if(businessDays == 16)
        {
          nlapiLogExecution("Debug","Step 387 having cdp id:",Id);
          newDate = forbusinessDays_16(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 388 having cdp id:",Id);
        }
        else if(businessDays == 17)
        {
          nlapiLogExecution("Debug","Step 389 having cdp id:",Id);
          newDate=  forbusinessDays_17(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 390 having cdp id:",Id);
        }
        else if(businessDays == 18)
        {
          nlapiLogExecution("Debug","Step 391 having cdp id:",Id);
          newDate = forbusinessDays_18(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 392 having cdp id:",Id);
        }
        else if(businessDays == 19)
        {
          nlapiLogExecution("Debug","Step 393 having cdp id:",Id);
          newDate=  forbusinessDays_19(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 394 having cdp id:",Id);
        }
        else if(businessDays == 20)
        {
          nlapiLogExecution("Debug","Step 395 having cdp id:",Id);
          newDate= forbusinessDays_20(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 396 having cdp id:",Id);
        }
        break;
      case 6:													
        if(businessDays == 16)
        {
          nlapiLogExecution("Debug","Step 397 having cdp id:",Id);
          newDate = forbusinessDays_16(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 398 having cdp id:",Id);
        }
        else if(businessDays == 17)
        {
          nlapiLogExecution("Debug","Step 399 having cdp id:",Id);
          newDate=  forbusinessDays_17(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 400 having cdp id:",Id);
        }
        else if(businessDays == 18)
        {
          nlapiLogExecution("Debug","Step 401 having cdp id:",Id);
          newDate = forbusinessDays_18(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 402 having cdp id:",Id);
        }
        else if(businessDays == 19)
        {
          nlapiLogExecution("Debug","Step 403 having cdp id:",Id);
          newDate=  forbusinessDays_19(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 404 having cdp id:",Id);
        }
        else if(businessDays == 20)
        {
          nlapiLogExecution("Debug","Step 405 having cdp id:",Id);
          newDate= forbusinessDays_20(businessDays,weekday,currentDate,shipDaysArr,Id);	
          nlapiLogExecution("Debug","Step 406 having cdp id:",Id);
        }
        break;
      case 0:													
        if(businessDays == 16)
        {
          nlapiLogExecution("Debug","Step 407 having cdp id:",Id);
          newDate = forbusinessDays_16(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 408 having cdp id:",Id);
        }
        else if(businessDays == 17)
        {
          nlapiLogExecution("Debug","Step 409 having cdp id:",Id);
          newDate=  forbusinessDays_17(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 410 having cdp id:",Id);
        }
        else if(businessDays == 18)
        {
          nlapiLogExecution("Debug","Step 411 having cdp id:",Id);
          newDate = forbusinessDays_18(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 412 having cdp id:",Id);
        }
        else if(businessDays == 19)
        {
          nlapiLogExecution("Debug","Step 413 having cdp id:",Id);
          newDate=  forbusinessDays_19(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 414 having cdp id:",Id);
        }
        else if(businessDays == 20)
        {
          nlapiLogExecution("Debug","Step 415 having cdp id:",Id);
          newDate= forbusinessDays_20(businessDays,weekday,currentDate,shipDaysArr,Id);	
          nlapiLogExecution("Debug","Step 416 having cdp id:",Id);
        }
        break;					
    }
  }
  else if(businessDays > 20 && businessDays <= 25)
  {
    switch(day)
    {
      case 1:
        if(businessDays == 21)
        {
          nlapiLogExecution("Debug","Step 417 having cdp id:",Id);
          newDate = forbusinessDays_21(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 418 having cdp id:",Id);
        }
        else if(businessDays == 22)
        {
          nlapiLogExecution("Debug","Step 419 having cdp id:",Id);
          newDate=  forbusinessDays_22(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 420 having cdp id:",Id);
        }
        else if(businessDays == 23)
        {
          nlapiLogExecution("Debug","Step 421 having cdp id:",Id);
          newDate = forbusinessDays_23(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 422 having cdp id:",Id);
        }
        else if(businessDays == 24)
        {
          nlapiLogExecution("Debug","Step 423 having cdp id:",Id);
          newDate=  forbusinessDays_24(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 424 having cdp id:",Id);
        }
        else if(businessDays == 25)
        {
          nlapiLogExecution("Debug","Step 425 having cdp id:",Id);
          newDate= forbusinessDays_25(businessDays,weekday,currentDate,shipDaysArr,Id);	
          nlapiLogExecution("Debug","Step 426 having cdp id:",Id);
        }
        break;
      case 2:													
        if(businessDays == 21)
        {
          nlapiLogExecution("Debug","Step 427 having cdp id:",Id);
          newDate = forbusinessDays_21(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 428 having cdp id:",Id);
        }
        else if(businessDays == 22)
        {
          nlapiLogExecution("Debug","Step 429 having cdp id:",Id);
          newDate=  forbusinessDays_22(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 430 having cdp id:",Id);
        }
        else if(businessDays == 23)
        {
          nlapiLogExecution("Debug","Step 431 having cdp id:",Id);
          newDate = forbusinessDays_23(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 432 having cdp id:",Id);
        }
        else if(businessDays == 24)
        {
          nlapiLogExecution("Debug","Step 433 having cdp id:",Id);
          newDate=  forbusinessDays_24(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 434 having cdp id:",Id);
        }
        else if(businessDays == 25)
        {
          nlapiLogExecution("Debug","Step 435 having cdp id:",Id);
          newDate= forbusinessDays_25(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 436 having cdp id:",Id);
        }
        break;
      case 3:													
        if(businessDays == 21)
        {
          nlapiLogExecution("Debug","Step 437 having cdp id:",Id);
          newDate = forbusinessDays_21(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 438 having cdp id:",Id);
        }
        else if(businessDays == 22)
        {
          nlapiLogExecution("Debug","Step 439 having cdp id:",Id);
          newDate=  forbusinessDays_22(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 440 having cdp id:",Id);
        }
        else if(businessDays == 23)
        {
          nlapiLogExecution("Debug","Step 441 having cdp id:",Id);
          newDate = forbusinessDays_23(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 442 having cdp id:",Id);
        }
        else if(businessDays == 24)
        {
          nlapiLogExecution("Debug","Step 443 having cdp id:",Id);
          newDate=  forbusinessDays_24(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 444 having cdp id:",Id);
        }
        else if(businessDays == 25)
        {
          nlapiLogExecution("Debug","Step 445 having cdp id:",Id);
          newDate= forbusinessDays_25(businessDays,weekday,currentDate,shipDaysArr,Id);	
          nlapiLogExecution("Debug","Step 446 having cdp id:",Id);
        }
        break;
      case 4:													
        if(businessDays == 21)
        {
          nlapiLogExecution("Debug","Step 447 having cdp id:",Id);
          newDate = forbusinessDays_21(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 448 having cdp id:",Id);
        }
        else if(businessDays == 22)
        {
          nlapiLogExecution("Debug","Step 449 having cdp id:",Id);
          newDate=  forbusinessDays_22(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 450 having cdp id:",Id);
        }
        else if(businessDays == 23)
        {
          nlapiLogExecution("Debug","Step 451 having cdp id:",Id);
          newDate = forbusinessDays_23(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 452 having cdp id:",Id);
        }
        else if(businessDays == 24)
        {
          nlapiLogExecution("Debug","Step 453 having cdp id:",Id);
          newDate=  forbusinessDays_24(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 454 having cdp id:",Id);
        }
        else if(businessDays == 25)
        {
          nlapiLogExecution("Debug","Step 455 having cdp id:",Id);
          newDate= forbusinessDays_25(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 456 having cdp id:",Id);
        }
        break;
      case 5:													
        if(businessDays == 21)
        {
          nlapiLogExecution("Debug","Step 457 having cdp id:",Id);
          newDate = forbusinessDays_21(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 458 having cdp id:",Id);
        }
        else if(businessDays == 22)
        {
          nlapiLogExecution("Debug","Step 459 having cdp id:",Id);
          newDate=  forbusinessDays_22(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 460 having cdp id:",Id);
        }
        else if(businessDays == 23)
        {
          nlapiLogExecution("Debug","Step 461 having cdp id:",Id);
          newDate = forbusinessDays_23(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 462 having cdp id:",Id);
        }
        else if(businessDays == 24)
        {
          nlapiLogExecution("Debug","Step 463 having cdp id:",Id);
          newDate=  forbusinessDays_24(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 464 having cdp id:",Id);
        }
        else if(businessDays == 25)
        {
          nlapiLogExecution("Debug","Step 465 having cdp id:",Id);
          newDate= forbusinessDays_25(businessDays,weekday,currentDate,shipDaysArr,Id);	
          nlapiLogExecution("Debug","Step 466 having cdp id:",Id);
        }
        break;
      case 6:													
        if(businessDays == 21)
        {
          nlapiLogExecution("Debug","Step 467 having cdp id:",Id);
          newDate = forbusinessDays_21(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 468 having cdp id:",Id);
        }
        else if(businessDays == 22)
        {
          nlapiLogExecution("Debug","Step 469 having cdp id:",Id);
          newDate=  forbusinessDays_22(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 470 having cdp id:",Id);
        }
        else if(businessDays == 23)
        {
          nlapiLogExecution("Debug","Step 471 having cdp id:",Id);
          newDate = forbusinessDays_23(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 472 having cdp id:",Id);
        }
        else if(businessDays == 24)
        {
          nlapiLogExecution("Debug","Step 473 having cdp id:",Id);
          newDate=  forbusinessDays_24(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 474 having cdp id:",Id);
        }
        else if(businessDays == 25)
        {
          nlapiLogExecution("Debug","Step 475 having cdp id:",Id);
          newDate= forbusinessDays_25(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 476 having cdp id:",Id);
        }
        break;
      case 0:													
        if(businessDays == 21)
        {
          nlapiLogExecution("Debug","Step 477 having cdp id:",Id);
          newDate = forbusinessDays_21(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 478 having cdp id:",Id);
        }
        else if(businessDays == 22)
        {
          nlapiLogExecution("Debug","Step 479 having cdp id:",Id);
          newDate=  forbusinessDays_22(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 480 having cdp id:",Id);
        }
        else if(businessDays == 23)
        {
          nlapiLogExecution("Debug","Step 481 having cdp id:",Id);
          newDate = forbusinessDays_23(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 482 having cdp id:",Id);
        }
        else if(businessDays == 24)
        {
          nlapiLogExecution("Debug","Step 483 having cdp id:",Id);
          newDate=  forbusinessDays_24(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 484 having cdp id:",Id);
        }
        else if(businessDays == 25)
        {
          nlapiLogExecution("Debug","Step 485 having cdp id:",Id);
          newDate= forbusinessDays_25(businessDays,weekday,currentDate,shipDaysArr,Id);	
          nlapiLogExecution("Debug","Step 486 having cdp id:",Id);
        }
        break;					

    }
  }
  else if(businessDays > 25 && businessDays <= 30)
  {
    switch(day)
    {
      case 1:
        if(businessDays == 26)
        {
          nlapiLogExecution("Debug","Step 487 having cdp id:",Id);
          newDate = forbusinessDays_26(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 488 having cdp id:",Id);
        }
        else if(businessDays == 27)
        {
          nlapiLogExecution("Debug","Step 489 having cdp id:",Id);
          newDate=  forbusinessDays_27(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 490 having cdp id:",Id);
        }
        else if(businessDays == 28)
        {
          nlapiLogExecution("Debug","Step 491 having cdp id:",Id);
          newDate = forbusinessDays_28(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 492 having cdp id:",Id);
        }
        else if(businessDays == 29)
        {
          nlapiLogExecution("Debug","Step 493 having cdp id:",Id);
          newDate=  forbusinessDays_29(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 494 having cdp id:",Id);
        }
        else if(businessDays == 30)
        {
          nlapiLogExecution("Debug","Step 495 having cdp id:",Id);
          newDate= forbusinessDays_30(businessDays,weekday,currentDate,shipDaysArr,Id);	
          nlapiLogExecution("Debug","Step 496 having cdp id:",Id);
        }
        break;
      case 2:													
        if(businessDays == 26)
        {
          nlapiLogExecution("Debug","Step 497 having cdp id:",Id);
          newDate = forbusinessDays_26(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 498 having cdp id:",Id);
        }
        else if(businessDays == 27)
        {
          nlapiLogExecution("Debug","Step 499 having cdp id:",Id);
          newDate=  forbusinessDays_27(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 500 having cdp id:",Id);
        }
        else if(businessDays == 28)
        {
          nlapiLogExecution("Debug","Step 501 having cdp id:",Id);
          newDate = forbusinessDays_28(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 502 having cdp id:",Id);
        }
        else if(businessDays == 29)
        {
          nlapiLogExecution("Debug","Step 503 having cdp id:",Id);
          newDate=  forbusinessDays_29(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 504 having cdp id:",Id);
        }
        else if(businessDays == 30)
        {
          nlapiLogExecution("Debug","Step 505 having cdp id:",Id);
          newDate= forbusinessDays_30(businessDays,weekday,currentDate,shipDaysArr,Id);	
          nlapiLogExecution("Debug","Step 506 having cdp id:",Id);
        }
        break;
      case 3:													
        if(businessDays == 26)
        {
          nlapiLogExecution("Debug","Step 507 having cdp id:",Id);
          newDate = forbusinessDays_26(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 508 having cdp id:",Id);
        }
        else if(businessDays == 27)
        {
          nlapiLogExecution("Debug","Step 509 having cdp id:",Id);
          newDate=  forbusinessDays_27(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 510 having cdp id:",Id);
        }
        else if(businessDays == 28)
        {
          nlapiLogExecution("Debug","Step 511 having cdp id:",Id);
          newDate = forbusinessDays_28(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 512 having cdp id:",Id);
        }
        else if(businessDays == 29)
        {
          nlapiLogExecution("Debug","Step 513 having cdp id:",Id);
          newDate=  forbusinessDays_29(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 514 having cdp id:",Id);
        }
        else if(businessDays == 30)
        {
          nlapiLogExecution("Debug","Step 515 having cdp id:",Id);
          newDate= forbusinessDays_30(businessDays,weekday,currentDate,shipDaysArr,Id);	
          nlapiLogExecution("Debug","Step 516 having cdp id:",Id);
        }
        break;
      case 4:													
        if(businessDays == 26)
        {
          nlapiLogExecution("Debug","Step 517 having cdp id:",Id);
          newDate = forbusinessDays_26(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 518 having cdp id:",Id);
        }
        else if(businessDays == 27)
        {
          nlapiLogExecution("Debug","Step 519 having cdp id:",Id);
          newDate=  forbusinessDays_27(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 520 having cdp id:",Id);
        }
        else if(businessDays == 28)
        {
          nlapiLogExecution("Debug","Step 521 having cdp id:",Id);
          newDate = forbusinessDays_28(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 522 having cdp id:",Id);
        }
        else if(businessDays == 29)
        {
          nlapiLogExecution("Debug","Step 523 having cdp id:",Id);
          newDate=  forbusinessDays_29(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 524 having cdp id:",Id);
        }
        else if(businessDays == 30)
        {
          nlapiLogExecution("Debug","Step 525 having cdp id:",Id);
          newDate= forbusinessDays_30(businessDays,weekday,currentDate,shipDaysArr,Id);	
          nlapiLogExecution("Debug","Step 526 having cdp id:",Id);
        }
        break;
      case 5:													
        if(businessDays == 26)
        {
          nlapiLogExecution("Debug","Step 527 having cdp id:",Id);
          newDate = forbusinessDays_26(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 528 having cdp id:",Id);
        }
        else if(businessDays == 27)
        {
          nlapiLogExecution("Debug","Step 529 having cdp id:",Id);
          newDate=  forbusinessDays_27(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 530 having cdp id:",Id);
        }
        else if(businessDays == 28)
        {
          nlapiLogExecution("Debug","Step 531 having cdp id:",Id);
          newDate = forbusinessDays_28(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 532 having cdp id:",Id);
        }
        else if(businessDays == 29)
        {
          nlapiLogExecution("Debug","Step 533 having cdp id:",Id);
          newDate=  forbusinessDays_29(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 534 having cdp id:",Id);
        }
        else if(businessDays == 30)
        {
          nlapiLogExecution("Debug","Step 535 having cdp id:",Id);
          newDate= forbusinessDays_30(businessDays,weekday,currentDate,shipDaysArr,Id);	
          nlapiLogExecution("Debug","Step 536 having cdp id:",Id);
        }
        break;	
      case 6:
        if(businessDays == 26)
        {
          nlapiLogExecution("Debug","Step 537 having cdp id:",Id);
          newDate = forbusinessDays_26(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 538 having cdp id:",Id);
        }
        else if(businessDays == 27)
        {
          nlapiLogExecution("Debug","Step 539 having cdp id:",Id);
          newDate=  forbusinessDays_27(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 540 having cdp id:",Id);
        }
        else if(businessDays == 28)
        {
          nlapiLogExecution("Debug","Step 541 having cdp id:",Id);
          newDate = forbusinessDays_28(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 542 having cdp id:",Id);
        }
        else if(businessDays == 29)
        {
          nlapiLogExecution("Debug","Step 543 having cdp id:",Id);
          newDate=  forbusinessDays_29(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 544 having cdp id:",Id);
        }
        else if(businessDays == 30)
        {
          nlapiLogExecution("Debug","Step 545 having cdp id:",Id);
          newDate= forbusinessDays_30(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 546 having cdp id:",Id);
        }
        break;
      case 0:
        if(businessDays == 26)
        {
          nlapiLogExecution("Debug","Step 547 having cdp id:",Id);
          newDate = forbusinessDays_26(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 548 having cdp id:",Id);
        }
        else if(businessDays == 27)
        {
          nlapiLogExecution("Debug","Step 549 having cdp id:",Id);
          newDate=  forbusinessDays_27(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 550 having cdp id:",Id);
        }
        else if(businessDays == 28)
        {
          nlapiLogExecution("Debug","Step 551 having cdp id:",Id);
          newDate = forbusinessDays_28(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 552 having cdp id:",Id);
        }
        else if(businessDays == 29)
        {
          nlapiLogExecution("Debug","Step 553 having cdp id:",Id);
          newDate=  forbusinessDays_29(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 554 having cdp id:",Id);
        }
        else if(businessDays == 30)
        {
          nlapiLogExecution("Debug","Step 555 having cdp id:",Id);
          newDate= forbusinessDays_30(businessDays,weekday,currentDate,shipDaysArr,Id);
          nlapiLogExecution("Debug","Step 556 having cdp id:",Id);
        }
        break;
    }
  }
  else if(businessDays == 0 || businessDays == '')
  {
    nlapiLogExecution("Debug","Step 557 having cdp id:",Id);
    newDate = forbusinessDays_Zero_Or_Empty(weekday,currentDate,shipDaysArr,Id);
    nlapiLogExecution("Debug","Step 558 having cdp id:",Id);
  }
  return newDate;
}




