nlapiLogExecution("audit","FLOStart",new Date().getTime());
/** 
 * Script Author : Sandeep Kumar(sandeep.kumar@inoday.com/sksandy28@gmail.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd(India)
 * Script Type   : Scheduled Script
 * Script Name   : New Sold Items Sent from Satellite Loc
 * Created Date  : May 05, 2017
 * Last Modified Date : 
 * Comments : 
 * URL Sandbox: 
 * URL Production: https://system.netsuite.com/app/common/scripting/script.nl?id=1235&whence=
 */
 //var t= transferOrders();
 //var h =0;
function transferOrders()
{
	var search_id='';
    try 
	{
		Reschedule();
	    search_id = nlapiGetContext().getSetting('SCRIPT', 'custscript_new_sold_items_save_search');//3638;
		var search_title = nlapiGetContext().getSetting('SCRIPT', 'custscript_new_sold_items_search_title');
		nlapiLogExecution('Debug','Search id #'+search_id,'Search title : '+search_title);
		var mySearch = nlapiLoadSearch(null, search_id); // For Production
        var searchresult = [];
        var resultset = mySearch.runSearch();
        var searchid = 0;
        do 
		{
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
            //New variables for new logic
			var InsuranceAvgAmt = 70000;
			var prevItemId = '';
            var itemArrLoc = new Array();
            var tempArrLoc = new Array();
			var InsuranceTotAmtArr = new Array();

            for (var j = 0; j < searchresult.length; j++) 
			{
                var insuranceTotal = '0.00';
                var memo = '';
                Reschedule();
                var Results = searchresult[j].getAllColumns();
                var itemIdNo = searchresult[j].getValue(Results[6]);
				var insValue = searchresult[j].getValue(Results[7]);                
				var fromLocationIdNo = searchresult[j].getValue(Results[10]);
				var toLocationIdNo = searchresult[j].getValue(Results[12]);						
                
                if (itemIdNo != prevItemId) 
				{
					if(toLocationIdNo!='Ship to Customer')
					{
						var index = InsuranceTotAmtArr.map(function(e) {
										return e.loc_id;
									}).indexOf(toLocationIdNo+'-'+fromLocationIdNo);
						if (!(index > -1)) 
						{
							InsuranceTotAmtArr.push({
								loc_id: toLocationIdNo+'-'+fromLocationIdNo,
								amount: parseFloat(insValue)
							});
							index = InsuranceTotAmtArr.map(function(e) {
								return e.loc_id;
							}).indexOf(toLocationIdNo+'-'+fromLocationIdNo);
						} 
						else 
						{
							InsuranceTotAmtArr[index].amount = parseFloat(InsuranceTotAmtArr[index].amount) + parseFloat(insValue);
						}
						if (InsuranceTotAmtArr[index].amount > InsuranceAvgAmt) 
						{
							var temp = tempArrLoc.filter(function(item) {
								return (item.to_loc_id == toLocationIdNo && item.from_loc_id==fromLocationIdNo);
							});
							itemArrLoc.push({
								to_loc_id: toLocationIdNo,
								from_loc_id: fromLocationIdNo,
								items: temp
							});
							InsuranceTotAmtArr[index].amount = parseFloat(insValue);
							tempArrLoc = removeByAttr(tempArrLoc, 'to_loc_id','from_loc_id', toLocationIdNo,fromLocationIdNo);
							tempArrLoc.push({
								to_loc_id: toLocationIdNo,
								from_loc_id: fromLocationIdNo,
								items: searchresult[j]
							});

						} 
						else 
						{
							tempArrLoc.push({
								to_loc_id: toLocationIdNo,
								from_loc_id: fromLocationIdNo,
								items: searchresult[j]
							});
						}
					}
                } // end check of prevItemId
                prevItemId = itemIdNo;
            }
            // end of for loop
            if (tempArrLoc) 
			{
                var len = tempArrLoc.length;
                while (len > 0) 
				{
                    var temp = tempArrLoc.filter(function(item) {
                        return ( (item.to_loc_id == tempArrLoc[0].to_loc_id) && (item.from_loc_id  == tempArrLoc[0].from_loc_id));
                    });
                    itemArrLoc.push({
						to_loc_id: tempArrLoc[0].to_loc_id,
						from_loc_id: tempArrLoc[0].from_loc_id,
						items: temp

                    });
                    tempArrLoc = removeByAttr(tempArrLoc, 'to_loc_id','from_loc_id', tempArrLoc[0].to_loc_id,tempArrLoc[0].from_loc_id);
                    len = tempArrLoc.length;
                }
            }
            if (itemArrLoc) 
			{
                for (iLoc = 0; iLoc < itemArrLoc.length; iLoc++) 
				{
					var myResult = itemArrLoc[iLoc].items;
					if (myResult != null && myResult.length > 0) 
					{
						var insTotal = 0;
						var TransferOrder = null;
						TransferOrder = nlapiCreateRecord('transferorder');
						memo = search_title;
						TransferOrder.setFieldValue('location',itemArrLoc[iLoc].from_loc_id );
						TransferOrder.setFieldText('transferlocation', itemArrLoc[iLoc].to_loc_id);
						TransferOrder.setFieldValue('orderstatus', 'B');
						TransferOrder.setFieldValue('memo', memo);
						var totItem = 0;
						for (i = 0; i < myResult.length; i++) 
						{
							totItem = totItem + 1;
							var ResultColm = myResult[i].items.getAllColumns();
							var itemIdNo = myResult[i].items.getValue(ResultColm[6]);
							var certificate_no= myResult[i].items.getValue(ResultColm[9]);
							var insurance = myResult[i].items.getValue(ResultColm[7]);
							var appt_notes= myResult[i].items.getText(ResultColm[3]);
							var SO_internalId= myResult[i].items.id;//NS-758 sync document no. sanjeet
							if (insurance == null || insurance == '') 
							{
								insurance = 0;
							}
							insTotal = parseFloat(insTotal) + parseFloat(insurance);
							TransferOrder.selectNewLineItem('item');
							TransferOrder.setCurrentLineItemValue('item', 'item', itemIdNo);
							TransferOrder.setCurrentLineItemValue('item', 'custcol16', certificate_no);
							TransferOrder.setCurrentLineItemValue('item', 'custcol_notes', appt_notes);
							TransferOrder.setCurrentLineItemValue('item', 'custcol38', SO_internalId);//NS-758 edit by sanjeet
							if (insurance != null && insurance != '')
								TransferOrder.setCurrentLineItemValue('item', 'custcol_full_insurance_value', insurance);
							
							TransferOrder.commitLineItem('item');	
													
						} // end of for loop
						TransferOrder.setFieldValue('custbody_insurance_total', insTotal);
						TransferOrder.setFieldValue('custbody306', totItem);
						nlapiLogExecution('debug', 'Transfer Order Object -',JSON.stringify(TransferOrder));
						var TransferRecId = nlapiSubmitRecord(TransferOrder, false, false);
						nlapiLogExecution('debug', 'Transfer Record created -', TransferRecId);
					}
                }
            } //end check itemArrLoc1.length			
        }

    } 
	catch (e) 
	{
        nlapiLogExecution('error', 'Exception in search#'+search_id+' Transfer Record is', e.message);
    }
}
function Reschedule()
{
	if (nlapiGetContext().getRemainingUsage() < 500) 
	{
		var stateMain = nlapiYieldScript();
		if (stateMain.status == 'FAILURE') 
		{
			nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
			throw "Failed to yield script";
		} 
		else if (stateMain.status == 'RESUME') 
		{
			nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
		}
    }
}
function removeByAttr(arr, attr1,attr2, value1,value2) 
{
    var i = arr.length;
    while (i--) 
	{
        if (arr[i] && arr[i].hasOwnProperty(attr1) && arr[i].hasOwnProperty(attr2) && (arguments.length > 2 && arr[i][attr1] === value1 && arr[i][attr2] === value2)) 
		{
            arr.splice(i, 1);
        }
    }
    return arr;
}