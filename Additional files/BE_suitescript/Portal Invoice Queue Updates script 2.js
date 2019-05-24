/**
*Project Name  : Brilliant Earth.
*Script Author : Saurabh Mishra
*Author Desig. : Developer, inoday Consultancy Pvt. Ltd.
*Script Type   : Suitscript (Scheduled)
*Script URL    : https://debugger.netsuite.com/app/common/scripting/script.nl?id=2536
*/



/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */

var foo = 0;

define(['N/search', 'N/record', 'N/format','N/task','N/runtime'], function (search, record, format,task,runtime) {
  function execute() {
    debugger;
    var mySearch = search.load({
      id: 'customsearch5348'
    });
    var dataPages = mySearch.runPaged({
      "pageSize": 1000
    });
    var recordsToProcess = [];
    var invoiceQueCollection = [];
    dataPages.pageRanges.forEach(function (pageRange) {

      var dataPage = dataPages.fetch({ index: pageRange.index });

      dataPage.data.forEach(function (result) {

        var invoiceNumber = result.getValue({
          name: "custrecord_portal_invoice_no",
          summary: "group"
        });
        if (!(invoiceQueCollection.indexOf(invoiceNumber) > -1)) {
          invoiceQueCollection.push(invoiceNumber);
          getCDPDiamond(invoiceNumber, record, search, format)
        }

        if (runtime.getCurrentScript().getRemainingUsage() < 1000) {
          var taskId = rescheduleCurrentScript();
          log.audit("Rescheduling status: " + task.checkStatus(taskId));
          return;
        }

      });

    });

    log.debug({ title: 'ids ', details: recordsToProcess });
    /* record.submitFields({
					type: "vendorbill",
					id: "21404673",
					values: {
						trandate: format.format({ value: new Date(), type: format.Type.DATE })
					}
				});*/
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

function getCDPDiamond(cdpInvoiceNum, record, search, format) {

  var customrecord_pending_inv_for_cdpSearchObj = search.create({
    type: "customrecord_pending_inv_for_cdp",
    filters:
    [
      ["custrecord_portal_invoice_no", "is", cdpInvoiceNum]//invoicenumber

    ],
    columns:
    [
      search.createColumn({ name: "custrecord_cdp_id", label: "CDP Id" }),
      search.createColumn({ name: "custrecord_po_number", label: "PO Number" }),
      search.createColumn({ name: "custrecord_diamond_stock_no", label: "Stock No" }),
      search.createColumn({ name: "custrecord_portal_shipping_cost", label: "Portal Shipping Cost" }),
      search.createColumn({ name: "custrecord_cdp_portal_vendor", label: "CDP portal Vendor" }),
      search.createColumn({ name: "custrecord_cdp_portal_comments", label: "CDP portal Comments" }),
      search.createColumn({ name: "custrecord_misc_adjustment", label: "Misc Adjustment" }),
      search.createColumn({ name: "custrecord_attach_files", label: "Attched Files" }),
      search.createColumn({ name: "custrecord_invoice_date", label: "Invoice Date" }),
      search.createColumn({ name: "custrecord_created_vendorbill" }),
      search.createColumn({ name: "custrecord_vendor_bill" })
    ]
  });
  if (chkAllResultHasPO(customrecord_pending_inv_for_cdpSearchObj) == true) {
    customrecord_pending_inv_for_cdpSearchObj.run().each(function (result) {
      var pos = '';
      var items = [];
      var cdp_item_map = [];
      var fileIdArr = [];
      var cdpId = result.getValue({ name: "custrecord_cdp_id" });
      var poNumber = result.getValue({ name: "custrecord_po_number" });
      var stockNumber = result.getValue({ name: "custrecord_diamond_stock_no" });
      var shippCost = result.getValue({ name: "custrecord_portal_shipping_cost" });//ship Cost
      var cdpPortVendor = result.getValue({ name: "custrecord_cdp_portal_vendor" });//vendor id
      var cdpPortalComments = result.getValue({ name: "custrecord_cdp_portal_comments" });//comments
      var cdpPortalAdjustments = result.getValue({ name: "custrecord_misc_adjustment" });//adjustmets
      var attahedFiles = result.getValue({ name: "custrecord_attach_files" });
      var invoiceDate = result.getValue({ name: "custrecord_invoice_date" });//invoice date
      var isCratedBillChecked = result.getValue({ name: "custrecord_created_vendorbill" });
      var isBillCreated = result.getValue({ name: "custrecord_vendor_bill" });

      var id = result.id;
      var fileIdArr = [];//fileIdArr
      var poVendorObj = search.lookupFields({ type: "purchaseorder", id: poNumber, columns: ["entity"] });
      var poVendorId = poVendorObj.entity[0].value;
      //var soId = search.lookupFields({ type: "customrecord_custom_diamond", id: cdpId, columns: ["custrecord_diamond_so_order_number"] });
      if (attahedFiles != "" && attahedFiles != null) {
        fileIdArr = attahedFiles.split(',');
      }
      log.debug({ title: 'true or false', details: isCratedBillChecked })
      if (isCratedBillChecked == false && isBillCreated == '') {
        // pos=poNumber.custrecord_po_number[0].value;
        items.push(stockNumber);
        cdp_item_map.push({
          item: stockNumber,
          cdp: cdpId,
          custrecordId: id
        });
        CreateVendorBill(record, search, format, poNumber, items, cdp_item_map, shippCost, cdpPortVendor, cdpPortalComments, cdpPortalAdjustments, cdpInvoiceNum, fileIdArr, invoiceDate, poVendorId);
      }

      return true;
    });
  }
}

function chkAllResultHasPO(resultSet) {
  var flag = true;
  resultSet.run().each(function (result) {

    if (result.getValue({ name: 'custrecord_po_number' }) == '') {
      flag = false;

    }
    return true;
  });
  return flag;


}

function CreateVendorBill(rec, search, format, pos, items, cdp_item_map, shippingCost, vendorId, comments, adjustment, invoiceNo, fileIdArr, invoiceDate, poVendorId) {

  var id = 0;
  var count = 0;
  var totalnumberOfRecords = '';
  if (pos) {

    var record = rec.create({
      type: "vendorbill",
      isDynamic: true
    });
    record.setValue({ fieldId: "customform", value: "121" });
    if (poVendorId == vendorId) {
      record.setValue({ fieldId: "entity", value: vendorId });
    }
    else {
      record.setValue({ fieldId: "entity", value: poVendorId });
    }

    //  record.setValue({ fieldId: "trandate", value: format.format({ value: getstrDATE(new Date()), type: format.Type.DATE }) });
    record.setValue({ fieldId: "postingperiod", value: GetPeriodDate(invoiceDate, format, search) });
    record.setValue({ fieldId: "exchangerate", value: "1.0" });
    var terms = search.lookupFields({ type: "vendor", id: vendorId, columns: ["terms"] });

    record.setValue({ fieldId: "terms", value: terms.terms[0].value });

    record.setValue({ fieldId: "tranid", value: invoiceNo });
    record.setValue({ fieldId: "custbody_portal_invoice_number", value: invoiceNo });
    record.setValue({ fieldId: "custbody_portal_shipping_cost", value: shippingCost });
    record.setValue({ fieldId: "custbody_portal_invoice_comments", value: comments });
    record.setValue({ fieldId: "custbody_portal_misc_adjustments", value: adjustment });


    var s = search.create({
      type: "purchaseorder",
      filters:
      [
        ["internalid", "anyof", pos], "and",
        ["item", "anyof", items]
      ]
      , columns: [
        search.createColumn({ name: "item" }),
        search.createColumn({ name: "line" }),
        search.createColumn({ name: "status" }),
        search.createColumn({ name: "preferredlocation", join: "item" }),
        search.createColumn({ name: "purchasedescription", join: "item" }),
        search.createColumn({ name: "averagecost", join: "item" })

      ]
    });
    totalnumberOfRecords = s.runPaged({
      "pageSize": 1000
    }).count;
    s.run().each(function (result) {

      if (result.getValue({ name: "status" }) != "closed") {
        count = count + 1;
        record.selectNewLine({ sublistId: "item" });
        record.setCurrentSublistValue({ sublistId: "item", fieldId: "item", value: result.getValue({ name: "item" }) });

        var loc = result.getValue({ name: "preferredlocation", join: "item" });
        if (loc != "") {
          record.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: loc });
        }
        else {
          record.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: 2 });
        }
        record.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: 2 });
        record.setCurrentSublistValue({ sublistId: "item", fieldId: "description", value: result.getValue({ name: "purchasedescription", join: "item" }) });
        record.setCurrentSublistValue({ sublistId: "item", fieldId: "quantity", value: 1 });
        record.setCurrentSublistValue({ sublistId: "item", fieldId: "orderdoc", value: result.id }); //PO Internal ID
        record.setCurrentSublistValue({ sublistId: "item", fieldId: "orderline", value: result.getValue({ name: 'line' }) }); //PO Line #


        for (var i = 0; i < cdp_item_map.length; i++) {
          if (cdp_item_map[i].item == result.getValue({ name: "item" })) {
            var thisCDP = cdp_item_map[i].cdp;
          }
        }
        record.commitLine({ sublistId: "item" });
      }
      return true;
    });
    log.debug({ title: 'search record ', details: invoiceNo });

    if (count == totalnumberOfRecords) {

      var shiping_cost_value = parseFloat(shippingCost);
      if (shiping_cost_value > 0) {
        record.selectNewLine({ sublistId: 'expense' });
        record.setCurrentSublistValue({ sublistId: 'expense', fieldId: 'account', value: '89' });
        record.setCurrentSublistValue({ sublistId: 'expense', fieldId: 'location', value: '2' });
        record.setCurrentSublistValue({ sublistId: 'expense', fieldId: 'amount', value: shiping_cost_value });
        record.commitLine('expense');
      }
      //Ended
      id = record.save({ enableSourcing: true, ignoreMandatoryFields: true });
      log.debug({ title: 'bill id', details: id });

      if (id > 0) {
        for (var r = 0; r < fileIdArr.length; r++) {

          rec.attach({
            record: {
              type: 'file',
              id: fileIdArr[r]
            },

            to: {
              type: 'vendorbill',
              id: id
            }
          });

        }



        for (var j = 0; j < cdp_item_map.length; j++) {
          rec.submitFields({
            type: "customrecord_pending_inv_for_cdp",
            id: cdp_item_map[j].custrecordId,
            values: {
              custrecord_pending_po_creation: 'F',
              custrecord_created_vendorbill: "T",
              custrecord_vendor_bill: id
            },
            options: {
              enableSourcing: false,
              ignoreMandatoryFields: true
            }
          });

          //SendInvoicedStatusToPortal(cdp_item_map[j].cdp); //Added by ajay 30Sept 2016
        }
        if ((poVendorId != vendorId)  && id) {
          // record.setValue({ fieldId: "entity", value: vendorId });

          rec.submitFields({
            type: "vendorbill",
            id: id,
            values: {
              entity: vendorId
            }
          });

        }

      }
    }
  }
}

function GetPeriodDate(invoiceDate, format, search) {
  var val = '';
  var stDate = invoiceDate.split('/');
  var invoice_mnth = stDate[0];
  if (invoice_mnth != "10") {
    invoice_mnth = invoice_mnth.replace("0", "");
  }
  var invoice_mnth = parseInt(invoice_mnth);
  var invoice_year = parseInt(stDate[2]);

  var date = format.format({ value: new Date(), type: format.Type.DATE });
  var mnth = parseInt(date.split('/')[0]);
  var year = parseInt(date.split('/')[2]);

  if (invoice_year > year) {
    val = mnth;
  }
  else if (invoice_year == year) {
    if (invoice_mnth > mnth) {
      val = mnth;
    }
    else if (invoice_mnth == mnth) {
      val = mnth;
    }
    else if (invoice_mnth < mnth) {
      val = invoice_mnth;
    }
  }
  else if (invoice_year < year) {

    val = 0;
  }
  var chk_mnth = String(val);


  if (chk_mnth == 0) {
    val = "213";
  }
  else {
    var result = search.create({
      type: "customrecord_posting_period_custom_rec",
      filters:
      [
        ["custrecord_posting_period_month", "is", chk_mnth], "and",
        ["custrecord_posting_period_year", "is", String(year)]
      ]
      , columns: [
        search.createColumn({ name: "custrecord_posting_period_month" }),
        search.createColumn({ name: "custrecord_posting_period_year" }),
        search.createColumn({ name: "custrecord_posting_period_value" })
      ]
    });
    result.run().each(function (result) {
      if (result.getValue({ name: 'custrecord_posting_period_value' })) {
        val = result.getValue({ name: 'custrecord_posting_period_value' });
      }
      return true;
    });

  }
  return val;
}



function getstrDATE(objDATETIME) 
{
  try {
    var dd, mm, yy;
    //nlapiLogExecution('DEBUG', 'getstrDATE', ' objDATETIME : ' + objDATETIME);
    yy = objDATETIME.getFullYear();
    mm = objDATETIME.getMonth() + 1;
    dd = objDATETIME.getDate();
    var strDATE = '';
    //  if (strDATEFORMAT == 'MM/DD/YYYY')
    strDATE = mm + '/' + dd + '/' + yy;
    return strDATE;
  } catch (ex) {
    throw ex;
  }
}
