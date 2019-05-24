/**
 * Script Author : Sandeep Kumar (sandeep.kumar@inoday.com/sksandy28@gmail.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (Scheduled Script)
 * Script Name   : 
 * Created Date  : August 29, 2017
 * Last Modified Date : 
 * Comments : 
 * Sandbox Script URL : /app/common/scripting/script.nl?id=2092
 * Production Script URL:
 */
function syncFilesToInvoiceFieldsAndUpdateStatus() {
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
    //var mySearch = nlapiLoadSearch(null, 7774); // For Sandbox 
    var mySearch = nlapiLoadSearch(null, 7810); // For Production
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

        if (nlapiGetContext().getRemainingUsage() < 500) {
          var stateMain = nlapiYieldScript();
          if (stateMain.status == 'FAILURE') {
            nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
            throw "Failed to yield script";
          } else if (stateMain.status == 'RESUME') {
            nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
          }
        }

        var po_id = searchresult[j].getId();
        var obj_po = nlapiLoadRecord('purchaseorder', po_id);
        var vendor_id=obj_po.getFieldValue('entity');
        var invoice_approval_vendor=nlapiLookupField('vendor',vendor_id,'custentity_invoice_approval_vendor');
        if(invoice_approval_vendor=='T')
        {
          var vendor_fields = nlapiLookupField('vendor', vendor_id, ['custentity_department_approver', 'custentity_common_expense_accounts']);
          obj_po.setFieldValue('custbody_department_approver', vendor_fields.custentity_department_approver.split(','));
          obj_po.setFieldValue('custbody_common_expense_accounts', vendor_fields.custentity_common_expense_accounts.split(','));
        }
        obj_po.setFieldValue('custbodyuser_genrtd_file_attached','T');
        nlapiSubmitRecord(obj_po,true,true);

      }
    } //end check itemArrLoc1.length			
  }

  catch (e) {
    nlapiLogExecution('error', 'Error in submitting po', e.message);
  }
}
