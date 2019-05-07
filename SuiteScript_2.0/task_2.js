/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */

define(['N/ui/serverWidget'],
    function (serverWidget) {
        function onRequest(context) {
            var response = context.response;

            var formPage = serverWidget.createForm({
                title: 'Simple Form'
            });

            formPage.addButton({
                id: 'custpage_Button1',
                label: 'Next',
                functionName: 'isValid'
            });

            formPage.addButton({
                id: 'custpage_Button2',
                label: 'Close',
                functionName: 'close'
            });

            var select = formPage.addField({
                id: 'custpage_field',
                type: serverWidget.FieldType.SELECT,
                label: 'select item'
            });

            select.addSelectOption({
                value: '0',
                text: ''
            });

            select.addSelectOption({
                value: '1',
                text: 'Repair'
            });

            select.addSelectOption({
                value: '2',
                text: 'Resize'
            });

            select.addSelectOption({
                value: '3',
                text: 'Exchange'
            });

            select.addSelectOption({
                value: '4',
                text: 'Setting to be added'
            });

            select.addSelectOption({
                value: '5',
                text: 'Engrave'
            });

            select.addSelectOption({
                value: '6',
                text: 'Upgrade'
            });

            select.addSelectOption({
                value: '7',
                text: 'Reset'
            });

            select.addSelectOption({
                value: '8',
                text: 'Size'
            });

            // var output = url.resolveRecord({
            //     recordType: 'salesorder',
            //     recordId: 6,
            //     isEditMode: true
            // });
			formPage.clientScriptModulePath = 'SuiteScripts/common.js';
            response.writePage(formPage);

        }
        return {
            onRequest: onRequest
        };

    });