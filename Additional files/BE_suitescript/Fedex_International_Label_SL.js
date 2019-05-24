function FedEx_Int_Label(request,response)
{
	var shipId = request.getParameter("shipid");
	
	Gen_Fedex_Label(shipId,false);
}

function FedEx_Int_Label_Auto_IF(request,response)
{
	try
	{
		var shipId = request.getParameter("shipid");
		nlapiLogExecution("debug","Generating International Shipping Label for Item Fulfillment ID " + shipId);
	
		Gen_Fedex_Label(shipId,true);
		
		response.write("International Label Successfully Generated!");
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Initiating Intl Label","Details: " + err.message);
	}
}

function checkInsuranceValue()
{
	try
	{
		var insuranceValue = nlapiGetFieldValue("custpage_insurance");
		if(insuranceValue <= 0)
		{
			alert("You must enter an insurance value greater than $0.00.");
			return false;
		}
		
		return true;
	}
	catch(err)
	{
		return true;
	}
}
