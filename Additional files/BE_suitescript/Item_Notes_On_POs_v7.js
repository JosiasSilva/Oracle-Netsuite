nlapiLogExecution("audit","FLOStart",new Date().getTime());
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
					var is35mm = check35mm(poRec.getFieldValue("createdfrom"));
					
					if(parent_notes!=null && parent_notes!="")
					{
						var comments = poRec.getLineItemValue("item","custcol5",x+1);
						
						if(comments!=null && comments!="")
							comments += "\n" + parent_notes + "\n";
						else
							comments = parent_notes;
							
						if(isCAD)
							comments = "Ok for CAD\n" + comments;
							
						if(is35mm)
						{
							comments = comments.replace("SF","NY");
						}
						
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
			else if(vendor=="1223843")
			{
				var poRec = nlapiLoadRecord("purchaseorder",nlapiGetRecordId());
				
				//HAROUT
				for(var x=0; x < poRec.getLineItemCount("item"); x++)
				{
					var parent_notes = nlapiLookupField("item",poRec.getLineItemValue("item","item",x+1),"parent.custitem_harout_production_notes");
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
			else if(vendor=="2388331")
			{
				var poRec = nlapiLoadRecord("purchaseorder",nlapiGetRecordId());
				
				//ENDLESS DESIGNS
				for(var x=0; x < poRec.getLineItemCount("item"); x++)
				{
					var parent_notes = nlapiLookupField("item",poRec.getLineItemValue("item","item",x+1),"parent.custitemendless_production_notes");
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
			else if(vendor=="6621")
			{
				var poRec = nlapiLoadRecord("purchaseorder",nlapiGetRecordId());
				
				//BENCHMARK
				for(var x=0; x < poRec.getLineItemCount("item"); x++)
				{
					var parent_notes = nlapiLookupField("item",poRec.getLineItemValue("item","item",x+1),"parent.custitembenchmark_production_notes");
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
			else if(vendor=="5181551")
			{
				var poRec = nlapiLoadRecord("purchaseorder",nlapiGetRecordId());
				
				//GUILD AND FACET
				for(var x=0; x < poRec.getLineItemCount("item"); x++)
				{
					var parent_notes = nlapiLookupField("item",poRec.getLineItemValue("item","item",x+1),"parent.custitemguild_and_facet_production_not");
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
			else if(vendor=="11081056")
			{
				var poRec = nlapiLoadRecord("purchaseorder",nlapiGetRecordId());
				
				//Frederick Goldman
				for(var x=0; x < poRec.getLineItemCount("item"); x++)
				{
					var parent_notes = nlapiLookupField("item",poRec.getLineItemValue("item","item",x+1),"parent.custitem_fg_production_notes");
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
			else if(vendor=="1587345")
			{
				var poRec = nlapiLoadRecord("purchaseorder",nlapiGetRecordId());
				
				//SASHA PRIMAK
				for(var x=0; x < poRec.getLineItemCount("item"); x++)
				{
					var parent_notes = nlapiLookupField("item",poRec.getLineItemValue("item","item",x+1),"parent.custitemsasha_primak_production_notes");
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

function check35mm(order)
{
	if(order==null || order=="")
		return false;
		
	var so = nlapiLoadRecord("salesorder",order);
	for(var x=0; x < so.getLineItemCount("item"); x++)
	{
		var category = so.getLineItemValue("item","custcol_category",x+1);
		if(category=="1" || category=="23" || category=="30")
		{
			//Check if Melee diameter < 3.5mm
			var diameter = nlapiLookupField("item",so.getLineItemValue("item","item",x+1),"custitem16");
			nlapiLogExecution("debug","Melee Diameter",diameter);
			
			if(diameter!=null && diameter!="")
				diameter = parseFloat(diameter);
			else
				return false;
				
			if(diameter <= 3.5)
				return true;
			else
				return false;
		}
	}
}
