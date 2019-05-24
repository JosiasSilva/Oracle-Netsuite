function bindToBeReturnedList(form, obj_result, number_of_result) {
   
	
    var sublistToBeReturn = form.addSubList('custpage_to_be_returned', 'list', "To Be Returned", "custpage_to_be_returned_tab");
    sublistToBeReturn.addField('custpage_chk_req_to_inv_custpage_to_be_returned', 'textarea', 'Request to Inventory');
	sublistToBeReturn.addField('custpage_name_custpage_to_be_returned', 'text', 'Name');
  	sublistToBeReturn.addField('custpage_internalid_custpage_to_be_returned', 'text', 'Internal Id');//.setDisplayType('hidden');
    sublistToBeReturn.addField('custpage_location_custpage_to_be_returned', 'text', 'location');
	sublistToBeReturn.addField('custpage_vendor_custpage_to_be_returned', 'text', 'Vendor#');
    sublistToBeReturn.addField('custpage_vendor_ret_status_custpage_to_be_returned', 'text', 'Vendor Return Status');
  
	sublistToBeReturn.addField('custpage_gemstone_status_custpage_to_be_returned', 'select', 'Gemstone Status','customlist29');
  	sublistToBeReturn.addField('custpage_gemstone_status_hidden_custpage_to_be_returned', 'text', 'Gemstone Status Hidden').setDisplayType('hidden');
  
    sublistToBeReturn.addField('custpage_reason_for_diamd_ret_custpage_to_be_returned', 'select', 'Reason for Diamond Return','customlistreason_for_diamond_return');
   	sublistToBeReturn.addField('custpage_reason_for_diamd_ret_hidden_custpage_to_be_returned', 'text', 'Reason for Diamond Return Hidden').setDisplayType('hidden');
  
    sublistToBeReturn.addField('custpage_exptd_ret_date_custpage_to_be_returned', 'date', 'Expected Return Date').setDisplayType('entry');
  	sublistToBeReturn.addField('custpage_exptd_ret_date_hidden_custpage_to_be_returned', 'date', 'Expected Return Date Hidden').setDisplayType('hidden');
  
    sublistToBeReturn.addField('custpage_appt_sf_only_custpage_to_be_returned', 'text', 'Appt. in SF only');
    sublistToBeReturn.addField('custpage_other_vendor_custpage_to_be_returned', 'text', 'Other Vendor');
	sublistToBeReturn.addField('custpage_return_notes_custpage_to_be_returned', 'text', 'Return Notes');
	sublistToBeReturn.addField('custpage_carat_custpage_to_be_returned', 'text', 'Carat');
	sublistToBeReturn.addField('custpage_days_since_org_rec_custpage_to_be_returned', 'text', 'Days Since Original Receipt');
	sublistToBeReturn.addField('custpage_days_since_bill_custpage_to_be_returned', 'text', 'Days Since Bill');
	sublistToBeReturn.addField('custpage_gemstone_shape_custpage_to_be_returned', 'text', 'Gemstone Shape');
	sublistToBeReturn.addField('custpage_color_custpage_to_be_returned', 'text', 'Color');
	sublistToBeReturn.addField('custpage_clarity_custpage_to_be_returned', 'text', 'Clarity');
	sublistToBeReturn.addField('custpage_cut_custpage_to_be_returned', 'text', 'Cut');
	sublistToBeReturn.addField('custpage_lab_report_custpage_to_be_returned', 'text', 'Lab Report');
	sublistToBeReturn.addField('custpage_measurement_custpage_to_be_returned', 'text', 'Measurement');
	sublistToBeReturn.addField('custpage_cert_number_custpage_to_be_returned', 'text', 'Certificate Number');
	sublistToBeReturn.addField('custpage_price_custpage_to_be_returned', 'text', 'Price');
	sublistToBeReturn.addField('custpage_cost_custpage_to_be_returned', 'text', 'Cost');
	sublistToBeReturn.addField('custpage_vendor_carrier_custpage_to_be_returned', 'text', 'Vendor Carrier');
	sublistToBeReturn.addField('custpage_asset_account_custpage_to_be_returned', 'text', 'Asset Account');
	sublistToBeReturn.addField('custpage_on_hold_through_custpage_to_be_returned', 'text', 'On Hold Through');
	sublistToBeReturn.addField('custpage_internal_req_form_custpage_to_be_returned', 'text', 'Internal Request Form');
    sublistToBeReturn.addField('custpage_return_reason', 'text', 'Do not Return Reason');
	sublistToBeReturn.addField('custpage_highlight_tbr', 'text', 'highlight').setDisplayType('hidden');
	//Add buttons to list
    sublistToBeReturn.addButton("custpage_update_records_custpage_to_be_returned", "Update Records", "UpdateRecords('custpage_to_be_returned')");
    sublistToBeReturn.addButton("custpage_create_internal_req_custpage_to_be_returned", "Create Internal Request", "CreateInternalReq('custpage_to_be_returned')");
   // sublistToBeReturn.addButton("custpage_markall_custpage_to_be_returned", "Mark All", "MarkAll('custpage_to_be_returned');");
   // sublistToBeReturn.addButton("custpage_unmarkall_custpage_to_be_returned", "Unmark All", "UnMarkAll('custpage_to_be_returned');");
   // var fldGemStatus=form.addField('custpage_gemstone_status_filter_custpage_to_be_returned', 'select', 'Gemstone Status', 'customlist29', 'custpage_to_be_returned_tab');
   //	var fldVendor=form.addField('custpage_other_vendor_filter_custpage_to_be_returned', 'select', 'Vendor', 'vendor', 'custpage_to_be_returned_tab');
  
  	//fldGemStatus.setLayoutType('outsidebelow', 'startcol');
    //fldVendor.setLayoutType('outsidebelow', 'startcol');
   
  
    var html_subtab = form.addField('custpage_subtab_to_be_returned', 'inlineHTML', '', null, 'custpage_to_be_returned_tab');
   //	html_subtab.setLayoutType('outsidebelow', 'startcol');
   // html_subtab.setDisplaySize( 40, 15);

    bindToBeReturn(obj_result, sublistToBeReturn, number_of_result);
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
        <td rowspan='3' width='8%' valign='bottom' align='right'><br/><select class='page_all_pageing' id='page_all_pageing_to_be_returned'>" + html_index + "</select>\
        </td>\
    </tr>\
    <tr>\
		<td width='200px'> <select style='width:100%' id='gemstone_status_to_be_returned'><option value=''></option>";
		for(var i=0;i<gem_status_options.length;i++)
		{
			//var value= cat_options[i].getId();
			//var text=  cat_options[i].getText();
			htmlContent+="<option value="+gem_status_options[i].getId()+">"+gem_status_options[i].getText()+"</option>";
		}
		htmlContent+="</select>\
        </td>\
 		<td width='200px'> <select style='width:100%' id='vendors_to_be_returned' class='vendors_all'><option value=''></option>";
		htmlContent+="</select>\
        </td>\
        <td valign='top' width='150px' align='right'><span class='number_of_record' id='number_of_record_to_be_returned' style='font-size:12px' >"+number_of_result+"</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_to_be_returned'>\
        </td>\
    </tr>\
</table>";
html_subtab.setDefaultValue(htmlContent);
  
   /* html_subtab.setDefaultValue("<table width='100%' cellpadding='2' >\
    <tr>\
        <td width='120px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;' >TOTAL RECORDS:</td>\
         <td rowspan='3' valign='top'  align='right'><br/><select class='page_all_pageing' id='page_all_pageing_to_be_returned'>" + html_index + "</select>\
        </td>\
    </tr>\
    <tr>\
        <td width='120px' valign='top' ><span class='number_of_record' id='number_of_record_to_be_returned'>"+number_of_result+"</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_to_be_returned'></td>\
        </td>\
    </tr>\
</table>");*/
}

function bindToBeReturn(results, sublistToBeReturn, number_of_result) {
    if (results) {
        var sublistToBeReturn_Arr = [];
        try {
            var col = results[0].getAllColumns();
           
            for (var i = 0; i < results.length; i++) {
               var reasonForDiamondRet='',gemstoneStatus='';    
              var internalReq=results[i].getValue(col[29]);
              var style_check_box="style='margin-left:.4cm'";
              var name_id='custpage_chk_req_to_inv';
            
              if(internalReq)
              {
               
                name_id='';
                style_check_box="style='display:none;'";
              }
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
                if(optionsGS[iCountGS].getText()==results[i].getValue(col[4]))
                {
                  gemstoneStatus=optionsGS[iCountGS].getId();
                  break;
                }
              }
              var highlightColor='';
              var daysSinceBill= results[i].getValue(col[12]);
              if(daysSinceBill)
              {
                if(parseInt(daysSinceBill)>30)
                {
                  highlightColor='#ffafaf';
                }
                else if(parseInt(daysSinceBill)<30)
                {
                  highlightColor='#ffff99';
                }
              }
              
              //Stone is on a Return Authorization and On Hand > 0
              var search_ret_auth=nlapiSearchRecord('item',null,[new nlobjSearchFilter('type','transaction','anyof','RtnAuth'),new nlobjSearchFilter('quantityonhand',null,'lessthan',1),new nlobjSearchFilter('internalid',null,'anyof',results[i].getText(col[28]))]);
              
              if(search_ret_auth)
                {
                  highlightColor='#b6c8e8';
                }
              
              var on_hold_through=results[i].getValue(col[24]);
              var date_on_hold_through=new Date(on_hold_through);
              date_on_hold_through.setHours('0','0','0','0');
              var todays_date=new Date();
              todays_date.setHours('0','0','0','0');
              nlapiLogExecution('debug','On hold through',on_hold_through);
               nlapiLogExecution('debug','todays Date',todays_date);
              if(date_on_hold_through>=todays_date)
                {
                  nlapiLogExecution('debug','On hold through - IN',date_on_hold_through);
                  highlightColor=highlightColor+'-'+'1';
                }

                sublistToBeReturn_Arr.push({
                  custpage_chk_req_to_inv_custpage_to_be_returned:'<span  name="'+name_id+'"    '+style_check_box+' id="custpage_chk_req_to_inv_'+(i+1)+'" class="checkbox_unck" onclick="NLCheckboxOnClick(this);"><input type="checkbox" class="checkbox" ><img class="checkboximage" src="/images/nav/ns_x.gif" alt=""></span>',
					custpage_name_custpage_to_be_returned:results[i].getValue(col[0]),
                  	custpage_location_custpage_to_be_returned:results[i].getValue(col[1]),
                    custpage_vendor_custpage_to_be_returned: results[i].getValue(col[2]),
                    custpage_vendor_ret_status_custpage_to_be_returned: results[i].getText(col[3]),
					custpage_gemstone_status_custpage_to_be_returned: results[i].getValue(col[4]),
                  	custpage_gemstone_status_hidden_custpage_to_be_returned: results[i].getValue(col[4]),
                    custpage_reason_for_diamd_ret_custpage_to_be_returned: results[i].getValue(col[5]),
                  	custpage_reason_for_diamd_ret_hidden_custpage_to_be_returned: results[i].getValue(col[5]),
                    custpage_exptd_ret_date_custpage_to_be_returned: results[i].getValue(col[6]),
                  	custpage_exptd_ret_date_hidden_custpage_to_be_returned: results[i].getValue(col[6]),
                    custpage_appt_sf_only_custpage_to_be_returned: results[i].getValue(col[7]),
                    custpage_other_vendor_custpage_to_be_returned: results[i].getValue(col[8]),
					custpage_return_notes_custpage_to_be_returned: results[i].getValue(col[9]),
					custpage_carat_custpage_to_be_returned: results[i].getValue(col[10]),
					custpage_days_since_org_rec_custpage_owned_diamond: results[i].getValue(col[11]),
					custpage_days_since_bill_custpage_to_be_returned: results[i].getValue(col[12]),
					custpage_gemstone_shape_custpage_to_be_returned: results[i].getText(col[13]),
					custpage_color_custpage_to_be_returned: results[i].getText(col[14]),
					custpage_clarity_custpage_to_be_returned: results[i].getText(col[15]),
					custpage_cut_custpage_to_be_returned: results[i].getText(col[16]),
					custpage_lab_report_custpage_to_be_returned: results[i].getText(col[17]),
					custpage_measurement_custpage_to_be_returned: results[i].getValue(col[18]),
					custpage_cert_number_custpage_to_be_returned: results[i].getValue(col[19]),
					custpage_price_custpage_to_be_returned: results[i].getValue(col[20]),
					custpage_cost_custpage_to_be_returned: results[i].getValue(col[21]),
					custpage_vendor_carrier_custpage_to_be_returned: results[i].getValue(col[22]),
					custpage_asset_account_custpage_to_be_returned: results[i].getValue(col[23]),
					custpage_on_hold_through_custpage_to_be_returned: results[i].getValue(col[24]),
                    custpage_internal_req_form_custpage_to_be_returned: results[i].getValue(col[25]),
                  	custpage_internalid_custpage_to_be_returned:results[i].getText(col[28]),
                    custpage_return_reason: results[i].getValue(col[30]),
                  	custpage_highlight_tbr:highlightColor

                    /*custpage_name_custpage_to_be_returned:results[i].getValue(col[0]),
                  	custpage_desc_custpage_to_be_returned: results[i].getValue(col[1]),
                    custpage_other_vendor_name_custpage_to_be_returned: results[i].getValue(col[2]),
                    custpage_vendor_custpage_to_be_returned: results[i].getValue(col[3]),
                    custpage_vendor_ret_status_custpage_to_be_returned: results[i].getValue(col[4]),
                    custpage_reason_for_diamd_ret_custpage_to_be_returned: results[i].getValue(col[5]),
                    custpage_exptd_ret_date_custpage_to_be_returned: results[i].getValue(col[6]),
                    custpage_notes_custpage_to_be_returned: results[i].getValue(col[7]),
					custpage_restlet_status_custpage_to_be_returned: results[i].getValue(col[8]),
					custpage_gemstone_status_custpage_to_be_returned: results[i].getValue(col[9]),
					custpage_date_rec_frm_po_status_custpage_to_be_returned: results[i].getValue(col[10]),
					custpage_cost_custpage_to_be_returned: results[i].getValue(col[11]),
					custpage_price_custpage_to_be_returned: results[i].getValue(col[12]),
					custpage_asset_account_custpage_to_be_returned: results[i].getValue(col[13]),
					custpage_owned_reason_custpage_to_be_returned: results[i].getValue(col[14]),
					custpage_bill_date_custpage_to_be_returned: results[i].getValue(col[15])*/
                });
            }
        } catch (er) {
            nlapiLogExecution('debug', 'Error - To Be Returned', er.message);
        }
        sublistToBeReturn.setLineItemValues(sublistToBeReturn_Arr);
    }
}
