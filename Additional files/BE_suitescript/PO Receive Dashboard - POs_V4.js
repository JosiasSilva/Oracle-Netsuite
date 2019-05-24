/*
Script Author : 	Sandeep Kumar ([sandeep.kumar@inoday.com](mailto:sandeep.kumar@inoday.com))
Author Desig. : 	Sr. Developer, Inoday Consultancy Pvt. Ltd.
Script Type : 		Suitescript (Library Script)
Script Name :		PO Receive Dashboard - POs.js
Comments :		Library File used for PO Receive Dashboard
SS URL :		
Script URL:		

Modification Details:
Modified On:		06/27/2018
Modified By:		Nikhil Bhutani
Task Related:		NS-1240
Script Name :		PO Receive Dashboard - POs_V1.js
Description:		Adding Delivery Date Column and highlighting the rows based on certain conditions

Modified On:		11/27/2018
Modified By:		Bharath Prakash
Task Related:		NS-1437
Script Name :		PO Receive Dashboard - POs_V4.js
Description:		Highlighting/making text bold of a row based on certain conditions
*/

function bindPOslist(form, obj_result, number_of_result, vendorDetArr) {
    var html_subtab = form.addField('cutpage_subtab_pos', 'inlineHTML', '', null, 'custpage_pos_tab');
    var sublistPOs = form.addSubList('custpage_pos', 'list', "Purchase Orders", 'custpage_pos_tab');
    sublistPOs.addField('custpage_receive_chk', 'checkbox', 'Receive');
    sublistPOs.addField('custpage_vendor', 'text', 'Vendor');
    sublistPOs.addField('custpage_purchase_order', 'text', 'Purchase Order');
    sublistPOs.addField('custpage_po_id', 'text', 'Purchase Order Id').setDisplayType('hidden');
    sublistPOs.addField('custpage_date_shipped_from_vendor', 'date', 'Date Shipped From Vendor');
    sublistPOs.addField('custpage_date_needed_in_sf', 'date', 'Date Needed In SF');
    sublistPOs.addField('custpage_dropship', 'text', 'Drop Ship').setDisplayType('hidden');
    sublistPOs.addField('custpage_delivery_date', 'date', 'Delivery Date');
    // added by Bhutani on 27/6/18 for NS-1240
    sublistPOs.addField('custpage_delivery_date_firm', 'text', 'Delivery Date Firm').setDisplayType('hidden');
    sublistPOs.addField('custpage_delivery_date_flag', 'text', 'Delivery Date Flag').setDisplayType('hidden');

    // end added by Bhutani on 27/6/18 for NS-1240
    // Code Addition by Bharath - NS-1437 on 11/27/2018
     sublistPOs.addField('custpage_del_date_flag', 'text', 'Delivery Current Date Flag').setDisplayType('hidden');
     sublistPOs.addField('custpage_del_date_mon', 'text', 'Delivery Monday Date Flag').setDisplayType('hidden');
      sublistPOs.addField('custpage_del_date_diff', 'text', 'Delivery Next Month Date Flag').setDisplayType('hidden');
     sublistPOs.addField('custpage_to_be_tested', 'checkbox', 'To be Tested Flag').setDisplayType('hidden');
      sublistPOs.addField('custpage_to_be_tested_flag', 'text', 'To be Tested Flag').setDisplayType('hidden');
      // End of code addition for NS-1437 on 11/27/2018
    var dropship = sublistPOs.addField('custpage_dropship_new', 'select', 'Drop Ship');
    dropship.addSelectOption('Yes', 'Yes');
    dropship.addSelectOption('No', 'No');
    sublistPOs.addRefreshButton();
    form.addField('custpage_is_receive', 'text', '').setDisplayType('hidden');
    sublistPOs.addButton("custpage_receive", "Receive", "ReceivePO();");
    nlapiLogExecution('debug', 'PO records', obj_result.length);
    bindSublistOfPOs(obj_result, sublistPOs, number_of_result);
    var index = 1;
    var html_index;
    for (var i = 0; i < Math.ceil(number_of_result / divided_size); i++) {
        var nextIndex = index + paging_size;
        if (nextIndex > number_of_result)
            nextIndex = number_of_result;
        html_index += '<option value=' + index + '>' + index + ' - ' + nextIndex + '</option>';
        index = nextIndex + 1;
    }

    var htmlContent = "<table width='100%' cellpadding='1'>\
    <tr>\
          <td rowspan='3' valign='bottom'>\
            <input style='width:100%' type='text' class='search_key' id='search_key_items' placeholder='Search By Purchase Order# '>\
        </td>\
         <td rowspan='3' valign='bottom'>\
            <input class='btn_search_key' id='btn_search_key_items' type='button' value='Search' style='border: none;background-color: #008CBA; color: white;    padding: 5px 20px;    text-align: center;    text-decoration: none;    display: inline-block;    font-size: 12px;    margin: -1px -2px;    cursor: pointer;'>\
        </td>\
		<td width='200px' align='left' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>VENDOR:</td>\
        <td  align='right' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>TOTAL RECORDS:</td>\
        <td rowspan='3' valign='bottom' align='right'><br/><select class='page_all_pageing' id='page_all_pageing_pos'>" + html_index + "</select>\
        </td>\
    </tr>\
    <tr>\
		<td width='200px'> <select style='width:100%' id='lst_vendors'><option value=''>-ALL-</option>";
    for (var i = 0; i < vendorDetArr.length; i++) {
        //var value= cat_options[i].getId();
        //var text=  cat_options[i].getText();
        htmlContent += "<option value=" + vendorDetArr[i].vendor_id + ">" + vendorDetArr[i].vendor_name + "</option>";
    }
    htmlContent += "</select>\
        </td>\
        <td valign='top'  align='right'><span class='number_of_record' id='number_of_record_items' style='font-size:12px' >" + number_of_result + "</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_items'>\
        </td>\
    </tr>\
</table>"
    html_subtab.setDefaultValue(htmlContent);
}


function bindSublistOfPOs(results, sublistPOs, number_of_result) {
    if (results) {
        var sublistPOs_Arr = [];
        try {
            var col = results[0].getAllColumns();
           nlapiLogExecution("DEBUG","Columns",col);
            for (var i = 0; i < results.length; i++) {
	    // added by Bhutani on 27/6/18 for NS-1240
                var delivery_date_firm = results[i].getValue(col[8]);
                var temp_to_be_tested =  results[i].getValue(col[9]);
               
                var deliverydate_flag = '0';
                var del_date_today = '0';
                var del_date_mon = '0';
                var del_date_diff = '0'
                var todays_weekend_check = new Date();
                var weekendDate = todays_weekend_check.getDate();
                var weekendMonth = todays_weekend_check.getMonth();
                var weekendPlusOne = todays_weekend_check.getMonth() + 1;
                
                var weekendYear = todays_weekend_check.getYear();
                var weekend_day = todays_weekend_check.getDay();
                 
                var to_be_test_fl = '0';
                var todays_date = new Date();
               
                var todays_day = todays_date.getDay();
                var delivery_date = new Date(results[i].getValue(col[7]));
                 var del_date_ch = delivery_date.getDate();
                 var del_date_mth = delivery_date.getMonth();
                 var del_date_year = delivery_date.getYear();
                 var del_date_day = delivery_date.getDay();
                 
                var po_id_cr = results[i].getValue(col[2]);
                var tomorrow = new Date(todays_date);
                tomorrow.setDate(todays_date.getDate() + 1);
                var delivery_day = delivery_date.getDay();
                if (delivery_date != '') {
                      
                    if (todays_day == 5) {
                        tomorrow.setDate(todays_date.getDate() + 3);
                    } else if (todays_day == 6) {
                        tomorrow.setDate(todays_date.getDate() + 2);
                    } else if (todays_day == 0) {
                        tomorrow.setDate(todays_date.getDate() + 1);
                    } else {}
                    if (delivery_date.getDate() == tomorrow.getDate() && delivery_date.getMonth() == tomorrow.getMonth() && delivery_date.getYear() == tomorrow.getYear()) {
                        deliverydate_flag = '1';
                    } else {
                        deliverydate_flag = '0';
                    }
                } else {
                    deliverydate_flag = '0';
                }

		// end added by Bhutani on 27/6/18 for NS-1240
		// Code added by Bharath NS-1437
		// Delivery Date is Current date test
		    if (delivery_date.getDate() == todays_date.getDate() && delivery_date.getMonth() == todays_date.getMonth() && delivery_date.getYear() == todays_date.getYear()){
                     
                	del_date_today = '1';
                }
              
                else{
                	del_date_today = '0';
                }
              // Delivery date is next non weekend test
                 if(del_date_day == 1){
                 if (del_date_ch == weekendDate + 3){
                      if (del_date_mth == weekendMonth){
                           if (del_date_year == weekendYear){
                             
                        if (weekend_day == 5){
                          
                      
                      del_date_mon = '1';
                          }
                        }
                      }
                      }
                 }
                 else {
                    del_date_mon = '0'
                 }
              // Delivery Date is next non weekend in next month test
                if(del_date_day == 1){
                if (del_date_ch <= weekendDate){
                if (del_date_mth == weekendPlusOne){
                           if (del_date_year == weekendYear){
                        if (weekend_day == 5){
                           
                          del_date_diff = '1';
                           }
                        }
                           }
                }
                }
              else {
                del_date_diff = '0'
              }
              // var temp_to_be_tested = nlapiLookupField('purchaseorder',po_id_cr,'custbody_random_testing',false);
              //  nlapiLogExecution("DEBUG","temp test value",temp_to_be_tested);
                if (temp_to_be_tested == 'T'){
                	to_be_test_fl = '1';
                }
                else{
                	to_be_test_fl = '0';
                }
          // End of  Code added by Bharath NS-1437      
                sublistPOs_Arr.push({
                    custpage_vendor: results[i].getText(col[0]),
                    custpage_purchase_order: "<a href='/app/common/item/item.nl?id=" + results[i].getId() + "' target='_blank'> " + results[i].getValue(col[2]) + "</a>",
                    custpage_po_id: results[i].getId(),
                    custpage_date_shipped_from_vendor: results[i].getValue(col[3]),
                    custpage_date_needed_in_sf: results[i].getValue(col[4]),
                    custpage_dropship: "<span id='custpage_dropship" + i + "'>" + results[i].getValue(col[5]) + " </span>",
                    custpage_dropship_new: results[i].getValue(col[5]),
                    custpage_delivery_date: results[i].getValue(col[7]),		    
		    // added by Bhutani on 27/6/18 for NS-1240
                    custpage_delivery_date_firm: delivery_date_firm,
                    custpage_delivery_date_flag: deliverydate_flag,
		    // end added by Bhutani on 27/6/18 for NS-1240
		    // Code Added by Bharath NS-1437
		            custpage_del_date_flag: del_date_today,
		            custpage_to_be_tested_flag: to_be_test_fl,
                    custpage_del_date_mon: del_date_mon,
                    custpage_del_date_diff: del_date_diff
		   // End of code chsnge by Bharath NS-1437
                });
               
                sublistPOs.setLineItemValues(sublistPOs_Arr);

            }
        } catch (er) {
            nlapiLogExecution('debug', 'Error in binding POs', er.message);
        }

        nlapiLogExecution('debug', 'results', JSON.stringify(sublistPOs_Arr));

    }
}