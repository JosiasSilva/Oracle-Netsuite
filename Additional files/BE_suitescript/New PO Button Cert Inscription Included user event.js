function button_Cert_Inscription_Included(type, form) {
    if (type == 'view') {
        try {
            var id = nlapiGetRecordId();
            var Po_field = nlapiLookupField('purchaseorder', id, ['status', 'vendor.custentity4']);
            var orderStatus = Po_field.status;
            var typeOfContact = Po_field['vendor.custentity4'];
            if (typeOfContact == '1' && (orderStatus == 'pendingBillPartReceived' || orderStatus == 'partiallyReceived' || orderStatus == 'pendingReceipt'))
            {
                form.addButton("custpage_cert_button", "Cert/Inscription Included", "window.location.href='/app/site/hosting/scriptlet.nl?script=2188&deploy=1&id=" + id + "';");
            }
        }
      catch (ex) {
            nlapiLogExecution('error', 'Error on Page', ex);
        }
    }
}

function update_line_values(request, response) {
    var para = new Array();
    var id = request.getParameter('id');
    var po_id;
    try {
        if (id) {
            para["status"] = false;
            var po_obj = nlapiLoadRecord('purchaseorder', id);
            for (var i = 1; i <= po_obj.getLineItemCount('item'); i++) {
                var itemId = po_obj.getLineItemValue('item', 'item', i);
                po_obj.setLineItemValue('item', 'custcol28', i, '1');
                po_obj.setLineItemValue('item', 'custcoldiamondinscription', i, 'T');

            }
          po_id=nlapiSubmitRecord(po_obj, true, true);
            para["po_id"] = po_id;
            nlapiLogExecution('debug', 'PO successfully updated #' + po_id);
        }

    } catch (ex) {
        nlapiLogExecution('error', 'Error on Page', ex);
    }
    nlapiSetRedirectURL('record', 'purchaseorder', po_id, 'view', para);

}