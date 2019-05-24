nlapiLogExecution("audit","FLOStart",new Date().getTime());
function CreateAppointmentInNetsuite()
{
  try
  {
    var Schedule_lead_run=false;
    // var date='2017-08-01';
    var a = {"User-Agent-x": "SuiteScript-Call"};
    var today = new Date();	
    var date = today.toISOString().substring(0, 10);   
    var token = nlapiLookupField("customrecord_setster_authentication","1","custrecord_setster_auth_session_token");

    var response = nlapiRequestURL('https://www.setster.com/api/v2/appointment?session_token='+token+'&start_date='+date+'&end=0', null, a, null);
    nlapiLogExecution("debug","Response Code",response.getCode());
    nlapiLogExecution("debug","Response Body",response.getBody());

    if(response.getCode()=="401")
    {
      var newToken = Setster_Auth();

      response = nlapiRequestURL('https://www.setster.com/api/v2/appointment?session_token='+newToken+'&start_date='+date+'&end=0', null, a, null);
      nlapiLogExecution("debug","Response Code (After Refresh)",response.getCode());
      nlapiLogExecution("debug","Response Body (After Refresh)",response.getBody());
    }

    var responsebody = JSON.parse(response.getBody()) ;
    var retData = responsebody['data'];
    if(!retData)
    {
      return;
    }
    nlapiLogExecution("DEBUG","Return Data from Setster (JSON)",JSON.stringify(retData));
    nlapiLogExecution("DEBUG","Appointment Record : ","Details: " + retData.length);
    var name = "";
    for(var i=0; i<retData.length; i++)
    {
      try
      {
        var clientphone=00000000;
        if((retData[i].status ==0 || retData[i].status ==2) && (retData[i].ews_id ==null  || retData[i].ews_id ==''))
        {

          var customerNameRecord = retData[i].client_name.split(' ');
          var fname='';
          var lname='';
          var location = '';
          var type = '';
          var fname1='';
          var lname1='';
          if(customerNameRecord.length >= 2)
          {     
            for(var k=0; k<customerNameRecord.length-1; k++)
            {
              fname1 += customerNameRecord[k]+' ';
              if(fname1.length > 30){ name = fname1.substring(0,30);} else {fname = fname1;}
            }
            lname1 = customerNameRecord[customerNameRecord.length-1];
            if(lname1.length > 30){lname = lname1.substring(0,30); }else{ lname = lname1;}
          }
          else if(customerNameRecord.length < 2)
          {
            fname1 = customerNameRecord[customerNameRecord.length-1];
            if(fname1.length > 30){fname = fname1.substring(0,30); } else { fname = fname1;}

          }  
          switch(retData[i].type)
          {
            case 'Engagement Ring':
              type='22';
              break;
            case 'Wedding Band':
              type='21';
              break;
            case 'Vintage &amp; Fine Jewelry':
              type='35';
              break;
            case 'Service':
              type='37';
              break;
            case 'Other':
              type='36';
              break;
            case 'Service - Pick Up':
              type='2';
              break;
            case 'Service - Drop Off':
              type='28';
              break;
            default:
          }  

          var custData=JSON.parse(retData[i].custom_fields);
          var OptionalFirstClick = custData[6];
          var FirstClick=''; var FirstClickdate=''; var FirstClickcontent=''; var FirstClickkeyword=''; var FirstClickmedium=''; var parseFirstClick = null; 
          var FirstClickcampaign=''; var FirstClicksource=''; var FirstClickgclid='';

          if(OptionalFirstClick  !=null  && OptionalFirstClick[0] != 'undefined')
          {
            if(OptionalFirstClick[0] == '{' || OptionalFirstClick[0] == '[' || OptionalFirstClick[0] == '"' || OptionalFirstClick[0] == /\\/g || OptionalFirstClick[0] == 't')
            {
              OptionalFirstClick[0] = null;
            }
            if(OptionalFirstClick[0] != null)
            {
              FirstClick = OptionalFirstClick[0];
              FirstClick = JSON.stringify(OptionalFirstClick[0],replacer);		
              if(FirstClick != '[]')
              {
                var FirstClickValues= null;											
                //nlapiLogExecution("debug","First Click1 is :",FirstClick);
                if(parseFirstClick == null)
                {
                  FirstClick = FirstClick.replace('","First Click"]',"").replace('["','').replace('"]','').replace(/\\/g,'').replace(',"First Click"]','').replace('[','').replace('"{','{').replace('}"','}').replace(',"First Click','');
                  FirstClickValues = JSON.parse(FirstClick);
                }

                //nlapiLogExecution("debug","First Click values is :",FirstClickValues);
                if(FirstClickValues !=null)
                {
                  FirstClickdate = FirstClickValues.date; // Date ->custentity125 (First Click Date)
                  FirstClickcontent = FirstClickValues.content; // content ->custentity10 (Campaign Content)
                  FirstClickkeyword = FirstClickValues.keyword; // keyword ->custentity8 (Campaign Term)
                  FirstClickmedium = FirstClickValues.medium; // medium ->custentity9 (Campaign Medium)
                  FirstClickcampaign = FirstClickValues.campaign; // campaign ->custentity6 (Campaign Name)
                  FirstClicksource = FirstClickValues.source; // source ->custentity7 (Campaign Source)
                  FirstClickgclid = FirstClickValues.gclid;// gclid ->custentity11 (Campaign Id Number)
                  nlapiLogExecution("DEBUG","FirstClick : ","FirstClickdate: " + FirstClickdate + ", FirstClickcontent:" + FirstClickcontent + ", FirstClickkeyword:" + FirstClickkeyword + ", FirstClickmedium:" + FirstClickmedium + ", FirstClickcampaign:" + FirstClickcampaign + ", FirstClicksource:" + FirstClicksource + ", FirstClickgclid:" + FirstClickgclid);
                }
              }
            }
          }	

          var OptionalWurfl = custData[7];
          var Wurfl='';var Wurflis_mobile=''; var Wurflcomplete_device_name=''; var Wurflform_factor='';
          var parseWurfl = null;
          if(OptionalWurfl  !=null  && OptionalWurfl[0] != 'undefined')
          {
            if(OptionalWurfl[0] == 't' || OptionalWurfl[0] == 'f' || OptionalWurfl[0] == '{' || OptionalWurfl[0] == '"\"' || OptionalWurfl[0] == ' ')
            { 
              OptionalWurfl[0] = null;
            }
            if(OptionalWurfl[0] != null)
            {
              Wurfl=OptionalWurfl[0];
              Wurfl = JSON.stringify(Wurfl,replacer);
              //nlapiLogExecution("debug","wurfl string values is :",Wurfl);

              if(Wurfl != '[]')
              {
                var WurflValues = null;
                if(parseWurfl == null)
                {
                  Wurfl = Wurfl.replace('","wurfl"]',"").replace('["','').replace('"]','').replace(/\\/g,'').replace('"{','{').replace('}"','}');;	
                  //nlapiLogExecution("debug","Wurfl is :",Wurfl);
                  WurflValues = JSON.parse(Wurfl);
                }												
                //nlapiLogExecution("debug","Wurfl Values is :",WurflValues);
                if(WurflValues !=null)
                {
                  Wurflis_mobile = WurflValues.is_mobile; // is_mobile ->custentity108 (Is Mobile)
                  Wurflcomplete_device_name = WurflValues.complete_device_name; // complete_device_name ->custentity105 (Device Name)
                  Wurflform_factor = WurflValues.form_factor; // form_factor ->custentity106 (Form Factor)
                  nlapiLogExecution("DEBUG","Wurfl : ","Wurflis_mobile: " + Wurflis_mobile + ", Wurflcomplete_device_name:" + Wurflcomplete_device_name + ", Wurflform_factor:" + Wurflform_factor);
                }
              }
            }
          } 


          var OptionalAttributionPath = custData[5];
          var AttributionPath='';
          if(OptionalAttributionPath  !=null)
          {
            AttributionPath=OptionalAttributionPath[0];
          }
          var Optional = custData[1];
          if( Optional != null)
          {
            if(Optional[0] ==null || Optional[0] == '' || Optional[0] ==' ' ) 
            {
              clientphone= '5555555555'
            }
            else
            {
              if(Optional[0].length <7)
              {
                clientphone= '5555555555'
              }
              else
              {
                clientphone=Optional[0];
              }
            }
          }
          else{clientphone= '5555555555'}

          if(clientphone.length < 22)
          {
            switch(retData[i].location_id) 
            {
              case '20677':  //San Francisco
                location='1';
                break;
              case '20611':  //Los Angeles
                location='2';
                break;
              case '22671':  //Boston
                location='3';
                break;
              case '23584':  //Chicago
                location='4';
                break;
              case '23815':  //San Diego
                location='5';
                break;
              case '23820':  //Washington DC
                location='6';
                break;
              case '24223':  //Denver
                location='7';
                break;	
              default:
                break;
            }

            //Date format
            var stDate =retData[i].start_date.split('-');
            var edDate =retData[i].end_date.split('-');
            var startDate =stDate[1]+'/'+stDate[2].split(' ')[0]+'/'+stDate[0];
            var endDate =edDate[1]+'/'+edDate[2].split(' ')[0]+'/'+edDate[0];
            var stTime = stDate[2].split(' ')[1];
            var edTime = edDate[2].split(' ')[1];
            var sstTime =stTime.split(':')[0];
            var eedTime =edTime.split(':')[0];
            if( retData[i].location_id == '22671' || retData[i].location_id == '23820')
            {
              if(sstTime < 10  && sstTime != null)
              {
                sstTime = parseInt(sstTime.split('')[1]) + 3;                                                                        
              }
              else
              {
                sstTime = (parseInt(sstTime)+3);                                       
              }
              if(eedTime < 10  && eedTime != null)
              {                                       
                eedTime = parseInt(eedTime.split('')[1]) + 3;                                   
              }
              else
              {                                       
                eedTime = (parseInt(eedTime)+3); 
              }                                     
            }
            //if( retData[i].location_name == 'Chicago')
            if( retData[i].location_id == '23584')
            {
              if(sstTime < 10  && sstTime != null)
              {
                sstTime = parseInt(sstTime.split('')[1]) + 2;                                                                        
              }
              else
              {
                sstTime = (parseInt(sstTime)+2);                                       
              }
              if(eedTime < 10  && eedTime != null)
              {                                       
                eedTime = parseInt(eedTime.split('')[1]) + 2;                                   
              }
              else
              {                                       
                eedTime = (parseInt(eedTime)+2); 
              }                                     
            }
            if( retData[i].location_id == '24223')
            {
              if(sstTime < 10  && sstTime != null)
              {
                sstTime = parseInt(sstTime.split('')[1]) + 1;                                                                        
              }
              else
              {
                sstTime = (parseInt(sstTime)+1);                                       
              }
              if(eedTime < 10  && eedTime != null)
              {                                       
                eedTime = parseInt(eedTime.split('')[1]) + 1;                                   
              }
              else
              {                                       
                eedTime = (parseInt(eedTime)+1); 
              }                                     
            }

            var apptDate = nlapiStringToDate(startDate);
            var dayOfWeek = apptDate.getDay();

            if( sstTime < 12)
            {        
              stTime = sstTime + ":" + stTime.split(':')[1] + " am";
            } 
            else if( sstTime == 12)
            {        
              stTime = sstTime + ":" + stTime.split(':')[1] + " pm";
            } 
            else if( sstTime == 24)
            {        
              stTime = (parseInt(sstTime)-12) + ":" + stTime.split(':')[1] + " am";
            }         
            else
            {
              stTime = (parseInt(sstTime)-12) + ":" + stTime.split(':')[1] + " pm";
            }

            if( eedTime < 12)
            {
              edTime = eedTime + ":" + edTime.split(':')[1] + " am";
            }
            else if( eedTime == 12)
            {
              edTime = eedTime + ":" + edTime.split(':')[1] + " pm";
            }  
            else if( eedTime == 24)
            {
              edTime = (parseInt(eedTime)-12) + ":" + edTime.split(':')[1] + " am";
            }      
            else
            {
              edTime = (parseInt(eedTime)-12) + ":" + edTime.split(':')[1] + " pm";
            } 

            //For Filter logic of Calendar Location
            var retVal = CheckAppointmentCreationByLocation(dayOfWeek,location);
            if(retVal)
            { 
              var filters = new Array();
              filters[0] = new nlobjSearchFilter('custevent_customer_email', null, 'is',retData[i].client_email);                
              //filters[1] = new nlobjSearchFilter('custevent_customer_phone_number', null, 'is', clientphone);
              filters[1] = new nlobjSearchFilter('startdate', null,'on', startDate);		
              filters[2] = new nlobjSearchFilter('custevent_calendar_location', null, 'is', location);
              if(type!=null && type!='')
              {
                filters[3] = new nlobjSearchFilter('custevent_appointment_type', null, 'is', type);
              }	 
              //nlapiLogExecution("DEBUG", "Filters Values : ", retData[i].client_email);					 
              var columns = new Array(); // new array for columns of the search
              columns[0] = new nlobjSearchColumn('internalid');					 
              var SavedSearch = nlapiSearchRecord('calendarevent', null, filters, columns);
              //nlapiLogExecution("DEBUG","JSON Search Results for client email in calendar event",JSON.stringify(SavedSearch));
              if(SavedSearch != null)
              {
                var Id = SavedSearch[SavedSearch.length-1].getValue('internalid');
                nlapiLogExecution("DEBUG", "Match appointments internalId : ", Id);
              }
              else
              {
                // Added New Logic For [NS-1038] on 04 Jan 2018
                //New Logic Start Here for Prevent Creating Duplicate Leads
                nlapiLogExecution("DEBUG", "Customer/Lead Email:", retData[i].client_email);		
                var filters_email =[];
                filters_email.push(new nlobjSearchFilter("email",null,"is",retData[i].client_email));
                filters_email.push(new nlobjSearchFilter("isinactive",null,"is",'F'));
                var results = nlapiSearchRecord("customer",null,filters_email,null);
                nlapiLogExecution("DEBUG","JSON Result",JSON.stringify(results));
                if(results)
                {
                  var leadId = results[0].getId();
                  nlapiLogExecution("DEBUG","Existing Customer/Lead Id",leadId);
                  var obj_data={
                    stTime:stTime,
                    edTime:edTime,
                    startDate:startDate,
                    endDate:endDate,                                                                                 
                    note:retData[i].note,
                    type:retData[i].type,
                    location_name:retData[i].location_name,
                    location_id:retData[i].location_id,
                    id:retData[i].id,
                    client_email : retData[i].client_email,
                    clientphone : clientphone    
                  }               
                  // nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 1");
                  Create_Appointment(leadId,obj_data,token);
                  //nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 20");
                  Schedule_lead_run=true; 
                  //nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 21");
                }//End Here
                else
                {
                  // Create Lead Record
                  nlapiLogExecution("DEBUG","Create Lead Record" );
                  var leadRecord = nlapiCreateRecord('lead');
                  var clientName = retData[i].client_name;									
                  leadRecord.setFieldValue('accessrole',14);
                  leadRecord.setFieldValue('altname',retData[i].client_name);
                  leadRecord.setFieldValue('baserecordtype','lead');
                  leadRecord.setFieldValue('edition','US');
                  leadRecord.setFieldValue('currency',1);
                  leadRecord.setFieldValue('phone',clientphone);
                  leadRecord.setFieldValue('entitystatus',6);
                  leadRecord.setFieldValue('entitytitle',retData[i].client_name);
                  leadRecord.setFieldValue('firstname',fname);
                  //Added by ajay 28Nov 2016
                  if( lname == "" || lname == null)
                  {
                    lname = "Setster";
                  }
                  //Ended
                  leadRecord.setFieldValue('lastname',lname);
                  leadRecord.setFieldValue('leadsource',102876);
                  leadRecord.setFieldValue('monthlyclosing',31);
                  leadRecord.setFieldValue('custentity21',"New lead created from Setster App");
                  leadRecord.setFieldValue('email',retData[i].client_email);
                  leadRecord.setFieldValue('custentity107',AttributionPath); //Attribution Path	

                  // Begin Update 02/18/2016 "First Click Field" and  "wurfl"
                  FirstClickdate= FirstClickdate.replace(/(\d\d\d\d)(\d\d)(\d\d)/g, '$2/$3/$1');
                  if(Wurflis_mobile='false'){Wurflis_mobile='F'}else{Wurflis_mobile='T'}

                  leadRecord.setFieldValue('custentity11',FirstClickgclid); //gclid	
                  leadRecord.setFieldValue('custentity7',FirstClicksource); //source
                  leadRecord.setFieldValue('custentity6',FirstClickcampaign); //campaign
                  leadRecord.setFieldValue('custentity9',FirstClickmedium); //medium
                  leadRecord.setFieldValue('custentity8',FirstClickkeyword); //keyword	
                  leadRecord.setFieldValue('custentity10',FirstClickcontent); //content
                  leadRecord.setFieldValue('custentity125',FirstClickdate); //date == Date Format (MM/DD/YYYY)
                  leadRecord.setFieldValue('custentity108',Wurflis_mobile); //is_mobile == Bool Value 	
                  leadRecord.setFieldValue('custentity105',Wurflcomplete_device_name); //complete_device_name 	
                  leadRecord.setFieldValue('custentity106',Wurflform_factor); //form_factor 							
                  // End Update 02/18/2016 "First Click Field" and  "wurfl"							
                  //Added by ajay 13May 2016
                  var mobileAppt = custData[8];
                  if(mobileAppt != null)
                  {
                    if(mobileAppt[0] == "Yes")
                    {
                      leadRecord.setFieldValue('custentity130','T'); 
                    }
                    else if(mobileAppt[0] == "No")
                    {
                      leadRecord.setFieldValue('custentity130','F'); 
                    }
                  }//Ended by ajay						
                  var leadId = nlapiSubmitRecord(leadRecord, true, true);
                  nlapiLogExecution("DEBUG","Lead ID:",leadId );

                  var obj_data={
                    stTime:stTime,
                    edTime:edTime,
                    startDate:startDate,
                    endDate:endDate,                                                                                 
                    note:retData[i].note,
                    type:retData[i].type,
                    location_name:retData[i].location_name,
                    location_id:retData[i].location_id,
                    id:retData[i].id,
                    client_email : retData[i].client_email,
                    clientphone : clientphone    
                  }								
                  Create_Appointment(leadId,obj_data,token)
                  Schedule_lead_run=true;	
                }
              }
            }
          }
        }
        if (nlapiGetContext().getRemainingUsage() <= 500){
          nlapiLogExecution('debug', 'nlapiGetContext().getRemainingUsage()', nlapiGetContext().getRemainingUsage());
          var stateMain = nlapiYieldScript(); 
          if( stateMain.status == 'FAILURE'){ 
            nlapiLogExecution("debug","Failed to yield script (do-while), exiting: Reason = "+ stateMain.reason + " / Size = "+ stateMain.size); 
            throw "Failed to yield script"; 
          } 
          else if ( stateMain.status == 'RESUME' ){ 
            nlapiLogExecution("debug", "Resuming script (do-while) because of " + stateMain.reason+". Size = "+ stateMain.size); 
          } 
        } 
      }
      catch(error)
      {
        nlapiLogExecution("debug","Error occur during syncing from setster to NS is : ",error.message);  
        continue;
      }  		 
    }
  }
  catch(err)
  {
    nlapiLogExecution("error","Error handling during execution of script is : ",err.message);  
  }

  if(Schedule_lead_run)
  {
    try{
      var params = new Array();
      params['status'] = 'scheduled';
      params['runasadmin'] = 'T';
      var startDate = new Date();
      params['startdate'] = startDate.toUTCString();
      nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 22");
      nlapiScheduleScript('customscript_value_assign_lead', 'customdeploy_value_assign_lead', params);
      nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 23");

    }
    catch(er){}
  }
  else
  {
    nlapiLogExecution("DEBUG","No Appointment Record Created");

  }
}

function Create_Appointment(leadId,obj_data,token)
{				
  //nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 2");
  nlapiLogExecution("DEBUG", "JSON Obj Data", JSON.stringify(obj_data));
  var retData_startDate=obj_data.startDate;
  var retData_endDate=obj_data.endDate;
  var retData_note=obj_data.note;
  var retData_type=obj_data.type;
  var retData_location_name=obj_data.location_name;
  var retData_location_id=obj_data.location_id;
  var stTime=obj_data.stTime;
  var edTime=obj_data.edTime;
  var retData_id=obj_data.id;
  var customerEmail = obj_data.client_email;//[ns-1171]
  //var Lead_data=nlapiLookupField('lead',leadId, ['altname','email','phone']);
  var Lead_data=nlapiLookupField('customer',leadId, ['altname','email','phone']);
  //var customerEmail =Lead_data['email'];		
  var customerPhone = obj_data.clientphone;	
  // [NS-1284]	commented below old logic due to which customer phone was not syncing in NS.
  //var customerPhone = Lead_data['phone'];	 
  var apptTitle=Lead_data['altname'] + "-" + retData_type;
  //nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 3");
  try
  {
    var appointmentRecord = nlapiCreateRecord('calendarevent');
    appointmentRecord.setFieldValue('custeventappointment_instructions','');
    appointmentRecord.setFieldValue("company",leadId); //leadId  
    appointmentRecord.setFieldValue('custevent_customer_email',customerEmail);
    appointmentRecord.setFieldValue('custevent_customer_phone_number',customerPhone);												
    appointmentRecord.setFieldValue('title',apptTitle);
    appointmentRecord.setFieldValue('startdate',retData_startDate);
    appointmentRecord.setFieldValue('enddate',retData_endDate);
    appointmentRecord.setFieldValue('calendardate',retData_startDate);
    appointmentRecord.setFieldValue('timedevent','T');
    appointmentRecord.setFieldValue('accesslevel','PUBLIC');
    appointmentRecord.setFieldValue('custevent_created_in_setster','T');
    appointmentRecord.setFieldValue('custevent_general_notes',retData_note);
    appointmentRecord.setFieldValue('custevent_appointment_total_budget','');
    // nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 4");
    if(retData_type=="Engagement Ring")
    {
      appointmentRecord.setFieldValue('custevent_appointment_jewelry_type',2);
      appointmentRecord.setFieldValue('custevent_appointment_type',22);
      appointmentRecord.setFieldValue("customform",46);  
      appointmentRecord.setFieldValue('custevent_appointment_timeframe','PLEASE UPDATE');
      // nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 5");

    }
    else if(retData_type=="Wedding Band")
    {
      appointmentRecord.setFieldValue('custevent_appointment_jewelry_type',3);
      appointmentRecord.setFieldValue("custevent_appointment_type",21);
      appointmentRecord.setFieldValue("customform",46);  
      appointmentRecord.setFieldValue('custevent_appointment_timeframe','PLEASE UPDATE');
      //nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 6");
    }
    else if(retData_type=="Vintage &amp; Fine Jewelry")
    {
      appointmentRecord.setFieldValue('custevent_appointment_jewelry_type',9);
      appointmentRecord.setFieldValue("custevent_appointment_type",35);
      appointmentRecord.setFieldValue("customform",46);  
      appointmentRecord.setFieldValue('custevent_appointment_timeframe','PLEASE UPDATE');
      // nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 7");

    }
    else if(retData_type=="Service")
    {
      appointmentRecord.setFieldValue('custevent_appointment_jewelry_type',9);
      appointmentRecord.setFieldValue("custevent_appointment_type",37);
      appointmentRecord.setFieldValue("customform",90);  
      appointmentRecord.setFieldValue('custevent_appointment_timeframe','');
      // nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 8");

    }
    else if(retData_type=="Service - Pick Up") // Service - Drop Off(28), Service - Pick Up(Appt type-2)
    {
      appointmentRecord.setFieldValue('custevent_appointment_jewelry_type',9);
      appointmentRecord.setFieldValue("custevent_appointment_type",2);
      appointmentRecord.setFieldValue("customform",90);  
      appointmentRecord.setFieldValue('custevent_appointment_timeframe','');
      //nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 9");

    }
    else if(retData_type=="Service - Drop Off") 
    {
      appointmentRecord.setFieldValue('custevent_appointment_jewelry_type',9);
      appointmentRecord.setFieldValue("custevent_appointment_type",28);
      appointmentRecord.setFieldValue("customform",90);  
      appointmentRecord.setFieldValue('custevent_appointment_timeframe','');
      // nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 10");

    }
    else if(retData_type=="Other")
    {
      appointmentRecord.setFieldValue('custevent_appointment_jewelry_type',9);
      appointmentRecord.setFieldValue("custevent_appointment_type",36);
      appointmentRecord.setFieldValue("customform",46);  
      appointmentRecord.setFieldValue('custevent_appointment_timeframe','PLEASE UPDATE');
      //nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 11");

    }
    //nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 12");
    appointmentRecord.setFieldValue('organizer',7820);   
    //nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 13");
    switch(retData_location_id) 
    {
      case '20677':  //San Francisco
        appointmentRecord.setFieldValue('custevent_calendar_location',1);
        break;
      case '20611':  //Los Angeles
        appointmentRecord.setFieldValue('custevent_calendar_location',2);
        break;
      case '22671':  //Boston
        appointmentRecord.setFieldValue('custevent_calendar_location',3);
        break;
      case '23584':  //Chicago
        appointmentRecord.setFieldValue('custevent_calendar_location',4);
        break;
      case '23815':  //San Diego
        appointmentRecord.setFieldValue('custevent_calendar_location',5);
        break;
      case '23820':  //Washington DC
        appointmentRecord.setFieldValue('custevent_calendar_location',6);
        break;	
      case '24223':  //Denver
        appointmentRecord.setFieldValue('custevent_calendar_location',7);
        break;			
      default:
        break;
    }
    //nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 14");
    appointmentRecord.setFieldValue('starttime',stTime);
    appointmentRecord.setFieldValue('endtime',edTime);
    appointmentRecord.setFieldValue('custevent_setsterappid',retData_id);
    //nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 15");
    var apptmtId = nlapiSubmitRecord(appointmentRecord, true, true);
    nlapiLogExecution("debug","New Created Appt Id is :",apptmtId);
    if(apptmtId)
    {					
      var update_obj_data={
        appointment_id:apptmtId,
        altname:Lead_data['altname'],
        type:retData_type                            
      }			
      //nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 16");
      // nlapiSubmitField ( 'lead' , leadId , 'custentity_set_setster_data' ,JSON.stringify(update_obj_data) , true ) ;
      nlapiSubmitField('customer' , leadId , ['custentity_set_setster_data','custentity_email_status'] ,[JSON.stringify(update_obj_data),9], true) ; // new code by [NS-1171]
      // nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 17");

      var dataToSend = {"ews_id":  apptmtId};    
      var jsData = {data: JSON.stringify(dataToSend)};
      var response1 = nlapiRequestURL('https://www.setster.com/api/v2/appointment/'+ retData_id +'?session_token='+token, jsData, 'application/json', 'PUT');

      nlapiLogExecution("debug","Response 1 Code",response1.getCode());
      nlapiLogExecution("debug","Response 1 Body",response1.getBody());
      // nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 18");
      if(response1.getCode()=="401")
      {
        var newToken = Setster_Auth();

        response1 = nlapiRequestURL('https://www.setster.com/api/v2/appointment/'+ retData_id +'?session_token='+newToken, jsData, 'application/json', 'PUT');
        nlapiLogExecution("debug","Response Code (After Refresh)",response1.getCode());
        nlapiLogExecution("debug","Response Body (After Refresh)",response1.getBody());
      }

      var responsebody1 = JSON.parse(response1.getBody()) ;
      var retData1 = responsebody1['data'];
      var responseData1 = responsebody1.statusDescription;
      //nlapiLogExecution("DEBUG", "Create Appointment Information", "Step 19");
      //added by Priti on 2018-07-20
      SendMailToCustomer(apptmtId,retData_id);

    }

  }
  catch(e)
  {
    nlapiLogExecution("error","Error Handling Appointment Conflict","Details: " + e.message);
  }

}



function CheckAppointmentCreationByLocation(dayOfWeek,location)
{
  var locArr = ['1','2','3','4','5','6','7'];
  var index = locArr.indexOf(location);
  if(index > -1)
  {
    return true;
  }
}


function SendErrorMail(name,type,location,startDate,stTime,edTime)
{
  var subject = "NetSuite Sync Error";
  var toEmail = 'setster@brilliantearth.com';
  //var userid = nlapiLookupField("employee", nlapiGetUser(), "entityid");		
  var body = '<table>';
  //body += '<tr><td><b>User Name : </b></td><td>'+userid+'</td></tr>';
  body += '<tr><td width="20%"><b>Customer Name : </b></td><td>'+name+'</td></tr>';
  body += '<tr><td><b>Appointment Type : </b></td><td>'+type+'</td></tr>';
  body += '<tr><td><b>Calendar Location : </b></td><td>'+location+'</td></tr>';		
  body += '<tr><td><b>Start Date : </b></td><td>'+startDate+'</td></tr>';		
  body += '<tr><td><b>Start Time : </b></td><td>'+stTime+'</td></tr>';		
  body += '<tr><td><b>End Time : </b></td><td>'+edTime+'</td></tr>';		
  body += '<tr><td colspan="2"><b>Your appointment may not have synced with NetSuite. Please contact your NetSuite admin asap. </b></td></tr>';		
  body += '</table>';			
  nlapiSendEmail( 1007557, toEmail, subject, '<html><body style="font-family:Verdana">'+body+'</body></html>',null,null,null,null );
  nlapiLogExecution('debug','Sync Error from Setster to NetSuite and email send to :', toEmail);
}

function replacer(key, value)
{
  if (typeof value == "number" && !isFinite(value))
  {
    return String(value);
  }
  return value;
}

function SendMailToCustomer(apptId,setsId) {
  try {       

    //get newly created appointment 
    var newAppointment= nlapiLoadRecord('calendarevent',apptId);
    nlapiLogExecution('DEBUG', '<NetSuite Appointment> Id:' + apptId);
    nlapiLogExecution('DEBUG', '<Setster Appointment> Id:' + setsId);
    var customerMail = newAppointment.getFieldValue("custevent_customer_email");
    var apptDate=newAppointment.getFieldValue("startdate");
    var dateString = new Date(apptDate).toUTCString();
    dateString = dateString.split(' ').slice(0, 4).join(' ');
    var apptTime=newAppointment.getFieldValue("starttime");
    var apptType=newAppointment.getFieldValue("custevent_appointment_type");
    var calendarloc=newAppointment.getFieldValue("custevent_calendar_location");
    var calendarloctext=newAppointment.getFieldText("custevent_calendar_location");
    var regExp = /\(([^)]+)\)/;
    var matches = regExp.exec(calendarloctext);
    if(matches){
      calendarloctext=matches[1];
    }
    var timesufix;
    if(calendarloc==3 ||calendarloc==6){
      timesufix="ET";
    }
    else if(calendarloc==4){
      timesufix="CT";
    }
    else if(calendarloc==7){
      timesufix="MT";
    }
    else{
      timesufix="PT";
    }
    apptTime=apptTime+" "+timesufix;
    //get session token
    var token = nlapiLookupField("customrecord_setster_authentication", "1", "custrecord_setster_auth_session_token");
    nlapiLogExecution('debug','customerMail is',customerMail);
    nlapiLogExecution('debug','token value is',token);
    var hash = nlapiRequestURL('https://www.setster.com/api/v2/appointment/hash?appointment_id=' + setsId + '&session_token=' + token + '&hash_type=reschedule','GET');
    nlapiLogExecution('debug','Reschedule Hash URL',hash);
    nlapiLogExecution('debug','hash data',hash.getBody());
    var hashdata = JSON.parse(hash.getBody());
    var hashnum_reschedule = hashdata['data'];
    nlapiLogExecution('debug','Reschedule Hash Number',hashnum_reschedule);
    var cancelhash = nlapiRequestURL('https://www.setster.com/api/v2/appointment/hash?appointment_id=' + setsId + '&session_token=' + token + '&hash_type=cancel','GET');
    nlapiLogExecution('debug','Reschedule Hash URL',cancelhash);
    nlapiLogExecution('debug','hash data',cancelhash.getBody());
    var cancelhashdata = JSON.parse(cancelhash.getBody());
    var hashnum_cancel = cancelhashdata['data'];
    nlapiLogExecution('debug','Cancel Hash Number',hashnum_cancel);

    if (customerMail) {
      var companyId = newAppointment.getFieldValue("company");
      var companyFName = nlapiLookupField('customer', companyId, 'firstname');              
      var linkReschedule = "https://brilliantearth.setster.com/?id=" + setsId + "&h=" + hashnum_reschedule + "&act=reschedule";
      nlapiLogExecution('debug','Reschedule Link',linkReschedule);
      var linkCancel = "https://brilliantearth.setster.com/widget/cancel_appointment.php?id=" + setsId + "&h=" + hashnum_cancel;
      nlapiLogExecution('debug','Cancel Link',linkCancel);
      var linkShare="https://www.brilliantearth.com/appointment-preferences/";
      var bodyMsg;
      if(apptType==2 || apptType==28){
        bodyMsg="Hi " + companyFName + "," + "<p>Thank you for scheduling an appointment with Brilliant Earth! Your appointment is scheduled for "+dateString+" at "+apptTime+" in "+calendarloctext+". <p>We look forward to your visit!<br>-Brilliant Earth Team<p>Other Inquiries?<br><a href=" + linkCancel + ">Cancel</a> this appointment<br>Please call us at 800-691-0952 with any questions or to make changes to your appointment.";
      }
      else{
        bodyMsg="Hi " + companyFName + "," + "<p>Thank you for scheduling an appointment with Brilliant Earth! Your appointment is scheduled for "+dateString+" at "+apptTime+" in "+calendarloctext+". If you have not already done so, please <a href= "+linkShare+">share</a> your jewelry preferences. This will enable us to provide you with the best possible experience at your upcoming appointment.<p>We look forward to your visit!<br>-Brilliant Earth Team<p>Other Inquiries?<br><a href=" + linkCancel + ">Cancel</a> this appointment<br>Please call us at 800-691-0952 with any questions or to make changes to your appointment.";

      }
      //nlapiSendEmail(20561, customerMail, "Your Brilliant Earth Appointment Request", bodyMsg);
      nlapiSendEmail(20561, "eito@brilliantearth.com", "Your Brilliant Earth Appointment Request", bodyMsg,null,null,null,null,true);
      //nlapiSendEmail(20561, "eaito0916@gmail.com", "Your Brilliant Earth Appointment Request", bodyMsg,null,null,null,null,true);

      nlapiLogExecution("debug", "Mail sent to " + customerMail);
    }

  } catch (ex) {
    nlapiLogExecution("DEBUG", "Error", ex.message);
  }
}

