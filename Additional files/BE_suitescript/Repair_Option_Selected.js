nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Repair_Option_Selected_FC(type,name,linenum)
{
	try
	{
		if(name=="custbodyrepair_option_selected" || name=="custbody_repair_option_1_price" || name=="custbody_repair_option_2_price" || name=="custbody_repair_option_3_price")
		{
			for(var x=0; x < nlapiGetLineItemCount("item"); x++)
			{
				if(nlapiGetLineItemValue("item","item",x+1)=="1087131")
				{
					if(nlapiGetFieldValue("custbodyrepair_option_selected")!=null && nlapiGetFieldValue("custbodyrepair_option_selected")!="")
					{
						var repairOption = nlapiGetFieldValue("custbodyrepair_option_selected");
						var repairPrice = null;
						switch(repairOption)
						{
							case "1":
								repairPrice = parseFloat(nlapiGetFieldValue("custbody_repair_option_1_price"));
								break;
							case "2":
								repairPrice = parseFloat(nlapiGetFieldValue("custbodyrepair_option_2_price"));
								break;
							case "3":
								repairPrice = parseFloat(nlapiGetFieldValue("custbodyrepair_option_3_price"));
								break;
						}
						if(repairPrice!=null && repairPrice!="")
						{
							nlapiSelectLineItem("item",x+1);
							nlapiSetCurrentLineItemValue("item","price","-1");
							nlapiSetCurrentLineItemValue("item","rate",repairPrice);
							nlapiCommitLineItem("item");
						}
					}
				}
			}
		}
	}
	catch(err){ }
}

function Repair_Option_Selected_PS(type,name,linenum)
{
	try
	{
		if(nlapiGetCurrentLineItemValue("item","item")=="1087131")
		{
			if(nlapiGetFieldValue("custbodyrepair_option_selected")!=null && nlapiGetFieldValue("custbodyrepair_option_selected")!="")
			{
				var repairOption = nlapiGetFieldValue("custbodyrepair_option_selected");
				var repairPrice = null;
				switch(repairOption)
				{
					case "1":
						repairPrice = parseFloat(nlapiGetFieldValue("custbody_repair_option_1_price"));
						break;
					case "2":
						repairPrice = parseFloat(nlapiGetFieldValue("custbodyrepair_option_2_price"));
						break;
					case "3":
						repairPrice = parseFloat(nlapiGetFieldValue("custbodyrepair_option_3_price"));
						break;
				}
				if(repairPrice!=null && repairPrice!="")
				{
					nlapiSetCurrentLineItemValue("item","price","-1");
					nlapiSetCurrentLineItemValue("item","rate",repairPrice);
				}
			}
		}
	}catch(err){ }
}
