/***
 * Script Author :  Aradhana & Sanjay (aradhana.gautam@inoday.com)
 * Author Desig. :  Netsuite Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   :  Suitscript (User event Script)
 * Script Name   :  Gemstone Restlet Page Creation via Sales Order
 * Script File   :  gemstone_restlet_page_reation_via_so.js
 * Created Date  :  Apr 10, 2018
 ***/
function gemstoneRestletpageCreationviaSO(type) {
    try {

        if (type == 'create' || type == 'edit') {

            // Get required field values from sales order
            var soid = nlapiGetRecordId();
            nlapiLogExecution('DEBUG', 'SO id:', soid);
            var objso = nlapiLoadRecord('salesorder', soid);
            var _order_no = objso.getFieldValue('tranid'); //sales order
            var cust_mail = objso.getFieldValue('custbody2'); //Customer Email
            var sales_rep = objso.getFieldValue('salesrep'); //sales Rep
            var customer = objso.getFieldValue('entity'); //Customer
            var item_count = objso.getLineItemCount('item'); //stock number

            //Loop through each to check whether Gemstone page is generated or not if not then created as per criteria
            for (var i = 1; i <= item_count; i++) {
                //Get item Id
                var item_id = objso.getLineItemValue('item', 'item', i);

                //Get fields values from item page
                var item_fields = nlapiLookupField('inventoryitem', item_id, ['custitem20', 'custitem178', 'custitem198']);
                var category = item_fields.custitem20;
                var planning_category = item_fields.custitem178;
                var unique_diamond = item_fields.custitem198;

                //Check required condition
                if ((category == 15 || category == 18 || category == 20 || category == 31 || category == 14 || category == 8 ||
                        category == 21) && (planning_category == 6) && (unique_diamond !== "T")) {
                    var filter = [];
                    var cols = [];
                    filter.push(nlobjSearchFilter('custrecord_stock_number_grp', null, 'anyOf', item_id)); //item name
                    filter.push(nlobjSearchFilter('custrecord_sales_order_grp', null, 'anyOf', soid)); //sales order
                    var search = nlapiSearchRecord('customrecord_gemstone_restlet_page', null, filter);
                    if (search) {
                        nlapiLogExecution('DEBUG', 'Record matched, so does not required to generate new record.');
                    } else {
                        //Create New Gemstone Restlet Page
                        var gemResPagecreation = nlapiCreateRecord('customrecord_gemstone_restlet_page'); //Record Type
                        gemResPagecreation.setFieldValue('custrecord_request_type_grp', 1); //Request Type:sold
                        gemResPagecreation.setFieldValue('custrecord_stock_number_grp', item_id); //Stock Number
                        gemResPagecreation.setFieldValue('custrecord_sales_order_grp', soid); //sales order
                        gemResPagecreation.setFieldValue('custrecord_customer_grp', customer); //Customer Email
                        gemResPagecreation.setFieldValue('custrecord_sales_rep_grp', sales_rep); //sales Rep


                        //Get Customer Email from customer Id
                        var filters = new Array();
                        var col = new Array();
                        filters.push(new nlobjSearchFilter('internalid', null, 'anyof', customer));
                        col.push(new nlobjSearchColumn('email'));
                        var searchCust = nlapiSearchRecord('customer', null, filters, col);
                        if (searchCust) {
                            gemResPagecreation.setFieldValue('custrecord_customer_email_grp', searchCust[0].getValue('email')); //Customer Email
                        }

                        //Submit Gemstone Restlet Page
                        var record_id = nlapiSubmitRecord(gemResPagecreation, true, true);
                        nlapiLogExecution('DEBUG', 'New Gemstone Page is created with the Id: ', record_id);
                    }
                }
            }
        }
    } catch (exp) {
        nlapiLogExecution('DEBUG', 'Error', exp.message);

    }
}