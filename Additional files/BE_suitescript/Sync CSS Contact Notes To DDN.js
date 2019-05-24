/**
 * Script Author : Tanuja Srivastav (tanuja@inoday.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (User Event Script)
 * Script Name   : Sync CSS Contact Notes To DDN.js
 * Created Date  : June 13, 2018
 * Last Modified Date : 
 * Comments : Sync CSS Contact Notes with Delivery Date Notes (sales order)
 * SS URL :     https://system.sandbox.netsuite.com/app/common/scripting/script.nl?id=2880&whence=
 * Production URL: https://system.na3.netsuite.com/app/common/scripting/script.nl?id=2313&whence=
 * Script URL: 
 */
// Sync CSS Contact Notes from delivery Date Push Record with Delivery Date Notes (sales order)
//nlapiLogExecution("Debug", "FLOStart", new Date().getTime());

function syncCssContactNotesToDDN(type) {
    try {
        var recordtype = nlapiGetRecordType();
        nlapiLogExecution('DEBUG', 'recordtype #', recordtype);
        var deliverydateNotes, newDDN = '';
        var id = nlapiGetRecordId();
       // nlapiLogExecution('DEBUG', 'id #', id);
      // code to sync CSS Contact notes OF DD Push Logs to Delivery Date Notes on SO
        if (recordtype == 'customrecorddelivery_date_push_log') {
            if (type == 'edit' || type == 'create') {
                var soid = nlapiGetFieldValue('custrecordsales_order_number');
                 nlapiLogExecution('DEBUG', 'soid #', soid);
                var csscontactnotes = nlapiGetFieldValue('custrecordcss_contact_notes');
                 nlapiLogExecution('DEBUG', 'csscontactnotes #', csscontactnotes);
                if (csscontactnotes != '' && csscontactnotes != null) {
                    deliverydateNotes = nlapiLookupField('salesorder', soid, 'custbody150');
                    nlapiLogExecution('DEBUG', 'deliverydateNotes #', deliverydateNotes);
                    if (deliverydateNotes == '' && deliverydateNotes == null) {
                        newDDN = csscontactnotes;
                    } else {
                        newDDN = csscontactnotes + '\n' + deliverydateNotes;
                    }
                   nlapiLogExecution('DEBUG', 'newDDN #', newDDN);
                    nlapiSubmitField('salesorder', soid, 'custbody150', newDDN);
                }
            }
        }
      	// end code
		// code to concatenate value of Delivery Date Notes Of SO if user edit value of CSS Contact notes directly on SO
        if (recordtype == 'salesorder') {
            if (type == 'edit') {
                deliverydateNotes = nlapiLookupField('salesorder', id, 'custbody150');
              nlapiLogExecution('DEBUG', 'deliverydateNotes #', deliverydateNotes);
			  deliverydateNotes=replaceAll(deliverydateNotes,'\r\n','\n')
                // if (deliverydateNotes!='' && deliverydateNotes!=null){					   
                var oldObj = nlapiGetOldRecord();
                var oldDDN = oldObj.getFieldValue('custbody150');
                nlapiLogExecution('DEBUG', 'oldDDN #', oldDDN);
				 oldDDN=replaceAll(oldDDN,'\r\n','\n')
                if (oldDDN != '' && oldDDN != null && (deliverydateNotes!= oldDDN)) {
                    if (deliverydateNotes != '' && deliverydateNotes != null) {
                        newDDN = deliverydateNotes + '\n' + oldDDN;
                    } else {
                        newDDN = oldDDN;
                    }
                    nlapiLogExecution('DEBUG', 'newDDN #', newDDN);
                    nlapiSubmitField('salesorder', id, 'custbody150', newDDN);

                }
                //nlapiSetFieldValue('custbody150', newDDN);

            }
        }
      // end code
    } catch (er) {
    nlapiLogExecution('Debug', 'Error On Page', er.message);
}

}

 function replaceAll(str, find, replace) {
     return str.replace(new RegExp(find, 'g'), replace);
 }