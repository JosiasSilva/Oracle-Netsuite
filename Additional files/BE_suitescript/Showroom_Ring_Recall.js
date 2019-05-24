nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Script Author  : Sanjeet Kumar Sharma(sanjeet.sharma@inoday.com/sanjeetshrm@gmail.com)
 * Author Design. : Developer, Inoday Consultancy Pvt. Ltd(India)
 * Script Type    : Scheduled Script
 * Script Name    : Showroom Ring Recall
 * Created Date   : July 6, 2017
 * Last Modified Date :
 * Comments :
 * URL Sandbox: /app/common/scripting/script.nl?id=1590
 * URL Production:
 */
function createTransferOrder()
{

  if (nlapiGetContext().getRemainingUsage() < 500) {
    var stateMain = nlapiYieldScript();
    if (stateMain.status == 'FAILURE') {
      nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
      throw "Failed to yield script";
    } else if (stateMain.status == 'RESUME') {
      nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
    }
  }
  //var mySearch = nlapiLoadSearch(null, 6291);//Sandbox
  var mySearch = nlapiLoadSearch(null, 6451);// Production
  var searchresult = [];
  var resultset = mySearch.runSearch();
  var searchid = 0;
  do {
    var resultslice = resultset.getResults(searchid, searchid + 1000);
    if (resultslice != null && resultslice != '') 
    {
      for (var rs in resultslice) 
      {
        searchresult.push(resultslice[rs]);
        searchid++;
      }
    }
  } 
  while (resultslice.length >= 1000);
  var searchCount = searchresult.length;
  if (searchCount > 0) 
  {
    //var tempArrLoc = '';
    //var tempArrLoc1 = new Array();
    var tempArrLoc = new Array();
    var itemArrLoc = new Array();
    var startdate = new Date();
    var _startdate=nlapiDateToString(startdate,'date');
    var enddate = nlapiAddDays(startdate,3);
    var _enddate= nlapiDateToString(enddate ,'date');
    //searchresult.length
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
      var chkFlag =false;
      var Results = searchresult[j].getAllColumns();
      var itemName = searchresult[j].getValue(Results[0]);
      var salesdescription=searchresult[j].getValue(Results[1]);
      var showroomFromLocation = searchresult[j].getValue(Results[2]);
      nlapiLogExecution("Debug","Locations",showroomFromLocation);
      var showroomToLocation = '7';
      var availableQyuantity = searchresult[j].getValue(Results[4]);
      var amountOverTarget = searchresult[j].getValue(Results[5]);
      nlapiLogExecution("Debug","Amount Over Target",amountOverTarget);
      //logic for location appointment
      var itemId = searchresult[j].getId();
      var inventoryCityLocation = nlapiLookupField('location',showroomFromLocation,'custrecord_city_location',true);
      nlapiLogExecution("Debug","Inventory City Location",inventoryCityLocation);
      var itemObj = nlapiLoadRecord('inventoryitem', itemId);
    
      var countAppt = itemObj.getLineItemCount('recmachcustrecord_appointment_item_itemid');
      for (var k = 1; k <= countAppt; k++)
      {
        var ApptItemId = itemObj.getLineItemValue('recmachcustrecord_appointment_item_itemid', 'id', k);
        var parentApptId = nlapiLookupField('customrecord_appointment_item', ApptItemId, 'custrecord_appointment_item_parent');
        if(parentApptId)
        {
        var appt_calendarLocationId = nlapiLookupField('calendarevent',parentApptId,'custevent_calendar_location',true);
        var filter = new Array();
        filter.push(new nlobjSearchFilter('internalid', null, 'is', parentApptId));
        filter.push(new nlobjSearchFilter('startdate', null, 'within', _startdate ,_enddate));
        var result = nlapiSearchRecord('calendarevent', null, filter, null);
        if(result) 
        {
          if(inventoryCityLocation==appt_calendarLocationId)
          {
            chkFlag =true;
            break;
          }
          else
          {
            chkFlag =false;
          }
        }
        else
        {
          chkFlag =false;	       
        }
      }
      }
      if(chkFlag==false)
      {
        tempArrLoc.push({
          to_loc_id: showroomToLocation,
          from_loc_id: showroomFromLocation,
          items: itemId,
          amountOverTarget :amountOverTarget
        });
      }

    }
    nlapiLogExecution("Debug","tempArrLoc",JSON.stringify(tempArrLoc));
    if (tempArrLoc) {
      var len = tempArrLoc.length;
      while (len > 0) {
        var temp = tempArrLoc.filter(function(item) {
          return (item.from_loc_id  == tempArrLoc[0].from_loc_id);
        });
        itemArrLoc.push({
          to_loc_id: tempArrLoc[0].to_loc_id,
          from_loc_id: tempArrLoc[0].from_loc_id,
          items: temp

        });
        tempArrLoc = removeByAttr(tempArrLoc, 'from_loc_id', tempArrLoc[0].from_loc_id);
        len = tempArrLoc.length;
      }
    }
    nlapiLogExecution("Debug","itemArrLoc",JSON.stringify(itemArrLoc));
    if (itemArrLoc != '' && itemArrLoc != null && itemArrLoc.length > 0) 
    {
      var location_id = nlapiGetContext().getSetting('SCRIPT', 'custscript_param_from_location');
      nlapiLogExecution('DEBUG','Location through parameter',location_id);
      itemArrLoc= itemArrLoc.filter(function(item) {
        return (item.from_loc_id  == location_id);
      });
      nlapiLogExecution('DEBUG','Matching From Location',JSON.stringify(itemArrLoc));
      for (var iLoc = 0; iLoc < itemArrLoc.length; iLoc++) {
        var myResult = itemArrLoc[iLoc].items;
        if (myResult != null && myResult.length > 0) {
          var insTotal = 0;
          var search_title='Showroom Recall: Results';
          var TransferOrder = null;
          TransferOrder = nlapiCreateRecord('transferorder');
          var memo = search_title;
          TransferOrder.setFieldValue('location',itemArrLoc[iLoc].from_loc_id );
          TransferOrder.setFieldValue('transferlocation', itemArrLoc[iLoc].to_loc_id);
          TransferOrder.setFieldValue('orderstatus', 'B');
          TransferOrder.setFieldValue('memo', memo);
          var totItem = 0;
          for (i = 0; i < myResult.length; i++) { 
            totItem = totItem + 1;

            var itemIdNo = myResult[i].items;
            var amount_over_target=myResult[i].amountOverTarget;
            TransferOrder.selectNewLineItem('item');
            TransferOrder.setCurrentLineItemValue('item', 'item', itemIdNo);
            TransferOrder.setCurrentLineItemValue('item', 'quantity', amount_over_target);
			 //logic for insurance value calculation
			  var itemObj = nlapiLoadRecord('inventoryitem',itemIdNo);
			  for(var k=0; k<itemObj.getLineItemCount('price');k++)
            {
               base_price = itemObj.getLineItemMatrixValue('price', 'price', k+1, 1);
              if(base_price !='' && base_price!=null)
                break;
            }
            nlapiLogExecution("Debug","base price",parseFloat(base_price));
            var insuranceValue=parseFloat(base_price)*0.8;
            if (insuranceValue != null && insuranceValue != '')
              insTotal = parseFloat(insTotal) + parseFloat(insuranceValue);
			  //logic for insurance value calculation
			  if (insuranceValue != null && insuranceValue != '')
              TransferOrder.setCurrentLineItemValue('item', 'custcol_full_insurance_value', insuranceValue);

            TransferOrder.commitLineItem('item');

          } // end of for loop
		   TransferOrder.setFieldValue('custbody_insurance_total', insTotal);
          TransferOrder.setFieldValue('custbody306', totItem);
          var TransferRecId = nlapiSubmitRecord(TransferOrder, false, false);
          nlapiLogExecution('debug', 'Transfer Record created -', TransferRecId);
        }
      }
    }

  }
}		 
function removeByAttr(arr, attr,value) {
  var i = arr.length;
  while (i--) {
    if (arr[i] &&
        arr[i].hasOwnProperty(attr) &&
        (arguments.length > 2 && arr[i][attr] === value )) {

      arr.splice(i, 1);

    }
  }
  return arr;
}

function  checkQuantityAvailableToShowroomSF(itemObj,chkFlag,_startdate,_enddate,showroomToLocation,showroomFromLocation,itemId,amountOverTarget,tempArrLoc1)
{
  var countAppt = itemObj.getLineItemCount('recmachcustrecord_appointment_item_itemid');
  for (var k = 1; k <= countAppt; k++)
  {
    var ApptItemId = itemObj.getLineItemValue('recmachcustrecord_appointment_item_itemid', 'id', k);
    var parentApptId = nlapiLookupField('customrecord_appointment_item', ApptItemId, 'custrecord_appointment_item_parent');
    var appt_calendarLocationId = nlapiLookupField('calendarevent',parentApptId,'custevent_calendar_location',true);
    var filter = new Array();
    filter.push(new nlobjSearchFilter('internalid', null, 'is', parentApptId));
    filter.push(new nlobjSearchFilter('startdate', null, 'within', _startdate ,_enddate));
    var result = nlapiSearchRecord('calendarevent', null, filter, null);
    if(result) 
    {
      if(inventoryCityLocation==appt_calendarLocationId)
      {
        chkFlag =true;
        break;
      }
      else
      {
        chkFlag =false;
      }
    }
    else
    {
      chkFlag =false;        
    }
  }
  if(chkFlag==false)
  {
    tempArrLoc1.push({
      to_loc_id: showroomToLocation,
      from_loc_id: showroomFromLocation,
      items: itemId,
      amountOverTarget :amountOverTarget
    });
  }
  return tempArrLoc1;
}