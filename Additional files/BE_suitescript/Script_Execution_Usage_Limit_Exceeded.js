nlapiLogExecution("audit", "FLOStart", new Date().getTime());
// Update list records of custom Diamond NetSuite for Invoice API
//var datain= {"cdp_data":[{"cdp_id":2756,"action_needed":[2,3]}],"invoice_no":"12345", "shipping_cost":122.0, "comment" :"test comments","misc_adjustments" :1.2,"attachments" :['https://testportal.brilliantearth.com/media/order/attach/01/05/PORTAL_TO_NS_RECORD_API_1.2.pdf','https://testportal.brilliantearth.com/media/order/attach/01/05/Book1.csv']};

//---------------------------------------------------------New Script Code--------------------------------

function Script_Execution_Usage_Limit_Exceeded() 
{
  try
  {
    //var mySearch = nlapiLoadSearch(null, 10141); // For Sandbox
    var mySearch = nlapiLoadSearch(null, 10445); // For Production
    var searchresult = [];
    var resultset = mySearch.runSearch();
    var searchid = 0;
    do {
      YieldExecution();
      var resultslice = resultset.getResults(searchid, searchid + 1000);
      if (resultslice != null && resultslice != '') {
        for (var rs in resultslice) {
          YieldExecution();
          searchresult.push(resultslice[rs]);
          searchid++;
        }
      }
    } while (resultslice.length >= 1000);
    nlapiLogExecution("Debug","Search Result Data(JSON)",JSON.stringify(searchresult));
    var searchCount = searchresult.length;
    nlapiLogExecution("Debug","Search Count",searchCount);
    if (searchCount > 0) {
      for(var u=0; u<searchCount; u++)
      {
        YieldExecution();
        var fileIdArr = '';
        var cr_id = searchresult[u].getId();
        var datain = JSON.parse(searchresult[u].getValue('custrecord_datain_data'));
        var invoiceDate = searchresult[u].getValue('custrecord_datain_invoice_date');
        fileIdArr = searchresult[u].getValue('custrecord_datain_file_id');
        fileIdArr = fileIdArr.split(',');
        nlapiLogExecution("Debug","File Id",fileIdArr);
        nlapiLogExecution("Debug","File Id (JSON)",JSON.stringify(fileIdArr));
        Run_Schedule_Script(datain,invoiceDate,fileIdArr,cr_id);
        nlapiLogExecution("Debug","Data has been processed successfully ",cr_id);
        YieldExecution();
      }
    }
  }
  catch(ex)
  {
    nlapiLogExecution("Debug","Error Saved Search 10445",ex.message);
  }
}
function Run_Schedule_Script(datain,invoiceDate,fileIdArr,cr_id)
{
  try
  {
    var actionArr = new Array();
    var vendorName = '';
    if (datain != null) {
      if (datain.cdp_data != null) {
        var pos = [];
        var items = [];
        var cdp_item_map = [];
        var flag = 0;
        for (var i = 0; i < datain.cdp_data.length; i++) {
          nlapiLogExecution("debug", "CDP Id is :", datain.cdp_data[i].cdp_id);
          YieldExecution();
          // Validate if mandatory record type is set in the request
          if (!datain.cdp_data[i].cdp_id) {
            var status = "failed";
            var errormessage = "missing cdp_id";
            var errorvalue = -1;
            nlapiSubmitField("customrecord_cr_for_limit_exceeded",cr_id,"custrecord_datain_created_vendor_bill",'T');
            Create_CR_For_Error_Log(status, errormessage, errorvalue,cr_id);
            return ;
          }
          if (datain.cdp_data[i].action_needed != null) {
            var temp_actionArr = [];
            for (var j = 0; j < datain.cdp_data[i].action_needed.length; j++) {
              YieldExecution();
              if (datain.cdp_data[i].action_needed[j] == "") {
                var status = "failed";
                var errormessage = "missing action needed value to be update";
                var errorvalue = -2;
                nlapiSubmitField("customrecord_cr_for_limit_exceeded",cr_id,"custrecord_datain_created_vendor_bill",'T');
                Create_CR_For_Error_Log(status, errormessage, errorvalue,cr_id);
                return ;
              }
              temp_actionArr[j] = datain.cdp_data[i].action_needed[j];
            }
            actionArr[i] = temp_actionArr;
          }

          if (datain.invoice_no == "") {
            var status = "failed";
            var errormessage = "missing value of invoice number for update";
            var errorvalue = -3;
            nlapiSubmitField("customrecord_cr_for_limit_exceeded",cr_id,"custrecord_datain_created_vendor_bill",'T');
            Create_CR_For_Error_Log(status, errormessage, errorvalue,cr_id);
            return ;
          }
          if (datain.shipping_cost == "" && datain.shipping_cost != '') {
            var status = "failed";
            var errormessage = "missing value of shipping cost for update";
            var errorvalue = -4;
            nlapiSubmitField("customrecord_cr_for_limit_exceeded",cr_id,"custrecord_datain_created_vendor_bill",'T');
            Create_CR_For_Error_Log(status, errormessage, errorvalue,cr_id);
            return;
          }
          if (datain.misc_adjustments == "" && datain.misc_adjustments != '') {
            var status = "failed";
            var errormessage = "missing value of misc adjustments for update";
            var errorvalue = -5;
            nlapiSubmitField("customrecord_cr_for_limit_exceeded",cr_id,"custrecord_datain_created_vendor_bill",'T');
            Create_CR_For_Error_Log(status, errormessage, errorvalue,cr_id);
            return;
          }
          if (datain.attachments != null) {
            for (var k = 0; k < datain.attachments.length; k++) {
              if (datain.attachments[k] == "") {
                var status = "failed";
                var errormessage = "missing attachments value to be update";
                var errorvalue = -6;
                nlapiSubmitField("customrecord_cr_for_limit_exceeded",cr_id,"custrecord_datain_created_vendor_bill",'T');
                Create_CR_For_Error_Log(status, errormessage, errorvalue,cr_id);
                return ;
              }
            }
          }

          var itemId = nlapiLookupField("customrecord_custom_diamond", datain.cdp_data[i].cdp_id, "custrecord_be_diamond_stock_number");
          var itemName = nlapiLookupField("customrecord_custom_diamond", datain.cdp_data[i].cdp_id, "custrecord_be_diamond_stock_number", true);
          var poId = nlapiLookupField("customrecord_custom_diamond", datain.cdp_data[i].cdp_id, "custrecord_diamond_po_number");
          var avgCost = nlapiLookupField("inventoryitem", itemId, "averagecost"); //added by ajay
          var grandTotal = parseFloat(avgCost) + parseFloat(datain.shipping_cost) + parseFloat(datain.misc_adjustments);
          var vendor_Id = nlapiLookupField("customrecord_custom_diamond", datain.cdp_data[i].cdp_id, "custrecord_custom_diamond_vendor");

          //Added ajay new requirement by client 25july 2016
          var filters = new Array();

          //case 1 : invoice # is an exact match of an existing NetSuite bill
          filters[0] = nlobjSearchFilter("tranid", null, "is", datain.invoice_no);
          filters[1] = nlobjSearchFilter("entity", null, "is", vendor_Id);

          var searchRecord = nlapiSearchRecord("vendorbill", null, filters, null);
          if (searchRecord != null) {
            var id = searchRecord[0].getId();
            if (id > 0) {
              SendMail(1, datain.invoice_no, fileIdArr);
              var status = "OK";
              var errormessage = "Portal invoice is an exact match in NetSuite bill.";
              var errorvalue = -7;
              nlapiSubmitField("customrecord_cr_for_limit_exceeded",cr_id,"custrecord_datain_created_vendor_bill",'T');
              Create_CR_For_Error_Log(status, errormessage, errorvalue,cr_id);
              return ;
            }
          }

          //case 2 : date of the invoice and amount of the invoice is an exact match for an existing NetSuite bill
          filters = new Array();
          filters[0] = nlobjSearchFilter("trandate", null, "on", invoiceDate);
          filters[1] = nlobjSearchFilter("mainline", null, "is", "T"); //Added by ajay 23Nov 2016
          var searchRecord = nlapiSearchRecord("vendorbill", null, filters, null);
          if (searchRecord != null) {
            var prevId = 0;
            for (var m = 0; m < searchRecord.length; m++) {
              YieldExecution();
              var id = searchRecord[m].getId();
              if (id > 0) {
                if (prevId != id) {
                  var billObj = nlapiLoadRecord("vendorbill", id);
                  var usertotal = billObj.getFieldValue("usertotal");
                  var shippingCost = billObj.getFieldValue("custbody_portal_shipping_cost");
                  var miscAdjustment = billObj.getFieldValue("custbody_portal_misc_adjustments");
                  var totalCost = parseFloat(usertotal) + parseFloat(shippingCost) + parseFloat(miscAdjustment);
                  if (totalCost == grandTotal) {
                    SendMail(2, datain.invoice_no, fileIdArr);
                    var errorvalue = -8;
                    var status = "OK";
                    var errormessage = "Portal date of the invoice and amount of the invoice is an exact match for an existing NetSuite bill.";
                    nlapiSubmitField("customrecord_cr_for_limit_exceeded",cr_id,"custrecord_datain_created_vendor_bill",'T');
                    Create_CR_For_Error_Log(status, errormessage, errorvalue,cr_id);
                    return;
                  }
                }
                prevId = id;
              }
            } //end for loop
          }

          //case 3 : item has already been billed on a purchase order
          filters = new Array();
          filters[0] = nlobjSearchFilter("type", "transaction", "anyOf", "VendBill");
          filters[1] = nlobjSearchFilter("internalid", null, "anyOf", itemId);
          var cols = [];
          cols.push(new nlobjSearchColumn("internalid", "transaction"));
          var searchRecord = nlapiSearchRecord('item', null, filters, cols);
          if (searchRecord != null) {
            var id = searchRecord[0].getValue(cols[0]);
            if (id > 0) {
              SendMail(3, datain.invoice_no, fileIdArr);
              var errorvalue = -9;
              var status = "OK";
              var errormessage = "Portal diamond item has been already billed on a purchase order.";
              nlapiSubmitField("customrecord_cr_for_limit_exceeded",cr_id,"custrecord_datain_created_vendor_bill",'T');
              Create_CR_For_Error_Log(status, errormessage, errorvalue,cr_id);
              return ;
            }
          }
          //Ended by ajay
          // nlapiLogExecution("debug", "PO Id from CDP is :", poId);
          nlapiLogExecution("debug", "PO Id from CDP is : " + datain.cdp_data[i].cdp_id , poId);
          if (poId > 0) {
            pos.push(poId);
            items.push(itemId);
            cdp_item_map.push({
              item: itemId,
              cdp: datain.cdp_data[i].cdp_id,
              po: poId,
              itemName: itemName
            });
          } else {
            var filters = [];
            filters.push(new nlobjSearchFilter("type", 'transaction', "anyOf", 'PurchOrd'));
            filters.push(new nlobjSearchFilter("internalid", null, "anyOf", itemId));
            var cols = [];
            cols.push(new nlobjSearchColumn("internalid", "transaction"));
            cols.push(new nlobjSearchColumn("trandate", "transaction"));
            var results = nlapiSearchRecord('item', null, filters, cols);
            //var results = nlapiSearchRecord('item',4332,filters ,cols);
            //nlapiLogExecution("debug", "Item Result is :", results);
            nlapiLogExecution("debug", "Item Result having cdp id is :" + datain.cdp_data[i].cdp_id, JSON.stringify(results));
            if (results != null) {
              poId = results[0].getValue(cols[0]);
              //nlapiLogExecution("debug", "PO Id from item is :", poId);
              nlapiLogExecution("debug", "PO Id from item having cdp id is  :" + datain.cdp_data[i].cdp_id, poId);
              if (poId > 0) {
                pos.push(poId);
                items.push(itemId);
                cdp_item_map.push({
                  item: itemId,
                  cdp: datain.cdp_data[i].cdp_id,
                  po: poId,
                  itemName: itemName
                });
              } else {
                flag = 1;
                cdp_item_map.push({
                  item: itemId,
                  cdp: datain.cdp_data[i].cdp_id,
                  po: poId,
                  itemName: itemName
                });
              }
            } else {
              flag = 1;
              cdp_item_map.push({
                item: itemId,
                cdp: datain.cdp_data[i].cdp_id,
                po: poId,
                itemName: itemName
              });
            }
          }
          YieldExecution();
        }

        //Create Vendor Bills as Necessary
        var id = 0; // added by ajay
        nlapiLogExecution("debug", "flag value is :", flag);
        nlapiLogExecution("debug", "pos length is :", pos.length);
        if (pos.length > 0 && flag == 0) {
          nlapiLogExecution("debug", "Step (1) ",  datain.cdp_data[0].cdp_id);
          var filters = [];
          filters.push(new nlobjSearchFilter("internalid", null, "anyof", pos));
          filters.push(new nlobjSearchFilter("item", null, "anyof", items));
          var cols = [];
          cols.push(new nlobjSearchColumn("item"));
          cols.push(new nlobjSearchColumn("line"));
          cols.push(new nlobjSearchColumn("status")); // Added by ajay
          cols.push(new nlobjSearchColumn("preferredlocation", "item"));
          cols.push(new nlobjSearchColumn("averagecost", "item"));
          cols.push(new nlobjSearchColumn("purchasedescription", "item"));
          var results = nlapiSearchRecord("purchaseorder", null, filters, cols);
          nlapiLogExecution("debug", "Step (2A) Search Result of Purchase Order(JSON) ", JSON.stringify(results) + " having cdp "+ datain.cdp_data[0].cdp_id);
          if (results) {
            nlapiLogExecution("debug", "Step (2B) ", datain.cdp_data[0].cdp_id);
            var count = 0;
            //Get vendor from one of the CDPs
            var vendorId = nlapiLookupField("customrecord_custom_diamond", datain.cdp_data[0].cdp_id, "custrecord_custom_diamond_vendor");
            vendorName = nlapiLookupField("customrecord_custom_diamond", datain.cdp_data[0].cdp_id, "custrecord_custom_diamond_vendor", true);

            var record = nlapiCreateRecord('vendorbill');
            record.setFieldValue("customform", 121);
            record.setFieldValue("entity", vendorId);
            //record.setFieldValue("trandate",nlapiDateToString(new Date())); 
            record.setFieldValue("trandate", invoiceDate);
            //record.setFieldValue("postingperiod",GetPeriod()); //commented by ajay 30Sept2016
            //Added by ajay 30Sept2016
            if (datain.invoice_date != "") {
              var postingperiod = GetPeriodDate(datain.invoice_date);
              nlapiLogExecution('debug', 'Posting Period Date :', postingperiod);
              if (postingperiod != '')
                record.setFieldValue("postingperiod", postingperiod);
              //nlapiLogExecution('debug', 'Posting Period Date :', postingperiod);
            }
            //Ended
            record.setFieldValue("exchangerate", "1.0");
            record.setFieldValue("terms", nlapiLookupField("vendor", vendorId, "terms"));
            record.setFieldValue("tranid", datain.invoice_no);

            record.setFieldValue("custbody_portal_invoice_number", datain.invoice_no);
            record.setFieldValue("custbody_portal_shipping_cost", datain.shipping_cost);
            record.setFieldValue("custbody_portal_invoice_comments", datain.comment);
            record.setFieldValue("custbody_portal_misc_adjustments", datain.misc_adjustments);
            nlapiLogExecution("debug", "Step (2C) ", datain.cdp_data[0].cdp_id);
            for (var x = 0; x < results.length; x++) {
              YieldExecution();
              //if(results[x].getValue("status") =="pendingBilling" || results[x].getValue("status") == "pendingReceipt")//added by ajay
              if (results[x].getValue("status") != "closed") //added by ajay
              {
                count = count + 1; // Added by ajay
                record.selectNewLineItem("item");
                record.setCurrentLineItemValue("item", "item", results[x].getValue("item"));
                var loc = results[x].getValue("preferredlocation", "item");
                if (loc != "") {
                  record.setCurrentLineItemValue('item', 'location', loc);
                } else {
                  record.setCurrentLineItemValue('item', 'location', 2);
                }
                record.setCurrentLineItemValue("item", "description", results[x].getValue("purchasedescription", "item"));
                record.setCurrentLineItemValue("item", "quantity", 1);
                record.setCurrentLineItemValue("item", "orderdoc", results[x].getId()); //PO Internal ID
                record.setCurrentLineItemValue("item", "orderline", results[x].getValue("line")); //PO Line #
                nlapiLogExecution("debug", "Step (4) ", datain.cdp_data[0].cdp_id);
                //Look up price from CDP
                /*for (var i = 0; i < cdp_item_map.length; i++) {
                                  if (cdp_item_map[i].item == results[x].getValue("item")) {
                                    var thisCDP = cdp_item_map[i].cdp;
                                    //record.setCurrentLineItemValue("item","quantity",nlapiLookupField("customrecord_custom_diamond",thisCDP,"custrecord_custom_diamond_price"));
                                  }
                                }*/
                nlapiLogExecution("debug", "Step (5) ", datain.cdp_data[0].cdp_id);
                record.commitLineItem("item");
                nlapiLogExecution("debug", "Step (6) ", datain.cdp_data[0].cdp_id);
                YieldExecution();
              } // ended status logic
            }
            nlapiLogExecution("debug", "Step  (7) Count (Search Result of Purchase Order) ", count + "having cdp " + datain.cdp_data[0].cdp_id);
            nlapiLogExecution("debug", "Step (8)  Len (Search Result of Purchase Order) ", results.length + "having cdp " + datain.cdp_data[0].cdp_id);
            if (count == results.length) //Added by ajay
            {
              //Added By Pankaj Jadaun Jira link (DP-194)
              var shiping_cost_value = parseFloat(datain.shipping_cost);
              if (shiping_cost_value > 0) {
                record.selectNewLineItem('expense');
                record.setCurrentLineItemValue('expense', 'account', '89');
                record.setCurrentLineItemValue('expense', 'location', '2');
                record.setCurrentLineItemValue('expense', 'amount', shiping_cost_value);
                record.commitLineItem('expense');
              }
              //End by Pankaj
              nlapiLogExecution("debug", "Step (9)", datain.cdp_data[0].cdp_id);
              nlapiLogExecution("debug", "Creating vendor bill for following cdp :", datain.cdp_data[0].cdp_id);
              id = nlapiSubmitRecord(record, true, true);
              nlapiSubmitField("customrecord_cr_for_limit_exceeded",cr_id,"custrecord_datain_created_vendor_bill",'T');
              nlapiLogExecution("debug", "Step (10)", datain.cdp_data[0].cdp_id); // ------- Test Log
              nlapiLogExecution("debug", "Created vendor bill id is :" + id ,datain.cdp_data[0].cdp_id);
              if (id > 0) {
                for (var r = 0; r < fileIdArr.length; r++) {
                  nlapiLogExecution("debug", "Step (11) :" + r , "having cdp " + datain.cdp_data[0].cdp_id);
                  nlapiLogExecution("debug", "Step (12) File Id", fileIdArr[r] + "having cdp " + datain.cdp_data[0].cdp_id);
                  try
                  {
                    nlapiAttachRecord('file', fileIdArr[r], 'vendorbill', id, null);
                    nlapiLogExecution("debug", "Step (12 A) File Attachment(s)", " File has been attached successfully in NS" );
                  }
                  catch(er)
                  {
                    nlapiLogExecution("debug", "Error occurred during file attachment", er.message);
                  }
                }
                nlapiLogExecution("debug", "Step 14 CDP Item Map (JSON) :", JSON.stringify(cdp_item_map));
                nlapiLogExecution("debug", "Step 15 Action Needed Value (JSON) :", JSON.stringify(actionArr));
                for (var f = 0; f < cdp_item_map.length; f++) {
                  YieldExecution();
                  //nlapiSubmitField("customrecord_custom_diamond",cdp_item_map[f].cdp,"custrecord_action_needed",actionArr);
                  nlapiLogExecution("debug", "CDP Id Test(2) :" + f, cdp_item_map[f].cdp);
                  nlapiLogExecution("debug", "Action Needed Value Test(2) :" + f, actionArr[f]);
                  Update_Action_Needed_IN_NS(cdp_item_map[f].cdp, actionArr[f]); // Added on 23 apr 2018 for [DP-426]
                  YieldExecution();
                }
              } //End submit record condition
            }
            else if(count == 0)
            {
              nlapiLogExecution("debug", "Count Info:", "Count is : " + count);
              nlapiSubmitField("customrecord_cr_for_limit_exceeded",cr_id,"custrecord_datain_created_vendor_bill",'T');
            }
          }
        }

        if (id == 0 && flag == 1) //Added flag condition by ajay 29Nov 2016
        {
          for (var c = 0; c < cdp_item_map.length; c++) {
            YieldExecution();
            nlapiLogExecution('debug', 'Action :-', actionArr[c]);
            nlapiSubmitField("customrecord_custom_diamond", cdp_item_map[c].cdp, "custrecord_action_needed", actionArr[c]);
            var fileIdStr = "";
            var vendor = nlapiLookupField("customrecord_custom_diamond", cdp_item_map[c].cdp, "custrecord_custom_diamond_vendor");
            var pendingBillObj = nlapiCreateRecord("customrecord_pending_inv_for_cdp");
            pendingBillObj.setFieldValue("name", cdp_item_map[c].itemName);
            pendingBillObj.setFieldValue("custrecord_cdp_id", cdp_item_map[c].cdp);
            if (cdp_item_map[c].po != null && cdp_item_map[c].po != "") {
              pendingBillObj.setFieldValue("custrecord_pending_po_creation", 'F');
            } else {
              pendingBillObj.setFieldValue("custrecord_pending_po_creation", 'T');
            }
            pendingBillObj.setFieldValue("custrecord_diamond_stock_no", cdp_item_map[c].item);
            pendingBillObj.setFieldValue("custrecord_portal_invoice_no", datain.invoice_no);
            pendingBillObj.setFieldValue("custrecord_portal_shipping_cost", datain.shipping_cost);
            pendingBillObj.setFieldValue("custrecord_cdp_portal_comments", datain.comment);
            pendingBillObj.setFieldValue("custrecord_misc_adjustment", datain.misc_adjustments);
            pendingBillObj.setFieldValue("custrecord_cdp_portal_vendor", vendor);
            pendingBillObj.setFieldValue("custrecord_po_number", cdp_item_map[c].po);
            pendingBillObj.setFieldValue("custrecord_invoice_date", GetDateFormat(datain.invoice_date)); // added by ajay 30Sept 2016
            nlapiLogExecution('debug', 'custrecord_invoice_date :-', datain.invoice_date); ///------- Test Log
            for (var r = 0; r < fileIdArr.length; r++) {
              if (fileIdStr == "") {
                fileIdStr = '' + fileIdArr[r] + '';
              } else {
                fileIdStr = fileIdStr + ',' + '' + fileIdArr[r] + '';
              }
            }
            pendingBillObj.setFieldValue("custrecord_attach_files", fileIdStr);
            var customRecId = nlapiSubmitRecord(pendingBillObj, true, true);
            nlapiLogExecution("debug", "Files array value is :", fileIdArr);
            nlapiLogExecution("debug", "Files array string value is :", fileIdStr);
            nlapiSubmitField("customrecord_pending_inv_for_cdp", customRecId, "custrecord_attach_files", fileIdStr);
            nlapiSubmitField("customrecord_cr_for_limit_exceeded",cr_id,"custrecord_datain_created_vendor_bill",'T');
            for (var r = 0; r < fileIdArr.length; r++) {
              nlapiAttachRecord('file', fileIdArr[r], 'customrecord_pending_inv_for_cdp', customRecId, null);
              nlapiLogExecution("debug", "Step (12 B) File Attachment(s)", " File has been attached successfully in NS" );
            }
            nlapiLogExecution("debug", "Created custom record Id for portal invoice api is :", customRecId);
            YieldExecution();
          }
        }
        var errorvalue = 1;
        var status = "OK";
        var errormessage = "Vendor bill created successfully in NS";
        Create_CR_For_Error_Log(status, errormessage, errorvalue,cr_id);
        return;
      }
    }
  } catch (err) {
    nlapiLogExecution("debug", "Error occur in an invoice api is :", err.message);
    var errorvalue = 2;
    var status = "failed";
    var errormessage = err.message
    //nlapiSubmitField("customrecord_cr_for_limit_exceeded",cr_id,"custrecord_datain_created_vendor_bill",'T');
    Create_CR_For_Error_Log(status, errormessage, errorvalue,cr_id);
    return;
  }
}


//Function for file attachment 
function AttachFileInNS(datain) {
  var fileIdArr = new Array();
  var err = new Object();
  if (datain.attachments != null) {
    for (var k = 0; k < datain.attachments.length; k++) {
      if (datain.attachments[k] == "") {
        err.status = "failed";
        err.message = "missing attachments value to be update";
        return err;
      }

      var url = datain.attachments[k];
      if (url != null && url != '') {
        url = url.split('/');
        var extn = url[url.length - 1].split('.');
        extn = extn[extn.length - 1];
        var fileName = url[url.length - 1];
        var response = nlapiRequestURL(datain.attachments[k]);
        if (response.code == 200) {
          var csvDataInBase64 = response.getBody();
          if (GetExtnType(extn) != "") {
            var file = nlapiCreateFile(fileName, GetExtnType(extn), csvDataInBase64);
            file.setFolder(6707491);
            file.setEncoding('UTF-8');
            fileId = nlapiSubmitFile(file);
            //return fileId;
            fileIdArr.push(fileId);
          }
        }
      }
    }
  } //End Attachment process 
  return fileIdArr;
}


function GetExtnType(extn) {
  var type = "";
  switch (extn) {
    case "txt":
      type = "PLAINTEXT";
      break;
    case "pdf":
      type = "PDF";
      break;
    case "csv":
      type = "CSV";
      break;
    case "xls":
      type = "EXCEL";
      break;
    case "JPG":
      type = "JPGIMAGE";
      break;
    case "jpg":
      type = "JPGIMAGE";
      break;
    case "jpeg":
      type = "JPGIMAGE";
      break;
    case "png":
      type = "PNGIMAGE";
      break;
    case "PNG":
      type = "PNGIMAGE";
      break;
    case "gif":
      type = "GIFIMAGE";
      break;
    case "GIF":
      type = "GIFIMAGE";
      break;
    default:
      break;
  }
  return type;
}

//Added new code by ajay 30Sept2016
function GetPeriodDate(invoiceDate) {
  var val = '';
  var stDate = invoiceDate.split('-');
  var invoice_mnth = stDate[1];
  if (invoice_mnth != "10") {
    invoice_mnth = invoice_mnth.replace("0", "");
  }
  var invoice_mnth = parseInt(invoice_mnth);
  var invoice_year = parseInt(stDate[0]);

  var date = nlapiDateToString(new Date());
  var mnth = parseInt(date.split('/')[0]);
  var year = parseInt(date.split('/')[2]);

  if (invoice_year > year) {
    val = mnth;
  } else if (invoice_year == year) {
    if (invoice_mnth > mnth) {
      val = mnth;
    } else if (invoice_mnth == mnth) {
      val = mnth;
    } else if (invoice_mnth < mnth) {
      val = invoice_mnth;
    }
  } else if (invoice_year < year) {
    //val = invoice_mnth;
    val = 0;
  }
  var chk_mnth = String(val);
  nlapiLogExecution("Debug", "Month Value", chk_mnth);
  if (chk_mnth == 0) {
    val = "231"; // For Dec 2018
  } else {
    var filters = new Array();
    var columns = new Array();
    filters.push(new nlobjSearchFilter('custrecord_posting_period_month', null, 'is', chk_mnth));
    filters.push(new nlobjSearchFilter('custrecord_posting_period_year', null, 'is', String(year)));
    columns.push(new nlobjSearchColumn("custrecord_posting_period_month"));
    columns.push(new nlobjSearchColumn("custrecord_posting_period_year"));
    columns.push(new nlobjSearchColumn("custrecord_posting_period_value"));
    var posting_period_result = nlapiSearchRecord("customrecord_posting_period_custom_rec", null, filters, columns);
    nlapiLogExecution("Debug", "Posting Period Result", JSON.stringify(posting_period_result));
    if (posting_period_result)
      val = posting_period_result[0].getValue('custrecord_posting_period_value');
  }
  nlapiLogExecution("Debug", "Posting Value", val);
  /* var val = 0;
      switch (chk_mnth) {
          case "0":
              val = "195";
              break;
          case "1":
              val = "199";
              break;
          case "2":
              val = "200";
              break;
          case "3":
              val = "201";
              break;
          case "4":
              val = "203";
              break;
          case "5":
              val = "204";
              break;
          case "6":
              val = "205";
              break;
          case "7":
              val = "207";
              break;
          case "8":
              val = "208";
              break;
          case "9":
              val = "209";
              break;
          case "10":
              val = "211";
              break;
          case "11":
              val = "212";
              break;
          case "12":
              val = "213";
              break;
          default:
              break;
      }*/
  return val;
}
//Ended

//Added by ajay 28Sept 2016
function GetDateFormat(invoiceDate) {
  var date = new Date();
  if (invoiceDate != null) {
    var invDate = invoiceDate.split('-');
    date = invDate[1] + '/' + invDate[2] + '/' + invDate[0];
  }
  return date;
}
//Ended

function GetPeriod() {
  var val = 0;
  var date = nlapiDateToString(new Date());
  var mnth = date.split('/')[0];
  var year = date.split('/')[2];
  switch (year) {
    case "2016":
      switch (mnth) {
        case "1":
          val = "181";
          break;
        case "2":
          val = "182";
          break;
        case "3":
          val = "183";
          break;
        case "4":
          val = "185";
          break;
        case "5":
          val = "186";
          break;
        case "6":
          val = "187";
          break;
        case "7":
          val = "189";
          break;
        case "8":
          val = "190";
          break;
        case "9":
          val = "191";
          break;
        case "10":
          val = "193";
          break;
        case "11":
          val = "194";
          break;
        case "12":
          val = "195";
          break;
        default:
          break;
      }
      break;
    case "2017":
      switch (mnth) {
        case "1":
          val = "180";
          break;
        case "2":
          val = "181";
          break;
        case "3":
          val = "182";
          break;
        case "4":
          val = "184";
          break;
        case "5":
          val = "185";
          break;
        case "6":
          val = "186";
          break;
        case "7":
          val = "188";
          break;
        case "8":
          val = "189";
          break;
        case "9":
          val = "190";
          break;
        case "10":
          val = "192";
          break;
        case "11":
          val = "193";
          break;
        case "12":
          val = "194";
          break;
        default:
          break;
      }
      break;
  }
  return val;
}

function SendMail(option, invoiceNo, fileIdArr) {
  var body = '';
  var subject = 'invoice #' + invoiceNo + ' - NS Bill Did Not Create from the Portal';

  switch (option) {
    case 1:
      nlapiLogExecution("debug", "send email to receipient due to case 1");
      body = 'The invoice #' + invoiceNo + ' is an exact match of an existing NetSuite bill.';
      break;
    case 2:
      nlapiLogExecution("debug", "send email to receipient due to case 2");
      body = 'The date of the invoice and amount of the invoice is an exact match for an existing NetSuite bill.';
      break;
    case 3:
      nlapiLogExecution("debug", "send email to receipient due to case 3");
      body = 'The item has already been billed on a purchase order.';
      break;
      /*default:
      nlapiLogExecution("debug", "send email to receipient due to default");
      body = 'Test body message';
      break;*/
  }

  var newAttachment = new Array();
  for (var i = 0; i < fileIdArr.length; i++) {
    newAttachment[i] = nlapiLoadFile(fileIdArr[i]);
  }
  nlapiSendEmail(2440149, ['diamond.portal@brilliantearth.com', 'diaops@brilliantearth.com', 'billing@brilliantearth.com'], subject, body, null, null, null, newAttachment);
  nlapiLogExecution("debug", "send email to receipient.");
}

function Update_Action_Needed_IN_NS(cdpId, actionArr) {
  nlapiSubmitField("customrecord_custom_diamond", cdpId, "custrecord_action_needed", actionArr);
  nlapiLogExecution("debug", "Successfully updated action needed field on CDP for cdpId is : ", cdpId);
}

function replacer(key, value) {
  if (typeof value == "number" && !isFinite(value)) {
    return String(value);
  }
  return value;
}

function Create_CR_For_Error_Log(status, errormessage, errorvalue,cr_id) {
  try {
    var crObjErrorLog = nlapiCreateRecord('customrecord_cr_for_error_log');
    crObjErrorLog.setFieldValue('custrecord_error_status', status);
    crObjErrorLog.setFieldValue('custrecord_error_message', errormessage);
    crObjErrorLog.setFieldValue('custrecord_error_value', errorvalue);
    crObjErrorLog.setFieldValue('custrecord_parent_rec_id', cr_id);
    nlapiSubmitRecord(crObjErrorLog);
  } catch (ex) {
    nlapiLogExecution("debug", "Custom Record Information for Error Log", "Custom Error Log Record has been created Successfully");
  }
}
function YieldExecution() {
  if (nlapiGetContext().getRemainingUsage() <= 200) {
    var stateMain = nlapiYieldScript();
    if (stateMain.status == 'FAILURE') {
      nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
      throw "Failed to yield script";
    } 
    else if (stateMain.status == 'RESUME') {
      nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
    }
  }
}
