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
					
					var isCAD = checkCad(poRec.getFieldValue("createdfrom"),poRec.getLineItemValue("item","item",x+1));
					
					if(parent_notes!=null && parent_notes!="")
					{
						var comments = poRec.getLineItemValue("item","custcol5",x+1);
						
						if(comments!=null && comments!="")
							comments += "\n" + parent_notes + "\n";
						else
							comments = parent_notes;
							
						if(isCAD)
							comments = "Ok for CAD\n" + comments;
						
						poRec.setLineItemValue("item","custcol5",x+1,comments);
					}
				}
				
				nlapiSubmitRecord(poRec,true,true);
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
					
					var isCAD = checkCad(poRec.getFieldValue("createdfrom"),poRec.getLineItemValue("item","item",x+1));
					
					if(parent_notes!=null && parent_notes!="")
					{
						var comments = poRec.getLineItemValue("item","custcol5",x+1);
							
						if(comments!=null && comments!="")
							comments += "\n" + parent_notes + "\n";
						else
							comments = parent_notes;
							
						if(isCAD)
							comments = "Ok for CAD\n" + comments;
							
						poRec.setLineItemValue("item","custcol5",x+1,comments);
					}
				}
				
				nlapiSubmitRecord(poRec,true,true);
				return true;
			}
			else if(vendor=="442500")
			{
				var poRec = nlapiLoadRecord("purchaseorder",nlapiGetRecordId());
				
				//MIRACLEWORKS
				for(var x=0; x < poRec.getLineItemCount("item"); x++)
				{
					var parent_notes = nlapiLookupField("item",poRec.getLineItemValue("item","item",x+1),"parent.custitem_miracleworks_production_notes");
					nlapiLogExecution("debug","Parent Notes",parent_notes);
					
					var isCAD = checkCad(poRec.getFieldValue("createdfrom"),poRec.getLineItemValue("item","item",x+1));
					
					if(parent_notes!=null && parent_notes!="")
					{
						var comments = poRec.getLineItemValue("item","custcol5",x+1);
							
						if(comments!=null && comments!="")
							comments += "\n" + parent_notes + "\n";
						else
							comments = parent_notes;
							
						if(isCAD)
							comments = "Ok for CAD\n" + comments;
							
						poRec.setLineItemValue("item","custcol5",x+1,comments);
					}
				}
				
				nlapiSubmitRecord(poRec,true,true);
				return true;
			}
			else
			{
				//ALL OTHER VENDORS
				var poRec = nlapiLoadRecord("purchaseorder",nlapiGetRecordId());
				var save = false;
				
				for(var x=0; x < poRec.getLineItemCount("item"); x++)
				{	
					var isCAD = checkCad(poRec.getFieldValue("createdfrom"),poRec.getLineItemValue("item","item",x+1));
					if(!isCAD)
						continue;
					
					var comments = poRec.getLineItemValue("item","custcol5",x+1);
						
					if(comments!=null && comments!="")
						comments += "Ok for CAD\n" + comments + "\n";
					else
						comments = "Ok for CAD";
					
					poRec.setLineItemValue("item","custcol5",x+1,comments);
					var save = true;
				}
				
				if(save)
					nlapiSubmitRecord(poRec,true,true);
				
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

function checkCad(order,item)
{
	if(order==null || order=="" || item==null || item=="")
		return false;
	
	var so = nlapiLoadRecord("salesorder",order);
	for(var x=0; x < so.getLineItemCount("item"); x++)
	{
		if(so.getLineItemValue("item","item",x+1)==item)
		{
			if(so.getLineItemValue("item","custcol_cad_item",x+1)=="T")
				return true;
			else
				return false;
		}
	}
}
