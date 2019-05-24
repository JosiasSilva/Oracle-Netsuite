function Item_Notes_On_POs(type)
{
	try
	{
		nlapiLogExecution("debug","UE Type",type);
		
		if(type=="create" || type=="specialorder")
		{
			var vendor = nlapiGetNewRecord().getFieldValue("entity");
			nlapiLogExecution("debug","Vendor",vendor);
			if(vendor=="7773")
			{
				var poRec = nlapiLoadRecord("purchaseorder",nlapiGetRecordId());
				
				//UNIQUE NEW YORK
				for(var x=0; x < poRec.getLineItemCount("item"); x++)
				{
					var parent_notes = nlapiLookupField("item",poRec.getLineItemValue("item","item",x+1),"parent.custitem_usny_production_notes");
					nlapiLogExecution("debug","Parent Notes",parent_notes);
					if(parent_notes!=null && parent_notes!="")
					{
						var fieldValue = "";
						var comments = poRec.getLineItemValue("item","custcol5",x+1);
						if(comments!=null && comments!="")
							fieldValue = parent_notes + "\n\n" + comments;
						else
							fieldValue = parent_notes;
						poRec.setLineItemValue("item","custcol5",x+1,fieldValue);
					}
				}
				
				nlapiSubmitRecord(poRec,false,true);
				return true;
			}
			else if(vendor=="153")
			{
				var poRec = nlapiLoadRecord("purchaseorder",nlapiGetRecordId());
				
				//GM CASTING HOUSE
				for(var x=0; x < poRec.getLineItemCount("item"); x++)
				{
					var parent_notes = nlapiLookupField("item",poRec.getLineItemValue("item","item",x+1),"parent.custitem_ch_production_notes");
					nlapiLogExecution("debug","Parent Notes",parent_notes);
					if(parent_notes!=null && parent_notes!="")
					{
						var fieldValue = "";
						var comments = poRec.getLineItemValue("item","custcol5",x+1);
						if(comments!=null && comments!="")
							fieldValue = parent_notes + "\n\n" + comments;
						else
							fieldValue = parent_notes;
						poRec.setLineItemValue("item","custcol5",x+1,fieldValue);
					}
				}
				
				nlapiSubmitRecord(poRec,false,true);
				return true;
			}
		}
	}
	catch(err)
	{
		nlapiLogExecution("error","Error Setting Item Notes on POs","Details: " + err.message);
		return true;
	}
}
