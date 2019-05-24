function test(){

    var ia = nlapiCreateRecord('inventoryadjustment');
    ia.setFieldValue('trandate', nlapiDateToString(new Date()));
    ia.setFieldValue('account', nlapiGetContext().getSetting('SCRIPT', 'custscript_inventory_adjustment_account'));
    ia.setFieldValue('memo', 'BE Fulfill: Automated Inventory Transfer for Item Fulfillment purposes. - TEST UNITS');
    
    var currentLine = 1;
    
    /*Add quantity committed to fulfillment location*/
    ia.insertLineItem('inventory', currentLine);
    ia.setLineItemValue('inventory', 'units', currentLine, '14');
    ia.setLineItemValue('inventory', 'item', currentLine, '29373');
    ia.setLineItemValue('inventory', 'location', currentLine, '1');
    ia.setLineItemValue('inventory', 'adjustqtyby', currentLine, 1);
    ++currentLine;
    
    /*Subtract quantity received from committed location*/
    ia.insertLineItem('inventory', currentLine);
    ia.setLineItemValue('inventory', 'units', currentLine, '14');
    ia.setLineItemValue('inventory', 'item', currentLine, '29373');
    ia.setLineItemValue('inventory', 'location', currentLine, '1');
    ia.setLineItemValue('inventory', 'adjustqtyby', currentLine, -1);
    
    var id = nlapiSubmitRecord(ia, true, false);
    
}
