function quantity_sum_on_IA(type){
	try{
	if(type=='create' || type=='edit'){
			var IA_id=nlapiGetRecordId();
			var item_count=0;
			var qty_adjust=0;
			var IA_obj=nlapiLoadRecord('inventoryadjustment',IA_id);
			item_count=IA_obj.getLineItemCount('inventory');
			if(item_count!=0){
				for(var i=1;i<=item_count;i++){
					var adjust_qty=IA_obj.getLineItemValue('inventory','adjustqtyby',i);
					qty_adjust=parseInt(qty_adjust)+parseInt(adjust_qty);
				}
			}
			nlapiLogExecution("debug","Item_count is",item_count);
			nlapiLogExecution("debug","qty_adjust is",qty_adjust);
			nlapiSubmitField("inventoryadjustment",IA_id,["custbody_number_of_items","custbody_sum_adjusted"],[item_count,qty_adjust]);
		}		
	}
	catch(ee){
		nlapiLogExecution("debug","Error Occuring while Submit",ee.message);
	}
}