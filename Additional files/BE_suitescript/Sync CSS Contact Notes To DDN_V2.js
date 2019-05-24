/**
 * Script Author : Tanuja Srivastav (tanuja@inoday.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (User Event Script)
 * Script Name   : Sync CSS Contact Notes To DDN.js
 * Created Date  : June 13, 2018
 * Last Modified Date : August 29, 2018
 * Modified By: Nikhil Bhutani(08/29/2018)
 * Comments : Sync CSS Contact Notes with Delivery Date Notes (sales order)
 * Sandbox SS URL :     https://system.netsuite.com/app/common/scripting/script.nl?id=2313&whence=
 * Production SS URL: https://system.na3.netsuite.com/app/common/scripting/script.nl?id=2313&whence=
 */
// Sync CSS Contact Notes from delivery Date Push Record with Delivery Date Notes (sales order)
//nlapiLogExecution("Debug", "FLOStart", new Date().getTime());
function syncCssContactNotesToDDN(type) {
	try {
		var recordtype = nlapiGetRecordType();
		// nlapiLogExecution('DEBUG', 'recordtype #', recordtype);
		var deliverydateNotes, newDDN = '';
		var id = nlapiGetRecordId();
		// nlapiLogExecution('DEBUG', 'id #', id);
		// code to sync CSS Contact notes OF DD Push Logs to Delivery Date Notes on SO
		if (recordtype == 'customrecorddelivery_date_push_log') {
			if (type == 'edit' || type == 'create' || type == 'xedit') {
				// var soid = nlapiGetFieldValue('custrecordsales_order_number');
				var soid = nlapiLookupField('customrecorddelivery_date_push_log', id, 'custrecordsales_order_number')
				// nlapiLogExecution('DEBUG', 'soid #', soid);
				var csscontactnotes = nlapiGetFieldValue('custrecordcss_contact_notes');
				// nlapiLogExecution('DEBUG', 'csscontactnotes #', csscontactnotes);
				if (csscontactnotes != '' && csscontactnotes != null) {
					deliverydateNotes = nlapiLookupField('salesorder', soid, 'custbody150');
					// nlapiLogExecution('DEBUG', 'deliverydateNotes #', deliverydateNotes);
					if (deliverydateNotes == '' && deliverydateNotes == null) {
						newDDN = csscontactnotes;
					} else {
						/* Start - Added by Nikhil Bhutani - 08/28/2018 */
						var oldDDPushLogRecord = nlapiGetOldRecord();
						if (oldDDPushLogRecord) {
							var oldCSSContactNotes = oldDDPushLogRecord.getFieldValue('custrecordcss_contact_notes');
							deliverydateNotes = replaceAll(deliverydateNotes, '\r', '\n');
							deliverydateNotes = replaceAll(deliverydateNotes, '\n\n', '\n');
							csscontactnotes = replaceAll(csscontactnotes, '\r', '\n');
							csscontactnotes = replaceAll(csscontactnotes, '\n\n', '\n');
							oldCSSContactNotes = replaceAll(oldCSSContactNotes, '\r', '\n');
							oldCSSContactNotes = replaceAll(oldCSSContactNotes, '\n\n', '\n');
							if (csscontactnotes.indexOf(oldCSSContactNotes) != -1) {
								csscontactnotes = csscontactnotes.replace(oldCSSContactNotes, '');
							}
						}
						newDDN = csscontactnotes + '\n' + deliverydateNotes;
					}
					newDDN = replaceAll(newDDN, '\r', '\n');
					newDDN = replaceAll(newDDN, '\n\n', '\n');
					/* End - Added by Nikhil Bhutani - 08/28/2018 */
					// nlapiLogExecution('DEBUG', 'newDDN #', newDDN);
					nlapiSubmitField('salesorder', soid, 'custbody150', newDDN);
				}
			}
		}
		// end code
		// code to concatenate value of Delivery Date Notes Of SO if user edit value of CSS Contact notes directly on SO
		if (recordtype == 'salesorder') {
			if (type == 'edit' || type == 'xedit') {
				deliverydateNotes = nlapiLookupField('salesorder', id, 'custbody150');
				// nlapiLogExecution('DEBUG', 'deliverydateNotes #', deliverydateNotes);
				if (deliverydateNotes != '' && deliverydateNotes != null) {
					deliverydateNotes = replaceAll(deliverydateNotes, '\r\n', '\n');
				}
				// if (deliverydateNotes!='' && deliverydateNotes!=null){
				var oldObj = nlapiGetOldRecord();
				var oldDDN = oldObj.getFieldValue('custbody150');
				//nlapiLogExecution('DEBUG', 'oldDDN #', oldDDN);	
				if (oldDDN != '' && oldDDN != null) {
					oldDDN = replaceAll(oldDDN, '\r\n', '\n');
				}
				if (oldDDN != '' && oldDDN != null && (deliverydateNotes != oldDDN)) {
					if (deliverydateNotes != '' && deliverydateNotes != null) {
						/* Start - Added by Nikhil Bhutani - 08/28/2018 */
					   //  nlapiLogExecution('DEBUG', 'DeliveryDate != null');
						if (deliverydateNotes.indexOf(oldDDN) != -1) {
							deliverydateNotes = deliverydateNotes.replace(oldDDN, '');
						}
						newDDN = deliverydateNotes + '\n' + oldDDN;
					} else {
						newDDN = oldDDN;
					}
					newDDN = replaceAll(newDDN, '\r', '\n');
					newDDN = replaceAll(newDDN, '\n\n', '\n');
					/* End - Added by Nikhil Bhutani - 08/28/2018 */
					// nlapiLogExecution('DEBUG', 'newDDN #', newDDN);
					nlapiSubmitField('salesorder', id, 'custbody150', newDDN);

				}
			}
		}
		// end code
	} catch (er) {
		nlapiLogExecution('Debug', 'Error On Page', er.message);
	}

}

function replaceAll(str, find, replace) {
	if(str && str!= null && str != 'undefined' && str != '')
	{
		return str.trim().replace(new RegExp(find, 'g'), replace).trim();
	}
  else
    {
    	return '';
    }
}