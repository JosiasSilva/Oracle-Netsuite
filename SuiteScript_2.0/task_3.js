/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */

define(['N/ui/serverWidget'],
    function (serverWidget) {
        function onRequest(context) {
            var response = context.response;
            var form = serverWidget.createForm({
                title: 'Suitelet 2.0'
            });

            form.clientScriptModulePath = 'SuiteScripts/common.js';

            form.addButton({ id: 'custpage_Button1', label: 'SAVE', functionName: 'saveRecord'});

            form.addButton({ id: 'custpage_Button2', label: 'BACK', functionName: 'back'});

            form.addButton({ id: 'custpage_Button3', label: 'CLOSE', functionName: 'close'});

            form.addFieldGroup({ id: 'custpage_subtab', label: 'Order Information' });

            var mandatoryField = form.addField({
                id: 'custpage_field',
                type: serverWidget.FieldType.SELECT,
                label: 'CUSTOMER NAME',
                source: 'customer',
                container: 'custpage_subtab'
            });

            mandatoryField.isMandatory = true;

            form.addField({
                id: 'custpage_field1',
                type: serverWidget.FieldType.DATE,
                label: 'ACTUAL SHIP DATE',
                source: null,
                container: 'custpage_subtab'
            });

            var selectDropOff = form.addField({
                id: 'custpage_field22',
                type: serverWidget.FieldType.SELECT,
                label: 'DROP OFF',
                source: null,
                container: 'custpage_subtab'
            });

            selectDropOff.addSelectOption({ value: '', text: '' });

            selectDropOff.addSelectOption({ value: '-1', text: '-New-' });

            selectDropOff.addSelectOption({ value: '1', text: 'Yes' });

            selectDropOff.addSelectOption({ value: '2', text: 'No' });

            selectDropOff.isMandatory = true;

            var select = form.addField({
                id: 'custpage_field2',
                type: serverWidget.FieldType.SELECT,
                label: 'PLACE OF SALE',
                source: null,
                container: 'custpage_subtab'
            });

            select.addSelectOption({ value: '0', text: '' });

            select.addSelectOption({ value: '54', text: 'Not Bank Wire' });

            select.addSelectOption({ value: '59', text: 'Phone' });

            select.addSelectOption({ value: '3', text: 'Opportunity' });

            select.addSelectOption({ value: '9', text: 'Phone : Bank Wire' });

            select.addSelectOption({ value: '1', text: 'Website' });

            select.isMandatory = true;

            var select1 = form.addField({
                id: 'custpage_field3',
                type: serverWidget.FieldType.SELECT,
                label: 'SALES REP',
                source: null,
                container: 'custpage_subtab'
            });

            select1.addSelectOption({ value: '0', text: '' });

            select1.addSelectOption({ value: '1', text: 'WAREHOUSE' });

            select1.addSelectOption({ value: '2', text: 'INVENTORY' });

            select1.addSelectOption({ value: '3', text: 'STORE' });

            form.addField({
                id: 'custpage_field4',
                type: serverWidget.FieldType.TEXT,
                label: 'NUMBER OF TIMES REPAIRED',
                source: null,
                container: 'custpage_subtab'
            });

            var mandatoryField2 = form.addField({
                id: 'custpage_field5',
                type: serverWidget.FieldType.TEXT,
                label: 'WHAT IS THE CUSTOMERS REPORTED REPAIR ISSUE?',
                source: null,
                container: 'custpage_subtab'
            });

            mandatoryField2.isMandatory = true;

            mandatoryField2.updateLayoutType({ layoutType: serverWidget.FieldLayoutType.NORMAL });

            mandatoryField2.updateBreakType({ breakType: serverWidget.FieldBreakType.STARTCOL });

            var mandatoryField3 = form.addField({
                id: 'custpage_field6',
                type: serverWidget.FieldType.INTEGER,
                label: 'WEAR HABITS',
                source: null,
                container: 'custpage_subtab'
            });

            mandatoryField3.isMandatory = true;

            var mandatoryField4 = form.addField({
                id: 'custpage_field7',
                type: serverWidget.FieldType.TEXT,
                label: 'WHEN DID THEY NOTICE ISSUE?',
                source: null,
                container: 'custpage_subtab'
            });

            mandatoryField4.isMandatory = true;

            var mandatoryField5 = form.addField({
                id: 'custpage_field8',
                type: serverWidget.FieldType.TEXT,
                label: 'CUSTOMER TEMP?',
                source: null,
                container: 'custpage_subtab'
            });

            mandatoryField5.isMandatory = true;

            var mandatoryField6 = form.addField({
                id: 'custpage_field9',
                type: serverWidget.FieldType.TEXT,
                label: 'INSURANCE OR BBESP?',
                source: null,
                container: 'custpage_subtab'
            });

            mandatoryField6.isMandatory = true;

            var mandatoryField7 = form.addField({
                id: 'custpage_field10',
                type: serverWidget.FieldType.TEXT,
                label: 'WHO TO CONTACT AFTER INSPECTION?',
                source: null,
                container: 'custpage_subtab'
            });

            mandatoryField7.isMandatory = true;

            var checkBox = form.addField({
                id: 'custpage_field11',
                type: serverWidget.FieldType.CHECKBOX,
                label: 'BLOCK AUTO EMAILS',
                source: null,
                container: 'custpage_subtab'
            });

            checkBox.updateLayoutType({ layoutType: serverWidget.FieldLayoutType.NORMAL });

            checkBox.updateBreakType({ breakType: serverWidget.FieldBreakType.STARTCOL });

            form.addField({
                id: 'custpage_field12',
                type: serverWidget.FieldType.TEXTAREA,
                label: 'SALES ORDER NOTES',
                source: null,
                container: 'custpage_subtab'
            });

            form.addField({
                id: 'custpage_field13',
                type: serverWidget.FieldType.TEXTAREA,
                label: 'OR NOTES',
                source: null,
                container: 'custpage_subtab'
            });

            /** -------------------------------------------------------------------------------------------------- */

            form.addFieldGroup({ id: 'custpage_subtab1', label: 'Delivery/Shipping' });

            var mandatoryField8 = form.addField({
                id: 'custpage_datefield',
                type: serverWidget.FieldType.DATE,
                label: 'DELIVERY DATE',
                source: null,
                container: 'custpage_subtab1'
            });

            mandatoryField8.isMandatory = true;

            form.addField({
                id: 'custpage_field14',
                type: serverWidget.FieldType.CHECKBOX,
                label: 'DELIVERY DATE FROM',
                source: null,
                container: 'custpage_subtab1'
            });

            var select2 = form.addField({
                id: 'custpage_selectfield',
                type: serverWidget.FieldType.SELECT,
                label: 'DELIVERY INSTRUCTIONS',
                source: null,
                container: 'custpage_subtab1'
            });

            select2.addSelectOption({ value: '0', text: '-New-' });

            select2.addSelectOption({ value: '1', text: 'Saturday Delivery Only' });

            select2.addSelectOption({ value: '2', text: 'Delivery on specific date' });

            select2.addSelectOption({ value: '3', text: 'Delivery after a specific date' });

            form.addField({
                id: 'custpage_field15',
                type: serverWidget.FieldType.TEXTAREA,
                label: 'DELIVERY DATE NOTES',
                source: null,
                container: 'custpage_subtab1'
            });

            form.addField({
                id: 'custpage_field16',
                type: serverWidget.FieldType.CHECKBOX,
                label: 'PICKUP LOCATION',
                source: null,
                container: 'custpage_subtab1'
            });

            var select3 = form.addField({
                id: 'custpage_selectfield1',
                type: serverWidget.FieldType.SELECT,
                label: 'DELIVERY INSTRUCTIONS',
                source: null,
                container: 'custpage_subtab1'
            });

            select3.addSelectOption({ value: '4', text: '' });

            select3.addSelectOption({ value: '5', text: 'San Francisco' });

            select3.addSelectOption({ value: '6', text: 'Los Angeles' });

            select3.addSelectOption({ value: '7', text: 'item Sent to SF' });


            var select3 = form.addField({
                id: 'custpage_selectfield2',
                type: serverWidget.FieldType.SELECT,
                label: 'COUNTRY',
                source: null,
                container: 'custpage_subtab1'
            });

            select3.addSelectOption({ value: '0', text: 'UNITED STATES' });

            select3.addSelectOption({ value: '1', text: 'INDIA' });

            select3.addSelectOption({ value: '2', text: 'UK' });

            select3.updateLayoutType({ layoutType: serverWidget.FieldLayoutType.NORMAL });

            select3.updateBreakType({ breakType: serverWidget.FieldBreakType.STARTCOL });

            form.addField({
                id: 'custpage_selectfield3',
                type: serverWidget.FieldType.TEXT,
                label: 'ATTENTION',
                source: null,
                container: 'custpage_subtab1'
            });

            form.addField({
                id: 'custpage_selectfield4',
                type: serverWidget.FieldType.TEXT,
                label: 'ADDRESSES',
                source: null,
                container: 'custpage_subtab1'
            });

            form.addField({
                id: 'custpage_selectfield5',
                type: serverWidget.FieldType.TEXT,
                label: 'ADDRESS LINE 1',
                source: null,
                container: 'custpage_subtab1'
            });

            form.addField({
                id: 'custpage_selectfield6',
                type: serverWidget.FieldType.TEXT,
                label: 'ADDRESS LINE 2',
                source: null,
                container: 'custpage_subtab1'
            });

            form.addField({
                id: 'custpage_selectfield7',
                type: serverWidget.FieldType.TEXT,
                label: 'CITY',
                source: null,
                container: 'custpage_subtab1'
            });

            form.addField({
                id: 'custpage_selectfield8',
                type: serverWidget.FieldType.TEXT,
                label: 'STATE',
                source: null,
                container: 'custpage_subtab1'
            });

            form.addField({
                id: 'custpage_selectfield9',
                type: serverWidget.FieldType.TEXT,
                label: 'ZIPCODE',
                source: null,
                container: 'custpage_subtab1'
            });

            var select4 = form.addField({
                id: 'custpage_selectfield10',
                type: serverWidget.FieldType.SELECT,
                label: 'RETURN LABEL STATUS',
                source: null,
                container: 'custpage_subtab1'
            });

            select4.addSelectOption({ value: '0', text: 'NOT ACCEPTED' });

            select4.addSelectOption({ value: '1', text: 'DELAYED' });

            select4.addSelectOption({ value: '2', text: 'ADDRESS CHANGE' });

            select4.isMandatory = true;

            var select5 = form.addField({
                id: 'custpage_selectfield11',
                type: serverWidget.FieldType.SELECT,
                label: 'DATE RECIEVED AT BE FROM CUSTOMER',
                source: null,
                container: 'custpage_subtab1'
            });

            select5.addSelectOption({ value: '0', text: '-New-' });

            select5.addSelectOption({ value: '1', text: 'DELAYED' });

            select5.addSelectOption({ value: '2', text: 'ADDRESS CHANGE' });

            form.addField({
                id: 'custpage_selectfield12',
                type: serverWidget.FieldType.TEXT,
                label: 'STATUS OF INTERNATIONAL TAXES',
                source: null,
                container: 'custpage_subtab1'
            });

            var sublist = form.addSublist({
                id: 'sublist',
                label: '  ',
                type: serverWidget.SublistType.INLINEEDITOR,
                container: 'custpage_subtab1'
            });

            sublist.addField({
                id: 'custpage_sublist1',
                type: serverWidget.FieldType.TEXT,
                label: 'SHIPPING TO BE'
            });


            sublist.addField({
                id: 'custpage_sublist2',
                type: serverWidget.FieldType.SELECT,
                label: 'ITEM',
                source: 'item'
            });


            sublist.addField({
                id: 'custpage_sublist3',
                type: serverWidget.FieldType.TEXT,
                label: 'DESCRIPTION'
            });


            sublist.addField({
                id: 'custpage_sublist4',
                type: serverWidget.FieldType.CURRENCY,
                label: 'AMOUNT'
            });


            sublist.addField({
                id: 'custpage_sublist5',
                type: serverWidget.FieldType.CURRENCY,
                label: 'SALES AMOUNT'
            });


            sublist.addField({
                id: 'custpage_sublist6',
                type: serverWidget.FieldType.FLOAT,
                label: 'QUANTITY'
            });


            sublist.addField({
                id: 'custpage_sublist7',
                type: serverWidget.FieldType.FLOAT,
                label: 'PRODUCTION ISURANCE VALUE'
            });


            sublist.addField({
                id: 'custpage_sublist8',
                type: serverWidget.FieldType.TEXT,
                label: 'ITEM SKU'
            });


            sublist.addField({
                id: 'custpage_sublist9',
                type: serverWidget.FieldType.TEXT,
                label: 'CREATED FROM'
            });


            sublist.addField({
                id: 'custpage_sublist10',
                type: serverWidget.FieldType.TEXT,
                label: 'CENTRE STONE SKU'
            });


            sublist.addField({
                id: 'custpage_sublist11',
                type: serverWidget.FieldType.TEXT,
                label: 'RELATED SALES ORDER'
            });

            form.clientScriptModulePath = 'SuiteScripts/common.js';
            response.writePage(form);

        }

        return {
            onRequest: onRequest
        };

    });