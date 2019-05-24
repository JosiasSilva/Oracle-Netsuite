function bindInvoiceslist(form, obj_result, number_of_result) {

    var html_subtab = form.addField('cutpage_subtab_invoices', 'inlineHTML', '', null, 'custpage_invoices_tab');
    var sublist_invoices = form.addSubList('custpage_invoices', 'list', "Invoices", "custpage_invoices_tab");
    sublist_invoices.addField('custpage_id', 'text', 'ID');
    sublist_invoices.addField('custpage_invoice', 'text', 'Invoice').setDisplayType('inline');
    sublist_invoices.addField('custpage_item_total', 'text', 'Item Total');
    sublist_invoices.addField('custpage_vendor', 'text', 'Vendor');
    sublist_invoices.addField('custpage_email_status', 'select', 'Email Status', 'customlist_invoice_email_status');
   sublist_invoices.addButton("custpage_markall", "Mark All", "MarkAll();");
   sublist_invoices.addButton("custpage_unmarkall", "Unmark All", "UnMarkAll();");

    bindSublistInvoices(obj_result, sublist_invoices, number_of_result);
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
         <td rowspan='2' valign='top'  align='right'><br/><select class='page_all_pageing' id='page_all_pageing_invoices'>" + html_index + "</select>\
        </td>\
    </tr>\
    <tr>\
        <td width='120px' valign='top' ><span class='number_of_record' id='number_of_record_invoices'>"+number_of_result+"</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_invoices'></td>\
         </tr>\
</table>");
}


function bindSublistInvoices(results, sublist_invoices, number_of_result) {
    if (results) {
        var sublist_invoices_Arr = [];
        try {
            var col = results[0].getAllColumns();
            var email_status = '';
            for (var i = 0; i < results.length; i++) {
                nlapiLogExecution('debug', 'Email status', results[i].getValue(col[4]))
                if (results[i].getValue(col[4]) == "" || results[i].getValue(col[4]) == null) {
                    email_status = '';

                } else {
                    email_status = results[i].getValue(col[4]);
                }
                var link = '';
                if (results[i].getValue(col[1])) {
                    link = '<a href=' + nlapiLoadFile(results[i].getValue(col[1])).getURL() + ' target="_blank" style="color:black;" > ' + results[i].getText(col[1]) + '</a>';
                }

                sublist_invoices_Arr.push({
                    custpage_id: '<a href="/app/common/custom/custrecordentry.nl?rectype=745&id=' + results[i].getValue(col[0]) + '" target="_blank" style="color:black;" > ' + results[i].getValue(col[0]) + '</a>',
                    custpage_invoice: link,
                    custpage_item_total: results[i].getValue(col[3]),
                    custpage_vendor: '<a href="/app/common/entity/vendor.nl?id=' + results[i].getValue(col[2]) + '" target="_blank" style="color:black;" > ' + results[i].getText(col[2]) + '</a>',
                    custpage_email_status: email_status
                });
            }
        } catch (er) {
            nlapiLogExecution('debug', 'Error in Invoices', er.message);
        }
        sublist_invoices.setLineItemValues(sublist_invoices_Arr);
    }
}