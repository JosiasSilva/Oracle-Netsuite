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
           // if (retData[i].client_name == 'Test eric Ito' && retData[i].client_email=='eaito0916@gmail.com' ) {
                nlapiLogExecution("Debug", "Appointment Client Name :",retData[i].client_name);
                var stDate = retData[i].start_date.split('-');
                var edDate = retData[i].end_date.split('-');
                var startDate = stDate[1] + '/' + stDate[2].split(' ')[0] + '/' + stDate[0];
                var endDate = edDate[1] + '/' + edDate[2].split(' ')[0] + '/' + edDate[0];
                var stTime = stDate[2].split(' ')[1];
                var edTime = edDate[2].split(' ')[1];
                var sstTime = stTime.split(':')[0];
                var eedTime = edTime.split(':')[0];
                if (retData[i].location_id == '22671' || retData[i].location_id == '23820') {
                    if (sstTime < 10 && sstTime != null) {
                        sstTime = parseInt(sstTime.split('')[1]) + 3;
                    } else {
                        sstTime = (parseInt(sstTime) + 3);
                    }
                    if (eedTime < 10 && eedTime != null) {
                        eedTime = parseInt(eedTime.split('')[1]) + 3;
                    } else {
                        eedTime = (parseInt(eedTime) + 3);
                    }
                }
                //if( retData[i].location_name == 'Chicago')
                if (retData[i].location_id == '23584') {
                    if (sstTime < 10 && sstTime != null) {
                        sstTime = parseInt(sstTime.split('')[1]) + 2;
                    } else {
                        sstTime = (parseInt(sstTime) + 2);
                    }
                    if (eedTime < 10 && eedTime != null) {
                        eedTime = parseInt(eedTime.split('')[1]) + 2;
                    } else {
                        eedTime = (parseInt(eedTime) + 2);
                    }
                }
                if (retData[i].location_id == '24223') {
                    if (sstTime < 10 && sstTime != null) {
                        sstTime = parseInt(sstTime.split('')[1]) + 1;
                    } else {
                        sstTime = (parseInt(sstTime) + 1);
                    }
                    if (eedTime < 10 && eedTime != null) {
                        eedTime = parseInt(eedTime.split('')[1]) + 1;
                    } else {
                        eedTime = (parseInt(eedTime) + 1);
                    }
                }

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

                if (retData[i].status == 2 && retData[i].ews_id != null && retData[i].ews_id != '') {
                    try {
                        nlapiLogExecution("DEBUG", "Match appointment InternalId for Reschedule appointment : ", retData[i].ews_id);
                        var appObj = nlapiLoadRecord('calendarevent', retData[i].ews_id);
                        appObj.setFieldValue('starttime', stTime);
                        appObj.setFieldValue('endtime', edTime);
                        appObj.setFieldValue('startdate', startDate);
                        appObj.setFieldValue('enddate', endDate);
                        var apptmtId = nlapiSubmitRecord(appObj, true, true);
                        nlapiLogExecution("DEBUG", "Today's Reschedule appointment:", apptmtId);
                    } catch (e) {
                        nlapiLogExecution("error", "Error Handling Reschedule appointment", "Details: " + e.message);
                    }
                } else if (retData[i].status == 3 && retData[i].ews_id != null && retData[i].ews_id != '') {
                    try {
                        nlapiLogExecution("DEBUG", "Match appointment InternalId for Cancelled : ", retData[i].ews_id);
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
            //}
        }
    } catch (err) {
        nlapiLogExecution("error", "Error Handling During Execution Of Script is :", err.message);
    }
}