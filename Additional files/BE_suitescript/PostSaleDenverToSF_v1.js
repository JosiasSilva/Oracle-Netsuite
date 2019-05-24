/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/email', 'N/record', 'N/runtime', 'N/search'],
    /**
     * @param {email} email
     * @param {record} record
     * @param {runtime} runtime
     * @param {search} search
     */
    function(email, record, runtime, search) {


        /**
         * Definition of the Scheduled script trigger point.
         *
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
         * @Since 2015.2
         */
        function execute(context) {
            try {

                // var mySearch = nlapiLoadSearch(null, 10090);// For sandbox
                // var mySearch =  search.load({id: 'customsearch_post_sale_transfer_order__3'});
                var mySearch = search.load({
                    id: 'customsearch_post_sale_transfer_order__2'
                });
                var searchresult = [];
                var insItemArray = [];
                var to_id;
                var resultset = mySearch.run();
                var searchid = 0;
                do {
                    var resultslice = resultset.getRange({
                        start: 0,
                        end: searchid + 1000
                    });
                    if (resultslice != null && resultslice != '') {
                        for (var rs in resultslice) {
                            searchresult.push(resultslice[rs]);
                            searchid++;
                        }

                    }
                } while (resultslice.length >= 1000);
                // log.debug("Search Results",searchresult);
                var searchCount = searchresult.length;
                if (searchCount > 0) {

                    var InsuranceAvgAmt = 70000;


                    //New variables for new logic
                    var prevItemId = '';
                    var itemArrLoc = new Array();
                    var transfer_Rec = [];
                    var InsuranceTotAmtArr = new Array();
                    var tempArrLoc = new Array();

                    var prevLocation = '';
                    for (var j = 0; j < searchresult.length; j++) {
                        var insuranceTotal = '0.00';
                        var Results = searchresult[j].columns;
                        var itemIdNo = searchresult[j].getValue({
                            name: 'formulatext'
                        });

                        /*var salesOrderIdNo = searchresult[j].getValue(Results[1]);
                        var customerName = searchresult[j].getText(Results[2]);
                        var customerIdNo = searchresult[j].getValue(Results[2]);
                        var itemName = searchresult[j].getText(Results[3]);
                        var description = searchresult[j].getValue(Results[4]);*/
                        var insValue = searchresult[j].getValue({
                            name: 'custcol_full_insurance_value'
                        });

                        var quantity = searchresult[j].getValue({
                            name: 'quantity'
                        });
                        var amount = searchresult[j].getValue({
                            name: 'amount'
                        });
                        var cust_item_location = searchresult[j].getValue({
                            name: 'custbody245'
                        });
                        var locations = cust_item_location.split(',');
                        var from_location;
                        if (locations.indexOf('4') == 0) {
                            cust_item_loc = locations[1];
                        } else {
                            cust_item_loc = locations[0];
                        }

                        // var result = search.create({type:'location',filters: [["custrecord_customer_item_location","anyof",cust_item_loc]],columns:[search.createColumn({name: "internalid", label: "Internal ID"})]});

                        // var results=nlapiSearchRecord('location',null,new nlobjSearchFilter('custrecord_customer_item_location',null,'anyOf',cust_item_loc));

                        var from_location = parseInt(cust_item_loc);

                        var index = InsuranceTotAmtArr.map(function(e) {
                            return e.loc_id;
                        }).indexOf(from_location);
                        if (!(index > -1)) {
                            InsuranceTotAmtArr.push({
                                loc_id: from_location,
                                amount: parseFloat(insValue)
                            });
                            index = InsuranceTotAmtArr.map(function(e) {
                                return e.loc_id;
                            }).indexOf(from_location);
                        } else {
                            InsuranceTotAmtArr[index].amount = parseFloat(InsuranceTotAmtArr[index].amount) + parseFloat(insValue);
                        }
                        //log.debug("Insurance Amount Array",InsuranceTotAmtArr);
                        if (InsuranceTotAmtArr[index].amount > InsuranceAvgAmt) {
                            var temp = tempArrLoc.filter(function(item) {
                                return (item.loc_id == from_location);
                            });
                            itemArrLoc.push({
                                loc_id: from_location,
                                items: temp
                            });
                            //log.debug("Item Array after Insurance check",itemArrLoc);
                            InsuranceTotAmtArr[index].amount = parseFloat(insValue);
                            tempArrLoc = removeByAttr(tempArrLoc, 'loc_id', from_location);
                            tempArrLoc.push({
                                loc_id: from_location,
                                items: searchresult[j]

                            });

                        } else {
                            tempArrLoc.push({
                                loc_id: from_location,
                                items: searchresult[j]
                            });
                            // log.debug("Temp Array after Insurance check",tempArrLoc);
                        }
                        //End New Logic
                    }
                    // end of for loop

                    if (tempArrLoc) {
                        //log.debug("Temp Array ",tempArrLoc);
                        var len = tempArrLoc.length;
                        while (len > 0) {
                            var temp = tempArrLoc.filter(function(item) {
                                return (item.loc_id == tempArrLoc[0].loc_id);
                            });
                            itemArrLoc.push({
                                loc_id: tempArrLoc[0].loc_id,
                                items: temp

                            });
                            tempArrLoc = removeByAttr(tempArrLoc, 'loc_id', tempArrLoc[0].loc_id);
                            len = tempArrLoc.length;
                        }
                    }
                    //log.debug("Item Array Loc",JSON.stringify(itemArrLoc));

                    //var TransferOrder = record.create({type:record.Type.TRANSFER_ORDER,isDynamic:true});
                    if (itemArrLoc) {
                        //log.debug("Item Arr length",itemArrLoc.length);
                        // log.debug("Item Array Loc",JSON.stringify(itemArrLoc));
                        var TransferOrder = record.create({
                            type: record.Type.TRANSFER_ORDER,
                            isDynamic: true
                        });
                        var search_memo = runtime.getCurrentScript().getParameter({
                            name: 'custscript_search_memo_script'
                        });
                        // nlapiLogExecution('Debug','Search title',search_memo);
                        var location_id = runtime.getCurrentScript().getParameter({
                            name: 'custscript_location_to'
                        });

                        //nlapiLogExecution('DEBUG','Location through parameter',location_id);

                        var from_loc = runtime.getCurrentScript().getParameter({
                            name: 'custscript_from_location_script'
                        });

                        /* var itemArrLoc= itemArrLoc.filter(function(item) {
                           return (item.loc_id == from_loc );
                         });*/

                        var insTotal = 0;


                        for (iLoc = 0; iLoc < itemArrLoc.length; iLoc++) {
                            // log.debug("I am here in item array loop 2");

                            var myResult = itemArrLoc[iLoc].items;
                            //log.debug("Item Array Loc",JSON.stringify(myResult));
                            if (myResult != null && myResult.length > 0) {
                                //var insTotal = 0;
                                var totItem = 0;
                                //  var TransferOrder = record.create({type:record.Type.TRANSFER_ORDER,isDynamic:true});
                                TransferOrder.setValue({
                                    fieldId: 'location',
                                    value: from_loc
                                });
                                TransferOrder.setValue({
                                    fieldId: 'transferlocation',
                                    value: location_id
                                });
                                TransferOrder.setValue({
                                    fieldId: 'orderstatus',
                                    value: 'B'
                                });
                                TransferOrder.setValue({
                                    fieldId: 'memo',
                                    value: search_memo
                                });


                                var arr_so = [];
                                for (i = 0; i < myResult.length; i++) {
                                    // log.debug("I am here in for item result loop",myResult.length);
                                    totItem = totItem + 1;
                                    var ResultColm = myResult[i].items.columns;
                                    //log.debug("Item Array Loc",ResultColm);
                                    var so_id = myResult[i].items.id;
                                    var item_id = myResult[i].items.getValue(ResultColm[3]);
                                    var insurance = myResult[i].items.getValue(ResultColm[5]);
                                    var description = myResult[i].items.getValue(ResultColm[4]);
                                    var amount = myResult[i].items.getValue(ResultColm[7]);
                                    //var totalItems = myResult[i].items.getValue(ResultColm[6]);
                                    //log.debug("All Columns",so_id+item_id+insurance+description+amount);
                                    if (insurance == null || insurance == '') {
                                        insurance = 0;
                                    }

                                    if (insurance > InsuranceAvgAmt) {
                                        insItemArray.push(myResult);
                                        //log.debug("New Greater insItem",insItemArray);
                                        to_id = createTO(myResult);
                                        transfer_Rec.push(to_id);
                                        log.debug("Transfer Rec for High insurance", to_id);
                                    } else // Belongs to Insurance Check If
                                    {

                                        if (i == 0) {
                                            arr_so.push(so_id);
                                        } else {
                                            if (!(arr_so.indexOf(so_id) > -1)) {
                                                arr_so.push(so_id);
                                            }
                                        }

                                        insTotal = parseFloat(insTotal) + parseFloat(insurance);

                                        TransferOrder.selectNewLine({
                                            sublistId: 'item'
                                        });
                                        TransferOrder.setCurrentSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'item',
                                            value: item_id
                                        });

                                        if (insurance != null && insurance != '')
                                            TransferOrder.setCurrentSublistValue({
                                                sublistId: 'item',
                                                fieldId: 'custcol_full_insurance_value',
                                                value: insurance
                                            });


                                        TransferOrder.setCurrentSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'custcol38',
                                            value: so_id
                                        });
                                        TransferOrder.setCurrentSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'description',
                                            value: description
                                        });
                                        TransferOrder.setCurrentSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'amount',
                                            value: amount
                                        });


                                        TransferOrder.commitLine({
                                            sublistId: 'item'
                                        });
                                    }
                                } // end of for loop
                                TransferOrder.setValue({
                                    fieldId: 'custbody_insurance_total',
                                    value: insTotal
                                });
                                TransferOrder.setValue({
                                    fieldId: 'custbody306',
                                    value: totItem
                                });
                                TransferOrder.setValue({
                                    fieldId: 'custbody_to_so_count',
                                    value: arr_so.length
                                });

                            }

                        }
                        //log.debug("Transfer Record Object",JSON.stringify(TransferOrder));
                        // New to save logic below
                        var TransferRecId = TransferOrder.save();
                        transfer_Rec.push(TransferRecId);
                    } //end check itemArrLoc1.length			

                }


            } catch (e) {
                log.error('Exception in search id-10099 Transfer Record is', e.message);
            }

		try{
            var email_subject = "Transfer Order has been created";
            var email_body = "The record ID of Transfer Order created is" + transfer_Rec;
            // var user = runtime.getCurrentUser();
            //  log.debug("User obj",JSON.stringify(user));

            email.send({
                author: runtime.getCurrentScript().getParameter({
                    name: 'custscript_from_email'
                }),
                recipients: runtime.getCurrentScript().getParameter({
                    name: 'custscript_to_email'
                }),
                subject: email_subject,
                body: email_body
            });
          } catch (e) {
                log.error('Error while sending mail', e.message);
            }
        }

        return {
            execute: execute
        };

        function removeByAttr(arr, attr, value) {
            var i = arr.length;
            while (i--) {
                if (arr[i] &&
                    arr[i].hasOwnProperty(attr) &&
                    (arguments.length > 2 && arr[i][attr] === value)) {

                    arr.splice(i, 1);

                }
            }
            return arr;
        }

        function createTO(itemArray) {
            var totItem = 0;
            var soCount = 0;
            var ResultColm = itemArray[0].items.columns;
            var so_id = itemArray[0].items.id;
            var item_id = itemArray[0].items.getValue(ResultColm[3]);
            var insurance = itemArray[0].items.getValue(ResultColm[5]);
            var description = itemArray[0].items.getValue(ResultColm[4]);
            var amount = itemArray[0].items.getValue(ResultColm[7]);
            var search_memo = runtime.getCurrentScript().getParameter({
                name: 'custscript_search_memo_script'
            });
            var location_id = runtime.getCurrentScript().getParameter({
                name: 'custscript_location_to'
            });
            log.debug("Location", location_id);
            var from_loc = runtime.getCurrentScript().getParameter({
                name: 'custscript_from_location_script'
            });
            log.debug("Location", from_loc);
            totItem = totItem + 1;
            soCount = soCount + 1;
            var TransferOrder = record.create({
                type: record.Type.TRANSFER_ORDER,
                isDynamic: true
            });
            TransferOrder.setValue({
                fieldId: 'custbody_insurance_total',
                value: insurance
            });
            TransferOrder.setValue({
                fieldId: 'custbody306',
                value: totItem
            });
            TransferOrder.setValue({
                fieldId: 'custbody_to_so_count',
                value: soCount
            });
            TransferOrder.setValue({
                fieldId: 'location',
                value: from_loc
            });
            TransferOrder.setValue({
                fieldId: 'transferlocation',
                value: location_id
            });
            TransferOrder.setValue({
                fieldId: 'orderstatus',
                value: 'B'
            });
            TransferOrder.setValue({
                fieldId: 'memo',
                value: search_memo
            });

            TransferOrder.selectNewLine({
                sublistId: 'item'
            });
            TransferOrder.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                value: item_id
            });
            TransferOrder.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_full_insurance_value',
                value: insurance
            });
            TransferOrder.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custcol38',
                value: so_id
            });
            TransferOrder.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'description',
                value: description
            });
            TransferOrder.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'amount',
                value: amount
            });
            TransferOrder.commitLine({
                sublistId: 'item'
            });
            var id = TransferOrder.save();
            return id;

        }

    });