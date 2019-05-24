nlapiLogExecution("audit","FLOStart",new Date().getTime());
function change_item_status_linkPO_cost(type){
	if(type == 'create'){
		var item_ID = nlapiGetRecordId(); //get record id
	    var item_Type = nlapiGetRecordType(); //get record type
	    var PO = nlapiLoadRecord(item_Type, item_ID); //get purchase
	    nlapiLogExecution('DEBUG', 'Record ID and Type', item_ID + "  " + item_Type);
		var PO_item_count = PO.getLineItemCount('item');
		var link_PO_items = [];// store the item link inventoryitem to update
		var pattern = /^be[125].*/im;//judge the item category is not BE1 ,BE2,BE5
		if(PO_item_count){
			for(var i=1;i<=PO_item_count;i++){
				var curr_item_stocknum = PO.getLineItemText('item', 'item', i);
				nlapiLogExecution('DEBUG','PO Item stocknum',curr_item_stocknum);
				if(curr_item_stocknum == "Estate Ring Repair ."||curr_item_stocknum == "Assemble Jewelry ."||curr_item_stocknum == "Repair Ring ."||curr_item_stocknum == "Resize Ring ."||curr_item_stocknum == "Independent Appraisal"){
					var curr_item_linkitem = PO.getLineItemValue('item','custcolitem_link',i);
					var curr_item_linkitem_stocknum = PO.getLineItemText('item','custcolitem_link',i);
					nlapiLogExecution('DEBUG','PO Item link',curr_item_linkitem_stocknum+": "+curr_item_linkitem);
					var result = pattern.test(curr_item_linkitem_stocknum);
					if(!result){
						link_PO_items.push(curr_item_linkitem);
					}
					else {
						//Added to allow Modern Estate collection to run through script and update item records
						var item_fields = nlapiLookupField("item",PO.getLineItemValue('item', 'item', i),["custitem20","custitem60"]);
						if(item_fields.custitem20=="24" && item_fields.custitem60=="Modern Estate")
							link_PO_items.push(curr_item_linkitem);
					}
				}
			}
			nlapiLogExecution('DEBUG','Create PO update items Internel Id',link_PO_items);
			change_item_status_set_po_link(link_PO_items,item_ID);
		}
	}
	if(type == 'edit'){
		var item_ID = nlapiGetRecordId(); //get record id
	    var item_Type = nlapiGetRecordType(); //get record type
	    var PO = nlapiLoadRecord(item_Type, item_ID); //get purchase
	    nlapiLogExecution('DEBUG', 'Record ID and Type', item_ID + "  " + item_Type);
	    var pattern = /^be[125].*/im;//judge the item category is not BE1 ,BE2,BE5
		var Old_PO = nlapiGetOldRecord();
		var PO_item_count = PO.getLineItemCount('item');
		nlapiLogExecution('DEBUG', 'New Items Length', PO_item_count);
		var link_PO_items = [];
		var Old_PO_item_count = Old_PO.getLineItemCount('item');
		nlapiLogExecution('DEBUG', 'Old Items Length', Old_PO_item_count);
		var Old_link_PO_items = [];
		if(PO_item_count){
			for(var i=1;i<=PO_item_count;i++){
				var curr_item_stocknum = PO.getLineItemText('item','item',i);
				if(curr_item_stocknum == "Estate Ring Repair ."||curr_item_stocknum == "Assemble Jewelry ."||curr_item_stocknum == "Repair Ring ."||curr_item_stocknum == "Resize Ring ."||curr_item_stocknum == "Independent Appraisal"){
					var curr_item_linkitem = PO.getLineItemValue('item','custcolitem_link',i);
					var curr_item_linkitem_stocknum = PO.getLineItemText('item','custcolitem_link',i);
					nlapiLogExecution('DEBUG','PO Item link',curr_item_linkitem_stocknum+": "+curr_item_linkitem);
					if(curr_item_linkitem_stocknum){
						var result = pattern.test(curr_item_linkitem_stocknum);
						if(!result){
							link_PO_items.push(curr_item_linkitem);
						}	
					}
				}
			}
		}
		nlapiLogExecution('DEBUG','Now Link PO Item ',link_PO_items);
		if(Old_PO_item_count){
			for(var i=1;i<=Old_PO_item_count;i++){
				var curr_item_stocknum = Old_PO.getLineItemText('item','item',i);
				if(curr_item_stocknum == "Estate Ring Repair ."||curr_item_stocknum == "Assemble Jewelry ."||curr_item_stocknum == "Repair Ring ."||curr_item_stocknum == "Resize Ring ."||curr_item_stocknum == "Independent Appraisal"){
					var curr_old_item_linkitem = Old_PO.getLineItemValue('item','custcolitem_link',i);
					var curr_old_item_linkitem_stocknum = Old_PO.getLineItemText('item','custcolitem_link',i);
					nlapiLogExecution('DEBUG','Old PO Item link', curr_old_item_linkitem_stocknum+": "+curr_old_item_linkitem);
					if(curr_old_item_linkitem_stocknum){
						var old_result = pattern.test(curr_old_item_linkitem_stocknum);
						if(!old_result){
							Old_link_PO_items.push(curr_old_item_linkitem);
						}	
					}	
				}	
			}
		}
		nlapiLogExecution('DEBUG','Old Link PO Item ',Old_link_PO_items);

	nlapiLogExecution('DEBUG','Old Link PO Item Should Remove ',Old_link_PO_items);
		nlapiLogExecution('DEBUG','New Link PO Item Should Add ',link_PO_items);
		////////////////delete redundant items//////////////////////////
		for(var i = 0; i < Old_link_PO_items.length; i++){
			for(var j = i + 1; j < Old_link_PO_items.length; j++){
				if(Old_link_PO_items[i] == Old_link_PO_items[j]){
					Old_link_PO_items.splice(j,1);
					j--;
	            }
	        }
	    }
		for(var i = 0; i < link_PO_items.length; i++){
			for(var j = i + 1; j < link_PO_items.length; j++){
				if(link_PO_items[i] == link_PO_items[j]){
					link_PO_items.splice(j,1);
					j--;
	            }
	        }
	    }
		////////////////delete redundant items//////////////////////////

		for(var i=0;i<Old_link_PO_items.length;i++){
			var curr_inventory = Old_link_PO_items[i];
			for(var j=0;j<link_PO_items.length;j++){
				if(curr_inventory == link_PO_items[j]){
					Old_link_PO_items.splice(i,1);
					link_PO_items.splice(j,1);
					i--;
					break;
				}
			}
		}
		nlapiLogExecution('DEBUG','Old Link PO Item Should Remove ',Old_link_PO_items);
		nlapiLogExecution('DEBUG','New Link PO Item Should Add ',link_PO_items);
		remove_inventory_item_PO_cost_link(Old_link_PO_items,item_ID);
		change_item_status_set_po_link(link_PO_items,item_ID);
	}
}
function change_item_status_set_po_link(link_PO_items,item_ID){
	if(link_PO_items.length>0){
		for(var i=0;i<link_PO_items.length;i++){
			try{
				if(link_PO_items[i]){
					var curr_inventory_item = nlapiLoadRecord('inventoryitem',link_PO_items[i]);
					var curr_inventory_item_PO = [];
					var curr_inventory_item_PO_setTimes = [];
					var PO_link_in_inventory_flag = false;
					//set inventory item anti status
					var curr_inventory_item_anti_status = curr_inventory_item.getFieldValue('custitem48');
					var curr_inventory_item_on_website = curr_inventory_item.getFieldValue('custitem47');//get the field value "On Website"
					nlapiLogExecution('DEBUG','On Website',curr_inventory_item_on_website);
					//if On Website is "On Website" dones't change the anti status
					if(curr_inventory_item_on_website != 5){
						if(curr_inventory_item_anti_status != 2){
							curr_inventory_item.setFieldValue('custitem48',2);//set Estate Ring Repair Antique Status  "Being Repaired."	
						}
					}
					nlapiLogExecution('DEBUG','Antique Status',curr_inventory_item_anti_status);
					var curr_inventory_item_PO1 = curr_inventory_item.getFieldValue('custitem142');//get the PO1 value
					var curr_inventory_item_PO1_Entry_Time = curr_inventory_item.getFieldValue('custitem148');//get the set PO1 Field Time
					if(curr_inventory_item_PO1){
						curr_inventory_item_PO.push(curr_inventory_item_PO1);
						curr_inventory_item_PO_setTimes.push(curr_inventory_item_PO1_Entry_Time);
					}
					var curr_inventory_item_PO2 = curr_inventory_item.getFieldValue('custitem144');//get the PO2 value
					var curr_inventory_item_PO2_Entry_Time = curr_inventory_item.getFieldValue('custitem149');//get the set PO2 Field Time
					if(curr_inventory_item_PO2){
						curr_inventory_item_PO.push(curr_inventory_item_PO2);
						curr_inventory_item_PO_setTimes.push(curr_inventory_item_PO2_Entry_Time);
					}
					var curr_inventory_item_PO3 = curr_inventory_item.getFieldValue('custitem146');//get the PO3 value
					var curr_inventory_item_PO3_Entry_Time = curr_inventory_item.getFieldValue('custitem150');//get the set PO3 Field Time
					if(curr_inventory_item_PO3){
						curr_inventory_item_PO.push(curr_inventory_item_PO3);
						curr_inventory_item_PO_setTimes.push(curr_inventory_item_PO3_Entry_Time);
					}
					nlapiLogExecution('DEBUG','Item and Item status',link_PO_items[i] +'--->'+ curr_inventory_item_anti_status);
					nlapiLogExecution('DEBUG','Item and Item PO1',link_PO_items[i] +'--->'+ curr_inventory_item_PO1 +'--->'+curr_inventory_item_PO1_Entry_Time);
					nlapiLogExecution('DEBUG','Item and Item PO2',link_PO_items[i] +'--->'+ curr_inventory_item_PO2 +'--->'+curr_inventory_item_PO2_Entry_Time);
					nlapiLogExecution('DEBUG','Item and Item PO3',link_PO_items[i] +'--->'+ curr_inventory_item_PO3 +'--->'+curr_inventory_item_PO3_Entry_Time);
					var NowTime = new Date(); //get curr Time
					var NowTimeToString = nlapiDateToString(NowTime);
					nlapiLogExecution('DEBUG','Curr Date',NowTime);
					for(var j=0;j<curr_inventory_item_PO.length;j++){
						if(item_ID == curr_inventory_item_PO[j]){
							PO_link_in_inventory_flag = true;
							if(nlapiStringToDate(curr_inventory_item_PO_setTimes[j])< NowTime){
								if(curr_inventory_item.getFieldValue('custitem142') == item_ID){
									curr_inventory_item.setFieldValue('custitem148',NowTimeToString);
								}else if(curr_inventory_item.getFieldValue('custitem144') == item_ID){
									curr_inventory_item.setFieldValue('custitem149',NowTimeToString);
								}else if(curr_inventory_item.getFieldValue('custitem146') == item_ID){
									curr_inventory_item.setFieldValue('custitem150',NowTimeToString);
								}
							}
						}
					}
					nlapiLogExecution('DEBUG','Flag',PO_link_in_inventory_flag);
					if(!PO_link_in_inventory_flag){
						if(!curr_inventory_item_PO1){
							curr_inventory_item.setFieldValue('custitem142',item_ID);
							curr_inventory_item.setFieldValue('custitem148',NowTimeToString);
						}else if(!curr_inventory_item_PO2){
							curr_inventory_item.setFieldValue('custitem144',item_ID);
							curr_inventory_item.setFieldValue('custitem149',NowTimeToString);
						}else if(!curr_inventory_item_PO3){
							curr_inventory_item.setFieldValue('custitem146',item_ID);
							curr_inventory_item.setFieldValue('custitem150',NowTimeToString);
						}
					}
					// if the PO is all set remove the long ago one and set the last PO#
					if(curr_inventory_item_PO.length == 3){
						var sort_inventory_item_PO_dates = [];
						sort_inventory_item_PO_dates.push({name:'custitem148',date:nlapiStringToDate(curr_inventory_item.getFieldValue('custitem148'))});
						sort_inventory_item_PO_dates.push({name:'custitem149',date:nlapiStringToDate(curr_inventory_item.getFieldValue('custitem149'))});
						sort_inventory_item_PO_dates.push({name:'custitem150',date:nlapiStringToDate(curr_inventory_item.getFieldValue('custitem150'))});
						sort_inventory_item_PO_dates.sort(campare_nums);
						nlapiLogExecution('DEBUG','Curr Item Dates',sort_inventory_item_PO_dates);
						var inventory_entry_time_field = sort_inventory_item_PO_dates[0].name;
						nlapiLogExecution('DEBUG','Longest Item Entry Dates',inventory_entry_time_field);
						if(inventory_entry_time_field == 'custitem148'){
							curr_inventory_item.setFieldValue('custitem142',item_ID);
							curr_inventory_item.setFieldValue('custitem148',NowTimeToString);
							curr_inventory_item.setFieldValue('custitem143','');
						}else if(inventory_entry_time_field == 'custitem149'){
							curr_inventory_item.setFieldValue('custitem144',item_ID);
							curr_inventory_item.setFieldValue('custitem149',NowTimeToString);
							curr_inventory_item.setFieldValue('custitem145','');
						}else if(inventory_entry_time_field == 'custitem150'){
							curr_inventory_item.setFieldValue('custitem146',item_ID);
							curr_inventory_item.setFieldValue('custitem150',NowTimeToString);
							curr_inventory_item.setFieldValue('custitem147','');
						}						
					}
					submit_record(curr_inventory_item);
				}	
			}catch(e){
				nlapiLogExecution('ERROR','Change item Value ERROR '+ e.getCode(),e.getDetails() );
			}
		}
	}
}
//Remove the "Purchase order #" and "Bill State"
function remove_inventory_item_PO_cost_link(Old_link_PO_items,item_ID){
	if(Old_link_PO_items.length>0){
		for(var i=0;i<Old_link_PO_items.length;i++){
			try{
				if(Old_link_PO_items[i]){
					var curr_inventory_item = nlapiLoadRecord('inventoryitem',Old_link_PO_items[i]);
					var curr_inventory_item_PO1 = curr_inventory_item.getFieldValue('custitem142');//get the PO1 value
					if(curr_inventory_item_PO1 == item_ID){
						curr_inventory_item.setFieldValue('custitem142','');//remove PO# 1
						curr_inventory_item.setFieldValue('custitem148','');//remove PO# 1set date
						curr_inventory_item.setFieldValue('custitem143','');//Item Link PO Cost 1
					}
					var curr_inventory_item_PO2 = curr_inventory_item.getFieldValue('custitem144');//get the PO1 value
					if(curr_inventory_item_PO2 == item_ID){
						curr_inventory_item.setFieldValue('custitem144','');
						curr_inventory_item.setFieldValue('custitem149','');
						curr_inventory_item.setFieldValue('custitem145','');
					}
					var curr_inventory_item_PO3 = curr_inventory_item.getFieldValue('custitem146');//get the PO1 value
					if(curr_inventory_item_PO3 == item_ID){
						curr_inventory_item.setFieldValue('custitem146','');
						curr_inventory_item.setFieldValue('custitem150','');
						curr_inventory_item.setFieldValue('custitem147','');
					}
					nlapiLogExecution('DEBUG','Item and Item PO1',Old_link_PO_items[i] +'--->'+ curr_inventory_item_PO1);
					nlapiLogExecution('DEBUG','Item and Item PO2',Old_link_PO_items[i] +'--->'+ curr_inventory_item_PO2);
					nlapiLogExecution('DEBUG','Item and Item PO3',Old_link_PO_items[i] +'--->'+ curr_inventory_item_PO3);
					submit_record(curr_inventory_item);
				}	
			}catch(e){
				nlapiLogExecution('ERROR','Change item status ERROR '+ e.getCode(),e.getDetails() );
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
function campare_nums(object1,object2){
	var value1 = object1.date;
	var value2 = object2.date;
    if(value1>value2){
        return 1;
    }else if(value1<value2){
        return -1;
    }else if(value1==value2){
        return 0;
    }
}