/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       16 Oct 2014     Siva Kalyan       This script is used to Create the "Inventory Transfer" record from saved search 'Estate Ring Repair - Sent to TD' results . 
 * 
 *  
 *  
 *  
 */

/**
 * @param {String}
 *            type Context Types: scheduled, ondemand, userinterface, aborted,
 *            skipped
 * @returns {Void}
 */
function transferInventoryForRepairs(type) {

    try {
        nlapiLogExecution('debug', 'entered');
        //var vendorNameArray=["Unique New York", "GM Casting House Inc", "Miracleworks","Trung Do's JD & Co.","Jewel-Craft Inc"];
        //var vendorLocationArray=["BE Fulfillment-NY","BE Fulfillment-CH","BE Fulfillment-MW","BE Fulfillment-TD","BE Fulfillment-JC"];

        /* ------------------Added by ajay --------------- */
          // var vendorNameArray = ["Unique New York", "GM Casting House Inc", "Miracleworks", "Trung Do's JD & Co.", "Jewel-Craft Inc", "Harout R"];
          //var vendorLocationArray = ["BE Fulfillment-NY", "BE Fulfillment-CH", "BE Fulfillment-MW", "BE Fulfillment-TD", "BE Fulfillment-JC", "BE Fulfillment-HR"];
          //var transferItemLocationArray = [6, 1, 9, 8, 12, 11];
        /* ----------------- Ended by ajay --------------- */


        /* ------------------Added by YAGYA 1st July 2016 --------------- */
        var vendorNameArray = ["Unique New York", "GM Casting House Inc", "Miracleworks", "Trung Do's JD & Co.", "Jewel-Craft Inc", "Harout R", "Sasha Primak", "Benchmark", "Overnight", "Choice Jewelers", "Endless Designs", "Guild and Facet"];
        var vendorLocationArray = ["BE Fulfillment-NY", "BE Fulfillment-CH", "BE Fulfillment-MW", "BE Fulfillment-TD", "BE Fulfillment-JC", "BE Fulfillment-HR", "BE Fulfillment-SP", "BE Fulfillment-BM", "BE Fulfillment-OV", "BE Fulfillment-CJ", "BE Fulfillment-ED", "BE Fulfillment-GF"];
        var transferItemLocationArray = [6, 1, 9, 8, 12, 11, 16, 17, 22, 21, 20, 19];

        /* ----------------- Ended by YAGYA 1st July 2016 --------------- */

        var searchResult = new Array();
        // Loading the Given saved search Estate Ring Repair - Sent to TD
        var searchObj = nlapiLoadSearch(null, 'customsearch2115');
        // Running the Saved Search
        var searchResultSet = searchObj.runSearch();
        // Getting the All Results into one Array.
        var searchId = 0;
        do {
            var resultslice = searchResultSet.getResults(searchId, searchId + 1000);
            if (resultslice != null && resultslice != '') {
                for (var rs in resultslice) {
                    searchResult.push(resultslice[rs]);
                    searchId++;
                }
            }

        } while (resultslice.length >= 1000);

        // Checking whether Searchresult Array is null or not
        if (searchResult != null && searchResult != '') {
            nlapiLogExecution('debug', 'Length of Search result is ', searchResult.length);
            var columns = searchResult[0].getAllColumns();
            // Used to store the PO Internal id's and it's numbers 
            var po_duplicate = new Array();
            var po_without_duplicate = new Array();
            var po_numbers = new Array();
            var po_without_numberduplicate = new Array();
            var items_with_duplicate = new Array();
            // Getting the All Purchase order internal id's
            for (var i = 0; i < searchResult.length; i++) {
                po_duplicate[po_duplicate.length] = searchResult[i].getId();
                po_numbers[po_numbers.length] = searchResult[i].getValue(columns[1]);
                items_with_duplicate[items_with_duplicate.length] = searchResult[i].getValue(columns[2]);
            }
            nlapiLogExecution('debug', 'Items With Duplicates in saved search', items_with_duplicate);

            // Removing the all duplicate values
            po_without_duplicate = po_duplicate.filter(function (item, pos) {
                return po_duplicate.indexOf(item) == pos;
            });

            po_without_numberduplicate = po_numbers.filter(function (item, pos) {
                return po_numbers.indexOf(item) == pos;
            });

            nlapiLogExecution('debug', 'po with out duplicates are ', po_without_duplicate);
            nlapiLogExecution('debug', 'po numbers with out duplicates are ', po_without_numberduplicate);
            // looping the without duplicate array to create the Inventry
            // Transfer
            for (var polen = 0; polen < po_without_duplicate.length; polen++) {

                var quantity = 0;
                var flag = 'false';
                // Re-Scheduling the script
                if (nlapiGetContext().getRemainingUsage() < 500) {

                    var stateMain = nlapiYieldScript();
                    if (stateMain.status == 'FAILURE') {

                        nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
                        throw "Failed to yield script";
                    } else if (stateMain.status == 'RESUME') {

                        nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
                    }
                }

                try {

                    // Creating the Inventry Transfer record
                    var recordObj = nlapiCreateRecord('inventorytransfer');
                    recordObj.setFieldValue('memo', 'Created from PO# ' + po_without_numberduplicate[polen]);
                    // setting the trandate
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1;
                    var yyyy = today.getFullYear();
                    var s = mm + "/" + dd + "/" + yyyy;
                    recordObj.setFieldValue('trandate', s);
                    recordObj.setFieldText('location', 'San Francisco');
                    var tolocation = nlapiLookupField('purchaseorder', po_without_duplicate[polen], 'location', true);
                    //recordObj.setFieldText('transferlocation', tolocation);
                    // Loading the Purchase Order to Get all lines
                    var purchaseObj = nlapiLoadRecord('purchaseorder', po_without_duplicate[polen]);
                    var vendorname = purchaseObj.getFieldText('entity');
                    // Used to check the whethor vendor is there or not in vendor array
                    var vendorPos = vendorNameArray.indexOf(vendorname);

                    /* ----------------- Added by ajay ------------------------- */
                    var createdFrom = purchaseObj.getFieldText('createdfrom');
                    var createdFromId = purchaseObj.getFieldValue('createdfrom');
                    var objSO = ''; var soItemCount = 0;
                    var vendorLocationVal = 0; var indexLoc = 0;

                    if (createdFrom != '' && createdFromId != null) {
                        var matchVal = createdFrom.indexOf('Sales Order');
                        if (matchVal != -1) {
                            objSO = nlapiLoadRecord('salesorder', createdFromId);
                            soItemCount = objSO.getLineItemCount('item');
                        }
                    }
                    /* ------------------ Ended by ajay ------------------------ */

                    if (vendorPos == -1) {
                        recordObj.setFieldText('transferlocation', tolocation);
                    }
                    else {
                        recordObj.setFieldText('transferlocation', vendorLocationArray[vendorPos]);

                        /* --------------- Added by ajay -------------------------------------------- */
                        if (createdFrom != '' && createdFromId != null) {
                            indexLoc = vendorLocationArray.indexOf(vendorLocationArray[vendorPos]);
                            vendorLocationVal = transferItemLocationArray[indexLoc];
                        }
                        /* -------------- Ended by ajay ------------------------------------------------------ */

                    }
                    var itemscount = purchaseObj.getLineItemCount('item');
                    nlapiLogExecution('debug', 'line item count is ', itemscount);
                    var items_With_duplicates = new Array();
                    var items_Without_duplicates = new Array();
                    var date_sent_from_sf = ''; // added by ajay 20May 2016
                    var po_date_sent_from_sf = '';
                    for (var line = 1; line <= itemscount; line++) {
                        for (var ids = 0; ids < po_duplicate.length; ids++) {

                            nlapiLogExecution('debug', 'Comapre of Po Internalids ', po_duplicate[ids] + " and " + po_without_duplicate[polen]);
                            nlapiLogExecution('debug', 'Compare of Items with duplicate and Line iten', items_with_duplicate[ids] + " and " + purchaseObj.getLineItemValue('item', 'custcolitem_link', line));
                            if (po_duplicate[ids] == po_without_duplicate[polen] && items_with_duplicate[ids] == purchaseObj.getLineItemValue('item', 'custcolitem_link', line)) {
                                items_With_duplicates[items_With_duplicates.length] = purchaseObj.getLineItemValue('item', 'custcolitem_link', line);
                            }

                        }
                        /*// Getting the all the items
						items_With_duplicates[items_With_duplicates.length] = purchaseObj.getLineItemValue('item', 'custcolitem_link', line);*/

                        /*-----Added by ajay--------------------*/

                        if (createdFrom != '' && createdFromId != null) {
                            //var poItemId = purchaseObj.getLineItemValue('item','item',line);
                            var poItemId = purchaseObj.getLineItemValue('item', 'custcolitem_link', line);
                            date_sent_from_sf = purchaseObj.getLineItemValue('item', 'custcol18', line);//added by ajay 20May 2016
                            if (date_sent_from_sf != '' && date_sent_from_sf != null) {
                                po_date_sent_from_sf = date_sent_from_sf;
                            }
                            for (var j = 1; j <= soItemCount; j++) {
                                var soItemId = objSO.getLineItemValue('item', 'item', j);
                                if (poItemId == soItemId) {
                                    if (vendorPos != -1) {
                                        objSO.setLineItemValue('item', 'location', j, vendorLocationVal);
                                    }
                                    break;
                                }
                            }
                        }
                        else //added by ajay 21July 2016
			{			    
                            date_sent_from_sf = purchaseObj.getLineItemValue('item', 'custcol18', line);
                            if (date_sent_from_sf != '' && date_sent_from_sf != null) {
                                po_date_sent_from_sf = date_sent_from_sf;
                            }
			}
                        /*------Ended by ajay----------------------*/

                    }
                    nlapiLogExecution('debug', 'items with duplicates ', items_With_duplicates);
                    // Removing the Duplicates in items_With_duplicates Array
                    items_Without_duplicates = items_With_duplicates
							.filter(function (item, pos) {
							    return items_With_duplicates.indexOf(item) == pos;
							});
                    nlapiLogExecution('debug', 'items without  duplicates ', items_Without_duplicates);
                    for (var items = 0; items < items_Without_duplicates.length; items++) {
                        quantity = 0;
                        for (var duplicateitems = 0; duplicateitems < items_With_duplicates.length; duplicateitems++) {
                            if (items_With_duplicates[duplicateitems] == items_Without_duplicates[items]) {
                                quantity = parseFloat(quantity) + parseFloat(purchaseObj.getLineItemValue('item', 'quantity', duplicateitems + 1));
                                flag = 'true';
                            }
                        }
                        if (flag == 'true') {
                            recordObj.setLineItemValue('inventory', 'item', items + 1, items_Without_duplicates[items]);
                            recordObj.setLineItemValue('inventory', 'adjustqtyby', items + 1, quantity);
                            nlapiLogExecution('debug', 'flag in item is ', items_Without_duplicates[items] + ' count is ' + quantity);
                        }
                    }

                    /*-------------- Added by ajay------------------*/
                    if (objSO != '') {
                        objSO.setFieldValue("custbody321", po_date_sent_from_sf); //added by ajay 20May 2016
                        var salesorderId = nlapiSubmitRecord(objSO, true, true);
                        nlapiLogExecution("debug", "Submit sales order Id :" + salesorderId);
                    }

                    /*---------------Ended by ajay-----------------*/



                    /*------------------Add By YAGYA 29June 2016-----------------*/
                    if (po_date_sent_from_sf != '') {
                        nlapiSubmitField("purchaseorder", po_without_duplicate[polen], "custbody321", po_date_sent_from_sf);
                        nlapiLogExecution("debug", "Submit purchase order Id :" + po_without_duplicate[polen]);
                    }
                    /*------------------End Add By YAGYA-----------------*/


                    //nlapiSubmitRecord(purchaseObj, true, true);  // commented by ajay
                    var inventoryTransferId = nlapiSubmitRecord(recordObj, true, true);
                    nlapiLogExecution('audit', 'Item id is ', inventoryTransferId);
                } catch (e) {
                    var error = '';
                    if (e.getDetails != undefined) {

                        error += ' \n  ' + e.getDetails();
                    } else {

                        error += '\n ' + e.toString();
                    }
                    nlapiLogExecution('debug', 'error is ', error);
                    if (error != null && error != '') {

                        var subject = 'Error While creating the Inventory Transfer record';
                        var body = 'Hi,' + '\n' + 'There is a error occured while Creating the Inventory Transfer record for PO # ' + po_without_numberduplicate[polen] + '\n Reason is: ' + error;
                        var userId = nlapiGetUser();
                        if (userId != -4 && userId != '') {
                            // Here email will be  sent to employee 'Order Mgmt'
                            nlapiSendEmail(userId, 2440149, subject, body);

                        }


                    }
                }
            }

        }// end of search result check(null or not)

    } catch (e) {
        var error = '';
        if (e.getDetails != undefined) {

            error += ' \n  ' + e.getDetails();
        } else {

            error += '\n ' + e.toString();
        }
        nlapiLogExecution('debug', 'error is ', error);
        if (error != null && error != '') {

            var subject = 'Error While creating the Inventory Transfer record';
            var body = 'Hi,' + '\n' + 'There is a error occured while Creating the Inventory Transfer records\n Reason is: ' + error;
            var userId = nlapiGetUser();
            if (userId != -4 && userId != '') {
                // Here email will be  sent to employee 'Order Mgmt'
                nlapiSendEmail(userId, 30347, subject, body);
            }


        }

    }
    /*// Sending the Error details to mail
	if (error != null && error != '') {
		var subject = 'Error While creating the Inventory Transfer record';
		var body = 'Hi,'
				+ '\n'
				+ 'There is a error occured while Creating the Inventory Transfer records\n Reason is: '
				+ error;

		nlapiSendEmail(1773316, 30347, subject, body);
	}*/

}