/**
 * Script Author : Sandeep Kumar (sandeep.kumar@inoday.com/sksandy28@gmail.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (Scheduled Script)
 * Script Name   : Update CS Fulfilment for item in prod
 * Created Date  : Nov 03, 2017
 * Last Modified Date : Nov 06, 2017
 * Comments : 
 * SS URL :  https://system.sandbox.netsuite.com/app/common/scripting/script.nl?id=2132&whence=
 * Script URL: https://system.na3.netsuite.com/app/common/scripting/script.nl?id=2120&whence=
 */
function updateCSFulfilment() 
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
    // var mySearch = nlapiLoadSearch(null, 8170); // For Sandbox 
    var mySearch = nlapiLoadSearch(null, 8169); // For Sandbox 

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
      var obj_so = nlapiCreateRecord('salesorder');
      var csf_status = obj_so.getField('custbody140');
      var options = csf_status.getSelectOptions();
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
        var so_id = searchresult[j].getValue(Results[0]);
        var item_not_received = searchresult[j].getValue(Results[2]);
        var cs_fulfillment = searchresult[j].getValue(Results[3]);

        var arr_csf_ids = [];
        if (cs_fulfillment) {
          var arr_csf = cs_fulfillment.split(',');
          for (var i = 0; i < arr_csf.length; i++) {
            var temp = options.filter(function(item) {
              return (item.getText() == arr_csf[i]);
            });
            arr_csf_ids.push(temp[0].getId());
          }
        }
        var index = arr_csf_ids.indexOf('16');

        if (item_not_received == null || item_not_received == '') {
          if (index > -1) {
            arr_csf_ids.splice(index, 1);
            var currentValue=nlapiLookupField('salesorder',so_id,'custbody140',true);
            nlapiLogExecution("debug", "field: CS Fulfillment Status Changed  at:", new Date() +"record id: "+so_id+" current field Values:"+currentValue+ " new fields values: "+arr_csf_ids);
            if(currentValue)
            {
              currentValue=currentValue.split(',');
              if(currentValue.indexOf("20")>-1 && arr_csf_ids.indexOf("20") <=-1)
              {
                arr_csf_ids.push("20");
              }
            }
            nlapiSubmitField('salesorder', so_id, 'custbody140', arr_csf_ids);
          }

        } else {
          if (index <= -1) {
            arr_csf_ids.push('16');
            var currentValue=nlapiLookupField('salesorder',so_id,'custbody140');
            nlapiLogExecution("debug", "field: CS Fulfillment Status Changed  at:", new Date() +"record id: "+so_id+" current field Values: "+currentValue+ " new fields values: "+arr_csf_ids);
            if(currentValue)
            {
              currentValue=currentValue.split(',');
              if(currentValue.indexOf("20")>-1 && arr_csf_ids.indexOf("20") <=-1)
              {
                arr_csf_ids.push("20");
              }
            }
            nlapiSubmitField('salesorder', so_id, 'custbody140', arr_csf_ids);


          }
        }
      }
      // end of for loop
    }

  } catch (e) {
    nlapiLogExecution('error', 'Error', e.message);
  }
}