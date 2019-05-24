var fields = ["custitemcertificate_included","custitemcertificate_status","custitemcert_ordered","custitemcert_eta","custitem40","custitem192","custitemreason_for_diamond_return"];
var data = ["","","","","","",""];

function VRA_Overhaul_Diamonds_IF_UE(type)
{
	if(type=="create")
	{
		try
		{
			var fulfillment = nlapiGetNewRecord();
			
			if(fulfillment.getFieldValue("custbody_vra_overhaul_if_diamonds")=="T")
			{
				for(var x=0; x < fulfillment.getLineItemCount("item"); x++)
				{
					nlapiSubmitField("inventoryitem",fulfillment.getLineItemValue("item","item",x+1),fields,data);
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Updating Item Fields on VRA Item Fulfillment","Details: " + err.message);
		}
	}
}
