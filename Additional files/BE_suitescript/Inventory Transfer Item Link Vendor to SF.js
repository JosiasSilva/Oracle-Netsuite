function create_inventory_transfer() {
    try {
        reshedule();
        var mySearch = nlapiLoadSearch(null, 8084); //Production
        var searchresult = [];
        var resultset = mySearch.runSearch();
        var searchid = 0;
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            if (resultslice != null && resultslice != '') {
                for (var rs in resultslice) {
                    searchresult.push(resultslice[rs]);
                    searchid++;
                }
            }
        }
        while (resultslice.length >= 1000);
        var searchCount = searchresult.length;
        if (searchCount > 0) {
            for (var j = 0; j < searchresult.length; j++) {
                reshedule();
                var Results = searchresult[j].getAllColumns();
                var poLink = searchresult[j].getId();
                var transactionName = searchresult[j].getValue(Results[0]);
                var memostatus = 'Item Link Vendor to SF: ' + transactionName;
                var itemToTransfer = searchresult[j].getValue(Results[1]);
                var itemToTransferName = searchresult[j].getText(Results[1]);
                var description = searchresult[j].getValue(Results[2]);
                var qtyToTransfer = searchresult[j].getValue(Results[3]);
                var transferFrom = searchresult[j].getValue(Results[4]);
                var fromLocation = '2';
                var transferTo = searchresult[j].getValue(Results[5]);
                var lineId = searchresult[j].getValue(Results[6]);
                var dateSentFromSF = searchresult[j].getValue(Results[7]);
                var poItem = searchresult[j].getValue(Results[8]);
                var VBDstatus = searchresult[j].getValue(Results[9]);
                var inventoryTransfer = null;
                inventoryTransfer = nlapiCreateRecord('inventorytransfer');
                inventoryTransfer.setFieldValue('custbody_transaction_link_inv', poLink);
                inventoryTransfer.setFieldValue('memo', memostatus);
                inventoryTransfer.setFieldValue('location', transferFrom);
                inventoryTransfer.setFieldValue('transferlocation', transferTo);
                inventoryTransfer.selectNewLineItem('inventory');
                inventoryTransfer.setCurrentLineItemValue('inventory', 'item', itemToTransfer);
                inventoryTransfer.setCurrentLineItemValue('inventory', 'adjustqtyby', qtyToTransfer);
                inventoryTransfer.commitLineItem('inventory');
                try {
                    var InventoryTransferRecId = nlapiSubmitRecord(inventoryTransfer, true, true);
                    nlapiLogExecution('debug', 'Search ID-8084 Inventory Transfer', InventoryTransferRecId);
                } catch (err) {
                    nlapiLogExecution("debug", " Error during  record creation:", err.message);
                }
            }
        }
    } catch (error) {
        nlapiLogExecution("debug", " Error during  record creation:", error.message);
    }
}
function reshedule() {
    if (nlapiGetContext().getRemainingUsage() < 500) {
        var stateMain = nlapiYieldScript();
        if (stateMain.status == 'FAILURE') {
            nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
            throw "Failed to yield script";
        } else if (stateMain.status == 'RESUME') {
            nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
        }
    }
}