function Pending_IA_CS_FC(type,name,linenum)
{
	if(type=="recmachcustrecord_pia_parent" && (name=="custrecord_pia_line_item" || name=="custrecord_pia_location"))
	{
		try
		{
			var item = nlapiGetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_line_item");
			var location = nlapiGetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_location");
			
			if(item!=null && item!="" && location!=null && location!="")
			{
				var filters = [];
				filters.push(new nlobjSearchFilter("internalid",null,"is",item));
				filters.push(new nlobjSearchFilter("inventorylocation",null,"is",location));
				var cols = [];
				cols.push(new nlobjSearchColumn("locationquantityonhand"));
				cols.push(new nlobjSearchColumn("locationtotalvalue"));
				cols.push(new nlobjSearchColumn("locationaveragecost"));
				var results = nlapiSearchRecord("item",null,filters,cols);
				if(results)
				{
					nlapiSetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_qty_on_hand",results[0].getValue("locationquantityonhand"),true,true);
					nlapiSetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_current_value",results[0].getValue("locationtotalvalue"),true,true);
				}
				else
				{
					nlapiSetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_qty_on_hand",0,true,true);
					nlapiSetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_current_value",0,true,true);
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Pulling in Total Value and QOH","Details: " + err.message);
		}
	}
	else if(type=="recmachcustrecord_pia_parent" && (name=="custrecord_pia_adjust_qty_by"))
	{
		var adjQuantity = nlapiGetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_adjust_qty_by");
		var curQuantity = nlapiGetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_qty_on_hand");
		if(curQuantity==null || curQuantity=="")
			curQuantity = 0.00;
		
		var newQuantity = parseFloat(adjQuantity) + parseFloat(curQuantity);
		
		nlapiSetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_new_quantity",newQuantity,true,true);
		
		if(adjQuantity > 0)
		{
			nlapiDisableLineItemField("recmachcustrecord_pia_parent","custrecord_pia_est_unit_cost",false);
		}
		else
		{
			nlapiDisableLineItemField("recmachcustrecord_pia_parent","custrecord_pia_est_unit_cost",true);
			
			/*
			var filters = [];
			filters.push(new nlobjSearchFilter("internalid",null,"is",item));
			filters.push(new nlobjSearchFilter("inventorylocation",null,"is",location));
			var cols = [];
			cols.push(new nlobjSearchColumn("locationaveragecost"));
			var results = nlapiSearchRecord("item",null,filters,cols);
			if(results)
			{
				nlapiSetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_est_unit_cost",results[0].getValue("locationaveragecost"),true,true);
			}
			else
			{
				nlapiSetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_est_unit_cost",0,true,true);
			}
			*/
		}
		
		var item = nlapiGetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_line_item");
		var location = nlapiGetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_location");
		var currentValue = nlapiGetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_current_value");
		var qoh = nlapiGetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_qty_on_hand");
		
		if(qoh==null || qoh=="")
			qoh = 0.00;
			
		if(qoh > 0)
			var estUnitCost = currentValue / qoh;
		else
			var estUnitCost = 0.00;
		
		nlapiSetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_est_unit_cost",estUnitCost,true,true);
	}
	else if(type=="recmachcustrecord_pia_parent" && (name=="custrecord_pia_units"))
	{
		var unit = nlapiGetCurrentLineItemText("recmachcustrecord_pia_parent","custrecord_pia_units");
		nlapiLogExecution("debug","New Unit (string)",unit);
		
		if(unit!=null && unit!="")
		{
			if(unit=="Carat")
				unit = 1;
			else
				unit = unit.substring(0,unit.indexOf(" "));
			nlapiLogExecution("debug","New Unit (After Substring)",unit);
			
			unit = parseFloat(unit);
			
			if(unit!=null && unit!="")
			{
				var itemUnit = nlapiLookupField("item",nlapiGetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_line_item"),"saleunit",true);
				nlapiLogExecution("debug","Item Unit (nlapiLookupField)",itemUnit);
				
				//Convert back to base (1)
				if(itemUnit=="Carat")
					var carat = 1;
				else
					var carat = itemUnit.substring(0,itemUnit.indexOf(" "));
				nlapiLogExecution("debug","Item Unit (After Substring)",carat);
				
				carat = parseFloat(carat);
				
				if(carat == unit)
					return true;
				
				var base = 1 / carat;
				
				var baseQOH = parseFloat(nlapiGetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_qty_on_hand")) / base;
				nlapiLogExecution("debug","Base QOH",baseQOH);
				var baseAvgCost = parseFloat(nlapiGetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_est_unit_cost")) / base;
				nlapiLogExecution("debug","Base Avg Cost",baseAvgCost);
				
				var newQOH = baseQOH / unit;
				nlapiLogExecution("debug","New QOH",newQOH);
				nlapiSetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_qty_on_hand",newQOH,true,true);
				
				//var newAvgCost = baseAvgCost / unit;
				//nlapiLogExecution("debug","New Avg Cost",newAvgCost);
				//nlapiSetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_est_unit_cost",newAvgCost,true,true);
			}		
		}
	}
}

function Pending_IA_CS_Recalc(type)
{
	if(type=="recmachcustrecord_pia_parent")
	{
		var totalValue = 0.00;
		
		for(var x=0; x < nlapiGetLineItemCount("recmachcustrecord_pia_parent"); x++)
		{
			totalValue += (parseFloat(nlapiGetLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_adjust_qty_by",x+1)) * parseFloat(nlapiGetLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_est_unit_cost",x+1)));
		}
		
		nlapiSetFieldValue("custrecord_pia_est_total_value",totalValue,true,true);
	}
}


function Pending_IA_CS_PI()
{
	//nlapiDisableLineItemField("recmachcustrecord_pia_parent","custrecord_pia_est_unit_cost",true);
}

function Pending_IA_CS_LI(type)
{
	var adjQuantity = nlapiGetCurrentLineItemValue("recmachcustrecord_pia_parent","custrecord_pia_adjust_qty_by");
	if(adjQuantity < 0)
		nlapiDisableLineItemField("recmachcustrecord_pia_parent","custrecord_pia_est_unit_cost",true);
}
