function bindReturnTrackingConfrmList(form, obj_result, number_of_result) {
  //  var html_subtab = form.addField('cutpage_subtab_return_tracking_conf', 'inlineHTML', '', null, 'custpage_return_tracking_conf_tab');
	
   var sublistReturnTrackingConfrm = form.addSubList('custpage_return_tracking_conf', 'list', "Return/Tracking Confirmation", "custpage_return_tracking_conf_tab");
  sublistReturnTrackingConfrm.addField('custpage_internalid_custpage_return_tracking_conf', 'text', 'Internal Id').setDisplayType('hidden');
  sublistReturnTrackingConfrm.addField('custpage_vra_custpage_return_tracking_conf', 'text', 'VRA#');
  sublistReturnTrackingConfrm.addField('custpage_vendor_custpage_return_tracking_conf', 'text', 'Vendor');
  sublistReturnTrackingConfrm.addField('custpage_memo_custpage_return_tracking_conf', 'text', 'Memo');
  sublistReturnTrackingConfrm.addField('custpage_tracking_no_custpage_return_tracking_conf', 'text', 'Tracking#').setDisplayType('entry');
  sublistReturnTrackingConfrm.addField('custpage_tracking_no_hidden_custpage_return_tracking_conf', 'text', 'Tracking# Hidden').setDisplayType('hidden');
  sublistReturnTrackingConfrm.addField('custpage_shipping_carrier_custpage_return_tracking_conf', 'text', 'Shipping Carrier');
  sublistReturnTrackingConfrm.addField('custpage_aes_eei_custpage_return_tracking_conf', 'text', 'AES/EEI').setDisplayType('entry');
  sublistReturnTrackingConfrm.addField('custpage_aes_eei_hidden_custpage_return_tracking_conf', 'text', 'AES/EEI Hidden').setDisplayType('hidden');
  sublistReturnTrackingConfrm.addField('custpage_fed_ex_err_msg_custpage_return_tracking_conf', 'textarea', 'FedEx Error Messages');
  sublistReturnTrackingConfrm.addField('custpage_highlight_rtc', 'text', 'highlight').setDisplayType('hidden');
	 	
	//Add buttons to list
    sublistReturnTrackingConfrm.addButton("custpage_update_records_custpage_return_tracking_conf", "Update Records", "UpdateRecords('custpage_return_tracking_conf')");
   	sublistReturnTrackingConfrm.addButton("custpage_create_labels_custpage_return_tracking_conf", "Create Labels", "CreateLabels('custpage_return_tracking_conf');");
    sublistReturnTrackingConfrm.addButton("custpage_print_labels_custpage_return_tracking_conf", "Print Labels", "PrintLabel('custpage_return_tracking_conf');");
    sublistReturnTrackingConfrm.addButton("custpage_print_packing_slips_custpage_return_tracking_conf", "Print Packing Slips", "printPackingSlip('custpage_return_tracking_conf');");
  

  	//Add buttons to list
  //  var fldVendor=form.addField('custpage_other_vendor_filter_custpage_return_tracking_conf', 'select', 'Vendor', 'vendor', 'custpage_return_tracking_conf_tab');

   // fldVendor.setLayoutType('outsidebelow', 'startcol');

    var html_subtab = form.addField('custpage_subtab_return_tracking_conf', 'inlineHTML', '', null, 'custpage_return_tracking_conf_tab');
   //	html_subtab.setLayoutType('outsidebelow', 'startcol');
   // html_subtab.setDisplaySize( 40, 15);


    bindReturnTrackingConfrm(obj_result, sublistReturnTrackingConfrm, number_of_result);
    var index = 1;
    var html_index;
    for (var i = 0; i < Math.ceil(number_of_result / divided_size_others); i++) {
        var nextIndex = index + paging_size_others;
        if (nextIndex > number_of_result)
            nextIndex = number_of_result;
        html_index += '<option value=' + index + '>' + index + ' - ' + nextIndex + '</option>';
        index = nextIndex + 1;
    }
  var htmlContent="<table width='100%' cellpadding='2'>\
    <tr>\
		<td width='20%' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>VENDOR:</td>\
        <td  align='right'  style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>TOTAL RECORDS:</td>\
        <td rowspan='3' width='8%' valign='bottom' align='right'><br/><select class='page_all_pageing' id='page_all_pageing_return_tracking_conf'>" + html_index + "</select>\
        </td>\
    </tr>\
    <tr>";
		htmlContent+="<td width='200px'> <select style='width:100%' id='vendors_return_tracking_conf' class='vendors_all'><option value=''></option>";
		htmlContent+="</select>\
        </td>\
        <td valign='top' width='150px' align='right'><span class='number_of_record' id='number_of_record_return_tracking_conf' style='font-size:12px' >"+number_of_result+"</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_return_tracking_conf'>\
        </td>\
    </tr>\
</table>";
html_subtab.setDefaultValue(htmlContent);
  
   /* html_subtab.setDefaultValue("<table width='100%' cellpadding='2' >\
    <tr>\
        <td width='120px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;' >TOTAL RECORDS:</td>\
        <td rowspan='3' valign='top'  align='right'><br/><select class='page_all_pageing' id='page_all_pageing_return_tracking_conf'>" + html_index + "</select>\
        </td>\
    </tr>\
    <tr>\
        <td width='120px' valign='top' ><span class='number_of_record' id='number_of_record_return_tracking_conf'>"+number_of_result+"</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_return_tracking_conf'></td>\
    </tr>\
</table>");*/
}

function bindReturnTrackingConfrm(results, sublistReturnTrackingConfrm, number_of_result) {
    if (results) {
        var sublistReturnTrackingConfrm_Arr = [];
        try {
            var col = results[0].getAllColumns();
            nlapiLogExecution('Debug','Length',results.length);
            for (var i = 0; i < results.length; i++) {
              var highlightColor='';
              var tracking_no=results[i].getValue(col[3]);
               var aes_eei=results[i].getValue(col[5]);
              var fedExMsg=results[i].getValue(col[6]);
              if(tracking_no==null || tracking_no=='')
               {
                  highlightColor='#f8cbac';
               }
              else if(aes_eei==null || aes_eei=='')
              {
                highlightColor='#b6c8e8';
              }
              
              if(fedExMsg==null || fedExMsg=='')
                {
                  highlightColor=highlightColor+'-'+0;
                }
              else
                {
                  highlightColor=highlightColor+'-'+1;
                }
        
                sublistReturnTrackingConfrm_Arr.push({
					custpage_vra_custpage_return_tracking_conf:results[i].getValue(col[0]),
                  	custpage_vendor_custpage_return_tracking_conf:results[i].getText(col[1]),
					custpage_memo_custpage_return_tracking_conf: results[i].getValue(col[2]),
                    custpage_tracking_no_custpage_return_tracking_conf: results[i].getValue(col[3]),
                 	custpage_tracking_no_hidden_custpage_return_tracking_conf: results[i].getValue(col[3]),
					custpage_shipping_carrier_custpage_return_tracking_conf: results[i].getText(col[4]),
                    custpage_aes_eei_custpage_return_tracking_conf: results[i].getValue(col[5]),
                  	custpage_aes_eei_hidden_custpage_return_tracking_conf: results[i].getValue(col[5]),
					custpage_fed_ex_err_msg_custpage_return_tracking_conf:results[i].getValue(col[6]),
                  	custpage_internalid_custpage_return_tracking_conf:results[i].getId(),
                  custpage_highlight_rtc:highlightColor
                  
                });
            }
        } catch (er) {
            nlapiLogExecution('debug', 'Error - Return/Tracking Confirmation', er.message);
        }
        sublistReturnTrackingConfrm.setLineItemValues(sublistReturnTrackingConfrm_Arr);
    }
}
