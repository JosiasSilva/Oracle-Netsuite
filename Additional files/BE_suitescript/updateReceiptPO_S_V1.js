function updateReceiptPO(request, response) {
    var k = 0; //added by ajay 08May 2017
    var requestData = request.getParameter("Purchase");
    var requestData_Multi = request.getParameter("MultiPurchase");
    if (requestData_Multi != null) {
        var PurchaseOrder_Multi = JSON.parse(requestData_Multi);
        for (var s = 0; s < PurchaseOrder_Multi.length; s++) {
            try {
                var PO_ID = PurchaseOrder_Multi[s].InternalId;
                var PO_Data = nlapiLoadRecord('purchaseorder', PO_ID);
                PO_Data.setLineItemValue("item", "custcoldiamondinscription", PurchaseOrder_Multi[s].LineID, PurchaseOrder_Multi[s].DIAMOND_INSCRIPTION);
                PO_Data.setLineItemValue("item", "custcol28", PurchaseOrder_Multi[s].LineID, PurchaseOrder_Multi[s].CERTIFICATE_INCLUDED);
                PO_Data.setFieldValue('custbody58', PurchaseOrder_Multi[s].IMPORTANT_NOTES);
                PO_Data.setFieldValue('custbody59', PurchaseOrder_Multi[s].DATE_NEEDED_IN_SF);
                nlapiSubmitRecord(PO_Data, true, true);
                var receipt = nlapiTransformRecord("purchaseorder", PurchaseOrder_Multi[s].InternalId, "itemreceipt");
                for (var x = 0; x < receipt.getLineItemCount("item"); x++) {
                    if (receipt.getLineItemValue("item", "location", x + 1) == null || receipt.getLineItemValue("item", "location", x + 1) == '') {
                        receipt.setLineItemValue("item", "location", x + 1, 2);
                    }
                    var reciptid = receipt.setLineItemValue("item", "itemreceive", x + 1, "T");
                    nlapiLogExecution('debug', 'itemreceipt', reciptid);
                }
                nlapiSubmitRecord(receipt, true, true);
            } catch (sd) {}
        }
        response.sendRedirect("SUITELET", "customscript_diamond_receive_dashboard", "customdeploy_diamond_receive_dashboard");
    } else {
        if (requestData != null) {
            var PurchaseOrder = JSON.parse(requestData);
            nlapiLogExecution('debug', 'Test', 'Object Done');
            try {
                var poID = PurchaseOrder[0].ID;
                var poObj = nlapiLoadRecord("purchaseorder", poID);
                poObj.setFieldValue('custbody129', PurchaseOrder[0].custbody129); //TO BE WATCHED
                poObj.setFieldValue('custbody200', PurchaseOrder[0].custbody200); //LOSS/REPLACEMENT ORDER
                poObj.setFieldValue('supervisorapproval', PurchaseOrder[0].supervisorapproval); // SUPERVISOR APPROVAL
                poObj.setFieldValue('trandate', PurchaseOrder[0].trandate); //DATE
                poObj.setFieldValue('location', PurchaseOrder[0].location); //Inventory location
                poObj.setFieldValue('incoterm', PurchaseOrder[0].incoterm); //INCOTERM
                poObj.setFieldValue('custbodyexpedite', PurchaseOrder[0].custbodyexpedite); // expedite  
                poObj.setFieldValue('custbody6', PurchaseOrder[0].custbody6); //DELIVERY DATE
                poObj.setFieldValue('custbody82', PurchaseOrder[0].custbody82); // DELIVERY DATE FIRMcustbody53
                poObj.setFieldValue('custbody53', PurchaseOrder[0].custbody53); // PICK UP AT BE
                poObj.setFieldValue('custbody_pickup_location', PurchaseOrder[0].custbody_pickup_location); //pickup location
                poObj.setFieldValue('custbody58', PurchaseOrder[0].custbody58);
                poObj.setFieldValue('custbody59', PurchaseOrder[0].custbody59); //DATE NEEDED IN SF 
                poObj.setFieldValue('department', PurchaseOrder[0].department); //department
                poObj.setFieldValue('custbody81', PurchaseOrder[0].custbody81); // DUE BY DATE FIRM
                poObj.setFieldValue('custbody83', PurchaseOrder[0].custbody83); // FOR STOCK?
                poObj.setFieldValue('memo', PurchaseOrder[0].memo); //memo
                poObj.setFieldValue('custbody146', PurchaseOrder[0].custbody146); //DIAMOND ETA
                poObj.setFieldValue('custbody_pot_backstock_ring_match', PurchaseOrder[0].custbody_pot_backstock_ring_match); //
                poObj.setFieldValue('custbody_pot_backstock_ring_match_item', PurchaseOrder[0].custbody_pot_backstock_ring_match_item);
                poObj.setFieldValue('custbody250', PurchaseOrder[0].custbody250); //DATE OF DD PUSH CONTACT		
                poObj.setFieldValue('custbodyvendor_email_notes', PurchaseOrder[0].custbodyvendor_email_notes);
                poObj.setFieldValue('custbody61', PurchaseOrder[0].custbody61); //MEMO STONES
                poObj.setFieldValue('custbody39', PurchaseOrder[0].custbody39); //DROP SHIP MATERIALS SENT TO VENDOR
                poObj.setFieldValue('custbody41', PurchaseOrder[0].custbody41); // DESIGN APPROVAL STATUS
                poObj.setFieldValue('custbody116', PurchaseOrder[0].custbody116); //CAD OR WAX DUE DATE   
                poObj.setFieldValue('custbody124', PurchaseOrder[0].custbody124); //CAD RX
                poObj.setFieldValue('custbody43', PurchaseOrder[0].custbody43); //DATE REVIEWED BY
                poObj.setFieldValue('custbody72', PurchaseOrder[0].custbody72); //QA NOTES
                //poObj.setFieldValue ('custbody73',PurchaseOrder[0].custbody73);  // comes in array list	QA PROBLEM

                poObj.setFieldValue('custbody88', PurchaseOrder[0].custbody88); //DATE RETURNED TO VENDOR
                poObj.setFieldValue('custbody195', PurchaseOrder[0].custbody195); //CAD IMAGE 1
                poObj.setFieldValue('custbody197', PurchaseOrder[0].custbody197); //CAD IMAGE 2
                poObj.setFieldValue('custbody198', PurchaseOrder[0].custbody198); //CAD IMAGE 3
                poObj.setFieldValue('custbody208', PurchaseOrder[0].custbody208); //DIAMOND RECEIVED BY VENDOR
                poObj.setFieldValue('custbody209', PurchaseOrder[0].custbody209); //DATE SHIPPED FROM VENDOR	
                poObj.setFieldValue('custbodywax_alloy_shipped_from_vendor', PurchaseOrder[0].custbodywax_alloy_shipped_from_vendor);
                poObj.setFieldValue('custbody103', PurchaseOrder[0].custbody103); //GEMSTONE STATUS
                poObj.setFieldValue('custbody104', PurchaseOrder[0].custbody104); //SALES REP
                poObj.setFieldValue('custbody213', PurchaseOrder[0].custbody213); //CENTER GEM NOTES/REVIEW
                poObj.setFieldValue('custbodydrop_ship_photo', PurchaseOrder[0].custbodydrop_ship_photo);
                poObj.setFieldValue('custbodydrop_ship_approved', PurchaseOrder[0].custbodydrop_ship_approved);
                poObj.setFieldValue('custbodytracking_number_vc', PurchaseOrder[0].custbodytracking_number_vc);
                poObj.setFieldValue('custbody217', PurchaseOrder[0].custbody217); //PRIORITY LEVEL
                poObj.setFieldValue('custbody236', PurchaseOrder[0].custbody236); //DATE OF RETURN - MELEE/SAPPHIRE
                poObj.setFieldValue('custbody233', PurchaseOrder[0].custbody233); //GG OWNER
                poObj.setFieldValue('custbody240', PurchaseOrder[0].custbody240); //DAYS TO SHIP
                poObj.setFieldValue('custbody243', PurchaseOrder[0].custbody243); //CERT RX'D AT SF
                poObj.setFieldValue('custbodycertificate_status', PurchaseOrder[0].custbodycertificate_status); //CERTIFICATE STATUS
                poObj.setFieldValue('custbody_inventory_transfer', PurchaseOrder[0].custbody_inventory_transfer); //
                poObj.setFieldValue('custbody258', PurchaseOrder[0].custbody258); //PD ESTIMATE NOTES
                //poObj.setFieldValue ('custbody_portal_status',PurchaseOrder[0].custbody_portal_status); // comes in array list PORTAL STATUS
                poObj.setFieldValue('custbody_ship_date1', PurchaseOrder[0].custbody_ship_date1); //NEW NS DATE FIELD TBD
                poObj.setFieldValue('custbody_tracking', PurchaseOrder[0].custbody_tracking);
                poObj.setFieldValue('custbody_comments', PurchaseOrder[0].custbody_comments);
                poObj.setFieldValue('custbody_ns_link', PurchaseOrder[0].custbody_ns_link);
                var PageItemCount = poObj.getLineItemCount('item');
                for (var d = 1; d <= PageItemCount; d++) {
                    var valueDe = true;
                    for (i = 0; i < PurchaseOrder[0].ItemData.length; i++) {
                        var Id_one = PurchaseOrder[0].ItemData[i].id;
                        var Id_two = poObj.getLineItemValue('item', 'id', d);
                        if (Id_one == Id_two) {
                            valueDe = false;
                            break;
                        }
                    }
                    if (valueDe) {
                        poObj.removeLineItem('item', d);
                    }
                    PageItemCount = poObj.getLineItemCount('item');
                }
                for (i = 0; i < PurchaseOrder[0].ItemData.length; i++) {
                    var id = PurchaseOrder[0].ItemData[i].id
                    var ChkValue = chkItem(poObj, id, PageItemCount);
                    try {
                        var ValueSet = PurchaseOrder[0].ItemData[i];

                        //Added by ajay 08May 2017
                        if (ValueSet.itemType == "InvtPart") {
                            var itemCat = nlapiLookupField("inventoryitem", ValueSet.item, "custitem20");
                            if (itemCat == "2" || itemCat == "3" || itemCat == "32" || itemCat == "36") {
                                if (PurchaseOrder[0].custbody83 == 'T') {
                                    k = 1;
                                }
                            }
                        }
                        //Ended by ajay 08May 2017
                        var index = ChkValue;
                        if (ChkValue == 0) {
                            poObj.selectNewLineItem('item');
                            poObj.setCurrentLineItemValue('item', 'item', ValueSet.item);
                            poObj.setCurrentLineItemValue('item', 'amount', ValueSet.amount);
                            poObj.setCurrentLineItemValue('item', 'quantity', ValueSet.quantity);
                            poObj.setCurrentLineItemValue('item', 'description', ValueSet.description);
                            poObj.setCurrentLineItemValue('item', 'custcol_full_insurance_value', ValueSet.custcol_full_insurance_value);
                            poObj.setCurrentLineItemValue('item', 'custcol5', ValueSet.custcol5);
                            poObj.setCurrentLineItemValue('item', 'custcol33', ValueSet.custcol33)
                            poObj.setCurrentLineItemValue('item', 'rate', ValueSet.rate);
                            poObj.setCurrentLineItemValue('item', 'units', ValueSet.units);
                            if (ValueSet.location == null || ValueSet.location == '') {
                                poObj.setCurrentLineItemValue('item', 'location', 2);
                            } else {
                                poObj.setCurrentLineItemValue('item', 'location', ValueSet.location);
                            }
                            poObj.setCurrentLineItemValue('item', 'custcol_vbd_int_notes', ValueSet.custcol_vbd_int_notes);
                            poObj.commitLineItem('item');
                        } else {
                            poObj.setLineItemValue('item', 'item', index, ValueSet.item);
                            poObj.setLineItemValue('item', 'amount', index, ValueSet.amount);
                            poObj.setLineItemValue('item', 'quantity', index, ValueSet.quantity);
                            poObj.setLineItemValue('item', 'description', index, ValueSet.description);
                            poObj.setLineItemValue('item', 'custcol_full_insurance_value', index, ValueSet.custcol_full_insurance_value);
                            poObj.setLineItemValue('item', 'custcol5', index, ValueSet.custcol5);
                            poObj.setLineItemValue('item', 'custcol33', index, ValueSet.custcol33)
                            poObj.setLineItemValue('item', 'rate', index, ValueSet.rate);
                            poObj.setLineItemValue('item', 'units', index, ValueSet.units);
                            if (ValueSet.location == null || ValueSet.location == '') {
                                poObj.setLineItemValue('item', 'location', index, 2);
                            } else {
                                poObj.setLineItemValue('item', 'location', index, ValueSet.location);
                            }
                            poObj.setLineItemValue('item', 'custcol_vbd_int_notes', index, ValueSet.custcol_vbd_int_notes);
                            poObj.commitLineItem('item');
                        }
                    } finally {}
                } //end of loop

                nlapiSubmitRecord(poObj, true, true);
                try {
                    //Added by ajay 08May 2017
                    var receipt = null;
                    if (k == 0) {
                        receipt = nlapiTransformRecord("purchaseorder", poID, "itemreceipt");
                        for (var x = 0; x < receipt.getLineItemCount("item"); x++) {
                            receipt.setLineItemValue("item", "itemreceive", x + 1, "T");
                        }
                        nlapiSubmitRecord(receipt, true, true);
                    } else if (k == 1) {
                        receipt = nlapiTransformRecord("purchaseorder", poID, "itemreceipt");
                        for (var x = 0; x < receipt.getLineItemCount("item"); x++) {
                            receipt.setLineItemValue("item", "itemreceive", x + 1, "T");
                            receipt.setLineItemValue("item", "location", x + 1, 29); //Temp Showroom
                        }
                        var irId = nlapiSubmitRecord(receipt, true, true);
                        UpdateItemReceipt(irId);
                    }
                    //Ended by ajay 08May 2017
                } catch (sdaa) {
                    nlapiLogExecution('debug', 'Test=1', sdaa.message);
                }
                nlapiSetRedirectURL('RECORD', 'purchaseorder', poID, false, null);

            } catch (sdaa) {
                nlapiLogExecution('debug', 'Test=111', sdaa.message);
            }
        } else {
            var Purchase_ID = request.getParameter("Purchase_ID");
            var PurchaseID = request.getParameter("PurchaseID");
            if (PurchaseID == null) {
                PurchaseID = Purchase_ID;
            }
            nlapiLogExecution('debug', 'Test=1', PurchaseID);
            if (PurchaseID != null && PurchaseID != "") {
                try {
                    /*var receipt = nlapiTransformRecord("purchaseorder",PurchaseID,"itemreceipt");
                    for(var x=0; x < receipt.getLineItemCount("item"); x++)
                    {
                    	receipt.setLineItemValue("item","itemreceive",x+1,"T");
                    }
                    nlapiSubmitRecord(receipt,true,true);*/
                    //Added by ajay 08May 2017
                    var purchObj = nlapiLoadRecord("purchaseorder", PurchaseID);
                    var forStock = purchObj.getFieldValue("custbody83");
                    var count = purchObj.getLineItemCount("item");
                    for (var m = 1; m <= count; m++) {
                        var itemType = purchObj.getLineItemValue("item", "itemtype", m);
                        var itemId = purchObj.getLineItemValue("item", "item", m);
                        if (itemType == "InvtPart") {
                            var itemCat = nlapiLookupField("inventoryitem", itemId, "custitem20");
                            if (itemCat == "2" || itemCat == "3" || itemCat == "32" || itemCat == "36") {
                                if (forStock == 'T') {
                                    k = 1;
                                    nlapiLogExecution("debug", "for temp showroom location");
                                    break;
                                }
                            }
                        }
                    }

                    var receipt = null;
                    if (k == 0) {
                        receipt = nlapiTransformRecord("purchaseorder", PurchaseID, "itemreceipt");
                        for (var x = 0; x < receipt.getLineItemCount("item"); x++) {
                            receipt.setLineItemValue("item", "itemreceive", x + 1, "T");
                        }
                        nlapiSubmitRecord(receipt, true, true);
                    } else if (k == 1) {
                        nlapiLogExecution("debug", "test ajay");
                        receipt = nlapiTransformRecord("purchaseorder", PurchaseID, "itemreceipt");
                        for (var x = 0; x < receipt.getLineItemCount("item"); x++) {
                            receipt.setLineItemValue("item", "itemreceive", x + 1, "T");
                            receipt.setLineItemValue("item", "location", x + 1, 29); //Temp Showroom
                        }
                        var irId = nlapiSubmitRecord(receipt, true, true);
                        UpdateItemReceipt(irId);
                    }
                    //Ended by ajay 08May 2017
                } catch (sd) {}
                if (Purchase_ID == null) {
                    nlapiSetRedirectURL('RECORD', 'purchaseorder', PurchaseID, false, null);
                } else {
                    response.sendRedirect("SUITELET", "customscript_diamond_receive_dashboard", "customdeploy_diamond_receive_dashboard");
                    //nlapiSetRedirectURL('RECORD', 'purchaseorder' ,PurchaseID,false,null);
                }
            }
        }
    }
}

function UpdateItemReceipt(irId) {
    var receipt = nlapiLoadRecord("itemreceipt", irId);
    for (var x = 0; x < receipt.getLineItemCount("item"); x++) {
        receipt.setLineItemValue("item", "itemreceive", x + 1, "T");
        receipt.setLineItemValue('item', 'location', x + 1, 29); //Temp Showroom                     
    }
    nlapiSubmitRecord(receipt);
    nlapiLogExecution("debug", "test ajay");
}

function chkItem(poObj, id, itemCount) {
    for (var s = 1; s <= itemCount; s++) {
        var Id_one = poObj.getLineItemValue('item', 'id', s);
        if (Id_one == id) {
            return s;
        }
    }
    return 0;
}