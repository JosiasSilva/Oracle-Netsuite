nlapiLogExecution("audit","FLOStart",new Date().getTime());
// Updated by Yagya on 25-11-2016
function PageInit() {
    var list_count_incoming = nlapiGetLineItemCount('custitem_list_incoming');
    var list_count_outgoing = nlapiGetLineItemCount('custitem_list_outgoing');

    var array_colur = ['White', 'Pink', 'Cyan', 'Green', 'Gray', 'Yellow', 'Red', 'Orange', 'Blue', 'Indigo', 'Violet', 'Purple', 'Magenta', , 'Brown'];
    if (list_count_incoming > 0) {
        var span_id = ['custitem_list_incomingdir2', 'custitem_list_incomingdir3', 'custitem_list_incomingdir4', 'custitem_list_incomingdir5', 'custitem_list_incomingdir7', 'custitem_list_incomingdir8'];
        Add_ID(span_id);
        var class_tr = 'uir-list-row-tr uir-list-row-even';
        var k = 1;
        for (var s = 1; s <= list_count_incoming; s++) {
            var color_change = "";
            var zzz = document.getElementById("custitem_incoming_box" + s + "_formattedValue");
            if (zzz != null && zzz != "") {
                color_change = document.getElementById("custitem_incoming_box" + s + "_formattedValue").style = 'background-color: ' + array_colur[nlapiGetLineItemValue("custitem_list_incoming", "custitem_incoming_box", s)] + ';text-align:center; color:black;';
            }
            var custitem_incoming_internalid_chk = nlapiGetLineItemValue("custitem_list_incoming", "custitem_incoming_internalid_chk", s);

            if (custitem_incoming_internalid_chk.length > 0) {

                if (k % 2 != 0) {
                    class_tr = 'uir-list-row-tr uir-list-row-odd';
                } else {
                    class_tr = 'uir-list-row-tr uir-list-row-even';
                }
                k = k + 1;
            }

            // document.getElementById('custitem_list_incomingrow'+(s-1)).className =class_tr;

            var elementID = document.getElementById('custitem_list_incomingrow' + (s - 1))
            if (elementID != null && elementID != "") {
                elementID.className = class_tr
                elementID = "";
            }

        }
    }
    if (list_count_outgoing > 0) {
        var array_colur1 = getRandomColor(list_count_outgoing);
        var span_id = ['custitem_list_outgoingdir3', 'custitem_list_outgoingdir4', 'custitem_list_outgoingdir5', 'custitem_list_outgoingdir6', 'custitem_list_outgoingdir7', 'custitem_list_outgoingdir8', 'custitem_list_outgoingdir9', 'custitem_list_outgoingdir11', 'custitem_list_outgoingdir12', 'custitem_list_outgoingdir13'];
        Add_ID(span_id);

        var class_tr = 'uir-list-row-tr uir-list-row-even';
        SetColor();
    }
}

function Change_Value(type, name, s) {
    if (name == 'custitem_location') {
        var locationvalue = nlapiGetFieldValue('custitem_location');
        window.onbeforeunload = null;
        var linkURL = nlapiResolveURL('SUITELET', 'customscript_transfer_order_dashboard', 'customdeploy_transfer_order_dashboard', 'internal');
        linkURL = linkURL + '&custpage_location=' + encodeURIComponent(JSON.stringify(nlapiGetFieldValue('custitem_location')));
        window.open(linkURL, "_self");
    } 
  /*else if (name == 'custitem_outgoing_box') 
	{
      alert( nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_box', 1));
        var array_colur = ['White', 'Pink', 'Cyan', 'Green', 'Gray', 'Yellow', 'Red', 'Orange', 'Blue', 'Indigo', 'Violet', 'Purple', 'Magenta', , 'Brown'];
        if (document.getElementById("custitem_outgoing_box" + s + "_formattedValue") != null && document.getElementById("custitem_outgoing_box" + s + "_formattedValue") != "") {
            document.getElementById("custitem_outgoing_box" + s + "_formattedValue").style = 'background-color: ' + array_colur[nlapiGetLineItemValue("custitem_list_outgoing", "custitem_outgoing_box", s)] + ';text-align:center; color:black;';
        }
        nlapiSetLineItemValue("custitem_list_outgoing", "custitem_outgoing_status", s, 2);
    }
    */
}


function SetColor() {
    var Transfer_Order = [];
    for (var t = 1; t <= nlapiGetLineItemCount('custitem_list_outgoing'); t++) {
        Transfer_ID = nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_internalid', t);
        var color = getColor1();
        document.getElementById("custitem_outgoing_box" + t + "_formattedValue").setAttribute("style", "text-align: center; background-color:" + color);
        SetColor2(Transfer_ID, t, color)
    }
}


function SetColor2(Transfer_ID, index, color) {
    for (var t = 1; t <= nlapiGetLineItemCount('custitem_list_outgoing'); t++) {
        if (t != index) {
            if (Transfer_ID == nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_internalid', t)) {
                document.getElementById("custitem_outgoing_box" + t + "_formattedValue").setAttribute("style", " text-align: center; background-color:" + color);
            }
        }
    }
}

function Incoming_Print() {
    var Transfer_Order = new Array();
    for (var t = 1; t <= nlapiGetLineItemCount('custitem_list_incoming'); t++) {
        if (nlapiGetLineItemValue('custitem_list_incoming', 'custitem_incoming_recieve', t) == 'T') {
            Transfer_Order.push(nlapiGetLineItemValue('custitem_list_incoming', 'custitem_incoming_internalid', t));
        }

    }
    if (Transfer_Order.length > 0) {
        var uniqueTransfer_Order = Transfer_Order.filter(function(elem, pos) {
            return Transfer_Order.indexOf(elem) == pos;
        });

        var itemfulfillment = new Array();
        var filter = new Array();
        filter.push(new nlobjSearchFilter('createdfrom', null, 'anyof', uniqueTransfer_Order));
        filter.push(new nlobjSearchFilter('appliedtolinktype', null, 'anyof', 'ShipRcpt'));
        var record = nlapiSearchRecord('itemfulfillment', null, filter, new nlobjSearchColumn('internalid', null, 'group'));
        if (record != null) {
            var colms = record[0].getAllColumns();
            for (var t = 0; t < record.length; t++) {
                itemfulfillment.push(record[t].getValue(colms[0]));
            }
            if (itemfulfillment.length > 0) {
                var uniqueitemfulfillment = itemfulfillment.filter(function(elem, pos) {
                    return itemfulfillment.indexOf(elem) == pos;
                });
                window.onbeforeunload = null;
                var linkURL = nlapiResolveURL('SUITELET', 'customscript_transfer_order_dashboard_v4', 'customdeploy_transfer_order_dashboard_v4', 'internal');
                linkURL = linkURL + '&Print=1&transfer_internalid=' + JSON.stringify(uniqueitemfulfillment);
                window.open(linkURL);
            }

        }


    }
}

function Incoming_Receive() {

    var Transfer_Order = [];
    var internal_array = new Array();
    for (var t = 1; t <= nlapiGetLineItemCount('custitem_list_incoming'); t++) {

        if (nlapiGetLineItemValue('custitem_list_incoming', 'custitem_incoming_recieve', t) == 'T') {
            var custitem_incoming_internalid_chk = nlapiGetLineItemValue("custitem_list_incoming", "custitem_incoming_internalid_chk", t);
            if (custitem_incoming_internalid_chk.length > 0) {
                Transfer_Order.push({
                    internalid: nlapiGetLineItemValue('custitem_list_incoming', 'custitem_incoming_internalid', t),
                    line_item: []
                });
            }

            Transfer_Order[Transfer_Order.length - 1].line_item.push({
                note: nlapiGetLineItemValue('custitem_list_incoming', 'custitem_incoming_custcol_notes', t),
                lineid: nlapiGetLineItemValue('custitem_list_incoming', 'custitem_incoming_line_number', t),
                custbody_to_box_num: nlapiGetLineItemValue('custitem_list_incoming', ' custitem_incoming_box_number', t)

            });
        }


    }

    if (Transfer_Order != null && Transfer_Order.length > 0) {

        for (var s = 0; s < Transfer_Order.length; s++) {
            var order = nlapiCreateRecord('customrecord_transfer_order_dashboard');
            order.setFieldValue('custrecord_transfer_order_receive', 'T');
            order.setFieldValue('custrecord_transfer_order_internal_id', Transfer_Order[s].internalid);
            order.setFieldValue('custrecord_internaldata', JSON.stringify(Transfer_Order[s].line_item));
            nlapiSubmitRecord(order, true, true);
        }
        window.onbeforeunload = null;
        var linkURL = nlapiResolveURL('SUITELET', 'customscript_transfer_order_dashboard', 'customdeploy_transfer_order_dashboard', 'internal');
        linkURL = linkURL + '&custpage_location=' + encodeURIComponent(JSON.stringify(nlapiGetFieldValue('custitem_location')));
        window.open(linkURL, "_self");
    }

}

function Outgoing_Print() {

    var Transfer_Order = [];
    for (var t = 1; t <= nlapiGetLineItemCount('custitem_list_outgoing'); t++) {

        var Transfer_Order_value = nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_tranid', t);
        if (Transfer_Order_value != '' && Transfer_Order_value != null) {
            Transfer_Order.push(nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_internalid', t));
        }
    }


    if (Transfer_Order != null && Transfer_Order.length > 0) {
        var uniqueTransfer_Order = Transfer_Order.filter(function(elem, pos) {
            return Transfer_Order.indexOf(elem) == pos;
        });
        window.onbeforeunload = null;
        var linkURL = nlapiResolveURL('SUITELET', 'customscript_transfer_order_dashboard_v4', 'customdeploy_transfer_order_dashboard_v4', 'internal');
        linkURL = linkURL + '&transfer_internalid=' + JSON.stringify(uniqueTransfer_Order);
        window.open(linkURL);
    }
}

function Outgoing_Print_Label() {
    window.open('https://' + window.location.host + '/app/accounting/print/printlabels.nl?printtype=integratedshippinglabel&method=print&title=Integrated+Shipping+Labels&whence=');
}

function Check_Outgoing_Fulfill(Transfer_ID, index) {
    for (var t = 1; t <= nlapiGetLineItemCount('custitem_list_outgoing'); t++) {
        if (t != index) {
            if (Transfer_ID == nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_internalid', t)) {
                if (nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_status', t) != 2) {
                    return false;
                }
            }
        }
    }
    return true;
}

function Outgoing_Fulfill() {
    var Transfer_Order = [];
    for (var t = 1; t <= nlapiGetLineItemCount('custitem_list_outgoing'); t++) {
        if (nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_status', t) == 2) {

            Transfer_ID = nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_internalid', t);
            //var flag = Check_Outgoing_Fulfill(Transfer_ID,t);
            if (Check_Outgoing_Fulfill(Transfer_ID, t)) {
                var custitem_outgoing_internalid_chk = nlapiGetLineItemValue("custitem_list_outgoing", "custitem_outgoing_internalid_chk", t);
                if (custitem_outgoing_internalid_chk.length > 0) {
                    Transfer_Order.push({
                        internalid: nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_internalid', t),
                        line_item: []
                    })

                }
                Transfer_Order[Transfer_Order.length - 1].line_item.push({
                    note: nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_custcol_notes', t),
                    lineid: nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_line_number', t),
                    custbody_to_box_num: nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_box', t),
                });
            }
        }
    }
    if (Transfer_Order != null && Transfer_Order.length > 0) {

        for (var s = 0; s < Transfer_Order.length; s++) {
            var order = nlapiCreateRecord('customrecord_transfer_order_dashboard');
            order.setFieldValue('custrecord_transfer_order_internal_id', Transfer_Order[s].internalid);
            order.setFieldValue('custrecord_internaldata', JSON.stringify(Transfer_Order[s].line_item));
            nlapiSubmitRecord(order, true, true);
        }
        window.onbeforeunload = null;
        var linkURL = nlapiResolveURL('SUITELET', 'customscript_transfer_order_dashboard', 'customdeploy_transfer_order_dashboard', 'internal');
        linkURL = linkURL + '&custpage_location=' + encodeURIComponent(JSON.stringify(nlapiGetFieldValue('custitem_location')));
        window.open(linkURL, "_self");

    }
}

function Outgoing_update() {
    var Array_line_item = new Array();
    var Array_box_number = new Array();
    var incoming_array_duplicate = new Array();
    for (var t = 1; t <= nlapiGetLineItemCount('custitem_list_outgoing'); t++) {
        var internal_id = nlapiGetLineItemValue("custitem_list_outgoing", "custitem_outgoing_internalid", t);
         if (nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_box', t) != nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_box_chk_new', t)) {
         //alert(nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_box', t));
            var custitem_outgoing_internalid_chk = nlapiGetLineItemValue("custitem_list_outgoing", "custitem_outgoing_internalid_chk", t);
           // alert('internal Id -'+custitem_outgoing_internalid_chk);
            if (custitem_outgoing_internalid_chk.length > 0) {
               
                Array_box_number.push({
                    internalid: internal_id,
                    box_number: nlapiGetLineItemValue("custitem_list_outgoing", "custitem_outgoing_box", t)
                });

            }
        }

        if (nlapiGetLineItemValue('custitem_list_outgoing', 'custitem_outgoing_deltete', t) == 'T') {

            if (incoming_array_duplicate.indexOf(internal_id) == -1) {
                Array_line_item.push({
                    internalid: internal_id,
                    order_id: nlapiGetLineItemValue("custitem_list_outgoing", "custitem_outgoing_tranid", t),
                    line_number: []
                });
                Array_line_item[Array_line_item.length - 1].line_number.push(nlapiGetLineItemValue("custitem_list_outgoing", "custitem_outgoing_line_number", t));
                incoming_array_duplicate.push(internal_id);
            } else {
                Array_line_item[Array_line_item.length - 1].line_number.push(nlapiGetLineItemValue("custitem_list_outgoing", "custitem_outgoing_line_number", t));

            }
        }
    }

    var not_delete_array = new Array();
    for (var s = 0; s < Array_line_item.length; s++) {
        var f_internalid = Array_line_item[s].internalid;
        var check_item = 0;
        for (var h = 1; h <= nlapiGetLineItemCount('custitem_list_outgoing'); h++) {
            var ff_internalid = nlapiGetLineItemValue("custitem_list_outgoing", "custitem_outgoing_internalid", h);
            if (ff_internalid == f_internalid) {
                check_item = parseInt(check_item) + 1;
                if (check_item > 1) {
                    break;
                }
            }
        }
        if (check_item == 1) {
            not_delete_array.push("The " + Array_line_item[s].order_id + " having one line item it can't be deleted");
        }

    }

    if (not_delete_array.length > 0) {
        alert(not_delete_array.join('\n '));
        return;
    }




    for (var s = 0; s < Array_line_item.length; s++) {
        var order = nlapiCreateRecord('customrecord_transfer_order_dashboard');
        order.setFieldValue('custrecord_delete_line_item', 'T');
        order.setFieldValue('custrecord_transfer_order_internal_id', Array_line_item[s].internalid);
        order.setFieldValue('custrecord_internaldata', JSON.stringify(Array_line_item[s].line_number));
        nlapiSubmitRecord(order, true, true);
    }
    if (Array_box_number.length > 0) {

        var order = nlapiCreateRecord('customrecord_transfer_order_dashboard');
        order.setFieldValue('custrecord_update_box', 'T');
        order.setFieldValue('custrecord_internaldata', JSON.stringify(Array_box_number));
        nlapiSubmitRecord(order, true, true);

    }


    if (Array_line_item.length > 0 || Array_box_number.length > 0) {
        window.onbeforeunload = null;
        var linkURL = nlapiResolveURL('SUITELET', 'customscript_transfer_order_dashboard', 'customdeploy_transfer_order_dashboard', 'internal');
        linkURL = linkURL + '&custpage_location=' + encodeURIComponent(JSON.stringify(nlapiGetFieldValue('custitem_location')));
        window.open(linkURL, "_self");
    }



}


function getRandomColor(length) {
    var colorArr = [];
    for (var z = 0; z < length; z++) {
        colorArr.push(getColor1());
    }
    return colorArr;
}

function getColor1() {
    function c() {
        var hex = Math.floor(Math.random() * 256).toString(16);
        return ("0" + String(hex)).substr(-2); // pad with zero
    }
    return "#" + c() + c() + c();
}

function Add_ID(span_id) {
    for (var x = 0; x < span_id.length; x++) {
        var elementID = document.getElementById(span_id);
        if (elementID != null && elementID != "") {
            elementID.id = "nextstep";
        }
    }
}