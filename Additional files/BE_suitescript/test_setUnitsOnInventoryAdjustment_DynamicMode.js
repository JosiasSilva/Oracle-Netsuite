nlapiLogExecution("audit","FLOStart",new Date().getTime());
function test() {

    var ia = nlapiCreateRecord('inventoryadjustment', {
        recordmode: 'dynamic'
    });
    //ia.setFieldValue('trandate', nlapiDateToString(new Date()));
    ia.setFieldValue('account', nlapiGetContext().getSetting('SCRIPT', 'custscript_inventory_adjustment_account'));
    ia.setFieldValue('memo', 'BE Fulfill: Automated Inventory Transfer for Item Fulfillment purposes. - TEST UNITS');

    ia.selectNewLineItem('inventory');
    ia.setCurrentLineItemValue('inventory', 'item', '29373');
    ia.setCurrentLineItemValue('inventory', 'location', '2');
    ia.setCurrentLineItemValue('inventory', 'units', '14');
    ia.setCurrentLineItemValue('inventory', 'adjustqtyby', 1);
    //ia.setCurrentLineItemValue('inventory', 'unitcost', nlapiFormatCurrency('95.51'));
    ia.commitLineItem('inventory');

    var id = nlapiSubmitRecord(ia, false, false);

}
