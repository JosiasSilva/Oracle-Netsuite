/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', './moment.min', 'N/ui/message', 'N/url', 'N/search', 'N/ui/dialog'],
    /**
     * @param {record} record
     */
    function(record, moment, message, url, search, dialog) {

        var soArray = [];
        var bulkUpdate_bulk = [];
        var compare_doc_array = [];

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */

        function pageInit(scriptContext) {

        }

        function bulkUpdate() {


            if (bulkUpdate_bulk.length > 0) {
                var xmlRequest = new XMLHttpRequest();
                xmlRequest.onreadystatechange = function() {
                    var myMsg = message.create({
                        title: 'Bulk Recon of Sales Orders',
                        message: 'Updating Recon Date to Current Date.',
                        type: message.Type.INFORMATION
                    });
                    myMsg.show({
                        duration: 3000
                    });

                };
                var backendURL = url.resolveScript({
                    scriptId: 'customscript_zag_backend_bulk_recon',
                    deploymentId: 'customdeploy_zag_backend_bulk_recon'
                });

                for (var j = 0; j < bulkUpdate_bulk.length; j++) {
                    var xmlOpen = xmlRequest.open('POST', backendURL, true);
                    xmlRequest.setRequestHeader("Content-Type", "application/json");
                    xmlRequest.send(JSON.stringify(bulkUpdate_bulk[j]));
                }

            } else {
                dialog.alert({
                    title: 'Nothing to Update',
                    message: 'Please enter at least one document number to update'
                });
            }


        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {




            var currentRecord = scriptContext.currentRecord;
            var sublistName = scriptContext.sublistId;
            var fieldName = scriptContext.fieldId;
            var dateAndSalesObj = {};


            if (sublistName == 'reconsublist') {
                if (fieldName == 'custpage_test_field') {
                    console.log("I am getting this field correctly");
                    var dateValue = currentRecord.getCurrentSublistValue({
                        sublistId: sublistName,
                        fieldId: fieldName
                    });
                    var so_id = currentRecord.getCurrentSublistValue({
                        sublistId: sublistName,
                        fieldId: 'custpage_internal_field'
                    });
                    var momDate = moment(dateValue).format("MM/DD/YYYY");
                    dateAndSalesObj.date = momDate;
                    dateAndSalesObj.so = so_id;
                    soArray.push(dateAndSalesObj)

                }
            }
        }

        function updateRecords() {
            if (soArray.length > 0) {
                var xmlRequest = new XMLHttpRequest();
                xmlRequest.onreadystatechange = function() {
                    //  console.log(xmlRequest);

                    var myMsg2 = message.create({
                        title: 'Update Recon Tab Values',
                        message: 'Updating the Records...',
                        type: message.Type.INFORMATION
                    });
                    myMsg2.show({
                        duration: 1000
                    });
                };
                var backendURL = url.resolveScript({
                    scriptId: 'customscript_zag_be_recon_update',
                    deploymentId: 'customdeploy_zag_be_recon_update'
                });

                for (var j = 0; j < soArray.length; j++) {

                    var xmlOpen = xmlRequest.open('POST', backendURL, true);
                    xmlRequest.setRequestHeader("Content-Type", "application/json");
                    xmlRequest.send(JSON.stringify(soArray[j]));

                }
            } else {
                dialog.alert({
                    title: 'Nothing to Update',
                    message: 'Please enter at least one recon date to update'
                });
            }
        }

        function bulkRecon() {
            var backendURL = url.resolveScript({
                scriptId: 'customscript_bulk_recon_so',
                deploymentId: 'customdeploy_bulk_recon_so'
            });

            window.open(backendURL, "Bulk Recon", "width=650,height=650");

        }



        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         *
         * @since 2015.2
         */
        function postSourcing(scriptContext) {

        }

        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(scriptContext) {



        }

        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {

        }

        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(context) {

        }

        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */

        function validateLine(scriptContext) {
            var some_Value;
            var validateFlag = 0;
            var temp_value;

            var currentRecord = scriptContext.currentRecord;
            var sublistName = scriptContext.sublistId;
            some_Value = currentRecord.getValue({
                fieldId: 'custpage_docu_number'
            });
            some_Value = some_Value.replace(/[\x00-\x1F\x7F-\x9F]/g, ",")

            compare_doc_array = some_Value.split(",");

            if (sublistName == 'bulkupdatereconsublist') {
                temp_value = currentRecord.getCurrentSublistValue({
                    sublistId: sublistName,
                    fieldId: 'custpage_so_doc_field'
                });
                for (var k = 0; k < compare_doc_array.length; k++) {
                    if (temp_value === compare_doc_array[k]) {
                        validateFlag = 1;
                        console.log(validateFlag);
                        break;
                    }
                }
            }
            if (validateFlag) {
                bulkUpdate_bulk.push(temp_value);
                console.log(bulkUpdate_bulk)
                return true;
            } else {
                dialog.alert({
                    title: 'Invalid Document Number',
                    message: 'Please check your entry and try again.'
                });
            }


        }

        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(scriptContext) {

        }

        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(scriptContext) {

        }

        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {

        }

        return {
            fieldChanged: fieldChanged,
            updateRecords: updateRecords,
            bulkRecon: bulkRecon,
            bulkUpdate: bulkUpdate,
            validateLine: validateLine

        };

    });