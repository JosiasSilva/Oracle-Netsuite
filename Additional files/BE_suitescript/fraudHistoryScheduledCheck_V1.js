
function AutoFraudScheduledCheck() {
    try {
        //Capture Save Search Information		
        var mySearch = nlapiLoadSearch(null, 4416); //Save search id of current date SO list Production  Get new record
        // var mySearch = nlapiLoadSearch(null, 4215);// Sandbox Get new record
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
        nlapiLogExecution("debug", "Record Length : " + searchCount);
        if (searchresult && searchCount > 0) {
            for (var m = 0; m < searchresult.length; m++) {
                var Results = searchresult[m].getAllColumns();
                var soId = searchresult[m].getId();
                RunFraudHistoryCheck(soId);
            }
        }
    }
    catch (err) {
        nlapiLogExecution("error", "Error on getting sales order record from saved search is : " + err.message);
    }
}

function RunFraudHistoryCheck(recordId) {

    var soFields = ['entity', 'custbody2', 'billaddress', 'shipaddress', 'custbody8', 'custbody53'];
    var soRecord = nlapiLookupField('salesorder', recordId, soFields);
    var customerId = soRecord.entity;
    var custEmail = soRecord.custbody2;
    var custContactNo = soRecord.custbody8;
    var New_PICK_UP_AT_BE = soRecord.custbody53;



    var custFields = ['entityid', 'firstname', 'lastname', 'altemail', 'altname'];
    var custRecord = nlapiLookupField('customer', customerId, custFields);
    var firstName = custRecord.firstname;
    var lastName = custRecord.lastname;
    var custAltEmail = custRecord.altemail;
    var altName = custRecord.altname;
    var custName = firstName + ' ' + lastName;
    var entityNo = custRecord.entityid;
    var custBillAdds = '';
    var custShipadds = '';
    if (New_PICK_UP_AT_BE == 'F') {
        var columns = new Array();
        columns.push(new nlobjSearchColumn('address1', 'billingAddress'));
        columns.push(new nlobjSearchColumn('zip', 'billingAddress'));
        columns.push(new nlobjSearchColumn('address1', 'shippingAddress'));
        columns.push(new nlobjSearchColumn('zip', 'shippingAddress'));

        var asd = nlapiSearchRecord('salesorder', null, new nlobjSearchFilter("internalid", null, "anyOf", recordId), columns);
        custBillAdds = GetAddrsByReplacer(asd[0].getValue(columns[0])) + asd[0].getValue(columns[1]);
        custShipadds = GetAddrsByReplacer(asd[0].getValue(columns[2])) + asd[0].getValue(columns[3]);

    }

    //var fraudSearch = nlapiLoadSearch(null, 4216);  // for Sandbox
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
                if (recordId != soId) {
                    var soNo = resultslice[rs].getValue(allColm[2]);
                    var custId = resultslice[rs].getValue(allColm[3]);
                    var customerNameStr = resultslice[rs].getText(allColm[3]);
                    var customerName = '';
                    if (customerNameStr != '' && customerNameStr != null) {
                        customerName = customerNameStr.split(' ')[1] + ' ' + customerNameStr.split(' ')[2];
                    }
                    var billAdds = '';
                    var shipAdds = '';
                    if (New_PICK_UP_AT_BE == 'F') {
                        billAdds = GetAddrsByReplacer(resultslice[rs].getValue(allColm[13])) + resultslice[rs].getValue(allColm[14]);
                        shipAdds = GetAddrsByReplacer(resultslice[rs].getValue(allColm[15])) + resultslice[rs].getValue(allColm[16]);
                    }
                    var contactNo = resultslice[rs].getValue(allColm[10]);
                    var emailAlt = resultslice[rs].getValue(allColm[12]);
                    var PICK_UP_AT_BE = resultslice[rs].getValue(allColm[17]);

                    var old_soFields = ['entity', 'custbody2', 'billaddress', 'shipaddress', 'custbody8', 'custbody53'];
                    var old_soRecord = nlapiLookupField('salesorder', soId, old_soFields);
                    var email = old_soRecord.custbody2;

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

        if (check(custName, old_custName)) { nlapiLogExecution("debug", recordId + ' Name match with ' + old_soId, old_soId); fraudNameSOId.push(old_soId); }
        if (check(custContactNo, old_custContactNo)) { nlapiLogExecution("debug", recordId + ' Contact No match with ' + old_soId, old_soId); fraudContactSOId.push(old_soId); }

        if (check(custEmail, old_custEmail)) { nlapiLogExecution("debug", recordId + ' Email to Email match with ' + old_soId, old_soId); tempfraudemailSoId.push(old_soId); }
        if (check(custEmail, old_custemailAlt)) { nlapiLogExecution("debug", recordId + ' Email  to ALT Email match with ' + old_soId, old_soId); tempfraudemailSoId.push(old_soId); }
		if (check(custAltEmail, old_custEmail)) { nlapiLogExecution("debug", recordId + ' ALT Email to  Email match with ' + old_soId, old_soId); tempfraudemailSoId.push(old_soId); }
		if (check(custAltEmail, old_custemailAlt)) { nlapiLogExecution("debug", recordId + ' ALT Email to  ALT Email match with ' + old_soId, old_soId); tempfraudemailSoId.push(old_soId); }        
        

        if (searchResultArr[i].PICK_UP_AT_BE == 'F' && New_PICK_UP_AT_BE == 'F') {
            if (check(custShipadds, old_custshipAdds)) { nlapiLogExecution("debug", recordId + ' Ship to Ship match with ' + old_soId, old_soId); tempfraudaddsSoId.push(old_soId); }
            if (check(custShipadds, old_custbillAdds)) { nlapiLogExecution("debug", recordId + ' Ship to bill match with ' + old_soId, old_soId); tempfraudaddsSoId.push(old_soId); }
            if (check(custBillAdds, old_custshipAdds)) { nlapiLogExecution("debug", recordId + ' bill to Ship match with ' + old_soId, old_soId); tempfraudaddsSoId.push(old_soId); }
            if (check(custBillAdds, old_custbillAdds)) { nlapiLogExecution("debug", recordId + ' bill to bill match with ' + old_soId, old_soId); tempfraudaddsSoId.push(old_soId); }
        }

    }
    fraudBillAdsSOId = remove_duplicates_safe(tempfraudaddsSoId);
    fraudEmailSOId = remove_duplicates_safe(tempfraudemailSoId);

   // nlapiSubmitField("salesorder", recordId, ["custbody_name_match_past_order", "custbody_email_match_past_order", "custbody_phone_match_past_order", "custbody_address_match_past_order", "custbody_fraud_history_check"], [fraudNameSOId, fraudEmailSOId, fraudContactSOId, fraudBillAdsSOId, 2]);
    nlapiLogExecution("debug", "Fraud history check matched past sales order,record saved successfully", recordId);
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
    if (billAdds != '' && billAdds != null) {
        billAdds = billAdds.replace(';', '')
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
    str = (str.replace(/[\r\n\s]/g, "")).toUpperCase();
    return str;
}

function check(new_value, old_value) {
    if (new_value != "" && new_value != null && old_value != "" && old_value != null) {
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

