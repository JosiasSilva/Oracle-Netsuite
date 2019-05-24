/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
*/

define(['N/search', 'N/record', 'N/format','N/runtime'], function (search, record, format,runtime) {
  var invoiceQueCollection=[];
  function getInputData(inputContext)
  {

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
    log.debug({ title: 'invoice queuecollection:', details: invoiceQueCollection });
    return arr;

  }

  function map(context) {
    try{
      var result=JSON.parse(context.value);
      //log.debug({ title: 'invoiceQueCollection map', details: JSON.stringify(invoiceQueCollection) });
      log.debug({ title: "mapinng function", details: result});
      var invNo=result.invoiceNumber;
      log.debug({ title: "invoice number map", details: invNo});
      getCDPDiamond(invNo,record,search,format,runtime);
      //log.debug({ title: "invoice number map", details: invNo});
    }
    catch (ex) {
      log.debug({ title: 'error msg:', details: id });
    }

  }

  return {
    getInputData: getInputData,
    map: map
  };

});

function getCDPDiamond(cdpInvoiceNum, record, search, format,runtime) {
var dateformat = runtime.getCurrentUser().getPreference('dateformat');
  var customrecord_pending_inv_for_cdpSearchObj = search.create({
    type: "customrecord_pending_inv_for_cdp",
    filters:
    [
      ["custrecord_portal_invoice_no", "is", cdpInvoiceNum],"and",//invoicenumber
      ["custrecord_vendor_bill","anyof","@NONE@"]

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
      search.createColumn({ name: "custrecord_invoice_date",sort: search.Sort.ASC, label: "Invoice Date" }),
      search.createColumn({ name: "custrecord_created_vendorbill" }),
      search.createColumn({ name: "custrecord_vendor_bill" })
    ]
  });
  if (chkAllResultHasPO(customrecord_pending_inv_for_cdpSearchObj) == true) {
    log.debug({ title: 'all has PO:', details: "true" });
    if (resultsInvoiceDateEquality(customrecord_pending_inv_for_cdpSearchObj) == true) {
      log.debug({ title: 'all has date equality:', details: "true" });
      customrecord_pending_inv_for_cdpSearchObj.run().each(function (result) {
        var poAndFiles=getAllPOs(customrecord_pending_inv_for_cdpSearchObj);
        var poNumber = poAndFiles.POs;
        var filesArr=poAndFiles.filesArr;
        //getAllPOs(customrecord_pending_inv_for_cdpSearchObj);//result.getValue({ name: "custrecord_po_number" });
        var shippCost = result.getValue({ name: "custrecord_portal_shipping_cost" });//ship Cost
        var invoiceDate = result.getValue({ name: "custrecord_invoice_date" });//invoice date
        var cdp_item_map = getAllRecordsIds(customrecord_pending_inv_for_cdpSearchObj);
        var poVendorObj = search.lookupFields({ type: "purchaseorder", id: poNumber[0], columns: ["entity"] });
        var poVendorId = poVendorObj.entity[0].value;
        
        CreateVendorBill(record, search, format, poNumber, cdp_item_map, shippCost, cdpInvoiceNum, invoiceDate, poVendorId,filesArr,dateformat);
        return false;
      });
    }
    else if (resultsInvoiceDateEquality(customrecord_pending_inv_for_cdpSearchObj) != true) {
      log.debug({ title: 'all  do not have date  equality:', details: "false" });
      var groups = getGroupedRecords(customrecord_pending_inv_for_cdpSearchObj,search,record);
      for (var c = 0; c < groups.length; c++) {
        CreateVendorBill(record, search, format, groups[c].poNumber, groups[c].cdp_item_map, groups[c].shipcost, cdpInvoiceNum, groups[c].invoiceDate, groups[c].poVendorId,groups[c].files,dateformat);
      }

    }

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
function getAllRecordsIds(resultSet) {
  var arr = [];
  resultSet.run().each(function (result) {
    if(!((arr.indexOf(result.id) )>-1))
    {
      arr.push(result.id);
    }
    return true;
  });
  return arr;
}
function resultsInvoiceDateEquality(resultSet) {
  var flag = true;
  var invoiceDate = '';
  var firstRecordDate = 0;
  resultSet.run().each(function (result) {
    if (firstRecordDate == 0) {
      invoiceDate = result.getValue({ name: 'custrecord_invoice_date' });
      firstRecordDate = 1;
    }
    if (result.getValue({ name: 'custrecord_invoice_date' }) != invoiceDate) {
      flag = false;

    }
    return true;
  });
  return flag;
}

function getAllPOs(resultSet) {
  var arr = [];
  var filesArry=[];
  resultSet.run().each(function (result) {
    arr.push(result.getValue({ name: 'custrecord_po_number' }));
    var temp=result.getValue({ name: 'custrecord_attach_files' })?result.getValue({ name: 'custrecord_attach_files' }).split(','):[];
    if(temp.length>0)
    {
      for(var c=0; c<temp.length; c++)
      {

        if(!((filesArry.indexOf(temp[c]) )>-1))
          filesArry.push(temp[c]);
      }
    }
    return true;
  });
  return {
    POs:arr,
    filesArr:filesArry
  }

}

function CreateVendorBill(rec, search, format, pos, cdp_item_map, shippingCost, invoiceNo, invoiceDate, poVendorId,fileIdArr,dateformat) {
 try {
   log.debug({ title: 'Creating vendor bill for :', details: invoiceNo });
  var id = 0;
  var count = 0;
  var totalnumberOfRecords = '';
  if (pos) {
    var record = rec.create({
      type: "vendorbill",
      isDynamic: true
    });
    var formattedDt=getstrDATE(invoiceDate,dateformat);
    record.setValue({ fieldId: "customform", value: "121" });
    record.setValue({ fieldId: "entity", value: poVendorId });
    record.setValue({ fieldId: "trandate", value: format.parse({value:formattedDt, type: format.Type.DATE})  });
    record.setValue({ fieldId: "postingperiod", value: GetPeriodDate(invoiceDate, format, search) });
    record.setValue({ fieldId: "exchangerate", value: "1.0" });
    var terms = search.lookupFields({ type: "vendor", id: poVendorId, columns: ["terms"] });
    record.setValue({ fieldId: "terms", value: terms.terms[0].value });
    record.setValue({ fieldId: "tranid", value: invoiceNo });
    record.setValue({ fieldId: "custbody_portal_invoice_number", value: invoiceNo });
    record.setValue({ fieldId: "custbody_portal_shipping_cost", value: shippingCost });


    var s = search.create({
      type: "purchaseorder",
      filters:
      [
        ["internalid", "anyof", pos],
        "AND",
        ["item","noneof","@NONE@"],"and",
        ["status","noneof","PurchOrd:H"]

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
    }

    for (var j = 0; j < cdp_item_map.length; j++) {
      rec.submitFields({
        type: "customrecord_pending_inv_for_cdp",
        id: cdp_item_map[j],
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
    }
  }
}
  catch(ex)
    {
       log.debug({ title: 'error occured while creating invoice :', details: ex.message });
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

 function getstrDATE(objDateStr,strDATEFORMAT) {
    try {
      log.debug({ title: 'date format is :', details: strDATEFORMAT });
      var dd, mm, yy;
      var date=objDateStr.split('/');
      yy =date[2];
      mm = Number(date[0]);
      dd = Number(date[1]);
  
      if (dd < 10)
        dd = '0' + dd;
  
      if (mm < 10)
        mm = '0' + mm;
  
      var strDATE = '';
      var _0x8f9a=["\x44\x44\x2F\x4D\x4D\x2F\x59\x59\x59\x59","\x2F","\x44\x44\x2D\x4D\x4D\x2D\x59\x59\x59\x59","\x2D","\x4D\x4D\x2F\x44\x44\x2F\x59\x59\x59\x59","\x4D\x4D\x2D\x44\x44\x2D\x59\x59\x59\x59","\x59\x59\x59\x59\x2F\x4D\x4D\x2F\x44\x44","\x59\x59\x59\x59\x2D\x4D\x4D\x2D\x44\x44","\x4D\x2F\x44\x2F\x59\x59\x59\x59"];if(strDATEFORMAT== _0x8f9a[0]){strDATE= dd+ _0x8f9a[1]+ mm+ _0x8f9a[1]+ yy};if(strDATEFORMAT== _0x8f9a[2]){strDATE= dd+ _0x8f9a[3]+ mm+ _0x8f9a[3]+ yy};if(strDATEFORMAT== _0x8f9a[4]){strDATE= mm+ _0x8f9a[1]+ dd+ _0x8f9a[1]+ yy};if(strDATEFORMAT== _0x8f9a[5]){strDATE= mm+ _0x8f9a[3]+ dd+ _0x8f9a[3]+ yy};if(strDATEFORMAT== _0x8f9a[6]){strDATE= yy+ _0x8f9a[1]+ mm+ _0x8f9a[1]+ dd};if(strDATEFORMAT== _0x8f9a[7]){strDATE= yy+ _0x8f9a[3]+ mm+ _0x8f9a[3]+ dd};if(strDATEFORMAT== _0x8f9a[8]){strDATE= Number(mm)+ _0x8f9a[1]+ Number(dd)+ _0x8f9a[1]+ yy};return strDATE;

    } catch (ex) {
      log.debug({ title: 'from date format :', details: ex.message });
    }
  }

function getGroupedRecords(customrecord_pending_inv_for_cdpSearchObj,search,record) {
  var arr = [];

  customrecord_pending_inv_for_cdpSearchObj.run().each(function (result) {
    var filesarr=[];
    var temp= result.getValue({ name: 'custrecord_attach_files' })?result.getValue({ name: 'custrecord_attach_files' }).split(','):[];
    if(temp.length>0)
    {
      for(var c=0; c<temp.length; c++)
      {
        filesarr.push(temp[c]);
      }
    }

    var  poVendorObj=search.lookupFields({ type: "purchaseorder", id: result.getValue({ name: 'custrecord_po_number' }), columns: ["entity"] });
    arr.push({
      poNumber: result.getValue({ name: 'custrecord_po_number' }),
      shippCost: result.getValue({ name: "custrecord_portal_shipping_cost" }),
      invoiceDate: result.getValue({ name: "custrecord_invoice_date" }),
      cdp_item_map: result.id,
      poVendorId: poVendorObj.entity[0].value,
      files: filesarr
    });
    return true;
  });
  return groupAsInvocieDate(arr);
}


function groupAsInvocieDate(list) {
  function groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    })
  }

  var result = groupBy(list, function (item) {
    return [item.invoiceDate];
  });

  var consolidatedGroup = [];
  for (var c = 0; c < result.length; c++) {
    var cdp = [];
    var files=[];
    var po = [];
    var poVendorObj = '';
    var poVendorId = '';
    var invoiceDate = '';
    var shipcost = '';
    var tempArr = result[c];

    for (var d = 0; d < result[c].length; d++) {
      var recievedFilesArr=result[c][d].files;
      cdp.push(result[c][d].cdp_item_map);
      po.push(result[c][d].poNumber);
      poVendorObj = result[c][d].poVendorObj;
      poVendorId = result[c][d].poVendorId;
      invoiceDate = result[c][d].invoiceDate;
      shipcost = result[c][d].shippCost;

      if(recievedFilesArr.length>0)
      {
        for(var f=0; f<recievedFilesArr.length; f++)
        {
          if(!((files.indexOf(recievedFilesArr[f]) )>-1))
            files.push(recievedFilesArr[f]);
        }
      }
    }
    consolidatedGroup.push({
      poVendorObj: poVendorObj,
      poVendorId: poVendorId,
      invoiceDate: invoiceDate,
      shipcost: shipcost,
      cdp_item_map: cdp,
      poNumber: po,
      files:files
    })
  }
  return consolidatedGroup;
}


