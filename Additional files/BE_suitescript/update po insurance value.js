function upadate_Po_insurance_value() {
    try {
        if (nlapiGetContext().getRemainingUsage() < 500) {
            var stateMain = nlapiYieldScript();
            if (stateMain.status == 'FAILURE') {
                nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
                throw "Failed to yield script";
            } else if (stateMain.status == 'RESUME') {
                nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
            }
        }
        var mySearch = nlapiLoadSearch(null, 6429); // Production
        //var mySearch = nlapiLoadSearch(null, 7810);// Sandbox
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
                if (nlapiGetContext().getRemainingUsage() < 500) {
                    var stateMain = nlapiYieldScript();
                    if (stateMain.status == 'FAILURE') {
                        nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
                        throw "Failed to yield script";
                    } else if (stateMain.status == 'RESUME') {
                        nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
                    }
                }
                var Results = searchresult[j].getAllColumns();
                var poId = searchresult[j].getId();
                var saveSearchItemId = searchresult[j].getValue(Results[2]);
                var updateInsurance = searchresult[j].getValue(Results[9]);
                nlapiLogExecution('debug', 'Updated Insurance value', updateInsurance);
                var purchaseOrderRec = nlapiLoadRecord('purchaseorder', poId);
                var itemCount = purchaseOrderRec.getLineItemCount('item');
                for (var i = 0; i < itemCount; i++) {
                    var lineItemId = purchaseOrderRec.getLineItemValue('item', 'item', i + 1);
                    var insuranceValue = purchaseOrderRec.getLineItemValue('item', 'custcol_full_insurance_value', i + 1);
                    if (saveSearchItemId == lineItemId) {
                        purchaseOrderRec.setLineItemValue('item', 'custcol_full_insurance_value', i + 1, updateInsurance);
						break;
                    }
                }
                var purchaseRecId = nlapiSubmitRecord(purchaseOrderRec, false, true);
                nlapiLogExecution('debug', 'Updated po Record -', purchaseRecId);
            }
        }
    } catch (error) {
        nlapiLogExecution('debug', 'Error during updation -', error.message);
    }
}