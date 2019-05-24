function UpdatedAppointmentFromSetsterToNetsuite() {
    try {
        var a = {
            "User-Agent-x": "SuiteScript-Call"
        };
        //var sdate='2016-01-01';
        var today = new Date();
        today.setDate(today.getDate() - 1);
        var date = today.toISOString().substring(0, 10);
        var token = nlapiLookupField("customrecord_setster_authentication", "1", "custrecord_setster_auth_session_token");
        var response = nlapiRequestURL('https://www.setster.com/api/v2/appointment?session_token=' + token + '&updated_after=' + date + '&end=0', null, a, null);
        var responsebody = JSON.parse(response.getBody());
        var retData = responsebody['data'];
        for (var i = 0; i < retData.length; i++) {
			if(retData[i].client_name == 'Test eric Ito')
			{
              nlapiLogExecution("Debug", "Entering if client_name = Test Eric Ito");
            var stDate = retData[i].start_date.split('-');
            var edDate = retData[i].end_date.split('-');
            var startDate = stDate[1] + '/' + stDate[2].split(' ')[0] + '/' + stDate[0];
            var endDate = edDate[1] + '/' + edDate[2].split(' ')[0] + '/' + edDate[0];
            var stTime = stDate[2].split(' ')[1];
            var edTime = edDate[2].split(' ')[1];
            var sstTime = stTime.split(':')[0];
            var eedTime = edTime.split(':')[0];
            var apptDate = nlapiStringToDate(startDate);
            var dayOfWeek = apptDate.getDay();
            if (sstTime < 12) {
                stTime = sstTime + ":" + stTime.split(':')[1] + " am";
              nlapiLogExecution("DEBUG", "stTime in if", stTime);
            } else if (sstTime == 12) {
                stTime = sstTime + ":" + stTime.split(':')[1] + " pm";
              nlapiLogExecution("DEBUG", "stTime in else if1: ", stTime);
            } else if (sstTime == 24) {
                stTime = (parseInt(sstTime) - 12) + ":" + stTime.split(':')[1] + " am";
              nlapiLogExecution("DEBUG", "stTime in else if2: ", stTime);
            } else {
                stTime = (parseInt(sstTime) - 12) + ":" + stTime.split(':')[1] + " pm";
              nlapiLogExecution("DEBUG", "stTime in else: ", stTime);
            }
            if (eedTime < 12) {
                edTime = eedTime + ":" + edTime.split(':')[1] + " am";
            } else if (eedTime == 12) {
                edTime = eedTime + ":" + edTime.split(':')[1] + " pm";
            } else if (eedTime == 24) {
                edTime = (parseInt(eedTime) - 12) + ":" + edTime.split(':')[1] + " am";
            } else {
                edTime = (parseInt(eedTime) - 12) + ":" + edTime.split(':')[1] + " pm";
            }
            var location = '';
            switch (retData[i].location_id) {
                case '20677': //San Francisco
                    location = '1';
                    break;
                case '20611': //Los Angeles
                    location = '2';
                    break;
                case '22671': //Boston
                    location = '3';
                    break;
                case '23584': //Chicago
                    location = '4';
                    break;
                case '23815': //San Diego
                    location = '5';
                    break;
                case '23820': //Washington DC
                    location = '6';
                    break;
                case '24223': //Denver
                    location = '7';
                    break;
                default:
                    break;
            }
            if (retData[i].status == 2 && retData[i].ews_id != null && retData[i].ews_id != '') {
                try {
                    nlapiLogExecution("DEBUG", "Match appointment InternalId : ", retData[i].ews_id);
                    var appObj = nlapiLoadRecord('calendarevent', retData[i].ews_id);
                  nlapiLogExecution("DEBUG", "stTime before updte", stTime);
                    appObj.setFieldValue('starttime', stTime);
                    appObj.setFieldValue('endtime', edTime);
                    appObj.setFieldValue('startdate', startDate);
                    // appObj.setFieldValue('custevent_calendar_location', location);
                    appObj.setFieldValue('enddate', endDate);
                    var apptmtId = nlapiSubmitRecord(appObj, true, true);
                    nlapiLogExecution("DEBUG", "Today's Reschedule appointment:", apptmtId);
                } catch (e) {
                    nlapiLogExecution("error", "Error Handling Reschedule appointment", "Details: " + e.message);
                }
            } else if (retData[i].status == 3 && retData[i].ews_id != null && retData[i].ews_id != '') {
                try {
                    nlapiLogExecution("DEBUG", "Match appointment InternalId : ", retData[i].ews_id);
					/*
                    var appObj = nlapiLoadRecord('calendarevent', retData[i].ews_id);
                    appObj.setFieldValue('starttime', stTime);
                    appObj.setFieldValue('endtime', edTime);
                    appObj.setFieldValue('startdate', startDate);
                    appObj.setFieldValue('custevent_calendar_location', location);
                    appObj.setFieldValue('enddate', endDate);
                    appObj.setFieldValue('custevent_post_appt_status', 11);
                    var apptmtId = nlapiSubmitRecord(appObj, true, true);
					*/
                    nlapiLogExecution("DEBUG", "Appointment Cancelled");
                } catch (e) {
                    nlapiLogExecution("error", "Error Handling Cancelled Appointment:", "Details: " + e.message);
                }
            }
        }
		}
    } catch (err) {
        nlapiLogExecution("error", "Error Handling During Execution Of Script is :", err.message);
    }
}