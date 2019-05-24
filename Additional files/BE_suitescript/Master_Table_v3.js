function Master_Table_CS(type,name)
{
	if(type=="recmachcustrecord_appointment_item_parent" && name=="custrecord_appointment_item_itemid")
	{
		var apptDate = nlapiGetFieldValue("startdate");
		var apptDateStr = nlapiGetFieldValue("startdate");
		var apptDateObj = apptDate;
	nlapiLogExecution("audit","Appointment Date",apptDate);
		apptDate = nlapiStringToDate(apptDate);
		
		if(apptDate.getHours() < 12)
		{
			//If appointment is before 12pm then use previous day's date as the appointment date
			apptDate = nlapiAddDays(apptDate,-1);
		}
		
	nlapiLogExecution("debug","Appt Date Object",apptDate.toString());
		
		var today = new Date();
		
		var apptDayOfWeek = apptDate.getDay();
		apptDayOfWeek = apptDayOfWeek + 1;
	nlapiLogExecution("audit","Appointment Day of Week",apptDayOfWeek);
		
		var location = nlapiGetFieldValue("custevent_calendar_location");
	nlapiLogExecution("audit","Appointment Location",location);
	
		var item = nlapiGetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appointment_item_itemid");
	nlapiLogExecution("audit","Appointment Item",item);
	
		//Check if item has other future appointments
		var hasAppointments = false;
		var greaterThanRequested = false;
		var lessThanRequested = false;
		var sameDayAsRequested = false;
		var otherApptLocation;
		
		var filters = [];
		filters.push(new nlobjSearchFilter("custrecord_appointment_item_itemid",null,"is",item));
		filters.push(new nlobjSearchFilter("startdate","custrecord_appointment_item_parent","onorafter","today"));
		//filters.push(new nlobjSearchColumn("internalid","custrecord_appointment_item_parent"));
		var cols = [];
		cols.push(new nlobjSearchColumn("startdate","custrecord_appointment_item_parent").setSort());
		cols.push(new nlobjSearchColumn("custrecord_appt_item_location"));
		var results = nlapiSearchRecord("customrecord_appointment_item",null,filters,cols);
		if(results)
		{
			hasAppointments = true;
			
			var scheduledDate = results[0].getValue("startdate","custrecord_appointment_item_parent");
			nlapiLogExecution("debug","Closest Appointment Date",scheduledDate);
			
			var scheduledDateObj = nlapiStringToDate(scheduledDate);
			nlapiLogExecution("debug","Scheduled Date Object",scheduledDateObj.toString());
			
			otherApptLocation = results[0].getValue("custrecord_appt_item_location");
			nlapiLogExecution("debug","Closest Appointment Location",otherApptLocation);
			
			if(+scheduledDateObj > +apptDate)
				greaterThanRequested = true;
			if(+scheduledDateObj < +apptDate)
				lessThanRequested = true;
			if(+scheduledDateObj == +apptDate)
				sameDayAsRequested = true;
		}
		
	nlapiLogExecution("debug","Has Appointments",hasAppointments);
	nlapiLogExecution("debug","> Requested",greaterThanRequested);
	nlapiLogExecution("debug","< Requested",lessThanRequested);
	nlapiLogExecution("debug","= Requested",sameDayAsRequested);
		
		if(hasAppointments==false)
		{
			var fromLocations = [];
			if(nlapiGetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appointment_item_qty_avail") > 0)
				fromLocations.push("1"); //San Francisco
			if(nlapiGetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecordappointment_item_qty_avail_la") > 0)
				fromLocations.push("2"); //Los Angeles
			if(nlapiGetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_item_qty_avail_boston") > 0)
				fromLocations.push("3"); //Boston
			if(nlapiGetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_item_qty_avail_chicago") > 0)
				fromLocations.push("4"); //Chicago
			if(nlapiGetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_item_qty_avail_sd") > 0)
				fromLocations.push("5"); //San Diego
			if(nlapiGetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_item_qty_avail_dc") > 0)
				fromLocations.push("6"); //Washington DC
				
			if(nlapiGetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appointment_item_qty_avail") > 1)
			{
				//If quantity in SF contains more than 1 use that
				fromLocations = null;
				fromLocations = [];
				fromLocations.push("1");
			}
				
		nlapiLogExecution("debug","From Locations",JSON.stringify(fromLocations));
		
			if(fromLocations!=null && fromLocations.length > 0)
			{
				var filters = [];
				filters.push(new nlobjSearchFilter("custrecord_mt_day_of_week",null,"is",apptDayOfWeek.toString()));
				filters.push(new nlobjSearchFilter("custrecord_mt_to_location",null,"is",location));
				filters.push(new nlobjSearchFilter("custrecord_mt_from_location",null,"anyof",fromLocations));
				filters.push(new nlobjSearchFilter("custrecord_mt_days_in_transit",null,"isnotempty"));
				var cols = [];
				cols.push(new nlobjSearchColumn("custrecord_mt_days_in_transit").setSort());
				cols.push(new nlobjSearchColumn("custrecord_mt_from_location"));
				var results = nlapiSearchRecord("customrecord_master_table",null,filters,cols);
				if(results)
				{
					var daysToSubtract = results[0].getValue("custrecord_mt_days_in_transit");
					nlapiLogExecution("debug","Days to Subtract",daysToSubtract);
					
					daysToSubtract = daysToSubtract * -1;
					var latestSendDate = nlapiAddDays(apptDate,daysToSubtract);
					
					if(apptDate.getHours() < 14)
					{
						if(latestSendDate < today)
						{
							alert("This appointment item does not have enough time to reach the destination location from the sending location.");
							nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_conflict","T",true,true);
						}
						else
						{
							nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_date_to_ship",nlapiDateToString(latestSendDate,"date"),true,true);
							nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_sending_location",results[0].getValue("custrecord_mt_from_location"),true,true);
						}
					}
					else
					{
						if(latestSendDate <= today)
						{
							alert("This appointment item does not have enough time to reach the destination location from the sending location.");
							nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_conflict","T",true,true);
						}
						else
						{
							nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_date_to_ship",nlapiDateToString(latestSendDate,"date"),true,true);
							nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_sending_location",results[0].getValue("custrecord_mt_from_location"),true,true);
						}
					}
				}
			}
		}
		else
		{
			//Check if item is available in another location without an appointment
			var locationWithoutApptFound = false;
			
			var fromLocations = [];
			if(nlapiGetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appointment_item_qty_avail") > 0)
				fromLocations.push("1"); //San Francisco
			if(nlapiGetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecordappointment_item_qty_avail_la") > 0)
				fromLocations.push("2"); //Los Angeles
			if(nlapiGetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_item_qty_avail_boston") > 0)
				fromLocations.push("3"); //Boston
			if(nlapiGetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_item_qty_avail_chicago") > 0)
				fromLocations.push("4"); //Chicago
			if(nlapiGetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_item_qty_avail_sd") > 0)
				fromLocations.push("5"); //San Diego
			if(nlapiGetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_item_qty_avail_dc") > 0)
				fromLocations.push("6"); //Washington DC
				
			if(nlapiGetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appointment_item_qty_avail") > 1)
			{
				//If quantity in SF contains more than 1 use that
				fromLocations = null;
				fromLocations = [];
				fromLocations.push("1");
			}
				
			if(fromLocations==null || fromLocations.length==0)
			{
				nlapiLogExecution("debug","No inventory available in any locations for this item.");
				return true;
			}
				
			var filters = [];
			filters.push(new nlobjSearchFilter("custevent_calendar_location","custrecord_appointment_item_parent","anyof",fromLocations));
			filters.push(new nlobjSearchFilter("custevent_calendar_location","custrecord_appointment_item_parent","noneof",location));
			filters.push(new nlobjSearchFilter("custrecord_appointment_item_itemid",null,"is",item));
			filters.push(new nlobjSearchFilter("startdate","custrecord_appointment_item_parent","onorafter","today"));
			var cols = [];
			cols.push(new nlobjSearchColumn("custevent_calendar_location","custrecord_appointment_item_parent"));
			var results = nlapiSearchRecord("customrecord_appointment_item",null,filters,cols);
			if(results)
			{
				locationWithoutApptFound = true;
				fromLocations = [];
				fromLocations.push(results[0].getValue("custevent_calendar_location","custrecord_appointment_item_parent"));
			}
			
			if(locationWithoutApptFound==true)
			{
				var filters = [];
				filters.push(new nlobjSearchFilter("custrecord_mt_day_of_week",null,"is",apptDayOfWeek));
				filters.push(new nlobjSearchFilter("custrecord_mt_to_location",null,"is",location));
				filters.push(new nlobjSearchFilter("custrecord_mt_from_location",null,"anyof",fromLocations));
				filters.push(new nlobjSearchFilter("custrecord_mt_days_in_transit",null,"isnotempty"));
				var cols = [];
				cols.push(new nlobjSearchColumn("custrecord_mt_days_in_transit").setSort());
				cols.push(new nlobjSearchColumn("custrecord_mt_from_location"));
				var results = nlapiSearchRecord("customrecord_master_table",null,filters,cols);
				if(results)
				{
					var daysToSubtract = results[0].getValue("custrecord_mt_days_in_transit");
					daysToSubtract = daysToSubtract * -1;
					var latestSendDate = nlapiAddDays(apptDate,daysToSubtract);
					
					if(apptDate.getHours() < 14)
					{
						if(latestSendDate < today)
						{
							alert("This appointment item does not have enough time to reach the destination location from the sending location.");
							nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_conflict","T",true,true);
						}
						else
						{
							nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_date_to_ship",nlapiDateToString(latestSendDate,"date"),true,true);
							nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_sending_location",results[0].getValue("custrecord_mt_from_location"),true,true);
						}
					}
					else
					{
						if(latestSendDate <= today)
						{
							alert("This appointment item does not have enough time to reach the destination location from the sending location.");
							nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_conflict","T",true,true);
						}
						else
						{
							nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_date_to_ship",nlapiDateToString(latestSendDate,"date"),true,true);
							nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_sending_location",results[0].getValue("custrecord_mt_from_location"),true,true);
						}
					}
				}
			}
			else
			{
				if(greaterThanRequested==true)
				{
					//Determine Scheduled Appointment Date (last appointment before Requested Appointment Date)
					var lastAppointmentDate, lastAppointmentDateObj;
					
					var filters = [];
					filters.push(new nlobjSearchFilter("custevent_calendar_location","custrecord_appointment_item_parent","anyof",fromLocations));
					filters.push(new nlobjSearchFilter("custevent_calendar_location","custrecord_appointment_item_parent","noneof",location));
					filters.push(new nlobjSearchFilter("custrecord_appointment_item_itemid",null,"is",item));
					filters.push(new nlobjSearchFilter("startdate","custrecord_appointment_item_parent","onorbefore",apptDateStr));
					var cols = [];
					cols.push(new nlobjSearchColumn("startdate","custrecord_appointment_item_parent").setSort(true));
					cols.push(new nlobjSearchColumn("custevent_calendar_location","custrecord_appointment_item_parent"));
					var results = nlapiSearchRecord("customrecord_appointment_item",null,filters,cols);
					if(results)
					{
						lastAppointmentDate = results[0].getValue("startdate","custrecord_appointment_item_parent");
						nlapiLogExecution("debug","Last Appointment Date: " + lastAppointmentDate)
						lastAppointmentDateObj = nlapiStringToDate(lastAppointmentDate,"date");
					}					
					
					var filters = [];
					filters.push(new nlobjSearchFilter("custrecord_mt_day_of_week",null,"is",apptDayOfWeek));
					filters.push(new nlobjSearchFilter("custrecord_mt_to_location",null,"is",location));
					filters.push(new nlobjSearchFilter("custrecord_mt_from_location",null,"anyof",fromLocations));
					filters.push(new nlobjSearchFilter("custrecord_mt_days_in_transit",null,"isnotempty"));
					var cols = [];
					cols.push(new nlobjSearchColumn("custrecord_mt_days_in_transit").setSort());
					cols.push(new nlobjSearchColumn("custrecord_mt_from_location"));
					var results = nlapiSearchRecord("customrecord_master_table",null,filters,cols);
					if(results)
					{
						var daysToSubtract = results[0].getValue("custrecord_mt_days_in_transit");
						daysToSubtract = daysToSubtract * -1;
						var latestSendDate = nlapiAddDays(apptDate,daysToSubtract);
						
						if(latestSendDate >= lastAppointmentDateObj && lastAppointmentDateObj.getHours() < 14)
						{
							latestSendDate = lastAppointmentDateObj;
						}
						else if(latestSendDate >= lastAppointmentDateObj && lastAppointmentDateObj.getHours() > 14)
						{
							latestSendDate = nlapiAddDays(lastAppointmentDateObj,1);
						}
						
						nlapiLogExecution("debug","Latest Send Date",nlapiDateToString(latestSendDate,"date"));
						
						if(apptDate.getHours() < 14)
						{
							if(latestSendDate < today)
							{
								alert("This appointment item does not have enough time to reach the destination location from the sending location.");
								nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_conflict","T",true,true);
							}
							else
							{
								nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_date_to_ship",nlapiDateToString(latestSendDate,"date"),true,true);
								nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_sending_location",results[0].getValue("custrecord_mt_from_location"),true,true);
							}
						}
						else
						{
							if(latestSendDate <= today)
							{
								alert("This appointment item does not have enough time to reach the destination location from the sending location.");
								nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_conflict","T",true,true);
							}
							else
							{
								nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_date_to_ship",nlapiDateToString(latestSendDate,"date"),true,true);
								nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_sending_location",results[0].getValue("custrecord_mt_from_location"),true,true);
							}
						}
					}
				}
				else if(lessThanRequested==true)
				{
					//Determine Scheduled Appointment Date (next appointment after Requested Appointment Date)
					//CHANGE: 3-31-17 7:32AM - Updated variables below, they were nextAppointmentDate, etc. Naming didn't match variable logic below
					var lastAppointmentDate, lastAppointmentDateObj;
					
					var filters = [];
					filters.push(new nlobjSearchFilter("custevent_calendar_location","custrecord_appointment_item_parent","anyof",fromLocations));
					filters.push(new nlobjSearchFilter("custevent_calendar_location","custrecord_appointment_item_parent","noneof",location));
					filters.push(new nlobjSearchFilter("custrecord_appointment_item_itemid",null,"is",item));
					filters.push(new nlobjSearchFilter("startdate","custrecord_appointment_item_parent","onorafter",apptDateStr));
					var cols = [];
					cols.push(new nlobjSearchColumn("startdate","custrecord_appointment_item_parent"));
					cols.push(new nlobjSearchColumn("custevent_calendar_location","custrecord_appointment_item_parent"));
					var results = nlapiSearchRecord("customrecord_appointment_item",null,filters,cols);
					if(results)
					{
						lastAppointmentDate = results[0].getValue("startdate","custrecord_appointment_item_parent");
						lastAppointmentDateObj = nlapiStringToDate(lastAppointmentDate,"date");
						
						nlapiLogExecution("debug","lastAppointmentDate",lastAppointmentDate);
					}					
					
					var filters = [];
					filters.push(new nlobjSearchFilter("custrecord_mt_day_of_week",null,"is",apptDayOfWeek));
					filters.push(new nlobjSearchFilter("custrecord_mt_to_location",null,"is",location));
					filters.push(new nlobjSearchFilter("custrecord_mt_from_location",null,"anyof",fromLocations));
					filters.push(new nlobjSearchFilter("custrecord_mt_days_in_transit",null,"isnotempty"));
					var cols = [];
					cols.push(new nlobjSearchColumn("custrecord_mt_days_in_transit").setSort());
					cols.push(new nlobjSearchColumn("custrecord_mt_from_location"));
					var results = nlapiSearchRecord("customrecord_master_table",null,filters,cols);
					if(results)
					{
						var daysToSubtract = results[0].getValue("custrecord_mt_days_in_transit");
						daysToSubtract = daysToSubtract * -1;
						var latestSendDate = nlapiAddDays(apptDate,daysToSubtract);
						
						nlapiLogExecution("debug","latestSendDate",nlapiDateToString(latestSendDate,"date"));
						
						if(latestSendDate <= lastAppointmentDateObj && lastAppointmentDateObj.getHours() < 14)
						{
							latestSendDate = lastAppointmentDateObj;
						}
						else if(latestSendDate <= lastAppointmentDateObj && lastAppointmentDateObj.getHours() > 14)
						{
							latestSendDate = nlapiAddDays(lastAppointmentDateObj,1);
						}
						
						if(apptDate.getHours() < 14)
						{
							if(latestSendDate < today)
							{
								alert("This appointment item does not have enough time to reach the destination location from the sending location.");
								nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_conflict","T",true,true);
							}
							else
							{
								nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_date_to_ship",nlapiDateToString(latestSendDate,"date"),true,true);
								nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_sending_location",results[0].getValue("custrecord_mt_from_location"),true,true);
							}
						}
						else
						{
							if(latestSendDate <= today)
							{
								alert("This appointment item does not have enough time to reach the destination location from the sending location.");
								nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_conflict","T",true,true);
							}
							else
							{
								nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_date_to_ship",nlapiDateToString(latestSendDate,"date"),true,true);
								nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_appt_item_sending_location",results[0].getValue("custrecord_mt_from_location"),true,true);
							}
						}
					}
				}
				else if(sameDayAsRequested==true)
				{
					//Appointment is conflicting with an appointment on the same day
					alert("This appointment item does not have enough time to reach the destination location from the sending location.");
					nlapiSetCurrentLineItemValue("recmachcustrecord_appointment_item_parent","custrecord_conflict","T",true,true);
				}
			}
		}
	}
}
