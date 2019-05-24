nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Script Author : Sandeep Kumar (sandeep.kumar@inoday.com/sksandy28@gmail.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (Scheduled Script)
 * Script Name   : 
 * Created Date  : August 09, 2017
 * Last Modified Date : 
 * Comments : 
 * SS URL : 
 * Script URL:
 */
function closePurchaseOrders() {
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
        //var mySearch = nlapiLoadSearch(null, 7667); // For Sandbox
        var mySearch = nlapiLoadSearch(null, 7672); // For Production
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
        } while (resultslice.length >= 1000);
        var searchCount = searchresult.length;
        if (searchCount > 0) {
              for (var j = 0; j < searchresult.length; j++) {
                var insuranceTotal = '0.00';
                var memo = '';
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
                var po_id = searchresult[j].getId();
             
                var obj_po = nlapiLoadRecord('purchaseorder', po_id);
                var po_item_count = obj_po.getLineItemCount('expense');
               
                for (var icount = 1; icount <= po_item_count; icount++) {
                    obj_po.setLineItemValue('expense', 'isclosed', icount, 'T');
					obj_po.setLineItemValue('expense', 'amount', icount, '0');
                    
                }
				obj_po.commitLineItem('expense');
				nlapiSubmitRecord(obj_po,false,true);
            }
		}
            //end check itemArrLoc1.length			
     

    } catch (e) {
        nlapiLogExecution('debug', 'Error in inventory tranfer creation', e.message);
    }
}

