/**
    *@NApiVersion 2.x
    *@NScriptType UserEventScript
*/

define(['N/record', 'N/log'],
    function (record, log) {
        function beforeLoad(context) {
            if (context.type == context.UserEventType.VIEW || context.type == context.UserEventType.EDIT) {

                var currentRecord = context.newRecord;

                // var objRecord = record.load({
                //      type: record.Type.SALES_ORDER,
                //      id:currentRecord.id,
                //      isDynamic: false,
                // });

                // log.error({title:'executed', details:'executed'});
                var form = context.form;
                var haveCustomKey;
                form.clientScriptModulePath = 'SuiteScripts/common.js';
                
                var count = currentRecord.getLineCount({
                    sublistId: 'item'
                });
                for (var i = 0; i < count; i++) {
                    haveCustomKey = currentRecord.getSublistText({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });
                    if ((haveCustomKey.indexOf('custom') == -1)) {
                        form.addButton({
                            id: 'custpage_btnavi',
                            label: 'Custom BUTTON',
                            functionName: 'openSuite'
                        });
                        break;
                        //  log.error({title:'executed', details:'executed'});
                    }

                }
            }
        }
        return {
            beforeLoad: beforeLoad
        };
    });
