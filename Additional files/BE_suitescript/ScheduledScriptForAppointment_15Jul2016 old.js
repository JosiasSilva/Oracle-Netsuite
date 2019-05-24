var token = "b11485f945288e617bc193b11de82d0a";

function CreateAppointmentInNetsuite()
{
    try
    {
		var token = nlapiLookupField("customrecord_setster_authentication","1","custrecord_setster_auth_session_token");
		
	var a = {"User-Agent-x": "SuiteScript-Call"};
	//var sdate='2016-01-01'; 
  
	var today = new Date();	
	var date = today.toISOString().substring(0, 10);
  //  var date='2017-11-01';
	var response = nlapiRequestURL('https://www.setster.com/api/v2/appointment?session_token='+token+'&start_date='+date+'&end=0', null, a, null);

	var responsebody = JSON.parse(response.getBody()) ;
	var retData = responsebody['data'];
	nlapiLogExecution("DEBUG","Appointment Record : ","Details: " + retData.length);
        var name = "";
    for(var i=0; i<retData.length; i++)
    {
          try
          {
		var clientphone=00000000;
		
		/*// BEGIN Prevent to sync data to NS which already came from NS to SS -Amlesh 20/06/2015
		var custData=JSON.parse(retData[i].custom_fields);
		var Optional = custData[5];
		var SetsterAppID=0;
		if( Optional != null)
		{
			if(Optional[0] ==null || Optional[0] == '' || Optional[0] ==' ' ) 
			{
				SetsterAppID=0;
			}
			else{SetsterAppID=Optional[0];}
		}
		else{SetsterAppID=0;}
		
		// END Prevent to sync data to NS which already came from NS to SS */
		nlapiLogExecution("DEBUG","Created ID : ","Details: " + retData[i].id + "----" + i);
		nlapiLogExecution("DEBUG","Created Date At : ","Details: " + retData[i].created_at + "----" + i);
                nlapiLogExecution("DEBUG","Appointment service type is : ", retData[i].type + "----" + i);
        //if(retData[i].created_at.split(' ')[0] == date )
        //{
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

                               //niraj
                               if(fname1.length > 30)
                               {
                               fname = fname1.substring(0,30); 
                               }
                              else
                              { 
                               fname = fname1;
                              }
                              //niraj

			}
				lname1 = customerNameRecord[customerNameRecord.length-1];
                            
                               //niraj
                               if(lname1.length > 30)
                               {
                               lname = lname1.substring(0,30); 
                               }
                              else
                              { 
                               lname = lname1;
                              }
                              //niraj

			}
			else if(customerNameRecord.length < 2)
			{
				fname1 = customerNameRecord[customerNameRecord.length-1];

                                //niraj
                               if(fname1.length > 30)
                               {
                               fname = fname1.substring(0,30); 
                               }
                              else
                              { 
                               fname = fname1;
                              }
                              //niraj

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
          
                                // Amlesh for Phone (Optional)
				
                                                           /*     var custData=JSON.parse(retData[i].custom_fields);
								// Begin Update 02/18/2016 "First Click Field" and  "wurfl"
								var OptionalFirstClick = custData[6];
								var FirstClick=''; var FirstClickdate=''; var FirstClickcontent=''; var FirstClickkeyword=''; var FirstClickmedium=''; 
								var FirstClickcampaign=''; var FirstClicksource=''; var FirstClickgclid='';
								if(OptionalFirstClick  !=null  && OptionalFirstClick[0] != 'undefined'){FirstClick=OptionalFirstClick[0];
								var FirstClickValues = JSON.parse(FirstClick);
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

								//

								var OptionalWurfl = custData[7];
								var Wurfl='';var Wurflis_mobile=''; var Wurflcomplete_device_name=''; var Wurflform_factor='';
								if(OptionalWurfl  !=null  && OptionalWurfl[0] != 'undefined'){Wurfl=OptionalWurfl[0];
								var WurflValues = JSON.parse(Wurfl);
									if(WurflValues !=null)
									{
										Wurflis_mobile = WurflValues.is_mobile; // is_mobile ->custentity108 (Is Mobile)
										Wurflcomplete_device_name = WurflValues.complete_device_name; // complete_device_name ->custentity105 (Device Name)
										Wurflform_factor = WurflValues.form_factor; // form_factor ->custentity106 (Form Factor)
										nlapiLogExecution("DEBUG","Wurfl : ","Wurflis_mobile: " + Wurflis_mobile + ", Wurflcomplete_device_name:" + Wurflcomplete_device_name + ", Wurflform_factor:" + Wurflform_factor);
									}
								} */
								// End Update 02/18/2016 "First Click Field" and  "wurfl"

                                                        //Added by Ajay 02April 2016
                                                        
                                                                var custData=JSON.parse(retData[i].custom_fields);
								// Begin Update 02/18/2016 "First Click Field" and  "wurfl"
								var OptionalFirstClick = custData[6];
								var FirstClick=''; var FirstClickdate=''; var FirstClickcontent=''; var FirstClickkeyword=''; var FirstClickmedium=''; var parseFirstClick = null; 
								var FirstClickcampaign=''; var FirstClicksource=''; var FirstClickgclid='';
								
								if(OptionalFirstClick  !=null  && OptionalFirstClick[0] != 'undefined')
								{
									//nlapiLogExecution("debug","Optional First Click is :",OptionalFirstClick[0]);
									if(OptionalFirstClick[0] == '{' || OptionalFirstClick[0] == '[' || OptionalFirstClick[0] == '"' || OptionalFirstClick[0] == /\\/g || OptionalFirstClick[0] == 't')
									{OptionalFirstClick[0] = null;}
									if(OptionalFirstClick[0] != null)
									{
										FirstClick = OptionalFirstClick[0];
										//nlapiLogExecution("debug","FirstClick value is : ",FirstClick);
										FirstClick = JSON.stringify(OptionalFirstClick[0],replacer);									
										//nlapiLogExecution("debug","first click values zero is : ",FirstClick);
																				
										if(FirstClick != '[]')
										{
											var FirstClickValues= null;											
											//nlapiLogExecution("debug","First Click1 is :",FirstClick);
											if(parseFirstClick == null)
											{
												FirstClick = FirstClick.replace('","First Click"]',"").replace('["','').replace('"]','').replace(/\\/g,'').replace(',"First Click"]','').replace('[','').replace('"{','{').replace('}"','}').replace(',"First Click','');
												//nlapiLogExecution("debug","First Click2 is :",FirstClick);
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

								//

								var OptionalWurfl = custData[7];
								var Wurfl='';var Wurflis_mobile=''; var Wurflcomplete_device_name=''; var Wurflform_factor='';
								var parseWurfl = null;
								if(OptionalWurfl  !=null  && OptionalWurfl[0] != 'undefined')
								{
									//nlapiLogExecution("debug","Optional Wurfl is :",OptionalWurfl[0]);
									if(OptionalWurfl[0] == 't' || OptionalWurfl[0] == 'f' || OptionalWurfl[0] == '{' || OptionalWurfl[0] == '"\"' || OptionalWurfl[0] == ' ')
									{ OptionalWurfl[0] = null;}
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

                                                       //Ended by Ajay
//var Optional = custData[4];
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
				if( retData[i].location_name == 'Los Angeles')
				{
				  location = '2';
				}
				else if( retData[i].location_name == 'San Francisco')
				{
				  location = '1';
				}
				else if( retData[i].location_name == 'Boston')
				{
				  location = '3';
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

                 if( retData[i].location_name == 'Boston')
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
      
                                       // Filter Logics

					var filters = new Array();
					filters[0] = new nlobjSearchFilter('custevent_customer_email', null, 'is',retData[i].client_email);                
					//filters[1] = new nlobjSearchFilter('custevent_customer_phone_number', null, 'is', clientphone);
					filters[1] = new nlobjSearchFilter('startdate', null,'on', startDate);		
					filters[2] = new nlobjSearchFilter('custevent_calendar_location', null, 'is', location);
					if(type!=null && type!='')
						filters[3] = new nlobjSearchFilter('custevent_appointment_type', null, 'is', type);
							 
					nlapiLogExecution("DEBUG", "Filters Values : ", retData[i].client_email);
					 
					var columns = new Array(); // new array for columns of the search
					columns[0] = new nlobjSearchColumn('internalid');
					 
					var SavedSearch = nlapiSearchRecord('calendarevent', null, filters, columns);
					if(SavedSearch != null)
					{
						nlapiLogExecution("DEBUG", "Total No of match appointments : ", SavedSearch.length);		
                                                var Id = SavedSearch[SavedSearch.length-1].getValue('internalid');
                                                nlapiLogExecution("DEBUG", "Match appointments internalId : ", Id);                                    
					}
	                               else
                                       {
       					 /*       // GET Customer Record
						var customerId;
						var fldMap = new Array();
						var email = retData[i].client_email;
						fldMap['email'] = email;
						var duplicateRecords = nlapiSearchDuplicate( 'customer', fldMap );

						if(duplicateRecords!=null)
						{
							nlapiLogExecution("DEBUG", "Duplicate Customer: ", duplicateRecords[0]);
							customerId = duplicateRecords[0];
						}
						else
						{	var customerRecord = nlapiCreateRecord('customer');
							customerRecord.setFieldValue('autoname','T');
							customerRecord.setFieldValue('firstname',fname);
							customerRecord.setFieldValue('lastname',lname);
							customerRecord.setFieldValue('currency',1);
							customerRecord.setFieldValue('entitystatus',13);
							customerRecord.setFieldValue('entitytitle',retData[i].client_name);
							customerRecord.setFieldValue('altname',retData[i].client_name);
						        customerRecord.setFieldValue('email',retData[i].client_email);
						        customerRecord.setFieldValue('phone',clientphone);
							//customerRecord.setFieldValue('datecreated',startDate + ' ' + stTime);						  
							
							customerId = nlapiSubmitRecord(customerRecord, true, true);
							nlapiLogExecution("DEBUG", "New Customer: ", customerId);
					    }
                         
					    // ended
				        */
							// Create Lead Record
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
				   
						   // ended							

							
							// Create Appointment Record
							var appointmentTitle = retData[i].client_name;
							var customerEmail = retData[i].client_email;
							var customerPhone = clientphone;
							try
							{
								var appointmentRecord = nlapiCreateRecord('calendarevent');

								appointmentRecord.setFieldValue('custeventappointment_instructions','');

								//appointmentRecord.setFieldValue("company",customerId.id); //customerId   
								appointmentRecord.setFieldValue("company",leadId); //leadId   

								appointmentRecord.setFieldValue('custevent_customer_email',customerEmail);
								appointmentRecord.setFieldValue('custevent_customer_phone_number',customerPhone);
                                                                
                                                                //new code added for title
                                                                var leadObj = nlapiLoadRecord('lead',leadId);
                                                                //var name = leadObj.getFieldValue('altname');
                                                                name = leadObj.getFieldValue('altname');
                                                                var salesRep = leadObj.getFieldValue('salesrep');
                                                                var empObj = nlapiLoadRecord('employee',salesRep);
                                                                var salesRepName = empObj.getFieldValue('entityid');
                                                                var apptTitle = name + "-" + salesRepName + "-" + retData[i].type;
                                                                
                                                                appointmentRecord.setFieldValue('title',apptTitle);

								//appointmentRecord.setFieldValue('title','&nbsp;');
								appointmentRecord.setFieldValue('startdate',startDate);
								appointmentRecord.setFieldValue('enddate',endDate);
								appointmentRecord.setFieldValue('calendardate',startDate);
								appointmentRecord.setFieldValue('timedevent','T');
								appointmentRecord.setFieldValue('accesslevel','PUBLIC');
								appointmentRecord.setFieldValue('custevent_general_notes',retData[i].note);
								appointmentRecord.setFieldValue('custevent_appointment_total_budget','');

 
									if(retData[i].type=="Engagement Ring")
									{
									  appointmentRecord.setFieldValue('custevent_appointment_jewelry_type',2);
									  appointmentRecord.setFieldValue('custevent_appointment_type',22);
									  appointmentRecord.setFieldValue("customform",46);  
									  appointmentRecord.setFieldValue('custevent_appointment_timeframe','PLEASE UPDATE');
									  
									}
									else if(retData[i].type=="Wedding Band")
									{
									  appointmentRecord.setFieldValue('custevent_appointment_jewelry_type',3);
									  appointmentRecord.setFieldValue("custevent_appointment_type",21);
									  appointmentRecord.setFieldValue("customform",46);  
									  appointmentRecord.setFieldValue('custevent_appointment_timeframe','PLEASE UPDATE');
									  
									}
									else if(retData[i].type=="Vintage &amp; Fine Jewelry")
									{
									  appointmentRecord.setFieldValue('custevent_appointment_jewelry_type',9);
									  appointmentRecord.setFieldValue("custevent_appointment_type",35);
									  appointmentRecord.setFieldValue("customform",46);  
									  appointmentRecord.setFieldValue('custevent_appointment_timeframe','PLEASE UPDATE');
									  
									}
									else if(retData[i].type=="Service")
									{
									  appointmentRecord.setFieldValue('custevent_appointment_jewelry_type',9);
									  appointmentRecord.setFieldValue("custevent_appointment_type",37);
									  appointmentRecord.setFieldValue("customform",90);  
									  appointmentRecord.setFieldValue('custevent_appointment_timeframe','');
									  
									}
									else if(retData[i].type=="Other")
									{
									  appointmentRecord.setFieldValue('custevent_appointment_jewelry_type',9);
									  appointmentRecord.setFieldValue("custevent_appointment_type",36);
									  appointmentRecord.setFieldValue("customform",46);  
									  appointmentRecord.setFieldValue('custevent_appointment_timeframe','PLEASE UPDATE');
									  
									}
									//appointmentRecord.setFieldValue('custevent_appointment_sales_rep',2488599);
									appointmentRecord.setFieldValue('organizer',7820);

									if( retData[i].location_name == 'Los Angeles')
									{
									  appointmentRecord.setFieldValue('custevent_calendar_location',2);
									}
									else if( retData[i].location_name == 'San Francisco')
									{
									  appointmentRecord.setFieldValue('custevent_calendar_location',1);
									}
									else if( retData[i].location_name == 'Boston')
									{
									  appointmentRecord.setFieldValue('custevent_calendar_location',3);
									}
									// timedevent =='TRUE'
									appointmentRecord.setFieldValue('starttime',stTime);
									appointmentRecord.setFieldValue('endtime',edTime);
									appointmentRecord.setFieldValue('custevent_appt_taken_by',1007557);
                                    appointmentRecord.setFieldValue('custevent_setsterappid',retData[i].id);
									var apptmtId = nlapiSubmitRecord(appointmentRecord, true, true);
        
                                    if(apptmtId != null)
                                    {

                            
                                    //  BEGIN Maintain Internal Id of Netsuite app into Setster(ews_id)
                                                                        
                                    var dataToSend = {"ews_id":  apptmtId};    
                                    var jsData = {data: JSON.stringify(dataToSend)};
                                    var response1 = nlapiRequestURL('https://www.setster.com/api/v2/appointment/'+ retData[i].id +'?session_token='+token, jsData, 'application/json', 'PUT');
                                    var responsebody1 = JSON.parse(response1.getBody()) ;
                                    var retData1 = responsebody1['data'];
                                    var responseData1 = responsebody1.statusDescription;
                                    nlapiLogExecution("debug","Netsuite Internal Id has been stored", responseData1);
									//END
                                    }

                            }
                            catch(e)
                            {
                               nlapiLogExecution("error","Error Handling Appointment Conflict","Details: " + e.message);
                            }
                    }
	           // End Filter Logics
                }
                //End Filter logics of calendar location
	     }
	     //End Client Phone condition
          }
         //End status condition logic 
         }
	 catch(error)
	 {
                //SendErrorMail(name,retData[i].type,retData[i].location_name,startDate,stTime,edTime);
		//nlapiLogExecution("error","Error occur during syncing from setster to NS is : ",error.message);  
                nlapiLogExecution("debug","Error occur during syncing from setster to NS is : ",error.message);  
		continue;
	 }      
       }//End For loop
     }
     catch(err)
     {
	 nlapiLogExecution("error","Error handling during execution of script is : ",err.message);  
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
   else if(location == '1' || location == '3')
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
