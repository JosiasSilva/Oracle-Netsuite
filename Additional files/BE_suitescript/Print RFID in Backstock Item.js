/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget','N/search', 'N/record', 'N/runtime'],
    /**
     * @param {serverWidget} serverWidget
     */
    function(serverWidget,search, record, runtime) {

        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type
         * @param {Form} scriptContext.form - Current form
         * @Since 2015.2
         */
        function beforeLoad(scriptContext) {
            try {

                if (scriptContext.type == 'view') {

                    var form = scriptContext.form;
                    form.clientScriptFileId = 30207167;
                   //form.clientScriptModulePath = 'SuiteScripts/Print RFID.js';
                    var backStockRec = scriptContext.newRecord;
                    var backStockId  = backStockRec.id;
                    var upcCode = backStockRec.getValue({
                        fieldId: 'custrecord_upc_counter'
                    });
                    log.debug("Inside  beforeLoad",'backStockId ='+backStockId+'/upcCode ='+upcCode);
                	
                    if (backStockId !== null && backStockId !== undefined && backStockId != "") {
                        form.addButton({
                            id: 'custpage_rfid_print',
                            label: 'Print RFID',
                            functionName: 'rfidPrint("' + backStockId + '")'
                        });
                    }
                }
            } catch (e) {
                log.error("Print RFID", e.message);
            }
        }
        return {
            beforeLoad: beforeLoad
        };

    });
