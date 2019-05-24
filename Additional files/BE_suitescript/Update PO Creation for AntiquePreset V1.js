function Update_PO_Creation_for_AntiquePreset(type, form) {
    nlapiLogExecution("debug", "Type:" + type, type);
    if (type == 'approve') {
        try {
            var SoId = nlapiGetRecordId(); //14792165;
            var SoType = nlapiGetRecordType(); //'salesorder';// 
            nlapiLogExecution('DEBUG', 'SO ID and Type', SoId + " " + SoType);
            var SOObj = nlapiLoadRecord('salesorder', SoId);
            var itemCount = SOObj.getLineItemCount("item");
            var CategoryId;
            var soLineDesc;
            var categoryArr = new Array();
            var repResArr = new Array();
            var POId = '';
            for (var i = 1; i <= itemCount; i++) {
                // var itemType = SOObj.getLineItemValue("item", "itemtype", i);
                //nlapiLogExecution("debug", "type of an item", itemType);
                var invItemId = SOObj.getLineItemValue("item", "item", i);
                nlapiLogExecution("debug", "Id of an item", invItemId);
                var poIdTemp = SOObj.getLineItemValue("item", "createdpo", i);
                nlapiLogExecution("debug", "Id created po", poIdTemp);
                soLineDesc = SOObj.getLineItemValue("item", "description", i);
                nlapiLogExecution("debug", "Id created po", soLineDesc);
                if (poIdTemp) {
                    POId = poIdTemp;
                }
                if (invItemId == '1093360' || invItemId == '1087131') {
                    nlapiLogExecution("debug", " Item is repair or resize", invItemId);
                    repResArr.push({
                        invItemId: invItemId
                    });
                } else {
                    var filter = new Array();
                    filter.push(new nlobjSearchFilter('internalid', null, 'anyof', [invItemId]));
                    filter.push(new nlobjSearchFilter('custitem20', null, 'anyof', [24, 35, 36]));
                    var column = new Array();
                    column.push(new nlobjSearchColumn('custitem20'));
                    column.push(new nlobjSearchColumn('description'));
                    var results = nlapiSearchRecord('item', null, filter, column);
                    if (results != null) {
                        var type = results[0].getRecordType();
                        var CategoryId = results[0].getId();
                        var col = results[0].getAllColumns();
                        var description = results[0].getValue(col[1]);
                        categoryArr.push({
                            CategoryId: CategoryId,
                            description: description,
                            soLineDesc: soLineDesc
                        });
                    }
                }

            }
            if (repResArr.length > 0) {
                var POObj = nlapiLoadRecord('purchaseorder', POId);
                nlapiLogExecution("debug", "created po Id from So", POId);
                var polineCount = POObj.getLineItemCount("item");
                var dateSF = '';
                for (var k = 0; k < polineCount; k++) {
                    if (!dateSF) {
                        dateSF = POObj.getLineItemValue('item', 'custcol18', k + 1);
                    }
                    if (categoryArr) {
                        var ItemId = categoryArr[0].CategoryId;
                        var description = categoryArr[0].description;
                        var soLinelebelDesc = categoryArr[0].soLineDesc;
                        if (soLinelebelDesc == null || soLinelebelDesc=='') {
                            POObj.setLineItemValue("item", "description", k + 1, description);
                        } else {
                            POObj.setLineItemValue("item", "description", k + 1, soLinelebelDesc);
                        }
                        POObj.setLineItemValue('item', 'custcol18', k + 1, dateSF);
                        POObj.setLineItemValue("item", "custcolitem_link", k + 1, ItemId);
                        categoryArr = removeByAttr(categoryArr, 'CategoryId', categoryArr[0].CategoryId);
                    }
                }
                for (var j = 0; j < categoryArr.length; j++) {
                    nlapiLogExecution("debug", "Inside Else part", categoryArr.length);
                    var itemId = categoryArr[j].invItemId;
                    var Item_Id = 2678821; // for Transfer
                    POObj.selectNewLineItem("item");
                    POObj.setCurrentLineItemValue("item", "item", Item_Id);
                    // POObj.setCurrentLineItemValue("item", "description", '');
                    POObj.setCurrentLineItemValue("item", "custcolitem_link", itemId);
                    nlapiLogExecution("debug", "set dateSF in transfer Item", dateSF);
                    POObj.setCurrentLineItemValue("item", "custcol18", dateSF);
                    POObj.commitLineItem("item");
                }
            }
            nlapiSubmitRecord(POObj, true, true);
        } catch (error) {
            nlapiLogExecution("debug", "Error occuring while creating PO", error.message);
        }
    }
}

function removeByAttr(arr, attr1, value1) {
    var i = arr.length;
    while (i--) {
        if (arr[i] &&
            arr[i].hasOwnProperty(attr1) &&
            (arguments.length > 2 && arr[i][attr1] === value1)) {
            arr.splice(i, 1);
        }
    }
    return arr;
}