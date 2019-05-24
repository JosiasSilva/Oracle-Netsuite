nlapiLogExecution("audit","FLOStart",new Date().getTime());
//  Update SS to NS

function UpdateAppointmentFromSetsterToNetsuite()
{
    try
    {
	var a = {"User-Agent-x": "SuiteScript-Call"};
	//var sdate='2016-01-01'; 
	var today = new Date();
	var date = today.toISOString().substring(0, 10);
	var response = nlapiRequestURL('https://www.setster.com/api/v2/appointment?session_token=b11485f945288e617bc193b11de82d0a&start_date='+date+'&end=0', null, a, null);

	var responsebody = JSON.parse(response.getBody()) ;
	var retData = responsebody['data'];
	nlapiLogExecution("DEBUG","Appointment Record : ","Details: " + retData.length);
	var clientphone=00000000;
	for(var i=0; i<retData.length; i++)
	{
		if(retData[i].client_id != null  && retData[i].last_updated.split(' ')[0] == date)
		{
			if((retData[i].status == 0 || retData[i].status == 2) &&  (retData[i].ews_id !=null  || retData[i].ews_id !=''))
			{
				try
				{
					var customerNameRecord = retData[i].client_name.split(' ');
					var fname='';
					var lname='';
					var location = '';
					var type = '';
					if(customerNameRecord.length >= 2)
					{     
						for(var k=0; k<customerNameRecord.length-1; k++)
						{
							fname += customerNameRecord[k]+' ';
						}
						lname = customerNameRecord[customerNameRecord.length-1];
					}
					else if(customerNameRecord.length < 2)
					{
						fname = customerNameRecord[customerNameRecord.length-1];
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
						default:
					}
					var custData=JSON.parse(retData[i].custom_fields);
					//var Optional = custData[4];
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
					if( retData[i].location_name == 'Los Angeles')
					{location = '2';}
					else if( retData[i].location_name == 'San Francisco')
					{
						location = '1';
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
							nlapiLogExecution("DEBUG", "Match appointment InternalId : ", retData[i].ews_id);
							var appObj = nlapiLoadRecord('calendarevent',retData[i].ews_id);
							appObj.setFieldValue('starttime',stTime);
							appObj.setFieldValue('endtime',edTime);
							appObj.setFieldValue('startdate',startDate);
                                                        appObj.setFieldValue('custevent_calendar_location',location);
                                                        appObj.setFieldValue('enddate',endDate);
						    var apptmtId = nlapiSubmitRecord(appObj, true, true);   
						    nlapiLogExecution("DEBUG", "Appointment has been updated. : ","");                      

					}
						// End Filter Logics
				}
					// End Filter Logic for calendar location
				
				catch(e)
				{
					nlapiLogExecution("error","Error Handling Appointment Conflict","Details: " + e.message);
				}
			}          
		}
	}
   }
   catch(err)
   {
	nlapiLogExecution("error","Error Handling During Execution Of Script is :",err.message);  
   }
}
function CheckAppointmentCreationByLocation(dayOfWeek,location)
{
	if(location == '2')
	{
		if(dayOfWeek == '2' || dayOfWeek == '3')
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	else if(location == '1')
	{
		return true;
	}
}
