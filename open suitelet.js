/**  
 *      custom id = (id=2630)
 * 
 *      TYPE ---> Client
        NAME ---> open suitelet
        ID -----> customscript2630
 */


function openSuitelet() {
    var url = nlapiResolveURL('suitelet', 'customscript2629', 'customdeploy1');

    window.open(url);
}

function check() {
    if (nlapiGetFieldValue('custpage_selectfield') == '0') {
        prompt('please select atleast one value');
    }
    else {
        openSuiteletafterclicknext();
    }
}

function openSuiteletafterclicknext() {
    var url1 = nlapiResolveURL('suitelet', 'customscript_suiteletaftersublistitem', 'customdeploy1');

    window.open(url1);
}

function closeWindow() {
    window.close();
}


function back() {
    //history.back.go(-1);
}

function saveRecord() {
    var customerName = nlapiGetFieldValue("custpage_sample_field");
    var dropOff = nlapiGetFieldValue('custpage_selectfield');
    var placeOfSale = nlapiGetFieldValue('custpage_selectfield1');
    var customerIssues = nlapiGetFieldValue('custpage_textfield15');
    var wearHabbits = nlapiGetFieldValue('custpage_textfield');
    var noticeIssue = nlapiGetFieldValue('custpage_field2');
    var customerTemp = nlapiGetFieldValue('custpage_field3');
    var insurance = nlapiGetFieldValue('custpage_field4');
    var contactAfterInspection = nlapiGetFieldValue('custpage_field5');
    var deliveryDate = nlapiGetFieldValue('custpage_date');
    var returnLabelStatus = nlapiGetFieldValue('custpage_selectfield5');
    

    var salesOrder = nlapiCreateRecord('salesorder');
    salesOrder.setFieldValue('entity', customerName);
    salesOrder.setFieldValue('trandate', deliveryDate);
    salesOrder.setFieldValue('class', placeOfSale);
    salesOrder.setFieldValue('custbody6', deliveryDate);
    salesOrder.setFieldValue('custbody_drop_off', dropOff);
    salesOrder.setFieldValue('custbody_yelping_since', customerIssues);
    salesOrder.setFieldValue('custbody_yelp_1_star_reviews', wearHabbits);
    salesOrder.setFieldValue('custbody_ops_internal_notes', noticeIssue);
    salesOrder.setFieldValue('custbody310', customerTemp);
    salesOrder.setFieldValue('custbody154', insurance);
    salesOrder.setFieldValue('custbody_yelp_elite_status', contactAfterInspection);
    salesOrder.setFieldValue('custbody308', returnLabelStatus);
   // salesOrder.setFieldValue('custbody308', returnLabelStatus);
    salesOrder.setLineItemValue("item",'item','1924056',1);
    salesOrder.commitLineItem('item')
    


    var internalId = nlapiSubmitRecord(salesOrder);
    alert(internalId);

}