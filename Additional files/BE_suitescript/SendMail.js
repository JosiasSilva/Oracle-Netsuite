/**
 * Script Author : Priti Tiwari (priti.tiwari@inoday.com)
 * Author Design. : Sr. Developer, Inoday Consultancy Pvt. Ltd.
 * Script Type   : Suitscript (User Event Script)
 * Script Name   : 
 * Created Date  : July 14, 2018 
 * Comments : 
 * SS URL : 
 * Script URL:https://system.netsuite.com/app/common/scripting/script.nl?id=2326
 */
function SendMailToCustomer(type) {
    try {
        if (type == 'create') {

            //get newly created appointment 
          var newId=nlapiGetRecordId();
			var newAppointment= nlapiLoadRecord('calendarevent',newId);
            //var newAppointment = nlapiGetNewRecord();
            //var newId = newAppointment.getId();


            nlapiLogExecution('DEBUG', '<After Submit Appointment> Id:' + newId);
            var customerMail = newAppointment.getFieldValue("custevent_customer_email");
            //get session token
            var token = nlapiLookupField("customrecord_setster_authentication", "1", "custrecord_setster_auth_session_token");
            nlapiLogExecution('debug','customerMail is',customerMail);
            nlapiLogExecution('debug','token value is',token);

            if (customerMail) {
                var companyId = newAppointment.getFieldValue("company");
                var companyFName = nlapiLookupField('customer', companyId, 'firstname');
                var startdate = newAppointment.getFieldValue("startdate");
                var starttime = newAppointment.getFieldValue("starttime");
                var startdateFormatted = nlapiStringToDate(startdate, 'datetime');
                var calendarLocation = newAppointment.getFieldValue("custevent_calendar_location");

                var varDate = startdate;
                var newDate = varDate.split('/');
                var newminutes = '';
                if (starttime != null && starttime != 'undefined') {
                    var newTime = starttime.split(':');
                    if (newTime[1] != null && newTime[1] != 'undefined') {
                        newminutes = newTime[1].split(' ');

                        if (newminutes[1] == 'pm' && newTime[0] == 12) {
                            newTime[0] = newTime[0];
                        } else if (newminutes[1] == 'pm' && newTime[0] < 12) {
                            newTime[0] = 12 + parseInt(newTime[0]);
                        } else if (newminutes[1] == 'am' && newTime[0] == 12) {
                            newTime[0] = 12 - parseInt(newTime[0]);
                        } else if (newminutes[1] == 'am' && newTime[0] < 12) {
                            newTime[0] = newTime[0];
                        }

                        //var retDate =  newDate[2] + '-' + newDate[0] + '-' + newDate[1] + ' 16:25:00';

                        var DateData = newDate[2] + '-' + GetValue(newDate[0]) + '-' + GetValue(newDate[1]);
                        var TimeData = GetValue(newTime[0]) + ':' + newminutes[0] + ':00'; // time in hh:mm:00 where hh is from 0 to 24

                        // get retDate in yyyy-MM-dd hh:MM:00 format
                        var retDate = newDate[2] + '-' + GetValue(newDate[0]) + '-' + GetValue(newDate[1]) + ' ' + GetValue(newTime[0]) + ':' + newminutes[0] + ':00';
                        nlapiLogExecution("debug", "Date time : ", retDate);
                    }
                }



                var ns_locArr = ['1', '2', '3', '4', '5', '6', '7'];
                var locNameArr = ['San Francisco', 'Los Angeles', 'Boston', 'Chicago', 'SD (San Diego)', 'Washington DC', 'Denver'];
                var setster_locArr = ['20677', '20611', '22671', '23584', '23815', '23820', '24223'];
                var locationid = '0';
                var index = ns_locArr.indexOf(calendarLocation);
               nlapiLogExecution('debug','calendar location index is ',index);
                if (index != -1) {
                    locationid = setster_locArr[index];
                    locName = locNameArr[index];
                    //get setster appointment  id
                    var a = {
                        "User-Agent-x": "SuiteScript-Call"
                    };

                    var response = nlapiRequestURL('https://www.setster.com/api/v2/appointment/?session_token=' + token + '&client_email=' + customerMail + '&start_date=' + retDate + '&location_id=' + locationid + '', null, a, null);


                    var responsebody = JSON.parse(response.getBody());
                    var retData = responsebody['data'];
                    nlapiLogExecution('debug','retData is ',JSON.stringify(retData));
                    var setsterAppointmentId;
                    if (retData.length == 0) {
                        nlapiLogExecution("debug", "Existing App. does not match for update. ", retData.length);
                    } else {
                        if (retData.length > 0) {
                            for (var i = 0; i < retData.length; i++) {
                                if (retData[i].ews_id != "" && retData[i].ews_id != null) {
                                    var apptId = JSON.parse(retData[i].ews_id).appointment_id; //Added by ajay 24Nov 2016
                                    nlapiLogExecution("debug", "Created appt Id on setster is : ", apptId);

                                    if (newId == retData[i].ews_id || newId == apptId) {
                                        setsterAppointmentId = retData[i].id;
                                        nlapiLogExecution('debug', 'setster id=' + setsterAppointmentId);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (setsterAppointmentId) {
                        var linkReschedule = "https://brilliantearth.setster.com/?id=" + setsterAppointmentId + "&h=" + token + "&act=reschedule";
                        var linkCancel = "https://brilliantearth.setster.com/?id=" + setsterAppointmentId + "&h=" + token + "&act=cancel";
                       var bodyMsg = "Hi " + companyFName + "," + "<p>Thank you for scheduling an appointment with Brilliant Earth! To help us provide you with the best possible experience at your upcoming Brilliant Earth appointment, please share your jewelry and gemstone preferences with us here if you have not already done so. Please contact us at 800-691-0952 with any questions.<p>To cancel this appointment, please follow this link (<a href=" + linkCancel + ">Cancel</a>)<p>To make a change to this appointment please follow this link (<a href=" + linkReschedule + ">Reschedule</a>). If it is within 24 hours of your appointment and you wish to move it to another time on the same day, please call us at 800-691-0952 so that can we can ensure the products you want to see will be available on your desired date.<p>Best,<br/>The Brilliant Earth Team";

                        nlapiSendEmail(20561, customerMail, "Your Brilliant Earth Appointment Request", bodyMsg);
                        //nlapiSendEmail(20561, "priti.tiwari@inoday.com", "Your Brilliant Earth Appointment Request", bodyMsg);
                        nlapiLogExecution("debug", "Mail sent to " + customerMail);
                    }
                }
            }
        }
    } catch (ex) {
        nlapiLogExecution("DEBUG", "Error", ex.message);
    }
}

function GetValue(val) {
    var value = val;
    if (val < 10) {
        value = "0" + val;
    }
    return value;
}