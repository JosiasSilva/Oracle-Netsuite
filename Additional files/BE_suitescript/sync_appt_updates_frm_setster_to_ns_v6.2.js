/*
 * Script Author 		: 	Unknown
 * Author Designation 	: 	Unknown
 * Script Type 			:	SuiteScript (Scheduled)
 * Description 			:	
 * Created Date 		:	Unknown
 * Last Modified Date	:	February 14, 2019 (Please put a comment with date when code is modified)
 * Comments 			:	// 02/13/2019 - Inoday - NS-1532 - Edited the logic where to first save the appointment and then compose and send mail based on new updated values.
 *						:	// 02/14/2019 - Inoday - NS-1498 - Edited the the 'bodyMsg' parameter that didn't have well defined tags.
 *						:	// 02/20/2019 - Inoday - NS-1498 - Edited the the 'bodyMsg' parameter and added the <html> and <body> tags in the variable. 
 * SB SS URL 			:	https://system.netsuite.com/app/common/scripting/script.nl?id=2270
 * Production SS URL	:	https://system.na3.netsuite.com/app/common/scripting/script.nl?id=2270
 */
function updatedApptsFromSetsterToNS() {
	try {
		var a = {
			"User-Agent-x": "SuiteScript-Call"
		};
		//var sdate='2016-01-01';
		var apptmtId; // Added for NS-1532 by Nikhil on February 13, 2019
		var today = new Date();
		today.setDate(today.getDate() - 1);
		var date = today.toISOString().substring(0, 10);
		nlapiLogExecution("Debug", "Date", date);
		var token = nlapiLookupField("customrecord_setster_authentication", "1", "custrecord_setster_auth_session_token");
		var response = nlapiRequestURL('https://www.setster.com/api/v2/appointment?session_token=' + token + '&updated_after=' + date + '&end=0', null, a, null);
		nlapiLogExecution("Debug", "Response Body", response.getBody());
		var responsebody = JSON.parse(response.getBody());
		var retData = responsebody['data'];
		nlapiLogExecution("Debug", "Data In", responsebody);
		for (var i = 0; i < retData.length; i++) {
			if (retData[i].client_email != '' && retData[i].client_email != null && retData[i].client_email != "dana.lea.allen@gmail.com" && retData[i].client_email != "jeffrey.mallen@yahoo.com") {
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
				if (JSON.parse(retData[i].custom_fields)[9]) {
					var new_ns_appt_id = JSON.parse(retData[i].custom_fields)[9][0];
					var setsterid = retData[i].id;
					//nlapiLogExecution("Debug","Setsterid",setsterid);
					if (retData[i].status == 2 && (new_ns_appt_id != '' && new_ns_appt_id != null)) {
						try {
							/*
							var appObj = nlapiLoadRecord('calendarevent', new_ns_appt_id);
							var reschedule_email = appObj.getFieldValue('custevent_reschedule_email');
							var setsterappid = appObj.getFieldValue('custevent_setsterappid');
							appObj.setFieldValue('starttime', stTime);
							appObj.setFieldValue('endtime', edTime);
							appObj.setFieldValue('startdate', startDate);
							appObj.setFieldValue('enddate', endDate);
							if (setsterappid != setsterid && setsterappid != '' && setsterappid!=null){
								appObj.setFieldValue('custevent_setsterappid',setsterid);
								apptmtId = nlapiSubmitRecord(appObj, true, true); // Added for NS-1532 by Nikhil on February 13, 2019
								SendMailToCustomer(new_ns_appt_id,setsterid);
							}
							if (setsterappid==''|| setsterappid==null){
								appObj.setFieldValue('custevent_setsterappid',setsterid);
								apptmtId = nlapiSubmitRecord(appObj, true, true); // Added for NS-1532 by Nikhil on February 13, 2019
								SendOriginalMailToCustomer(new_ns_appt_id,setsterid);
							}
							nlapiLogExecution("DEBUG", "Today's Reschedule appointment:", apptmtId);
							*/
							var arrLookupField = ['custevent_reschedule_email', 'custevent_setsterappid', 'title', 'custevent_post_appt_status'];
							var lookupFields = nlapiLookupField('calendarevent', new_ns_appt_id, arrLookupField);
							var arrSetFields = ['starttime', 'endtime', 'startdate', 'enddate', 'custevent_setsterappid'];
							var arrSetValues = [stTime, edTime, startDate, endDate, setsterid];
							nlapiSubmitField('calendarevent', new_ns_appt_id, arrSetFields, arrSetValues);
							nlapiLogExecution("DEBUG", "Fields submitted on appointment", "No record submits were made.");
							if (lookupFields['setsterappid'] != setsterid && lookupFields['setsterappid'] != '' && lookupFields['setsterappid'] != null) {
								SendMailToCustomer(new_ns_appt_id, setsterid);
							}
							if (lookupFields['setsterappid'] == '' || lookupFields['setsterappid'] == null) {
								SendOriginalMailToCustomer(new_ns_appt_id, setsterid);
							}
						} catch (e) {
							nlapiLogExecution("error", "Error Handling Reschedule appointment", "Details: " + e.message);
						}
					}

					if (retData[i].status == 3 && (new_ns_appt_id != '' && new_ns_appt_id != null)) {
						try {
							/*
							var appObj = nlapiLoadRecord('calendarevent', new_ns_appt_id);
							var appt_title = appObj.getFieldValue("title");
							nlapiLogExecution("debug", "Appt Title", appt_title);
							var post_appt_status = appObj.getFieldValue("custevent_post_appt_status");
							appObj.setFieldValue('starttime', stTime);
							appObj.setFieldValue('endtime', edTime);
							appObj.setFieldValue('startdate', startDate);
							appObj.setFieldValue('enddate', endDate);
							if (post_appt_status != 11) {
								appObj.setFieldValue('custevent_post_appt_status', 11);
								appObj.setFieldValue('title', "CANCELLED " + appt_title);
								appObj.setFieldValue('custevent8','T');
								appObj.setFieldValue('custeventreason_for_cancellation',5);
								var apptmtId = nlapiSubmitRecord(appObj, true, true);
								nlapiLogExecution("DEBUG", "Cancelled appointment Id",apptmtId);
								SendMailToCustomer(new_ns_appt_id,setsterid);
							}
							*/
							var arrLookupField = ['custevent_reschedule_email', 'custevent_setsterappid', 'title', 'custevent_post_appt_status'];
							var lookupFields = nlapiLookupField('calendarevent', new_ns_appt_id, arrLookupField);
							var arrSetFields = ['starttime', 'endtime', 'startdate', 'enddate'];
							var arrSetValues = [stTime, edTime, startDate, endDate];
							if (lookupFields['custevent_post_appt_status'] != 11) {
								arrSetFields.push('custevent_post_appt_status', 'title', 'custevent8', 'custeventreason_for_cancellation');
								arrSetValues.push('11', 'CANCELLED ' + lookupFields['appt_title'], 'T', '5');
								nlapiSubmitField('calendarevent', new_ns_appt_id, arrSetFields, arrSetValues);
								SendMailToCustomer(new_ns_appt_id,setsterid);
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

function SendMailToCustomer(apptId, setsID) {
    try {

        //get newly created appointment 
        var newAppointment = nlapiLoadRecord('calendarevent', apptId);
        nlapiLogExecution('Audit', '<NetSuite Appointment> Id:' + apptId);
        nlapiLogExecution('Audit', '<Setster Appointment> Id:' + setsID);
        var customerMail = newAppointment.getFieldValue("custevent_customer_email");
        var apptDate = newAppointment.getFieldValue("startdate");
        var dateString = new Date(apptDate).toUTCString();
        dateString = dateString.split(' ').slice(0, 4).join(' ');
        var apptTime = newAppointment.getFieldValue("starttime");
        var apptType = newAppointment.getFieldValue("custevent_appointment_type");
        var calendarloc = newAppointment.getFieldValue("custevent_calendar_location");
        var calendarloctext = newAppointment.getFieldText("custevent_calendar_location");
        var post_appt_status = newAppointment.getFieldValue("custevent_post_appt_status");
        var cancelled_setster = newAppointment.getFieldValue("custevent8");
        var regExp = /\(([^)]+)\)/;
        var matches = regExp.exec(calendarloctext);
        if (matches) {
            calendarloctext = matches[1];
        }
        var timesufix;
        if (calendarloc == 3 || calendarloc == 6) {
            timesufix = "ET";
        } else if (calendarloc == 4) {
            timesufix = "CT";
        } else if (calendarloc == 7) {
            timesufix = "MT";
        } else {
            timesufix = "PT";
        }
        apptTime = apptTime + " " + timesufix;
        //get session token
        var token = nlapiLookupField("customrecord_setster_authentication", "1", "custrecord_setster_auth_session_token");
        nlapiLogExecution('Audit', 'customerMail is', customerMail);
        nlapiLogExecution('Audit', 'token value is', token);
        var hash = nlapiRequestURL('https://www.setster.com/api/v2/appointment/hash?appointment_id=' + setsID + '&session_token=' + token + '&hash_type=reschedule', 'GET');
        //nlapiLogExecution('debug','Reschedule Hash URL',hash);
        // nlapiLogExecution('debug','hash data',hash.getBody());
        var hashdata = JSON.parse(hash.getBody());
        var hashnum_reschedule = hashdata['data'];
        // nlapiLogExecution('debug','Reschedule Hash Number',hashnum_reschedule);
        var cancelhash = nlapiRequestURL('https://www.setster.com/api/v2/appointment/hash?appointment_id=' + setsID + '&session_token=' + token + '&hash_type=cancel', 'GET');
        //nlapiLogExecution('debug','Cancel Hash URL',cancelhash);
        // nlapiLogExecution('debug','hash data',cancelhash.getBody());
        var cancelhashdata = JSON.parse(cancelhash.getBody());
        var hashnum_cancel = cancelhashdata['data'];
        //nlapiLogExecution('debug','Cancel Hash Number',hashnum_cancel);

        if (customerMail) {
            var companyId = newAppointment.getFieldValue("company");
            var companyFName = nlapiLookupField('customer', companyId, 'firstname');
            var linkReschedule = "https://brilliantearth.setster.com/?id=" + setsID + "&h=" + hashnum_reschedule + "&act=reschedule";
            nlapiLogExecution('Audit', 'Reschedule Link', linkReschedule);
            var linkCancel = "https://brilliantearth.setster.com/widget/cancel_appointment.php?id=" + setsID + "&h=" + hashnum_cancel;
            nlapiLogExecution('Audit', 'Cancel Link', linkCancel);
            var linkShare = "https://www.brilliantearth.com/appointment-preferences/";
            var bodyMsg;
            if (post_appt_status == 11) {
                /* Start: Commented the bodyMsg here and added new bodyMsg field below for NS-1498 on February 14, 2019*/
                // bodyMsg="Hi " + companyFName + "," + "<p>You've successfully cancelled your appointment at Brilliant Earth. If you have any questions please contact us at 800-691-0952. Thank you for taking the time to let us know you will not be able to make it and we hope to see you another time.<p>-Brilliant Earth Team";

                bodyMsg = "<html><body style=\"font-family:Verdana,Arial,Helvetica,sans-serif;font-size:10pt;\"><p>Hi " + companyFName + "," + "</p><p>You've successfully cancelled your appointment at Brilliant Earth. If you have any questions please contact us at 800-691-0952. Thank you for taking the time to let us know you will not be able to make it and we hope to see you another time.</p><p>-Brilliant Earth Team</p></body></html>";
                /* End: Commented the bodyMsg here and added new bodyMsg field below for NS-1498 on February 14, 2019*/
            } else {
                /* Start: Commented the bodyMsg here and added new bodyMsg field below for NS-1498 on February 14, 2019*/
                // bodyMsg="Hi " + companyFName + "," + "<p>You've successfully changed your Brilliant Earth appointment time to "+dateString+" at "+apptTime+" in "+calendarloctext+". If you have not already done so, please <a href= "+linkShare+">share</a> your jewelry preferences. This will enable us to provide you with the best possible experience at your upcoming appointment.<p>We look forward to your visit!<br>-Brilliant Earth Team<p>Other Inquiries?<br><a href=" + linkReschedule + ">Reschedule</a> this appointment<br><a href=" + linkCancel + ">Cancel</a> this appointment<br>Please call us at 800-691-0952 with any questions.";

                bodyMsg = "<html><body style=\"font-family:Verdana,Arial,Helvetica,sans-serif;font-size:10pt;\"><p>Hi " + companyFName + "," + "</p><p>You've successfully changed your Brilliant Earth appointment time to " + dateString + " at " + apptTime + " in " + calendarloctext + ". If you have not already done so, please <a href=" + linkShare + ">share</a> your jewelry preferences. This will enable us to provide you with the best possible experience at your upcoming appointment.</p><p>We look forward to your visit!<br />-Brilliant Earth Team</p><p>Other Inquiries?<br /><a href=" + linkReschedule + ">Reschedule</a> this appointment<br /><a href=" + linkCancel + ">Cancel</a> this appointment<br />Please call us at 800-691-0952 with any questions.</p></body></html>";
                /* End: Commented the bodyMsg here and added new bodyMsg field below for NS-1498 on February 14, 2019*/
            }
            //nlapiSendEmail(20561, customerMail, "Your Brilliant Earth Appointment Request", bodyMsg);

            // commented by saurabh 10/6/2018 in concern of NS-1374  nlapiSendEmail(20561, customerMail, "Your Brilliant Earth Appointment Request", bodyMsg,null,"eito@brilliantearth.com",null,null,true);

            //nlapiSendEmail(20561, "eaito0916@gmail.com", "Your Brilliant Earth Appointment Request", bodyMsg,null,null,null,null,true);

            nlapiLogExecution("Audit", "Mail sent to " + customerMail);

            // add by saurabh 10/6/2018 in concern of NS-1374

            var customerObject = {};
            customerObject['entity'] = companyId;
            //nlapiSendEmail(20561, "eito@brilliantearth.com", "Your Brilliant Earth Appointment Request", bodyMsg,null,"eito@brilliantearth.com", customerObject ,null,true);
            nlapiLogExecution("DEBUG", "Body of the mail sent to customer", bodyMsg); // Added for NS-1498 on February 14, 2019
            nlapiSendEmail(20561, customerMail, "Your Brilliant Earth Appointment Request", bodyMsg, null, "eito@brilliantearth.com", customerObject, null, true);
        }

    } catch (ex) {
        nlapiLogExecution("Audit", "Error", ex.message);
    }
}

function SendOriginalMailToCustomer(apptId, setsId) {
    try {

        //get newly created appointment 
        var newAppointment = nlapiLoadRecord('calendarevent', apptId);
        nlapiLogExecution('DEBUG', '<NetSuite Appointment> Id:' + apptId);
        nlapiLogExecution('DEBUG', '<Setster Appointment> Id:' + setsId);
        var customerMail = newAppointment.getFieldValue("custevent_customer_email");
        var apptDate = newAppointment.getFieldValue("startdate");
        var dateString = new Date(apptDate).toUTCString();
        dateString = dateString.split(' ').slice(0, 4).join(' ');
        var apptTime = newAppointment.getFieldValue("starttime");
        var apptType = newAppointment.getFieldValue("custevent_appointment_type");
        var calendarloc = newAppointment.getFieldValue("custevent_calendar_location");
        var calendarloctext = newAppointment.getFieldText("custevent_calendar_location");
        var regExp = /\(([^)]+)\)/;
        var matches = regExp.exec(calendarloctext);
        if (matches) {
            calendarloctext = matches[1];
        }
        var timesufix;
        if (calendarloc == 3 || calendarloc == 6) {
            timesufix = "ET";
        } else if (calendarloc == 4) {
            timesufix = "CT";
        } else if (calendarloc == 7) {
            timesufix = "MT";
        } else {
            timesufix = "PT";
        }
        apptTime = apptTime + " " + timesufix;
        //get session token
        var token = nlapiLookupField("customrecord_setster_authentication", "1", "custrecord_setster_auth_session_token");
        nlapiLogExecution('debug', 'customerMail is', customerMail);
        nlapiLogExecution('debug', 'token value is', token);
        var hash = nlapiRequestURL('https://www.setster.com/api/v2/appointment/hash?appointment_id=' + setsId + '&session_token=' + token + '&hash_type=reschedule', 'GET');
        nlapiLogExecution('debug', 'Reschedule Hash URL', hash);
        nlapiLogExecution('debug', 'hash data', hash.getBody());
        var hashdata = JSON.parse(hash.getBody());
        var hashnum_reschedule = hashdata['data'];
        nlapiLogExecution('debug', 'Reschedule Hash Number', hashnum_reschedule);
        var cancelhash = nlapiRequestURL('https://www.setster.com/api/v2/appointment/hash?appointment_id=' + setsId + '&session_token=' + token + '&hash_type=cancel', 'GET');
        nlapiLogExecution('debug', 'Reschedule Hash URL', cancelhash);
        nlapiLogExecution('debug', 'hash data', cancelhash.getBody());
        var cancelhashdata = JSON.parse(cancelhash.getBody());
        var hashnum_cancel = cancelhashdata['data'];
        nlapiLogExecution('debug', 'Cancel Hash Number', hashnum_cancel);

        if (customerMail) {
            var companyId = newAppointment.getFieldValue("company");
            var companyFName = nlapiLookupField('customer', companyId, 'firstname');
            var linkReschedule = "https://brilliantearth.setster.com/?id=" + setsId + "&h=" + hashnum_reschedule + "&act=reschedule";
            nlapiLogExecution('debug', 'Reschedule Link', linkReschedule);
            var linkCancel = "https://brilliantearth.setster.com/widget/cancel_appointment.php?id=" + setsId + "&h=" + hashnum_cancel;
            nlapiLogExecution('debug', 'Cancel Link', linkCancel);
            var linkShare = "https://www.brilliantearth.com/appointment-preferences/";
            var bodyMsg;
            if (apptType == 2 || apptType == 28) {
                /* Start: Commented the bodyMsg here and added new bodyMsg field below for NS-1498 on February 14, 2019*/
                // bodyMsg="Hi " + companyFName + "," + "<p>Thank you for scheduling an appointment with Brilliant Earth! Your appointment is scheduled for "+dateString+" at "+apptTime+" in "+calendarloctext+". <p>We look forward to your visit!<br>-Brilliant Earth Team<p>Other Inquiries?<br><a href=" + linkReschedule + ">Reschedule</a> this appointment<br><a href=" + linkCancel + ">Cancel</a> this appointment<br>Please call us at 800-691-0952 with any questions.";

                bodyMsg = "<html><body style=\"font-family:Verdana,Arial,Helvetica,sans-serif;font-size:10pt;\"><p>Hi " + companyFName + "," + "</p><p>Thank you for scheduling an appointment with Brilliant Earth! Your appointment is scheduled for " + dateString + " at " + apptTime + " in " + calendarloctext + ".</p><p>We look forward to your visit!<br />-Brilliant Earth Team</p><p>Other Inquiries?<br /><a href=" + linkReschedule + ">Reschedule</a> this appointment<br /><a href=" + linkCancel + ">Cancel</a> this appointment<br />Please call us at 800-691-0952 with any questions.</p></body></html>";
                /* End: Commented the bodyMsg here and added new bodyMsg field below for NS-1498 on February 14, 2019*/
            } else {
                /* Start: Commented the bodyMsg here and added new bodyMsg field below for NS-1498 on February 14, 2019*/
                // bodyMsg="Hi " + companyFName + "," + "<p>Thank you for scheduling an appointment with Brilliant Earth! Your appointment is scheduled for "+dateString+" at "+apptTime+" in "+calendarloctext+". If you have not already done so, please <a href= "+linkShare+">share</a> your jewelry preferences. This will enable us to provide you with the best possible experience at your upcoming appointment.<p>We look forward to your visit!<br>-Brilliant Earth Team<p>Other Inquiries?<br><a href=" + linkReschedule + ">Reschedule</a> this appointment<br><a href=" + linkCancel + ">Cancel</a> this appointment<br>Please call us at 800-691-0952 with any questions.";
                bodyMsg = "<html><body style=\"font-family:Verdana,Arial,Helvetica,sans-serif;font-size:10pt;\"><p>Hi " + companyFName + "," + "</p><p>Thank you for scheduling an appointment with Brilliant Earth! Your appointment is scheduled for " + dateString + " at " + apptTime + " in " + calendarloctext + ". If you have not already done so, please <a href=" + linkShare + ">share</a> your jewelry preferences. This will enable us to provide you with the best possible experience at your upcoming appointment.</p><p>We look forward to your visit!<br />-Brilliant Earth Team</p><p>Other Inquiries?<br /><a href=" + linkReschedule + ">Reschedule</a> this appointment<br /><a href=" + linkCancel + ">Cancel</a> this appointment<br />Please call us at 800-691-0952 with any questions.</p></body></html>";
                /* End: Commented the bodyMsg here and added new bodyMsg field below for NS-1498 on February 14, 2019*/
            }
            //nlapiSendEmail(20561, customerMail, "Your Brilliant Earth Appointment Request", bodyMsg);
            //commented by saurabh in concern of NS-1374   on 10/6/2018 nlapiSendEmail(20561,customerMail, "Your Brilliant Earth Appointment Request", bodyMsg,null,"eito@brilliantearth.com",null,null,true);
            //nlapiSendEmail(20561, "eaito0916@gmail.com", "Your Brilliant Earth Appointment Request", bodyMsg,null,null,null,null,true);

            nlapiLogExecution("debug", "Mail sent to " + customerMail);

            //added by saurabh in concern of NS-1374  on 10/6/2018
            var customerObject = {};
            customerObject['entity'] = companyId;
            nlapiLogExecution("DEBUG", "Body of the mail sent to customer", bodyMsg); // Added for NS-1498 on February 14, 2019
            nlapiSendEmail(20561, customerMail, "Your Brilliant Earth Appointment Request", bodyMsg, null, "eito@brilliantearth.com", customerObject, null, true);
        }

    } catch (ex) {
        nlapiLogExecution("DEBUG", "Error", ex.message);
    }
}