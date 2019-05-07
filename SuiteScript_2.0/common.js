/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

define(['N/currentRecord', 'N/url', 'N/record'],
  function (currentRecord, url, record) {

    var params = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-1000,top=-1000';

    function pageInit(context) { }

    // function fieldChanged(context) {

    //   var value = context.currentRecord.getValue({
    //     fieldId: 'custpage_field'
    //   });

    //   if (value == '0') {
    //     prompt('please select atleast one value');
    //   }
    //   else {
    //     // openSuiteletafternext();
    //     window.location.href = "/app/site/hosting/scriptlet.nl?script=2652&deploy=1";
    //   }
    // }

    // function openSuiteletafternext() {
    //   var suitePage = url.resolveScript({
    //     scriptId: 'customscript_task_3',
    //     deploymentId: 'customdeploy_task_3',
    //     returnExternalUrl: false
    //   });

    //   window.open(suitePage, 'page2', params);
    // }

    // jQuery(document).ready (



    /** Suitelet open function when we click on custom button on sales order */

    function openSuite() {
      var output = url.resolveScript({
        scriptId: 'customscript_task_2',
        deploymentId: 'customdeploy_task_2',
        returnExternalUrl: false
      });

      window.open(output, 'test', params);
    }


    /** this function is to close the window */

    function close() {
      window.close();
    }


    /** this function is to traverse back to previous page */

    function back() {
      history.back.go(-1);
    }
    /** Save value when we submit the valuen and the new sales order created   */

    function saveRecord(context) {

      var currRecord = currentRecord.get();

      var cName = currRecord.getValue({
        fieldId: 'custpage_field'
      });

      var dropOffValue = currRecord.getValue({
        fieldId: 'custpage_field22'
      });

      var placeOfSaleValue = currRecord.getValue({
        fieldId: 'custpage_field2'
      });

      var whatIsTheCustomerReportedRepairIssue = currRecord.getValue({
        fieldId: 'custpage_field5'
      });

      var wearHabits = currRecord.getValue({
        fieldId: 'custpage_field6'
      });

      var whenDidTheyNoticeIssue = currRecord.getValue({
        fieldId: 'custpage_field7'
      });

      var customerTemp = currRecord.getValue({
        fieldId: 'custpage_field8'
      });

      var insuranceOrBbesp = currRecord.getValue({
        fieldId: 'custpage_field9'
      });

      var whoToContactAfterInspection = currRecord.getValue({
        fieldId: 'custpage_field10'
      });

      var deliveryDate = currRecord.getValue({
        fieldId: 'custpage_datefield'
      });

      var returnLabelStatus = currRecord.getValue({
        fieldId: 'custpage_selectfield10'
      });

      var objRecord = record.create({
        type: record.Type.SALES_ORDER,
        isDynamic: true
      });

      objRecord.setValue({
        fieldId: 'entity',
        value: cName
      });

      objRecord.setValue({
        fieldId: 'trandate',
        value: deliveryDate
      });

      objRecord.setValue({
        fieldId: 'class',
        value: placeOfSaleValue
      });

      objRecord.setValue({
        fieldId: 'custbody6',
        value: deliveryDate
      });

      objRecord.setValue({
        fieldId: 'custbody_drop_off',
        value: dropOffValue
      });

      objRecord.setValue({
        fieldId: 'custbody_yelping_since',
        value: whatIsTheCustomerReportedRepairIssue
      });

      objRecord.setValue({
        fieldId: 'custbody_yelp_1_star_reviews',
        value: wearHabits
      });

      objRecord.setValue({
        fieldId: 'custbody_ops_internal_notes',
        value: whenDidTheyNoticeIssue
      });

      objRecord.setValue({
        fieldId: 'custbody310',
        value: customerTemp
      });

      objRecord.setValue({
        fieldId: 'custbody154',
        value: insuranceOrBbesp
      });

      objRecord.setValue({
        fieldId: 'custbody_yelp_elite_status',
        value: whoToContactAfterInspection
      });

      objRecord.setValue({
        fieldId: 'custbody308',
        value: returnLabelStatus
      });

      var sublistFieldValue = objRecord.getSublistValue({
        sublistId: 'sublist',
        fieldId: 'custpage_sublist2',
        line: 0
      });

      var lineNum = objRecord.selectLine({
        sublistId: 'item',
        line: 0
      });

      objRecord.setCurrentSublistValue({
        sublistId: 'item',
        fieldId: 'item',
        value: 270576,
        ignoreFieldChange: true
      });

      objRecord.setCurrentSublistValue({
        sublistId: 'item',
        fieldId: 'amount',
        value: 434,
        ignoreFieldChange: true
      });
      objRecord.commitLine({
        sublistId: 'item'
      });

      var recordId = objRecord.save({
        enableSourcing: false,
        ignoreMandatoryFields: true
      });

      alert(recordId);

    }


    /** this function used for traversing to the next page */

    function Next() {
      var rec = currentRecord.get();
      var value = rec.getValue({
        fieldId: 'custpage_field'
      });
      if (value == '0') {
        prompt('please select atleast one value');
      }
      else {
        window.location.href = "/app/site/hosting/scriptlet.nl?script=2652&deploy=1";
      }

    }

    return {
      openSuite: openSuite,
      close: close,
      pageInit: pageInit,
      // openSuiteletafternext: openSuiteletafternext,
      // fieldChanged: fieldChanged,
      Next: Next,
      saveRecord: saveRecord,
      back: back

    };

  });