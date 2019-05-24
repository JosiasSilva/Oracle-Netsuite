nlapiLogExecution("audit","FLOStart",new Date().getTime());
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
      var ptoArr = ["custrecord_pto_employee","custrecord_pto_start_date_requested","custrecord_pto_end_date_requested","custrecord_pto_start_time","custrecord_pto_end_time"];
      var ptoArrVal = nlapiLookupField("customrecord_pto",id,ptoArr);
      var empId = ptoArrVal.custrecord_pto_employee;
      var startDate = ptoArrVal.custrecord_pto_start_date_requested;
      var endDate = ptoArrVal.custrecord_pto_end_date_requested;				
      var startTime = ptoArrVal.custrecord_pto_start_time;
      var endTime = ptoArrVal.custrecord_pto_end_time;
      var empfieldVal = nlapiLookupField("employee",empId,["entityid","location","issalesrep"]);
      var empLocation = empfieldVal.location;
      var empName = empfieldVal.entityid;
      var issalesrep = empfieldVal.issalesrep;
      var empfieldTextVal = nlapiLookupField("employee",empId,"location",true);
      nlapiLogExecution("debug","Employee Inventory Location from Emp List : ",empfieldTextVal);
      if(old_PTO_Status != 2 && new_PTO_Status == 2)//Approved
      {
        var count = 1;
        var appointmentArr=[];
        nlapiLogExecution("debug","empId is : ",empId);
        nlapiLogExecution("debug","startDate is : ",startDate);
        nlapiLogExecution("debug","endDate is : ",endDate);
        nlapiLogExecution("debug","startTime is : ",startTime);
        nlapiLogExecution("debug","endTime is : ",endTime);
        /* var empfieldVal = nlapiLookupField("employee",empId,["entityid","location","issalesrep"]);
        var empLocation = empfieldVal.location;
        var empName = empfieldVal.entityid;
        var issalesrep = empfieldVal.issalesrep;
        var empfieldTextVal = nlapiLookupField("employee",empId,"location",true);
        nlapiLogExecution("debug","Employee Inventory Location from Emp List : ",empfieldTextVal);*/
        if(nlapiStringToDate(startDate)>nlapiStringToDate(endDate)) 
        {
          nlapiLogExecution("Debug","Information","Appointment will not create as pto start date is greater than pto end date,So Try again");
          return false;
        }
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
        var typeofrequest = nlapiLookupField("customrecord_pto",id,"custrecord_pto_type_of_request");//Added by Ravi on 01/06/2017
        nlapiLogExecution("debug","typeofrequest :", typeofrequest);
        if(typeofrequest != 4)//Comp Earned
        {	
          //Create appointment
          for(var i=0; i<count; i++)
          {
            var updateStartDate = nlapiDateToString(nlapiAddDays(nlapiStringToDate(startDate),i));
            var apptObj = nlapiCreateRecord("calendarevent");
            var empCalLoc = getEmpInventoryLocation(empfieldTextVal);
            nlapiLogExecution("debug","Employee Calander Location :",empCalLoc);
            apptObj.setFieldText("custevent_calendar_location",empCalLoc);
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
            apptObj.setFieldValue("custevent_pto_link",id);// added new field
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
                apptObj.setLineItemValue('attendee','attendee',3,3352759); // for BOS Calendar
              }
              else if(empLocation == 18)
              {
                apptObj.setLineItemValue('attendee','attendee',3,5988025); // for CHI Calendar
              }
              else if(empLocation == 25)
              {
                apptObj.setLineItemValue('attendee','attendee',3,8876586); // for SD Calendar
              }
              else if(empLocation == 26)
              {
                apptObj.setLineItemValue('attendee','attendee',3,8876687); // for DC Calendar
              }
              else if(empLocation == 30)
              {
                apptObj.setLineItemValue('attendee','attendee',3,10464582); // for DEN Calendar
              }
            }				
            var apptId = nlapiSubmitRecord(apptObj,true,true);
            appointmentArr.push(apptId);
            nlapiLogExecution("debug","Created appointment Id is :",apptId);
          }
          nlapiSubmitField('customrecord_pto',id,['custrecord_pto_add_to_calendar','custrecord_appointment_link'],['T',appointmentArr]);
        }
      }
      if(old_PTO_Status == 2 && new_PTO_Status == 2)  //  Ajit (Task:-NS-784) 11/7/2017 update Startdate, starttime, endtime
      {
        //added on 20/jul/2017
        if(nlapiStringToDate(startDate)>nlapiStringToDate(endDate))
        {
          nlapiLogExecution("Debug","Information","Appointment start date will not update as pto start date is greater than pto end date,So Try again");
          return false;
        }
        AddAppointmentLink(empName,startTime,endTime,empId,id,issalesrep,empfieldTextVal);
        var arrSearchFilter = new Array();
        arrSearchFilter[0] = new nlobjSearchFilter('custevent_pto_link', null,'is',id);
        var arrSearchColumn = new Array(); 
        arrSearchColumn[0] = new nlobjSearchColumn('custevent_pto_link'); 
        var mySearch =  nlapiSearchRecord('calendarevent', null, arrSearchFilter, arrSearchColumn); //Search Appointment for PTO link
        for(var rs in mySearch)
        {
          var idappt=  mySearch[rs].id;
          var updateStartDate = nlapiAddDays(nlapiStringToDate(startDate),rs);
          if(updateStartDate <= nlapiStringToDate(endDate))
          {
            nlapiSubmitField("calendarevent", idappt ,["startdate","starttime","endtime"],[updateStartDate,startTime,endTime]);
            nlapiLogExecution("debug","Appointment Information" , "Appointment start date has been updated having # ID :: "+idappt);
          }
          else
          {
            nlapiDeleteRecord("calendarevent",idappt);
            nlapiLogExecution("debug","Appointment Deletion Information" , "Appointment Deleted having id#:: "+idappt);
          }
        }
        //End Here
      }
      if((old_PTO_Status != 3 && new_PTO_Status == 3)||(old_PTO_Status != 1 && new_PTO_Status == 1))  //  Ajit (Task:-NS-784) 11/7/2017 Un Approved or Rejected
      {
        var arrSearchFilter = new Array();
        arrSearchFilter[0] = new nlobjSearchFilter('custevent_pto_link', null,'is',id);
        var arrSearchColumn = new Array();
        arrSearchColumn[0] = new nlobjSearchColumn('custevent_pto_link'); 
        var mySearch =  nlapiSearchRecord('calendarevent', null, arrSearchFilter, arrSearchColumn); ////Search Appointment for PTO link
        for (var rs in mySearch )
        {
          var idappt=  mySearch[rs].id;
          nlapiDeleteRecord("calendarevent" , idappt) ;
          nlapiLogExecution("debug","Appointment Deletion Information" , "Appointment Deleted :: "+idappt);
        }
      }						
    }
  }
  catch(err)
  {
    nlapiLogExecution("debug","Error raised on creation of an appointment is : ",err.message);
  }
}

function getEmpInventoryLocation(empLoc)
{
  // nlapiLogExecution("debug","Employee Location:",empLoc);
  // saved search id 5876 production
  // saved search id  5773 sandbox
  var search = nlapiSearchRecord(null,5876);
  var  chkValue=false;
  var emp_cal_loc ='';
  for(var i=0; i<search.length;i++)
  {
    emp_cal_loc= search[i].getText('custrecord_calendar_location');
    //nlapiLogExecution("debug","counter value:",i);
    if(emp_cal_loc == empLoc)
    {
      chkValue = true;
      //nlapiLogExecution("debug","Final Employee Location:",emp_cal_loc);
      break;
    }
  }
  if(chkValue==true)
    return emp_cal_loc;
  else
    return '';

}

function AddAppointmentLink(empName,startTime,endTime,empId,id,issalesrep,empfieldTextVal)
{
  var old_satrdate_requested = nlapiGetOldRecord().getFieldValue("custrecord_pto_start_date_requested");
  nlapiLogExecution("debug","Old Start Date requested: ",old_satrdate_requested);

  var old_enddate_requested = nlapiGetOldRecord().getFieldValue("custrecord_pto_end_date_requested");
  nlapiLogExecution("debug","Old End Date requested: ",old_enddate_requested);

  var old_satrdate_requested_time = new Date(old_satrdate_requested).getTime();
  var old_enddate_requested_time = new Date(old_enddate_requested).getTime();

  var old_date_day_diff =  Math.abs(old_satrdate_requested_time - old_enddate_requested_time)/1000/24/60/60;
  nlapiLogExecution("debug","Old date day diff: ",old_date_day_diff);


  var new_startdate_requested = nlapiGetNewRecord().getFieldValue("custrecord_pto_start_date_requested");
  nlapiLogExecution("debug","New Start Date requested: ",new_startdate_requested);

  var new_enddate_requested = nlapiGetNewRecord().getFieldValue("custrecord_pto_end_date_requested");
  nlapiLogExecution("debug","New End Date requested: ",new_enddate_requested);

  var new_satrdate_requested_time = new Date(new_startdate_requested).getTime();
  var new_enddate_requested_time = new Date(new_enddate_requested).getTime();

  var new_date_day_diff =  Math.abs(new_satrdate_requested_time - new_enddate_requested_time)/1000/24/60/60;
  nlapiLogExecution("debug","New date day diff: ",new_date_day_diff);

  var old_pto_start_time = nlapiGetOldRecord().getFieldValue("custrecord_pto_start_time");
  nlapiLogExecution("debug","Old PTO Start Time: ",old_pto_start_time);

  var old_pto_end_time = nlapiGetOldRecord().getFieldValue("custrecord_pto_end_time");
  nlapiLogExecution("debug","Old PTO End Time: ",old_pto_end_time);

  if(parseInt(new_date_day_diff)>parseInt(old_date_day_diff))
  {
    var appointmentArr =[];
    var arrSearchFilter = new Array();
    arrSearchFilter[0] = new nlobjSearchFilter('custevent_pto_link', null,'is',id);
    var arrSearchColumn = new Array(); 
    arrSearchColumn[0] = new nlobjSearchColumn('custevent_pto_link'); 
    var mySearch =  nlapiSearchRecord('calendarevent', null, arrSearchFilter, arrSearchColumn); //Search Appointment for PTO link
    for(var rs in mySearch)
    {
      appointmentArr.push(mySearch[rs].id);
    }
    var net_date_day_diff =  parseInt(new_date_day_diff) -  parseInt(old_date_day_diff);
    nlapiLogExecution("debug","Net date day diff: ",net_date_day_diff);
    for(var i=0;i<net_date_day_diff;i++)
    {
      var updateStartDate = nlapiDateToString(nlapiAddDays(nlapiStringToDate(old_enddate_requested),i+1));
      var apptObj = nlapiCreateRecord("calendarevent");
      var empCalLoc = getEmpInventoryLocation(empfieldTextVal);
      nlapiLogExecution("debug","Employee Calander Location :",empCalLoc);
      apptObj.setFieldText("custevent_calendar_location",empCalLoc);
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
      apptObj.setFieldValue("custevent_pto_link",id);
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
          apptObj.setLineItemValue('attendee','attendee',3,3352759); // for BOS Calendar
        }
        else if(empLocation == 18)
        {
          apptObj.setLineItemValue('attendee','attendee',3,5988025); // for CHI Calendar
        }
        else if(empLocation == 25)
        {
          apptObj.setLineItemValue('attendee','attendee',3,8876586); // for SD Calendar
        }
        else if(empLocation == 26)
        {
          apptObj.setLineItemValue('attendee','attendee',3,8876687); // for DC Calendar
        }
        else if(empLocation == 30)
        {
          apptObj.setLineItemValue('attendee','attendee',3,10464582); // for DEN Calendar
        }
      }				
      var apptId = nlapiSubmitRecord(apptObj,true,true);
      appointmentArr.push(apptId);
      nlapiLogExecution("debug","Appointment Result", "Appointment[NEW] has been created having Id is ::"+apptId);
    }
    nlapiSubmitField('customrecord_pto',id,"custrecord_appointment_link",appointmentArr);
  }
}