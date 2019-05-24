nlapiLogExecution("audit","FLOStart",new Date().getTime());
var allowedAccess = [];
allowedAccess[0] = "-5"; //Beth Gertain
allowedAccess[1] = "1877"; //Eric Grossberg
allowedAccess[2] = "256770"; //Sharon Dziesietnik
allowedAccess[3] = "339708"; //Danielle Detrick
allowedAccess[4] = "446399"; //Mike Siu
allowedAccess[5] = "20186"; //NS Consultant
allowedAccess[6] = "16153"; //Emily McCallon
allowedAccess[7] = "6701"; //McDougle Shiota

function PTO_UE_BL(type,form)
{
	if(type=="view" || type=="edit" || type=="create")
	{
		try
		{
			var user = nlapiGetUser();
			var allowAccess = false;
			for(var x=0; x < allowedAccess.length; x++)
			{
				if(user==allowedAccess[x])
				{
					allowAccess = true;
					break;
				}
			}
			
			if(allowAccess)
			{
				var typeOfPTO = nlapiGetFieldValue("custrecord_pto_type_of_request");
				//if(typeOfPTO=="2")
				//{
					form.getField("custrecord_pto_comp_earned").setDisplayType("normal");
					form.getField("custrecord_pto_comp_earned_notes").setDisplayType("normal");
				//}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Handling Comp Fields","Details: " + err.message);
			return true;
		}
	}
}


