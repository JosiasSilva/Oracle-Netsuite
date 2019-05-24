//Script to merge Script id 2307 & 2309 on Deployed Sales Order due to priority issues
/*
Script Author : 	Nikhil Bhutani ([nikhil.bhutani@inoday.com](mailto:nikhil.bhutani@inoday.com))
Author Desig. : 	Sr. Developer, Inoday Consultancy Pvt. Ltd.
Script Type : 		Suitescript (Client Script on PageInit & fieldchanged (Pick up at BE) Applied to Sales Order)
Script Name :		LockShipAddress
Created Date : 		June 27, 2018
Last Modified Date :June 27, 2018
Comments :			Script to merge Script id 2307 & 2309 on Deployed Sales Order due to priority issues
SS URL(sandbox) :	https://system.sandbox.netsuite.com/app/common/scripting/script.nl?id=2877
SS production URL : https://system.na3.netsuite.com/app/common/scripting/script.nl?id=2309&whence=
*/
function pageinit(type)
{
	if (type == 'create') {
	setInitialValuesOnSO(type);
	}
	lockshipaddress_pageinit(type);
}

function setInitialValuesOnSO(type) {
  if (type == 'create') {

        var url_string = window.location.href;
        var url = new URL(url_string);
        var cgr_id = url.searchParams.get("cgr_id");

        if (cgr_id) {
            var cgr_fields = nlapiLookupField('customrecord_custom_gem_request', cgr_id, ['custrecord_cgr_customer', 'custrecord_cgr_sales_rep', 'custrecord_item_link']);
            var cust_id = cgr_fields.custrecord_cgr_customer;
            var sales_rep_id = cgr_fields.custrecord_cgr_sales_rep;
            var items = cgr_fields.custrecord_item_link;

            //Set customer on sales order page
            nlapiSetFieldValue('entity', cust_id);
            //Set Sales Rep on Sales Order
            nlapiSetFieldValue('salesrep', sales_rep_id);

            //bind line items in sales order
            if (items) {
                var arrItems = items.split(',');

                for (var i = 0; i < arrItems.length; i++) {

                    nlapiSelectNewLineItem('item');
                    nlapiSetCurrentLineItemValue('item', 'item', arrItems[i], true, true);
                    nlapiCommitLineItem('item');
                }
            }
        }
    }
}

function lockshipaddress_pageinit(type) {
/* This function will enable or disable the Ship To DropDown Sublist Field based on value of Pickup at BE checkbox on load. */
 // nlapiLogExecution('Debug','init start');
  //alert(type);
    try {
    //  debugger;
        var so_id = nlapiGetRecordId();
        var pickAtBE = nlapiGetFieldValue('custbody53');
        var inpt_shipaddresslist = document.querySelectorAll('input[id^="inpt_shipaddresslist"]');
        nlapiLogExecution('Debug','so_id: '+so_id+' pickupAtBE: '+pickAtBE+' inpt_shipaddresslist: '+inpt_shipaddresslist);
        if (pickAtBE == 'T') {
            inpt_shipaddresslist.forEach(disable_ddl);
            document.getElementById("shipaddresslist_fs").style = 'pointer-events: none';
            document.getElementById("shipaddresslist_fs").disabled = true;
        } else if (pickAtBE == 'F') {
            inpt_shipaddresslist.forEach(enable_ddl);
            document.getElementById("shipaddresslist_fs").style = 'pointer-events: auto';
            document.getElementById("shipaddresslist_fs").disabled = false;
        }
    } catch (ex) {
        nlapiLogExecution('error', 'error : ', ex.message);
        // baseRecordType = document.getElementById('baserecordtype').value;
    }
}

function fieldchanged(type, name) {
/* This function will enable or disable the Ship To DropDown Sublist Field based on value of Pickup at BE checkbox whenever the Pickup at BE checkbox is changed. */
    if (name == 'custbody53') {
    //  debugger;
        try {
            var so_id = nlapiGetRecordId();
            var pickAtBE = nlapiGetFieldValue('custbody53');
            var inpt_shipaddresslist = document.querySelectorAll('input[id^="inpt_shipaddresslist"]');
            nlapiLogExecution('Debug','so_id: '+so_id+' pickupAtBE: '+pickAtBE+' inpt_shipaddresslist: '+inpt_shipaddresslist);
            if (pickAtBE == 'T') {
                inpt_shipaddresslist.forEach(disable_ddl);
                document.getElementById("shipaddresslist_fs").style = 'pointer-events: none';
                document.getElementById("shipaddresslist_fs").disabled = true;
            } else if (pickAtBE == 'F') {
                inpt_shipaddresslist.forEach(enable_ddl);
                document.getElementById("shipaddresslist_fs").style = 'pointer-events: auto';
                document.getElementById("shipaddresslist_fs").disabled = false;
            }
        } catch (ex) {
            nlapiLogExecution('error', 'error : ', ex.message);
            return false;
            // baseRecordType = document.getElementById('baserecordtype').value;
        }
    }
return true;
}

function disable_ddl(item, index) {
    item.disabled = true;
}

function enable_ddl(item, index) {
    item.disabled = false;
}