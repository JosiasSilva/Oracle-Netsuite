nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Script Author  : Sanjeet Kumar Sharma(sanjeet.sharma@inoday.com/sanjeetshrm@gmail.com)
 * Author Design. : Developer, Inoday Consultancy Pvt. Ltd(India)
 * Script Type    : Scheduled Script
 * Script Name    : Showroom Ring Replenishment
 * Created Date   : July 6, 2017
 * Last Modified Date :
 * Comments       :
 * URL Sandbox    : /app/common/scripting/script.nl?id=1591
 * URL Production :
 */
function createTransferOrder() {
    if (nlapiGetContext().getRemainingUsage() < 500) {
        var stateMain = nlapiYieldScript();
        if (stateMain.status == 'FAILURE') {
            nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
            throw "Failed to yield script";
        } else if (stateMain.status == 'RESUME') {
            nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
        }
    }
    //var mySearch = nlapiLoadSearch(null, 4360); // For Sandbox
    var mySearch = nlapiLoadSearch(null, 4360); // For Production
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
        var itemArrLoc = new Array();
        var tempArrLoc = new Array();
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
            var category = searchresult[j].getValue(Results[0]);
            var parentItemId = searchresult[j].getValue(Results[1]);
            var itemName = searchresult[j].getValue(Results[2]);
            var itemDescription = searchresult[j].getValue(Results[3]);
            var showroomFromLocation = '7';
            var showroomToLocation = searchresult[j].getValue(Results[4]);
            var quantityToOrderRecall = searchresult[j].getValue(Results[7]);
            //check Showroom SF for inventory available logic
            var itemId = searchresult[j].getId();
            var itemObj = nlapiLoadRecord('inventoryitem', itemId);
            for (var i = 0; i < itemObj.getLineItemCount('locations'); i++) {
                var locId = itemObj.getLineItemValue('locations', 'locationid', i + 1);
                if (parseInt(locId) == 7) {
                    var quantityonhand = itemObj.getLineItemValue('locations', 'quantityonhand', i + 1);
                    if (parseInt(quantityonhand) == 0 || parseInt(quantityonhand) < 0) {
                        break;
                    } else {
                        tempArrLoc.push({
                            to_loc_id: showroomToLocation,
                            from_loc_id: showroomFromLocation,
                            items: itemId,
                            quantityToOrderRecall: quantityToOrderRecall
                        });
                        break;
                    }
                }

            }
            //check Showroom SF for inventory available logic
        }
        if (tempArrLoc) {
            var len = tempArrLoc.length;
            while (len > 0) {
                var temp = tempArrLoc.filter(function(item) {
                    return (item.to_loc_id == tempArrLoc[0].to_loc_id);
                });
                itemArrLoc.push({
                    to_loc_id: tempArrLoc[0].to_loc_id,
                    from_loc_id: tempArrLoc[0].from_loc_id,
                    items: temp

                });
                tempArrLoc = removeByAttr(tempArrLoc, 'to_loc_id', tempArrLoc[0].to_loc_id);
                len = tempArrLoc.length;
            }
        }
        //nlapiLogExecution('DEBUG','itemArrLoc',itemArrLoc);
        if (itemArrLoc) {
            var location_id = nlapiGetContext().getSetting('SCRIPT', 'custscript_param_to_location');
            nlapiLogExecution('DEBUG', 'Location through parameter', location_id);
            itemArrLoc = itemArrLoc.filter(function(item) {
                return (item.to_loc_id == location_id);
            });
            // nlapiLogExecution('DEBUG','item Arr Loc through parameter',itemArrLoc);
            for (iLoc = 0; iLoc < itemArrLoc.length; iLoc++) {
                var myResult = itemArrLoc[iLoc].items;
                if (myResult != null && myResult.length > 0) {
                    var insTotal = 0;
                    //for memo logic
                    var search_title = 'Showroom Ring Replenishment';
                    var TransferOrder = null;
                    TransferOrder = nlapiCreateRecord('transferorder');
                    memo = search_title;
                    TransferOrder.setFieldValue('location', itemArrLoc[iLoc].from_loc_id);
                    TransferOrder.setFieldValue('transferlocation', itemArrLoc[iLoc].to_loc_id);
                    TransferOrder.setFieldValue('orderstatus', 'B');
                    TransferOrder.setFieldValue('memo', memo);
                    var totItem = 0;
                    var base_price = 0;
                    for (var i = 0; i < myResult.length; i++) {
                        totItem = totItem + 1;
                        //logic for insurance value calculation
                        var itemIdNo = myResult[i].items;
                        var itemObj = nlapiLoadRecord('inventoryitem', itemIdNo);
                        //var count=itemObj.getLineItemCount('price');
                        //var base_price=itemObj.getLineItemMatrixValue('price','price',1,1);
                        for (var k = 0; k < itemObj.getLineItemCount('price'); k++) {
                            base_price = itemObj.getLineItemMatrixValue('price', 'price', k + 1, 1);
                            if (base_price != '' && base_price != null)
                                break;
                        }
                        nlapiLogExecution("Debug", "base price", parseFloat(base_price));
                        var insuranceValue = parseFloat(base_price) * 0.8;
                        if (insuranceValue != null && insuranceValue != '')
                            insTotal = parseFloat(insTotal) + parseFloat(insuranceValue);
                        var quantity_to_order_recall = myResult[i].quantityToOrderRecall;
                        TransferOrder.selectNewLineItem('item');
                        if (insuranceValue != null && insuranceValue != '')
                            TransferOrder.setCurrentLineItemValue('item', 'custcol_full_insurance_value', insuranceValue);
                        TransferOrder.setCurrentLineItemValue('item', 'item', itemIdNo);
                        TransferOrder.setCurrentLineItemValue('item', 'quantity', quantity_to_order_recall);
                        TransferOrder.commitLineItem('item');

                    } // end of for loop
                    TransferOrder.setFieldValue('custbody_insurance_total', insTotal);
                    TransferOrder.setFieldValue('custbody306', totItem);
                    var TransferRecId = nlapiSubmitRecord(TransferOrder, false, false);
                    nlapiLogExecution('debug', 'Transfer Record created -', TransferRecId);
                }
            }
        }

    }
}

function removeByAttr(arr, attr, value) {
    var i = arr.length;
    while (i--) {
        if (arr[i] &&
            arr[i].hasOwnProperty(attr) &&
            (arguments.length > 2 && arr[i][attr] === value)) {

            arr.splice(i, 1);

        }
    }
    return arr;
}