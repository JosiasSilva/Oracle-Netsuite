/**  
 *      custom id = (id=2628)
 * 
 *      TYPE ---> User Event
        NAME ---> customButtonTest
        ID -----> customscript2628
 */



function beforeLoad(type, form) {

	var itemCount = nlapiGetLineItemCount('item');
	var haveCustomeKey = '';
	for (var d = 1; d <= itemCount; d++) {
		haveCustomeKey = nlapiGetLineItemText('item', 'item', d);
		if (haveCustomeKey.indexOf("custom") == -1) {
			nlapiLogExecution('debug', 'executed', 'executed');
			form.addButton('custpage_avinashbutton', 'avinash', 'openSuitelet();');
			form.setScript('customscript2630');
			break;
		}
	}
}