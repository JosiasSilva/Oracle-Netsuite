nlapiLogExecution("audit","FLOStart",new Date().getTime());
function CreateAppointmentFromNetsuiteToSetster()
{

  var currentDateTime = new Date(); //Date to use as search filter
  var currentStartDate = nlapiDateToString(currentDateTime, 0);
  var nextYearEndDate = nlapiDateToString(nlapiAddMonths(currentDateTime,24));

   try {
       var location = new Array();
        location[0]='1';
        location[1]='2';
        var filters = new Array();
        filters[0] = new nlobjSearchFilter('startdate', null, 'within', currentStartDate, nextYearEndDate);
        filters[1] = new nlobjSearchFilter('custevent_calendar_location', null, 'is', location);		 
	var columns = new Array(); // new array for columns of the search
	columns[0] = new nlobjSearchColumn('internalid');
					 
	var SavedSearch = nlapiSearchRecord('calendarevent', null, filters, columns);
        nlapiLogExecution("DEBUG", "Total No of Appointments : ", SavedSearch.length);	
	if(SavedSearch != null)
	{
             for(var i=0; i< SavedSearch.length; i++)
             {
                var SearchResult = SavedSearch[i];
                var internalId = SearchResult.getValue(columns[0]);
                CreateAppointmentToSetster(internalId);
		nlapiLogExecution("DEBUG", "Appointment InternalId : ", internalId);		
             }                                  
	}
     }
     catch (e) {
         nlapiLogExecution("DEBUG", "Error Code : " + e.getCode());
      }

}


function CreateAppointmentToSetster(Id)
 {
    
    var custeventsetsterappid=0;
    var orderObj = nlapiLoadRecord('calendarevent',Id);
    var selectedDate = orderObj.getFieldValue('startdate');         
    var customform = orderObj.getFieldValue('customform');  
    var appointmentType = orderObj.getFieldValue('custevent_appointment_type');  
    custeventsetsterappid= orderObj.getFieldValue('custevent_setsterappid');  
     var Customer_email = orderObj.getFieldValue('custevent_customer_email');
     var Customer_Phone =  orderObj.getFieldValue('custevent_customer_phone_number');
     var custevent_general_notes = orderObj.getFieldValue('custevent_general_notes'); 
     var selectedTime = orderObj.getFieldValue('starttime');
     var customerId  =   orderObj.getFieldValue('company');    
     var varcustomer_address = orderObj.getFieldValue('defaultaddress');
     var calendarlocation = orderObj.getFieldValue('custevent_calendar_location');
     
     var retAppVal = CheckTimeProviderAvailability(customform,appointmentType,calendarlocation,selectedDate,selectedTime);
    if(retAppVal  && (custeventsetsterappid == 0 || custeventsetsterappid == null))
     { 
   
             var locationid = '';
             var serviceid = '';
              if( orderObj.getFieldValue('custevent_calendar_location')== 1)
              {
                   locationid = '20677';
                   nlapiLogExecution("debug","San Francisco", "20677" );

                if(customform == 46)
                {
                   serviceid = GetServiceId( serviceid , appointmentType , customform);
                   nlapiLogExecution("debug","customform : ", customform);
                   nlapiLogExecution("debug","serviceid : ", serviceid);
                  
                   InsertDataToSetster(Id, serviceid , locationid , selectedDate , customerId , selectedTime , Customer_email , Customer_Phone , custevent_general_notes,varcustomer_address);
                }
                else if(customform == 42 || customform == 43 || customform == 90)
                {                    
                   serviceid = GetServiceId( serviceid , appointmentType , customform);
                   nlapiLogExecution("debug","customform : ", customform);
                   nlapiLogExecution("debug","serviceid : ", serviceid);
                  
                   InsertDataToSetster(Id, serviceid , locationid , selectedDate , customerId , selectedTime , Customer_email , Customer_Phone , custevent_general_notes,varcustomer_address);
                }
                else
                {
                   serviceid = '0';
                   nlapiLogExecution("debug","customform : ", customform);
                   nlapiLogExecution("debug","serviceid : ", serviceid);
                  
                   InsertDataToSetster(Id, serviceid , locationid , selectedDate , customerId , selectedTime , Customer_email , Customer_Phone , custevent_general_notes,varcustomer_address);
                }
             }
             else if( orderObj.getFieldValue('custevent_calendar_location')== 2)
             {
                   locationid = '20611';
                   nlapiLogExecution("debug","Los Angeles", "20611" );

                if(customform == 46)
                {
                  serviceid = GetServiceId( serviceid , appointmentType , customform);
                  nlapiLogExecution("debug","customform : ", customform);
                  nlapiLogExecution("debug","serviceid : ", serviceid);
                  
                  InsertDataToSetster(Id, serviceid , locationid , selectedDate , customerId , selectedTime , Customer_email , Customer_Phone , custevent_general_notes,varcustomer_address);
                }
                else if(customform == 42 || customform == 43 || customform == 90)
                {                   
                  serviceid = GetServiceId( serviceid , appointmentType , customform);
                  nlapiLogExecution("debug","customform : ", customform);
                  nlapiLogExecution("debug","serviceid : ", serviceid);
                 
                   InsertDataToSetster(Id, serviceid , locationid , selectedDate , customerId , selectedTime , Customer_email , Customer_Phone , custevent_general_notes,varcustomer_address);
                }
                else
                {
                  serviceid = '0';
                  nlapiLogExecution("debug","customform : ", customform);
                  nlapiLogExecution("debug","serviceid : ", serviceid);
                 
                   InsertDataToSetster(Id, serviceid , locationid , selectedDate , customerId , selectedTime , Customer_email , Customer_Phone , custevent_general_notes,varcustomer_address);
                }
           }
           else
           {
              serviceid = '0';
              locationid = '0';
              nlapiLogExecution("debug","customform : ", customform);

              InsertDataToSetster(Id, serviceid , locationid , selectedDate , customerId , selectedTime , Customer_email , Customer_Phone , custevent_general_notes,varcustomer_address);
           }
         }
         else
         {
              nlapiLogExecution("debug","The time slot is not available for appointment creation on setster. ", "");
         }        
    }

  function  InsertDataToSetster(Id, serviceid , locationid , selectedDate , customerId , selectedTime , Customer_email , Customer_Phone , custevent_general_notes,customer_address)
  {
        if(serviceid > 0)
        {                       
                              
                              nlapiLogExecution("debug","custevent_customer_email", Customer_email);                             
                              nlapiLogExecution("debug","custevent_general_notes", custevent_general_notes);
                              nlapiLogExecution("debug","Date", selectedDate);

var varDate = selectedDate;
var newDate = varDate.split('/');

var newTime = selectedTime.split(':');
var newminutes = newTime[1].split(' ');

if(newminutes[1] == 'pm' && newTime[0]== 12)
{
  newTime[0] =  newTime[0];
}
else if(newminutes[1] == 'pm' && newTime[0] < 12)
{
  newTime[0] = 12 + parseInt(newTime[0]);
}
else if(newminutes[1] == 'am' && newTime[0] == 12)
{
  newTime[0] = 12 - parseInt(newTime[0]);
}
else if(newminutes[1] == 'am' && newTime[0] < 12)
{
  newTime[0] = newTime[0];
}

//var retDate =  newDate[2] + '-' + newDate[0] + '-' + newDate[1] + ' 16:25:00';

var DateData = newDate[2] + '-' + GetValue(newDate[0]) + '-' + GetValue(newDate[1]);
var TimeData = GetValue(newTime[0]) + ':' + newminutes[0] +':00';

var retDate =  newDate[2] + '-' + GetValue(newDate[0]) + '-' + GetValue(newDate[1]) + ' ' + GetValue(newTime[0]) + ':' + newminutes[0] +':00';
nlapiLogExecution("debug","Date time : ", retDate);

nlapiLogExecution("debug","CustomerId : ", customerId);
var obj = nlapiLoadRecord('customer',  customerId);
var altname = obj.getFieldValue('altname');

//var varcustomer_address = obj.getFieldValue('defaultaddress');
nlapiLogExecution("debug","Address: ", customer_address);

  
var retval  = CheckAppointmentOnSetster(Id, Customer_email, locationid, DateData);
nlapiLogExecution("debug","CheckAppointmentOnSetster:  ", retval  );

if(retval)
{  
var dataToSend = {           
            "client_name"   :   altname,
            "client_email"  :   Customer_email,
            "location_id"   :   locationid,
            "service_id"    :   serviceid,
            "subservices"   :   "",
            "employee_id"   :   0,
            "start_date"    :   retDate,
            "client_address":   customer_address,
			"ews_id"		:   Id,
            "custom_fields":  {  "4": Customer_Phone, "5": Id},
            "note"          :   custevent_general_notes

        };    
            

var jsData= {data: JSON.stringify(dataToSend)};
var response = nlapiRequestURL('http://www.setster.com/api/v2/appointment/?session_token=c4fnfulqjurn5l3ac3sj9optu1', jsData, 'application/json', 'POST');
var responsebody = JSON.parse(response.getBody()) ;
var retData = responsebody['data'];
var responseData = responsebody.statusDescription;
nlapiLogExecution("debug","App. Created", responseData);
     }
    }
 } 



function GetServiceId(serviceid,appointmentType,customform)
{
       if( customform == 46)
       {
          if( appointmentType == 4 || appointmentType == 5 || appointmentType == 35 || appointmentType == 36)
          {
                 serviceid= '0';
                 nlapiLogExecution("debug","Serviceid : ", "0" );
          }
          else
          {
             if( appointmentType == 21)
             {
                 serviceid= '38221';
                 nlapiLogExecution("debug","Wedding Band", "38221" );          
             }             
             else
             {
                  serviceid = '38158';
                  nlapiLogExecution("debug","Engagement Ring", "38158" );
             }
          }
       }
       else if(customform == 42 || customform == 43 || customform == 90)
       {
          if( appointmentType == 4 || appointmentType == 5 )
          {
              serviceid= '0';
              nlapiLogExecution("debug","Serviceid : ", "0" );
          }
          else
          {
              serviceid = '38222';
              nlapiLogExecution("debug","Service", "38222" );
          }
       }
       else
       {
          serviceid = '0';                   
          nlapiLogExecution("debug","serviceid : ", "0");
       } 
          
     return serviceid;
}

function GetValue(val)
{
   var value=val;
   if (val < 10) {
    value = "0" + val;
    }
   return value;
}

function CheckAppointmentOnSetster(internalId, clientemail, locationid, date)
{
     var inputYear=date.split('-')[0];
     var inputMonth=date.split('-')[1];
     var inputDate=date.split('-')[2];
     var response ='';
     var responsebody = '';
     var retData = '';
   
      
	var a = {"User-Agent-x": "SuiteScript-Call"};   

        response =nlapiRequestURL('http://www.setster.com/api/v2/appointment/?session_token=c4fnfulqjurn5l3ac3sj9optu1&location_id='+locationid+'&client_email=' + clientemail + '&start_date='+date+'&end_date='+date+'',null, a, null);	
	responsebody = JSON.parse(response.getBody());
	retData = responsebody['data'];
                 
	if( retData.length ==0)
	{
              nlapiLogExecution("debug","App. Availabe ", retData.length );
	      return true;	
	}
	else
	{         
              //nlapiLogExecution("debug","App. Not Availabe ", retData.length );             
	      //return false;	

              if(retData.length > 0)
              {
                 for(var i=0; i<retData.length; i++)
                 {
                     var year = retData[i].start_date.split('-')[0];
     		     var month = retData[i].start_date.split('-')[1];
		     var day = retData[i].start_date.split('-')[2];
                     var Day = day.split(' ')[0];
					
		     if(year==inputYear && month== inputMonth && Day==inputDate)
		     {
				  if(retData[i].ews_id == internalId)
				  {
                    nlapiLogExecution("debug","App. Not Availabe ", retData.length );
							return false;
				  }
		     }
		     else
		     {
                           nlapiLogExecution("debug","App. Availabe ", retData.length );
		           return true;
		     }
                 }
              }                  
	}
}



//----------------------------------------time slot availability check-----------------

function CheckTimeProviderAvailability(customform,appointmentType,calendarlocation,selectedDate,selectedTime)
{
        try
         {
                 var locationid = '';
                 var serviceid = '';
                 //var customform = nlapiGetFieldValue("customform");
                 //var appointmentType = nlapiGetFieldValue("custevent_appointment_type");

                  if( calendarlocation == 1)
                 {
                           locationid = '20677';
                           nlapiLogExecution("debug","San Francisco", "" );

                            if(customform == 46)
                             {
                                   //serviceid= '38221';
                                  serviceid = GetServiceId(serviceid,appointmentType,customform);

                                  if(serviceid > 0)
                                  {
                                     return  TimeAvailable(serviceid,locationid,selectedTime,selectedDate);
                                  }
                                  else
                                  {
                                     return true;
                                  }
                             }
                             else if(customform == 42 || customform == 43 || customform == 90)
                             {
                                 //serviceid = '38222';
                                  serviceid = GetServiceId(serviceid,appointmentType,customform);
                                  
                                  if(serviceid > 0)
                                  {
                                     return  TimeAvailable(serviceid,locationid,selectedTime,selectedDate);
                                  }
                                  else
                                  {
                                     return true;
                                  }
                             }
                             else
                             {
                                  return true;
                             }
                 }
                else if( calendarlocation == 2)
                {
                           locationid = '20611';
                           nlapiLogExecution("debug","Los Angeles", "" );

                           if(customform == 46)
                             {
                                  //serviceid= '38221';
                                  serviceid = GetServiceId(serviceid,appointmentType,customform);

                                  if(serviceid > 0)
                                  {
                                     return  TimeAvailable(serviceid,locationid,selectedTime,selectedDate);
                                  }
                                  else
                                  {
                                     return true;
                                  }
                             }
                             else if(customform == 42 || customform == 43 || customform == 90)
                             {
                                  //serviceid = '38222';
                                  serviceid = GetServiceId(serviceid,appointmentType,customform);
                                  
                                  if(serviceid > 0)
                                  {
                                     return  TimeAvailable(serviceid,locationid,selectedTime,selectedDate);
                                  }
                                  else
                                  {
                                     return true;
                                  }
                             }
                             else
                             {
                                  return true;
                             }
                }
                else
                {
                   return true;
                }
         }
        catch(e)
         {                  
                  return false;
         }
}



function GetServiceId(serviceid,appointmentType,customform)
{
       if( customform == 46)
       {
          if( appointmentType == 4 || appointmentType == 5 || appointmentType == 35 || appointmentType == 36)
          {
                 serviceid= '0';                 
          }
          else
          {
             if( appointmentType == 21)
             {
                 serviceid= '38221';                        
             }             
             else
             {
                  serviceid = '38158';                  
             }
          }
       }
       else if(customform == 42 || customform == 43 || customform == 90)
       {
          if( appointmentType == 4 || appointmentType == 5 )
          {
              serviceid= '0';              
          }
          else
          {
              serviceid = '38222';              
          }
       }
       else
       {
          serviceid = '0';                             
       } 
          
     return serviceid;

}


function TimeAvailable(serviceid,locationid,getTime,getDate)
{
      //var getTime = nlapiGetFieldValue("starttime");
           
           var newTime = getTime.split(':');
           var newminutes = newTime[1].split(' ');
           
            if(newminutes[1] == 'pm' && newTime[0]== 12)
            {
                newTime[0] =  newTime[0];
            }
            else if(newminutes[1] == 'pm' && newTime[0] < 12)
            {
                newTime[0] = 12 + parseInt(newTime[0]);
            }
            else if(newminutes[1] == 'am' && newTime[0] == 12)
            {
               newTime[0] = 12 - parseInt(newTime[0]);
            }
            else if(newminutes[1] == 'am' && newTime[0] < 12)
            {
               newTime[0] = newTime[0];
            }

           var time = GetValue(newTime[0]) + ':' + newminutes[0] +':00';
           //var newdate = nlapiGetFieldValue("startdate").split('/');
           
           var newdate = getDate.split('/');
           var searchdate =newdate[2]+'-'+GetValue(newdate[0])+'-'+GetValue(newdate[1]);           
         
           var boolval=true;
                
           if(serviceid != '38222')
           {                    
                  boolval  =   GetSetsterAvailableTimeSlots(serviceid,locationid,searchdate,time);                   
                  return boolval;
            }
            else
             {                   
                  boolval  =  GetSetsterAvailableTimeSlots(serviceid,locationid,searchdate,time);                  
                  return boolval;
             } 
}


function GetSetsterAvailableTimeSlots(serviceid,locationid,searchdate,time)
 {      
       var a = {"User-Agent-x": "SuiteScript-Call"};
       var response =nlapiRequestURL('http://www.setster.com/api/v2/availability?session_token=c4fnfulqjurn5l3ac3sj9optu1&service_id='+serviceid+'&location_id='+locationid+'&start_date='+searchdate+'&return=times&t=daily', null, a, null);
          
           var responsebody = JSON.parse(response.getBody());                    
           var retData = responsebody['data'];            
           var retTimeSlots = retData['times'];                     
           var j = retTimeSlots[searchdate]; 
 
               var count =0;    
                   for(var i=0; i < j.length; i++)
                   {                               
                          if(j[i]==time)
                          {                                   
                                  nlapiLogExecution("debug","Time Availabe ", j[i] + " Availabe" );
                                  return true;
                                  break;
                          }
                        else
                         {
                              if(count == j.length-1)
                              {
                                   //alert('The Time and Provider are not available. Please select another time slot for available provider.');
                                   return false;
                               }
                              count=count+1;                                                      
                         }                         
                   }
}

//------------------------------Time slot check end-------------------