function bindOwnedDiamondList(form, obj_result, number_of_result) {

	
    var sublistOwnedDiamond = form.addSubList('custpage_owned_diamond', 'list', "Owned Diamond", "custpage_owned_diamond_tab");
    sublistOwnedDiamond.addField('custpage_name_custpage_owned_diamond', 'text', 'Name');
    sublistOwnedDiamond.addField('custpage_internalid_custpage_owned_diamond', 'text', 'Internal Id').setDisplayType('hidden');
    sublistOwnedDiamond.addField('custpage_desc_custpage_owned_diamond', 'textarea', 'Description');
    sublistOwnedDiamond.addField('custpage_other_vendor_name_custpage_owned_diamond', 'text', 'Vendor Name');
    sublistOwnedDiamond.addField('custpage_vendor_custpage_owned_diamond', 'text', 'Vendor #');
    sublistOwnedDiamond.addField('custpage_vendor_ret_status_custpage_owned_diamond', 'text', 'Vendor Return Status');
  
    sublistOwnedDiamond.addField('custpage_reason_for_diamd_ret_custpage_owned_diamond', 'select', 'Reason for Diamond Return','customlistreason_for_diamond_return');
    sublistOwnedDiamond.addField('custpage_reason_for_diamd_ret_hidden_custpage_owned_diamond', 'text', 'Reason for Diamond Return Hidden').setDisplayType('hidden');
  
    sublistOwnedDiamond.addField('custpage_exptd_ret_date_custpage_owned_diamond', 'date', 'Expected Return Date').setDisplayType('entry');
    sublistOwnedDiamond.addField('custpage_exptd_ret_date_hidden_custpage_owned_diamond', 'date', 'Expected Return Date Hidden').setDisplayType('hidden');
  
    sublistOwnedDiamond.addField('custpage_notes_custpage_owned_diamond', 'textarea', 'Notes').setDisplayType('entry');
    sublistOwnedDiamond.addField('custpage_notes_hidden_custpage_owned_diamond', 'textarea', 'Notes Hidden').setDisplayType('hidden');
  
    sublistOwnedDiamond.addField('custpage_restlet_status_custpage_owned_diamond', 'text', 'Restlet Status');
  
    sublistOwnedDiamond.addField('custpage_gemstone_status_custpage_owned_diamond', 'select', 'Gemstone Status','customlist29');
    sublistOwnedDiamond.addField('custpage_gemstone_status_hidden_custpage_owned_diamond', 'text', 'Gemstone Status Hidden').setDisplayType('hidden');
  
    sublistOwnedDiamond.addField('custpage_date_rec_frm_po_status_custpage_owned_diamond', 'date', 'Date received from PO');
    sublistOwnedDiamond.addField('custpage_cost_custpage_owned_diamond', 'text', 'Cost');
    sublistOwnedDiamond.addField('custpage_price_custpage_owned_diamond', 'text', 'Price');
    sublistOwnedDiamond.addField('custpage_asset_account_custpage_owned_diamond', 'text', 'Asset Account');
    sublistOwnedDiamond.addField('custpage_owned_reason_custpage_owned_diamond', 'text', 'Owned Reason');
    sublistOwnedDiamond.addField('custpage_bill_date_custpage_owned_diamond', 'text', 'Bill Date');

	//var fldGemStatus=form.addField('custpage_gemstone_status_filter_custpage_owned_diamond', 'select', 'Gemstone Status', 'customlist29', 'custpage_owned_diamond_tab');
   //	var fldVendor=form.addField('custpage_other_vendor_filter_custpage_owned_diamond', 'select', 'Vendor', 'vendor', 'custpage_owned_diamond_tab');
  
  	//fldGemStatus.setLayoutType('outsidebelow', 'startcol');
    //fldVendor.setLayoutType('outsidebelow', 'startcol');
   
  
    var html_subtab = form.addField('custpage_subtab_owned_diamond', 'inlineHTML', '', null, 'custpage_owned_diamond_tab');

	//Add buttons to list
    sublistOwnedDiamond.addButton("custpage_update_records_custpage_owned_diamond", "Update Records", "UpdateRecords('custpage_owned_diamond')");
    //sublistOwnedDiamond.addButton("custpage_markall_custpage_owned_diamond", "Mark All", "MarkAll('custpage_owned_diamond');");
   // sublistOwnedDiamond.addButton("custpage_unmarkall_custpage_owned_diamond", "Unmark All", "UnMarkAll('custpage_owned_diamond');");


    bindOwnedDiamond(obj_result, sublistOwnedDiamond, number_of_result);
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
  	var gem_status=itemObj.getField('custitem40');
  
 	var gem_status_options=gem_status.getSelectOptions();
	  
  
var htmlContent="<table width='100%' cellpadding='2'>\
    <tr>\
		<td width='20%' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>GEMSTONE STATUS:</td>\
		<td width='20%' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>VENDOR:</td>\
        <td  align='right'  style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>TOTAL RECORDS:</td>\
        <td rowspan='3' width='8%' valign='bottom' align='right'><br/><select class='page_all_pageing' id='page_all_pageing_owned_diamond'>" + html_index + "</select>\
        </td>\
    </tr>\
    <tr>\
		<td width='200px'> <select style='width:100%' id='gemstone_status_owned_diamond'><option value=''></option>";
		for(var i=0;i<gem_status_options.length;i++)
		{
			//var value= cat_options[i].getId();
			//var text=  cat_options[i].getText();
			htmlContent+="<option value="+gem_status_options[i].getId()+">"+gem_status_options[i].getText()+"</option>";
		}
		htmlContent+="</select>\
        </td>\
 		<td width='200px'> <select style='width:100%' id='vendors_owned_diamond' class='vendors_all'><option value=''></option>";
		htmlContent+="</select>\
        </td>\
        <td valign='top' width='150px' align='right'><span class='number_of_record' id='number_of_record_owned_diamond' style='font-size:12px' >"+number_of_result+"</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_owned_diamond'>\
        </td>\
    </tr>\
</table>"
html_subtab.setDefaultValue(htmlContent);
    
}

function bindOwnedDiamond(results, sublistOwnedDiamond, number_of_result) {
    if (results) {
        var sublistOwnedDiamond_Arr = [];
        try {
            var col = results[0].getAllColumns();
           nlapiLogExecution('Debug','Length',results.length);
            for (var i = 0; i < results.length; i++) {
               var reasonForDiamondRet='',gemstoneStatus='';           
              
              var objItem=nlapiCreateRecord('inventoryitem');
              var objField=objItem.getField('custitemreason_for_diamond_return');
              var options= objField.getSelectOptions();
              for(var iCount=0;iCount<options.length;iCount++)
              {
                if(options[iCount].getText()==results[i].getValue(col[5]))
                {
                  reasonForDiamondRet=options[iCount].getId();
                  break;
                }
              }
              
               var objItemGS=nlapiCreateRecord('inventoryitem');
              var objFieldGS=objItemGS.getField('custitem40');
              var optionsGS= objFieldGS.getSelectOptions();
              for(var iCountGS=0;iCountGS<optionsGS.length;iCountGS++)
              {
                if(optionsGS[iCountGS].getText()==results[i].getValue(col[9]))
                {
                  gemstoneStatus=optionsGS[iCountGS].getId();
                  break;
                }
              }
             var custpage_notes= results[i].getValue(col[7]);
              custpage_notes = custpage_notes.replace(/(?:\r\n|\r|\n)/g, ' ');
             
             
                sublistOwnedDiamond_Arr.push({
                   custpage_name_custpage_owned_diamond:results[i].getValue(col[0]),
                  	custpage_desc_custpage_owned_diamond:results[i].getValue(col[1]),
                    custpage_other_vendor_name_custpage_owned_diamond: results[i].getValue(col[2]),
                    custpage_vendor_custpage_owned_diamond: results[i].getValue(col[3]),
                    custpage_vendor_ret_status_custpage_owned_diamond: results[i].getValue(col[4]),
                    custpage_reason_for_diamd_ret_custpage_owned_diamond: reasonForDiamondRet,
                    custpage_reason_for_diamd_ret_hidden_custpage_owned_diamond: reasonForDiamondRet,
                    custpage_exptd_ret_date_custpage_owned_diamond: results[i].getValue(col[6]),
                  	custpage_exptd_ret_date_hidden_custpage_owned_diamond: results[i].getValue(col[6]),
                     custpage_notes_custpage_owned_diamond: custpage_notes,
                 	 custpage_notes_hidden_custpage_owned_diamond: custpage_notes,
					custpage_restlet_status_custpage_owned_diamond: results[i].getValue(col[8]),
					custpage_gemstone_status_custpage_owned_diamond: gemstoneStatus,
                  	custpage_gemstone_status_hidden_custpage_owned_diamond: gemstoneStatus,
					custpage_date_rec_frm_po_status_custpage_owned_diamond: results[i].getValue(col[10]),
					custpage_cost_custpage_owned_diamond: results[i].getValue(col[11]),
					custpage_price_custpage_owned_diamond: results[i].getValue(col[12]),
					custpage_asset_account_custpage_owned_diamond: results[i].getValue(col[13]),
					custpage_owned_reason_custpage_owned_diamond: results[i].getValue(col[14]),
					custpage_bill_date_custpage_owned_diamond: results[i].getValue(col[15]),
                  	custpage_internalid_custpage_owned_diamond:results[i].getValue(col[16])

                });
            }
        } catch (er) {
            nlapiLogExecution('debug', 'Error - Owned Diamond', er.message);
        }
        sublistOwnedDiamond.setLineItemValues(sublistOwnedDiamond_Arr);
    }
}
