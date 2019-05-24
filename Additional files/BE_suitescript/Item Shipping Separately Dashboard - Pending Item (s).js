function bindPendingItemsList(form, obj_result, number_of_result) {
    var html_subtab = form.addField('cutpage_subtab_pending_items', 'inlineHTML', '', null, 'custpage_pending_items_tab');
    var sublistPendingItems = form.addSubList('custpage_pending_items', 'list', "Pending Item(s)", "custpage_pending_items_tab");
    sublistPendingItems.addField('custpage_chk_custpage_pending_items', 'checkbox', 'Select');
    sublistPendingItems.addField('custpage_so_doc_number_custpage_pending_items', 'text', 'Sales Order Number');
  sublistPendingItems.addField('custpage_so_internal_id_custpage_pending_items', 'text', 'So Id').setDisplayType('hidden');
    sublistPendingItems.addField('custpage_customer_custpage_pending_items', 'text', 'Customer Name');
    sublistPendingItems.addField('custpage_delivery_date_notes_custpage_pending_items', 'textarea', 'Delivery Date Notes').setDisplayType('entry');
    sublistPendingItems.addField('custpage_materials_tracking_no_custpage_pending_items', 'text', 'Materials Tracking #')
     sublistPendingItems.addField('custpage_item_ship_seperate_hidden_custpage_pending_items', 'textarea', 'Items Shipping Separately').setDisplayType('hidden');
    sublistPendingItems.addField('custpage_item_ship_seperate_custpage_pending_items', 'textarea', 'Items Shipping Separately');
    sublistPendingItems.addField('custpage_status_item_ship_seperate_custpage_pending_items', 'select', 'Status of Items Shipping Separately','customlist465')
      

    sublistPendingItems.addButton("custpage_update_pending_items", "Update", "UpdateRecords('custpage_pending_items')");
    sublistPendingItems.addButton("custpage_markall_pending_items", "Mark All", "MarkAll('custpage_pending_items');");
    sublistPendingItems.addButton("custpage_unmarkall_pending_items", "Unmark All", "UnMarkAll('custpage_pending_items');");
	//sublistPendingFromVendor.addButton("custpage_generate_label_pending_items", "Generate Labels", "generateLabels('custpage_pending_items');");

    bindPendingItems(obj_result, sublistPendingItems, number_of_result);
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
<td rowspan='3' valign='bottom'>\
            <input style='width:100%' type='text' class='search_key' id='search_key_pending_items' placeholder='Search By Document Number'>\
        </td>\
        <td rowspan='3' valign='bottom'>\
            <input class='btn_search_key' id='btn_search_key_pending_items' type='button' value='Search' style='border: none;background-color: #008CBA; color: white;    padding: 5px 20px;    text-align: center;    text-decoration: none;    display: inline-block;    font-size: 12px;    margin: -1px -2px;    cursor: pointer;'>\
        </td>\
        <td width='120px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;' >TOTAL RECORDS:</td>\
        <td width='120px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;' >SELECTED RECORDS:</td>\
        <td rowspan='3' valign='top'  align='right'><br/><select class='page_all_pageing' id='page_all_pageing_pending_items'>" + html_index + "</select>\
        </td>\
    </tr>\
    <tr>\
        <td width='120px' valign='top' ><span class='number_of_record' id='number_of_record_pending_items'>"+number_of_result+"</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_pending_items'></td>\
        <td width='120px' valign='top' ><span class='selected_records' id='selected_records_custpage_pending_items'>0</span>\
        </td>\
    </tr>\
</table>");
}


function bindPendingItems(results, sublistPendingItems, number_of_result) {
    if (results) {
        var sublistPendingItems_Arr = [];
        try {
            var col = results[0].getAllColumns();
            for (var i = 0; i < results.length; i++) {
            var index_value_new=(i+1)+'';
			var item_ship_sep_obj=[];
			var get_item_ship_sep_value=results[i].getValue(col[4]);
			if(get_item_ship_sep_value){item_ship_sep_obj=get_item_ship_sep_value.split(','); }    
			var item_ship_sep_html= bindItemShipSepPI(item_ship_sep_obj,index_value_new);
                sublistPendingItems_Arr.push({
                  //  custpage_so_doc_number_custpage_pending_frm_vendor: results[i].getValue(col[0]),
                   custpage_so_doc_number_custpage_pending_items:"<a href='/app/accounting/transactions/salesord.nl?id="+results[i].getId()+"' target='_blank' style='color:blue' >"+results[i].getValue(col[0])+"</a>",
                  	custpage_so_internal_id_custpage_pending_items: results[i].getId(),
                   // custpage_customer_custpage_pending_frm_vendor: results[i].getValue(col[1]),
                    custpage_customer_custpage_pending_items: "<a href='/app/common/entity/custjob.nl?id="+results[i].getValue(col[1])+"' target='_blank' style='color:blue' >"+results[i].getText(col[1])+"</a>",
                    custpage_delivery_date_notes_custpage_pending_items: results[i].getValue(col[2]),
                    custpage_materials_tracking_no_custpage_pending_items: results[i].getValue(col[3]),
                    custpage_item_ship_seperate_hidden_custpage_pending_items: get_item_ship_sep_value,
                    custpage_item_ship_seperate_custpage_pending_items: item_ship_sep_html,
                    custpage_status_item_ship_seperate_custpage_pending_items: results[i].getValue(col[5])
                });
            }
        } catch (er) {
            nlapiLogExecution('debug', 'Error in Pending from Vendor', er.message);
        }
        sublistPendingItems.setLineItemValues(sublistPendingItems_Arr);
    }
}
function bindItemShipSepPI(item_ship_sep_id,index_number)
{

  var function_call= "onclick=setValueItemShipSepPI("+index_number+")";
  var item_ship_sep_field="<select multiple width='100px' id='iss_multi_pi_"+index_number+"' "+function_call+">";
  for(var c=0;c<arr_item_ship_sep_value.length;c++)
  {
    var select_value='';
    if(item_ship_sep_id.indexOf(arr_item_ship_sep_value[c])!=-1)
    {
      select_value="selected='true'";
    }     
    item_ship_sep_field+="<option value="+arr_item_ship_sep_value[c]+"  "+select_value+">"+arr_item_ship_sep_text[c]+"</option>";
  }
  item_ship_sep_field+="</select>";
  return item_ship_sep_field;
}