/**
*Project Name  : Brilliant Earth.
*Script Author : Saurabh Mishra
*Author Desig. : Developer, inoday Consultancy Pvt. Ltd.
*Script Type   : Suitscript (Scheduled)
*Script URL    : https://debugger.netsuite.com/app/common/scripting/script.nl?id=2537
*/

/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */

define(['N/search', 'N/record','N/task','N/runtime'], function (search, record,task,runtime) {
  function execute(context) {
    try {
      var mySearch = search.load({
        id: 'customsearch5348'
      });
      var dataPages = mySearch.runPaged({
        "pageSize": 1000
      });
      var invoiceQueCollection = [];
      dataPages.pageRanges.forEach(function (pageRange) {

        var dataPage = dataPages.fetch({ index: pageRange.index });

        dataPage.data.forEach(function (result) {

          var invoiceNumber = result.getValue({
            name: "custrecord_portal_invoice_no",
            summary: "group"
          });
          log.debug({title:"processed",details:invoiceNumber});
          if (!(invoiceQueCollection.indexOf(invoiceNumber) > -1)) {
            invoiceQueCollection.push(invoiceNumber);
            getCDPDiamond(invoiceNumber, record, search);
          }

          if (runtime.getCurrentScript().getRemainingUsage() < 1000) {
            var taskId = rescheduleCurrentScript();
            log.audit("Rescheduling status: " + task.checkStatus(taskId));
            return;
          }

        });
      });
    }
    catch (ex) {

      log.debug({title:'error msg:', details:id});

    }


  }
  return {
    execute: execute
  };


  function rescheduleCurrentScript() {
    var scheduledScriptTask = task.create({
      taskType: task.TaskType.SCHEDULED_SCRIPT
    });
    scheduledScriptTask.scriptId = runtime.getCurrentScript().id;
    scheduledScriptTask.deploymentId = runtime.getCurrentScript().deploymentId;
    return scheduledScriptTask.submit();
  }

});

function getCDPDiamond(cdpInvoiceNum, record, search) {

  var customrecord_pending_inv_for_cdpSearchObj = search.create({
    type: "customrecord_pending_inv_for_cdp",
    filters:
    [
      ["custrecord_portal_invoice_no", "is", cdpInvoiceNum],
      "AND",
      ["custrecord_po_number", "anyof", "@NONE@"]
    ],
    columns:
    [
      search.createColumn({ name: "custrecord_cdp_id", label: "CDP Id" })
    ]
  });
  var searchResultCount = customrecord_pending_inv_for_cdpSearchObj.runPaged().count;
  log.debug({title:"customrecord_pending_inv_for_cdpSearchObj result count",details: searchResultCount});
  customrecord_pending_inv_for_cdpSearchObj.run().each(function (result)
                                                       {
    updatePortalCDP({ internalId: result.id, cdpValue: result.getValue({ name: 'custrecord_cdp_id' }) }, search, record);
    return true;
  });

}

function updatePortalCDP(data, search, record) {
  var customrecord_custom_diamondSearchObj = search.create({
    type: "customrecord_custom_diamond",
    filters:
    [
      ["internalid", "anyof", data.cdpValue]
    ],
    columns:
    [
      search.createColumn({ name: "custrecord_diamond_po_number", label: "PO Number" })
    ]
  });
  var searchResultCount = customrecord_custom_diamondSearchObj.runPaged().count;
  // log.debug("customrecord_custom_diamondSearchObj result count", searchResultCount);
  customrecord_custom_diamondSearchObj.run().each(function (result) {
    var poNumber = result.getValue({ name: 'custrecord_diamond_po_number' });
    record.submitFields({
      type: 'customrecord_pending_inv_for_cdp',
      id: data.internalId,
      values: {
        'custrecord_po_number': poNumber
      }
    });
    log.debug({title:"record updated with id ",details: data.internalId});
    return true;
  });
}



