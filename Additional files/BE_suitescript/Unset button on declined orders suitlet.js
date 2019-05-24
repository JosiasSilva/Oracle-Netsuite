function Update_UnsetPO_Field(type, form) {
    if (type == 'view') {
        try {
            var categoryArr=new Array();
            var id = nlapiGetRecordId();
            var so_obj = nlapiLoadRecord('salesorder', id);
            for (var i = 1; i <= so_obj.getLineItemCount('item'); i++) {
                var itemId = so_obj.getLineItemValue('item', 'item', i);
                var poVendor = so_obj.getLineItemValue('item', 'povendor', i);
                var  category = nlapiLookupField('item', itemId, 'custitem20');
            }
            var orderStatus = so_obj.getFieldValue('status');
          if (orderStatus == 'Closed'){
                  form.addButton("custpage_unset_po_button", "Unset PO", "window.location.href='/app/site/hosting/scriptlet.nl?script=2174&deploy=1&id=" + id + "';");
                } 
        } catch (ex) {
            nlapiLogExecution('error', 'Error on Page', ex);
        }
    }
}

function Create_PO(request, response) {
    var para = new Array();
    var id = request.getParameter('id');
    var po_id;
    try {
        if (id) {
            para["status"] = false;
            var categoryArr = new Array();
            //var id = nlapiGetRecordId();
            var so_obj = nlapiLoadRecord('salesorder', id);
            for (var i = 1; i <= so_obj.getLineItemCount('item'); i++) {
                var itemId = so_obj.getLineItemValue('item', 'item', i);
                var poVendor = so_obj.getLineItemValue('item', 'povendor', i);
                var orderStatus = so_obj.getFieldValue('status');
                var documentNo = so_obj.getFieldValue('tranid');
                var category = nlapiLookupField('item', itemId, 'custitem20');
                if (orderStatus == 'Closed' && (category == '1' || category == '2' || category == '7' || category == '8' || category == '14' || category == '15' || category == '18' || category == '20' || category == '23' || category == '30' || category == '31')) {

                    categoryArr.push({
                        category: category,
                        orderStatus: orderStatus,
                        itemId: itemId,
                        poVendor: poVendor,
                        documentNo: documentNo
                    });
                }
            }
            var count = categoryArr.length;
            var vendor = categoryArr[0].poVendor;
            var notesField = categoryArr[0].documentNo;
            var po_obj = nlapiCreateRecord('purchaseorder');
            po_obj.setFieldValue('createdfrom', id);
            po_obj.setFieldValue('entity', vendor);
            var date = new Date();
            var today_date = nlapiDateToString(date);
            var notes = today_date + '\xa0' + 'Unset from SO' + '\xa0' + notesField;
            po_obj.setFieldValue('custbody58', notes);
            for (var j = 0; j < count; j++) {
                var itemID = categoryArr[j].itemId;
                po_obj.selectNewLineItem('item');
                po_obj.setCurrentLineItemValue('item', 'item', itemID);
                po_obj.commitLineItem('item');
            }
            po_id = nlapiSubmitRecord(po_obj, true, true);
            para["po_id"] = po_id;
            nlapiLogExecution('debug', 'salesorder #' + id);
            nlapiLogExecution('debug', 'PO successfully created #' + po_id);
        }

    } catch (ex) {
        nlapiLogExecution('error', 'Error on Page', ex);
    }
    nlapiSetRedirectURL('record', 'purchaseorder', po_id, 'view', para);

}