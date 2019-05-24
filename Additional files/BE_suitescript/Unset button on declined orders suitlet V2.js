function Update_UnsetPO_Field(type, form) {
    if (type == 'view') {
        try {
            var categoryArr = new Array();
            var id = nlapiGetRecordId();
            var so_obj = nlapiLoadRecord('salesorder', id);
            for (var i = 1; i <= so_obj.getLineItemCount('item'); i++) {
                var itemId = so_obj.getLineItemValue('item', 'item', i);
                var poVendor = so_obj.getLineItemValue('item', 'povendor', i);
                var category = nlapiLookupField('item', itemId, 'custitem20');
            }
            var orderStatus = so_obj.getFieldValue('status');
            if (orderStatus == 'Closed') {
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
        var POnotes;
        if (id) {
            para["status"] = false;
            var categoryArr = new Array();
            var so_obj = nlapiLoadRecord('salesorder', id);
            for (var i = 1; i <= so_obj.getLineItemCount('item'); i++) {
                var itemId = so_obj.getLineItemValue('item', 'item', i);
                var poVendor = so_obj.getLineItemValue('item', 'povendor', i);
                var itemDesc = nlapiLookupField('item', itemId, 'salesdescription');
                var orderStatus = so_obj.getFieldValue('status');
                var documentNo = so_obj.getFieldValue('tranid');
				var insuranceValue = so_obj.getFieldValue('custbody_full_insurance_amount'); //Adjustment done by sanjeet 13th April 2018
                var category = nlapiLookupField('item', itemId, 'custitem20');
                if (orderStatus == 'Closed' && (category == '1' || category == '2' || category == '7' || category == '8' || category == '14' || category == '15' || category == '18' || category == '20' || category == '23' || category == '30' || category == '31')) {

                    categoryArr.push({
                        category: category,
                        itemDesc: itemDesc,
                        orderStatus: orderStatus,
                        itemId: itemId,
                        poVendor: poVendor,
                        documentNo: documentNo,
						insuranceValue: insuranceValue //Adjustment done by sanjeet 13th April 2018
                    });
                }
            }
            var count = categoryArr.length;
			//Adjustment done by sanjeet 13th April 2018
            var description = categoryArr[0].itemDesc + "\n\n" + categoryArr[1].itemDesc
            nlapiLogExecution('debug', 'description', description);
            var vendor = categoryArr[1].poVendor;
           var itemInternalId = categoryArr[1].itemId;
            var notesField = categoryArr[0].documentNo;
			var fullInsuranceValue = categoryArr[0].insuranceValue;
            var po_obj = nlapiCreateRecord('purchaseorder');
            po_obj.setFieldValue('createdfrom', id);
            po_obj.setFieldValue('entity', vendor);
            var date = new Date();
            var today_date = nlapiDateToString(date);
            var notes = today_date + '\xa0' + 'Unset from SO' + '\xa0' + notesField;

            po_obj.setFieldValue('custbody58', notes);
            var repairItem = 1087131;
            po_obj.selectNewLineItem('item');
            po_obj.setCurrentLineItemValue('item', 'item', repairItem);
            po_obj.setCurrentLineItemValue('item', 'description', description);
            po_obj.setCurrentLineItemValue('item', 'amount', 0);
			po_obj.setCurrentLineItemValue('item', 'custcol_full_insurance_value', fullInsuranceValue);
            po_obj.setCurrentLineItemValue('item', 'custcolitem_link', itemInternalId);
            po_obj.commitLineItem('item');
            po_id = nlapiSubmitRecord(po_obj, true, true);
            var POField = nlapiLookupField('purchaseorder', po_id, ['tranid', 'custbody58']);
            var PoNotes = POField.custbody58;
            var PONo = POField.tranid;
            var note = so_obj.getFieldValue('custbody58');
            var poNotes;
            if (note) {
                poNotes = today_date + "\xa0" + "Unset PO" + "\xa0" + PONo + "\n" + note;
            } else {
                poNotes = today_date + "\xa0" + "Unset PO" + "\xa0" + PONo;
            }
            nlapiLogExecution('debug', 'Note Set on PO', poNotes);
            //so_obj.setFieldValue('custbody58',POnotes);
            //nlapiSubmitRecord(so_obj, true, true);
            para["po_id"] = po_id;
            nlapiLogExecution('debug', 'salesorder #' + id);
            nlapiLogExecution('debug', 'PO successfully created #' + po_id);
			var notesForPo = "Please unset center stone and return loose setting and DIA to SF Reference PO" + PONo
            var loadPo = nlapiLoadRecord('purchaseorder', po_id);
            loadPo.setLineItemValue('item', 'custcol5',1,notesForPo);
            var setNote = nlapiSubmitRecord(loadPo, true, true);
        }
        nlapiSubmitField('salesorder', id, 'custbody58', poNotes);

    } catch (ex) {
        nlapiLogExecution('error', 'Error on Page', ex);
    }
    nlapiSetRedirectURL('record', 'purchaseorder', po_id, 'view', para);
}