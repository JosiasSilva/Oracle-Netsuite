/**
 * @param {String}
 *            type Context Types: scheduled, ondemand, userinterface, aborted,
 *            skipped
 * @returns {Void}
 */
function transferInventoryForReceive(type) {

    try {
        //var vendorNameArray = ["Unique New York", "GM Casting House Inc", "Miracleworks", "Trung Do's JD & Co.", "Jewel-Craft Inc", "Harout R"];
        //var vendorLocationArray = ["BE Fulfillment-NY", "BE Fulfillment-CH", "BE Fulfillment-MW", "BE Fulfillment-TD", "BE Fulfillment-JC", "BE Fulfillment-HR"];


        /* ------------------Added by YAGYA 1st July 2016 --------------- */
        var vendorNameArray = ["Unique New York", "GM Casting House Inc", "Miracleworks", "Trung Do's JD & Co.", "Jewel-Craft Inc", "Harout R", "Sasha Primak", "Benchmark", "Overnight", "Choice Jewelers", "Endless Designs", "Guild and Facet"];
        var vendorLocationArray = ["BE Fulfillment-NY", "BE Fulfillment-CH", "BE Fulfillment-MW", "BE Fulfillment-TD", "BE Fulfillment-JC", "BE Fulfillment-HR", "BE Fulfillment-SP", "BE Fulfillment-BM", "BE Fulfillment-OV", "BE Fulfillment-CJ", "BE Fulfillment-ED", "BE Fulfillment-GF"];
        /* ----------------- Ended by YAGYA 1st July 2016 --------------- */



        var searchResult = new Array();
        // Loading the Given saved search Estate Ring Repair - Sent to TD
        //var searchObj = nlapiLoadSearch(null, 'customsearch2121');//old saved search on live  
		var searchObj = nlapiLoadSearch(null, 'customsearch5013'); //new saved search on live
		
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
            var itemreceipt_with_duplicate = new Array();
            var itemreceipt_without_duplicate = new Array();
            // Getting the All Purchase order internal id's
            for (var i = 0; i < searchResult.length; i++) {
                po_duplicate[po_duplicate.length] = searchResult[i].getId();
                po_numbers[po_numbers.length] = searchResult[i].getValue(columns[3]);
                items_with_duplicate[items_with_duplicate.length] = searchResult[i].getValue(columns[4]);
                itemreceipt_with_duplicate[itemreceipt_with_duplicate.length] = searchResult[i].getValue(columns[5]);
            }
            nlapiLogExecution('debug', 'Items With Duplicates in saved search', items_with_duplicate);
            nlapiLogExecution('debug', 'itemreceipt_with_duplicate', itemreceipt_with_duplicate);

            // Removing the all duplicate values
            po_without_duplicate = po_duplicate.filter(function (item, pos) {
                return po_duplicate.indexOf(item) == pos;
            });

            po_without_numberduplicate = po_numbers.filter(function (item, pos) {
                return po_numbers.indexOf(item) == pos;
            });

            itemreceipt_without_duplicate = itemreceipt_with_duplicate.filter(function (item, pos) {
                return itemreceipt_with_duplicate.indexOf(item) == pos;
            });

            nlapiLogExecution('debug', 'Item receipt with out duplicate', itemreceipt_without_duplicate);

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
                    recordObj.setFieldText('transferlocation', 'San Francisco');// transferlocation
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
                    var matchVal = createdFrom.indexOf('Sales Order');
                    var objSO = ''; var soItemCount = 0;

                    /*------------------Edited By Bharat-----------------*/
                    /* Update SalesOrder Gem Returned from Vendor field */
                    var arrReceiptDate = new Array();
                    for (var x = 1; x <= purchaseObj.getLineItemCount("links") ; x++) {
                        var receiptType = purchaseObj.getLineItemValue("links", "type", x);
                        if (receiptType == "Item Receipt") {
                            arrReceiptDate.push(purchaseObj.getLineItemValue("links", "trandate", x));
                        }
                    }


                    var date_sort_desc = function (date1, date2) {
                        // This is a comparison function that will result in dates being sorted in
                        // DESCENDING order.
                        var dateA = new Date(date1);
                        var dateB = new Date(date2);
                        if (dateA > dateB) return -1;
                        if (dateA < dateB) return 1;
                        return 0;
                    };

                    if (arrReceiptDate.length > 0) {
                        arrReceiptDate.sort(date_sort_desc);

                    }
                    /*------------------End Edited By Bharat-----------------*/



                    if (createdFrom != '' && createdFromId != null) {
                        if (matchVal != -1) {
                            objSO = nlapiLoadRecord('salesorder', createdFromId);
                            /// Added By Bharat
                            /// For Update Sales order Fields
                            if (arrReceiptDate.length > 0) {
                                nlapiLogExecution("Debug", "Gem Returned from Vendor On:" + arrReceiptDate[0] + ", SOId:" + createdFromId, createdFromId);
                                objSO.setFieldValue("custbody322", arrReceiptDate[0]);
                            }
                            ///
                            soItemCount = objSO.getLineItemCount('item');
                        }
                    }
                    /* ------------------ Ended by ajay ------------------------ */

                    if (vendorPos == -1) {
                        //recordObj.setFieldText('location', tolocation); // commented by ajay 04Oct 2016
						recordObj.setFieldText('location', "Check Out");
                    }
                    else {
                        recordObj.setFieldText('location', vendorLocationArray[vendorPos]);
                    }
                    var itemscount = purchaseObj.getLineItemCount('item');
                    nlapiLogExecution('debug', 'line item count is ', itemscount);
                    var items_With_duplicates = new Array();
                    var items_Without_duplicates = new Array();
					//Added by ajay 04Oct2016
					var item_link_loc='San Francisco';
                    for (var line = 1; line <= itemscount; line++) {
                        for (var ids = 0; ids < po_duplicate.length; ids++) {
							
							//Added by ajay 04Oct2016
							var location = purchaseObj.getLineItemText('item', 'custcolitem_link_loc', line)
							if( location != null && location != "" )
							{
								item_link_loc=location;
							}
							//Ended
							
                            //nlapiLogExecution('debug', 'Comapre of Po Internalids ', po_duplicate[ids]+" and "+po_without_duplicate[polen]);
                            //nlapiLogExecution('debug', 'Compare of Items with duplicate and Line iten',  items_with_duplicate[ids]+" and "+ purchaseObj.getLineItemValue('item', 'custcolitem_link', line));
                            if (po_duplicate[ids] == po_without_duplicate[polen] && items_with_duplicate[ids] == purchaseObj.getLineItemValue('item', 'custcolitem_link', line)) {
                                items_With_duplicates[items_With_duplicates.length] = purchaseObj.getLineItemValue('item', 'custcolitem_link', line);
                            }
                        }
                        // Getting the all the items
                        //items_With_duplicates[items_With_duplicates.length] = purchaseObj.getLineItemValue('item', 'custcolitem_link', line);

                        /*----- Added by ajay --------------------*/

                        if (createdFrom != '' && createdFromId != null) {
                            //var poItemId = purchaseObj.getLineItemValue('item','item',line);
                            var poItemId = purchaseObj.getLineItemValue('item', 'custcolitem_link', line);
                            for (var j = 1; j <= soItemCount; j++) {
                                var soItemId = objSO.getLineItemValue('item', 'item', j);
                                if (poItemId == soItemId) {
                                    objSO.setLineItemValue('item', 'location', j, 2);
                                    break;
                                }
                            }
                        }
                        /*------ Ended by ajay ----------------------*/

                    }
					nlapiLogExecution('debug', 'item_link_loc ', item_link_loc);
					recordObj.setFieldText('transferlocation', item_link_loc); // added by Yagya 23 aug 2016
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
                            //nlapiLogExecution('debug', 'flag in item is ', items_Without_duplicates[items]+' count is '+quantity);
                        }
						else
						{
							nlapiLogExecution('debug', 'No transfer created ',flag);
						}
                    }

                    /*-------------- Added by ajay------------------*/
                    if (objSO != '') {
                        nlapiLogExecution("debug", "Submit sales order started :");
                        var salesorderId = nlapiSubmitRecord(objSO, true, true);
                        nlapiLogExecution("debug", "Submit sales order Id :" + salesorderId);
                    }
                    /*---------------Ended by ajay-----------------*/

                    /*------------------Add By YAGYA 29June 2016-----------------*/
                    if (arrReceiptDate.length > 0) {
                        nlapiSubmitField("purchaseorder", po_without_duplicate[polen], "custbody322", arrReceiptDate[0]);
                        nlapiLogExecution("debug", "Submit purchase order Id :" + po_without_duplicate[polen]);
                    }
                    /*------------------End Add By YAGYA-----------------*/

                    //var pid=nlapiSubmitRecord(purchaseObj, true, true);  // commented by ajay
                    var pid = po_without_duplicate[polen];  // added by ajay
                    var irSearchfilters = new Array();
                    var irSearchCols = new Array();
                    var irnumber = new Array();
                    var irids = new Array();
                    irSearchfilters[irSearchfilters.length] = new nlobjSearchFilter('type', null, 'anyof', 'ItemRcpt');
                    irSearchfilters[irSearchfilters.length] = new nlobjSearchFilter('createdfrom', null, 'anyof', pid);
                    irSearchfilters[irSearchfilters.length] = new nlobjSearchFilter('mainline', null, 'is', 'T');

                    irSearchCols[irSearchCols.length] = new nlobjSearchColumn('tranid');
                    irSearchCols[irSearchCols.length] = new nlobjSearchColumn('internalid');

                    var irSearchObj = nlapiSearchRecord('transaction', null, irSearchfilters, irSearchCols);
                    if (irSearchObj) {
                        for (var irlen = 0; irlen < irSearchObj.length; irlen++) {
                            irnumber[irnumber.length] = irSearchObj[irlen].getValue(irSearchCols[0]);
                            irids[irids.length] = irSearchObj[irlen].getValue(irSearchCols[1]);
                        }
                    }
                    nlapiLogExecution('Debug', 'po Id ', pid);
                    nlapiLogExecution('Debug', 'ir numbers ', irnumber);
                    nlapiLogExecution('Debug', 'ir irids ', irids);



                    var inventoryTransferId = nlapiSubmitRecord(recordObj, true, true);
                    nlapiLogExecution('audit', 'Inventory Transfer id is ', inventoryTransferId);

                    try {

                        // Populating created Transfer Id in corresponding Item Reciepts 
                        for (var irresults = 0; irresults < irnumber.length; irresults++) {
                            var index_posIr = itemreceipt_without_duplicate.indexOf(irnumber[irresults]);
                            if (index_posIr != -1) {
                                var fulfilObj = nlapiLoadRecord('itemreceipt', irids[irresults]);
                                fulfilObj.setFieldValue('custbody_inventory_transfer', inventoryTransferId);
                                nlapiSubmitRecord(fulfilObj, true, true);
                            }

                        }

                    } catch (e) {
                        nlapiLogExecution('Error', 'Error has occured while submitting IR', e);
                    }
					
					//Added new code by ajay 04Oct 2016
					var ITobj= nlapiLoadRecord('inventorytransfer', inventoryTransferId);
					if(ITobj.getLineItemValue('inventory', 'adjustqtyby', 1)>1)
					 {
						 ITobj.setLineItemValue('inventory', 'adjustqtyby', 1, 1); 
						 nlapiSubmitRecord(ITobj, true, true);
						 nlapiLogExecution('debug', 'QTY. TO TRANSFER submit again',qty);
					 }
					//Ended by ajay
					
                    /*for(var irresults=0;irresults<irnumber.length;irresults++){
						var index_posIr=itemreceipt_without_duplicate.indexOf(irnumber[irresults]);
						if(index_posIr!=-1){
							var fulfilObj=nlapiLoadRecord('itemfulfillment', irids[irresults]);
							nlapiSubmitRecord(fulfilObj, true, true);
						}
						
					}*/


                } catch (e) {
                    var error = '';
                    if (e.getDetails != undefined) {

                        error += ' \n  ' + e.getDetails();
                    } else {

                        error += '\n ' + e.toString();
                    }
                    nlapiLogExecution('Error', 'error is ', error);
                    if (error != null && error != '') {

                        var subject = 'Error While creating the Inventory Transfer record';
                        var body = 'Hi,' + '\n' + 'There is a error occured while Creating the Inventory Transfer record for PO # ' + po_without_numberduplicate[polen] + '\n Reason is: ' + error;
                        var userId = nlapiGetUser();
                        /*if(userId!=-4 && userId!='')
				 		{*/
                        // Here email will be  sent to employee 'Order Mgmt'
                        nlapiSendEmail(20186, 1007557, subject, body);

                        //}


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
        nlapiLogExecution('Error', 'error is ', error);
        if (error != null && error != '') {

            var subject = 'Error While creating the Inventory Transfer record';
            var body = 'Hi,' + '\n' + 'There is a error occured while Creating the Inventory Transfer records\n Reason is: ' + error;
            var userId = nlapiGetUser();
            /*if(userId!=-4 && userId!='')
		 		{*/
            // Here email will be  sent to employee 'Order Mgmt'
            nlapiSendEmail(20186, 373809, subject, body);
            //}


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