function updatedApptsFromSetsterToNS() 
{
    try {
        var a = {
            "User-Agent-x": "SuiteScript-Call"
        };
        //var sdate='2016-01-01';
        var today = new Date();
        today.setDate(today.getDate() - 1);
        var date = today.toISOString().substring(0, 10);
        nlapiLogExecution("Debug", "Date", date);
        var token = nlapiLookupField("customrecord_setster_authentication", "1", "custrecord_setster_auth_session_token");
        var response = nlapiRequestURL('https://www.setster.com/api/v2/appointment?session_token=' + token + '&updated_after=' + date + '&end=0', null, a, null);
        var responsebody = JSON.parse(response.getBody());
        var retData = responsebody['data'];
        nlapiLogExecution("Debug", "Data In", responsebody);
        for (var i = 0; i < retData.length; i++) {
            if (retData[i].client_email != '' && retData[i].client_email != null && retData[i].client_email == 'eaito0916@gmail.com') {
                //nlapiLogExecution("Debug", "Entering if client_name = TEST Jake Johnsen",retData[i].client_email)
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
				if(JSON.parse(retData[i].custom_fields)[9]){
                var new_ns_appt_id = JSON.parse(retData[i].custom_fields)[9][0]; 
                if (retData[i].status == 2 && (new_ns_appt_id!='' && new_ns_appt_id!=null)) {
                    try {
                        var appObj = nlapiLoadRecord('calendarevent', new_ns_appt_id);
                        appObj.setFieldValue('starttime', stTime);
                        appObj.setFieldValue('endtime', edTime);
                        appObj.setFieldValue('startdate', startDate);
                        appObj.setFieldValue('enddate', endDate);
                        var apptmtId = nlapiSubmitRecord(appObj, true, true);
                        nlapiLogExecution("DEBUG", "Today's Reschedule appointment:", apptmtId);
                    } catch (e) {
                        nlapiLogExecution("error", "Error Handling Reschedule appointment", "Details: " + e.message);
                    }
                }
                
			    if (retData[i].status == 3 && (new_ns_appt_id!='' && new_ns_appt_id!=null)) {
                    try {
                        var appObj = nlapiLoadRecord('calendarevent', new_ns_appt_id);
                        var appt_title = appObj.getFieldValue("title");
                        nlapiLogExecution("debug", "Appt Title", appt_title);
                        var post_appt_status = appObj.getFieldValue("custevent_post_appt_status");
                        appObj.setFieldValue('starttime', stTime);
                        appObj.setFieldValue('endtime', edTime);
                        appObj.setFieldValue('startdate', startDate);
                        appObj.setFieldValue('custevent_calendar_location', retData[i].location_id);
                        appObj.setFieldValue('enddate', endDate);
                        if (post_appt_status != 11) {
                            appObj.setFieldValue('custevent_post_appt_status', 11);
                            appObj.setFieldValue('title', "CANCELLED " + appt_title);
                            var apptmtId = nlapiSubmitRecord(appObj, true, true);
                            nlapiLogExecution("DEBUG", "Cancelled appointment Id",apptmtId);
                        } 
                    } catch (e) {
                        nlapiLogExecution("error", "Error Handling Cancelled Appointment:", "Details: " + e.message);
                    }
                }
			  }
            }
        }
    } catch (err) {
        nlapiLogExecution("error", "Error Handling During Execution Of Script is :", err.message);
    }
}