function PTOAutomationApprove(type)
{
	try
	{	   
		if(type == 'edit')
		{			
			var id =nlapiGetRecordId(); 			
			var old_PTO_Status = nlapiGetOldRecord().getFieldValue("custrecord_pto_status");
            nlapiLogExecution("debug","old Pto Status : "+old_PTO_Status);
			var new_PTO_Status = nlapiGetNewRecord().getFieldValue("custrecord_pto_status");
            nlapiLogExecution("debug","New Pto Status : "+new_PTO_Status);
            			
			if(old_PTO_Status != 2 && new_PTO_Status == 2)//Approved
			{
                                var count = 1;
				var ptoArr = ["custrecord_pto_employee","custrecord_pto_start_date_requested","custrecord_pto_end_date_requested","custrecord_pto_start_time","custrecord_pto_end_time"];
				var ptoArrVal = nlapiLookupField("customrecord_pto",id,ptoArr);
			    var empId = ptoArrVal.custrecord_pto_employee;
				var startDate = ptoArrVal.custrecord_pto_start_date_requested;
				var endDate = ptoArrVal.custrecord_pto_end_date_requested;				
				var startTime = ptoArrVal.custrecord_pto_start_time;
                var endTime = ptoArrVal.custrecord_pto_end_time;
				nlapiLogExecution("debug","empId is : ",empId);
				nlapiLogExecution("debug","startDate is : ",startDate);
				nlapiLogExecution("debug","endDate is : ",endDate);
				nlapiLogExecution("debug","startTime is : ",startTime);
                nlapiLogExecution("debug","endTime is : ",endTime);
			    var empfieldVal = nlapiLookupField("employee",empId,["entityid","location","issalesrep"]);
				var empLocation = empfieldVal.location;
				var empName = empfieldVal.entityid;
				var issalesrep = empfieldVal.issalesrep;
				while(startDate != endDate )
				{
					var startdate1 = nlapiStringToDate(startDate);
					nlapiLogExecution("debug","start date1 is : ",startdate1);
					var enddate1 = nlapiStringToDate(endDate);
					nlapiLogExecution("debug","end date1 is : ",enddate1);
					var newstartdate = nlapiAddDays(startdate1,1);
					startDate = nlapiDateToString(newstartdate);
					nlapiLogExecution("debug","new startdate is :",startDate);
					count++;					
                                }
                                nlapiLogExecution("debug","count value is :",count);
				startDate = ptoArrVal.custrecord_pto_start_date_requested;
				
				//Create appointment
				for(var i=0; i<count; i++)
				{
					var updateStartDate = nlapiDateToString(nlapiAddDays(nlapiStringToDate(startDate),i));
					var apptObj = nlapiCreateRecord("calendarevent");
					if(empLocation == 2)
					{
						apptObj.setFieldValue("custevent_calendar_location",1);
					}
					else if(empLocation == 10)
					{
						apptObj.setFieldValue("custevent_calendar_location",2);
					}
					else if(empLocation == 14)
					{
						apptObj.setFieldValue("custevent_calendar_location",3);
					}
					apptObj.setFieldValue("customform",44);
					apptObj.setFieldValue("title","OOO "+empName);
					apptObj.setFieldValue("startdate",updateStartDate);
					apptObj.setFieldValue("custevent_appointment_type",4);//Internal
					apptObj.setFieldValue("status","CONFIRMED");
					apptObj.setFieldValue("starttime",startTime);
					apptObj.setFieldValue("endtime",endTime);
					apptObj.setFieldValue("accesslevel","BUSY");
					apptObj.setFieldValue("organizer",empId);
                                        apptObj.setFieldValue("custevent_employee_attendee",empId);
					apptObj.setLineItemValue('attendee','attendee',1,4935444); // for PTO Calendar
                                        apptObj.setLineItemValue('attendee','attendee',2,empId); // for My Calendar
                                        if(issalesrep == 'T')
					{
						if(empLocation == 2)
						{
							apptObj.setLineItemValue('attendee','attendee',3,1965272); // for SF Calendar
						}
						else if(empLocation == 10)
						{
							apptObj.setLineItemValue('attendee','attendee',3,1965169); // for LA Calendar
						}
						else if(empLocation == 14)
						{
							apptObj.setLineItemValue('attendee','attendee',3,210278); // for BE Calendar
						}
					}				
					var apptId = nlapiSubmitRecord(apptObj,true,true);
					nlapiLogExecution("debug","Created appointment Id is :",apptId);
				}
			}						
		}
	}
	catch(err)
	{
		nlapiLogExecution("debug","Error raised on creation of an appointment is : ",err.message);
	}
}