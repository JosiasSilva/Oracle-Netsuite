function Update_Diamond_Return_Date_on_RT() {
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
        var mySearch = nlapiLoadSearch(null, 8615);// Production
        //var mySearch = nlapiLoadSearch(null, 8269); // Sandbox
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
                var raId = searchresult[j].getId();
                var expectedReturnDate = searchresult[j].getValue(Results[5]);
                nlapiLogExecution('debug', 'expected Return Date', expectedReturnDate);
                var raRec = nlapiLoadRecord('returnauthorization', raId);
                var itemCount = raRec.getLineItemCount('item');
                for (var i = 1; i <= itemCount; i++) {
                    var itemId = raRec.getLineItemValue('item', 'item', i);
                    var expectedRTDate = nlapiLookupField('item', itemId, 'custitem192');
                    raRec.setLineItemValue('item', 'custcol_diamond_return_date', i, expectedRTDate);
                }
                var raRecId = nlapiSubmitRecord(raRec, false, true);
                nlapiLogExecution('debug', 'Updated RA Record -', raRecId);
            }
        }
    } catch (error) {
        nlapiLogExecution('debug', 'Failed during updation -', error);
    }
}