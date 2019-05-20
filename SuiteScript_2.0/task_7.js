/**
    *@NApiVersion 2.x
    *@NScriptType UserEventScript
*/

define(['N/record', 'N/log', 'N/search', 'N/email'],
    function (record, log, search, email) {
        function beforeLoad(context) {
            if (context.type == context.UserEventType.EDIT || context.type == context.UserEventType.VIEW) {
                var rec_id = context.newRecord.id;
                // var objRecord = record.load({
                //     type: record.Type.SALES_ORDER,
                //     id: rec_id,
                //     isDynamic: true
                // });

                var objRecord = context.newRecord;

                var numLines = objRecord.getLineCount({
                    sublistId: 'item'
                });

                for (var i = 0; i < numLines; i++) {


                    var item_id = objRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });

                    var itemType = objRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'itemtype',
                        line: i
                    });



                    var category = search.lookupFields({
                        type: search.Type.INVENTORY_ITEM,
                        id: item_id,
                        columns: ['custitem20']
                    });

                    var valueCategory = category.custitem20 ? category.custitem20[0].value : valueCategory;

                    log.debug({
                        title: 'Debug Entry',
                        details: 'checking value category ' + JSON.stringify(category)
                    });

                    if (valueCategory == 2 && itemType == "InvtPart") {

                        // var parent = search.lookupFields({
                        //     type: search.Type.INVENTORY_ITEM,
                        //     id: item_id,
                        //     columns: ['parent']
                        // });
                        // });

                        var inventoryItem = record.load({
                            type: search.Type.INVENTORY_ITEM,
                            id: item_id

                        })

                        var parent = inventoryItem.getValue({
                            fieldId: 'parent'
                        });

                        // var value = search.lookupFields({
                        //     type: search.Type.INVENTORY_ITEM,
                        //     id: value,
                        //     columns: ['custitem101']

                        log.debug({
                            title: 'Debug Entry',
                            details: 'checking parent ' + parent
                        });

                        var value = inventoryItem.getValue(
                            'custitem101'
                        );

                        log.debug({
                            title: 'Debug Entry',
                            details: 'checking value ' + JSON.stringify(value)
                        });


                        var first = value.split('\n')[1];
                        var second = first.split(':')[1];
                        if (second == "Round" || "Princess" || "Cushion" || "Oval" || "Emerald" || "Asscher" || "Radiant" || "Pear" || "Marquise" || "Heart" || "Baguette") {
                            var v = value.split('\n');

                            var Gemstone_value = v[0].split(':')[1];
                            var Shape_value = v[1].split(':')[1];
                            var Setting_type_value = v[4].split(':')[1];
                            var Color_value = v[5].split(':')[1];
                            var clarity_value = v[6].split(':')[1];

                            var string = "<table style='width:100%'> \
					<tr>\
					  <th>Fields</th>\
					  <th colspan='1'>Values</th>\
					</tr>\
					<tr>\
					  <td>Gemstone</td>\
					  <td> "+ Gemstone_value + "</td>\
					</tr>\
					<tr>\
					  <td>Shape</td>\
					  <td>"+ Shape_value + "</td>\
					</tr>\
					<tr>\
					  <td>Setting_type</td>\
					  <td>"+ Setting_type_value + "</td>\
					</tr>\
					<tr>\
					  <td>Color</td>\
					  <td>"+ Color_value + "</td>\
					</tr>\
					  <tr>\
					  <td>clarity</td>\
					  <td>"+ clarity_value + "</td>\
					</tr>\
                    </table>";

                            log.debug({
                                title: 'Debug Entry',
                                details: 'mail sent ' + string
                            });


                            email.send({
                                author: '25963357',
                                recipients: 'avinash.singh@inoday.com',
                                subject: 'Test Sample Email ',
                                body: string,
                                attachments: null,
                                relatedRecords: {
                                    entityId: null,
                                    customRecord: {
                                        id: null,
                                        recordType: null
                                    }
                                }
                            });

                        }

                    }

                }
            }
        }
        return {
            beforeLoad: beforeLoad
        }
    }
)
