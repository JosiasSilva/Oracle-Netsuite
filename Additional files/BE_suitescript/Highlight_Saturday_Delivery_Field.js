function Highlight_Saturday_Delivery_Field(type,form)
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
			nlapiLogExecution("debug","Saturday Delivery Value",nlapiGetFieldValue("custbody_saturday_delivery_available"));
			
			if(nlapiGetFieldValue("custbody_saturday_delivery_available")!=null && nlapiGetFieldValue("custbody_saturday_delivery_available")!="")
			{
				//Highlight field
				if(nlapiGetFieldValue("custbody_saturday_delivery_available")=="2")
				{
					nlapiLogExecution("debug","Highlighting Field...");
					
					//var	field = form.addField("custpage_highlight_sat_del_fld","inlinehtml","Highlight Saturday Delivery");
					//field.setDefaultValue("<script type='text/javascript'>document.getElementById('custbody_saturday_delivery_available_fs_lbl').parentNode.parentNode.style.backgroundColor='red';</script>");
					
					nlapiSetFieldValue("custbody_highlight_saturday_del_fld","<script type='text/javascript'>document.getElementById('custbody_saturday_delivery_available_fs_lbl_uir_label').nextSibling.style.backgroundColor='red';</script>",true,true);	
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Script Error","Error highlighting Saturday Delivery field on Sales Order ID " + orderID + ". Details: " + err.message);
		}
	}
}