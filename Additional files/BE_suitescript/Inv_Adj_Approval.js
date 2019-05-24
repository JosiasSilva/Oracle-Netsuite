function Inv_Adj_Approval(type)
{
	nlapiLogExecution("debug","Running Script. Type: " + type,"Context: " + nlapiGetContext().getExecutionContext());
	
	if(type=="create" || type=="edit" || type=="xedit")
	{
		try
		{
			var pia = nlapiGetNewRecord();
			var status = pia.getFieldValue("custrecord_pia_status");
			var linkedIA = pia.getFieldValue("custrecord_pia_inventory_adjustment_rec");
			
			nlapiLogExecution("debug","Pending IA Status",status);
			
			if(status=="2" && (linkedIA==null || linkedIA==""))
			{
				//Create inventory adjustment
				var filters = [];
				filters.push(new nlobjSearchFilter("custrecord_pia_parent",null,"is",nlapiGetRecordId()));
				var cols = [];
				cols.push(new nlobjSearchColumn("custrecord_pia_line_item"));
				cols.push(new nlobjSearchColumn("custrecord_pia_location"));
				cols.push(new nlobjSearchColumn("custrecord_pia_units"));
				cols.push(new nlobjSearchColumn("custrecord_pia_adjust_qty_by"));
				cols.push(new nlobjSearchColumn("custrecord_pia_est_unit_cost"));
				cols.push(new nlobjSearchColumn("custrecord_pia_memo"));
				var results = nlapiSearchRecord("customrecord_pia_line",null,filters,cols);
				if(results)
				{
					var ia = nlapiCreateRecord("inventoryadjustment",{recordmode:"dynamic"});
					ia.setFieldValue("trandate",pia.getFieldValue("custrecord_pia_date"));
					ia.setFieldValue("account",pia.getFieldValue("custrecord_pia_adjustment_account"));
					ia.setFieldValue("memo",pia.getFieldValue("custrecord_pia_header_memo"));
					
					for(var x=0; x < results.length; x++)
					{
						ia.selectNewLineItem("inventory");
						ia.setCurrentLineItemValue("inventory","item",results[x].getValue("custrecord_pia_line_item"));
						ia.setCurrentLineItemValue("inventory","location",results[x].getValue("custrecord_pia_location"));
						if(results[x].getValue("custrecord_pia_units")!=null && results[x].getValue("custrecord_pia_units")!="")
							ia.setCurrentLineItemValue("inventory","units",results[x].getValue("custrecord_pia_units"));
						ia.setCurrentLineItemValue("inventory","adjustqtyby",results[x].getValue("custrecord_pia_adjust_qty_by"));
						if(results[x].getValue("custrecord_pia_adjust_qty_by") > 0)
							ia.setCurrentLineItemValue("inventory","unitcost",results[x].getValue("custrecord_pia_est_unit_cost"));
						ia.setCurrentLineItemValue("inventory","memo",results[x].getValue("custrecord_pia_memo"));
						ia.commitLineItem("inventory");
					}
					
					var iaId = nlapiSubmitRecord(ia,true,true);
					
					//Write IA internal ID back to PIA record
					nlapiSubmitField("customrecord_pending_inventory_adj",nlapiGetRecordId(),"custrecord_pia_inventory_adjustment_rec",iaId);
				}
				else
				{
					nlapiLogExecution("debug","No Results Found");
				}
			}
		}
		catch(err)
		{
			nlapiLogExecution("error","Error Creating IA Transaction","Details: " + err.message);
		}
	}
}
