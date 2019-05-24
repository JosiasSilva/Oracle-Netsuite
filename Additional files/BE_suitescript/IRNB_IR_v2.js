function IRNB_IR()
{
	try
	{
		var created_from = nlapiGetFieldText("createdfrom");
		
		if(created_from.substring(0,3)=="Ret" && nlapiGetFieldValue("tranid")=="To Be Generated")
		{
			for(var x=0; x < nlapiGetLineItemCount("item"); x++)
			{
				if(nlapiGetLineItemValue("item","itemreceive",x+1)=="T")
				{
					if(nlapiGetLineItemValue("item","custcol_irnb_amount",x+1)!=null && nlapiGetLineItemValue("item","custcol_irnb_amount",x+1)!="")
					{
						nlapiSelectLineItem("item",x+1);
						nlapiSetCurrentLineItemValue("item","unitcostoverride",nlapiGetLineItemValue("item","custcol_irnb_amount",x+1));
						nlapiCommitLineItem("item");
					}
				}
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Setting Cost on Return from IRNB","Details: " + err.message);
	}
}
