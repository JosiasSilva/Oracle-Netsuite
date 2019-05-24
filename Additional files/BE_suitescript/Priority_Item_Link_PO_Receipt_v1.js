nlapiLogExecution("audit","FLOStart",new Date().getTime());
function change_inventory_status(type){
	if(type == 'create'){
		var itemReceiptID = nlapiGetRecordId(); //get record id
        var itemReceiptType =  nlapiGetRecordType(); //get record type
        var itemReceipt = nlapiLoadRecord(itemReceiptType, itemReceiptID); //get itemReceipt
        var PO_ID = itemReceipt.getFieldValue('createdfrom');
        try{
        	var PO = nlapiLoadRecord('purchaseorder', PO_ID); //get purchase order
        	var PO_item_count = PO.getLineItemCount('item');
			var link_PO_items = [];
			if(PO_item_count){
				for(var i=1;i<=PO_item_count;i++){
					var curr_item_stocknum = PO.getLineItemText('item', 'item', i);
					nlapiLogExecution('DEBUG','PO Item stocknum',curr_item_stocknum);
					if(curr_item_stocknum == "Estate Ring Repair ."||curr_item_stocknum == "Assemble Jewelry ."||curr_item_stocknum == "Repair Ring ."||curr_item_stocknum == "Resize Ring ."||curr_item_stocknum == "Independent Appraisal"){
						var curr_item_linkitem = PO.getLineItemValue('item','custcolitem_link',i);
						var curr_item_linkitem_receive = PO.getLineItemValue('item','quantityreceived',i);
						nlapiLogExecution('DEBUG','PO Item link',curr_item_linkitem);
						if(curr_item_linkitem_receive==1){
							link_PO_items.push(curr_item_linkitem);
						}	
					}
				}
				nlapiLogExecution('DEBUG','Create PO update items Internel Id',link_PO_items);
				change_item_status_set_po_link(link_PO_items);
			}
        }catch(e){
        	nlapiLogExecution('ERROR', 'Purchase Order Load ERROR '+e.getCode(), e.getDetails()); 
        }
	}
}
function change_item_status_set_po_link(link_PO_items){
	if(link_PO_items.length>0){
		for(var i=0;i<link_PO_items.length;i++){
			try{
				if(link_PO_items[i]){
					var curr_inventory_item = nlapiLoadRecord('inventoryitem',link_PO_items[i]);
					var curr_inventory_item_anti_status = curr_inventory_item.getFieldValue('custitem48');
					nlapiLogExecution('DEBUG','Antique Status',curr_inventory_item_anti_status);
					if(curr_inventory_item_anti_status != 15){
						curr_inventory_item.setFieldValue('custitem48',15);//set Estate Ring Repair Antique Status  "Pending Back End QA"	
					}
					submit_record(curr_inventory_item);
				}	
			}catch(e){
				nlapiLogExecution('ERROR','Change item Value ERROR '+ e.getCode(),e.getDetails() );
			}
		}
	}
}
function submit_record(record){
	try{
	    var id = nlapiSubmitRecord(record, true);
	    nlapiLogExecution('DEBUG', 'submitted id ', id);
	}catch(e){
	    nlapiLogExecution('ERROR',e.getCode(),e.getDetails() );
	}
}