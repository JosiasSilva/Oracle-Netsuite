nlapiLogExecution("audit","FLOStart",new Date().getTime());
function Set_QA_Vendor(type) {
    if (type == "create" || type == "edit") {
        var internalid, sales_order_id, item_id, vendor_id, po_id, results, qa_vendor;

        try {
            //Get QA Record Internal ID
            internalid = nlapiGetRecordId()


        }
        catch (err) {
            nlapiLogExecution("error", "QA Vendor Set Error", "An error occurred getting QA record internal ID. Details: " + err.message)
            return
        }

        try {
            //Get QA Fields
            var filter = new nlobjSearchFilter("internalid", null, "is", internalid)
            var cols = new Array()
            cols.push(new nlobjSearchColumn("custrecord3")) //Sales Order
            cols.push(new nlobjSearchColumn("custrecord_item"))
            cols.push(new nlobjSearchColumn("custrecord_qa_vendor"))
            cols.push(new nlobjSearchColumn("custrecord1"))
            cols.push(new nlobjSearchColumn("custrecord2"))
            cols.push(new nlobjSearchColumn("custrecord_qa_notes"))
            cols.push(new nlobjSearchColumn("custrecordtype_of_qa"))
            cols.push(new nlobjSearchColumn("custrecord48"))
            cols.push(new nlobjSearchColumn("custrecord49"))
            cols.push(new nlobjSearchColumn("custrecord_date_needed"))
            cols.push(new nlobjSearchColumn("custrecord_drop_ship_to_ch"))
            cols.push(new nlobjSearchColumn("custrecord_delivery_by_date"))
            cols.push(new nlobjSearchColumn("custrecord_qa_po_number"))

            results = nlapiSearchRecord("customrecord32", null, filter, cols)
            if (results != null) {
                sales_order_id = results[0].getValue("custrecord3")
                item_id = results[0].getValue("custrecord_item")
                qa_vendor = results[0].getValue("custrecord_qa_vendor")
                qa_po_id = results[0].getValue("custrecord_qa_po_number")
                //Exit if sales order or item fields are empty
                //Exit if QA vendor field is already present   


                if (IsEmpty(sales_order_id) == "" || IsEmpty(item_id) == "")
                    return

                if (IsEmpty(qa_vendor) != "" && IsEmpty(qa_po_id) != "") {
                    nlapiLogExecution("debug", "QA PO ID Check :", qa_po_id);
                    QA_Page_Reform(qa_vendor, qa_po_id, results);
                    return
                }

            }
            else {
                //If QA record is not found then exit the script
                return
            }
        }
        catch (err) {
            nlapiLogExecution("error", "QA Vendor Set Error", "An error occurred while retrieving QA field values for QA record internal ID " + internalid + ". Details: " + err.message)
            return
        }

        try {
            //Find item vendor on sales order line item
            var filters = new Array()
            filters.push(new nlobjSearchFilter("internalid", null, "is", sales_order_id))
            filters.push(new nlobjSearchFilter("item", null, "is", item_id))
            filters.push(new nlobjSearchFilter("mainname", "purchaseorder", "noneof", "@NONE@"))
            var column = new Array()
            column[0] = new nlobjSearchColumn("mainname", "purchaseorder")
            column[1] = new nlobjSearchColumn("internalid", "purchaseorder")
            var results_trans = nlapiSearchRecord("transaction", null, filters, column)

            if (results_trans != null) {
                nlapiLogExecution("debug", "QATrans Check :", 'Check results_trans');
                vendor_id = results_trans[0].getValue("mainname", "purchaseorder")
                po_id = results_trans[0].getValue("internalid", "purchaseorder")
                nlapiLogExecution("debug", "QA PO ID Check :", po_id);
            }
            else {
                //If nothing is found then exit the script as there is no PO vendor to set
                return
            }
        }
        catch (err) {
            nlapiLogExecution("error", "QA Vendor Set Error", "An error occurred while retrieving QA record item vendor on sales order internal ID " + sales_order_id + ". Details: " + err.message)
            return
        }

        try {
            //Update the QA record with vendor information
            var qaRecord = nlapiLoadRecord("customrecord32", internalid)
            qaRecord.setFieldValue("custrecord_qa_vendor", vendor_id)
            //Added 6-28-2011 Set QA PO Number Field
            qaRecord.setFieldValue("custrecord_qa_po_number", po_id)
            nlapiSubmitRecord(qaRecord, false, true)
            nlapiLogExecution("debug", "QA vendor_id :", vendor_id);
            nlapiLogExecution("debug", "QA po_id :", po_id);
            if (IsEmpty(vendor_id) == "" || IsEmpty(po_id) == "")
                return
            else
                QA_Page_Reform(vendor_id, po_id, results);

        }
        catch (err) {
            nlapiLogExecution("error", "QA Vendor Set Error", "An error occurred while setting item vendor on QA record internal ID " + internalid + ". Details: " + err.message)
            return
        }
    }
}

function IsEmpty(value) {
    if (value == null)
        return ""
    else
        return value
}
function QA_Page_Reform(vendor_id, po_id, results) {
    try {
        //if(type == "edit"){
        var soId = nlapiGetFieldValue("custrecord3");
        nlapiLogExecution("debug", "SO Id is :", soId);
        var sendingBack = nlapiGetFieldValue("custrecord_sending_back");
        nlapiLogExecution("debug", "Sending Back value is :", sendingBack);
        //Function for calling to push PO record
        if (sendingBack) {
            UpdatePO_OnPortal(soId);
        }
        //}

        var date = new Date();
        var currentDate = nlapiDateToString(date);
        var qa_notes = currentDate + " : " + results[0].getValue("custrecord_qa_notes");
        var qa_problem = results[0].getValue("custrecord1");
        var dateSentBackToVendor = results[0].getValue("custrecord2"); //New Added
        var qa_type = results[0].getValue("custrecordtype_of_qa");
        var soId = results[0].getValue("custrecord3");
        var dateNeededFromLocal = results[0].getValue("custrecord48");
        var repairDesc = results[0].getValue("custrecord49");
        var dateNeededInSF = results[0].getValue("custrecord_date_needed");
        var dropshipDate = results[0].getValue("custrecord_drop_ship_to_ch");
        var deliveryDate = results[0].getValue("custrecord_delivery_by_date");
        var qa_problemName = results[0].getText("custrecord1");
        var name = results[0].getText("custrecord_item");
        var vendorEmail = '';
        var chkvalue = 0;
        vendorEmail = nlapiLookupField('vendor', vendor_id, 'email');
        if (IsEmpty(vendorEmail) == "")
            return

        var poInternalId = 0;
        var poNumber = po_id;
        var duplicateId = 0;
        nlapiLogExecution("debug", "sales order Id :", soId);
        nlapiLogExecution("debug", "QA Type :", qa_type);
        if (soId != '') {
            var filters = [];
            filters[0] = new nlobjSearchFilter('createdfrom', null, 'is', soId);
            var searchresults = nlapiSearchRecord('purchaseorder', null, filters, []);
            if (searchresults != null) {
                for (var i = 0; i < searchresults.length; i++) {
                    poInternalId = searchresults[i].id;
                    if (poInternalId != duplicateId) {
                        duplicateId = poInternalId;
                        switch (qa_type) {
                            case '1':      //QA with photo
                                UpdatePurchaseOrder(poInternalId, qa_notes, qa_problem); // po update with qa values
                                EmailSend(qa_type, poNumber, qa_problemName, qa_notes, name, dateNeededInSF, vendor_id, dropshipDate, deliveryDate, vendorEmail);
                                break;
                            case '2':      //QA with photo – Fixing at Local
                                UpdatePurchaseOrderLineItem(poInternalId, qa_notes, qa_problem, dateNeededFromLocal, repairDesc, qa_type); // po line item update with qa values
                                EmailSend(qa_type, poNumber, qa_problemName, qa_notes, name, dateNeededInSF, vendor_id, dropshipDate, deliveryDate, vendorEmail);
                                break;
                            case '3':      //Sendback
                                UpdatePurchaseOrderLineItem(poInternalId, qa_notes, qa_problem, dateNeededFromLocal, repairDesc, qa_type, dateSentBackToVendor); // po line item update with current date
                                EmailSend(qa_type, poNumber, qa_problemName, qa_notes, name, dateNeededInSF, vendor_id, dropshipDate, deliveryDate, vendorEmail);
                                break;
                            case '4':      //BE Error – Repair Needed
                                UpdatePurchaseOrderLineItem(poInternalId, qa_notes, qa_problem, dateNeededFromLocal, repairDesc, qa_type, dateSentBackToVendor); // po line item update with current date
                                EmailSend(qa_type, poNumber, qa_problemName, qa_notes, name, dateNeededInSF, vendor_id, dropshipDate, deliveryDate, vendorEmail);
                                break;
                            case '6':      //custom
                                UpdatePurchaseOrder(poInternalId, qa_notes, qa_problem); // po update with qa values
                                EmailSend(qa_type, poNumber, qa_problemName, qa_notes, name, dateNeededInSF, vendor_id, dropshipDate, deliveryDate, vendorEmail);
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }





    }
    catch (err) {
        nlapiLogExecution("error", "Error occur during creation/updation of QA page is :", err.message);
    }

}

//Purchase order sync with QA values
function UpdatePurchaseOrder(internalId, qa_notes, qa_problem) {
    nlapiLogExecution("debug", "QA Notes :", qa_notes);
    var status = nlapiLookupField("purchaseorder", internalId, "status");
    nlapiLogExecution("debug", "PO Status :", status);
    if (status == "fullyBilled" || status == "pendingBilling") {
        //nlapiSubmitField("purchaseorder",internalId,"custbody72",qa_notes);				  
        //nlapiSubmitField("purchaseorder",internalId,"custbody73",qa_problem);		
        nlapiSubmitField("purchaseorder", internalId, ["custbody72", "custbody73"], [qa_notes, qa_problem]);
        nlapiLogExecution("debug", "Submit PO Id :", internalId);
    }
}

//Purchase order line item values sync with QA values/current date
function UpdatePurchaseOrderLineItem(internalId, qa_notes, qa_problem, dateNeededFromLocal, repairDesc, qa_type, dateSentBackToVendor) {
    var count = 0;
    nlapiLogExecution("debug", "QA Notes :", qa_notes);
    var status = nlapiLookupField("purchaseorder", internalId, "status");
    nlapiLogExecution("debug", "PO Status :", status);
    var forStock = nlapiLookupField("purchaseorder", internalId, "custbody83");
    var poObj = nlapiLoadRecord("purchaseorder", internalId);

    if (qa_type == '2') {
        if (status == "fullyBilled" || status == "pendingBilling") {
            poObj.setFieldValue("custbody72", qa_notes);
            poObj.setFieldValue("custbody73", qa_problem);
            poObj.setFieldValue("custbody59", dateNeededFromLocal);
            count = poObj.getLineItemCount('item');
            for (var i = 1; i <= count; i++) {
                poObj.setLineItemValue("item", "description", i, repairDesc);
            }

            var id = nlapiSubmitRecord(poObj, true, true);
            nlapiLogExecution("debug", "Submit PO Id1 :", id);
        }
    }
    else if (qa_type == '3' || qa_type == '4') {
        poObj.setFieldValue("custbody88", dateSentBackToVendor);
        count = poObj.getLineItemCount('item');
        for (var i = 1; i <= count; i++) {
            poObj.setLineItemValue("item", "custcol18", i, nlapiDateToString(new Date()));
        }
        var id = nlapiSubmitRecord(poObj, true, true);
        nlapiLogExecution("debug", "Submit PO Id1 :", id);
        DeleteItemReceipt(internalId, forStock);
    }
}

function DeleteItemReceipt(Id, forStock) {
    var id = 0;
    var filters = [];
    filters[0] = new nlobjSearchFilter('createdfrom', null, 'is', Id);
    var searchresults = nlapiSearchRecord('itemreceipt', null, filters, []);
    if (searchresults != null) {
        id = searchresults[0].id;
        if (forStock == 'F') {
            nlapiDeleteRecord("itemreceipt", id);
            nlapiLogExecution("debug", "Item Receipt deleted successfully.");
        }
        else if (forStock == 'T') {
            var receiptObj = nlapiLoadRecord("itemreceipt", id);
            var count = receiptObj.getLineItemCount("item");
            if (count > 0) {
                for (var i = 1; i <= count; i++) {
                    receiptObj.removeLineItem('item', i);
                }
            }
            var receiptId = nlapiSubmitRecord(receiptObj, true, true);
        }
    }
}

//Send Email 
function EmailSend(qa_type, poNumber, qa_problem, qa_notes, name, dateNeededInSF, vendor_id, dropshipDate, deliveryDate, vendorEmail) {
    var item_obj = nlapiLoadRecord('PurchaseOrder', poNumber);
    var Vandor = checknull(item_obj.getFieldValue('billaddress'));
    var Ship_To = checknull(item_obj.getFieldValue('shipaddress'));
    var Date = checknull(item_obj.getFieldValue('trandate'));
    var Po = checknull(item_obj.getFieldValue('tranid'));
    var Ref = checknull(item_obj.getFieldValue('custbody33'));
    var Date_needed_in_SF = checknull(item_obj.getFieldValue('custbody59'));
    var Cad_or_Wax_Due_Date = checknull(item_obj.getFieldValue('custbody116'));
    var Due_by_Date_Firm = check(item_obj.getFieldValue('custbody81'));
    var To_Be_Watched = check(item_obj.getFieldValue('custbody129'));
    var Diamond_ETA = checknull(item_obj.getFieldValue('custbody146'));
    var Diamond_Received_by_Vendor = checknull(item_obj.getFieldValue('custbody208'));
    var Cert_Received_with_Diamond = '';
    var Date_Shipped_From_Vendor = checknull(item_obj.getFieldValue('custbody209'));
    var Center_Gem_NotesReview = checknull(item_obj.getFieldValue('custbody213'));
    var Wax_alloy_shipped_from_vendor = checknull(item_obj.getFieldValue('custbodywax_alloy_shipped_from_vendor'));
    var item_count = checknull(item_obj.getLineItemCount("item"));
    var table = ' <div> <style>body{margin: 0 auto; font-size: 12px; font-family: Verdana, Arial, Helvetica, sans-serif;}table{margin: 0 auto; float: none;}table address{font-size: 13px; font-style: normal;}.style2{color: #FFFFFF;}table td{padding: 2 px;}table.bott-row td{border: 1px solid #777; padding: 2px 4px;}</style> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td width="421" valign="top"> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td colspan="2" valign="top"><img src="brilliant-earth.png"/></td></tr><tr> <td valign="top"> <address> Brilliant Earth<br/> 26 O’Farrell Street<br/> 10th Floor<br/> San Francisco CA 94108<br/> United States </address> </td><td valign="top">&nbsp;</td></tr><tr> <td valign="top"> <strong>Vandor</strong><br/> ' + Vandor + ' </td><td valign="top"> <strong>Ship To </strong><br/>' + Ship_To + ' </td></tr></table> </td><td width="373" valign="top">&nbsp;</td><td width="384" valign="top"> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td colspan="2"><strong>Purchase Order</strong></td></tr><tr> <td>Date</td><td>' + Date + '</td></tr><tr> <td>Po#</td><td>' + Po + '</td></tr><tr> <td>Ref: </td><td>' + Ref + '</td></tr><tr> <td>Date needed in SF</td><td>' + Date_needed_in_SF + '</td></tr><tr> <td> Cad or Wax Due Date</td><td>' + Cad_or_Wax_Due_Date + '</td></tr><tr> <td> Due by Date Firm</td><td>' + Due_by_Date_Firm + '</td></tr><tr> <td>To Be Watched</td><td>' + To_Be_Watched + '</td></tr><tr> <td>Diamond ETA</td><td>' + Diamond_ETA + '</td></tr><tr> <td> Diamond Received by Vendor </td><td>' + Diamond_Received_by_Vendor + '</td></tr><tr> <td>Cert Received with Diamond </td><td>' + Cert_Received_with_Diamond + '</td></tr><tr> <td>Date Shipped From Vendor</td><td>' + Date_Shipped_From_Vendor + '</td></tr><tr> <td>Center Gem Notes/Review</td><td>' + Center_Gem_NotesReview + '</td></tr><tr> <td>Wax/alloy shipped from vendor</td><td>' + Wax_alloy_shipped_from_vendor + '</td></tr></table> </td></tr><tr> <td colspan="3"> <table width="100%" border="0" cellpadding="0" cellspacing="0" class="bott-row"> <tr> <td width="23%" bgcolor="#777777"><span class="style2">Item</span></td><td width="7%" align="right" bgcolor="#777777"><span class="style2"> Quantity </span></td><td width="23%" bgcolor="#777777"><span class="style2">Description </span></td><td width="7%" bgcolor="#777777"><span class="style2">Notes </span></td><td width="20%" bgcolor="#777777"><span class="style2">Date Sent from SF</span></td><td width="20%" bgcolor="#777777"><span class="style2">Full Insurance Value</span></td></tr>';

    for (var j = 1; j <= item_count ; j++) {
        var Item = checknull(item_obj.getLineItemValue("item", "item_display", j));
        var Quantity = checknull(item_obj.getLineItemValue("item", "quantity", j));
        var Description = checknull(item_obj.getLineItemValue("item", "custcol_line_description", j));
        var Notes = checknull(item_obj.getLineItemValue("item", "custcol18", j));
        var Date_Sent_from_SF = checknull(item_obj.getLineItemValue("item", "custcol18", j));
        var Full_Insurance_Value = checknull(item_obj.getLineItemValue("item", "custcol_full_insurance_value", j));
        table += '<tr> <td>' + Item + '</td><td align="right">' + Quantity + '</td><td> ' + Description + '</td><td>' + Notes + '</td><td>' + Date_Sent_from_SF + '</td><td>' + Full_Insurance_Value + '</td></tr>';
    }
    table += ' </table></td></tr></table> </div>';

    var fromId = nlapiGetUser(); //Authors' Internal ID
    var dropShip = '';
    var dropShipText = '';
    var day = 0;
    var newDate = '';
    var date1 = ''; var date2 = '';
    var deliveryDate1 = '';

    if (deliveryDate != null) {
        deliveryDate = nlapiStringToDate(deliveryDate);
        deliveryDate1 = nlapiDateToString(deliveryDate);
        day = deliveryDate.getDay();
        newDate = '';
        if (day >= 1 && day <= 5) {
            newDate = nlapiAddDays(deliveryDate, -1);
        }
        else if (day == 0 || day == 6) {
            newDate = nlapiAddDays(deliveryDate, -2);
        }
        else if (day == 0) {
            newDate = nlapiAddDays(deliveryDate, -3);
        }
        newDate = nlapiDateToString(newDate);
        date1 = newDate.split('/')[0] + '/' + newDate.split('/')[1];
        date2 = deliveryDate1.split('/')[0] + '/' + deliveryDate1.split('/')[1];
    }

    if (qa_type == 1 || qa_type == 2) {
        var subject = "QA Issue: Purchase Order " + poNumber;
        var body = '<p style="color:green;">QA issue not sending back, photo attached or will be sent.</p>' +
                   '<p style="color:green;">Description of problem(s): ' + qa_problem + '</p>' +
                   '<p style="color:green;">Notes: ' + qa_notes + '</p>' +
                   '<p style="color:green;">Item(s): ' + name + '</p>' +
                   '<p style="color:red;">If customer returns for this reason, vendor should repair at no cost to BE.</p>';
        body += table;
        nlapiLogExecution("debug", "Email has been sent to :" + vendorEmail);
    }
    else if (qa_type == 3) {
        if (dropshipDate != '') {
            dropShip = "Yes";
            dropShipText = "Drop ship on " + date1 + " for customer delivery on " + date2;
        }
        else {
            dropShip = "No";
            dropShipText = "Ship on " + date1 + " for delivery in SF on " + date2;
        }

        var subject = "QA Sendback: Purchase Order " + poNumber;
        var body = '<p style="color:green;">QA issue - items being sent back.</p>' +
				  '<p style="color:green;">Notes: ' + qa_notes + '</p>' +
				  //'<p style="color:red;">If customer returns for this reason, vendor should repair at no cost to BE.</p>'+
				  '<p style="color:green;">Description of problem(s): ' + qa_problem + '</p>' +
				  '<p style="color:green;">Item(s): ' + name + '</p>' +
				  '<p style="color:green;">Date Needed in SF: ' + dateNeededInSF + '</p>' +
				  '<p style="color:green;">Drop Ship: ' + dropShip + '</p>' +
				  '<p style="color:green;">' + dropShipText + '</p>';
        body += table;
        nlapiSendEmail(fromId, vendorEmail, subject, body, null, null, null, null);
        nlapiLogExecution("debug", "Email has been sent to :" + vendorEmail);
    }
    else if (qa_type == 4) {
        if (dropshipDate != '') {
            dropShip = "Yes";
            dropShipText = "Drop ship on " + date1 + " for customer delivery on " + date2;
        }
        else {
            dropShip = "No";
            dropShipText = "Ship on " + date1 + " for delivery in SF on " + date2;
        }

        var subject = "QA Issue: Purchase Order " + poNumber;
        var body = '<p style="color:green;">Brilliant Earth change request.</p>' +
				  '<p style="color:green;">Description of problem(s): ' + qa_problem + '</p>' +
				  '<p style="color:green;">Notes: ' + qa_notes + '</p>' +
				  '<p style="color:green;">Item(s): ' + name + '</p>' +
				  '<p style="color:green;">Date Needed in SF: ' + dateNeededInSF + '</p>' +
				  '<p style="color:green;">Drop Ship: ' + dropShip + '</p>' +
				  '<p style="color:green;">' + dropShipText + '</p>';
        body += table;
        nlapiSendEmail(fromId, vendorEmail, subject, body, null, null, null, null);
        nlapiLogExecution("debug", "Email has been sent to :" + vendorEmail);
    }
    else if (qa_type == 6) {

        var subject = "QA Issue: Purchase Order " + poNumber;
        var body = '<p style="color:green;">QA issue not sending back, photo not included.</p>' +
				  '<p style="color:green;">Description of problem(s): ' + qa_problem + '</p>' +
				  '<p style="color:green;">Notes: ' + qa_notes + '</p>' +
				  '<p style="color:green;">Item(s): ' + name + '</p>' +
				  '<p style="color:red;">If customer returns for this reason, vendor should repair at no cost to BE.</p>';
        body += table;
        nlapiSendEmail(fromId, vendorEmail, subject, body, null, null, null, null);
        nlapiLogExecution("debug", "Email has been sent to :" + vendorEmail);
    }
}

//-------------------------Push PO To Portal -----------------------------------

//Function that update PO on Portal
function UpdatePO_OnPortal(soId) {
    try {
        if (soId > 0) {
            var duplicatePO = 0;
            nlapiLogExecution("debug", "so id is : ", soId);
            var soObj = nlapiLoadRecord("salesorder", soId);
            for (var i = 1; i <= soObj.getLineItemCount("item") ; i++) {
                var poId = soObj.getLineItemValue("item", "createdpo", i);
                if (poId > 0) {
                    var poOnPortal = nlapiLookupField("purchaseorder", poId, "custbody_pushtoportal");
                    var revisedPoOnPortal = nlapiLookupField("purchaseorder", poId, "custbody_pushrevisedpo");
                    if (poOnPortal == 'T' && revisedPoOnPortal == 'F') {
                        if (duplicatePO != poId) {
                            PushPODataNSToPortal(poId);
                        }
                    }
                    else if (revisedPoOnPortal == 'T') {
                        if (duplicatePO != poId) {
                            PushRevisedPODataNSToPortal(poId);
                        }
                    }
                    duplicatePO = poId;
                }
            }
        }
    }
    catch (err) {
        nlapiLogExecution("debug", "Error raised during PO updation on portal is :" + err.message);
    }
}

function PushPODataNSToPortal(poId) {
    try {
        if (poId != '' && poId != null) {
            nlapiSubmitField("purchaseorder", poId, "custbody209", "");
            nlapiLogExecution('debug', 'PO Initiated to push on portal for POId :' + poId, poId);
            var POObj = nlapiLoadRecord("purchaseorder", poId);
            var PoStatus = 1; // none
            nlapiLogExecution("debug", "portal status is :" + PoStatus);
            var PortalStatus = '[' + PoStatus + ']';

            var transid = POObj.getFieldValue('tranid');
            var custbody_ship_date1 = POObj.getFieldValue('custbody_po_ship_date'); //NEW NS DATE FIELD TBD
            if (custbody_ship_date1 == '' || custbody_ship_date1 == null) // added by ajay(ship date)
            {
                custbody_ship_date1 = nlapiDateToString(new Date());
            }

            var custbody146 = POObj.getFieldValue('custbody146');// Diamond ETA   
            if (custbody146 == '' || custbody146 == null) {
                custbody146 = null;
            }
            var custbody39 = POObj.getFieldValue('custbody39'); // DROP SHIP MATERIALS SENT TO VENDOR
            if (custbody39 == '' || custbody39 == null) {
                custbody39 = 'F';
            }
            else {
                custbody39 = 'T';
            }
            var custbody116 = POObj.getFieldValue('custbody116'); // CAD OR WAX DUE DATE
            if (custbody116 == '' || custbody116 == null) {
                custbody116 = null;
            }
            var custbody209 = POObj.getFieldValue('custbody209');  //  Date shippend from vendor
            if (custbody209 == '' || custbody209 == null) {
                custbody209 = null;
            }
            var custbody6 = POObj.getFieldValue('custbody6'); // DELIVERY DATE
            if (custbody6 == '' || custbody6 == null) {
                custbody6 = nlapiDateToString(new Date());
            }
            var custbody129 = POObj.getFieldValue('custbody129'); //   TO BE WATCHED
            var custbody58 = POObj.getFieldValue('custbody58'); //  Important Notes/ SO Notes
            if (custbody58 == '' || custbody58 == null) {
                custbody58 = "";
            }

            var custbody41 = POObj.getFieldValue('custbody41'); //DESIGN APPROVAL STATUS
            var custbody_tracking = POObj.getFieldValue('custbody_tracking'); //TRACKING
            var custbody_comments = POObj.getFieldValue('custbody_comments'); //COMMENTS

            var certificate_status = POObj.getFieldValue('custbodycertificate_status'); //CERTIFICATE STATUS
            if (certificate_status == '' || certificate_status == null) {
                certificate_status = null;
            }
            var VendorId = POObj.getFieldValue('entity');
            var itemCount = POObj.getLineItemCount("item");
            var IteArray = new Array();
            var CategoryId;
            for (var i = 1 ; i <= itemCount  ; i++) {
                var itemType = POObj.getLineItemValue("item", "itemtype", i);
                var isLooseDiamond = 'F';
                if (itemType == "InvtPart") {
                    var invItemId = POObj.getLineItemValue("item", "item", i);
                    CategoryId = nlapiLookupField("inventoryitem", invItemId, "custitem20");
                    if (CategoryId == '7') {
                        isLooseDiamond = 'T';
                    }
                }
                var item = POObj.getLineItemValue("item", "item", i);
                var item_name = POObj.getLineItemValue("item", "item_display", i);
                var vendorCode = POObj.getLineItemValue("item", "vendorname", i);
                var itemlink = POObj.getLineItemValue("item", "custcolitem_link_display", i);
                if (itemlink == '' || itemlink == null) {
                    itemlink = ""; // not accepting null
                }
                var itemDesc = POObj.getLineItemValue("item", "description", i);
                if (itemDesc == '' || itemDesc == null) {
                    itemDesc = ""; // not accepting null
                }
                var itemNotes = POObj.getLineItemValue("item", "custcol5", i);

                if (itemNotes == '' || itemNotes == null) {
                    itemNotes = "";
                }
                var certificate_included = POObj.getLineItemValue("item", "custcol28", i);
                if (certificate_included == '' || certificate_included == null) {
                    certificate_included = null;
                }
                var itemInsVal = POObj.getLineItemValue("item", "custcol_full_insurance_value", i);
                if (itemInsVal == '' || itemInsVal == null) {
                    itemInsVal = 0;
                }
                var dt_sentFrom_sf = POObj.getLineItemValue("item", "custcol18", i);
                if (dt_sentFrom_sf == '' || dt_sentFrom_sf == null)// Added by ajay
                {
                    dt_sentFrom_sf = null;
                }

                var ObjItem = {
                    "item_id": parseInt(item),
                    "item": (vendorCode != '' && vendorCode != null) ? vendorCode : item_name,
                    "description": itemDesc,
                    "notes": itemNotes,
                    "insurance_value": itemInsVal,
                    "itemlink": itemlink,
                    "date_sent_from_sf": dt_sentFrom_sf,
                    "loose_diamond": isLooseDiamond,
                    "certificate_included": certificate_included
                };
                IteArray.push(ObjItem);
            }
            var objJSON =
							{
							    "po_id": poId,
							    "portal_status": PortalStatus,
							    "transaction_id": transid,
							    "items": IteArray,
							    "ship_date": custbody_ship_date1,
							    "diamond_eta": custbody146,
							    "drop_ship": custbody39,
							    "cad_due_date": custbody116,
							    "date_shipped_from_vendor": custbody209,
							    "delivery_date": custbody6,
							    "to_be_watched": custbody129,
							    "so_notes": custbody58,
							    "pro_vendor": parseInt(VendorId),
							    "wait_cad": custbody41,
							    "certificate_status": certificate_status,
							    "is_qa": true
							};
        }
        //Setting up URL of CDP             
        var url = "https://partner.brilliantearth.com/api/production/po/";

        //Setting up Headers 
        var headers = new Array();
        headers['http'] = '1.1';
        headers['Accept'] = 'application/json';
        headers['Authorization'] = 'token d499ecd8233123cacd3c5868939fe167b7bf0837';
        headers['Content-Type'] = 'application/json';
        headers['User-Agent-x'] = 'SuiteScript-Call';

        //Stringifying JSON
        var myJSONText = JSON.stringify(objJSON, replacer);
        nlapiLogExecution('debug', 'PO Response Body as NS Input:', myJSONText);
        var response1 = nlapiRequestURL(url, myJSONText, headers);
        nlapiLogExecution('debug', 'PO Response Body as Portal Output:', response1.body);
        //Below is being used to put a breakpoint in the debugger	

        if (response1.code == 200) {
            nlapiLogExecution("debug", "PO successfully pushed to Portal.");
            try {
                var responsebody = JSON.parse(response1.getBody());
                var portalStatus = responsebody["portal_status"];
                nlapiSubmitField('purchaseorder', poId, ['custbody_pushtoportal', 'custbody_portal_status'], ['T', portalStatus]);
            }
            catch (err)
            { }
        }
        else {
            nlapiLogExecution("debug", "Portal response is : ", response1.body);
        }// end check of response.code
    }
    catch (err) {
        nlapiLogExecution("debug", "Error occur during POID Push from NS to portal is : ", err.message);
    }
}


function PushRevisedPODataNSToPortal(poId) {
    try {
        //nlapiLogExecution('debug','PO Initiated to push on portal for POId:'+poId , poId);			

        if ((poId != '' && poId != null)) {
            nlapiSubmitField("purchaseorder", poId, "custbody209", "");
            nlapiLogExecution('debug', 'PO Initiated to push on portal for POId :' + poId, poId);
            var POObj = nlapiLoadRecord("purchaseorder", poId);
            var PoStatus = 1; // none
            nlapiLogExecution("debug", "portal status is :" + PoStatus);
            var PortalStatus = '[' + PoStatus + ']';

            var transid = POObj.getFieldValue('tranid');
            var custbody_ship_date1 = POObj.getFieldValue('custbody_po_ship_date'); //NEW NS DATE FIELD TBD
            if (custbody_ship_date1 == '' || custbody_ship_date1 == null) // added by ajay(ship date)
            {
                custbody_ship_date1 = nlapiDateToString(new Date());
            }

            var custbody146 = POObj.getFieldValue('custbody146');// Diamond ETA   
            if (custbody146 == '' || custbody146 == null) {
                custbody146 = null;
            }
            var custbody39 = POObj.getFieldValue('custbody39');   // DROP SHIP MATERIALS SENT TO VENDOR
            if (custbody39 == '' || custbody39 == null) {
                custbody39 = 'F';
            }
            else {
                custbody39 = 'T';
            }
            var custbody116 = POObj.getFieldValue('custbody116'); // CAD OR WAX DUE DATE
            if (custbody116 == '' || custbody116 == null) {
                custbody116 = null;
            }
            var custbody209 = POObj.getFieldValue('custbody209');  //  Date shippend from vendor
            if (custbody209 == '' || custbody209 == null) {
                custbody209 = null;
            }
            var custbody6 = POObj.getFieldValue('custbody6'); // DELIVERY DATE
            if (custbody6 == '' || custbody6 == null) {
                custbody6 = nlapiDateToString(new Date());
            }
            var custbody129 = POObj.getFieldValue('custbody129'); //   TO BE WATCHED
            var custbody58 = POObj.getFieldValue('custbody58'); //  Important Notes/ SO Notes
            if (custbody58 == '' || custbody58 == null) {
                custbody58 = "";
            }

            var custbody41 = POObj.getFieldValue('custbody41'); //  DESIGN APPROVAL STATUS
            var custbody_tracking = POObj.getFieldValue('custbody_tracking'); //TRACKING
            var custbody_comments = POObj.getFieldValue('custbody_comments'); //COMMENTS

            var certificate_status = POObj.getFieldValue('custbodycertificate_status'); // CERTIFICATE STATUS
            if (certificate_status == '' || certificate_status == null) {
                certificate_status = null;
            }
            var VendorId = POObj.getFieldValue('entity');
            var itemCount = POObj.getLineItemCount("item");
            var IteArray = new Array();
            var CategoryId;
            for (var i = 1 ; i <= itemCount  ; i++) {
                var itemType = POObj.getLineItemValue("item", "itemtype", i);
                var isLooseDiamond = 'F';
                if (itemType == "InvtPart") {
                    var invItemId = POObj.getLineItemValue("item", "item", i);
                    CategoryId = nlapiLookupField("inventoryitem", invItemId, "custitem20");
                    if (CategoryId == '7') {
                        isLooseDiamond = 'T';
                    }
                }
                var item = POObj.getLineItemValue("item", "item", i);
                var item_name = POObj.getLineItemValue("item", "item_display", i);
                var vendorCode = POObj.getLineItemValue("item", "vendorname", i);
                var itemlink = POObj.getLineItemValue("item", "custcolitem_link_display", i);
                if (itemlink == '' || itemlink == null) {
                    itemlink = ""; // not accepting null
                }
                var itemDesc = POObj.getLineItemValue("item", "description", i);
                if (itemDesc == '' || itemDesc == null) {
                    itemDesc = ""; // not accepting null
                }
                var itemNotes = POObj.getLineItemValue("item", "custcol5", i);
                nlapiLogExecution("debug", "item notes is : ", itemNotes);
                if (itemNotes == '' || itemNotes == null) {
                    itemNotes = "";
                }
                var certificate_included = POObj.getLineItemValue("item", "custcol28", i);
                if (certificate_included == '' || certificate_included == null) {
                    certificate_included = null;
                }
                var itemInsVal = POObj.getLineItemValue("item", "custcol_full_insurance_value", i);
                if (itemInsVal == '' || itemInsVal == null) {
                    itemInsVal = 0;
                }
                var dt_sentFrom_sf = POObj.getLineItemValue("item", "custcol18", i);
                if (dt_sentFrom_sf == '' || dt_sentFrom_sf == null)// Added by ajay
                {
                    dt_sentFrom_sf = null;
                }
                var ObjItem = {
                    "item_id": parseInt(item),
                    "item": (vendorCode != '' && vendorCode != null) ? vendorCode : item_name,
                    "description": itemDesc,
                    "notes": itemNotes,
                    "insurance_value": itemInsVal,
                    "itemlink": itemlink,
                    "date_sent_from_sf": dt_sentFrom_sf,
                    "loose_diamond": isLooseDiamond,
                    "certificate_included": certificate_included
                };
                IteArray.push(ObjItem);
            }
            var objJSON =
                {
                    "po_id": poId,
                    "portal_status": PortalStatus,
                    "transaction_id": transid,
                    "items": IteArray,
                    "ship_date": custbody_ship_date1,
                    "diamond_eta": custbody146,
                    "drop_ship": custbody39,
                    "cad_due_date": custbody116,
                    "date_shipped_from_vendor": custbody209,
                    "delivery_date": custbody6,
                    "to_be_watched": custbody129,
                    "so_notes": custbody58,
                    "pro_vendor": parseInt(VendorId),
                    "wait_cad": custbody41,
                    "certificate_status": certificate_status,
                    "is_qa": true
                };
        }
        //Setting up URL of CDP             
        var url = "https://partner.brilliantearth.com/api/production/revised-po/";

        //Setting up Headers 
        var headers = new Array();
        headers['http'] = '1.1';
        headers['Accept'] = 'application/json';
        headers['Authorization'] = 'token d499ecd8233123cacd3c5868939fe167b7bf0837';
        headers['Content-Type'] = 'application/json';
        headers['User-Agent-x'] = 'SuiteScript-Call';

        //Stringifying JSON
        var myJSONText = JSON.stringify(objJSON, replacer);
        nlapiLogExecution('debug', 'PO Response Body as NS Input:', myJSONText);
        var response1 = nlapiRequestURL(url, myJSONText, headers);
        //Below is being used to put a breakpoint in the debugger					  
        if (response1.code == 200) {
            var responsebody = JSON.parse(response1.getBody());
            var portalStatus = responsebody["portal_status"];
            nlapiLogExecution("debug", "Revised PO successfully pushed to Portal.");
            try {
                nlapiSubmitField('purchaseorder', poId, ['custbody_portal_status', 'custbody_pushrevisedpo'], [portalStatus, 'T']);
            }
            catch (err) {
            }
        }
        else {
            nlapiLogExecution("debug", response1.body);
        }// end check of response.code
    }
    catch (err) {
        nlapiLogExecution("debug", "Error occur during revised POID Push from NS to portal is : ", err.message);
    }
}

function replacer(key, value) {
    if (typeof value == "number" && !isFinite(value)) {
        return String(value);
    }
    return value;
}

function check(Text) {
    if (Text == 'T') {
        return 'Yes';
    }
    else if (Text == 'F') {
        return 'No';
    }
    else if (Text == null) {
        return '';
    }
    else {
        return '';
    }
}


function checknull(str) {
    if (str == null) {
        return "";
    }
    else {
        return str;
    }
}


