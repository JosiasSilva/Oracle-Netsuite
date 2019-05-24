nlapiLogExecution("audit","FLOStart",new Date().getTime());
function setAppointmentField_Opp(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			//Get Internal ID Of Opportunity Record
			var opportunity = nlapiGetRecordId()
			if(opportunity==null || opportunity=="")
				return true
			
			//Check if Appointment=Yes
			if(nlapiLookupField("opportunity", opportunity, "custbody17")=="T")
			{
				//Set Appointment=Yes on Customer Record
				var customer = nlapiLookupField("opportunity", opportunity, "entity")
				nlapiSubmitField("customer", customer, "custentity46", "T")
			}
		}
		catch(err)
		{
			nlapiLogExecution("error", "Error Setting Appointment Field", "Error checking to see if appointment field on customer record needs to be set for Opportunity ID " + opportunity + ". Details: " + err.message)
			return true
		}
	}
}

function setAppointmentField_Order(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			//Get Internal ID Of Sales Order Record
			var salesOrder = nlapiGetRecordId()
			if(salesOrder==null || salesOrder=="")
				return true
			
			//Check if Place of sale (class) = Appointment
			if(nlapiLookupField("salesorder", salesOrder, "class")=="3")
			{
				//Set Appointment=Yes on Customer Record
				var customer = nlapiLookupField("salesorder", salesOrder, "entity")
				nlapiSubmitField("customer", customer, "custentity46", "T")
			}
		}
		catch(err)
		{
			nlapiLogExecution("error", "Error Setting Appointment Field", "Error checking to see if appointment field on customer record needs to be set for Sales Order ID " + salesOrder + ". Details: " + err.message)
			return true
		}
	}
}
