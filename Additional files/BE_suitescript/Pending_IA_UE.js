function Pending_IA_UE_BS(type)
{
	if(type=="create")
	{
		try
		{
			var iaLine = nlapiGetNewRecord();
			
			var item = iaLine.getFieldValue("custrecord_pia_line_item");
			var location = iaLine.getFieldValue("custrecord_pia_location");
			
			var qtyOnHand = iaLine.getFieldValue("custrecord_pia_qty_on_hand");
			var currentValue = iaLine.getFieldValue("custrecord_pia_current_value");
			
			if((qtyOnHand==null || qtyOnHand=="") && (currentValue==null || currentValue==""))
			{
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
						qtyOnHand = parseFloat(results[0].getValue("locationquantityonhand"));
						currentValue = parseFloat(results[0].getValue("locationtotalvalue"));
						
						nlapiSetFieldValue("custrecord_pia_qty_on_hand",results[0].getValue("locationquantityonhand"),true,true);
						nlapiSetFieldValue("custrecord_pia_current_value",results[0].getValue("locationtotalvalue"),true,true);
					}
					else
					{
						qtyOnHand = 0;
						currentValue = 0;
		
						nlapiSetFieldValue("custrecord_pia_qty_on_hand",0,true,true);
						nlapiSetFieldValue("custrecord_pia_current_value",0,true,true);
					}
					
					var adjQuantity = iaLine.getFieldValue("custrecord_pia_adjust_qty_by");
					var curQuantity = qtyOnHand;
					if(curQuantity==null || curQuantity=="")
						curQuantity = 0.00;
						
					var newQuantity = parseFloat(adjQuantity) + parseFloat(curQuantity);
					
					nlapiSetFieldValue("custrecord_pia_new_quantity",newQuantity,true,true);
					
					if(qtyOnHand > 0)
						var estUnitCost = currentValue / qtyOnHand;
					else
						var estUnitCost = 0.00;
					
					nlapiSetFieldValue("custrecord_pia_est_unit_cost",estUnitCost,true,true);
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Setting Pending IA Line Values","Details: " + err.message);
		}
	}
}

function Pending_IA_UE_AS(type)
{
	if(type=="create")
	{
		if(nlapiGetContext().getExecutionContext()!="userinterface")
		{
			try
			{
				var iaLine = nlapiGetNewRecord();
				var parent = iaLine.getFieldValue("custrecord_pia_parent");
				
				var filters = [];
				filters.push(new nlobjSearchFilter("custrecord_pia_parent",null,"is",parent));
				var cols = [];
				var totalCol = new nlobjSearchColumn("formulanumeric",null,"sum");
				totalCol.setFormula("NVL({custrecord_pia_adjust_qty_by},0) * NVL({custrecord_pia_est_unit_cost},0)");
				cols.push(totalCol);
				var results = nlapiSearchRecord("customrecord_pia_line",null,filters,cols);
				if(results)
				{
					nlapiSubmitField("customrecord_pending_inventory_adj",parent,"custrecord_pia_est_total_value",results[0].getValue(totalCol));
				}
			}
			catch(err)
			{
				nlapiLogExecution("error","Error Updating PIA Total","Details: " + err.message);
			}
		}
	}
}
