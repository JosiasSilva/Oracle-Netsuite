nlapiLogExecution("audit","FLOStart",new Date().getTime());
function priority_PD_PO_Link_Item_Edit(type,form)
{
    if(type=='edit' || type=='create'){
		var context = nlapiGetContext();
		var exeContext = context.getExecutionContext();
		if(exeContext=='custommassupdate')
		{
			nlapiLogExecution('debug','Triggered by Mass Update','Exiting script.');
			return true;
		}
		
         nlapiLogExecution("Debug","PD PO Link value:","test");
		var Item_ID = nlapiGetRecordId(); //get record id
        var Item_Type =  nlapiGetRecordType(); //get record type
	   try{
        var Item = nlapiLoadRecord(Item_Type, Item_ID); //get item record

			var old_Item = nlapiGetOldRecord();//get the old record 
		var category = Item.getFieldText('custitem20');
        if(category=='Setting with large center stone'||category=='Ring with no large center stone')
		{
			////////////////////category begin////////////////////////////
			var pD_PO_Link = Item.getFieldText('custitemcustitem_pd_po_link');
			var pD_PO_Link_Value = Item.getFieldValue('custitemcustitem_pd_po_link');

				var old_PD_PO_Link_Value = old_Item.getFieldValue('custitemcustitem_pd_po_link');

nlapiLogExecution("Debug","Category value:",category);
				nlapiLogExecution("Debug","PD PO Link value:",pD_PO_Link);
				nlapiLogExecution("Debug","PD PO Link value:",pD_PO_Link_Value);
				nlapiLogExecution("Debug","PD PO Link value equal null:",pD_PO_Link!=null);
				nlapiLogExecution("Debug","PD PO Link value equal null:",pD_PO_Link=='');
			nlapiLogExecution("Debug","PD PO Link value equal null:",pD_PO_Link_Value==null);

       nlapiLogExecution("Debug","Old PD PO Link value equal null:",old_PD_PO_Link_Value==null);
			if(pD_PO_Link_Value != null)
			{
				//////////////////PD PO Link not equal null//////////////////////
				var Record_Type = 'purchaseorder';//set record type
				var Record_ID = pD_PO_Link_Value;//set record id

				var Purchase = nlapiLoadRecord(Record_Type,Record_ID);
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
				var desApprStatus = Purchase.getFieldText('custbody41');


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

			if(minctwt!=null && minctwt!='')
                Item.setFieldValue('custitemcustitem_min_ct_wt',minctwt);
			//else
			//	Item.setFieldValue('custitemcustitem_min_ct_wt',null);


				//if(status=='Pending Bill' || desApprStatus == 'Finished Custom Pending Approval')
				if(desApprStatus == 'Finished Item Approved'&&old_PD_PO_Link_Value == null)//Finished Custom Pending Approval
				{
	                var photograph = Item.getFieldText('custitem85');
					if(photograph!='To Be Photographed'){
	                   Item.setFieldText('custitem85','To Be Photographed');
					}
				}

				if(desApprStatus == 'Finished Item Approved'&&old_PD_PO_Link_Value != pD_PO_Link_Value)//Finished Custom Pending Approval
				{
	                var photograph = Item.getFieldText('custitem85');
					if(photograph!='To Be Photographed'){
	                   Item.setFieldText('custitem85','To Be Photographed');
					}
				}

				try{
					var id = nlapiSubmitRecord(Item, true);
					nlapiLogExecution('DEBUG', 'submitted id ', id);
					}catch(e){
					nlapiLogExecution('ERROR',e.getCode(),e.getDetails() );
				 }
				////////////////////PD PO Link not equal null////////////////////
			}
	    /////////////////////////category end////////////////////////////
		}
             }catch(err){
		nlapiLogExecution("error", "Item Error", "Item Error Details: " + err.message);
            }
	}
}