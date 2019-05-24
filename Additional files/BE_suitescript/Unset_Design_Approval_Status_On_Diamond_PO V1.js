function Unset_Design_Approval_Status_On_Diamond_PO(order_id) {
    var order = nlapiLoadRecord("salesorder", order_id);
    var createPOLinkCount = order.getLineItemCount('links'); //find PO link on line item
    nlapiLogExecution("DEBUG", "Create PO Link Count", createPOLinkCount);
    for (var m = 1; m <= createPOLinkCount; m++) {
        var curr_item_type = order.getLineItemValue('links', 'type', m);
        var curr_item_PoID = order.getLineItemValue('links', 'tranid', m);
        nlapiLogExecution('DEBUG', 'curr_record_type and ID', curr_item_type + " " + curr_item_PoID);
        if (curr_item_type === 'Purchase Order') {
            var transType = 'purchaseorder';
            var filters = new Array();
            filters[0] = nlobjSearchFilter('tranid', null, 'is', curr_item_PoID);
            filters[1] = nlobjSearchFilter('mainline', null, 'is', 'T');
            var transResult = nlapiSearchRecord(transType, null, filters);
            if (transResult != null) {

                var po_data = nlapiLoadRecord(transType, transResult[0].getId());

                for (var g = 0; g < po_data.getLineItemCount("item"); g++) {
                    var item_id = po_data.getLineItemValue("item", "item", g + 1);
                    nlapiLogExecution("DEBUG", "Item id in Unset_Design_Approval_Status_On_Diamond_P() fun", item_id);
                    var itemtype = po_data.getLineItemValue('item', 'itemtype', g + 1);
                    nlapiLogExecution("DEBUG", "Item Type in Unset_Design_Approval_Status_On_Diamond_PO() fun", itemtype);
                    if (itemtype == "InvtPart") {
                        //NS-1385
                        var so_Id = po_data.getFieldValue('createdfrom');
                        var hyperlink = nlapiLookupField('salesorder', so_Id, 'custbody_cadmoldhyperlink');
                        //End
                        var item_category = nlapiLookupField("inventoryitem", item_id, "custitem20");
                        //Changes as per WB Po(item_category == 3) 25th July
                        if (item_category == 3 || item_category == 7 || item_category == 8 || item_category == 14 || item_category == 15 || item_category == 18 || item_category == 19 || item_category == 31)
                        //End
                        {
                            nlapiSubmitField('purchaseorder', transResult[0].getId(), ['custbody41', 'custbody_cadmoldhyperlink'], ['', hyperlink]);
                            nlapiLogExecution("DEBUG", "Design Approval Status has been set blank successfully on diamond PO having PO id ::", transResult[0].getId());
                            break;

                        } else {
                            nlapiSubmitField('purchaseorder', transResult[0].getId(), 'custbody_cadmoldhyperlink', hyperlink);
                            nlapiLogExecution("DEBUG", "Set hyperlink on production PO:", transResult[0].getId());
                            break;
                        }
                    }
                } //end inner for loop
            } //end inner if
        } //end outer if
    } //end outer for loop
}