function Post_Sale_DD_Automation(type)
{
	if(type=="create" || type=="specialorder")
	{
		try
		{
			var poRec = nlapiGetNewRecord();
			var soID = poRec.getFieldValue("createdfrom");
			
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
						if(orderType=="2" || orderType=="3" || orderType=="8")
						{
							postSale = true;
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
					if(orderType!="2" && orderType!="3" && orderType!="8")
					{
						nlapiLogExecution("debug","Not a post sale SO. Script will now exit.");
						return true;
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
					
					//Update Delivery Date and Date Needed In SF fields on Purchase Order
					nlapiSubmitField("purchaseorder",nlapiGetRecordId(),["custbody6","custbody_po_ship_date","custbody_linked_to_post_sale_order","custbody59"],[deliveryDate,shipDate,"T",dateNeededInSF]);
					
					//Update Delivery Date and PO Date on Sales Order
					nlapiSubmitField("salesorder",soID,["custbody6","custbody_po_creation_date_time"],[deliveryDate,nlapiDateToString(now,"datetimetz")]);
					
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
					
					//Update Delivery Date and Date Needed In SF fields on Purchase Order
					nlapiSubmitField("purchaseorder",nlapiGetRecordId(),["custbody6","custbody_po_ship_date","custbody_linked_to_post_sale_order","custbody59"],[deliveryDate,shipDate,"T",dateNeededInSF]);
					
					//Update Delivery Date and PO Date on Sales Order
					nlapiSubmitField("salesorder",soID,["custbody6","custbody_po_creation_date_time"],[deliveryDate,nlapiDateToString(now,"datetimetz")]);
					
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
	else if(type=="edit")
	{
		try
		{
			var poRec = nlapiGetNewRecord();
			var soID = poRec.getFieldValue("createdfrom");
			
			if(soID!=null && soID!="")
			{
				var shipDate = poRec.getFieldValue("custbody_po_ship_date");
				var oldShipDate = nlapiGetOldRecord().getFieldValue("custbody_po_ship_date");
				
				var dateNeededInSF = poRec.getFieldValue("custbody59");
				var olddateNeededInSF = nlapiGetOldRecord().getFieldValue("custbody59");
				
				nlapiLogExecution("debug","New Ship Date",shipDate);
				nlapiLogExecution("debug","Old Ship Date",oldShipDate);
				
				if(shipDate!=oldShipDate)
				{
					if(poRec.getFieldValue("custbody_linked_to_post_sale_order")=="T")
					{
						var now = new Date();
						var hours = now.getHours();
						var dayOfWeek = now.getDay();
						
						//Ensure Delivery Date on SO is updated properly
						//Delivery Date = 6 Business Days from Ship Date
						var deliveryDateAdd = 0;
						switch(nlapiStringToDate(shipDate).getDay())
						{
							case 0:
							case 1:
							case 2:
							case 3:
							case 4:
								deliveryDateAdd = 8;
								break;
							case 5:
								deliveryDateAdd = 10;
								break;
							case 6:
								deliveryDateAdd = 9;
								break;
						}
						
						var deliveryDate = nlapiAddDays(nlapiStringToDate(shipDate),deliveryDateAdd);
						deliveryDate = nlapiDateToString(deliveryDate,"date");
						
						//Update Delivery Date on Purchase Order
						nlapiSubmitField("purchaseorder",nlapiGetRecordId(),"custbody6",deliveryDate);
						
						//Update Delivery Date on Sales Order
						nlapiSubmitField("salesorder",soID,"custbody6",deliveryDate);
						
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
				else if(dateNeededInSF!=olddateNeededInSF)
				{
					if(poRec.getFieldValue("custbody_linked_to_post_sale_order")=="T")
					{
						var now = new Date();
						var hours = now.getHours();
						var dayOfWeek = now.getDay();
						
						//Ship Date = -1 Business Days from Date Needed in SF
						var shipDateAdd = 0;
						switch(nlapiStringToDate(dateNeededInSF).getDay())
						{
							case 0:
								shipDateAdd = -2;
								break;
							case 1:
								shipDateAdd = -3;
								break;
							case 2:
							case 3:
							case 4:
							case 5:
							case 6:
								shipDateAdd = -1;
								break;
						}
						
						var shipDate = nlapiAddDays(nlapiStringToDate(dateNeededInSF),shipDateAdd);
						shipDate = nlapiDateToString(shipDate,"date");
						
						//Ensure Delivery Date on SO is updated properly
						//Delivery Date = 6 Business Days from Ship Date
						var deliveryDateAdd = 0;
						switch(nlapiStringToDate(shipDate).getDay())
						{
							case 0:
							case 1:
							case 2:
							case 3:
							case 4:
								deliveryDateAdd = 8;
								break;
							case 5:
								deliveryDateAdd = 10;
								break;
							case 6:
								deliveryDateAdd = 9;
								break;
						}
						
						var deliveryDate = nlapiAddDays(nlapiStringToDate(shipDate),deliveryDateAdd);
						deliveryDate = nlapiDateToString(deliveryDate,"date");
						
						//Update Delivery Date on Purchase Order
						nlapiSubmitField("purchaseorder",nlapiGetRecordId(),["custbody6","custbody_po_ship_date"],[deliveryDate,shipDate]);
						
						//Update Delivery Date on Sales Order
						nlapiSubmitField("salesorder",soID,"custbody6",deliveryDate);
						
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
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Post Order DD Values","Details: " + err.message);
		}
	}
}
