function bindItemslist(form, obj_result, number_of_result) {
  var html_subtab = form.addField('cutpage_subtab_items', 'inlineHTML', '', null, 'custpage_items_tab');
  var sublistItems = form.addSubList('custpage_items', 'list', "Items", "custpage_items_tab");
  sublistItems.addField('custpage_create_invoice_chk', 'checkbox', 'Create Invoice');
  sublistItems.addField('custpage_purchase_order', 'text', 'Purchase Order');
  sublistItems.addField('custpage_po_id', 'text', 'Purchase Order Id').setDisplayType('hidden');
  sublistItems.addField('custpage_item', 'text', 'Item');
  sublistItems.addField('custpage_item_id', 'text', 'Item Id').setDisplayType('hidden');
  sublistItems.addField('custpage_vendor_stock_number', 'text', 'Vendor Stock Number');
  sublistItems.addField('custpage_description', 'textarea', 'Description').setDisplayType('entry');
  sublistItems.addField('custpage_vendor_return_status', 'select', 'Vendor Return Status','customlist539');
  sublistItems.addField('custpage_gemstone_status', 'text', 'Gemstone Status');
  sublistItems.addField('custpage_reason_diamond_return', 'text', 'Reason for Diamond Return');
  sublistItems.addField('custpage_expected_return_date', 'text', 'Expected Return Date');
  sublistItems.addField('custpage_vendor_name', 'text', 'Vendor');
  sublistItems.addField('custpage_vendor_id', 'text', 'Vendor Id').setDisplayType('hidden');
  sublistItems.addField('custpage_gemstone_shape', 'text', 'Gemstone Shape');
  sublistItems.addField('custpage_carat', 'text', 'Carat');
  sublistItems.addField('custpage_color', 'text', 'Color');
  sublistItems.addField('custpage_clarity', 'text', 'Clarity');
  sublistItems.addField('custpage_certificate_number', 'text', 'Certificate Number');
  sublistItems.addField('custpage_cost', 'text', 'Cost');
  sublistItems.addField('custpage_return_fee', 'text', 'Return Fee New');
  sublistItems.addField('custpage_type_of_return_fee', 'text', 'Type of Return Fee');

  sublistItems.addButton("custpage_create_invoice", "Create Invoice", "Create_Invoice()");
  sublistItems.addButton("custpage_update_records", "Update Record", "updateRecords();");
  sublistItems.addButton("custpage_markall", "Mark All", "MarkAllItems();");
  sublistItems.addButton("custpage_unmarkall", "Unmark All", "UnMarkAllItems();");

  bindSublistOfItems(obj_result, sublistItems, number_of_result);
  var index = 1;
  var html_index;
  for (var i = 0; i < Math.ceil(number_of_result / divided_size); i++) {
    var nextIndex = index + paging_size;
    if (nextIndex > number_of_result)
      nextIndex = number_of_result;
    html_index += '<option value=' + index + '>' + index + ' - ' + nextIndex + '</option>';
    index = nextIndex + 1;
  }
  html_subtab.setDefaultValue("<table width='100%' cellpadding='2' >\
    <tr>\
        <td width='120px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;' >TOTAL RECORDS:</td>\
        <td width='120px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;' >ITEMS SELECTED:</td>\
		 <td width='200px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;' >VENDOR RETURN STATUS:</td>\
        <td rowspan='4' valign='top'  align='right'><br/><select class='page_all_pageing' id='page_all_pageing_items'>" + html_index + "</select>\
        </td>\
    </tr>\
    <tr>\
        <td width='120px' valign='top' ><span class='number_of_record' id='number_of_record_items'>"+number_of_result+"</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_items'></td>\
        <td width='120px' valign='top' ><span class='selected_records' id='selected_records_items'>0</span>\
        </td>\
		<td width='200px'> <select  style='width:100%' id='vendor_return_status'>\
				<option value=''></option>\
				<option value='@NONE@'>- None -</option>\
				<option value=1>Return invoice created</option>\
				<option value=2>Return invoice confirmed</option>\
				<option value=3>Return Invoice Needed</option>\
				<option value=4>Pending - Invoice Created</option>\
				<option value=5>Return Invoice Emailed</option>\
				</select>\
		</td>\
    </tr>\
</table>");
}


function bindSublistOfItems(results, sublistItems, number_of_result) {
  if (results) {
    var sublistItems_Arr = [];
    try {
      var col = results[0].getAllColumns();
       var vendor_return_status='';
      for (var i = 0; i < results.length; i++) {

        if (results[i].getValue(col[6]) == "" || results[i].getValue(col[6]) == null) {
          vendor_return_status = '';

        } else {

          if(results[i].getValue(col[6])=='Return invoice created')
          {
            vendor_return_status = '1';
          }
          else if(results[i].getValue(col[6])=='Return invoice confirmed')
          {
            vendor_return_status = '2';
          }
          else if(results[i].getValue(col[6])=='Return Invoice Needed')
          {
            vendor_return_status = '3';
          }
          else if(results[i].getValue(col[6])=='Pending - Invoice Created')
          {
            vendor_return_status = '4';
          }
          else if(results[i].getValue(col[6])=='Return Invoice Emailed')
          {
            vendor_return_status = '5';
          }

        }
        sublistItems_Arr.push({
          custpage_purchase_order: results[i].getValue(col[0]),
          custpage_po_id: results[i].getValue(col[1]),
          custpage_item: results[i].getValue(col[2]),
          custpage_item_id: results[i].getValue(col[3]),
          custpage_vendor_stock_number: results[i].getValue(col[4]),
          custpage_description: results[i].getValue(col[5]),
          custpage_vendor_return_status: vendor_return_status,
          custpage_gemstone_status: results[i].getValue(col[7]),
          custpage_reason_diamond_return: results[i].getValue(col[8]),
          custpage_expected_return_date: results[i].getValue(col[9]),
          custpage_vendor_name: results[i].getValue(col[10]),
          custpage_vendor_id: results[i].getValue(col[11]),
          custpage_gemstone_shape: results[i].getValue(col[12]),
          custpage_carat: results[i].getValue(col[13]),
          custpage_color: results[i].getValue(col[14]),
          custpage_clarity: results[i].getValue(col[15]),
          custpage_certificate_number: results[i].getValue(col[17]),
          custpage_cost: results[i].getValue(col[16]),
          custpage_return_fee: results[i].getValue(col[18]),
          custpage_type_of_return_fee: results[i].getValue(col[19]),

        });
      }
    } catch (er) {
      nlapiLogExecution('debug', 'Error in Items', er.message);
    }
    sublistItems.setLineItemValues(sublistItems_Arr);
  }
}