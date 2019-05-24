nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Custom_Quote(type)
{
	if(type=="create")
	{
		try
		{
			var cq = nlapiGetNewRecord();
			if(!isEmpty(cq.getFieldValue("custrecord_custom_quote_customer")))
			{
				nlapiSubmitField("customer",cq.getFieldValue("custrecord_custom_quote_customer"),"custentity_custom_quote",nlapiGetRecordId());
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Custom Quote Link","Details: " + err.message);
			return true;
		}
	}
}

function Custom_Gem_Request(type)
{
	if(type=="create")
	{
		try
		{
			var cq = nlapiGetNewRecord();
			if(!isEmpty(cq.getFieldValue("custrecord_cgr_customer")))
			{
				nlapiSubmitField("customer",cq.getFieldValue("custrecord_cgr_customer"),"custentity_custom_gem_request",nlapiGetRecordId());
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Custom Gem Request Link","Details: " + err.message);
			return true;
		}
	}
}

function Diamond_Request(type)
{
	if(type=="create")
	{
		try
		{
			var cq = nlapiGetNewRecord();
			if(!isEmpty(cq.getFieldValue("custrecord_diamond_request_customer")))
			{
				nlapiSubmitField("customer",cq.getFieldValue("custrecord_diamond_request_customer"),"custentity_diamond_request",nlapiGetRecordId());
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Diamond Request Link","Details: " + err.message);
			return true;
		}
	}
}

function Appointment_Link(type)
{
	if(type=="create")
	{
		try
		{
			var cq = nlapiGetNewRecord();
			if(!isEmpty(cq.getFieldValue("company")))
			{
				nlapiSubmitField("customer",cq.getFieldValue("company"),"custentity_appointment_record",nlapiGetRecordId());
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Appointment Link","Details: " + err.message);
			return true;
		}
	}
}

function isEmpty(value)
{
	if(value==null || value=="")
		return true;
	else
		return false;
}
