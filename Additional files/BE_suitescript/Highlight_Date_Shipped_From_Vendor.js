nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Highlight_Date_Shipped_From_Vendor(type,form)
{
	var ctx = nlapiGetContext().getExecutionContext();
	if(ctx!="userinterface")
		return true;
	
	if(type=="view" || type=="edit")
	{
		var orderID = nlapiGetRecordId();
		
		//Highlight Date Shipped from Vendor Field
		try
		{
			//Only highlight when field is not empty
			if(nlapiGetFieldValue("custbody209")!=null && nlapiGetFieldValue("custbody209")!="")
			{
				//Highlight field
				var today = new Date();
				if(nlapiStringToDate(nlapiGetFieldValue("custbody209")) <= today)
				{
					var	field = form.addField("custpage_highlight_dsfv","inlinehtml","Highlight Date Shipped from Vendor");
					field.setDefaultValue("<script type='text/javascript'>document.getElementById('custbody209_fs_lbl').parentNode.parentNode.style.backgroundColor='#35ec07';</script>");	
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Script Error","Error highlighting Date Shipped From Vendor field on Purchase Order ID " + orderID + ". Details: " + err.message);
		}
	}
}