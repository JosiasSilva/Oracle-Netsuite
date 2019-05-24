function FraudHistoryCheck(type) {
    try {
        if (type == 'create') {
            RunFraudHistoryCheck();
        }
        else if (type == 'edit') {
            var old_obj = nlapiGetOldRecord();
            var old_name = old_obj.getFieldText("entity");
            var old_email = old_obj.getFieldValue("custbody2");
            var old_no = old_obj.getFieldValue("custbody8");
            var old_ship = old_obj.getFieldValue("shipaddress");
            var old_bill = old_obj.getFieldValue("billaddress");

            var new_obj = nlapiGetNewRecord();
            var new_name = new_obj.getFieldText("entity");
            var new_email = new_obj.getFieldValue("custbody2");
            var new_no = new_obj.getFieldValue("custbody8");
            var new_ship = new_obj.getFieldValue("shipaddress");
            var new_bill = new_obj.getFieldValue("billaddress");

            if ((new_name != old_name) || (new_email != old_email) || (new_no != old_no) || (new_ship != old_ship) || (new_bill != old_bill)) {

                RunFraudHistoryCheck();
            }
        }
        var h = 0;
    } catch (err) {
        nlapiLogExecution("error", "Error on Fraud History Check :", err.toString());
    }

}
function RunFraudHistoryCheck() {
    var recordId = nlapiGetRecordId();
	//var recordId ='7425717';// '7063269';//'27289'; 
    //var recordId = '7063269';//'27289'; sandbox
    var soFields = ['entity', 'custbody2', 'billaddress', 'shipaddress', 'custbody8'];
    var soRecord = nlapiLookupField('salesorder', recordId, soFields);
    var customerId = soRecord.entity;
    var custEmail = soRecord.custbody2;
    var custContactNo = soRecord.custbody8;

    var custFields = ['entityid', 'firstname', 'lastname', 'altemail', 'altname'];
    var custRecord = nlapiLookupField('customer', customerId, custFields);
    var firstName = custRecord.firstname;
    var lastName = custRecord.lastname;
    var custAltEmail = custRecord.altemail;
    var altName = custRecord.altname;
    var custName = firstName + ' ' + lastName;
    var entityNo = custRecord.entityid;

    var columns = new Array();
    columns.push(new nlobjSearchColumn('address1', 'billingAddress'));
    columns.push(new nlobjSearchColumn('zip', 'billingAddress'));
    columns.push(new nlobjSearchColumn('address1', 'shippingAddress'));
    columns.push(new nlobjSearchColumn('zip', 'shippingAddress'));
    var asd = nlapiSearchRecord('salesorder', null, new nlobjSearchFilter("internalid", null, "anyOf", recordId), columns);
    var custBillAdds = GetAddrsByReplacer(asd[0].getValue(columns[0])) + asd[0].getValue(columns[1]);
    var custShipadds = GetAddrsByReplacer(asd[0].getValue(columns[2])) + asd[0].getValue(columns[3]);

    //var fraudSearch = nlapiLoadSearch(null, 4175);  // for Sandbox
    var fraudSearch = nlapiLoadSearch(null, 4393);  //4228 for Production
    var resultset = fraudSearch.runSearch();
    var searchResultArr = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        if (resultslice != null && resultslice != '') {
            for (var rs in resultslice) {
                var allColm = resultslice[rs].getAllColumns();
                var soId = resultslice[rs].id;
                var soNo = resultslice[rs].getValue(allColm[2]);
                var custId = resultslice[rs].getValue(allColm[3]);
                var customerNameStr = resultslice[rs].getText(allColm[3]);
                var customerName = '';
                if (customerNameStr != '' && customerNameStr != null) {
                    customerName = customerNameStr.split(' ')[1] + ' ' + customerNameStr.split(' ')[2];

                }
                var billAdds = GetAddrsByReplacer(resultslice[rs].getValue(allColm[13])) + resultslice[rs].getValue(allColm[14]);
                var shipAdds = GetAddrsByReplacer(resultslice[rs].getValue(allColm[15])) + resultslice[rs].getValue(allColm[16]);
                var contactNo = resultslice[rs].getValue(allColm[10]);
                var email = resultslice[rs].getValue(allColm[11]);
                var emailAlt = resultslice[rs].getValue(allColm[12]);
                var PICK_UP_AT_BE = resultslice[rs].getValue(allColm[17]);

                searchResultArr.push({
                    soId: soId,
                    customerName: customerName,
                    contactNo: contactNo,
                    email: email,
                    emailAlt: emailAlt,
                    shipAdds: shipAdds,
                    billAdds: billAdds,
                    PICK_UP_AT_BE: PICK_UP_AT_BE

                });
                searchid++;
            }
        }
    } while (resultslice.length >= 1000);

    var fraudNameSOId = [];
    var fraudContactSOId = [];
    var fraudEmailSOId = [];
    var fraudBillAdsSOId = [];
    var tempfraudaddsSoId = [];
    var tempfraudemailSoId = [];

    for (var i = 0; i < searchResultArr.length; i++) {
        var old_soId = searchResultArr[i].soId;
        var old_custName = searchResultArr[i].customerName;
        var old_custContactNo = searchResultArr[i].contactNo;
        var old_custEmail = searchResultArr[i].email;
        var old_custemailAlt = searchResultArr[i].emailAlt;
        var old_custshipAdds = searchResultArr[i].shipAdds;
        var old_custbillAdds = searchResultArr[i].billAdds;

        if (check(custName, old_custName)) { nlapiLogExecution("debug", "Fraud History Name match", old_soId); fraudNameSOId.push(old_soId); }
        if (check(custContactNo, old_custContactNo)) { nlapiLogExecution("debug", "Fraud History Contact No. match", old_soId); fraudContactSOId.push(old_soId); }

        if (check(custEmail, old_custEmail)) { tempfraudemailSoId.push(old_soId); }
        if (check(custAltEmail, old_custemailAlt)) { tempfraudemailSoId.push(old_soId); }
        if (check(custEmail, old_custemailAlt)) { tempfraudemailSoId.push(old_soId); }
        if (check(custAltEmail, custEmail)) { tempfraudemailSoId.push(old_soId); }

        if (searchResultArr[i].PICK_UP_AT_BE == 'F') {
            if (check(custShipadds, old_custshipAdds)) { tempfraudaddsSoId.push(old_soId); }
            if (check(custShipadds, old_custbillAdds)) { tempfraudaddsSoId.push(old_soId); }
            if (check(custBillAdds, old_custshipAdds)) { tempfraudaddsSoId.push(old_soId); }
            if (check(custBillAdds, old_custbillAdds)) { tempfraudaddsSoId.push(old_soId); }
        }

    }


    fraudBillAdsSOId = remove_duplicates_safe(tempfraudaddsSoId);
    fraudEmailSOId = remove_duplicates_safe(tempfraudemailSoId);

    if (fraudNameSOId.length > 0 || fraudEmailSOId.length > 0 || fraudContactSOId.length > 0 || fraudBillAdsSOId.length > 0) {
        var history_check = '2'; // set Yes
        nlapiSubmitField("salesorder", recordId, ["custbody_name_match_past_order", "custbody_email_match_past_order", "custbody_phone_match_past_order", "custbody_address_match_past_order", "custbody_fraud_history_check"], [fraudNameSOId, fraudEmailSOId, fraudContactSOId, fraudBillAdsSOId, history_check])
        nlapiLogExecution("debug", "Fraud history check matched past sales order,record saved successfully", recordId);
    }

}

function remove_duplicates_safe(arr) {
    var obj = {};
    var arr2 = [];
    for (var i = 0; i < arr.length; i++) {
        if (!(arr[i] in obj)) {
            arr2.push(arr[i]);
            obj[arr[i]] = true;
        }
    }
    return arr2;

}

function GetAddrsByReplacer(billAdds) {
    var str = "";
if(billAdds!='' && billAdds!=null)
  {
billAdds =billAdds.replace(';','')
    billAdds = billAdds.toLowerCase().split(" ");
    for (var x = 0; x < billAdds.length; x++) {
        var address = billAdds[x];
        if (address != " ") {
            if (address == 'lane' || address == 'street' || address == 'street;' || address == 'st' || address == 'road' || address == 'rd' || address == 'ln' || address == 'boulevard' || address == 'blvd' || address == 'court' || address == 'avenue' || address == 'ave' || address == 'drive' || address == 'dr' || address == 'dr.' || address == 'terrace' || address == 'place') {

            }
            else {
                str += billAdds[x];
            }
        }

    }
   }
	str=(str.replace(/[\r\n\s]/g, "")).toUpperCase();
    return str;
}

function highlightFraudCheks(type, form) {
    try {
        if (type == 'view' || type == 'edit') {
            var recordId = nlapiGetRecordId(); //'764692'//
            var soFields = ['entity', 'custbody_name_match_past_order', 'custbody_email_match_past_order', 'custbody_phone_match_past_order', 'custbody_address_match_past_order'];
            var soRecord = nlapiLookupField('salesorder', recordId, soFields);
            var nameArr = soRecord.custbody_name_match_past_order;
            var emailArr = soRecord.custbody_email_match_past_order;
            var contactArr = soRecord.custbody_phone_match_past_order;
            var addressArr = soRecord.custbody_address_match_past_order;
            if (emailArr.length > 0) {
                var fieldAddingHighLight = form.addField("custpage_email_match_past_order", "inlinehtml", "email match past order");
                var fieldAddingHighLightValue = "<script type='text/javascript'>";
                fieldAddingHighLightValue += 'var node = document.getElementById("custbody_email_match_past_order_lbl_uir_label");';
                fieldAddingHighLightValue += 'node.parentNode.style.background="pink";';
                fieldAddingHighLightValue += "</script>";
                fieldAddingHighLight.setDefaultValue(fieldAddingHighLightValue);
                nlapiLogExecution("debug", "Fraud History Name Check Highlight Successfully", recordId);
            }
			
            if (nameArr.length > 0) {
                var fieldAddingHighLight = form.addField("custpage_name_match_past_order", "inlinehtml", "name match past order");
                var fieldAddingHighLightValue = "<script type='text/javascript'>";
                fieldAddingHighLightValue += 'var node = document.getElementById("custbody_name_match_past_order_lbl_uir_label");';
                fieldAddingHighLightValue += 'node.parentNode.style.background="pink";';
                fieldAddingHighLightValue += "</script>";
                fieldAddingHighLight.setDefaultValue(fieldAddingHighLightValue);
                nlapiLogExecution("debug", "Fraud History Name Check Highlight Successfully", recordId);
            }
            if (contactArr.length > 0) {
                var fieldAddingHighLight = form.addField("custpage_phone_match_past_order", "inlinehtml", "phone match past order");
                var fieldAddingHighLightValue = "<script type='text/javascript'>";
                fieldAddingHighLightValue += 'var node = document.getElementById("custbody_phone_match_past_order_lbl_uir_label");';
                fieldAddingHighLightValue += 'node.parentNode.style.background="pink";';
                fieldAddingHighLightValue += "</script>";
                fieldAddingHighLight.setDefaultValue(fieldAddingHighLightValue);
                nlapiLogExecution("debug", "Fraud History Phone Check Highlight Successfully", recordId);
            }
            if (addressArr.length > 0) {
                var fieldAddingHighLight = form.addField("custpage_address_match_past_order", "inlinehtml", "address match past order");
                var fieldAddingHighLightValue = "<script type='text/javascript'>";
                fieldAddingHighLightValue += 'var node = document.getElementById("custbody_address_match_past_order_lbl");';
                fieldAddingHighLightValue += 'node.parentNode.parentNode.style.background="pink";';
                fieldAddingHighLightValue += "</script>";
                fieldAddingHighLight.setDefaultValue(fieldAddingHighLightValue);
                nlapiLogExecution("debug", "Fraud History Address Check Highlight Successfully", recordId);
            }

        }
    } catch (err) {
        nlapiLogExecution("debug", "Error on Fraud History Checks", err.message);
    }

}



function check(new_value, old_value) {
    if (new_value != "" && old_value != "") {
        if (new_value == old_value) {
            return true;
        }
        else {
            return false;

        }
    }
    else {
        return false;
    }

}