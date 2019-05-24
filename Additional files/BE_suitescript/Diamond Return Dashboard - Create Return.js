function bindCreateReturnList(form, obj_result, number_of_result) {
   // var html_subtab = form.addField('custpage_subtab_create_return', 'inlineHTML', '', null, 'custpage_create_return_tab');
	
    var sublistCreateReturn = form.addSubList('custpage_create_return', 'list', "Create Return", "custpage_create_return_tab");
    sublistCreateReturn.addField('custpage_internalid_custpage_create_return', 'text', 'Internal Id').setDisplayType('hidden');
	sublistCreateReturn.addField('custpage_name_custpage_create_return', 'text', 'Name');
    sublistCreateReturn.addField('custpage_desc_custpage_create_return', 'text', 'Description');
	sublistCreateReturn.addField('custpage_other_vendor_custpage_create_return', 'text', 'Vendor Name');
	sublistCreateReturn.addField('custpage_vendor_custpage_create_return', 'text', 'Vendor#');
	sublistCreateReturn.addField('custpage_gemstone_status_custpage_create_return', 'select', 'Gemstone Status','customlist29');
  	sublistCreateReturn.addField('custpage_gemstone_status_hidden_custpage_create_return', 'text', 'Gemstone Status Hidden').setDisplayType('hidden');
	sublistCreateReturn.addField('custpage_vendor_ret_status_custpage_create_return', 'text', 'Vendor Return Status');
    sublistCreateReturn.addField('custpage_exptd_ret_date_custpage_create_return', 'date', 'Expected Return Date').setDisplayType('entry');
  	sublistCreateReturn.addField('custpage_exptd_ret_date_hidden_custpage_create_return', 'date', 'Expected Return Date').setDisplayType('hidden');
	sublistCreateReturn.addField('custpage_notes_custpage_create_return', 'textarea', 'Notes').setDisplayType('entry');
  	sublistCreateReturn.addField('custpage_notes_hidden_custpage_create_return', 'textarea', 'Notes hidden').setDisplayType('hidden');
	sublistCreateReturn.addField('custpage_date_rec_frm_po_custpage_create_return', 'date', 'Date Received from PO');
	sublistCreateReturn.addField('custpage_restlet_status_custpage_create_return', 'text', 'Restlet Status');
	sublistCreateReturn.addField('custpage_cost_custpage_create_return', 'text', 'Cost');
	sublistCreateReturn.addField('custpage_price_custpage_create_return', 'text', 'Price');
	sublistCreateReturn.addField('custpage_asset_account_custpage_create_return', 'text', 'Asset Account');
	sublistCreateReturn.addField('custpage_owned_reason_custpage_create_return', 'text', 'Owned Reason');
	sublistCreateReturn.addField('custpage_bill_date_custpage_create_return', 'text', 'Bill Date');
    sublistCreateReturn.addField('custpage_other_vendor_internalid_custpage_create_return', 'text', 'Vendor Id').setDisplayType('hidden');
    sublistCreateReturn.addField('custpage_vra_vendor_create_return', 'text', 'Vra Vendor Id').setDisplayType('hidden');
    sublistCreateReturn.addField('custpage_carats_create_return', 'text', 'Carats').setDisplayType('hidden');

	//Add buttons to list
    sublistCreateReturn.addButton("custpage_update_records_custpage_create_return", "Update Records", "UpdateRecords('custpage_create_return')");
    sublistCreateReturn.addButton("custpage_create_ret_custpage_create_return", "Create Return", "CreateReturn('custpage_create_return');");

  	//Add buttons to list
   // var fldGemStatus=form.addField('custpage_gemstone_status_filter_custpage_create_return', 'select', 'Gemstone Status', 'customlist29', 'custpage_create_return_tab');
   //	var fldVendor=form.addField('custpage_other_vendor_filter_custpage_create_return', 'select', 'Vendor', 'vendor', 'custpage_create_return_tab');

  	//fldGemStatus.setLayoutType('outsidebelow', 'startcol');
    //fldVendor.setLayoutType('outsidebelow', 'startcol');

   var html_subtab = form.addField('custpage_subtab_create_return', 'inlineHTML', '', null, 'custpage_create_return_tab');
   //	html_subtab.setLayoutType('outsidebelow', 'startcol');
   // html_subtab.setDisplaySize( 40, 15);


    bindCreateReturn(obj_result, sublistCreateReturn, number_of_result);
    var index = 1;
    var html_index;
    for (var i = 0; i < Math.ceil(number_of_result / divided_size_others); i++) {
        var nextIndex = index + paging_size_others;
        if (nextIndex > number_of_result)
            nextIndex = number_of_result;
        html_index += '<option value=' + index + '>' + index + ' - ' + nextIndex + '</option>';
        index = nextIndex + 1;
    }
  
  var itemObj=nlapiCreateRecord('inventoryitem');
  	var gem_status=itemObj.getField('custitem40');
  
 	var gem_status_options=gem_status.getSelectOptions();
	  
  
var htmlContent="<table width='100%' cellpadding='2'>\
    <tr>\
		<td width='20%' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>GEMSTONE STATUS:</td>\
		<td width='20%' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>VENDOR:</td>\
        <td  align='right'  style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>TOTAL RECORDS:</td>\
        <td rowspan='3' width='8%' valign='bottom' align='right'><br/><select class='page_all_pageing' id='page_all_pageing_create_return'>" + html_index + "</select>\
        </td>\
    </tr>\
    <tr>\
		<td width='200px'> <select style='width:100%' id='gemstone_status_create_return'><option value=''></option>";
		for(var i=0;i<gem_status_options.length;i++)
		{
			//var value= cat_options[i].getId();
			//var text=  cat_options[i].getText();
			htmlContent+="<option value="+gem_status_options[i].getId()+">"+gem_status_options[i].getText()+"</option>";
		}
		htmlContent+="</select>\
        </td>\
 		<td width='200px'> <select style='width:100%' id='vendors_create_return' class='vendors_all'><option value=''></option>";
		htmlContent+="</select>\
        </td>\
        <td valign='top' width='150px' align='right'><span class='number_of_record' id='number_of_record_create_return' style='font-size:12px' >"+number_of_result+"</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_create_return'>\
        </td>\
    </tr>\
</table>"
html_subtab.setDefaultValue(htmlContent);
  
   /* html_subtab.setDefaultValue("<table width='100%' cellpadding='2' >\
    <tr>\
        <td width='120px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;' >TOTAL RECORDS:</td>\
        <td rowspan='3' valign='top'  align='right'><br/><select class='page_all_pageing' id='page_all_pageing_create_return'>" + html_index + "</select>\
        </td>\
    </tr>\
    <tr>\
        <td width='120px' valign='top' ><span class='number_of_record' id='number_of_record_create_return'>"+number_of_result+"</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_create_return'></td>\
         </td>\
    </tr>\
</table>");*/
}

function bindCreateReturn(results, sublistCreateReturn, number_of_result) {
    if (results) {
        var sublistCreateReturn_Arr = [];
        try {
            var col = results[0].getAllColumns();
            nlapiLogExecution('Debug','Length',results.length);
            for (var i = 0; i < results.length; i++) {
              var gemstoneStatus='';           
                           
			  nlapiLogExecution('debug','Gemstone status- Create Return',results[i].getValue(col[4]))
              var objItemGS=nlapiCreateRecord('inventoryitem');
              var objFieldGS=objItemGS.getField('custitem40');
              var optionsGS= objFieldGS.getSelectOptions();
              for(var iCountGS=0;iCountGS<optionsGS.length;iCountGS++)
              {
                if(optionsGS[iCountGS].getText()==results[i].getValue(col[4]))
                {
                  gemstoneStatus=optionsGS[iCountGS].getId();
                  break;
                }
              }

                sublistCreateReturn_Arr.push({
					custpage_name_custpage_create_return:results[i].getValue(col[0]),
                  	custpage_desc_custpage_create_return:results[i].getValue(col[1]),
					custpage_other_vendor_custpage_create_return: results[i].getValue(col[2]),
                    custpage_vendor_custpage_create_return: results[i].getValue(col[3]),
					custpage_gemstone_status_custpage_create_return: gemstoneStatus,
                  	custpage_gemstone_status_hidden_custpage_create_return: gemstoneStatus,
                    custpage_vendor_ret_status_custpage_create_return: results[i].getValue(col[5]),
					custpage_exptd_ret_date_custpage_create_return:results[i].getValue(col[6]),
                  	custpage_exptd_ret_date_hidden_custpage_create_return:results[i].getValue(col[6]),
					custpage_notes_custpage_create_return: results[i].getValue(col[7]),
                  	custpage_notes_hidden_custpage_create_return: results[i].getValue(col[7]),
					custpage_date_rec_frm_po_custpage_create_return: results[i].getValue(col[8]),
					custpage_restlet_status_custpage_create_return: results[i].getValue(col[9]),
					custpage_cost_custpage_create_return: results[i].getValue(col[10]),
					custpage_price_custpage_create_return: results[i].getValue(col[11]),
					custpage_asset_account_custpage_create_return: results[i].getValue(col[12]),
                    custpage_owned_reason_custpage_create_return: results[i].getValue(col[13]),
					custpage_bill_date_custpage_create_return: results[i].getValue(col[14]),
                 	custpage_internalid_custpage_create_return:results[i].getValue(col[15]),
                  	custpage_other_vendor_internalid_custpage_create_return: results[i].getValue(col[16]),
                  	custpage_vra_vendor_create_return: results[i].getValue(col[17]),
                  	custpage_carats_create_return: results[i].getValue(col[18])
                });
            }
        } catch (er) {
            nlapiLogExecution('debug', 'Error - Create Returned', er.message);
        }
        sublistCreateReturn.setLineItemValues(sublistCreateReturn_Arr);
    }
}
