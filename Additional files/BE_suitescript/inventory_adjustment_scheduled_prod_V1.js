function adjust_inventory_scheduled(){
	try{
		var mySearch = nlapiLoadSearch(null, 8389); // For Production
		nlapiLogExecution('DEBUG', 'My search',mySearch);
        var searchresult = [];
        var resultset = mySearch.runSearch();
        var searchid = 0;
		do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
          //var resultslice = resultset.getResults(searchid, 15);
            if (resultslice != null && resultslice != '') {
                for (var rs in resultslice) {
                    searchresult.push(resultslice[rs]);
                    searchid++;
                }
            }
        } while (resultslice.length >= 1000);
        var searchCount = searchresult.length;
		nlapiLogExecution('DEBUG','Search count',searchCount);
		if (searchCount > 0){
			var col = searchresult[0].getAllColumns();
			var tot_est_value=0;
			var today_date=new Date();	
			today_date=nlapiDateToString(today_date);
			var inventory_adjustment=nlapiCreateRecord('customrecord_pending_inventory_adj');
			inventory_adjustment.setFieldValue('custrecord_pia_adjustment_account',184);
			inventory_adjustment.setFieldValue('custrecord_pia_header_memo',today_date +' '+ 'Auto adjust service lines');
			for (var j = 0; j < searchresult.length; j++){
				RescheduleScript();
				var qty_to_be_adjust='';
				var item_id=searchresult[j].getId();
				var location_id=searchresult[j].getValue(col[1]);
				var inventory_on_hand=searchresult[j].getValue(col[2]);
				qty_to_be_adjust=inventory_on_hand.split('-');
				qty_to_be_adjust=qty_to_be_adjust[1];
				var avg_unit_cost=searchresult[j].getValue(col[3]);	
				var new_qty=parseInt(inventory_on_hand) + parseInt(qty_to_be_adjust);
				var current_value=(qty_to_be_adjust*avg_unit_cost).toFixed(2);	
				tot_est_value=parseFloat(tot_est_value) + parseFloat(current_value);         
				inventory_adjustment.selectNewLineItem('recmachcustrecord_pia_parent');
				inventory_adjustment.setCurrentLineItemValue('recmachcustrecord_pia_parent','custrecord_pia_line_item',item_id);
				inventory_adjustment.setCurrentLineItemValue('recmachcustrecord_pia_parent','custrecord_pia_location',location_id);
				inventory_adjustment.setCurrentLineItemValue('recmachcustrecord_pia_parent','custrecord_pia_adjust_qty_by',qty_to_be_adjust);
				inventory_adjustment.setCurrentLineItemValue('recmachcustrecord_pia_parent','custrecord_pia_qty_on_hand',inventory_on_hand);
				inventory_adjustment.setCurrentLineItemValue('recmachcustrecord_pia_parent','custrecord_pia_new_quantity',new_qty);
				inventory_adjustment.setCurrentLineItemValue('recmachcustrecord_pia_parent','custrecord_pia_est_unit_cost',avg_unit_cost);
				inventory_adjustment.setCurrentLineItemValue('recmachcustrecord_pia_parent','custrecord_pia_current_value',current_value);				
				inventory_adjustment.commitLineItem('recmachcustrecord_pia_parent');
			}
				inventory_adjustment.setFieldValue('custrecord_pia_est_total_value',tot_est_value);
				var inventory_adjustment_id=nlapiSubmitRecord(inventory_adjustment,true,true);	
				nlapiLogExecution("debug","created Inventory Adjustment Id is",inventory_adjustment_id);
				/*if(inventory_adjustment_id){
					var inventory_adjustment_obj=nlapiLoadRecord('inventoryadjustment',inventory_adjustment_id);
					for(var i=1;i<=inventory_adjustment_obj.getLineItemCount('inventory');i++){
						var current_value=inventory_adjustment_obj.getLineItemValue('inventory','currentvalue',i);
						if(current_value<=500){
							nlapiSubmitField('inventoryadjustment',inventory_adjustment_id,'custbody_adjustment_status',2);
						}
						else if(current_value>500){
							nlapiSubmitField('inventoryadjustment',inventory_adjustment_id,'custbody_adjustment_status',1);
						}
					}					
				}*/
			//}
		}
	}
	catch(ee){
		nlapiLogExecution("debug","Error Occuring While Scheduling",ee.message);
	}
}

//Rescheduling Concept
function RescheduleScript()
{
	try
	{
		var context = nlapiGetContext();
		if (context.getRemainingUsage() <= 500)
		{
			var stateMain = nlapiYieldScript();
			if( stateMain.status == 'FAILURE')
			{
				//nlapiLogExecution("debug","Failed to yield script (do-while), exiting: Reason = "+ stateMain.reason + " / Size = "+ stateMain.size);
				throw "Failed to yield script";
			}
			else if ( stateMain.status == 'RESUME' )
			{
				//nlapiLogExecution("debug", "Resuming script (do-while) because of " + stateMain.reason+". Size = "+ stateMain.size);
			}
		}
	}
	catch(e)
	{
		if (e instanceof nlobjError)
		{
			nlapiLogExecution('debug', 'System Error', e.getCode() + '\n' + e.getDetails());
		}
		else
		{
			nlapiLogExecution('debug', 'Unexpected Error', e.toString());
		}
	}
}