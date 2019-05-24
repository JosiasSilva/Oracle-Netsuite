function Data_Save(datain) {
  try {
    nlapiLogExecution('DEBUG', "JSON ", JSON.stringify(datain));
    //var update_data = JSON.parse(datain);	 
    if (datain) {
	  var items = datain.items;
      var po = nlapiCreateRecord('purchaseorder');
      po.setFieldValue('entity', items[0].custpage_vendor);
      var vendor_po_notes = '';
      var date_needed_sf = '';
      var earliest_date;

      for (var i = 0; i < items.length; i++) {
        var   qty = items[i].custpage_amount_to_order;
        //Vendor Notes
        if (items[i].custpage_vendor_purchasing_notes) {
          if (!vendor_po_notes) {
            vendor_po_notes = items[i].custpage_item_name_number +' - '+ items[i].custpage_vendor_purchasing_notes;
          } else {
            vendor_po_notes = vendor_po_notes + '\n' +items[i].custpage_item_name_number +' - '+ items[i].custpage_vendor_purchasing_notes;
          }
        }

        // Date Needed in SF
        if (items[i].custpage_date_needed_in_sf) {
          date_needed_sf = new Date(items[i].custpage_date_needed_in_sf);

          if (earliest_date) {
            if (earliest_date > date_needed_sf) {
              earliest_date = date_needed_sf;
            }
          } else {
            earliest_date = date_needed_sf;
          }
        }

        var objItem=nlapiLoadRecord('inventoryitem',items[i].custpage_item_id);
        var category=objItem.getFieldValue('custitem20');
        //Commented as per NS-1207
       /* var unit_rate=objItem.getFieldValue('purchaseconversionrate');
        if (category == 1 || category  == 23 || category  == 30) {
          if(unit_rate)
          {
            qty=qty/unit_rate;
          }
        }*/

        po.selectNewLineItem('item');
        //var itemIdNo = 1093360; // Resize Ring
        po.setCurrentLineItemValue('item', 'item', items[i].custpage_item_id);
        po.setCurrentLineItemValue('item', 'quantity', qty);
		if(items[i].custpage_last_purchase_price!='' && items[i].custpage_last_purchase_price!=null)
		{
			po.setCurrentLineItemValue('item', 'rate', items[i].custpage_last_purchase_price);
		}
        po.commitLineItem('item');
	  }

      po.setFieldValue('custbodyvendor_email_notes', vendor_po_notes);
      po.setFieldValue('custbody_created_frm_gem_melee_dash', 'T');
      po.setFieldValue('custbody59', earliest_date);
      po.setFieldValue('custbody103', '1');// Not Yet Received
      var po_internal_id = nlapiSubmitRecord(po, false, true);
 	 
      nlapiLogExecution("Debug", "Information", "PO is created successfully");

    }

  } catch (er) {
    nlapiLogExecution('debug', 'Error', er.message);
  }
  return 'success';
}