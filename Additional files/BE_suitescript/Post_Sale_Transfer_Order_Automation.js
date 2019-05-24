nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Script Author : Sanjeet Kumar Sharma (sanjeet.sharma@inoday.com/sanjeetshrm@gmail.com)
 * Author Desig. : Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (Scheduled Script)
 * Script Name   : Post Sale Transfer Order
 */
function transferOrders() 
{
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

   // var mySearch = nlapiLoadSearch(null, 6307);// For sandbox
    var mySearch = nlapiLoadSearch(null, 6925);// For production
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

      var InsuranceAvgAmt = 70000;


      //New variables for new logic
      var prevItemId = '';
      var itemArrLoc = new Array();
      var InsuranceTotAmtArr = new Array();
      var tempArrLoc = new Array();

      var prevLocation = '';
      for (var j = 0; j <searchresult.length; j++) {
        var insuranceTotal = '0.00';
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
        var itemIdNo = searchresult[j].getId();
        var salesOrderIdNo = searchresult[j].getValue(Results[1]);
        var customerName = searchresult[j].getText(Results[2]);
        var customerIdNo = searchresult[j].getValue(Results[2]);
        var itemName = searchresult[j].getText(Results[3]);
        var description = searchresult[j].getValue(Results[4]);
        var insValue = searchresult[j].getValue(Results[5]);
        var quantity = searchresult[j].getValue(Results[6]);
        var amount = searchresult[j].getValue(Results[7]);
        var cust_item_location = searchresult[j].getValue(Results[8]);
        var locations=cust_item_location.split(',');
        var from_location;
        if(locations.indexOf('4')==0)
        {
          cust_item_loc=locations[1];
        }
        else
        {
          cust_item_loc=locations[0];
        }
        var results=nlapiSearchRecord('location',null,new nlobjSearchFilter('custrecord_customer_item_location',null,'anyOf',cust_item_loc));
        var from_location=results[0].getId();
       // if (itemIdNo != prevItemId) {
          /*New Logic*/
          //var index=InsuranceTotAmtArr.loc_id.indexOf(customerItemLocationId);
          var index = InsuranceTotAmtArr.map(function(e) {
            return e.loc_id;
          }).indexOf(from_location);
          if (!(index > -1)) {
            InsuranceTotAmtArr.push({
              loc_id: from_location,
              amount: parseFloat(insValue)
            });
            index = InsuranceTotAmtArr.map(function(e) {
              return e.loc_id;
            }).indexOf(from_location);
          } else {
            InsuranceTotAmtArr[index].amount = parseFloat(InsuranceTotAmtArr[index].amount) + parseFloat(insValue);
          }
          if (InsuranceTotAmtArr[index].amount > InsuranceAvgAmt) {
            var temp = tempArrLoc.filter(function(item) {
              return (item.loc_id == from_location);
            });
            itemArrLoc.push({
              loc_id: from_location,
              items: temp
            });
            InsuranceTotAmtArr[index].amount = parseFloat(insValue);
            tempArrLoc = removeByAttr(tempArrLoc, 'loc_id', from_location);
            tempArrLoc.push({
              loc_id: from_location,
              items: searchresult[j]

            });

          } else {
            tempArrLoc.push({
              loc_id: from_location,
              items: searchresult[j]
            });
          }

          /******************/
          /*End New Logic*/


       // } // end check of prevItemId
       // prevItemId = itemIdNo;
      }
      // end of for loop
      if (tempArrLoc) {
        var len = tempArrLoc.length;
        while (len > 0) {
          var temp = tempArrLoc.filter(function(item) {
            return (item.loc_id == tempArrLoc[0].loc_id);
          });
          itemArrLoc.push({
            loc_id: tempArrLoc[0].loc_id,
            items: temp

          });
          tempArrLoc = removeByAttr(tempArrLoc, 'loc_id', tempArrLoc[0].loc_id);
          len = tempArrLoc.length;
        }
      }
      if (itemArrLoc) {
        var search_memo = nlapiGetContext().getSetting('SCRIPT', 'custscript_search_title');
        nlapiLogExecution('Debug','Search title',search_memo);
        var location_id = nlapiGetContext().getSetting('SCRIPT', 'custscript_to_location');
        nlapiLogExecution('DEBUG','Location through parameter',location_id);
        
         var from_loc = nlapiGetContext().getSetting('SCRIPT', 'custscript_from_location');
        var itemArrLoc= itemArrLoc.filter(function(item) {
          return (item.loc_id == from_loc );
        });
        for (iLoc = 0; iLoc < itemArrLoc.length; iLoc++) {
          var myResult = itemArrLoc[iLoc].items;
          if (myResult != null && myResult.length > 0) {
            var insTotal = 0;
            var TransferOrder = null;
            TransferOrder = nlapiCreateRecord('transferorder');
            TransferOrder.setFieldValue('location',from_loc);
            TransferOrder.setFieldValue('transferlocation',location_id);
            TransferOrder.setFieldValue('orderstatus', 'B');
            TransferOrder.setFieldValue('memo', search_memo);

            var totItem = 0;
            var arr_so=[];
            for (i = 0; i < myResult.length; i++) {
              totItem = totItem + 1;
              var ResultColm = myResult[i].items.getAllColumns();
              var so_id= myResult[i].items.getId();
              var item_id = myResult[i].items.getValue(ResultColm[3]);
              var insurance = myResult[i].items.getValue(ResultColm[5]);
              var description= myResult[i].items.getValue(ResultColm[4]);
              var amount = myResult[i].items.getValue(ResultColm[7]);
              //var totalItems = myResult[i].items.getValue(ResultColm[6]);

              if (insurance == null || insurance == '') {
                insurance = 0;
              }

              if(i==0)
              {
                arr_so.push(so_id);
              }
              else
              {
                if(!(arr_so.indexOf(so_id)>-1))
                {
                  arr_so.push(so_id);
                }
              }

              insTotal = parseFloat(insTotal) + parseFloat(insurance);

              TransferOrder.selectNewLineItem('item');
              TransferOrder.setCurrentLineItemValue('item', 'item', item_id );

              if (insurance != null && insurance != '')
                TransferOrder.setCurrentLineItemValue('item', 'custcol_full_insurance_value', insurance);


              TransferOrder.setCurrentLineItemValue('item', 'custcol38', so_id);
              TransferOrder.setCurrentLineItemValue('item', 'description', description);


              TransferOrder.commitLineItem('item');

            } // end of for loop
            TransferOrder.setFieldValue('custbody_insurance_total', insTotal);
            TransferOrder.setFieldValue('custbody306', totItem);
            TransferOrder.setFieldValue('custbody_to_so_count',arr_so.length);
            var TransferRecId = nlapiSubmitRecord(TransferOrder, false, false);
            nlapiLogExecution('debug', 'Search ID-6307 Transfer('+itemArrLoc[iLoc].loc_name+' to SF) Record Id:' + TransferRecId, TransferRecId);
          }

        }
      } //end check itemArrLoc1.length			

    }

  } catch (e) {
    nlapiLogExecution('error', 'Exception in search id-6307 Transfer Record is', e.message);
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