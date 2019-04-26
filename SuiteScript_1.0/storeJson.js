function beforeSubmit() {

    var data = new Array();

    var record1 = nlapiGetFieldValue('custrecord165');
    data.push(record1);

    var record2 = nlapiGetFieldValue('custrecord_item_status');
    data.push(record2);

    var record3 = nlapiGetFieldValue('custrecord_action_needed');
    data.push(record3);

    var record4 = nlapiGetFieldValue('custrecord_on_vendor_portal');
    data.push(record4);

}
