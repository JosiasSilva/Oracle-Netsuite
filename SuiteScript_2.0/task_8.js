/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/

define(['N/record', 'N/log','N/format'],
function (record, log,format) {
    function beforeLoad(context) {
        var holiday = ["05/27/2019", "04/26/2019", "04/29/2019"];
        var startDate = new Date();
        var endDate = new Date(startDate.setDate(startDate.getDate() + 1));
        var date = endDate.getDate();
        var month = endDate.getMonth() + 1; // Months are zero based
        var year = endDate.getFullYear();

        if (endDate.getDay() == 6) {
            endDate = new Date(endDate.setDate(endDate.getDate() + 2));
        } else if (endDate.getDay() == 0) {
            endDate = new Date(endDate.setDate(endDate.getDate() + 1));
        }

        if (holiday.length <= 10) {
            for (i = 0; i < holiday.length; i++) {
                if ((month + '/' + date + '/' + year) === (holiday[i])) {
                    endDate = new Date(endDate.setDate(endDate.getDate() + 1));
                }
            }
        }
        var newRec = context.newRecord;

        log.debug({
            title: 'Debug Entry',
            details: 'cat ' + 'executed'
        });


        newRec.setValue(
            'custbody_dummy_delivery_date1',
           format.format({ value: "5/16/2019", type: format.Type.DATE })

            
        );
    }

    return {
        beforeLoad: beforeLoad
    }
}
)