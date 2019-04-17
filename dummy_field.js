// function beforeLoad(type, form) {
//     if (type == 'view' || type == 'edit') {

//         var PO_ID = nlapiGetRecordId();
//         var PO_Type = nlapiGetRecordType();
//         var purchaseOrder = nlapiLoadRecord(PO_Type, PO_ID);

//         var customTab = form.addTab('custpage_mycustomtab', 'Dummy Tab');
//         var dummyField = form.addField('custpage_dummy_delivery_date', 'date', 'Dummy Delivery Date', null, 'custpage_mycustomtab');
//         dummyField.setMandatory(true);
        
//     }
// }

function beforeSubmit(type, form) {

    var holiday = ["05/27/2019", "04/26/2019", "04/29/2019"];
    var startDate = new Date();
    var endDate = new Date(startDate.setDate(startDate.getDate() + 1));
    var date = endDate.getDate();
    var month = endDate.getMonth() + 1; //Months are zero based
    var year = endDate.getFullYear();

    if(endDate.getDay() == 6) {
        endDate = new Date(endDate.setDate(endDate.getDate() + 2));
    } else if(endDate.getDay() == 0) {
        endDate = new Date(endDate.setDate(endDate.getDate() + 1));   
    }

    if (holiday.length <= 10) {
        for(i = 0; i < holiday.length; i++) {
            if((month+'/'+date+'/'+year) === (holiday[i])) {
                endDate = new Date(endDate.setDate(endDate.getDate() + 1));
            }
        }
    }
   // nlapiGetFieldValue('custpage_dummy_delivery_date');
    nlapiSetFieldValue('custbodycustpage_dummy_delivery_date', endDate);
}



/**  optimized code but having condition that date should be sorted in ascending order */

var holiday = ["4/18/2019", "4/19/2019", "4/20/2019", "4/22/2019", "4/23/2019", "4/24/2019", "4/25/2019", "4/26/2019"];
var startDate = new Date();
var endDate = new Date(startDate.setDate(startDate.getDate() + 1));


for (i = 0; i < holiday.length; i++) {
    var date = endDate.getDate();
    var month = endDate.getMonth() + 1; //Months are zero based
    var year = endDate.getFullYear();
    if ((month + '/' + date + '/' + year) === (holiday[i])) {
        endDate = new Date(endDate.setDate(endDate.getDate() + 1));
        if (endDate.getDay() == 6) {
            endDate = new Date(endDate.setDate(endDate.getDate() + 2));
        } else if (endDate.getDay() == 0) {
            endDate = new Date(endDate.setDate(endDate.getDate() + 1));
        }
    }
}
