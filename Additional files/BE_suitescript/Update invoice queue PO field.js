/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
*/

define(['N/search', 'N/record'], function (search, record) {
  var invoiceQueCollection=[];
  function getInputData(inputContext) {
    var arr=new Array();
    var mySearch = search.load({
      id: 'customsearch5348'
    });
    var searchResult = mySearch.run();
    searchResult.each(function (result){
      var invoiceNumber = result.getValue({
        name: "custrecord_portal_invoice_no",
        summary: "group"
      });
      if (!(invoiceQueCollection.indexOf(invoiceNumber) > -1))
      {
        invoiceQueCollection.push(invoiceNumber);
        arr.push({
          invoiceNumber: invoiceNumber
        });
      }
      return true;
    });
    return arr;
  }
  function map(context){
    try{
      var result=JSON.parse(context.value);
      log.debug({ title: "mapinng function", details: result});
      var invNo=result.invoiceNumber;
      getCDPDiamond(invNo,search,record);
    }
    catch (ex) {
      log.debug({ title: 'error msg:', details: id });
    }
  }
  return {
    getInputData: getInputData,
    map:map
  }
});
function getCDPDiamond(cdpInvoiceNum,search,record) {

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
    updatePortalCDP({ internalId: result.id, cdpValue: result.getValue({ name: 'custrecord_cdp_id' }) },search,record);
    return true;
  });

}

function updatePortalCDP(data, search, record) {
  var customrecord_custom_diamondSearchObj = search.create({
    type: "customrecord_custom_diamond",
    filters:
    [
      ["internalid", "anyof", data.cdpValue],"and",
      ["custrecord_diamond_po_number","noneof","@NONE@"]
    ],
    columns:
    [
      search.createColumn({ name: "custrecord_diamond_po_number", label: "PO Number" })
    ]
  });
  var searchResultCount = customrecord_custom_diamondSearchObj.runPaged().count;
  customrecord_custom_diamondSearchObj.run().each(function (result) {
    var poNumber = result.getValue({ name: 'custrecord_diamond_po_number' });
    record.submitFields({
      type: 'customrecord_pending_inv_for_cdp',
      id: data.internalId,
      values: {
        'custrecord_po_number': poNumber
      }
    });
    return true;
  });
}
