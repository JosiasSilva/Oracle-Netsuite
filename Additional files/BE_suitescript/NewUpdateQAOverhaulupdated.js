function Set_QA_OrderDetail(type) {
    try {
        nlapiLogExecution("debug", "Event type for updation of QA Order Detail is : ", type);
        var update_qa_order_status_array = new Array();

        if (type == "approve") {
            status();
            //End Main loop condition			
        } //Ended condition of event type
        else if (type == "edit") {

            update_qa_order_status_array = new Array();
            var recordType = nlapiGetRecordType();
            if (recordType == "salesorder")
				{
                var oldStatus = nlapiGetOldRecord().getFieldValue("orderstatus");
				var newStatus = nlapiGetNewRecord().getFieldValue("orderstatus");
				nlapiLogExecution("debug","Old Order Status is : "+oldStatus );
                nlapiLogExecution("debug","New Order Status is : "+newStatus );
                if (oldStatus == 'A' && newStatus =='B') {
                    status();
                }
            }
            if (recordType == "purchaseorder") {
                var poId = nlapiGetRecordId();
                var createdFromId = nlapiLookupField("purchaseorder", poId, "createdfrom");
                var createdFromText = nlapiLookupField("purchaseorder", poId, "createdfrom", true);
                //Logic 3.Preset
                if (createdFromText != null && createdFromText != "" && createdFromText != "undefined") {
                    if (createdFromText.indexOf("Work Order") > -1) {
                        var memo = nlapiLookupField("workorder", createdFromId, "memo").toLowerCase();
                        if (memo != null && memo != "" && memo != "undefined") {
                            if (memo.indexOf("preset") > -1) {
                                update_qa_order_status_array.push(3);
                                try {
                                    update_qa_order_status_array = update_qa_order_status_array.sort();
                                    nlapiSubmitField("purchaseorder", poId, "custbody_qa_order_details", update_qa_order_status_array);
                                    nlapiLogExecution("debug", "Successfully Update QA Order Detail of PO Id is : " + poId);
                                } catch (e) {
                                    nlapiLogExecution("debug", e.getCode(), e.getDetails());
                                }
                            }
                        }
                    }
                } //End 3.Preset
            } //End record type
        } //Ended condition of event type
        else if (type == "create") {
            var recordType = nlapiGetRecordType();
            if (recordType == "workorder") {
                var woId = nlapiGetRecordId();
                //Logic 3.Preset								
                //var memo = nlapiLookupField("workorder",woId,"memo").toLowerCase();
                var workObj = nlapiLoadRecord("workorder", woId);
                var memo = workObj.getFieldValue("memo").toLowerCase();
                for (var i = 1; i <= workObj.getLineItemCount("item") ; i++) {
                    update_qa_order_status_array = new Array();
                    var poId = workObj.getLineItemValue("item", "poid", i);
                    if (poId > 0) {
                        if (memo != null && memo != "" && memo != "undefined") {
                            if (memo.indexOf("preset") > -1) {
                                update_qa_order_status_array.push(3);
                                try {
                                    update_qa_order_status_array = update_qa_order_status_array.sort();
                                    nlapiSubmitField("purchaseorder", poId, "custbody_qa_order_details", update_qa_order_status_array);
                                    nlapiLogExecution("debug", "Successfully Update QA Order Detail of PO Id is : " + poId);
                                } catch (e) {
                                    nlapiLogExecution("debug", e.getCode(), e.getDetails());
                                }
                            }
                        } //End memo condition
                    } //End PO condition
                } //End 3.Preset
            } //End record type
        } //End event type
    } catch (err) {
        nlapiLogExecution("debug", "Error raise during updation of QA Order Detail field on PO is :", err.message);
    }
}


function status() {

    var soId = nlapiGetRecordId(); // internal Id of SO
    var soObj = nlapiLoadRecord("salesorder", soId);
    var match = 0;
    for (var n = 1; n <= soObj.getLineItemCount("item") ; n++) {
        update_qa_order_status_array = new Array();
        var poId = soObj.getLineItemValue("item", "createdpo", n);
        if (poId != "" && poId != null) {
            nlapiLogExecution("debug", "Created PO Id is : ", poId);
            var createdFromText = nlapiLookupField("purchaseorder", poId, "createdfrom", true);
            var poObj = nlapiLoadRecord("purchaseorder", poId);
			
			//vendor condition
						   var voId=poObj.getFieldValue("entity");
							  if(voId!='' && voId!=null)
							  {
								  nlapiLogExecution("debug","Created Vendor Id is : ",voId);
								  
								  var typeOfContact=nlapiLookupField('vendor',voId,'custentity4');
								  if(typeOfContact==6)
								  {

            //1.Logic for SO contains another ring
            for (var i = 1; i <= soObj.getLineItemCount("item") ; i++) {
                var itemMatch = 0;
                var soItem = soObj.getLineItemValue("item", "item", i);
                var soItemType = soObj.getLineItemValue("item", "itemtype", i);
                for (var j = 1; j <= poObj.getLineItemCount("item") ; j++) {
                    var poItem = poObj.getLineItemValue("item", "item", j);
                    if (soItemType == "InvtPart") {
                        var soItemCategory = nlapiLookupField("inventoryitem", soItem, "custitem20");
                        if (soItemCategory == 2 || soItemCategory == 3 || soItemCategory == 35 || soItemCategory == 36) //ring item condition
                        {
                            if (soItem != poItem) {
                                itemMatch++;
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
                if (itemMatch == poObj.getLineItemCount("item")) {
                    for (var p = 0; p < update_qa_order_status_array.length; p++) {
                        if (update_qa_order_status_array[p] == 1) {
                            match++;
                        }
                    }
                    if (match == 0) {
                        update_qa_order_status_array.push(1);
                        break;
                    }
                }
            } //End 1. condition

            //Logic 2.Engraving Needed					
            match = 0;
            for (var i = 1; i <= soObj.getLineItemCount("item") ; i++) {
                var soItemName = soObj.getLineItemValue("item", "item_display", i);
                //var soItemType = soObj.getLineItemValue("item","itemtype",i);
                if (soItemName != null && soItemName != "" && soItemName != "undefined") {
                    if (soItemName.indexOf("Engrave Ring") > -1) {
                        for (var p = 0; p < update_qa_order_status_array.length; p++) {
                            if (update_qa_order_status_array[p] == 2) {
                                match++;
                            }
                        }
                        if (match == 0) {
                            update_qa_order_status_array.push(2);
                            break;
                        }
                    }
                }
            } //End 2.Engraving Needed			


            //Logic 4.Custom Design Purchase Order
            var po_customform = nlapiLookupField("purchaseorder", poId, "customform");
            if (po_customform == 155) {
                update_qa_order_status_array.push(4);
            }
            //End 4.Custom
            //Logic 5.Modified
            match = 0;
            for (var i = 1; i <= poObj.getLineItemCount("item") ; i++) {
                var itemDesc = poObj.getLineItemValue("item", "description", i).toLowerCase();
                if (itemDesc != null && itemDesc != "" && itemDesc != "undefined") {
                    if (itemDesc.indexOf("modified") > -1) {
                        for (var p = 0; p < update_qa_order_status_array.length; p++) {
                            if (update_qa_order_status_array[p] == 5) {
                                match++;
                            }
                        }
                        if (match == 0) {
                            update_qa_order_status_array.push(5);
                            break;
                        }
                    }
                }
            } //End 5.Modified
            //Logic 6.Eternity/Luxe
            match = 0;
            for (var i = 1; i <= poObj.getLineItemCount("item") ; i++) {
                var itemDesc = poObj.getLineItemValue("item", "description", i).toLowerCase();
                if (itemDesc != null && itemDesc != "" && itemDesc != "undefined") {
                    if (itemDesc.indexOf("eternity") > -1 || itemDesc.indexOf("luxe") > -1) {
                        for (var p = 0; p < update_qa_order_status_array.length; p++) {
                            if (update_qa_order_status_array[p] == 6) {
                                match++;
                            }
                        }
                        if (match == 0) {
                            update_qa_order_status_array.push(6);
                            break;
                        }
                    }
                }
            } //End 6.Eternity/Luxe
            try {
                update_qa_order_status_array = update_qa_order_status_array.sort();
                nlapiSubmitField("purchaseorder", poId, "custbody_qa_order_details", update_qa_order_status_array);
                nlapiLogExecution("debug", "Successfully Update QA Order Detail of PO Id is : " + poId);
            } catch (e) {
                nlapiLogExecution("debug", e.getCode(), e.getDetails());
            }
								  }
							  }
						 
        } //End poId condition
    }

}