function Set_Order_Update_Date(type)
{
	if(type=="create" || type=="edit" || type=="approve")
	{
		try
		{
			var order = nlapiGetNewRecord();
			if(order.getFieldValue("custbody87")!="1")
			{
				nlapiSetFieldValue("custbody218","");
				nlapiLogExecution("debug","custbody87 not set to 1","Script will exit.");
			}
			else
			{
				var order_date = order.getFieldValue("trandate");
				var delivery_date = order.getFieldValue("custbody6");
				
				nlapiLogExecution("debug","Order Date",order_date);
				nlapiLogExecution("debug","Delivery Date",delivery_date);
				
				if(type=="create")
				{
					if(order_date!=null && order_date!="" && delivery_date!=null && delivery_date!="")
					{
						var delivery_date_time = new Date(delivery_date).getTime();
						var date_time = new Date(order_date).getTime();
						var date_dates =  Math.abs(date_time-delivery_date_time)/1000/24/60/60 + 1;
						var order_update_time = nlapiAddDays(new Date(order_date), parseInt((date_dates)/2));
						var order_update = nlapiDateToString(order_update_time);
						nlapiLogExecution('DEBUG', 'Delivery Date Time  Date time  datesNums and updatedates', delivery_date_time +" "+ date_time +" "+order_update_time+" "+order_update);
						nlapiSetFieldValue("custbody218",order_update);
					}
				}
				else if(type=="edit")
				{
					var update_date = order.getFieldValue("custbody218");
					
					if(update_date==null || update_date=="")
					{
						var delivery_date_time = new Date(delivery_date).getTime();
						var date_time = new Date(order_date).getTime();
						var date_dates =  Math.abs(date_time-delivery_date_time)/1000/24/60/60 + 1;
						var order_update_time = nlapiAddDays(new Date(order_date), parseInt((date_dates)/2));
						var order_update = nlapiDateToString(order_update_time);
						nlapiLogExecution('DEBUG', 'Delivery Date Time  Date time  datesNums and updatedates', delivery_date_time +" "+ date_time +" "+order_update_time+" "+order_update);
						nlapiSetFieldValue("custbody218",order_update);
					}
					
					var old_delivery_date = nlapiGetOldRecord().getFieldValue("custbody6");
					nlapiLogExecution("debug","Old Delivery Date",old_delivery_date);
					
					//Update if delivery dates were modified AND Delivery Date < Update Date (to prevent duplicate emails)
					if(delivery_date!=old_delivery_date && delivery_date < update_date)
					{
						var delivery_date_time = new Date(delivery_date).getTime();
						var date_time = new Date(order_date).getTime();
						var date_dates =  Math.abs(date_time-delivery_date_time)/1000/24/60/60 + 1;
						var order_update_time = nlapiAddDays(new Date(order_date), parseInt((date_dates)/2));
						var order_update = nlapiDateToString(order_update_time);
						nlapiLogExecution('DEBUG', 'Delivery Date Time  Date time  datesNums and updatedates', delivery_date_time +" "+ date_time +" "+order_update_time+" "+order_update);
						nlapiSetFieldValue("custbody218",order_update);
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Order Update Date","Details: " + err.message);
			return true;
		}
	}
}
