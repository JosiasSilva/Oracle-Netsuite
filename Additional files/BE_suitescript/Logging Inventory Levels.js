function logging_inventory_levels()
{
    try {
        reshedule();
        var mySearch = nlapiLoadSearch(null, 8101); // production
       var date_string='';
	   var today = new Date();
		date_string =  nlapiDateToString(today,'date');
        var searchresult = [];
        var resultset = mySearch.runSearch();
      	//var startindex = nlapiGetContext().getSetting('SCRIPT', 'custscript_lil_start_from');
		//var endIndex=nlapiGetContext().getSetting('SCRIPT', 'custscript_lil_end_to');
        var searchid = 0;
        do {
            //var resultslice = resultset.getResults(startindex, endIndex);
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
                var itemId = searchresult[j].getId();
                var itemName = searchresult[j].getValue(Results[0]);
                var description = searchresult[j].getValue(Results[1]);
                var createdDate = searchresult[j].getValue(Results[3]).split(" ");
                var date = createdDate[0];
                var category = searchresult[j].getValue('custitem20');
                var itemObj = nlapiLoadRecord('inventoryitem', itemId);
                var countLocation = itemObj.getLineItemCount('locations');



                for (var i = 1; i <= countLocation; i++) {
                    var locationId = itemObj.getLineItemValue('locations', 'location', i);
                    var quantityAvailable = itemObj.getLineItemValue('locations', 'quantityavailable', i);

                    if (quantityAvailable != null && quantityAvailable >= 0) {

                        var filter = new Array();
                        filter.push(new nlobjSearchFilter('custrecord_item_name_logs', null, 'anyof', itemId));
                        filter.push(new nlobjSearchFilter('custrecord_inventory_location_logs', null, 'anyof', locationId));

                        var cols = new Array();
                        cols.push(new nlobjSearchColumn('created').setSort(true));
                        cols.push(new nlobjSearchColumn('custrecord_item_name_logs'));
                        cols.push(new nlobjSearchColumn('custrecord_inventory_location_logs'));
                        cols.push(new nlobjSearchColumn('custrecord_quantity_logs'));

                        var result = nlapiSearchRecord('customrecord719', null, filter, cols);
                        if (result) {

                            var prevLogQty = result[0].getValue('custrecord_quantity_logs');
                            var logId=result[0].getId();
                            if (parseInt(prevLogQty) != parseInt(quantityAvailable)) {

                                //var record = nlapiCreateRecord('customrecord719');
                                var record = nlapiLoadRecord('customrecord719',logId);
                                record.setFieldValue("custrecord269",date_string);
                                record.setFieldValue("custrecord_inventory_location_logs", locationId);
                                record.setFieldValue("custrecord_quantity_logs", quantityAvailable);
                                record.setFieldValue("custrecord_item_name_logs", itemId);
                                record.setFieldValue("custrecorddescription_logs", description);
                                record.setFieldValue("custrecord_category_logs", category);
                                var record_id = nlapiSubmitRecord(record, true, true);
                                nlapiLogExecution("debug", "Created record is:", record_id);
                            }
                        } else {
                            var record = nlapiCreateRecord('customrecord719');
                            record.setFieldValue("custrecord269",date_string);
                            record.setFieldValue("custrecord_inventory_location_logs", locationId);
                            record.setFieldValue("custrecord_quantity_logs", quantityAvailable);
                            record.setFieldValue("custrecord_item_name_logs", itemId);
                            record.setFieldValue("custrecorddescription_logs", description);
                            record.setFieldValue("custrecord_category_logs", category);
                            var record_id = nlapiSubmitRecord(record, true, true);
                            nlapiLogExecution("debug", "Created record is:", record_id);
                        }

                    }
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