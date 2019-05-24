nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Return_Label_Insurance(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var recordType = nlapiGetRecordType();
			
			var record = nlapiGetNewRecord();
			
			var returnInsurance = 0.00;
			
			var typeOfSendBack = record.getFieldValue("custbody35");
			var typeOfOrder = record.getFieldValue("custbody87");
			
			if(recordType=="salesorder")
			{
				if(typeOfSendBack=="2")
				{
					for(var x=0; x < record.getLineItemCount("item"); x++)
					{
						returnInsurance += parseFloat(record.getLineItemValue("item","custcol_full_insurance_value",x+1));
					}
				}
				else if(typeOfOrder=="4")
				{
					//Type of Order = Exchange
					var createdFrom = record.getFieldValue("custbody_created_from");
					if(createdFrom!=null && createdFrom!="")
					{
						returnInsurance = nlapiLookupField("salesorder",createdFrom,"custbody_full_insurance_amount");
					}
				}
				else
				{
					for(var x=0; x < record.getLineItemCount("item"); x++)
					{
						if(record.getLineItemValue("item","custcol_category",x+1)=="12")
						{
							returnInsurance += parseFloat(record.getLineItemValue("item","custcol_full_insurance_value",x+1));
						}
					}
				}
			}
			else if(recordType=="returnauthorization")
			{
				for(var x=0; x < record.getLineItemCount("item"); x++)
				{
					returnInsurance += parseFloat(record.getLineItemValue("item","custcol_full_insurance_value",x+1));
				}
			}
			
			nlapiSubmitField(recordType,nlapiGetRecordId(),"custbody_return_label_insurance",returnInsurance);
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Calculating Return Label Insurance","Details: " + err.message);
		}
	}
}
