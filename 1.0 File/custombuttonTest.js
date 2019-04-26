/**  
 *      custom id = (id=2628)
 * 
 *      TYPE ---> User Event
        NAME ---> customButtonTest
        ID -----> customscript2628
 */



function beforeLoad(type, form) {
	if (nlapiGetRecordType() == 'salesorder') {
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
	else {
		var fld = form.addField('custpage_inlineavinash', 'inlinehtml');
		fld.setDefaultValue("<script>window.addEventListener('DOMContentLoaded', function f(e) {\
    var e = document.getElementById('datecreated_fs_lbl_uir_label');\
    var p = e.parentElement;\
    p.setAttribute('style', 'background:yellow !important');\
});\
var e1 = document.getElementById('email_fs_lbl_uir_label');\
var p1 = e1.parentElement;\
p1.setAttribute('style', 'background:yellow !important');\
</script>")
	}

}