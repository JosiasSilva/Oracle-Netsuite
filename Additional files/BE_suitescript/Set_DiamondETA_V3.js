function SetDiamondETA(type)
{
     try
     {
                var log_type = "debug"; 
                nlapiLogExecution("debug","Event Type is :",type);       
		if(type == "create" || type == "edit" || type == "xedit")
		{
                        var Id = nlapiGetRecordId();
                        var diamondETA = new Date();                        
                        nlapiLogExecution("debug","CDP Id is :",nlapiGetRecordId());

                        var old_diamond_eta = nlapiGetOldRecord().getFieldValue("custrecord_diamond_eta");
			var new_diamond_eta = nlapiGetNewRecord().getFieldValue("custrecord_diamond_eta");
			nlapiLogExecution(log_type,"old diamond eta :",old_diamond_eta);
			nlapiLogExecution(log_type,"new diamond eta :",new_diamond_eta);
                       
                        var cdpArrField = ["custrecord_diamond_eta","custrecord_custom_diamond_request_type","custrecord_diamond_status","custrecord_item_status","custrecord165"];
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
                        var old_itemStatus = nlapiGetOldRecord().getFieldValue("custrecord_item_status");
			var new_itemStatus = nlapiGetNewRecord().getFieldValue("custrecord_item_status");
                        nlapiLogExecution("debug","Old Item Status is :",old_itemStatus);
			nlapiLogExecution("debug","New Item Status is :",new_itemStatus);
						var diamondStockNo = nlapiLookupField("customrecord_custom_diamond",Id,"custrecord_be_diamond_stock_number",true); // added by ajay
						
                        var old_diamondStatus = nlapiGetOldRecord().getFieldValue("custrecord_diamond_status");
			var new_diamondStatus = nlapiGetNewRecord().getFieldValue("custrecord_diamond_status");
			nlapiLogExecution("debug","Old Diamond Status is :",old_diamondStatus);
			nlapiLogExecution("debug","New Diamond Status is :",new_diamondStatus);
                        nlapiLogExecution("debug","Page Diamond Status is :",nlapiGetFieldValue("custrecord_diamond_status"));
			
                       var old_portalReqType = nlapiGetOldRecord().getFieldValue("custrecord165");
			var new_portalReqType = nlapiGetNewRecord().getFieldValue("custrecord165");
			nlapiLogExecution("debug","Old Portal Request Type is :",old_portalReqType);
			nlapiLogExecution("debug","New Portal Request Type is :",new_portalReqType);

                        if(old_diamond_eta == new_diamond_eta || (old_diamond_eta == null && new_diamond_eta == ''))
			{
				//if(diamondStockNo.indexOf("B") == -1) // condition check for diamond stock no
				//{

                        //if(requestType == 1 || requestType == 2 || requestType == 7 || requestType == 8 || requestType == 9 || portalReqType == 3)                        
                        if(new_portalReqType == 3 || new_portalReqType == 4 || portalReqType == 3 || portalReqType == 4)		//New Codition					
			{				
                                //if( (old_diamondStatus != 1 && new_diamondStatus == 1 && (requestType == 1 || requestType == 2 || requestType == 7 || requestType == 8 || requestType == 9)) || (old_itemStatus != 2 && new_itemStatus == 2 && itemStatus == 2  && old_diamondStatus != new_diamondStatus && portalReqType == 3))   // Confirmed	
                                if( (old_diamondStatus != 1 && new_diamondStatus == 1 && (new_portalReqType ==3 || new_portalReqType ==4 || portalReqType == 3 || portalReqType == 4)) || (old_itemStatus != 2 && new_itemStatus == 2 && itemStatus == 2  && old_diamondStatus != new_diamondStatus && (new_portalReqType == 3 || new_portalReqType==4 || portalReqType == 3 || portalReqType == 4)))	//Changed New condition				
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
						hours = parseFloat(hours + mins/60).toFixed(2);

						nlapiLogExecution(log_type,"current date :",currentDate);
						nlapiLogExecution(log_type,"current time :",hours);
						
						var shipDaysArr = new Array();
						var count = 0;
						if(businessDays != '')
						{
							if(deadLine != null)
							{
								var deadLineTime = deadLine.split(' ')[0];
								//var deadLineTimeNo = deadLineTime.split(':')[0];
								var deadLineTimeNo = parseFloat(parseFloat(deadLineTime.split(':')[0])+parseFloat(deadLineTime.split(':')[1]/60)).toFixed(2);
								var deadLineSpecific = deadLine.split(' ')[1];
								if(deadLineSpecific == "pm")
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
											diamondETA = GetDiamondETA(day,businessDays,currentDate);
										}
										else if(count >= 1 && shipDaysArr[0] != 1)
										{
											diamondETA = DiamondETADate(shipDaysArr,day,businessDays,currentDate,count,hours,deadLineTimeNo);							
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
											diamondETA = GetDiamondETA(day,businessDays,currentDate);
                                                                                        var newDay = diamondETA.getDay();
											if(parseFloat(hours) > parseFloat(deadLineTimeNo))
											{
												if(newDay <= 4)
												{
												   diamondETA = nlapiAddDays(diamondETA,1);
												}
												else
												{
												   diamondETA = nlapiAddDays(diamondETA,3);
												}
											}
										}
										else if(count >= 1 && shipDaysArr[0] != 1)
										{
											diamondETA = DiamondETADate(shipDaysArr,day,businessDays,currentDate,count,hours,deadLineTimeNo);							
										}                            
									}

									/*var newDay = diamondETA.getDay();
									if(newDay <= 4)
									{
									   diamondETA = nlapiAddDays(diamondETA,1);
									}
									else
									{
									   diamondETA = nlapiAddDays(diamondETA,3);
									}*/
								}																
								nlapiSubmitField("customrecord_custom_diamond",Id,"custrecord_diamond_eta",nlapiDateToString(diamondETA));								
								nlapiLogExecution(log_type,"Diamond ETA Field has been set with calculated data.", nlapiDateToString(diamondETA));                                                        						
							}
						}
						else 
						{
							nlapiLogExecution(log_type,"Dia ETA BusinessDays Field on Vendor page is an empty.");
						}								
					}
				}                                
			} // End Request Type
				//}//End diamond stock no condition
                    } // End diamond_Eta condition
		    else
		    {
                         if(type != "xedit")
                         {
		              nlapiSubmitField(nlapiGetRecordType(),Id,"custrecord_diamond_eta",new_diamond_eta);
                              nlapiLogExecution(log_type,"Diamond ETA Field has been updated with manual data.", new_diamond_eta);
                         }
		    }
		}// End Event Type
     }
     catch(err)
     {
          nlapiLogExecution("debug","Error Occur during inline edit CDP is : ",err.message);
     }
}


function DiamondETADate(shipDaysArr,day,businessDays,currentDate,count,hours,deadLineTimeNo)
{
    var diamondETA = new Date();
	var newDay = 0; var diffDay = 0;
    if(count == 5) // for all condition
	{
	    diamondETA = GetDiamondETA(day,businessDays,currentDate);
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
                	newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();			
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day));						
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo))
				{
                	newDay = shipDaysArr[1]-1;			
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day));											
				}
			}
			else if(day < shipDaysArr[0]-1)
			{
                newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();			
				diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day));	
			}
			else if(shipDaysArr[0]-1 < day && day <= shipDaysArr[1]-1)
			{
				if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[1]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[1]-1))
				{
                	newDay = nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day).getDay();			
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day));						
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[1]-1)
				{
					newDay = shipDaysArr[0]-1;
					diffDay = 7 - (shipDaysArr[1] - shipDaysArr[0]);					
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,diffDay));	
				}
			}
			else if(shipDaysArr[1]-1 < day)
			{
                newDay = nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day).getDay();			
				diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day));	
			}									
		}
		else if(count == 3)
		{
			if(day == shipDaysArr[0]-1)
			{
				if(parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day == shipDaysArr[0]-1)
				{
                	newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();			
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day));						
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[0]-1)
				{
                	newDay = shipDaysArr[1]-1;			
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day));				
				}
			}
			else if(day < shipDaysArr[0]-1)
			{
                newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();			
				diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day));	
			}
			else if(shipDaysArr[0]-1 < day && day <= shipDaysArr[1]-1)
			{
				if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[1]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[1]-1))
				{
					newDay = nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day).getDay();			
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day));	
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[1]-1)
				{
					newDay = shipDaysArr[2]-1;
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day));	
				}
			}
			else if(shipDaysArr[1]-1 < day && day <= shipDaysArr[2]-1)
			{
				if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[2]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[2]-1))
				{
					newDay = nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day).getDay();			
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day));	
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[2]-1)
				{
					newDay = shipDaysArr[0]-1;
					diffDay = 7 - (shipDaysArr[2] - shipDaysArr[0]);										
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,diffDay));	
				}				
			}									
			else if(shipDaysArr[2]-1 < day)
			{
                newDay = nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day).getDay();			
				diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day));	
			}
		}
		else if(count == 4)
		{
			if(day == shipDaysArr[0]-1)
			{
				if(parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day == shipDaysArr[0]-1)
				{
                	newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();			
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day));						
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[0]-1)
				{
                	newDay = shipDaysArr[1]-1;			
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day));				
				}				
			}
			else if(day < shipDaysArr[0]-1)
			{
                newDay = nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day).getDay();			
				diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[0]-1)-day));	
			}
			else if(shipDaysArr[0]-1 < day && day <= shipDaysArr[1]-1)
			{
				if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[1]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[1]-1))
				{
					newDay = nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day).getDay();			
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[1]-1)-day));	
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[1]-1)
				{
					newDay = shipDaysArr[2]-1;
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day));	
				}				
			}
			else if(shipDaysArr[1]-1 < day && day <= shipDaysArr[2]-1)
			{
				if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[2]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[2]-1))
				{
					newDay = nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day).getDay();			
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[2]-1)-day));	
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[2]-1)
				{
					newDay = shipDaysArr[3]-1;					
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[3]-1)-day));
				}				
			}
			else if(shipDaysArr[2]-1 < day && day <= shipDaysArr[3]-1)									
			{
				if((parseFloat(hours) <= parseFloat(deadLineTimeNo)  && day <= shipDaysArr[3]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[3]-1))
				{
					newDay = nlapiAddDays(currentDate,(shipDaysArr[3]-1)-day).getDay();			
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,(shipDaysArr[3]-1)-day));	
				}
				else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[3]-1)
				{
					newDay = shipDaysArr[0]-1;
					diffDay = 7 - (shipDaysArr[3] - shipDaysArr[0]);										
					diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,diffDay));	
				}				
			}
			else if(shipDaysArr[3]-1 < day)
			{
                newDay = nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day).getDay();			
				diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,((shipDaysArr[0]-1)+7)-day));	
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
                		newDay = nlapiAddDays(currentDate,1-day).getDay();				
						diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,1-day));
					}
					else if(parseFloat(hours) > parseFloat(deadLineTimeNo))
					{
                		newDay = nlapiAddDays(currentDate,8-day).getDay();				
						diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,8-day));
					}					
				}
				else if(day > (shipDaysArr[0]-1))
				{
                    newDay = nlapiAddDays(currentDate,8-day).getDay();				
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,8-day));
				}
				break;
			case 2:
				if(day <= (shipDaysArr[0]-1))
				{                    
					if((parseFloat(hours) <= parseFloat(deadLineTimeNo) && day <= shipDaysArr[0]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[0]-1))
					{
                		newDay = nlapiAddDays(currentDate,2-day).getDay();				
						diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,2-day));
					}
					else if(parseFloat(hours) > parseFloat(deadLineTimeNo) && day == shipDaysArr[0]-1)
					{
                    	newDay = nlapiAddDays(currentDate,9-day).getDay();				
				    	diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,9-day));
					}										
				}
				else if(day > (shipDaysArr[0]-1))
				{
                    newDay = nlapiAddDays(currentDate,9-day).getDay();				
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,9-day));
				}
				break;
			case 3:
				if(day <= (shipDaysArr[0]-1))
				{
					if((parseFloat(hours) <= parseFloat(deadLineTimeNo) && day <= shipDaysArr[0]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[0]-1))
					{
                		newDay = nlapiAddDays(currentDate,3-day).getDay();				
						diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,3-day));
					}
					else if(parseFloat(hours) > parseFloat(deadLineTimeNo)  && day == shipDaysArr[0]-1)
					{
                    	newDay = nlapiAddDays(currentDate,10-day).getDay();				
				    	diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,10-day));
					}					
				}
				else if(day > (shipDaysArr[0]-1))
				{
                    newDay = nlapiAddDays(currentDate,10-day).getDay();				
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,10-day));
				}
				break;
			case 4:
				if(day <= (shipDaysArr[0]-1))
				{
					if((parseFloat(hours) <= parseFloat(deadLineTimeNo) && day <= shipDaysArr[0]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[0]-1))
					{
                		newDay = nlapiAddDays(currentDate,4-day).getDay();				
						diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,4-day));
					}
					else if(parseFloat(hours) > parseFloat(deadLineTimeNo)  && day == shipDaysArr[0]-1)
					{
                    	newDay = nlapiAddDays(currentDate,11-day).getDay();				
				    	diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,11-day));
					}					
				}
				else if(day > (shipDaysArr[0]-1))
				{
                    newDay = nlapiAddDays(currentDate,11-day).getDay();				
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,11-day));
				}
				break;
			case 5:
				if(day <= (shipDaysArr[0]-1))
				{				
					if((parseFloat(hours) <= parseFloat(deadLineTimeNo) && day <= shipDaysArr[0]-1) || (parseFloat(hours) > parseFloat(deadLineTimeNo) && day < shipDaysArr[0]-1))
					{
                		newDay = nlapiAddDays(currentDate,5-day).getDay();								
						diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,5-day));
					}
					else if(parseFloat(hours) > parseFloat(deadLineTimeNo)  && day == shipDaysArr[0]-1)
					{
                    	newDay = nlapiAddDays(currentDate,12-day).getDay();				
				    	diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,12-day));
					}					
				}
				else if(day > (shipDaysArr[0]-1))
				{
                    newDay = nlapiAddDays(currentDate,12-day).getDay();				
				    diamondETA = GetDiamondETA(newDay,businessDays,nlapiAddDays(currentDate,12-day));
				}
				break;
			default:
				break;
		}                                								
	}
	return diamondETA;
}			
			
			
function GetDiamondETA(day,businessDays,currentDate)
{
    var newDate = new Date();
    if(businessDays > 0 && businessDays <= 5)
	{
		switch(day)
		{
			case 1:
					newDate = nlapiAddDays(currentDate,(businessDays-1));
					break;
			case 2:													
					if(businessDays == 5)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1));
					}
					break;
			case 3:													
					if(businessDays == 4 || businessDays == 5)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1));
					}
					break;
			case 4:													
					if(businessDays == 3 || businessDays == 4 || businessDays == 5)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1));
					}
					break;
			case 5:													
					if(businessDays == 2 || businessDays == 3 || businessDays == 4 || businessDays == 5)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1));
					}
					break;
            case 6:													
					if(businessDays <= 5)
					{
						newDate = nlapiAddDays(currentDate,businessDays+1);
					}					
					break;
            case 0:													
					if(businessDays <= 5)
					{
						newDate = nlapiAddDays(currentDate,businessDays);
					}					
					break;					
			default:
				newDate = nlapiAddDays(currentDate,(businessDays-1));
				break;
		}
	}
	else if(businessDays > 5 && businessDays <= 10)
	{
		switch(day)
		{
			case 1:
					newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					break;
			case 2:													
					if(businessDays == 10)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					break;
			case 3:													
					if(businessDays == 9 || businessDays == 10)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					break;
			case 4:													
					if(businessDays == 8 || businessDays == 9 || businessDays == 10)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					break;
			case 5:													
					if(businessDays == 7 || businessDays == 8 || businessDays == 9 || businessDays == 10)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
					}
					break;
            case 6:													
					if(businessDays <= 10)
					{
						newDate = nlapiAddDays(currentDate,(businessDays+1)+2);
					}					
					break;
            case 0:													
					if(businessDays <= 10)
					{
						newDate = nlapiAddDays(currentDate,businessDays+2);
					}					
					break;					
			default:
				newDate = nlapiAddDays(currentDate,(businessDays-1) + 2);
				break;
		}
	}
	else if(businessDays > 10 && businessDays <= 15)
	{
		switch(day)
		{
			case 1:
					newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					break;
			case 2:													
					if(businessDays == 15)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					break;
			case 3:													
					if(businessDays == 14 || businessDays == 15)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					break;
			case 4:													
					if(businessDays == 13 || businessDays == 14 || businessDays == 15)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					break;
			case 5:													
					if(businessDays == 12 || businessDays == 13 || businessDays == 14 || businessDays == 15)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
					}
					break;
            case 6:													
					if(businessDays <= 15)
					{
						newDate = nlapiAddDays(currentDate,(businessDays+1)+4);
					}					
					break;
            case 0:													
					if(businessDays <= 15)
					{
						newDate = nlapiAddDays(currentDate,businessDays+4);
					}					
					break;					
			default:
				newDate = nlapiAddDays(currentDate,(businessDays-1) + 4);
				break;
		}
	}
	else if(businessDays > 15 && businessDays <= 20)
	{
		switch(day)
		{
			case 1:
					newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					break;
			case 2:													
					if(businessDays == 20)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					break;
			case 3:													
					if(businessDays == 19 || businessDays == 20)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					break;
			case 4:													
					if(businessDays == 18 || businessDays == 19 || businessDays == 20)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					break;
			case 5:													
					if(businessDays == 17 || businessDays == 18 || businessDays == 19 || businessDays == 20)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
					}
					break;
            case 6:													
					if(businessDays <= 20)
					{
						newDate = nlapiAddDays(currentDate,(businessDays+1)+6);
					}					
					break;
            case 0:													
					if(businessDays <= 20)
					{
						newDate = nlapiAddDays(currentDate,businessDays+6);
					}					
					break;					
			default:
				newDate = nlapiAddDays(currentDate,(businessDays-1) + 6);
				break;
		}
	}
	else if(businessDays > 20 && businessDays <= 25)
	{
		switch(day)
		{
			case 1:
					newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					break;
			case 2:													
					if(businessDays == 25)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					break;
			case 3:													
					if(businessDays == 24 || businessDays == 25)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					break;
			case 4:													
					if(businessDays == 23 || businessDays == 24 || businessDays == 25)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					break;
			case 5:													
					if(businessDays == 22 || businessDays == 23 || businessDays == 24 || businessDays == 25)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
					}
					break;
            case 6:													
					if(businessDays <= 25)
					{
						newDate = nlapiAddDays(currentDate,(businessDays+1) + 8);
					}					
					break;
            case 0:													
					if(businessDays <= 25)
					{
						newDate = nlapiAddDays(currentDate,businessDays + 8);
					}					
					break;					
			default:
				newDate = nlapiAddDays(currentDate,(businessDays-1) + 8);
				break;
		}
	}
	else if(businessDays > 25 && businessDays <= 30)
	{
		switch(day)
		{
			case 1:
					newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					break;
			case 2:													
					if(businessDays == 30)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 12);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					break;
			case 3:													
					if(businessDays == 29 || businessDays == 30)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 12);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					break;
			case 4:													
					if(businessDays == 28 || businessDays == 29 || businessDays == 30)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 12);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					break;
			case 5:													
					if(businessDays == 27 || businessDays == 28 || businessDays == 29 || businessDays == 30)
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 12);
					}
					else
					{
						newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
					}
					break;	
                       case 6:													
					if(businessDays <= 30)
					{
						newDate = nlapiAddDays(currentDate,(businessDays+1) + 10);
					}					
					break;
                       case 0:													
					if(businessDays <= 30)
					{
						newDate = nlapiAddDays(currentDate,businessDays + 10);
					}					
					break;					
			default:
				newDate = nlapiAddDays(currentDate,(businessDays-1) + 10);
				break;
		}
	}
	else if(businessDays == 0 || businessDays == '')	
	{
	   newDate = nlapiAddDays(currentDate,0);
	}
	return newDate;
}



