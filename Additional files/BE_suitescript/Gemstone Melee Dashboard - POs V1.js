function bindPOslist(form, obj_result, number_of_result) {
    var html_subtab = form.addField('cutpage_subtab_pos', 'inlineHTML', '', null, 'custpage_pos_tab');
    var sublistPOs = form.addSubList('custpage_pos', 'list', "POs", 'custpage_pos_tab');
    sublistPOs.addField('custpage_email', 'text', 'Email');
    sublistPOs.addField('custpage_date_created', 'date', 'Date Created');
    sublistPOs.addField('custpage_po_document_no', 'text', 'PO #');
    sublistPOs.addField('custpage_po_vendor', 'text', 'Vendor');
    sublistPOs.addField('custpage_item', 'text', 'Item name/ number');
    sublistPOs.addField('custpage_item_desc', 'text', 'Item Description');
   	sublistPOs.addField('custpage_item_id', 'text', 'Item Id').setDisplayType('hidden');
    sublistPOs.addField('custpage_po_id', 'text', 'PO Id').setDisplayType('hidden');

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
	
	var htmlContent="<table width='100%' cellpadding='2'>\
    <tr>\
        <td  align='right' style='color: #6f6f6f !important;font-size: 12px;font-weight: normal !important;text-transform: uppercase;'>TOTAL RECORDS:</td>\
        <td rowspan='3' width='120px' valign='bottom' align='right'><br/><select class='page_all_pageing' id='page_all_pageing_pos'>" + html_index + "</select>\
        </td>\
    </tr>\
    <tr>\
         <td valign='top'  align='right'><span class='number_of_record' id='number_of_record_pos' style='font-size:12px' >"+number_of_result+"</span>\
            <input type='hidden' class='number_of_record_hide' value='0' id='number_of_record_hide_pos'>\
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
            for (var i = 0; i < results.length; i++) {

                sublistPOs_Arr.push({
                    custpage_item: "<a href='/app/common/item/item.nl?id="+results[i].getValue(col[0])+"' target='_blank' style='color:blue'>"+results[i].getText(col[0])+"</a>",
                    custpage_item_id: results[i].getValue(col[0]),
                    custpage_po_document_no: "<a href='/app/accounting/transactions/purchord.nl?id="+results[i].getId()+"' target='_blank' style='color:blue' >"+results[i].getValue(col[1])+"</a>",
                  custpage_po_vendor: "<a href='/app/common/entity/vendor.nl?id="+results[i].getValue(col[5])+"' target='_blank' style='color:blue' >"+results[i].getValue(col[4])+"</a>",
                   custpage_po_id: results[i].getId(),
                  custpage_email:"<a href='#' style='color:blue' onclick=window.open('/app/crm/common/crmmessage.nl?transaction="+results[i].getId()+"&entity="+results[i].getValue(col[5])+"&l=T&templatetype=EMAIL&gem_call=1','win','width=400,height=400')>Review & Email</a>",
                  //custpage_email:"<a href='/app/crm/common/crmmessage.nl?transaction="+results[i].getId()+"&entity="+results[i].getValue(col[5])+"&l=T&templatetype=EMAIL' target='_new' style='color:blue' >Email</a>",
                  custpage_date_created:results[i].getValue(col[2]),
                  custpage_item_desc:results[i].getValue(col[3])
                 });
            }
        } catch (er) {
            nlapiLogExecution('debug', 'Error in POs Listing', er.message);
        }
        sublistPOs.setLineItemValues(sublistPOs_Arr);
    }
}