/** 
 * Script Author 						: 	Tanuja Srivastav (tanuja@inoday.com)
 * Author Desig. 						: 	Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   						: 	Scheduled Script
 * Created Date  						: 	April 17, 2018
 * Last Modified Date 					:  	April 17, 2018
 * Comments                 			: 	Script will Create Customer Deposite
 * Script Name                          :   Update Sales Order.js
 * Sandbox Scheduled Script URL 		:   /app/common/scripting/script.nl?id=2743&e=T
 */
function updateSalesOrders(type) {
    try {
        nlapiLogExecution('DEBUG', 'type#', type);
        var logid = nlapiGetContext().getSetting('SCRIPT', 'custscript_logid');
        nlapiLogExecution('DEBUG', 'logid#', logid);
        var depositarr, user, date;
        if (logid != "" && logid != null) {
            depositarr = nlapiLookupField('customrecord_deposit_arr_log', logid, 'custrecord_jsondata');
            user = nlapiLookupField('customrecord_deposit_arr_log', logid, 'custrecord_user');
            depositarr = JSON.parse(depositarr);
            date = nlapiDateToString(new Date(), 'date');
            for (var x = 0; x < depositarr.length; x++) {
                nlapiSubmitField("salesorder", depositarr[x].soId, ["custbodylast_deposit_date", "custbodylast_deposit_status", "custbodylast_deposit_amount", "custbody_user_email"], [date, "Pending", depositarr[x].amount, user]);
            }
            nlapiDeleteRecord('customrecord_deposit_arr_log', logid);
        } else {
            nlapiLogExecution('DEBUG', 'in else block#', logid);
            var columns = new Array();
            columns[0] = new nlobjSearchColumn('custrecord_jsondata');
            columns[1] = new nlobjSearchColumn('custrecord_user');

            var searchresults = nlapiSearchRecord('customrecord_deposit_arr_log', null, null, columns);

            for (var i = 0; searchresults != null && i < searchresults.length; i++) {
                var id = searchresults[i].getId();
                nlapiLogExecution('DEBUG', 'id#', id);
                var jsondata = searchresults[i].getValue('custrecord_jsondata');
                user = searchresults[i].getValue('custrecord_user');
                nlapiLogExecution('DEBUG', 'in else block user#', user);
                depositarr = JSON.parse(jsondata);
                date = nlapiDateToString(new Date(), 'date');
                nlapiLogExecution('DEBUG', 'in else block date#', date);
                for (var x = 0; x < depositarr.length; x++) {
                    nlapiSubmitField("salesorder", depositarr[x].soId, ["custbodylast_deposit_date", "custbodylast_deposit_status", "custbodylast_deposit_amount", "custbody_user_email"], [date, "Pending", depositarr[x].amount, user]);
                }
                nlapiDeleteRecord('customrecord_deposit_arr_log', id);
            }
        }
    } catch (er) {
        nlapiLogExecution("Debug", "Error Details", er.message);
    }
}