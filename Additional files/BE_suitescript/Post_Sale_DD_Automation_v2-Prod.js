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
						if(orderType=="2" || orderType=="3" || orderType=="4" || orderType=="8")
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
					if(orderType!="2" && orderType!="3" && orderType!="4" && orderType!="8")
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
					//nlapiSubmitField("purchaseorder",nlapiGetRecordId(),["custbody6","custbody_po_ship_date","custbody_linked_to_post_sale_order"],[deliveryDate,shipDate,"T"]);
					
					//Update PO Date on Sales Order
					//nlapiSubmitField("salesorder",soID,["custbody6","custbody_po_creation_date_time"],[deliveryDate,nlapiDateToString(now,"datetimetz")]);
					nlapiSubmitField("salesorder",soID,["custbody_po_creation_date_time"],[nlapiDateToString(now,"datetimetz")]);
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
					//nlapiSubmitField("purchaseorder",nlapiGetRecordId(),["custbody6","custbody_po_ship_date","custbody_linked_to_post_sale_order"],[deliveryDate,shipDate,"T"]);
					
					//Update Delivery Date and PO Date on Sales Order
					//nlapiSubmitField("salesorder",soID,["custbody6","custbody_po_creation_date_time"],[deliveryDate,nlapiDateToString(now,"datetimetz")]);
					nlapiSubmitField("salesorder",soID,["custbody_po_creation_date_time"],[nlapiDateToString(now,"datetimetz")]);
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Post Order DD Values","Details: " + err.message);
		}
	}
}
