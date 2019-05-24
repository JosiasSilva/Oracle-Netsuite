nlapiLogExecution("audit","FLOStart",new Date().getTime());
/**
 * Script Author : Sandeep Kumar (sandeep.kumar@inoday.com/sksandy28@gmail.com)
 * Author Desig. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (Scheduled Script)
 * Script Name   : 
 * Created Date  : June 08, 2017
 * Last Modified Date : 
 * Comments : 
 * SS URL : 
 * Script URL:
 */
function removeAppointments() 
{
    try {
       
        if (nlapiGetContext().getRemainingUsage() < 500) {
            var stateMain = nlapiYieldScript();
            if (stateMain.status == 'FAILURE') {
                nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
                throw "Failed to yield script";
            } else if (stateMain.status == 'RESUME') {
                nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
            }
        }
       // var mySearch = nlapiLoadSearch(null, 5894); // For Sandbox
		var mySearch = nlapiLoadSearch(null, 6369); // For Production
        var searchresult = [];
        var resultset = mySearch.runSearch();
        var searchid = 0;
        do {
            var resultslice = resultset.getResults(searchid, searchid + 1000);
            if (resultslice != null && resultslice != '') {
                for (var rs in resultslice) {
                    searchresult.push(resultslice[rs]);
                    searchid++;
                }

            }
        } while (resultslice.length >= 1000);
        var searchCount = searchresult.length;
        if (searchCount > 0) {
            for (var j = 0; j < searchresult.length; j++) {
                if (nlapiGetContext().getRemainingUsage() < 500) {
                    var stateMain = nlapiYieldScript();
                    if (stateMain.status == 'FAILURE') {
                        nlapiLogExecution("Debug", "Failed to yield script, exiting: Reason = " + stateMain.reason + " / Size = " + stateMain.size);
                        throw "Failed to yield script";
                    } else if (stateMain.status == 'RESUME') {
                        nlapiLogExecution("Debug", "Resuming script because of " + stateMain.reason + ". Size = " + stateMain.size);
                    }
                }
                var Results = searchresult[j].getAllColumns();
                var appt_id = searchresult[j].getId();
				var obj_appt=nlapiLoadRecord('calendarevent',appt_id)
				obj_appt.setFieldValue('custevent_calendar_location',8);//Cancelled
				var attendee_count=obj_appt.getLineItemCount('attendee');
				for (var i = attendee_count; i>=1; i--) 
				{
					obj_appt.removeLineItem('attendee',i);
				}
				
				nlapiSubmitRecord(obj_appt,false,true);
            }
            // end of for loop
        }

    } catch (e) {
        nlapiLogExecution('error', 'Error', e.message);
    }
}