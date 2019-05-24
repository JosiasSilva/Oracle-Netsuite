function bindGemstoneslist(form, obj_result, number_of_result,vendorDetArr) {
    var html_subtab = form.addField('cutpage_subtab_items', 'inlineHTML', '', null, 'custpage_items_tab');
    var sublistGemstones = form.addSubList('custpage_items', 'list', "Gemstones", 'custpage_items_tab');
    sublistGemstones.addField('custpage_items_chk', 'checkbox', 'Create PO');
    sublistGemstones.addField('custpage_item_name_number', 'text', 'Item name/ number');
    sublistGemstones.addField('custpage_item_name', 'text', 'Item name').setDisplayType('hidden');
  	sublistGemstones.addField('custpage_item_desc', 'textarea', 'Description');
	sublistGemstones.addField('custpage_item_id', 'text', 'Item Id').setDisplayType('hidden');;

  sublistGemstones.addField('custpage_vendor', 'select', 'Vendor','vendor');
  sublistGemstones.addField('custpage_vendor_purchasing_notes', 'textarea', 'Vendor Purchasing Notes').setDisplayType('entry');
  sublistGemstones.addField('custpage_amount_to_order', 'integer', 'Pieces to order').setDisplayType('entry');
  sublistGemstones.addField('custpage_qty_available', 'text', 'Quantity Available');
  sublistGemstones.addField('custpage_pref_stock_level', 'text', 'Preferred Stock Level');
  sublistGemstones.addField('custpage_reorder_point', 'text', 'Reorder Point');
  sublistGemstones.addField('custpage_total_to_order', 'text', 'Total to Order');
  sublistGemstones.addField('custpage_quanity_on_order', 'text', 'Quantity on Order');
  sublistGemstones.addField('custpage_last_purchase_price', 'currency', 'Price Per Unit').setDisplayType('entry');
  sublistGemstones.addField('custpage_date_needed_in_sf', 'date', 'Date Needed in SF').setDisplayType('entry');
  sublistGemstones.addField('custpage_highlight', 'textarea', 'Highlight').setDisplayType('hidden');
  	
   sublistGemstones.addButton("custpage_create_invoice", "Create PO", "createPOs();");
   sublistGemstones.addButton("custpage_markall", "Mark All", "MarkAllItems();");
   sublistGemstones.addButton("custpage_unmarkall", "Unmark All", "UnMarkAllItems();");

    bindSublistOfGemstones(obj_result, sublistGemstones, number_of_result);
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
		<td width='200px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>VENDOR:</td>\
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
 		<td width='200px'> <select style='width:100%' id='lst_vendors'><option value=''></option>";
		for(var i=0;i<vendorDetArr.length;i++)
		{
			//var value= cat_options[i].getId();
			//var text=  cat_options[i].getText();
			htmlContent+="<option value="+vendorDetArr[i].vendor_id+">"+vendorDetArr[i].vendor_name+"</option>";
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


function bindSublistOfGemstones(results, sublistGemstones, number_of_result) {
    if (results) {
        var sublistGemstones_Arr = [];
        try {
            var col = results[0].getAllColumns();
            for (var i = 0; i < results.length; i++) {

              var IsHighlight='No';
              var qtyAvl=results[i].getValue(col[2]);
              var preStockLevel= parseInt(results[i].getValue(col[5]));
              var reorderPoint= parseFloat(results[i].getValue(col[6]))*0.5;
              if(!qtyAvl)
                qtyAvl='0';
              
              if(parseInt(qtyAvl)<preStockLevel)
              {
                IsHighlight='Yes';
              }
             /* else if(qtyAvl<=reorderPoint)
              {
                IsHighlight='Yes';
              }*/
                sublistGemstones_Arr.push({
                    custpage_item_name_number: "<a href='/app/common/item/item.nl?id="+results[i].getId()+"' target='_blank'> "+results[i].getValue(col[0])+"</a>",
                    custpage_item_name: results[i].getValue(col[0]),
                    custpage_item_id: results[i].getId(),
                    custpage_item_desc: results[i].getValue(col[1]),
                    custpage_qty_available: qtyAvl,
                    custpage_vendor: results[i].getValue(col[3]),
                    custpage_vendor_purchasing_notes: results[i].getValue(col[4]),
                    custpage_pref_stock_level: results[i].getValue(col[5]),
                    custpage_reorder_point: results[i].getValue(col[6]),
                    custpage_total_to_order: (results[i].getValue(col[5])-results[i].getValue(col[2])),
                    custpage_quanity_on_order: results[i].getValue(col[9]),
                    custpage_last_purchase_price: results[i].getValue(col[7]),
                  	custpage_highlight:IsHighlight
                });
            }
        } catch (er) {
            nlapiLogExecution('debug', 'Error in Gemtstone Items', er.message);
        }
        sublistGemstones.setLineItemValues(sublistGemstones_Arr);
    }
}