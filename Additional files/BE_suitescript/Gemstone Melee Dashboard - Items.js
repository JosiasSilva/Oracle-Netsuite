function bindItemslist(form, obj_result, number_of_result) {
    var html_subtab = form.addField('cutpage_subtab_items', 'inlineHTML', '', null, 'custpage_items_tab');
    var sublistItems = form.addSubList('custpage_items', 'list', "Items", 'custpage_items_tab');
    sublistItems.addField('custpage_items_chk', 'checkbox', 'Create PO');
    sublistItems.addField('custpage_item_name_number', 'text', 'Item name/ number');
    sublistItems.addField('custpage_item_name', 'text', 'Item name').setDisplayType('hidden');
  	sublistItems.addField('custpage_item_desc', 'textarea', 'Description');
	sublistItems.addField('custpage_item_id', 'text', 'Item Id').setDisplayType('hidden');;
    sublistItems.addField('custpage_stock_units', 'text', 'Stock Units');
    sublistItems.addField('custpage_vendor', 'select', 'Vendor','vendor');
    sublistItems.addField('custpage_vendor_purchasing_notes', 'textarea', 'Vendor Purchasing Notes').setDisplayType('entry');
    sublistItems.addField('custpage_amount_to_order', 'integer', 'Pieces to order').setDisplayType('entry');
   sublistItems.addField('custpage_carats_to_order', 'integer', 'Carats to order').setDisplayType('entry');
    sublistItems.addField('custpage_pref_stock_level', 'text', 'Preferred Stock Level');
    sublistItems.addField('custpage_reorder_point', 'text', 'Reorder Point');
    sublistItems.addField('custpage_last_purchase_price', 'currency', 'Price Per Unit').setDisplayType('entry');
  	sublistItems.addField('custpage_date_needed_in_sf', 'date', 'Date Needed in SF').setDisplayType('entry');
  	
   sublistItems.addButton("custpage_create_invoice", "Create PO", "createPOs();");
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
	
	var itemObj=nlapiCreateRecord('inventoryitem');
	var category=itemObj.getField('custitem20');
  	var type_of_gem=itemObj.getField('custitem4');
  
	var invLocation=itemObj.getField('location');
	var cat_options= category.getSelectOptions();
	var inv_loc_options=invLocation.getSelectOptions();
  	var gemstone_options=type_of_gem.getSelectOptions();
	
	
	var htmlContent="<table width='100%' cellpadding='2'>\
    <tr>\
        <td rowspan='3' valign='bottom'>\
            <input style='width:100%' type='text' class='search_key' id='search_key_items' placeholder='Search By Item Name/Number'>\
        </td>\
        <td rowspan='3' valign='bottom'>\
            <input class='btn_search_key' id='btn_search_key_items' type='button' value='Search' style='border: none;background-color: #008CBA; color: white;    padding: 5px 20px;    text-align: center;    text-decoration: none;    display: inline-block;    font-size: 12px;    margin: -1px -2px;    cursor: pointer;'>\
        </td>\
		<td width='200px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>TYPE OF GEMSTONE:</td>\
        <td width='200px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>ITEM CATEGORY:</td>\
        <td width='200px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>INVENTORY LOCATION:</td>\
        <td  align='right' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>TOTAL RECORDS:</td>\
        <td rowspan='3' valign='bottom' align='right'><br/><select class='page_all_pageing' id='page_all_pageing_items'>" + html_index + "</select>\
        </td>\
    </tr>\
    <tr>\
		<td width='200px'> <select style='width:100%' id='type_of_gemstone'><option value=''></option>";
		for(var i=0;i<gemstone_options.length;i++)
		{
			//var value= cat_options[i].getId();
			//var text=  cat_options[i].getText();
			htmlContent+="<option value="+gemstone_options[i].getId()+">"+gemstone_options[i].getText()+"</option>";
		}
		htmlContent+="</select>\
        </td>\
        <td width='200px'> <select style='width:100%' id='item_category'><option value=''></option><option value='@NONE@'>- None -</option>";
		for(var i=0;i<cat_options.length;i++)
		{
			//var value= cat_options[i].getId();
			//var text=  cat_options[i].getText();
			htmlContent+="<option value="+cat_options[i].getId()+">"+cat_options[i].getText()+"</option>";
		}
		htmlContent+="</select>\
        </td>\
        <td width='200px'> <select style='width:100%' id='inventory_location'>\
				<option value=''></option>\
				<option value='@NONE@'>- None -</option>";
		for(var i=0;i<inv_loc_options.length;i++)
		{
			htmlContent+="<option value="+inv_loc_options[i].getId()+">"+inv_loc_options[i].getText()+"</option>";
		}
		htmlContent+="</select>\
        </td>\
        <td valign='top'  align='right'><span class='number_of_record' id='number_of_record_items' style='font-size:12px' >"+number_of_result+"</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_items'>\
        </td>\
    </tr>\
</table>"
    html_subtab.setDefaultValue(htmlContent);
}


function bindSublistOfItems(results, sublistItems, number_of_result) {
    if (results) {
        var sublistItems_Arr = [];
        try {
            var col = results[0].getAllColumns();
            for (var i = 0; i < results.length; i++) {

                sublistItems_Arr.push({
                    custpage_item_name_number: "<a href='/app/common/item/item.nl?id="+results[i].getId()+"' target='_blank'> "+results[i].getValue(col[0])+"</a>",
                    custpage_item_name: results[i].getValue(col[0]),
                    custpage_item_id: results[i].getId(),
                    custpage_item_desc: results[i].getValue(col[1]),
                    custpage_stock_units: results[i].getValue(col[2]),
                    custpage_vendor: results[i].getValue(col[3]),
                    custpage_vendor_purchasing_notes: results[i].getValue(col[4]),
                    custpage_pref_stock_level: results[i].getValue(col[5]),
                    custpage_reorder_point: results[i].getValue(col[6]),
                    custpage_last_purchase_price: results[i].getValue(col[7])
                });
            }
        } catch (er) {
            nlapiLogExecution('debug', 'Error in Items', er.message);
        }
        sublistItems.setLineItemValues(sublistItems_Arr);
    }
}