function bindMeleelist(form, obj_result, number_of_result,vendorDetArr) {
    var html_subtab = form.addField('cutpage_subtab_melee', 'inlineHTML', '', null, 'custpage_melee_tab');
    var sublistMelee = form.addSubList('custpage_melee', 'list', "Melee", 'custpage_melee_tab');
    sublistMelee.addField('custpage_melee_chk', 'checkbox', 'Create PO');
    sublistMelee.addField('custpage_item_name_number_melee', 'text', 'Item name/ number');
    sublistMelee.addField('custpage_item_name_melee', 'text', 'Item name').setDisplayType('hidden');
  	sublistMelee.addField('custpage_item_desc_melee', 'textarea', 'Description');
	sublistMelee.addField('custpage_item_id_melee', 'text', 'Item Id').setDisplayType('hidden');;

    sublistMelee.addField('custpage_vendor_melee', 'select', 'Vendor','vendor');
    sublistMelee.addField('custpage_vendor_purchasing_notes_melee', 'textarea', 'Vendor Purchasing Notes').setDisplayType('entry');
    sublistMelee.addField('custpage_carats_to_order_melee', 'float', 'Carats to order').setDisplayType('entry');
    sublistMelee.addField('custpage_qty_avl_melee', 'text', 'Quantity Available');
    sublistMelee.addField('custpage_pref_stock_level_melee', 'text', 'Preferred Stock Level');
    sublistMelee.addField('custpage_reorder_point_melee', 'text', 'Reorder Point');
    sublistMelee.addField('custpage_total_to_order_melee', 'text', 'Total to Order');
    sublistMelee.addField('custpage_quanity_on_order_melee', 'text', 'Quantity on Order');
    sublistMelee.addField('custpage_last_purchase_price_melee', 'currency', 'Price Per Unit').setDisplayType('entry');
  	sublistMelee.addField('custpage_date_needed_in_sf_melee', 'date', 'Date Needed in SF').setDisplayType('entry');
    sublistMelee.addField('custpage_highlight_melee', 'textarea', 'Highlight').setDisplayType('hidden');
  	
   sublistMelee.addButton("custpage_create_invoice_melee", "Create PO", "createPOsMelee();");
   sublistMelee.addButton("custpage_markall_melee", "Mark All", "MarkAllMelee();");
   sublistMelee.addButton("custpage_unmarkall_melee", "Unmark All", "UnMarkAllMelee();");

    bindSublistOfMelee(obj_result, sublistMelee, number_of_result);
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
            <input style='width:100%' type='text' class='search_key' id='search_key_melee' placeholder='Search By Item Name/Number'>\
        </td>\
        <td rowspan='3' valign='bottom'>\
            <input class='btn_search_key' id='btn_search_key_melee' type='button' value='Search' style='border: none;background-color: #008CBA; color: white;    padding: 5px 20px;    text-align: center;    text-decoration: none;    display: inline-block;    font-size: 12px;    margin: -1px -2px;    cursor: pointer;'>\
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
		<td width='200px'> <select style='width:100%' id='type_of_gemstone_melee'><option value=''></option>";
		for(var i=0;i<gemstone_options.length;i++)
		{
			//var value= cat_options[i].getId();
			//var text=  cat_options[i].getText();
			htmlContent+="<option value="+gemstone_options[i].getId()+">"+gemstone_options[i].getText()+"</option>";
		}
		htmlContent+="</select>\
        </td>\
        <td width='200px'> <select style='width:100%' id='item_category_melee'><option value=''></option><option value='@NONE@'>- None -</option>";
		for(var i=0;i<cat_options.length;i++)
		{
			//var value= cat_options[i].getId();
			//var text=  cat_options[i].getText();
			htmlContent+="<option value="+cat_options[i].getId()+">"+cat_options[i].getText()+"</option>";
		}
		htmlContent+="</select>\
        </td>\
        <td width='200px'> <select style='width:100%' id='inventory_location_melee'>\
				<option value=''></option>\
				<option value='@NONE@'>- None -</option>";
		for(var i=0;i<inv_loc_options.length;i++)
		{
			htmlContent+="<option value="+inv_loc_options[i].getId()+">"+inv_loc_options[i].getText()+"</option>";
		}
   htmlContent+="</select>\
        </td>";
  if(vendorDetArr)
    {
		 htmlContent+="<td width='200px'> <select style='width:100%' id='lst_vendors_melee'><option value=''></option>";
		for(var i=0;i<vendorDetArr.length;i++)
		{
			//var value= cat_options[i].getId();
			//var text=  cat_options[i].getText();
			htmlContent+="<option value="+vendorDetArr[i].vendor_id+">"+vendorDetArr[i].vendor_name+"</option>";
		}
      htmlContent+="</select></td>";
    }
		htmlContent+="<td valign='top'  align='right'><span class='number_of_record' id='number_of_record_melee' style='font-size:12px' >"+number_of_result+"</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_melee'>\
        </td>\
    </tr>\
</table>"
    html_subtab.setDefaultValue(htmlContent);
}


function bindSublistOfMelee(results, sublistMelee, number_of_result) {
    if (results) {
        var sublistMelee_Arr = [];
        try {
            var col = results[0].getAllColumns();
            for (var i = 0; i < results.length; i++) {
              
               var IsHighlight='No';
              var qtyAvl=parseFloat(results[i].getValue(col[2]));
              var preStockLevel= parseFloat(results[i].getValue(col[5]));
              var reorderPoint= parseFloat(results[i].getValue(col[6]))*0.5;

              nlapiLogExecution('debug', 'Qty Avail',qtyAvl);
              nlapiLogExecution('debug', 'preStockLevel',preStockLevel);
              nlapiLogExecution('debug', 'reorderPoint',reorderPoint);
              
              if(!qtyAvl)
                qtyAvl=0.0;
              

              if(qtyAvl<preStockLevel)
              {
                IsHighlight='Yes';
                nlapiLogExecution('debug', 'IsHighlight',IsHighlight);
              }
          /*    else if(qtyAvl<=reorderPoint)
              {
                IsHighlight='Yes';
                nlapiLogExecution('debug', 'IsHighlight -else',IsHighlight);
              }*/

                sublistMelee_Arr.push({
                    custpage_item_name_number_melee: "<a href='/app/common/item/item.nl?id="+results[i].getId()+"' target='_blank'> "+results[i].getValue(col[0])+"</a>",
                    custpage_item_name_melee: results[i].getValue(col[0]),
                    custpage_item_id_melee: results[i].getId(),
                    custpage_item_desc_melee: results[i].getValue(col[1]),
                    custpage_qty_avl_melee: qtyAvl, //results[i].getValue(col[2]),
                    custpage_vendor_melee: results[i].getValue(col[3]),
                    custpage_vendor_purchasing_notes_melee: results[i].getValue(col[4]),
                    custpage_pref_stock_level_melee: results[i].getValue(col[5]),
                    custpage_reorder_point_melee: results[i].getValue(col[6]),
                    custpage_total_to_order_melee: (results[i].getValue(col[5])-results[i].getValue(col[2])).toFixed(2),
                    custpage_quanity_on_order_melee: results[i].getValue(col[9]),
                    custpage_last_purchase_price_melee: results[i].getValue(col[7]),
                   	custpage_highlight_melee:IsHighlight
                });
            }
        } catch (er) {
            nlapiLogExecution('debug', 'Error in Melee Items', er.message);
        }
        sublistMelee.setLineItemValues(sublistMelee_Arr);
    }
}