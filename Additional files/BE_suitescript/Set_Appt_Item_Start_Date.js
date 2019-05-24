nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Set_Appt_Item_Start_Date(type)
{
	if(type=="create")
	{
		try
		{
			var appointment = nlapiGetNewRecord();
			var appointmentId = nlapiGetRecordId();
			var startDate = appointment.getFieldValue("startdate");
			
			if(startDate!=null && startDate!="")
			{
				var filters = [];
				filters.push(new nlobjSearchFilter("custrecord_appointment_item_parent",null,"is",appointmentId));
				var results = nlapiSearchRecord("customrecord_appointment_item",null,filters);
				if(results)
				{
					for(var x=0; x < results.length; x++)
					{
						nlapiSubmitField("customrecord_appointment_item",results[x].getId(),"custrecord_appt_item_appt_start_date",startDate);
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Updating Appt Item Start Date (CREATE)","Details: " + err.message);
		}
	}
	else if(type=="edit")
	{
		try
		{
			var appointment = nlapiGetNewRecord();
			var appointmentId = nlapiGetRecordId();
			var oldAppointment = nlapiGetOldRecord();
			
			var startDate = appointment.getFieldValue("startdate");
			var oldStartDate = oldAppointment.getFieldValue("startdate");
			
			if(startDate != oldStartDate)
			{
				var filters = [];
				filters.push(new nlobjSearchFilter("custrecord_appointment_item_parent",null,"is",appointmentId));
				var results = nlapiSearchRecord("customrecord_appointment_item",null,filters);
				if(results)
				{
					for(var x=0; x < results.length; x++)
					{
						nlapiSubmitField("customrecord_appointment_item",results[x].getId(),"custrecord_appt_item_appt_start_date",startDate);
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Updating Appt Item Start Date (EDIT)","Details: " + err.message);
		}
	}
}
