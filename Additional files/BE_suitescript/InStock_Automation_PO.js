nlapiLogExecution("audit","FLOStart",new Date().getTime());
function InstockAutomation_PO(type)
{
	if(type=="create")
	{
		try
		{
			var po = nlapiGetNewRecord();
			var so = po.getFieldValue("createdfrom");
			if(so!=null && so!="")
			{
				if(nlapiLookupField("salesorder",so,"custbody_in_stock_automation")=="T")
				{
					if(po.getLineItemCount("item")==1 && po.findLineItemValue("item","item","1093360")!=-1 && po.findLineItemValue("item","item","1093360")!=0)
					{
						//custbody59 equal {today} + 4 business days
						var today = new Date();
						switch(today.getDay())
						{
							case 0: //Sunday
							case 1: //Monday
							case 2: //Tuesday
								nlapiSetFieldValue("custbody59",nlapiDateToString(nlapiAddDays(4,today),"date"));
								break;
							case 3: //Wednesday
							case 4: //Thursday
							case 5: //Friday
								nlapiSetFieldValue("custbody59",nlapiDateToString(nlapiAddDays(6,today),"date"));
								break;
							case 6: //Saturday
								nlapiSetFieldValue("custbody59",nlapiDateToString(nlapiAddDays(5,today),"date"));
								break;
						}
						
						//Set Resize Ring description to comments from SO line item
						var soRec = nlapiLoadRecord("salesorder",so);
						var insurance;
						for(var x=0; x < soRec.getLineItemCount("item"); x++)
						{
							if(soRec.getLineItemValue("item","item",x+1)==po.getLineItemValue("item","item","1"))
							{
								po.setLineItemValue("item","description","1",soRec.getLineItemValue("item","custcol5",x+1));
							}
							if(soRec.getLineItemValue("item","item",x+1) == soRec.getFieldValue("custbody_pot_backstock_ring_match_item"))
							{
								po.setLineItemValue("item","custcol_full_insurance_value","1",soRec.getLineItemValue("item","custcol_full_insurance_value",x+1));
							}
						}
						
						//Set Full Insurance Value to insurance value of setting being resized
					}
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Handling PO For In stock Automation","Details: " + err.message);
		}
	}
}
