function priority_PD_PO_Link_PO_Edit(type,form)
{
    if(type=='edit'){
		var Purchase_ID = nlapiGetRecordId(); //get record id
		
        var Purchase = nlapiGetNewRecord(); //get item record
        
		//Get fields from PO
		var gender = Purchase.getFieldText('custbodycustbody_gender');
		var finish = Purchase.getFieldText('custbodyfinish');
		var typeOfSetting = Purchase.getFieldText('custbodycustbody_type_of_setting');
		var centerStones = Purchase.getFieldText('custbodycustbodycenter_stones_avail');
		var notesForCopy = Purchase.getFieldValue('custbodycustbody_notes_for_copy');
		var shippingDays = Purchase.getFieldValue('custbodycustbody_shipping_days');
		var engravedStyle = Purchase.getFieldValue('custbodycustbody_engraved_style');
		var msSentFromSf = Purchase.getFieldValue('custbodycustbody_ms_sent_from_sf');
		var depth = Purchase.getFieldValue('custbody191');
		var width = Purchase.getFieldValue('custbody192');
		var minctwt = Purchase.getFieldValue('custbodycustbody_min_ct_wt');
		var status = Purchase.getFieldValue('status');
		var desApprStatus = Purchase.getFieldValue('custbody41');
		
		nlapiLogExecution("Debug","PO Gender value:",gender);
		nlapiLogExecution("Debug","PO Finish value:",finish);
		nlapiLogExecution("Debug","PO Type Of Setting value:",typeOfSetting);
		nlapiLogExecution("Debug","PO Center Stones Available value:",centerStones);
		nlapiLogExecution("Debug","PO Notes For Copy value:",notesForCopy);
		nlapiLogExecution("Debug","PO Shipping Days value:",shippingDays);
		nlapiLogExecution("Debug","PO Engraved Style value:",engravedStyle);
		nlapiLogExecution("Debug","PO Melee/slides sent from SF value:",msSentFromSf);
		nlapiLogExecution("Debug","PO Depth from SF value:",depth);
		nlapiLogExecution("Debug","PO Width value:",width);
		nlapiLogExecution("Debug","PO Min Ct. Wt. value:",minctwt);
		nlapiLogExecution("Debug","PO Order Status value:",status);
		nlapiLogExecution("Debug","PO Design Approval Status value:",desApprStatus);

        var filters = [];
		filters.push(new nlobjSearchFilter('custitemcustitem_pd_po_link',null,'is',Purchase_ID));
		filters.push(new nlobjSearchFilter('parent',null,'anyof','@NONE@'));
		var cols = [];
		cols.push(new nlobjSearchColumn('internalid'));//internalid
		cols.push(new nlobjSearchColumn('parent'));//Subitem of

		var results =  nlapiSearchRecord('inventoryitem', null, filters, cols);
        if(results)
		{
			for(var i = 0; results != null && i < results.length; i++)
			{
				var res = results[i];
				var internalId = res.getValue('internalid');
				var parentItem = res.getValue('parent');//new add
				if(parentItem!=null && parentItem!='')
					continue;
				var Item = nlapiLoadRecord('inventoryitem',internalId);
				nlapiLogExecution('DEBUG','internal id',internalId);

				if(gender!=null)
					Item.setFieldText('custitem3',gender);
				else
					Item.setFieldText('custitem3','');
	
				if(finish!=null)
					Item.setFieldText('custitemcustitem_finish',finish);
				else
					Item.setFieldText('custitemcustitem_finish','');
	
				if(typeOfSetting!=null)
					Item.setFieldText('custitem6',typeOfSetting);
				else
				    Item.setFieldText('custitem6','');
	
				if(centerStones!=null)
					Item.setFieldText('custitemcenter_stones_available',centerStones);
				else
					Item.setFieldText('custitemcenter_stones_available','');

				if(notesForCopy!=null)
					Item.setFieldValue('custitem141',notesForCopy);
				else
					Item.setFieldValue('custitem141',notesForCopy);
	
				if(shippingDays!=null)
					Item.setFieldValue('custitemshipping_days',shippingDays);
				else
					Item.setFieldValue('custitemshipping_days',null);
	
				if(engravedStyle!=null)
					Item.setFieldValue('custitemengraved_style',engravedStyle);

				if(msSentFromSf!=null)
					Item.setFieldValue('custitemmelee_sides_sent_from_sf',msSentFromSf);
	
				if(depth!=null)
					Item.setFieldValue('custitem17',depth);
				else
					Item.setFieldValue('custitem17',depth);
	
				if(width!=null)
					Item.setFieldValue('custitem15',width);
				else
	                Item.setFieldValue('custitem15',null);
				if(minctwt!=null)
	                Item.setFieldValue('custitemcustitem_min_ct_wt',minctwt);
				else
					Item.setFieldValue('custitemcustitem_min_ct_wt',null);
	
				if(desApprStatus == '35' && nlapiGetOldRecord().getFieldValue('custbody41')!='35') //Finished Item Approved (35)
				{
	                var photograph = Item.getFieldText('custitem85');
					if(photograph!='To Be Photographed'){
	                   Item.setFieldText('custitem85','To Be Photographed');
					}
				}
	
				submit_record(Item);//update the item

			} //end for

		} //end if

	}
}

/////////////submit the item///////////////////////
function submit_record(record){
	try{
	    var id = nlapiSubmitRecord(record, true);
	    nlapiLogExecution('DEBUG', 'submitted id ', id);
	}catch(e){
	    nlapiLogExecution('ERROR',e.getCode(),e.getDetails() );
	}
}