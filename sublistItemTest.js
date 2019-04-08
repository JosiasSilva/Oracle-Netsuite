/**  
 *      custom id = (id=2629)
 * 
 *      TYPE ---> Suitelet
        NAME ---> sublistItemTest
        ID -----> customscript2629
 */



function gettingStartedSuitelet(request, response) {
    var form = nlapiCreateForm("Suitelet");

function check() {
    form.addButton('custpage_nextButton', 'Next', 'check();');
    form.setScript("customscript2630");
    // var html = form.addField('custpage_html', 'inlinehtml');

    form.addButton('custpage_nextButton', 'Close', 'close()');
    form.addTab("custpage_to_be_returned_tab", "To Be Returned");
    var field = form.addField('custpage_selectfield', 'select', 'select a item');
    field.addSelectOption('0', '', true);
    field.addSelectOption('1', 'Repair', false);
    field.addSelectOption('2', 'Resize', false);
    field.addSelectOption('3', 'Exchange', false);
    field.addSelectOption('4', 'Setting to be added', false);
    field.addSelectOption('5', 'Engrave', false);
    field.addSelectOption('6', 'Upgrade', false);
    field.addSelectOption('7', 'Reset', false);
    field.addSelectOption('8', 'Size', false);

    response.writePage(form);

}