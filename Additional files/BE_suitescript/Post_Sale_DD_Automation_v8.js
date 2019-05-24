nlapiLogExecution("audit","FLOStart",new Date().getTime());
//Saved Search - /app/common/search/searchresults.nl?searchid=6250&whence=
//Saved Search - /app/common/search/searchresults.nl?searchid=6251&whence=
function Post_Sale_DD_Automation(type)
{
	nlapiLogExecution("debug","Type: " + type);
	
	if(type=="create" || type=="specialorder")
	{
		try
		{
			var poRec = nlapiGetNewRecord();
			var soID = poRec.getFieldValue("createdfrom");
			var pickup_location=poRec.getFieldText("custbody_pickup_location");
			var isExchange = false;
			var isResize = false;
			
			if(soID!=null && soID!="")
			{
				//Check type of order
				var orderType = nlapiLookupField("salesorder",soID,"custbody87");
				nlapiLogExecution("debug","Sales Order Type",orderType);
				
				if(orderType.indexOf(",")!=-1)
				{
					var orderTypes = orderType.split(",");
					var postSale = false;
					for(var x=0; x < orderTypes.length; x++)
					{
						if(orderType=="2" || orderType=="3" || orderType=="4" || orderType=="8")
						{
							postSale = true;
							if(orderType=="4")
								isExchange = true;
								
							if(orderType=="2")
								isResize = true;
							
							break;
						}
					}
					
					if(postSale==false)
					{
						nlapiLogExecution("debug","Not a post sale SO. Script will now exit.");
						return true;
					}
				}
				else
				{
					if(orderType!="2" && orderType!="3" && orderType!="4" && orderType!="8")
					{
						nlapiLogExecution("debug","Not a post sale SO. Script will now exit.");
						return true;
					}
					else if(orderType=="2")
					{
						isResize = true;
						postSale = true;
					}
					else if(orderType=="4")
					{
						isExchange = true;
						postSale = true;
					}
					else
					{
						postSale = true;
					}
				}
				
				var now = new Date();
				var hours = now.getHours();
				var dayOfWeek = now.getDay();
				
				if(hours < 14)
				{
					//Sales order created before 2:00PM
					
					//Ship Date = 4 Business Days from Today
					var shipDateAdd = 0;
					switch(dayOfWeek)
					{
						case 0:
						case 1:
							shipDateAdd = 4;
							break;
						case 2:
						case 3:
						case 4:
						case 5:
							shipDateAdd = 6;
							break;
						case 6:
							shipDateAdd = 5;
							break;
					}
					
					var shipDate = nlapiAddDays(now,shipDateAdd);
					shipDate = nlapiDateToString(shipDate,"date");
					
					//Date Needed in SF = 5 Business Days from Today
					var dateNeededInSFAdd = 0;
					switch(dayOfWeek)
					{
						case 0:
							dateNeededInSFAdd = 5;
							break;
						case 1:
						case 2:
						case 3:
						case 4:
						case 5:
							dateNeededInSFAdd = 7;
							break;
						case 6:
							dateNeededInSFAdd = 6;
							break;
					}
					
					var dateNeededInSF = nlapiAddDays(now,dateNeededInSFAdd);
					dateNeededInSF = nlapiDateToString(dateNeededInSF,"date");
					
					//Delivery Date = 10 Business Days from Today
					var deliveryDateAdd = 0;
					switch(dayOfWeek)
					{
						case 0:
							deliveryDateAdd = 12;
							break;
						case 1:
						case 2:
						case 3:
						case 4:
						case 5:
							deliveryDateAdd = 14;
							break;
						case 6:
							deliveryDateAdd = 13;
							break;
					}
					
					var deliveryDate = nlapiAddDays(now,deliveryDateAdd);
					deliveryDate = nlapiDateToString(deliveryDate,"date");
					nlapiLogExecution("debug","Existing DEl Date2",deliveryDate);
					// Added By Rahul Panchal on dated 04/05/2017 as per NS-699
					//var searchResult1=nlapiSearchRecord(null,'customsearch_post_sale_dd_holiday_check',new nlobjSearchFilter('custrecord_holiday_date',null,'on',deliveryDate)); // For Sandbox
					var searchResult1=nlapiSearchRecord(null,'customsearch_post_sale_dd_holiday_check',new nlobjSearchFilter('custrecord_holiday_date',null,'on',deliveryDate)); // For Live
					if(searchResult1)
					{
                      nlapiLogExecution("debug","Holiday is");
						deliveryDate=nlapiStringToDate(deliveryDate,"date"); 
						deliveryDate=nlapiAddDays(deliveryDate,1);
						 var day = deliveryDate.getDay();
						 if(day==0)
						 {
							 deliveryDate = nlapiAddDays(deliveryDate,1);
						 }
						 else if(day==6)
						 {
							deliveryDate = nlapiAddDays(deliveryDate,2); 
						 }
						 else
						 {
							deliveryDate=deliveryDate; 
						 }
					}
					else
					{
						deliveryDate=nlapiStringToDate(deliveryDate,"date"); 
						var day = deliveryDate.getDay();
						if(day==0)
						 {
							 deliveryDate = nlapiAddDays(deliveryDate,1);
						 }
						 else if(day==6)
						 {
							deliveryDate = nlapiAddDays(deliveryDate,2); 
						 }
						 else
						 {
							 deliveryDate=deliveryDate;
						 }
					}
					deliveryDate = nlapiDateToString(deliveryDate,"date");
					nlapiLogExecution("debug","Test 299 DD",deliveryDate);
					if(pickup_location!='' && pickup_location !=null)
					{
						//var searchLocation=nlapiSearchRecord(null,5840,new nlobjSearchFilter('name', null, 'is', pickup_location)); // For Sandbox
						var searchLocation=nlapiSearchRecord(null,6250,new nlobjSearchFilter('name', null, 'is', pickup_location)); // For Live
						nlapiLogExecution("debug","Test loc DD",searchLocation.length);
						if(searchLocation)
						{
							//var days_of_operation=searchLocation[0].getValue('custrecord231');//For sandBox
							var days_of_operation=searchLocation[0].getValue('custrecord_days_of_operation');//For Live
							nlapiLogExecution("debug","Test 211 DOO",days_of_operation);
							if(days_of_operation !='' && days_of_operation != null)
							{
								deliveryDate=nlapiStringToDate(deliveryDate,"date"); 
								nlapiLogExecution("debug","Test 288 DD",deliveryDate);
								var day = deliveryDate.getDay();
								day=day+1;
									nlapiLogExecution("debug","Test 288 day",day);
								if(days_of_operation.indexOf(day)!=-1)
								{
									if(day==7)
									{
										deliveryDate = nlapiAddDays(deliveryDate,2);
										deliveryDate = nlapiDateToString(deliveryDate,"date");
									}
									else if(day==1)
									{
										deliveryDate = nlapiAddDays(deliveryDate,1);
										deliveryDate = nlapiDateToString(deliveryDate,"date");
									}
									else
									{
										deliveryDate = nlapiDateToString(deliveryDate,"date");
									}									
								}
								else
								{									
									if(day==2)
									{
										nlapiLogExecution("debug","Test 277 DD",deliveryDate);
										if(days_of_operation.indexOf(3)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,1);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(4)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,2);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(5)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,3);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(6)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,4);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(7)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,7);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(1)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,7);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
									}
									else if(day==3)
									{
										nlapiLogExecution("debug","Test 266 DD",deliveryDate);
										if(days_of_operation.indexOf(4)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,1);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(5)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,2);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(6)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,3);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(7)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,6);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(1)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,6);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(2)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,6);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
									}
									else if(day==4)
									{
										nlapiLogExecution("debug","Test 255 DD",deliveryDate);
										if(days_of_operation.indexOf(5)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,1);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(6)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,2);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(7)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,5);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(1)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,5);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(2)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,5);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(3)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,6);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
									}
									else if(day==5)
									{
										nlapiLogExecution("debug","Test 244 DD",deliveryDate);
										if(days_of_operation.indexOf(6)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,1);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(7)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,4);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(1)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,4);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(2)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,4);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(3)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,5);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(4)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,6);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
									}
									else if(day==6)
									{
										nlapiLogExecution("debug","Test 233 DD",deliveryDate);
										if(days_of_operation.indexOf(7)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,3);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(1)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,3);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(2)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,3);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(3)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,4);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(4)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,5);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(5)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,6);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
									}								
								}
							}
						}
						nlapiLogExecution("debug","Test 2222 DD",deliveryDate);
					}					
					else
					{
						deliveryDate = deliveryDate;
					}
					//nlapiLogExecution("debug","Deliver Date is",deliveryDate);					
					// Ended By Rahul Panchal
					
					//Update Delivery Date and Date Needed In SF fields on Purchase Order
					if(isExchange==true)
					{
						if(poRec.getFieldValue("custbody82")=="T")
							nlapiSubmitField("purchaseorder",nlapiGetRecordId(),["custbody6","custbody_linked_to_post_sale_order","custbody_exchange_po"],[deliveryDate,"T","T"]);
						else
							nlapiSubmitField("purchaseorder",nlapiGetRecordId(),["custbody6","custbody_linked_to_post_sale_order","custbody_exchange_po"],[deliveryDate,"T","T"]);
					}
					else
					{
						if(poRec.getFieldValue("custbody82")=="T")
							nlapiSubmitField("purchaseorder",nlapiGetRecordId(),["custbody6","custbody_po_ship_date","custbody_linked_to_post_sale_order","custbody59"],[deliveryDate,shipDate,"T",dateNeededInSF]);
						else
							nlapiSubmitField("purchaseorder",nlapiGetRecordId(),["custbody6","custbody_po_ship_date","custbody_linked_to_post_sale_order","custbody59"],[deliveryDate,shipDate,"T",dateNeededInSF]);
					}	
					
					//Update Delivery Date and PO Date on Sales Order (DO NOT UPDATE DD IF MARKED 'FIRM' ON SALES ORDER)
					if(nlapiLookupField("salesorder",soID,"custbody82")=="T")
					{
						if(isResize==true)
							nlapiSubmitField("salesorder",soID,["custbody6","custbody_po_creation_date_time","custbody142"],[deliveryDate,nlapiDateToString(now,"datetimetz"),"10"]);
						else
							nlapiSubmitField("salesorder",soID,["custbody6","custbody_po_creation_date_time"],[deliveryDate,nlapiDateToString(now,"datetimetz")]);
					}
					else
					{
						if(isResize==true)
							nlapiSubmitField("salesorder",soID,["custbody6","custbody_po_creation_date_time","custbody142"],[deliveryDate,nlapiDateToString(now,"datetimetz"),"10"]);
						else
							nlapiSubmitField("salesorder",soID,["custbody6","custbody_po_creation_date_time"],[deliveryDate,nlapiDateToString(now,"datetimetz")]);
					}
					
					//Update Delivery Date on other PO's linked to Sales Order
					var filters = [];
					filters.push(new nlobjSearchFilter("internalid",null,"noneof",nlapiGetRecordId()));
					filters.push(new nlobjSearchFilter("createdfrom",null,"is",soID));
					filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
					var results = nlapiSearchRecord("purchaseorder",null,filters);
					if(results)
					{
						for(var x=0; x < results.length; x++)
							nlapiSubmitField("purchaseorder",results[x].getId(),"custbody6",deliveryDate);
					}
				}
				else
				{
					//Sales order created after 2:00PM
					
					//Ship Date = 5 Business Days from Today
					var shipDateAdd = 0;
					switch(dayOfWeek)
					{
						case 0:
							shipDateAdd = 5;
							break;
						case 1:
						case 2:
						case 3:
						case 4:
						case 5:
							shipDateAdd = 7;
							break;
						case 6:
							shipDateAdd = 6;
							break;
					}
					
					var shipDate = nlapiAddDays(now,shipDateAdd);
					shipDate = nlapiDateToString(shipDate,"date");
					
					//Date Needed in SF = 6 Business Days from Today
					var dateNeededInSFAdd = 0;
					switch(dayOfWeek)
					{
						case 0:
						case 1:
						case 2:
						case 3:
						case 4:
							dateNeededInSFAdd = 8;
							break;
						case 5:
							dateNeededInSFAdd = 10;
							break;
						case 6:
							dateNeededInSFAdd = 9;
							break;
					}
					
					var dateNeededInSF = nlapiAddDays(now,dateNeededInSFAdd);
					dateNeededInSF = nlapiDateToString(dateNeededInSF,"date");
					
					//Delivery Date = 11 Business Days from Today
					var deliveryDateAdd = 0;
					switch(dayOfWeek)
					{
						case 0:
						case 1:
						case 2:
						case 3:
						case 4:
							deliveryDateAdd = 15;
							break;
						case 5:
							deliveryDateAdd = 17;
							break;
						case 6:
							deliveryDateAdd = 16;
							break;
					}
					
					var deliveryDate = nlapiAddDays(now,deliveryDateAdd);
					deliveryDate = nlapiDateToString(deliveryDate,"date");
					nlapiLogExecution("debug","Existing DEl Date2",deliveryDate);
					// Added By Rahul Panchal on dated 04/05/2017 as per NS-699
					//var searchResult1=nlapiSearchRecord(null,'customsearch_post_sale_dd_holiday_check',new nlobjSearchFilter('custrecord_holiday_date',null,'on',deliveryDate));// For Sandbox
					var searchResult1=nlapiSearchRecord(null,'customsearch_post_sale_dd_holiday_check',new nlobjSearchFilter('custrecord_holiday_date',null,'on',deliveryDate));// For Live
					if(searchResult1)
					{
						deliveryDate=nlapiStringToDate(deliveryDate,"date"); 
						nlapiLogExecution("debug","Test else1 DD",deliveryDate);
						deliveryDate=nlapiAddDays(deliveryDate,1);
						 var day = deliveryDate.getDay();
						 if(day==0)
						 {
							 deliveryDate = nlapiAddDays(deliveryDate,1);
						 }
						 else if(day==6)
						 {
							deliveryDate = nlapiAddDays(deliveryDate,2); 
						 }
						 else
						 {
							deliveryDate=deliveryDate; 
						 }
					}
					else
					{
						deliveryDate=nlapiStringToDate(deliveryDate,"date");
						nlapiLogExecution("debug","Test else2 DD",deliveryDate);						
						var day = deliveryDate.getDay();
						if(day==0)
						 {
							 deliveryDate = nlapiAddDays(deliveryDate,1);
						 }
						 else if(day==6)
						 {
							deliveryDate = nlapiAddDays(deliveryDate,2); 
						 }
						 else
						 {
							 deliveryDate=deliveryDate;
						 }
					}
					deliveryDate = nlapiDateToString(deliveryDate,"date");
					nlapiLogExecution("debug","Test else3 DD",deliveryDate);
					if(pickup_location!='' && pickup_location!=null)
					{
						//var searchLocation=nlapiSearchRecord(null,5840,new nlobjSearchFilter('name', null, 'is', pickup_location)); // For Sandbox
						var searchLocation=nlapiSearchRecord(null,6250,new nlobjSearchFilter('name', null, 'is', pickup_location)); // For Live
						if(searchLocation)
						{
							nlapiLogExecution("debug","loc else4",searchLocation.length);
							//var days_of_operation=searchLocation[0].getValue('custrecord231');//For sandBox							
							var days_of_operation=searchLocation[0].getValue('custrecord_days_of_operation');//For Live
							nlapiLogExecution("debug","loc else5",days_of_operation);
							if(days_of_operation!='' && days_of_operation!=null)
							{
								deliveryDate=nlapiStringToDate(deliveryDate,"date");
									nlapiLogExecution("debug","Test else6 DD",deliveryDate);
								var day = deliveryDate.getDay();
								day=day+1;
									nlapiLogExecution("debug","Test else7 day",day);
								if(days_of_operation.indexOf(day)!=-1)
								{
									if(day==7)
									{
										deliveryDate = nlapiAddDays(deliveryDate,2);
										deliveryDate = nlapiDateToString(deliveryDate,"date");
									}
									else if(day==1)
									{
										deliveryDate = nlapiAddDays(deliveryDate,1);
										deliveryDate = nlapiDateToString(deliveryDate,"date");
									}
									else
									{
										deliveryDate = nlapiDateToString(deliveryDate,"date");
									}									
								}
								else
								{
									if(day==2)
									{
										nlapiLogExecution("debug","Test else8 DD",deliveryDate);
										if(days_of_operation.indexOf(3)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,1);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(4)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,2);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(5)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,3);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(6)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,4);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(7)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,7);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(1)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,7);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
									}
									else if(day==3)
									{
										nlapiLogExecution("debug","Test else9 DD",deliveryDate);
										if(days_of_operation.indexOf(4)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,1);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(5)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,2);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(6)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,3);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(7)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,6);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(1)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,6);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(2)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,6);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
									}
									else if(day==4)
									{
										nlapiLogExecution("debug","Test else10 DD",deliveryDate);
										if(days_of_operation.indexOf(5)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,1);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(6)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,2);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(7)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,5);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(1)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,5);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(2)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,5);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(3)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,6);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
									}
									else if(day==5)
									{
										nlapiLogExecution("debug","Test else11 DD",deliveryDate);
										if(days_of_operation.indexOf(6)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,1);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(7)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,4);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(1)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,4);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(2)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,4);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(3)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,5);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(4)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,6);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
									}
									else if(day==6)
									{
										nlapiLogExecution("debug","Test else12 DD",deliveryDate);
										if(days_of_operation.indexOf(7)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,3);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(1)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,3);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(2)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,3);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(3)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,4);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(4)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,5);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
										else if(days_of_operation.indexOf(5)!=-1)
										{
											deliveryDate = nlapiAddDays(deliveryDate,6);
											deliveryDate = nlapiDateToString(deliveryDate,"date");
										}
									}								
								}
							}
						}
                      nlapiLogExecution("debug","Test else514 DD",deliveryDate);
					}					
					else
					{
						deliveryDate =deliveryDate;
						//nlapiLogExecution("debug","Test 8 DD",deliveryDate);
					}
					//nlapiLogExecution("debug","Deliver Date is",deliveryDate);					
					// Ended By Rahul Panchal
					nlapiLogExecution("debug","Test else1000 DD",isExchange);
					
					//Update Delivery Date and Date Needed In SF fields on Purchase Order
					if(isExchange==true)
					{
						if(poRec.getFieldValue("custbody82")=="T")
							nlapiSubmitField("purchaseorder",nlapiGetRecordId(),["custbody6","custbody_linked_to_post_sale_order","custbody_exchange_po"],[deliveryDate,"T","T"]);	
						else
							nlapiSubmitField("purchaseorder",nlapiGetRecordId(),["custbody6","custbody_linked_to_post_sale_order","custbody_exchange_po"],[deliveryDate,"T","T"]);
					}
					else
					{
						if(poRec.getFieldValue("custbody82")=="T")
							nlapiSubmitField("purchaseorder",nlapiGetRecordId(),["custbody6","custbody_po_ship_date","custbody_linked_to_post_sale_order","custbody59"],[deliveryDate,shipDate,"T",dateNeededInSF]);
						else
							nlapiSubmitField("purchaseorder",nlapiGetRecordId(),["custbody6","custbody_po_ship_date","custbody_linked_to_post_sale_order","custbody59"],[deliveryDate,shipDate,"T",dateNeededInSF]);
					}
					
					//Update Delivery Date and PO Date on Sales Order
					if(nlapiLookupField("salesorder",soID,"custbody82")=="T")
					{
						if(isResize==true)
							nlapiSubmitField("salesorder",soID,["custbody6","custbody_po_creation_date_time","custbody142"],[deliveryDate,nlapiDateToString(now,"datetimetz"),"10"]);
						else
							nlapiSubmitField("salesorder",soID,["custbody6","custbody_po_creation_date_time"],[deliveryDate,nlapiDateToString(now,"datetimetz")]);
					}
					else
					{
						if(isResize==true)
							nlapiSubmitField("salesorder",soID,["custbody6","custbody_po_creation_date_time","custbody142"],[deliveryDate,nlapiDateToString(now,"datetimetz"),"10"]);
						else
							nlapiSubmitField("salesorder",soID,["custbody6","custbody_po_creation_date_time"],[deliveryDate,nlapiDateToString(now,"datetimetz")]);
					}
					
					//Update Delivery Date on other PO's linked to Sales Order
					var filters = [];
					filters.push(new nlobjSearchFilter("internalid",null,"noneof",nlapiGetRecordId()));
					filters.push(new nlobjSearchFilter("createdfrom",null,"is",soID));
					filters.push(new nlobjSearchFilter("mainline",null,"is","T"));
					var results = nlapiSearchRecord("purchaseorder",null,filters);
					if(results)
					{
						for(var x=0; x < results.length; x++)
							nlapiSubmitField("purchaseorder",results[x].getId(),"custbody6",deliveryDate);
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Post Order DD Values","Details: " + err.message);
		}
	}
}
