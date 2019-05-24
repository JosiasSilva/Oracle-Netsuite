function Sales_Order_Item_Metal_Types(type)
{
	if(type=="create" || type=="edit")
	{
		try
		{
			var order = nlapiLoadRecord("salesorder",nlapiGetRecordId());
			
			//Reset fields
			order.setFieldValue("custbody_metal_1","");
			order.setFieldValue("custbody_metal_2","");
			order.setFieldValue("custbody_metal_3","");
			order.setFieldValue("custbody_metal_4","");
			order.setFieldValue("custbody_metal_5","");
			order.setFieldValue("custbody_metal_6","");
			
			for(var x=0; x < order.getLineItemCount("item"); x++)
			{
				var metal_type = nlapiLookupField("item",order.getLineItemValue("item","item",x+1),"custitem1");
				if(metal_type!=null && metal_type!="")
				{
					if(order.getFieldValue("custbody_metal_1")==null || order.getFieldValue("custbody_metal_1")=="")
						order.setFieldValue("custbody_metal_1",metal_type);
					else if(order.getFieldValue("custbody_metal_2")==null || order.getFieldValue("custbody_metal_2")=="")
						order.setFieldValue("custbody_metal_2",metal_type);
					else if(order.getFieldValue("custbody_metal_3")==null || order.getFieldValue("custbody_metal_3")=="")
						order.setFieldValue("custbody_metal_3",metal_type);
					else if(order.getFieldValue("custbody_metal_4")==null || order.getFieldValue("custbody_metal_4")=="")
						order.setFieldValue("custbody_metal_4",metal_type);
					else if(order.getFieldValue("custbody_metal_5")==null || order.getFieldValue("custbody_metal_5")=="")
						order.setFieldValue("custbody_metal_5",metal_type);
					else if(order.getFieldValue("custbody_metal_6")==null || order.getFieldValue("custbody_metal_6")=="")
						order.setFieldValue("custbody_metal_6",metal_type);
				}
			}
			
			nlapiSubmitRecord(order,true,true);
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Metal Types","Details: " + err.message);
			return true;
		}
	}
}
